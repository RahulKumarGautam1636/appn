import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { 
  Circle, 
  Path, 
  Polygon, 
  Rect, 
  Text as SvgText,
  G 
} from 'react-native-svg';

const SuccessIllustration = ({ size = 400, onAnimationComplete }: any) => {
  // Animation values
  const circleScale = useRef(new Animated.Value(0)).current;
  const checkmarkProgress = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const starRotation1 = useRef(new Animated.Value(0)).current;
  const starRotation2 = useRef(new Animated.Value(0)).current;
  const starRotation3 = useRef(new Animated.Value(0)).current;
  const starRotation4 = useRef(new Animated.Value(0)).current;
  const confettiY = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Main success animation sequence
    const mainSequence = Animated.sequence([
      // Circle grows
      Animated.timing(circleScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      // Checkmark appears
      Animated.timing(checkmarkProgress, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // Text fades in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    // Continuous star rotations
    const starAnimations = Animated.parallel([
      Animated.loop(
        Animated.timing(starRotation1, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.timing(starRotation2, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.timing(starRotation3, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.timing(starRotation4, {
          toValue: 1,
          duration: 3500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]);

    // Confetti animation
    const confettiAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(confettiY, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(confettiY, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Start animations
    mainSequence.start(onAnimationComplete);
    starAnimations.start();
    confettiAnimation.start();
    pulseAnimation.start();

    // Cleanup function
    return () => {
      mainSequence.stop();
      starAnimations.stop();
      confettiAnimation.stop();
      pulseAnimation.stop();
    };
  }, [onAnimationComplete]);

  // Interpolation values
  const star1Rotation = starRotation1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const star2Rotation = starRotation2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg']
  });

  const star3Rotation = starRotation3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const star4Rotation = starRotation4.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg']
  });

  const confettiTranslateY = confettiY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80]
  });

  const checkmarkOpacity = checkmarkProgress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1]
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 400 400">
        {/* Background Circle */}
        <Circle
          cx="200"
          cy="200"
          r="180"
          fill="#f0fdf4"
          stroke="#22c55e"
          strokeWidth="2"
          opacity="0.3"
        />
        
        {/* Pulse Circles */}
        <G opacity="0.4">
          <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
            <Circle cx="120" cy="160" r="15" fill="#22c55e" opacity="0.6" />
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
            <Circle cx="300" cy="180" r="20" fill="#22c55e" opacity="0.6" />
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
            <Circle cx="100" cy="250" r="12" fill="#22c55e" opacity="0.6" />
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
            <Circle cx="320" cy="240" r="18" fill="#22c55e" opacity="0.6" />
          </Animated.View>
        </G>

        {/* Confetti */}
        <G opacity="0.8">
          <Animated.View style={{ transform: [{ translateY: confettiTranslateY }] }}>
            <Rect x="130" y="100" width="6" height="6" fill="#ef4444" rx="1" />
          </Animated.View>
          <Animated.View style={{ transform: [{ translateY: confettiTranslateY }] }}>
            <Rect x="280" y="120" width="6" height="6" fill="#3b82f6" rx="1" />
          </Animated.View>
          <Animated.View style={{ transform: [{ translateY: confettiTranslateY }] }}>
            <Rect x="150" y="90" width="6" height="6" fill="#8b5cf6" rx="1" />
          </Animated.View>
          <Animated.View style={{ transform: [{ translateY: confettiTranslateY }] }}>
            <Rect x="300" y="110" width="6" height="6" fill="#f59e0b" rx="1" />
          </Animated.View>
        </G>

        {/* Rotating Stars */}
        <G fill="#fbbf24" opacity="0.9">
          <Animated.View style={{ transform: [{ rotate: star1Rotation }] }}>
            <Polygon
              points="100,120 105,130 115,130 107,137 110,147 100,140 90,147 93,137 85,130 95,130"
              origin="100,120"
            />
          </Animated.View>
          <Animated.View style={{ transform: [{ rotate: star2Rotation }] }}>
            <Polygon
              points="320,150 325,160 335,160 327,167 330,177 320,170 310,177 313,167 305,160 315,160"
              origin="320,150"
            />
          </Animated.View>
          <Animated.View style={{ transform: [{ rotate: star3Rotation }] }}>
            <Polygon
              points="80,280 85,290 95,290 87,297 90,307 80,300 70,307 73,297 65,290 75,290"
              origin="80,280"
            />
          </Animated.View>
          <Animated.View style={{ transform: [{ rotate: star4Rotation }] }}>
            <Polygon
              points="340,280 345,290 355,290 347,297 350,307 340,300 330,307 333,297 325,290 335,290"
              origin="340,280"
            />
          </Animated.View>
        </G>

        {/* Main Success Circle */}
        <Animated.View style={{ transform: [{ scale: circleScale }] }}>
          <Circle cx="200" cy="200" r="80" fill="#22c55e" />
        </Animated.View>
        
        {/* Checkmark */}
        <Animated.View style={{ opacity: checkmarkOpacity }}>
          <Path
            d="M160 200 L185 225 L240 175"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Animated.View>
        
        {/* Success Text */}
        <Animated.View style={{ opacity: textOpacity }}>
          <SvgText
            x="200"
            y="320"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            fill="#22c55e"
          >
            Success!
          </SvgText>
        </Animated.View>
      </Svg>
    </View>
  );
};

export default SuccessIllustration;

// Usage example:
/*
import SuccessIllustration from './SuccessIllustration';

function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <SuccessIllustration 
        size={300} 
        onAnimationComplete={() => console.log('Animation completed!')}
      />
    </View>
  );
}
*/