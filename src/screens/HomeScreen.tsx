import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const logoAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoAnim, buttonsAnim]);

  return (
    <ImageBackground
      source={require('../assets/images/background_loading.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <Animated.View
        style={[
          styles.topImageWrapper,
          {
            opacity: logoAnim,
            transform: [
              {
                translateY: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={require('../assets/images/onboarding_image_three.png')}
          style={styles.topImage}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonsWrapper,
          {
            opacity: buttonsAnim,
            transform: [
              {
                translateY: buttonsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
        ]}
      >
        <HomeButton
          title="POPULAR PLACE"
          icon={require('../assets/images/clarity_arrow-line.png')}
          onPress={() => navigation.navigate('PopularPlace')}
        />
        <HomeButton
          title="INTERACTIVE MAP"
          icon={require('../assets/images/flowbite_map-pin-outline.png')}
          onPress={() => navigation.navigate('InteractiveMap')}
        />
        <HomeButton
          title="FAVORITE PLACE"
          icon={require('../assets/images/lucide_heart.png')}
          onPress={() => navigation.navigate('FavoritePlace')}
        />
        <TouchableOpacity onPress={() => navigation.navigate('RandomPlace')}>
          <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.outlinedWrapper}>
            <View style={styles.outlinedButton}>
              <Text style={styles.buttonText}>RANDOM PLACE</Text>
              <Image
                source={require('../assets/images/tabler_brand-safari.png')}
                style={styles.icon}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
}

function HomeButton({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.button}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>{title}</Text>
          <Image source={icon} style={styles.icon} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.03,
    justifyContent: 'flex-start',
  },
  topImageWrapper: {
    alignItems: 'center',
    marginTop: height * 0.06,
    marginBottom: height * 0.03,
  },
  topImage: {
    width: width * 0.7,
    height: width * 0.7,
  },
  buttonsWrapper: {
    gap: height * 0.02,
    alignItems: 'center',
  },
  button: {
    width: width * 0.88,
    height: height * 0.11,
    borderRadius: 14,
    padding: 3,
  },
  buttonContent: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: '#fff',
    fontSize: width < 350 ? 16 : 20,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  icon: {
    width: width * 0.07,
    height: width * 0.07,
    marginLeft: 8,
    resizeMode: 'contain',
  },
  outlinedWrapper: {
    width: width * 0.88,
    height: height * 0.11,
    borderRadius: 14,
    padding: 5,
  },
  outlinedButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
