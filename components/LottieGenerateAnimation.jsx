import React, { useState } from 'react';
import Lottie from 'react-lottie';
import animationData from '@/public/animation/generateAnimation';  // Adjust the path as needed

const LottieGenerateAnimation = ({ height = 300, width = 300 }) => {

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const containerStyle = {
    height,
    width,
    overflow: 'hidden',
    background: 'transparent'
  };


  return (
    <div className="flex flex-col items-center justify-center" style={containerStyle}>
      <Lottie 
        options={defaultOptions}
        height={height}
        width={width}
      />
    </div>
  );
};

export default LottieGenerateAnimation;