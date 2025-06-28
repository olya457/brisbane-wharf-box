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
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

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

export default function FavoritePlaceScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const [favoritePlaces, setFavoritePlaces] = useState<any[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const [scaleAnims, setScaleAnims] = useState<Animated.Value[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const saved = await AsyncStorage.getItem('FAVORITE_PLACES');
      if (saved) {
        const data = JSON.parse(saved);
        setFavoritePlaces(data);
        setScaleAnims(data.map(() => new Animated.Value(1)));
      }
    };
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      fadeAnim.setValue(0);
      logoAnim.setValue(0);
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
    >
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backWrapper}>
          <LinearGradient colors={['#6BEFFF', '#43B3C1', '#005B66']} style={styles.backButton}>
            <Image
              source={require('../assets/images/clarity_arrow-line.png')}
              style={styles.backIcon}
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

      <Text style={styles.title}>FAVORITE PLACE</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {favoritePlaces.length === 0 ? (
          <Text style={styles.emptyText}>
            You don't have any favorite places, you can add them later.
          </Text>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            {favoritePlaces.map((item, index) => {
              const imageSource = imageMap[item.imageName ?? item.title];
              return (
                <Pressable
                  key={index}
                  onPressIn={() => handlePressIn(index)}
                  onPressOut={() => handlePressOut(index)}
                >
                  <Animated.View style={[styles.card, { transform: [{ scale: scaleAnims[index] }] }]}>
                    {imageSource && (
                      <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
                    )}
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('PlaceDetail' as any, { place: item })}
                      >
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
              );
            })}
          </Animated.View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 16,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 85,
    marginBottom: 25,
  },
  backWrapper: {
    position: 'absolute',
    left: 0,
    top: 5,
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
    transform: [{ rotate: '180deg' }],
  },
  centerIcon: {
    width: 107,
    height: 107,
    marginTop: -5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    marginBottom: 18,
    alignSelf: 'flex-start',
    marginLeft: 16,
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
  emptyText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 160,
    lineHeight: 24,
  },
});
