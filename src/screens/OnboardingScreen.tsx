import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const onboardingData = [
  {
    background: require('../assets/images/onboarding_background_one.png'),
    title: "Hi, I'm Nick - your guide to \nbright and sunny Brisbane!",
    description:
      'Ready to embark on an unforgettable journey\n through a city where modernity embraces nature?',
    buttonLabel: 'HELLO',
  },
  {
    background: require('../assets/images/onboarding_background_two.png'),
    title: 'I have collected for you the\n most popular places in Brisbane',
    description:
      'You decide what to explore — \nor let me pick a random location.',
    buttonLabel: 'CONTINUE',
  },
  {
    background: require('../assets/images/background_loading.png'),
    title: "Let's not waste any time!",
    description:
      'Your Brisbane is waiting - with a coffee in your hand \nand a breeze from the river.\nPress "Start" and come and surprise yourself \nwith the city with me!',
    buttonLabel: 'START',
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [page, setPage] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  const animateContent = useCallback(() => {
    iconAnim.setValue(0);
    textAnim.setValue(0);

    Animated.stagger(200, [
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [iconAnim, textAnim]);

  useEffect(() => {
    animateContent();
  }, [page, animateContent]);

  const handleNext = () => {
    if (page < onboardingData.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setPage((prev) => prev + 1);
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    } else {
      navigation.replace('Home');
    }
  };

  const current = onboardingData[page];
  const isThirdPage = page === 2;
  const shiftDown = isThirdPage ? height * 0.04 : 0;

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ImageBackground source={current.background} style={styles.background} resizeMode="cover">
          <View style={styles.content}>
            {}
            {(page === 0 || page === 1) && (
              <Animated.Image
                source={require('../assets/images/onboarding_icone.png')}
                style={[
                  styles.icon,
                  {
                    transform: [{ scale: iconAnim }],
                    opacity: iconAnim,
                  },
                ]}
                resizeMode="contain"
              />
            )}

            {}
            <Animated.View style={[styles.textBlock, { opacity: textAnim, marginTop: shiftDown }]}>
              <Text style={styles.title}>{current.title}</Text>
              <Text style={styles.description}>{current.description}</Text>
              {isThirdPage && (
                <Image
                  source={require('../assets/images/onboarding_image_three.png')}
                  style={styles.imageThree}
                  resizeMode="contain"
                />
              )}
            </Animated.View>

            <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#6BEFFF', '#43B3C1', '#005B66']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{current.buttonLabel}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: height * 0.08,
    paddingHorizontal: 20,
  },
  icon: {
    width: 107,
    height: 107,
    marginBottom: height * 0.03,
  },
  imageThree: {
    width: width * 0.8,
    height: width * 0.8,
    marginTop: height * 0.04,
  },
  textBlock: {
    alignItems: 'center',
    width: '90%',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  button: {
    width: 231,
    height: 80,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
});
