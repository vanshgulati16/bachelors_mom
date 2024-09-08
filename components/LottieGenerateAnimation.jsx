import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

const LottieGenerateAnimation = ({ height = 300, width = 300 }) => {
  // Dynamically import animation data
  const [animationData, setAnimationData] = React.useState(null);

  React.useEffect(() => {
    import('@/public/animation/generateAnimation').then((module) => {
      setAnimationData(module.default);
    });
  }, []);

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

  if (!animationData) {
    return <div style={containerStyle}></div>; // Or some loading placeholder
  }

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