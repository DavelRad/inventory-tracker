// components/WebcamCapture.js
import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';

const WebcamCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const storageRef = ref(storage, `images/${Date.now()}.jpg`);

    try {
      await uploadString(storageRef, imageSrc, 'data_url');
      const url = await getDownloadURL(storageRef);
      onCapture(url); // Return the URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  }, [webcamRef, onCapture]);

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
      />
      <button onClick={capture}>Capture photo</button>
    </>
  );
};

export default WebcamCapture;
