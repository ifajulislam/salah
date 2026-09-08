import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@/screens/HomeScreen';
import { LocationSetupScreen } from '@/screens/LocationSetupScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { color } from '@/theme/tokens';

export type RootStackParamList = {
  Home: undefined;
  LocationSetup: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: color.sand },
          headerTintColor: color.ink,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="LocationSetup"
          component={LocationSetupScreen}
          options={{ title: 'Location', presentation: 'modal' }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
