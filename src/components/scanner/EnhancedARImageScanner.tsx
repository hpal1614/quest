'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface EnhancedARImageScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  /** Path to MindAR image target (.mind) in public/, e.g. /assets/targets/postcard.mind */
  targetSrc?: string;
  /** Code to emit when image target is found; should match a quest location code */
  markerCode?: string;
  /** Quest theme for mascot customization */
  questTheme?: {
    icon: string;
    color: string;
    gradient: string;
  };
}

/**
 * Enhanced AR Image Scanner - Combines Vision AR Demo with Quest Integration
 * - Uses MindAR + Three.js for true AR experience
 * - Loads 3D models (Rooey, Griffin, Burj Khalifa)
 * - Integrates with quest system
 * - Maintains camera view during interaction
 * - Provides fallback to simple detection if AR fails
 */
export function EnhancedARImageScanner({ 
  onScan, 
  onClose, 
  targetSrc = '/assets/targets/postcard.mind', 
  markerCode = 'MARKER-FOUND',
  questTheme
}: EnhancedARImageScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [isARActive, setIsARActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [arState, setArState] = useState<'loading' | 'ready' | 'tracking' | 'error'>('loading');

  // AR state refs
  const mindarThreeRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const anchorRef = useRef<any>(null);
  const modelsRef = useRef<{
    burjModel?: any;
    griffinGroup?: any;
    rooeyGroup?: any;
  }>({});

  useEffect(() => {
    let isCancelled = false;
    
    const initializeAR = async () => {
      try {
        if (!containerRef.current) return;

        // Dynamic imports for CDN libraries
        const threeUrl = 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js';
        const mindarUrl = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js';
        const gltfLoaderUrl = 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/loaders/GLTFLoader.js';

        const [threeMod, mindarMod, gltfLoaderMod] = await Promise.all([
          (Function('u', 'return import(u)'))(threeUrl),
          (Function('u', 'return import(u)'))(mindarUrl),
          (Function('u', 'return import(u)'))(gltfLoaderUrl)
        ]);

        const { MindARThree } = mindarMod;
        const { GLTFLoader } = gltfLoaderMod;

        // Initialize MindAR
        mindarThreeRef.current = new MindARThree({ 
          container: containerRef.current, 
          imageTargetSrc: targetSrc 
        });
        
        const { renderer, scene, camera } = mindarThreeRef.current;
        rendererRef.current = renderer;
        sceneRef.current = scene;
        cameraRef.current = camera;
        anchorRef.current = mindarThreeRef.current.addAnchor(0);

        // Add lighting
        const hemiLight = new threeMod.HemisphereLight(0xffffff, 0x444444, 0.6);
        scene.add(hemiLight);
        const dirLight = new threeMod.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(0.5, 1, 0.5);
        scene.add(dirLight);

        // Load 3D models
        await loadModels(threeMod, GLTFLoader);

        // Set up target detection
        setupTargetDetection();

        // Start AR
        await mindarThreeRef.current.start();
        
        // Start render loop
        startRenderLoop(threeMod);

        setArState('ready');
        setIsStarting(false);
        setIsARActive(true);

      } catch (err) {
        console.error('AR initialization failed:', err);
        
        // Provide more specific error messages
        if (err instanceof Error) {
          if (err.message.includes('NotAllowedError') || err.message.includes('Permission denied')) {
            setError('Camera permission denied. Please allow camera access and refresh.');
          } else if (err.message.includes('NotReadableError') || err.message.includes('Could not start video source')) {
            setError('Camera is in use by another app. Please close other camera apps and refresh.');
          } else if (err.message.includes('NotSupportedError') || err.message.includes('HTTPS')) {
            setError('AR requires HTTPS. Please use QR mode or deploy with HTTPS.');
          } else {
            setError(`AR failed: ${err.message}. Try QR mode or mock mode.`);
          }
        } else {
          setError('Failed to start AR. Try QR mode (?qr=true) or mock mode (?mock=true).');
        }
        
        setArState('error');
        setIsStarting(false);
      }
    };

    const loadModels = async (threeMod: any, GLTFLoader: any) => {
      const gltfLoader = new GLTFLoader();
      
      try {
        // Load Rooey (main mascot)
        const rooeyGltf = await gltfLoader.loadAsync('/assets/targets/Rooey.glb');
        const rooey = rooeyGltf.scene;
        
        // Scale and position Rooey
        const bbox = new threeMod.Box3().setFromObject(rooey);
        const height = bbox.max.y - bbox.min.y;
        const scale = 0.08; // Conservative scale
        rooey.scale.setScalar(scale);
        
        // Center and ground
        const center = bbox.getCenter(new threeMod.Vector3());
        rooey.position.sub(center);
        rooey.position.y -= bbox.min.y;
        
        const rooeyGroup = new threeMod.Group();
        rooeyGroup.name = 'rooeyGroup';
        rooeyGroup.add(rooey);
        rooeyGroup.position.set(0.35, 0, 0);
        rooeyGroup.visible = false;
        
        // Set up animations if available
        if (rooeyGltf.animations && rooeyGltf.animations.length > 0) {
          const mixer = new threeMod.AnimationMixer(rooey);
          const animations: Record<string, any> = {};
          rooeyGltf.animations.forEach((clip: any) => {
            animations[clip.name] = mixer.clipAction(clip);
          });
          rooeyGroup.userData.mixer = mixer;
          rooeyGroup.userData.animations = animations;
        }
        
        anchorRef.current.group.add(rooeyGroup);
        modelsRef.current.rooeyGroup = rooeyGroup;

        // Load Griffin (flying bird)
        const griffinGltf = await gltfLoader.loadAsync('/assets/targets/griffin_fly.glb');
        const griffin = griffinGltf.scene;
        
        const griffinGroup = new threeMod.Group();
        griffinGroup.name = 'griffinGroup';
        griffinGroup.add(griffin);
        griffinGroup.position.set(-0.15, 0.05, 0.1);
        griffinGroup.visible = false;
        
        // Set up flying animation
        griffinGroup.userData.flyingAnimation = {
          time: 0,
          radius: 0.2,
          speed: 0.1,
          heightVariation: 0.05,
          centerOffset: new threeMod.Vector3(0, 0.3, 0)
        };
        
        anchorRef.current.group.add(griffinGroup);
        modelsRef.current.griffinGroup = griffinGroup;

        // Load Burj Khalifa (rotating building)
        const burjGltf = await gltfLoader.loadAsync('/assets/targets/burj_khalifa.glb');
        const burj = burjGltf.scene;
        
        const burjGroup = new threeMod.Group();
        burjGroup.name = 'burjGroup';
        burjGroup.add(burj);
        burjGroup.position.set(0, 0.05, 0);
        burjGroup.visible = false;
        burjGroup.userData.baseRotation = 0;
        
        anchorRef.current.group.add(burjGroup);
        modelsRef.current.burjModel = burjGroup;

      } catch (err) {
        console.warn('Model loading failed:', err);
        // Continue without models - AR will still work
      }
    };

    const setupTargetDetection = () => {
      let emitted = false;
      
      anchorRef.current.onTargetFound = () => {
        if (emitted) return;
        emitted = true;
        
        setArState('tracking');
        setShowInstructions(false);
        
        // Show all models
        Object.values(modelsRef.current).forEach((model: any) => {
          if (model) model.visible = true;
        });
        
        // Start animations
        startAnimations();
        
        // Emit scan event after a short delay to let user see the AR
        setTimeout(() => {
          try {
            onScan(markerCode);
          } catch (e) {
            console.error('Scan callback failed:', e);
          }
        }, 2000); // 2 second delay to show AR before proceeding
      };
      
      anchorRef.current.onTargetLost = () => {
        // Hide models when target is lost
        Object.values(modelsRef.current).forEach((model: any) => {
          if (model) model.visible = false;
        });
        
        setArState('ready');
        setShowInstructions(true);
      };
    };

    const startAnimations = () => {
      // Note: Animations are handled in the main render loop
      // This function is called when target is found to show models
      Object.values(modelsRef.current).forEach((model: any) => {
        if (model) model.visible = true;
      });
    };

    const startRenderLoop = (threeMod: any) => {
      const clock = new threeMod.Clock();
      
      const render = () => {
        if (isCancelled) return;
        
        const delta = clock.getDelta();
        
        // Update animations
        if (modelsRef.current.burjModel) {
          modelsRef.current.burjModel.userData.baseRotation += 0.005;
          modelsRef.current.burjModel.rotation.y = modelsRef.current.burjModel.userData.baseRotation;
        }
        
        if (modelsRef.current.griffinGroup) {
          const flying = modelsRef.current.griffinGroup.userData.flyingAnimation;
          if (flying) {
            flying.time += delta;
            const angle = flying.time * flying.speed * Math.PI * 2;
            const x = Math.cos(angle) * flying.radius;
            const z = Math.sin(angle) * flying.radius;
            const h = Math.sin(flying.time * flying.speed * 4) * flying.heightVariation;
            
            modelsRef.current.griffinGroup.position.x = flying.centerOffset.x + x;
            modelsRef.current.griffinGroup.position.y = flying.centerOffset.y + h;
            modelsRef.current.griffinGroup.position.z = flying.centerOffset.z + z;
            modelsRef.current.griffinGroup.rotation.y = angle - Math.PI / 2;
          }
        }
        
        if (modelsRef.current.rooeyGroup?.userData?.mixer) {
          modelsRef.current.rooeyGroup.userData.mixer.update(delta);
        }
        
        // Render
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
        
        requestAnimationFrame(render);
      };
      
      render();
    };

    initializeAR();

    return () => {
      isCancelled = true;
      try {
        if (mindarThreeRef.current) {
          if (typeof mindarThreeRef.current.stop === 'function') {
            mindarThreeRef.current.stop();
          }
          if (rendererRef.current && rendererRef.current.setAnimationLoop) {
            rendererRef.current.setAnimationLoop(null);
          }
        }
      } catch (e) {
        console.warn('Cleanup error:', e);
      }
    };
  }, [onScan, targetSrc, markerCode]);

  const handleClose = () => {
    setIsARActive(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-black">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Close AR scanner"
      >
        <span className="text-2xl">✕</span>
      </button>

      {/* Instructions */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-0 right-0 z-50 px-4"
        >
          <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              🎯 Point camera at the postcard
            </h2>
            <p className="text-sm text-gray-600">
              {arState === 'loading' && 'Initializing AR...'}
              {arState === 'ready' && 'Align camera with the printed marker'}
              {arState === 'tracking' && 'AR Active! Models detected'}
              {arState === 'error' && 'AR failed to start'}
            </p>
            
            {/* Quest theme integration */}
            {questTheme && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-2xl">{questTheme.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  Quest AR Experience
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* AR Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Status indicator */}
      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
          <div className={`w-3 h-3 rounded-full ${
            arState === 'tracking' ? 'bg-green-500' : 
            arState === 'ready' ? 'bg-yellow-500' : 
            arState === 'error' ? 'bg-red-500' : 'bg-blue-500'
          } animate-pulse`} />
          <span className="text-white text-sm font-medium">
            {arState === 'loading' && 'Loading AR...'}
            {arState === 'ready' && 'Scanning for marker...'}
            {arState === 'tracking' && 'AR Active - Models detected!'}
            {arState === 'error' && 'AR Error - Try QR mode'}
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <div className="max-w-md mx-auto bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
            <p className="text-sm font-medium">{error}</p>
            
            {/* Mode switching buttons */}
            <div className="mt-3 flex gap-2 text-xs flex-wrap">
              <button
                onClick={() => window.location.href = window.location.pathname + '?qr=true' + (window.location.search.includes('questId=') ? '' : '&questId=quest_test_postcard_ar')}
                className="px-3 py-1 bg-white/20 rounded hover:bg-white/30"
              >
                QR Mode
              </button>
              <button
                onClick={() => window.location.href = window.location.pathname + '?mock=true' + (window.location.search.includes('questId=') ? '' : '&questId=quest_test_postcard_ar')}
                className="px-3 py-1 bg-white/20 rounded hover:bg-white/30"
              >
                Mock Mode
              </button>
              <button
                onClick={handleClose}
                className="px-3 py-1 bg-white/20 rounded hover:bg-white/30"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isStarting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Starting AR Experience...</p>
          </div>
        </div>
      )}
    </div>
  );
}
