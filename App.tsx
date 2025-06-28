import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import PopularPlaceScreen from './src/screens/PopularPlaceScreen';
import InteractiveMapScreen from './src/screens/InteractiveMapScreen';
import FavoritePlaceScreen from './src/screens/FavoritePlaceScreen';
import RandomPlaceScreen from './src/screens/RandomPlaceScreen';
import PlaceDetailScreen from './src/screens/PlaceDetailScreen';
import { MapRegionProvider } from './src/context/MapRegionContext';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Home: undefined;
  PopularPlace: undefined;
  InteractiveMap: undefined;
  FavoritePlace: undefined;
  RandomPlace: undefined;
  PlaceDetail: {
    place: {
      imageName: string;
      title: string;
      description: string;
    };
    from?: 'InteractiveMap';
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <View style={styles.container}>
      <MapRegionProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PopularPlace" component={PopularPlaceScreen} />
            <Stack.Screen name="InteractiveMap" component={InteractiveMapScreen} />
            <Stack.Screen name="FavoritePlace" component={FavoritePlaceScreen} />
            <Stack.Screen name="RandomPlace" component={RandomPlaceScreen} />
            <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </MapRegionProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', 
  },
});