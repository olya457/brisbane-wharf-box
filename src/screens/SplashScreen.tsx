import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ImageBackground,
} from 'react-native';

export default function SplashScreen({ navigation }: any) {
  const GRID_SIZE = 3;
  const CELL_SIZE = 26;
  const CELL_SPACING = 6;
  const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

  const animatedScales = useRef(
    Array.from({ length: TOTAL_CELLS }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const createAppearAnimations = () =>
      animatedScales.map((scale, index) =>
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          delay: index * 40,
          useNativeDriver: true,
        })
      );

    const createDisappearAnimations = () =>
      animatedScales.map((scale) =>
        Animated.timing(scale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      );

    const oneCycle = Animated.sequence([
      Animated.stagger(40, createAppearAnimations()),
      Animated.delay(100),
      Animated.parallel(createDisappearAnimations()),
      Animated.delay(200),
    ]);

    const fullAnimation = Animated.sequence([oneCycle, oneCycle, oneCycle]);

    fullAnimation.start(() => {
      navigation.replace('Onboarding');
    });

    return () => {
      fullAnimation.stop();
    };
  }, [animatedScales, navigation]);

  return (
    <ImageBackground
      source={require('../assets/images/background_loading.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.loader}>
        {animatedScales.map((scale, index) => (
          <Animated.View
            key={index}
            style={[
              styles.cell,
              {
                backgroundColor: cellColor(index),
                transform: [{ scale }],
                opacity: scale,
              },
            ]}
          />
        ))}
      </View>
    </ImageBackground>
  );
}

const cellColor = (index: number): string => {
  const colors = [
    '#00FF87', '#0CFD95', '#17FBA2',
    '#23F9B2', '#30F7C3', '#3DF5D4',
    '#45F4DE', '#53F1F0', '#60EFFF',
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 3 * (26 + 6 * 2),
    height: 3 * (26 + 6 * 2),
  },
  cell: {
    width: 26,
    height: 26,
    margin: 6,
    borderRadius: 4,
  },
});
