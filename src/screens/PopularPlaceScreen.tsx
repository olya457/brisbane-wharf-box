import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

const popularPlaces = [
  { image: 'popular_place_image1.png', title: 'COOCHIEMUDLO ISLAND' },
  { image: 'popular_place_image2.png', title: 'SOUTH BANK PARKLANDS' },
  { image: 'popular_place_image3.png', title: 'NEWSTEAD HOUSE' },
  { image: 'popular_place_image4.png', title: 'BRISBANE RIVERWALK' },
  { image: 'popular_place_image5.png', title: 'EAT STREET NORTHSHORE' },
  { image: 'popular_place_image6.png', title: 'QUEENSLAND ART GALLERY &\nGALLERY OF MODERN ART (QAGOMA)' },
  { image: 'popular_place_image7.png', title: 'XXXX BREWERY TOUR' },
  { image: 'popular_place_image8.png', title: 'OLD WINDMILL TOWER' },
  { image: 'popular_place_image9.png', title: 'CITY BOTANIC GARDENS' },
  { image: 'popular_place_image10.png', title: 'SHRINE OF REMEMBRANCE (ANZAC SQUARE)' },
  { image: 'popular_place_image11.png', title: 'KANGAROO POINT CLIFFS' },
  { image: 'popular_place_image12.png', title: 'QUEENSLAND MUSEUM' },
  { image: 'popular_place_image13.png', title: 'MOUNT COOT-THA LOOKOUT' },
  { image: 'popular_place_image14.png', title: 'LONE PINE KOALA SANCTUARY' },
];

const imageMap: { [key: string]: any } = {
  'popular_place_image1.png': require('../assets/images/popular_place_image1.png'),
  'popular_place_image2.png': require('../assets/images/popular_place_image2.png'),
  'popular_place_image3.png': require('../assets/images/popular_place_image3.png'),
  'popular_place_image4.png': require('../assets/images/popular_place_image4.png'),
  'popular_place_image5.png': require('../assets/images/popular_place_image5.png'),
  'popular_place_image6.png': require('../assets/images/popular_place_image6.png'),
  'popular_place_image7.png': require('../assets/images/popular_place_image7.png'),
  'popular_place_image8.png': require('../assets/images/popular_place_image8.png'),
  'popular_place_image9.png': require('../assets/images/popular_place_image9.png'),
  'popular_place_image10.png': require('../assets/images/popular_place_image10.png'),
  'popular_place_image11.png': require('../assets/images/popular_place_image11.png'),
  'popular_place_image12.png': require('../assets/images/popular_place_image12.png'),
  'popular_place_image13.png': require('../assets/images/popular_place_image13.png'),
  'popular_place_image14.png': require('../assets/images/popular_place_image14.png'),
};

export default function PopularPlaceScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const [scaleAnims] = useState(popularPlaces.map(() => new Animated.Value(1)));

  useEffect(() => {
    if (isFocused) {
      logoAnim.setValue(0);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused]); 

  const handlePressIn = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      source={require('../assets/images/background_popular.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backWrapper}>
            <LinearGradient
              colors={['#6BEFFF', '#43B3C1', '#005B66']}
              style={styles.backButton}
            >
              <Image
                source={require('../assets/images/clarity_arrow-line.png')}
                style={[styles.backIcon, { transform: [{ rotate: '180deg' }] }]}
              />
            </LinearGradient>
          </TouchableOpacity>

          <Animated.Image
            source={require('../assets/images/onboarding_icone.png')}
            style={[
              styles.centerIcon,
              {
                transform: [{ scale: logoAnim }],
                opacity: logoAnim,
              },
            ]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>POPULAR PLACE</Text>

        <Animated.View style={{ opacity: fadeAnim }}>
          {popularPlaces.map((place, index) => (
            <Pressable
              key={index}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
          
            >
              <Animated.View style={[styles.card, { transform: [{ scale: scaleAnims[index] }] }]}>
                <Image
                  source={imageMap[place.image]}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{place.title}</Text>
                  {}
                  <TouchableOpacity onPress={() => navigation.navigate('PlaceDetail' as any, { place })}>
                    <LinearGradient
                      colors={['#6BEFFF', '#43B3C1', '#005B66']}
                      style={styles.openButton}
                    >
                      <Text style={styles.openButtonText}>OPEN</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </Pressable>
          ))}
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 16,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  centerIcon: {
    width: 107,
    height: 107,
  },
  backWrapper: {
    position: 'absolute',
    left: 0,
    top: 20,
  },
  backButton: {
    width: 72,
    height: 67,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 28,
    height: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  card: {
    width: width - 32,
    backgroundColor: '#001619',
    borderRadius: 11,
    padding: 16,
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: 134,
    borderRadius: 8,
  },
  cardContent: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    textTransform: 'uppercase',
    flex: 1,
    paddingRight: 10,
  },
  openButton: {
    width: 97,
    height: 47,
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});