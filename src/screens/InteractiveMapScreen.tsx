import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Share,
  Platform,
  Animated,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useMapRegion } from '../../src/context/MapRegionContext';

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

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
  { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
  { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
];

function parseCoord(coordStr: string) {
  const [latRaw, lngRaw] = coordStr.split(',');
  const extractValue = (raw: string) => {
    const [numPart, dir] = raw.trim().replace('°', '').split(' ');
    const value = Math.abs(parseFloat(numPart));
    return dir === 'S' || dir === 'W' ? -value : value;
  };
  return {
    latitude: extractValue(latRaw),
    longitude: extractValue(lngRaw),
  };
}

export default function InteractiveMapScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { region, setRegion } = useMapRegion();

  const imageAnim = useRef(new Animated.Value(0)).current; 
  const contentAnim = useRef(new Animated.Value(0)).current; 
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedPlace) {
      setIsModalVisible(true);
      Animated.sequence([
        Animated.timing(modalAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(imageAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(contentAnim, {
            toValue: 1,
            duration: 400,
            delay: 150,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
        Animated.timing(modalAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsModalVisible(false);
        });
    }
  }, [selectedPlace]);

  const animatedModalStyle = {
    opacity: modalAnim,
    transform: [{
      translateY: modalAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
      }),
    }],
  };
  
  const animatedImageStyle = {
    opacity: imageAnim,
    transform: [{
      translateY: imageAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
      }),
    }],
  };

  const animatedContentStyle = {
    opacity: contentAnim,
    transform: [{
      translateY: contentAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
      }),
    }],
  };

  const headerImageOpacity = useRef(new Animated.Value(0)).current;
  const headerTitleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerImageOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headerTitleOpacity, {
        toValue: 1,
        duration: 600,
        delay: 100, 
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const animatedHeaderImageStyle = { opacity: headerImageOpacity };
  const animatedHeaderTitleStyle = { opacity: headerTitleOpacity };

  const resetAnimations = () => {
      imageAnim.setValue(0);
      contentAnim.setValue(0);
      modalAnim.setValue(0);
  };

  const handleCloseModal = () => {
    Animated.timing(modalAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    }).start(() => {
        resetAnimations();
        setSelectedPlace(null);
    });
  };

  const handleShare = () => {
    if (!selectedPlace) return;
    Share.share({
      message: `Check out ${selectedPlace}: ${coordinatesMap[selectedPlace]}`,
    });
  };

  return (
    <ImageBackground
      source={require('../assets/images/background_popular.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.backButton}>
            <Image
              source={require('../assets/images/clarity_arrow-line.png')}
              style={styles.backIcon}
            />
          </LinearGradient>
        </TouchableOpacity>
        <Animated.Image
          source={require('../assets/images/onboarding_icone.png')}
          style={[styles.logo, animatedHeaderImageStyle]}
          resizeMode="contain"
        />
      </View>

      <Animated.Text style={[styles.title, animatedHeaderTitleStyle]}>INTERACTIVE MAP</Animated.Text>

      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        customMapStyle={darkMapStyle}
      >
        {Object.entries(coordinatesMap).map(([title, coordStr], index) => {
          const coords = parseCoord(coordStr);
          return (
            <Marker
              key={index}
              coordinate={coords}
              onPress={() => {
                resetAnimations();
                setSelectedPlace(title);
              }}
              pinColor="#6BEFFF"
              title={title} 
            />
          );
        })}
      </MapView>

      <Modal transparent animationType="fade" visible={isModalVisible}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, animatedModalStyle]}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeIconWrapper}
            >
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>

            <Animated.Image
              source={selectedPlace ? imageMap[selectedPlace] : undefined}
              style={[styles.modalImage, animatedImageStyle]}
              resizeMode="cover"
            />
            <Animated.View style={animatedContentStyle}>
              <Text style={styles.modalTitle}>{selectedPlace}</Text>
              <View style={styles.starsRow}>
                {[...Array(5)].map((_, i) => (
                  <Image
                    key={i}
                    source={require('../assets/images/symbols-light_star-rounded.png')}
                    style={styles.starIcon}
                  />
                ))}
              </View>
              <View style={styles.coordRow}>
                <Image
                  source={require('../assets/images/flowbite_map-pin-outline.png')}
                  style={styles.coordIcon}
                />
                <Text style={styles.coordText}>{selectedPlace ? coordinatesMap[selectedPlace] : ''}</Text>
              </View>
              <Text style={styles.modalDesc}>{selectedPlace ? descriptionMap[selectedPlace] : ''}</Text>
            </Animated.View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PlaceDetail', {
                    place: {
                      title: selectedPlace!,
                      imageName: selectedPlace!,
                      description: descriptionMap[selectedPlace!],
                    },
                    from: 'InteractiveMap', 
                  });
                  handleCloseModal();
                }}
                style={styles.readMoreButton}
              >
                <LinearGradient
                  colors={['#6BEFFF', '#43B3C1', '#005B66']}
                  locations={[0, 0.17, 1]}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>READ MORE</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleShare} 
                style={styles.shareButton}
              >
                <LinearGradient
                  colors={['#6BEFFF', '#43B3C1', '#005B66']}
                  locations={[0, 0.17, 1]}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>SHARE</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    position: 'relative',
    height: 150,
  },
  backButtonContainer: {
    width: 72,
    height: 67,
    position: 'absolute',
    left: 16,
    top: 100,
    zIndex: 1,
  },
  backButton: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
    transform: [{ rotate: '180deg' }],
  },
  logo: {
    width: 107,
    height: 107,
    position: 'absolute',
    top: 60,
    left: '50%',
    marginLeft: -48,
    zIndex: 0,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 16,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#001619',
    borderRadius: 15,
    padding: 20,
    width: '95%',
    maxWidth: 450,
    alignItems: 'center',
  },
  closeIconWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'black',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
  },
  closeIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  coordIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  coordText: {
    color: '#fff',
    fontSize: 14,
  },
  modalDesc: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  readMoreButton: {
    width: 79,
    height: 31,
  },
  shareButton: {
    width: 63,
    height: 31,
  },
  gradientButton: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});