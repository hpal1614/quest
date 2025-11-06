'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Module-level flag to prevent double initialization across React Strict Mode remounts
// This persists even when the component unmounts/remounts
let arSceneInitialized = false;
let arSceneInitializing = false;

interface ARSceneProps {
  markerFile: string;
  mascotModel: string;
  onMarkerDetected: () => void;
  onMarkerLost: () => void;
  onMascotLoaded: () => void;
  isPaused: boolean;
  onOliverPositionUpdate?: (screenX: number, screenY: number) => void;
  hideUI?: boolean;
}

export function ARScene({
  markerFile,
  mascotModel,
  onMarkerDetected,
  onMarkerLost,
  onMascotLoaded,
  isPaused,
  onOliverPositionUpdate,
  hideUI = false
}: ARSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mindarThreeRef = useRef<any>(null);
  const oliverGroupRef = useRef<any>(null);
  const mixerRef = useRef<any>(null);
  const gltfRef = useRef<any>(null);
  const isPausedRef = useRef(isPaused);
  const isInitializedRef = useRef(false);
  const isInitializingRef = useRef(false);
  const frameCountRef = useRef(0);
  const targetFoundRef = useRef(false);
  const [status, setStatus] = useState<'loading' | 'requesting-camera' | 'loading-libraries' | 'initializing' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode using module-level flags
    // Module-level flags persist across component unmount/remount cycles
    if (arSceneInitialized || arSceneInitializing) {
      console.log('⏭️ AR already initialized or initializing (module-level check), skipping...');
      return;
    }

    arSceneInitializing = true;
    console.log('🎬 Starting AR initialization (first time)...');
    initializeAR();

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    isPausedRef.current = isPaused;

    // Don't call stop() when overlay is open - prevents status changes that trigger loading spinner
    if (isPaused && mindarThreeRef.current && !hideUI) {
      console.log('⏸️ Pausing AR (but NOT for overlay - overlay handles its own state)');
      mindarThreeRef.current.stop();
    } else if (!isPaused && mindarThreeRef.current && status === 'ready') {
      console.log('▶️ Resuming AR');
      mindarThreeRef.current.start();
    }
  }, [isPaused, status, hideUI]);

  // Hide MindAR's scanning UI overlay when riddle overlay is open
  useEffect(() => {
    const scanningElement = containerRef.current?.querySelector('.scanning');
    if (scanningElement) {
      if (hideUI) {
        console.log('🚫 Hiding MindAR scanning UI (overlay is open)');
        (scanningElement as HTMLElement).style.display = 'none';
      } else {
        console.log('✅ Showing MindAR scanning UI (overlay is closed)');
        (scanningElement as HTMLElement).style.display = '';
      }
    }
  }, [hideUI]);

  const initializeAR = async () => {
    try {
      console.log('═══════════════════════════════════════════');
      console.log('🎬 [AR INIT START] Beginning AR initialization...');
      console.log('═══════════════════════════════════════════');

      // Step 1: Request camera permission
      setStatus('requesting-camera');
      console.log('📹 [AR STEP 1/6] Requesting camera permission...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      console.log('✅ [AR STEP 1/6] Camera permission granted');
      console.log('   → Camera facing: environment (back camera)');
      console.log('   → Resolution: 1280x720 (ideal)');

      // Stop the test stream - MindAR will create its own
      stream.getTracks().forEach(track => track.stop());
      console.log('   → Test stream stopped, MindAR will create its own');

      // Step 2: Load MindAR and Three.js as ES modules (browser-only, runtime loading)
      setStatus('loading-libraries');
      console.log('📚 [AR STEP 2/6] Loading AR libraries (MindAR + Three.js)...');
      console.log('   → This may take a few seconds on first load');

      // CRITICAL FIX: Load scripts one by one and wait for each to be ready
      // This ensures proper initialization order
      
      // Check if already loaded (prevent duplicate loading)
      if (!(window as any).arLibsLoaded) {
        const script = document.createElement('script');
        script.type = 'module';
        script.id = 'mindar-loader';
        
        // Use importmap approach (closer to your working example)
        const importMapScript = document.createElement('script');
        importMapScript.type = 'importmap';
        importMapScript.textContent = JSON.stringify({
          imports: {
            "three": "https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/",
            "mindar-image-three": "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js"
          }
        });
        
        // Only add importmap if not already present
        if (!document.querySelector('script[type="importmap"]')) {
          document.head.appendChild(importMapScript);
          console.log('Import map added');
        }
        
        // Minimal delay to let importmap register
        await new Promise(resolve => setTimeout(resolve, 50));
        
        script.textContent = `
          import { MindARThree } from 'mindar-image-three';
          import * as THREE from 'three';
          import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
          
          window.MindARThree = MindARThree;
          window.THREE = THREE;
          window.GLTFLoader = GLTFLoader;
          window.arLibsLoaded = true;
          console.log('✅ MindAR libraries loaded:', { MindARThree: !!MindARThree, THREE: !!THREE, GLTFLoader: !!GLTFLoader });
        `;
        
        document.head.appendChild(script);
        console.log('Module script added, waiting for libraries...');
      }
      
      // Wait for libraries with faster polling
      await new Promise<void>((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 200; // 10 seconds (checking every 50ms)
        
        const checkLibraries = () => {
          attempts++;
          const loaded = (window as any).arLibsLoaded;
          
          // Only log every 20 attempts (once per second) to reduce console spam
          if (attempts % 20 === 0) {
            console.log(`⏳ Loading AR... ${Math.floor(attempts * 50 / 1000)}s`);
          }
          
          if (loaded) {
            console.log('✅ Libraries ready in', (attempts * 50 / 1000).toFixed(1), 'seconds');
            resolve();
          } else if (attempts >= maxAttempts) {
            reject(new Error('AR libraries loading timeout'));
          } else {
            setTimeout(checkLibraries, 50); // Check every 50ms instead of 100ms
          }
        };
        
        checkLibraries();
      });
      
      console.log('✅ [AR STEP 2/6] All AR libraries loaded successfully!');

      const MindARThree = (window as any).MindARThree;
      const THREE = (window as any).THREE;
      const GLTFLoader = (window as any).GLTFLoader;

      if (!MindARThree || !THREE || !GLTFLoader) {
        console.error('❌ [ERROR] Libraries loaded but not accessible on window');
        throw new Error('Libraries loaded but not accessible on window');
      }

      // Step 3: Initialize MindAR (exactly like the working example)
      setStatus('initializing');
      console.log('🎯 [AR STEP 3/6] Initializing MindAR engine...');
      console.log('   → Marker file:', markerFile);

      // Check if target file is accessible
      try {
        console.log('   → Checking if marker file is accessible...');
        const response = await fetch(markerFile);
        if (!response.ok) {
          console.error('❌ [ERROR] Marker file not accessible:', response.status);
          throw new Error(`Target file not accessible: ${response.status}`);
        }
        console.log('   ✅ Marker file accessible');
      } catch (err) {
        console.error('❌ [ERROR] Target file check failed:', err);
        throw new Error('AR target file not found');
      }

      // Create MindAR instance
      console.log('   → Creating MindAR instance...');
      const mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: markerFile
      });
      mindarThreeRef.current = mindarThree;
      console.log('✅ [AR STEP 3/6] MindAR instance created successfully');
      console.log('   → Now ready to load 3D model and start scanning');

      const { renderer, scene, camera } = mindarThree;
      const clock = new THREE.Clock();
      const anchor = mindarThree.addAnchor(0);

      // Add bright lighting to make Oliver clearly visible
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Bright ambient light
      scene.add(ambientLight);
      
      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0); // Brighter directional light
      dirLight1.position.set(1, 1, 1);
      scene.add(dirLight1);
      
      const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5); // Additional light from other side
      dirLight2.position.set(-1, 1, -1);
      scene.add(dirLight2);
      
      console.log('Lighting added:', { ambient: ambientLight.intensity, dirLight1: dirLight1.intensity, dirLight2: dirLight2.intensity });

      // Load 3D model
      console.log('🎨 [AR STEP 4/6] Loading 3D mascot model...');
      console.log('   → Model file:', mascotModel);
      const gltfLoader = new GLTFLoader();

      const gltf = await gltfLoader.loadAsync(mascotModel);
      const oliver = gltf.scene;
      console.log('✅ [AR STEP 4/6] 3D model loaded successfully');
      console.log('   → Model has', oliver.children.length, 'children');
      
      // EXACT APPROACH FROM WORKING EXAMPLE (lines 62-80 of app.js)
      // Disable frustum culling first and ensure proper material rendering
      oliver.traverse((n: any) => {
        if (n.isMesh) {
          n.frustumCulled = false;
          if (n.material) {
            // Ensure material is visible
            n.material.transparent = false;
            n.material.opacity = 1.0;
            n.material.visible = true;
            n.material.side = THREE.DoubleSide; // Render both sides
            n.material.needsUpdate = true;
            console.log('📦 Mesh found:', n.name, 'material:', n.material.type);
          }
          n.visible = true;
          n.renderOrder = 0;
        }
      });
      
      console.log('✅ Oliver scene structure:', {
        children: oliver.children.length,
        type: oliver.type,
        visible: oliver.visible
      });
      
      // Auto-scale using bounding box (EXACT method from vision-ar)
      try {
        const bbox0 = new THREE.Box3().setFromObject(oliver);
        const h0 = bbox0.max.y - bbox0.min.y;
        let scale = 0.15; // Increased fallback for better visibility
        if (isFinite(h0) && h0 > 0.0001) {
          const targetHeight = 0.25; // Increased from 0.12 to 0.25 for better visibility
          scale = targetHeight / h0;
          scale = Math.max(0.1, Math.min(scale, 0.5)); // Increased min/max range
        }
        oliver.scale.setScalar(scale);
        
        // Recenter and ground the model
        const bbox1 = new THREE.Box3().setFromObject(oliver);
        const center1 = bbox1.getCenter(new THREE.Vector3());
        oliver.position.sub(center1);
        const bbox2 = new THREE.Box3().setFromObject(oliver);
        oliver.position.y -= bbox2.min.y; // Ground it
        
        console.log('✅ Oliver auto-scaled to', scale, 'height:', h0, 'bbox0:', bbox0);
      } catch(e) {
        oliver.scale.setScalar(0.15);
        console.warn('Bounding box scaling failed, using fallback 0.15', e);
      }
      
      const model = oliver;
      
      // Store gltf in ref for later use
      gltfRef.current = gltf;
      
      // Play animation if available
      if (gltf.animations && gltf.animations.length > 0) {
        console.log('🎬 Animations found:', gltf.animations.length);
        gltf.animations.forEach((anim: any, idx: number) => {
          console.log(`  Animation ${idx}:`, anim.name, 'duration:', anim.duration);
        });

        mixerRef.current = new THREE.AnimationMixer(model);
        const action = mixerRef.current.clipAction(gltf.animations[0]);
        action.setLoop(THREE.LoopRepeat, Infinity); // Loop forever
        action.play();
        console.log('✅ Animation started and looping:', gltf.animations[0].name);
      } else {
        console.warn('⚠️ No animations found in model');
      }

      // Wrap Oliver in a Group (EXACT approach from vision-ar line 83)
      const oliverGroup = new THREE.Group();
      oliverGroup.name = 'oliverGroup';
      oliverGroup.add(model);
      
      // Position the group (like Rooey at line 85: position.set(0.35, 0, 0))
      // Center Oliver on the marker, slightly raised for better visibility
      oliverGroup.position.set(0, 0, 0);
      oliverGroup.rotation.set(0, 0, 0);
      oliverGroup.visible = true; // CHANGED: Start visible to test
      
      // Store in ref
      oliverGroupRef.current = oliverGroup;
      
      // Add to anchor
      anchor.group.add(oliverGroup);
      console.log('✅ Oliver group added to anchor');
      console.log('📦 Anchor children:', anchor.group.children.length);
      console.log('📊 Oliver group details:', {
        position: oliverGroup.position,
        scale: oliverGroup.scale,
        visible: oliverGroup.visible,
        childrenCount: oliverGroup.children.length
      });
      
      // Notify parent that model is loaded
      onMascotLoaded();

      // Set up marker detection events (EXACT from vision-ar lines 266-399)
      anchor.onTargetFound = () => {
        // Prevent duplicate target found events
        if (targetFoundRef.current) {
          console.log('🎯 Target already found, ignoring duplicate event');
          return;
        }

        targetFoundRef.current = true;
        console.log('🎯 Target found - showing Oliver!');

        // Show Oliver immediately (like burjModel.visible = true at line 271)
        try {
          if (oliverGroupRef.current) {
            oliverGroupRef.current.visible = true;
            console.log('✅ Oliver group set to visible');
            console.log('📍 Oliver position:', oliverGroupRef.current.position);
            console.log('📏 Oliver scale:', oliverGroupRef.current.scale);
            console.log('🔍 Oliver children:', oliverGroupRef.current.children.length);
            
            // Log each mesh visibility
            oliverGroupRef.current.traverse((node: any) => {
              if (node.isMesh) {
                console.log('🔸 Mesh:', node.name, 'visible:', node.visible, 'material:', node.material?.visible);
              }
            });
            
            // Ensure animations continue playing
            if (mixerRef.current && gltfRef.current) {
              try {
                const anims = gltfRef.current.animations;
                if (anims && anims.length > 0) {
                  const firstAction = mixerRef.current.clipAction(anims[0]);
                  if (!firstAction.isRunning()) {
                    firstAction.reset();
                    firstAction.setLoop(THREE.LoopRepeat, Infinity);
                    firstAction.play();
                    console.log('▶️ Animation restarted');
                  } else {
                    console.log('▶️ Animation already running');
                  }
                }
              } catch(e) {
                console.warn('Animation start failed:', e);
              }
            }
          }
        } catch(e) {
          console.error('Target found handler error:', e);
        }
        
        setIsMarkerVisible(true);
        onMarkerDetected();
      };

      anchor.onTargetLost = () => {
        console.log('❌ Target lost - hiding Oliver');

        // Reset target found flag so it can be detected again
        targetFoundRef.current = false;

        // Hide Oliver when marker lost (like line 383)
        try {
          if (oliverGroupRef.current) {
            oliverGroupRef.current.visible = false;
          }
        } catch(e) {}

        setIsMarkerVisible(false);
        onMarkerLost();
      };

      renderer.setAnimationLoop(() => {
        const delta = clock.getDelta();

        if (mixerRef.current && !isPausedRef.current) {
          mixerRef.current.update(delta);

          // Debug log every 120 frames (~2 seconds at 60fps)
          frameCountRef.current++;
          if (frameCountRef.current % 120 === 0) {
            console.log('🎬 Animation mixer updating, delta:', delta.toFixed(4));
          }
        }

        // Calculate Oliver's screen position for speech bubble
        if (oliverGroupRef.current && onOliverPositionUpdate && oliverGroupRef.current.visible) {
          const vector = new THREE.Vector3();
          oliverGroupRef.current.getWorldPosition(vector);

          // Project 3D position to 2D screen coordinates
          vector.project(camera);

          // Convert normalized device coordinates (-1 to +1) to screen pixels
          const x = (vector.x * 0.5 + 0.5) * renderer.domElement.width;
          const y = (vector.y * -0.5 + 0.5) * renderer.domElement.height;

          onOliverPositionUpdate(x, y);
        }

        renderer.render(scene, camera);
      });

      // Start AR
      console.log('🚀 [AR STEP 5/6] Starting MindAR engine...');
      console.log('   → Scene children:', scene.children.length);
      console.log('   → Anchor children:', anchor.group.children.length);
      console.log('   → Renderer size:', renderer.domElement.width, 'x', renderer.domElement.height);

      await mindarThree.start();
      console.log('✅ [AR STEP 5/6] MindAR started successfully!');
      console.log('   → Camera feed is now active');
      console.log('   → Renderer is running');
      console.log('');
      console.log('📷 [SCANNING MODE] 🔍');
      console.log('═══════════════════════════════════════════');
      console.log('   Point your camera at the marker to detect it');
      console.log('   Waiting for marker detection...');
      console.log('═══════════════════════════════════════════');

      // DEBUG: Check if renderer canvas is visible
      console.log('🎥 RENDERER CANVAS DEBUG:', {
        canvas: renderer.domElement,
        canvasParent: renderer.domElement.parentElement,
        canvasDisplay: renderer.domElement.style.display,
        canvasWidth: renderer.domElement.width,
        canvasHeight: renderer.domElement.height,
        canvasStyle: renderer.domElement.style.cssText,
        containerHasCanvas: containerRef.current?.contains(renderer.domElement)
      });

      // Force canvas to be visible and fill screen
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.objectFit = 'cover';
      renderer.domElement.style.zIndex = '1';
      console.log('🔧 Forced canvas styles applied');

      // Force video element to fill screen (MindAR creates a video element for camera)
      const videoElement = containerRef.current?.querySelector('video');
      if (videoElement) {
        (videoElement as HTMLVideoElement).style.position = 'absolute';
        (videoElement as HTMLVideoElement).style.top = '0';
        (videoElement as HTMLVideoElement).style.left = '0';
        (videoElement as HTMLVideoElement).style.width = '100%';
        (videoElement as HTMLVideoElement).style.height = '100%';
        (videoElement as HTMLVideoElement).style.objectFit = 'cover';
        (videoElement as HTMLVideoElement).style.zIndex = '0';
        console.log('🎥 Forced video styles applied - camera should fill screen');
      } else {
        console.warn('⚠️ Video element not found in container');
      }

      // Mark as successfully initialized (module-level flags)
      arSceneInitialized = true;
      arSceneInitializing = false;
      isInitializedRef.current = true;
      isInitializingRef.current = false;

      setStatus('ready');
      console.log('✅ [AR STEP 6/6] AR Scene is READY!');
      console.log('═══════════════════════════════════════════');
      console.log('🎉 AR INITIALIZATION COMPLETE!');
      console.log('═══════════════════════════════════════════');
      console.log('');

    } catch (err) {
      console.error('═══════════════════════════════════════════');
      console.error('❌ [FATAL ERROR] AR initialization failed!');
      console.error('═══════════════════════════════════════════');
      console.error('Error details:', err);
      console.error('Error message:', err instanceof Error ? err.message : 'Unknown error');
      console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
      console.error('');
      console.error('Possible causes:');
      console.error('  1. Camera permission denied');
      console.error('  2. Marker file not found or inaccessible');
      console.error('  3. 3D model file not found or inaccessible');
      console.error('  4. Browser compatibility issue');
      console.error('  5. Network error loading libraries');
      console.error('═══════════════════════════════════════════');

      setError(err instanceof Error ? err.message : 'AR initialization failed');
      setStatus('error');

      // Reset flags on error so user can retry (both module-level and ref flags)
      arSceneInitializing = false;
      arSceneInitialized = false;
      isInitializingRef.current = false;
      isInitializedRef.current = false;
    }
  };

  const cleanup = () => {
    console.log('🧹 Cleaning up AR scene...');
    if (mindarThreeRef.current) {
      const { renderer } = mindarThreeRef.current;
      renderer.setAnimationLoop(null);
      mindarThreeRef.current.stop();
      mindarThreeRef.current = null;
    }
    oliverGroupRef.current = null;
    mixerRef.current = null;
    gltfRef.current = null;

    // Reset ref flags but NOT module-level flags
    // Module-level flags should persist to prevent re-initialization in Strict Mode
    isInitializedRef.current = false;
    isInitializingRef.current = false;
    console.log('✅ Cleanup complete (module flags preserved to prevent re-init)');
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return 'Initializing AR...';
      case 'requesting-camera':
        return 'Requesting camera permission...';
      case 'loading-libraries':
        return 'Loading AR libraries...';
      case 'initializing':
        return 'Setting up AR scene...';
      case 'ready':
        return 'Scan the sticker to reveal your clue!';
      case 'error':
        return 'AR failed to load';
      default:
        return 'Loading...';
    }
  };

  return (
    <div className="fixed inset-0 bg-black" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Global styles for AR camera to fill screen */}
      <style jsx global>{`
        #ar-container video,
        #ar-container canvas {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        /* Hide MindAR scanning UI when overlay is open */
        ${hideUI ? `
        .scanning,
        .scanning .inner,
        .scanning .scanline {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        ` : ''}
      `}</style>

      {/* AR Container - Fullscreen with exact viewport dimensions */}
      <div
        ref={containerRef}
        id="ar-container"
        className="absolute inset-0"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 0,
          backgroundColor: 'transparent'
        }}
      />
      
      {/* Status Overlay - Hidden when riddle overlay is open */}
      {!hideUI && status !== 'ready' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center" style={{ zIndex: 10 }}>
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg font-medium">{getStatusMessage()}</p>
            {status === 'loading-libraries' && (
              <p className="text-sm text-gray-300 mt-2">This may take a few seconds</p>
            )}
          </div>
        </div>
      )}

      {/* Instruction Overlay - Hidden when riddle overlay is open */}
      {!hideUI && status === 'ready' && !isMarkerVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg"
          style={{ zIndex: 20 }}
        >
          <p className="text-center text-gray-800 font-medium">
            📷 Scan the sticker to reveal your clue!
          </p>
        </motion.div>
      )}

      {/* Marker Detection Indicator - Hidden when riddle overlay is open */}
      {!hideUI && status === 'ready' && isMarkerVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-4 right-4 bg-green-500 bg-opacity-90 rounded-lg p-4 shadow-lg"
          style={{ zIndex: 20 }}
        >
          <p className="text-center text-white font-medium">
            ✅ Marker detected! Look for Oliver!
          </p>
        </motion.div>
      )}
      
      {/* Error Overlay */}
      {status === 'error' && (
        <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">AR Failed</h3>
            <p className="text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-white text-red-500 px-4 py-2 rounded-lg font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
