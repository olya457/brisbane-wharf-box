import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Share,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const { width, height } = Dimensions.get('window');

const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;

const places = [
  'COOCHIEMUDLO ISLAND',
  'SOUTH BANK PARKLANDS',
  'NEWSTEAD HOUSE',
  'BRISBANE RIVERWALK',
  'EAT STREET NORTHSHORE',
  'QUEENSLAND ART GALLERY &\nGALLERY OF MODERN ART (QAGOMA)',
  'XXXX BREWERY TOUR',
  'OLD WINDMILL TOWER',
  'CITY BOTANIC GARDENS',
  'SHRINE OF REMEMBRANCE (ANZAC SQUARE)',
  'KANGAROO POINT CLIFFS',
  'QUEENSLAND MUSEUM',
  'MOUNT COOT-THA LOOKOUT',
  'LONE PINE KOALA SANCTUARY',
];

const imageMap: Record<string, any> = {
  'COOCHIEMUDLO ISLAND': require('../assets/images/popular_place_image1.png'),
  'SOUTH BANK PARKLANDS': require('../assets/images/popular_place_image2.png'),
  'NEWSTEAD HOUSE': require('../assets/images/popular_place_image3.png'),
  'BRISBANE RIVERWALK': require('../assets/images/popular_place_image4.png'),
  'EAT STREET NORTHSHORE': require('../assets/images/popular_place_image5.png'),
  'QUEENSLAND ART GALLERY &\nGALLERY OF MODERN ART (QAGOMA)': require('../assets/images/popular_place_image6.png'),
  'XXXX BREWERY TOUR': require('../assets/images/popular_place_image7.png'),
  'OLD WINDMILL TOWER': require('../assets/images/popular_place_image8.png'),
  'CITY BOTANIC GARDENS': require('../assets/images/popular_place_image9.png'),
  'SHRINE OF REMEMBRANCE (ANZAC SQUARE)': require('../assets/images/popular_place_image10.png'),
  'KANGAROO POINT CLIFFS': require('../assets/images/popular_place_image11.png'),
  'QUEENSLAND MUSEUM': require('../assets/images/popular_place_image12.png'),
  'MOUNT COOT-THA LOOKOUT': require('../assets/images/popular_place_image13.png'),
  'LONE PINE KOALA SANCTUARY': require('../assets/images/popular_place_image14.png'),
};

const descriptionMap: Record<string, string> = {
  'COOCHIEMUDLO ISLAND': 'A small island off Brisbane with white beaches, nature trails and barbecue areas.',
  'SOUTH BANK PARKLANDS': 'South Bank Parklands is the cultural heart of Brisbane with gardens, walking paths, and cafes.',
  'NEWSTEAD HOUSE': 'Oldest mansion in Brisbane (1846), open for guided tours and exhibitions.',
  'BRISBANE RIVERWALK': 'A floating trail above the Brisbane River ideal for strolls and cycling.',
  'EAT STREET NORTHSHORE': 'A giant food market with international cuisines and live music.',
  'QUEENSLAND ART GALLERY &\nGALLERY OF MODERN ART (QAGOMA)': 'Two galleries showcasing classical and modern art.',
  'XXXX BREWERY TOUR': 'Historic brewery with tours and beer tastings.',
  'OLD WINDMILL TOWER': 'Brisbane’s oldest building, once a windmill and signal station.',
  'CITY BOTANIC GARDENS': 'Oasis in the city with tropical plants and riverside paths.',
  'SHRINE OF REMEMBRANCE (ANZAC SQUARE)': 'A memorial honouring Australian soldiers.',
  'KANGAROO POINT CLIFFS': 'Rock-climbing cliffs with panoramic views.',
  'QUEENSLAND MUSEUM': 'Interactive exhibits on natural history and culture.',
  'MOUNT COOT-THA LOOKOUT': 'Panoramic views, botanic gardens and planetarium.',
  'LONE PINE KOALA SANCTUARY': 'World’s oldest koala sanctuary with animal interactions.',
};

export default function RandomPlaceScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [place, setPlace] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonsFadeAnim = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    fadeAnim.setValue(0);
    buttonsFadeAnim.setValue(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.timing(buttonsFadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();
  };

  const pickRandomPlace = () => {
    const newPlace = places[Math.floor(Math.random() * places.length)];
    setPlace(newPlace);
    animateIn();
  };

  useEffect(() => {
    pickRandomPlace();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      animateIn();
    }, [])
  );

  const handleShare = () => {
    if (place) {
      Share.share({
        message: `Check out ${place}!`,
      });
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/background_random.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.topImageWrapper}>
        <Image source={require('../assets/images/random_place.png')} style={styles.topImage} />
      </View>

      {place && (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Image source={imageMap[place]} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{place}</Text>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, index) => (
                <Image
                  key={index}
                  source={require('../assets/images/symbols-light_star-rounded.png')}
                  style={styles.starIcon}
                />
              ))}
            </View>

            <Animated.View style={[styles.cardButtons, { opacity: buttonsFadeAnim }]}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('PlaceDetail', {
                    place: {
                      title: place,
                      imageName: place,
                      description: descriptionMap[place],
                    },
                  })
                }
              >
                <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.cardButton}>
                  <Text style={styles.cardButtonText}>READ MORE</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleShare}>
                <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.cardButton}>
                  <Text style={styles.cardButtonText}>SHARE</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      )}

      <Animated.View style={[styles.bottomButtons, { opacity: buttonsFadeAnim }]}>
        <TouchableOpacity onPress={pickRandomPlace}>
          <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.newPlaceButton}>
            <Text style={styles.newPlaceText}>NEW PLACE</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>CLOSE</Text>
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topImageWrapper: {
    alignItems: 'center',
    marginTop: verticalScale(70),
  },
  topImage: {
    width: scale(360),
    height: verticalScale(90),
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: '#001619',
    borderRadius: 12,
    marginTop: verticalScale(54),
    marginHorizontal: scale(16),
    padding: scale(16),
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: verticalScale(160),
    borderRadius: 10,
  },
  cardContent: {
    marginTop: verticalScale(10),
    alignItems: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: scale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(8),
    textTransform: 'uppercase',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  starIcon: {
    width: scale(18),
    height: scale(18),
    marginHorizontal: scale(2),
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(12),
  },
  cardButton: {
    width: scale(110),
    height: verticalScale(40),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: scale(13),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: verticalScale(120),
    alignSelf: 'center',
    alignItems: 'center',
  },
  newPlaceButton: {
    width: scale(206),
    height: verticalScale(81),
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  newPlaceText: {
    color: 'white',
    fontSize: scale(24),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  closeText: {
    color: 'white',
    fontSize: scale(22),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
