import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Share,
  Modal,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import type { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';

const coordinatesMap: Record<string, string> = {
   'COOCHIEMUDLO ISLAND': '-27.6406° S, 153.3300° E',
  'SOUTH BANK PARKLANDS': '-27.4811° S, 153.0222° E',
  'NEWSTEAD HOUSE': '-27.4503° S, 153.0457° E',
  'BRISBANE RIVERWALK': '-27.4636° S, 153.0356° E',
  'EAT STREET NORTHSHORE': '-27.4367° S, 153.0786° E',
  'QUEENSLAND ART GALLERY &\nGALLERY OF MODERN ART (QAGOMA)': '-27.4748° S, 153.0171° E',
  'XXXX BREWERY TOUR': '-27.4621° S, 153.0109° E',
  'OLD WINDMILL TOWER': '-27.4650° S, 153.0232° E',
  'CITY BOTANIC GARDENS': '-27.4752° S, 153.0304° E',
  'SHRINE OF REMEMBRANCE (ANZAC SQUARE)': '-27.4666° S, 153.0271° E',
  'KANGAROO POINT CLIFFS': '-27.4814° S, 153.0343° E',
  'QUEENSLAND MUSEUM': '-27.4767° S, 153.0179° E',
  'MOUNT COOT-THA LOOKOUT': '-27.4695° S, 152.9483° E',
  'LONE PINE KOALA SANCTUARY': '-27.5078° S, 152.9756° E',
};

const descriptionMap: Record<string, string> = {
  'COOCHIEMUDLO ISLAND':
    'A small island off Brisbane with white beaches, nature trails and barbecue areas. A place to escape the hustle and bustle of the city and relax in the silence of nature.',
  'SOUTH BANK PARKLANDS':
    'South Bank Parklands is the cultural heart of Brisbane, located on the south bank of the river. Here you will find picturesque gardens, walking paths, numerous cafes and restaurants. A highlight is Streets Beach - an artificial urban lagoon with a sandy beach, where you can relax on a hot day. The park is also the venue for numerous festivals and events throughout the year.',
  'NEWSTEAD HOUSE':
    'Oldest mansion in Brisbane (1846) featuring colonial architecture and views over the river. Open for guided tours and special exhibitions.',
  'BRISBANE RIVERWALK':
    'A floating walking trail above the Brisbane River offering stunning city skyline views. Ideal for strolls and cycling.',
  'EAT STREET NORTHSHORE':
    'A giant open-air food market with dozens of stalls serving international cuisines. Live music, family-friendly atmosphere and river views.',
  'QUEENSLAND ART GALLERY &\nGALLERY OF MODERN ART (QAGOMA)':
    'Two world-class galleries side by side on South Bank, showcasing classical, modern and contemporary works by Australian and international artists.',
  'XXXX BREWERY TOUR':
    'Historic brewery since 1878. Factory tour includes brewing process overview and beer tastings.',
  'OLD WINDMILL TOWER':
    'Brisbane’s oldest surviving building (1828). Once a convict-built windmill, later used as a signal station.',
  'CITY BOTANIC GARDENS':
    'Oasis in the city center featuring tropical and subtropical plants, riverside paths and picnic lawns.',
  'SHRINE OF REMEMBRANCE (ANZAC SQUARE)':
    'A war memorial honouring Australian soldiers. Features the Eternal Flame and ANZAC Day ceremonies.',
  'KANGAROO POINT CLIFFS':
    'Volcanic rock cliffs offering rock-climbing routes and panoramic views of the river and CBD.',
  'QUEENSLAND MUSEUM':
    'Interactive exhibits on natural history, science and culture. Houses dinosaur skeletons and marine displays.',
  'MOUNT COOT-THA LOOKOUT':
    'Brisbane’s highest vantage point. Panoramic city views, café, gift shop; nearby botanic gardens and planetarium.',
  'LONE PINE KOALA SANCTUARY':
    'World’s oldest koala sanctuary. Cuddle koalas, feed kangaroos, watch platypuses and sheepdog shows. Café and picnic areas available.',
};

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

function parseCoord(coordStr: string) {
  const [latRaw, lngRaw] = coordStr.split(',');

  const extractValue = (raw: string) => {
    const [numPart, dir] = raw.trim().replace('°', '').split(' ');
    const value = Math.abs(parseFloat(numPart));
    return (dir === 'S' || dir === 'W') ? -value : value;
  };

  return {
    latitude: extractValue(latRaw),
    longitude: extractValue(lngRaw),
  };
}

const customMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#2a2e34"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
];

export default function PlaceDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const isFocused = useIsFocused();
  
  const { place } = route.params as { place: { imageName: string; title: string } };

  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const screen = Dimensions.get('window');
  const modalWidth = Math.min(361, screen.width * 0.9);
  const modalHeight = Math.min(487, screen.height * 0.9);

  const coordText = coordinatesMap[place.title] || '';
  const coords = coordText ? parseCoord(coordText) : { latitude: 0, longitude: 0 };
  const description = descriptionMap[place.title] || `Details about ${place.title}`;
  
  const starsFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonsFadeAnim = useRef(new Animated.Value(0)).current;
  const headerIconAnim = useRef(new Animated.Value(0)).current;

  const runAnimations = () => {
    starsFadeAnim.setValue(0);
    buttonsFadeAnim.setValue(0);
    headerIconAnim.setValue(0);
  
    Animated.parallel([
      Animated.spring(headerIconAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(starsFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {

    AsyncStorage.getItem('FAVORITE_PLACES').then(saved => {
      if (saved) {
        const arr = JSON.parse(saved);
        setIsFavorite(arr.some((p: any) => p.title === place.title));
      }
    });

    if (isFocused) {
      runAnimations();
    }
  }, [place.title, isFocused]);

  useEffect(() => {
    if (!showMap) {
      runAnimations();
    }
  }, [showMap]);

  const handleFavoritePress = async () => {
    const saved = await AsyncStorage.getItem('FAVORITE_PLACES');
    let arr = saved ? JSON.parse(saved) : [];
    const exists = arr.some((p: any) => p.title === place.title);

    if (exists) {
      arr = arr.filter((p: any) => p.title !== place.title);
      setIsFavorite(false);
    } else {
      arr.push({ title: place.title, imageName: place.imageName }); 
      setIsFavorite(true);
      setShowFavoriteModal(true);
    }
    await AsyncStorage.setItem('FAVORITE_PLACES', JSON.stringify(arr));
  };

  const onShare = () => {
    Share.share({ message: `Check out this place: ${place.title}!\nCoordinates: ${coordText}` });
  };

 
  return (
    <ImageBackground
      source={require('../assets/images/background_popular.png')}
      style={[styles.container, { backgroundColor: 'black' }]}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View
          style={{
            alignItems: 'center',
            marginTop: (StatusBar.currentHeight || 30) + 10,
            marginBottom: 24,
          }}
        >
         <TouchableOpacity
  onPress={() => {
    if (showMap) {
      setShowMap(false);
    } else if ((route.params as { from?: string })?.from === 'InteractiveMap') { 
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } else {
      navigation.goBack();
    }
  }}
  style={{
    position: 'absolute',
    left: 0,
    bottom: 5,
  }}
>
            <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.backButton}>
              <Image
                source={require('../assets/images/clarity_arrow-line.png')}
                style={{
                  width: 28,
                  height: 28,
                  transform: [{ rotate: '180deg' }],
                }}
              />
            </LinearGradient>
          </TouchableOpacity>

          <Animated.Image
            source={require('../assets/images/onboarding_icone.png')}
            style={[
              { width: 107, height: 107 },
              { opacity: headerIconAnim, transform: [{ scale: headerIconAnim }] }
            ]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{place.title}</Text>
        
        <Animated.View style={[styles.starsRow, { opacity: starsFadeAnim }]}>
          {Array.from({ length: ['COOCHIEMUDLO ISLAND', 'SOUTH BANK PARKLANDS', 'LONE PINE KOALA SANCTUARY', 'MOUNT COOT-THA LOOKOUT', 'CITY BOTANIC GARDENS', 'OLD WINDMILL TOWER', 'XXXX BREWERY TOUR', 'BRISBANE RIVERWALK', 'NEWSTEAD HOUSE'].includes(place.title) ? 4 : 5 }).map((_, index) => (
            <Image
              key={index}
              source={require('../assets/images/symbols-light_star-rounded.png')}
              style={styles.starIcon}
            />
          ))}
        </Animated.View>
        
        {showMap ? (
          <View style={styles.mapContainer}>
            <MapView
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              style={styles.map}
              region={{
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
              customMapStyle={customMapStyle}
            >
              <Marker
                coordinate={coords}
                title={place.title}
                pinColor="#6BEFFF" 
              />
            </MapView>
          </View>
        ) : (
          <>
            <Image source={imageMap[place.title]} style={styles.image} resizeMode="cover" />
            <View style={styles.coordBox}>
              <Image
                source={require('../assets/images/flowbite_map-pin-outline.png')}
                style={styles.coordIcon}
              />
              <Text style={styles.coordText}>{coordText}</Text>
            </View>
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
            
            <Animated.View style={[styles.actionRow, { opacity: buttonsFadeAnim }]}>
              <TouchableOpacity onPress={onShare}>
                <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.shareBtn}>
                  <Text style={styles.shareText}>SHARE</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowMap(true)}>
                <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.iconBtn}>
                  <Image source={require('../assets/images/ri_road-map-line.png')} style={styles.icon} />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFavoritePress}>
                <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.iconBtn}>
                  <Image
                    source={
                      isFavorite
                        ? require('../assets/images/lucide_heart_filled_white.png')
                        : require('../assets/images/lucide_heart.png')
                    }
                    style={styles.icon}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </ScrollView>

      <Modal visible={showFavoriteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentWrapper}>
            <Image
              source={require('../assets/images/popup_background.png')}
              style={[styles.modalImage, { width: modalWidth, height: modalHeight }]}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => setShowFavoriteModal(false)} style={styles.modalCloseButtonWrapper}>
              <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.closeButton}>
                <Text style={styles.closeText}>CLOSE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  coordBox: {
    flexDirection: 'row',
    backgroundColor: '#001619',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  coordIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  coordText: {
    color: 'white',
    fontSize: 15,
  },
  descriptionBox: {
    backgroundColor: '#001619',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  descriptionText: {
    color: 'white',
    fontSize: 15,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  shareBtn: {
    width: 132,
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  iconBtn: {
    width: 75,
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { width: 24, height: 24 },
  mapContainer: {
    width: 361,
    height: 487,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentWrapper: {
    alignItems: 'center',
  },
  modalImage: {
    borderRadius: 20,
  },
  modalCloseButtonWrapper: {
    marginTop: -30,
  },
  closeButton: {
    width: 206,
    height: 82,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    width: 72,
    height: 67,
    borderTopRightRadius: 11,
    borderBottomRightRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  starIcon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
});