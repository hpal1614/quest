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
  const [status, setStatus] = useState<'loading' | 'requesting-camera' | 'loading-libraries' | 'initializing' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);
  
  let mindarThree: any = null;
  let testStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initializeAR();
    
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isPaused && mindarThree) {
      // Pause AR when overlay is open
      mindarThree.stop();
    } else if (!isPaused && mindarThree && status === 'ready') {
      // Resume AR when overlay closes
      mindarThree.start();
    }
  }, [isPaused]);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
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

  const waitForLibraries = (): Promise<void> => {
    return new Promise((resolve) => {
      const checkLibraries = () => {
        const THREE = (window as any).THREE;
        const MINDAR = (window as any).MINDAR;
        
        console.log('Checking libraries:', { 
          THREE: !!THREE, 
          MINDAR: !!MINDAR,
          THREE_GLTFLoader: !!(THREE && THREE.GLTFLoader)
        });
        
        if (THREE && MINDAR && THREE.GLTFLoader) {
          console.log('All libraries ready!');
          resolve();
        } else {
          setTimeout(checkLibraries, 100);
        }
      };
      checkLibraries();
    });
  };

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
      
      // Keep the stream alive but don't use it for display
      // MindAR will create its own stream, but permission is already granted
      testStreamRef.current = stream;

      // Step 2: Load libraries using script tags (React-compatible approach)
      setStatus('loading-libraries');
      console.log('Loading AR libraries...');

      // Load Three.js first (compatible version)
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
      console.log('Three.js loaded');

      // Load GLTFLoader
      await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js');
      console.log('GLTFLoader loaded');

      // Load MindAR - try the UMD version that creates globals
      await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.umd.js');
      console.log('MindAR UMD loaded');

      // Step 3: Wait for libraries to be ready
      await waitForLibraries();

      // Step 4: Initialize MindAR
      setStatus('initializing');
      console.log('Initializing MindAR...');

      console.log('Creating MindAR instance...');
      console.log('Container element:', containerRef.current);
      console.log('Target file path:', markerFile);
      
      // Check if target file is accessible
      try {
        const response = await fetch(markerFile);
        console.log('Target file accessible:', response.ok);
        if (!response.ok) {
          throw new Error(`Target file not accessible: ${response.status}`);
        }
      } catch (error) {
        console.error('Target file check failed:', error);
        throw new Error('AR target file not found. Please check if postcard.mind exists.');
      }
      
      const { MindARThree } = (window as any).MINDAR;
      const THREE = (window as any).THREE;
      
      mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: markerFile
      });
      console.log('MindAR instance created successfully');

      const { renderer, scene, camera } = mindarThree;
      const anchor = mindarThree.addAnchor(0);

      // Add lighting (using global THREE)
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
      scene.add(hemiLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(0.5, 1, 0.5);
      scene.add(dirLight);

      // Load 3D mascot model (using global GLTFLoader)
      const gltfLoader = new THREE.GLTFLoader();
      
      // Load Oliver model
      const oliverGltf = await gltfLoader.loadAsync(mascotModel);
      const oliver = oliverGltf.scene.clone();
      oliver.scale.setScalar(0.08);
      oliver.position.set(0, 0, 0);
      
      // Play idle animation if available (Oliver's biped animations)
      if (oliverGltf.animations && oliverGltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(oliver);
        const action = mixer.clipAction(oliverGltf.animations[0]);
        action.play();
        
        // Update animation loop
        const clock = new THREE.Clock();
        const animate = () => {
          if (!isPaused) {
            mixer.update(clock.getDelta());
          }
          requestAnimationFrame(animate);
        };
        animate();
      }
      
      anchor.group.add(oliver);
      console.log('Oliver model loaded and added to scene');
      
      // Notify parent that Oliver is loaded
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

      // Start AR
      await mindarThree.start();
      console.log('MindAR started successfully');
      
      // Stop the test stream since MindAR has its own
      if (testStreamRef.current) {
        testStreamRef.current.getTracks().forEach(track => track.stop());
        testStreamRef.current = null;
      }
      
      setStatus('ready');
      console.log('AR Scene ready!');

    } catch (error) {
      console.error('AR initialization failed:', error);
      setError(error instanceof Error ? error.message : 'AR initialization failed');
      setStatus('error');
    }
  };

  const cleanup = () => {
    if (mindarThree) {
      mindarThree.stop();
      mindarThree = null;
    }
    if (testStreamRef.current) {
      testStreamRef.current.getTracks().forEach(track => track.stop());
      testStreamRef.current = null;
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
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* AR Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
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
