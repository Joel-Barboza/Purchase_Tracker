/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/routes/screens/HomeScreen';
import CameraScreen from './src/routes/screens/CameraScreen';
import ResultScreen from './src/routes/screens/ResultScreen';
import PurchasesScreen from './src/routes/StatsMaterialTopTabs';
import { connectToDatabase, createTables } from './db/db';
import { useCallback, useEffect } from 'react';
import { DbProvider } from './src/context/DbContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from './src/components/TabBar';
import CameraStack from './src/routes/CameraStack';



const App = () => {
  return (
    <DbProvider>
      <NavigationContainer>
        <CameraStack />
      </NavigationContainer>
    </DbProvider>
  );
};

export default App;
