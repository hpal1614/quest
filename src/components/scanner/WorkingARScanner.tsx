'use client';

import { useEffect, useRef, useState } from 'react';

interface WorkingARScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  markerCode?: string;
  questTheme?: {
    icon: string;
    color: string;
    gradient: string;
  };
}

export function WorkingARScanner({ onScan, onClose, markerCode = 'MARKER-FOUND', questTheme }: WorkingARScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [isARActive, setIsARActive] = useState(false);

  // Helper function to load scripts dynamically
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    let mindarThree: any = null;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let anchor: any = null;
    let rooeyGroup: any = null;
    let burjModel: any = null;
    let griffinGroup: any = null;

    const initializeAR = async () => {
      try {
        if (!containerRef.current) return;

        // Load libraries as script tags - use unpkg for reliable CDN delivery
        // Three.js 0.143.0 is compatible with MindAR 1.2.5
        await loadScript('https://unpkg.com/three@0.143.0/build/three.min.js');
        await loadScript('https://unpkg.com/three@0.143.0/examples/js/loaders/GLTFLoader.js');
        await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js');
        
        // Access global variables after scripts are loaded
        const threeMod = (window as any).THREE;
        const mindarMod = (window as any).MINDAR;
        const GLTFLoader = (window as any).THREE?.GLTFLoader;

        console.log('Loaded libraries:', { threeMod, mindarMod, GLTFLoader });

        if (!threeMod || !mindarMod || !GLTFLoader) {
          console.error('Missing libraries:', { threeMod, mindarMod, GLTFLoader });
          throw new Error('Failed to load Three.js, MindAR, or GLTFLoader libraries');
        }

        const { MindARThree } = mindarMod;

        // Initialize MindAR
        mindarThree = new MindARThree({ 
          container: containerRef.current, 
          imageTargetSrc: '/assets/targets/postcard.mind' 
        });
        
        ({ renderer, scene, camera } = mindarThree);
        anchor = mindarThree.addAnchor(0);

        // Add lighting
        const hemiLight = new threeMod.HemisphereLight(0xffffff, 0x444444, 0.6);
        scene.add(hemiLight);
        const dirLight = new threeMod.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(0.5, 1, 0.5);
        scene.add(dirLight);

        // Load models using the working approach
        const gltfLoader = new GLTFLoader();
        
        // Load Rooey
        const loadRooey = async () => {
          try {
            const gltf = await gltfLoader.loadAsync('/assets/targets/Rooey.glb');
            const rooey = gltf.scene;
            
            // Scale and position
            const bbox = new threeMod.Box3().setFromObject(rooey);
            const height = bbox.max.y - bbox.min.y;
            const scale = 0.08;
            rooey.scale.setScalar(scale);
            
            const center = bbox.getCenter(new threeMod.Vector3());
            rooey.position.sub(center);
            rooey.position.y -= bbox.min.y;
            
            const group = new threeMod.Group();
            group.name = 'rooeyGroup';
            group.add(rooey);
            group.position.set(0.35, 0, 0);
            group.visible = false;
            
            // Animations
            if (gltf.animations && gltf.animations.length > 0) {
              const mixer = new threeMod.AnimationMixer(rooey);
              const animations: Record<string, any> = {};
              gltf.animations.forEach((clip: any) => {
                animations[clip.name] = mixer.clipAction(clip);
              });
              group.userData.mixer = mixer;
              group.userData.animations = animations;
            }
            
            return group;
          } catch (e) {
            console.warn('Rooey load failed', e);
            return new threeMod.Group();
          }
        };

        // Load Burj Khalifa
        const loadBurjKhalifa = async () => {
          try {
            const gltf = await gltfLoader.loadAsync('/assets/targets/burj_khalifa.glb');
            const model = gltf.scene;
            
            const bbox = new threeMod.Box3().setFromObject(model);
            const height = bbox.max.y - bbox.min.y || 0.5;
            const scale = 0.6 / height;
            model.scale.set(scale, scale, scale);
            
            bbox.setFromObject(model);
            const center = bbox.getCenter(new threeMod.Vector3());
            model.position.sub(center);
            model.position.y = 0;
            
            const group = new threeMod.Group();
            group.name = 'burjModel';
            group.add(model);
            group.position.set(0, 0.05, 0);
            group.visible = false;
            
            return group;
          } catch (e) {
            console.warn('Burj load failed', e);
            return new threeMod.Group();
          }
        };

        // Load Griffin
        const loadGriffin = async () => {
          try {
            const gltf = await gltfLoader.loadAsync('/assets/targets/griffin_fly.glb');
            const model = gltf.scene;
            
            const bbox = new threeMod.Box3().setFromObject(model);
            const size = bbox.getSize(new threeMod.Vector3());
            const targetHeight = 0.05;
            const scale = targetHeight / size.y;
            model.scale.setScalar(scale);
            
            const group = new threeMod.Group();
            group.name = 'griffinGroup';
            group.add(model);
            group.position.set(-0.15, 0.05, 0.1);
            group.visible = false;
            
            // Flying animation
            group.userData.flyingAnimation = {
              time: 0,
              radius: 0.2,
              speed: 0.1,
              heightVariation: 0.05,
              centerOffset: new threeMod.Vector3(0, 0.3, 0)
            };
            
            return group;
          } catch (e) {
            console.warn('Griffin load failed', e);
            return new threeMod.Group();
          }
        };

        // Load all models
        rooeyGroup = await loadRooey();
        burjModel = await loadBurjKhalifa();
        griffinGroup = await loadGriffin();

        // Add models to anchor
        anchor.group.add(rooeyGroup);
        anchor.group.add(burjModel);
        anchor.group.add(griffinGroup);

        // Set up target detection
        let emitted = false;
        anchor.onTargetFound = () => {
          if (emitted) return;
          emitted = true;
          
          // Show all models
          rooeyGroup.visible = true;
          burjModel.visible = true;
          griffinGroup.visible = true;
          
          // Start animations
          if (rooeyGroup.userData?.mixer) {
            const animations = rooeyGroup.userData.animations;
            Object.values(animations).forEach((anim: any) => {
              anim.setLoop(threeMod.LoopRepeat, Infinity);
              anim.play();
            });
          }
          
          // Emit scan event after delay
          setTimeout(() => {
            try {
              onScan(markerCode);
            } catch (e) {
              console.error('Scan callback failed:', e);
            }
          }, 2000);
        };

        anchor.onTargetLost = () => {
          rooeyGroup.visible = false;
          burjModel.visible = false;
          griffinGroup.visible = false;
        };

        // Start AR
        await mindarThree.start();
        
        // Start render loop
        const clock = new threeMod.Clock();
        const animate = () => {
          if (isCancelled) return;
          
          const delta = clock.getDelta();
          
          // Update mixers
          if (rooeyGroup.userData?.mixer) {
            rooeyGroup.userData.mixer.update(delta);
          }
          
          // Burj rotation
          if (burjModel && burjModel.visible) {
            burjModel.rotation.y += 0.005;
          }
          
          // Griffin flying
          if (griffinGroup && griffinGroup.visible && griffinGroup.userData?.flyingAnimation) {
            const anim = griffinGroup.userData.flyingAnimation;
            anim.time += delta;
            const angle = anim.time * anim.speed * Math.PI * 2;
            const x = Math.cos(angle) * anim.radius;
            const z = Math.sin(angle) * anim.radius;
            const h = Math.sin(anim.time * anim.speed * 4) * anim.heightVariation;
            griffinGroup.position.x = anim.centerOffset.x + x;
            griffinGroup.position.y = anim.centerOffset.y + h;
            griffinGroup.position.z = anim.centerOffset.z + z;
            griffinGroup.rotation.y = angle - Math.PI / 2;
          }
          
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        };
        
        animate();
        setIsStarting(false);
        setIsARActive(true);

      } catch (err) {
        console.error('AR initialization failed:', err);
        setError(`AR failed: ${err instanceof Error ? err.message : 'Unknown error'}. Try refreshing the page.`);
        setIsStarting(false);
      }
    };

    initializeAR();

    return () => {
      isCancelled = true;
      try {
        if (mindarThree) {
          if (typeof mindarThree.stop === 'function') {
            mindarThree.stop();
          }
          if (renderer && renderer.setAnimationLoop) {
            renderer.setAnimationLoop(null);
          }
        }
      } catch (e) {}
    };
  }, [onScan, markerCode]);

  return (
    <div className="fixed inset-0 z-40 bg-black">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Close scanner"
      >
        <span className="text-2xl">✕</span>
      </button>

      {/* Instructions */}
      <div className="absolute top-20 left-0 right-0 z-50 px-4">
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            🎯 Point camera at the postcard
          </h2>
          <p className="text-sm text-gray-600">
            {isStarting ? 'Initializing AR...' : 'Align camera with the printed marker'}
          </p>
          
          {questTheme && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-2xl">{questTheme.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                Quest AR Experience
              </span>
            </div>
          )}
        </div>
      </div>

      {/* AR container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Error message */}
      {error && (
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <div className="max-w-md mx-auto bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={onClose}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Go back
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isStarting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg font-medium">Starting AR...</p>
            <p className="text-sm opacity-75 mt-2">Loading 3D models and camera</p>
          </div>
        </div>
      )}
    </div>
  );
}
