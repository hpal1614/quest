'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ARSceneProps {
  markerFile: string;
  mascotModel: string;
  onMarkerDetected: () => void;
  onMarkerLost: () => void;
  onMascotLoaded: () => void;
  isPaused: boolean;
}

export function ARScene({ 
  markerFile, 
  mascotModel, 
  onMarkerDetected, 
  onMarkerLost, 
  onMascotLoaded,
  isPaused 
}: ARSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mindarThreeRef = useRef<any>(null);
  const [status, setStatus] = useState<'loading' | 'requesting-camera' | 'loading-libraries' | 'initializing' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);

  useEffect(() => {
    initializeAR();
    
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isPaused && mindarThreeRef.current) {
      mindarThreeRef.current.stop();
    } else if (!isPaused && mindarThreeRef.current && status === 'ready') {
      mindarThreeRef.current.start();
    }
  }, [isPaused]);

  const initializeAR = async () => {
    try {
      // Step 1: Request camera permission
      setStatus('requesting-camera');
      console.log('Requesting camera permission...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      console.log('Camera permission granted');
      
      // Stop the test stream - MindAR will create its own
      stream.getTracks().forEach(track => track.stop());

      // Step 2: Load MindAR and Three.js as ES modules (browser-only, runtime loading)
      setStatus('loading-libraries');
      console.log('Loading AR libraries...');

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
      
      console.log('All AR libraries loaded successfully!');
      
      const MindARThree = (window as any).MindARThree;
      const THREE = (window as any).THREE;
      const GLTFLoader = (window as any).GLTFLoader;
      
      if (!MindARThree || !THREE || !GLTFLoader) {
        throw new Error('Libraries loaded but not accessible on window');
      }

      // Step 3: Initialize MindAR (exactly like the working example)
      setStatus('initializing');
      console.log('Initializing MindAR...');

      // Check if target file is accessible
      try {
        const response = await fetch(markerFile);
        if (!response.ok) {
          throw new Error(`Target file not accessible: ${response.status}`);
        }
        console.log('Target file accessible:', response.ok);
      } catch (err) {
        console.error('Target file check failed:', err);
        throw new Error('AR target file not found');
      }
      
      // Create MindAR instance
      const mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: markerFile
      });
      mindarThreeRef.current = mindarThree;
      console.log('MindAR instance created successfully');

      const { renderer, scene, camera } = mindarThree;
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
      const gltfLoader = new GLTFLoader();
      console.log('Loading 3D model:', mascotModel);
      
      const gltf = await gltfLoader.loadAsync(mascotModel);
      const model = gltf.scene.clone();
      
      // Make Oliver MUCH bigger and position prominently
      model.scale.setScalar(0.5); // Increased from 0.08 to 0.5 (6x larger!)
      model.position.set(0, -0.5, 0); // Slightly lower to fit in frame
      model.rotation.y = 0; // Face forward
      
      console.log('Oliver scale:', model.scale, 'position:', model.position);
      
      // Play animation if available
      let mixer: any = null;
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        console.log('Model animation started');
      }
      
      anchor.group.add(model);
      console.log('Model loaded and added to scene');
      
      // Notify parent that model is loaded
      onMascotLoaded();

      // Set up marker detection events
      anchor.onTargetFound = () => {
        console.log('Marker detected!');
        setIsMarkerVisible(true);
        onMarkerDetected();
      };

      anchor.onTargetLost = () => {
        console.log('Marker lost');
        setIsMarkerVisible(false);
        onMarkerLost();
      };

      // Animation loop for model animations
      const clock = new THREE.Clock();
      const animate = () => {
        if (mixer && !isPaused) {
          mixer.update(clock.getDelta());
        }
        requestAnimationFrame(animate);
      };
      animate();

      // Start AR
      console.log('Starting MindAR...');
      await mindarThree.start();
      console.log('MindAR started successfully');
      
      setStatus('ready');
      console.log('AR Scene ready!');

    } catch (err) {
      console.error('AR initialization failed:', err);
      setError(err instanceof Error ? err.message : 'AR initialization failed');
      setStatus('error');
    }
  };

  const cleanup = () => {
    if (mindarThreeRef.current) {
      mindarThreeRef.current.stop();
      mindarThreeRef.current = null;
    }
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
      {/* AR Container - Fullscreen with exact viewport dimensions */}
      <div 
        ref={containerRef} 
        className="absolute inset-0"
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh',
          overflow: 'hidden'
        }}
      />
      
      {/* Status Overlay */}
      {status !== 'ready' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg font-medium">{getStatusMessage()}</p>
            {status === 'loading-libraries' && (
              <p className="text-sm text-gray-300 mt-2">This may take a few seconds</p>
            )}
          </div>
        </div>
      )}
      
      {/* Instruction Overlay */}
      {status === 'ready' && !isMarkerVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg"
        >
          <p className="text-center text-gray-800 font-medium">
            📷 Scan the sticker to reveal your clue!
          </p>
        </motion.div>
      )}
      
      {/* Marker Detection Indicator */}
      {status === 'ready' && isMarkerVisible && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-4 right-4 bg-green-500 bg-opacity-90 rounded-lg p-4 shadow-lg"
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
