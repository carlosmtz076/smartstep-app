import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function CircleProgressBar({ progress, limit, size = 250, strokeWidth = 20, progressColor = '#00AAFF', backgroundColor = '#eee' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(progress / limit, 1);
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={progressColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.centerContent}>
        <Text style={styles.progressText}>{progress}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
});
