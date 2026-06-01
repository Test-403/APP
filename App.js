import React from 'react';
import { PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <PaperProvider>
      <HomeScreen />
    </PaperProvider>
  );
}
