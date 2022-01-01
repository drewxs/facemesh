import React, { useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import { drawMesh } from './utilities';

export const App = () => {
	const webcamRef = useRef(null);
	const canvasRef = useRef(null);

	const runFacemesh = async () => {
		const net = await facemesh.load({
			inputResolution: { width: 720, height: 480 },
			scale: 0.8,
		});

		setInterval(() => {
			detect(net);
		}, 100);
	};

	const detect = async (net) => {
		if (webcamRef.current && webcamRef.current.video.readyState === 4) {
			const video = webcamRef.current.video;
			const videoWidth = webcamRef.current.video.videoWidth;
			const videoHeight = webcamRef.current.video.videoHeight;

			webcamRef.current.video.width = videoWidth;
			webcamRef.current.video.height = videoHeight;

			canvasRef.current.width = videoWidth;
			canvasRef.current.height = videoHeight;

			const face = await net.estimateFaces(video);
			// console.log(face);

			const ctx = canvasRef.current.getContext('2d');
			drawMesh(face, ctx);
		}
	};

	runFacemesh();

	return (
		<div className="app">
			<Webcam ref={webcamRef} className="webcam" />
			<canvas ref={canvasRef} className="webcam"></canvas>
		</div>
	);
};
