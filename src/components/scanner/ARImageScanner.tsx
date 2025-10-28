'use client';

import { useEffect, useRef, useState } from 'react';

interface ARImageScannerProps {
	onScan: (code: string) => void;
	onClose: () => void;
	/** Path to MindAR image target (.mind) in public/, e.g. /assets/targets/postcard.mind */
	targetSrc?: string;
	/** Code to emit when image target is found; should match a quest location code */
	markerCode?: string;
}

/**
 * Marker-based AR scanner using MindAR + three.js loaded from CDN at runtime.
 * - Runs only on the client after mount
 * - Emits onScan(markerCode) when the image target is found
 * - Cleans up camera and animation loop on unmount
 */
export function ARImageScanner({ onScan, onClose, targetSrc = '/assets/targets/postcard.mind', markerCode = 'MARKER-FOUND' }: ARImageScannerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [error, setError] = useState<string | null>(null);
	const [isStarting, setIsStarting] = useState(true);

	useEffect(() => {
		let isCancelled = false;
		let mindarThree: any = null;
		let renderer: any = null;
		let scene: any = null;
		let camera: any = null;
		let anchor: any = null;

		const start = async () => {
			try {
				if (!containerRef.current) return;

				// Build URLs via variables so TypeScript won't try to resolve them at build time
				const threeUrl = 'https://cdn.jsdelivr.net/npm/' + 'three@0.157.0/build/three.module.js';
				const mindarUrl = 'https://cdn.jsdelivr.net/npm/' + 'mind-ar@1.2.5/dist/mindar-image-three.prod.js';

				// Dynamic ESM imports (client-side only)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const threeMod: any = await (Function('u', 'return import(u)'))(threeUrl);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const mindarMod: any = await (Function('u', 'return import(u)'))(mindarUrl);

				const { MindARThree } = mindarMod;

				mindarThree = new MindARThree({ container: containerRef.current, imageTargetSrc: targetSrc });
				({ renderer, scene, camera } = mindarThree);
				anchor = mindarThree.addAnchor(0);

				// Basic lighting so models (if added later) are visible
				try {
					const hemi = new threeMod.HemisphereLight(0xffffff, 0x444444, 0.6);
					scene.add(hemi);
					const dir = new threeMod.DirectionalLight(0xffffff, 0.8);
					dir.position.set(0.5, 1, 0.5);
					scene.add(dir);
				} catch (e) {
					// ignore non-critical lighting errors
				}

				// When the marker is found, emit our scan code once
				let emitted = false;
				anchor.onTargetFound = () => {
					if (emitted) return;
					emitted = true;
					try {
						onScan(markerCode);
					} catch (e) {}
				};
				anchor.onTargetLost = () => {
					// no-op; we only need the first found event
				};

				await mindarThree.start();
				const animate = () => {
					if (isCancelled) return;
					renderer.setAnimationLoop(() => {
						try {
							renderer.render(scene, camera);
						} catch (e) {}
					});
				};
				animate();
				setIsStarting(false);
			} catch (e) {
				setError('Failed to start AR. Ensure HTTPS and camera permissions.');
				setIsStarting(false);
			}
		};

		start();

		return () => {
			isCancelled = true;
			try {
				if (mindarThree) {
					// MindAR exposes a stop method on v1.2+
					if (typeof mindarThree.stop === 'function') {
						mindarThree.stop();
					}
					// Dispose renderer and stop camera tracks if available
					if (renderer && renderer.setAnimationLoop) {
						renderer.setAnimationLoop(null);
					}
				}
			} catch (e) {}
		};
	}, [onScan, targetSrc, markerCode]);

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
					<h2 className="text-lg font-bold text-gray-900 mb-2">🖼️ Point at the marker image</h2>
					<p className="text-sm text-gray-600">Align the camera with the printed marker to continue.</p>
				</div>
			</div>

			{/* AR container */}
			<div ref={containerRef} className="w-full h-full" />

			{/* Error message */}
			{(error || isStarting) && (
				<div className="absolute bottom-8 left-0 right-0 px-4">
					<div className="max-w-md mx-auto bg-black/60 text-white px-4 py-3 rounded-lg shadow-lg">
						<p className="text-sm font-medium">{error || 'Starting AR...'}</p>
					</div>
				</div>
			)}
		</div>
	);
}


