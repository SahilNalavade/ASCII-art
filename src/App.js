import React, { useRef, useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [asciiArt, setAsciiArt] = useState('');
  const [resolution, setResolution] = useState(80);
  const [charSet, setCharSet] = useState('@%#*+=-:. ');
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState(8);
  const lastFrameTime = useRef(0);
  const frameCount = useRef(0);

  useEffect(() => {
    startCamera();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.autoplay = true;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        
        const handleVideoReady = async () => {
          try {
            await videoRef.current.play();
            console.log('Video playing, starting ASCII conversion...');
            setIsPlaying(true);
            processVideo();
          } catch (playError) {
            console.error('Play error:', playError);
          }
        };
        
        videoRef.current.addEventListener('loadedmetadata', handleVideoReady);
        videoRef.current.addEventListener('canplay', handleVideoReady);
        
        // Force play attempt
        setTimeout(() => {
          if (videoRef.current && !isPlaying) {
            handleVideoReady();
          }
        }, 500);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setAsciiArt('Camera access denied. Please refresh and allow camera access.');
    }
  };

  const processVideo = () => {
    console.log('processVideo called, isPlaying:', isPlaying);
    if (!videoRef.current || !canvasRef.current) {
      console.log('Missing refs');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.log('Video dimensions not ready, retrying...');
      setTimeout(processVideo, 100);
      return;
    }

    console.log('Video ready, dimensions:', video.videoWidth, 'x', video.videoHeight);
    
    const aspectRatio = video.videoWidth / video.videoHeight;
    const width = resolution;
    const height = Math.floor(resolution / aspectRatio);
    
    canvas.width = width;
    canvas.height = height;

    const drawFrame = (currentTime) => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
        return;
      }

      // Limit to ~15 FPS for better performance
      if (currentTime - lastFrameTime.current < 66) {
        animationRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      lastFrameTime.current = currentTime;

      try {
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const ascii = convertToASCII(imageData, width, height);
        setAsciiArt(ascii);
      } catch (error) {
        console.error('Error in drawFrame:', error);
      }

      animationRef.current = requestAnimationFrame(drawFrame);
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    console.log('Starting animation loop');
    drawFrame();
  };


  const convertToASCII = (imageData, width, height) => {
    const chars = charSet.split('');
    
    // Calculate font size to keep display area constant (only every few frames)
    if (frameCount.current % 10 === 0) {
      const targetWidth = window.innerWidth * 0.95;
      const targetHeight = window.innerHeight * 0.85;
      const calculatedFontSize = Math.min(targetWidth / width, targetHeight / height);
      setFontSize(Math.max(3, Math.min(25, calculatedFontSize)));
    }
    frameCount.current++;
    
    // Simple ASCII conversion
    let ascii = '';
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4;
        const r = imageData.data[offset];
        const g = imageData.data[offset + 1];
        const b = imageData.data[offset + 2];
        
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
        const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
        ascii += chars[chars.length - 1 - charIndex];
      }
      ascii += '\n';
    }
    
    return ascii;
  };

  useEffect(() => {
    if (isPlaying && videoRef.current && videoRef.current.srcObject) {
      console.log('Settings changed, restarting video processing...');
      processVideo();
    }
  }, [resolution, charSet, isPlaying]);

  return (
    <div className="app">
      <div className="controls">
        <div className="control">
          <label>Resolution: {resolution}</label>
          <input
            type="range"
            min="40"
            max="200"
            value={resolution}
            onChange={(e) => setResolution(parseInt(e.target.value))}
          />
        </div>
        
        <div className="control">
          <label>Style:</label>
          <select value={charSet} onChange={(e) => setCharSet(e.target.value)}>
            <option value="@%#*+=-:. ">Classic</option>
            <option value="█▉▊▋▌▍▎▏ ">Blocks</option>
            <option value="MNHQOdbpqwmZO2J3G6hg9#&8@$">Detailed</option>
            <option value=".:;+=xX$&">Simple</option>
            <option value="01 ">Binary</option>
            <option value="╬╦╩╠╣║═│┌┐└┘ ">Lines</option>
            <option value="▓▒░ ">Sketch</option>
          </select>
        </div>
        
      </div>

      <div className="ascii-display">
        <div 
          className="ascii-art" 
          style={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: `${fontSize}px` 
          }}
        >
          <pre style={{ 
            margin: 0, 
            fontFamily: 'Courier New, monospace',
            whiteSpace: 'pre',
            letterSpacing: 0,
            wordSpacing: 0
          }}>
            {typeof asciiArt === 'string' ? asciiArt : 'Starting camera...'}
          </pre>
        </div>
      </div>

      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default App;