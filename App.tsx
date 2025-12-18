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
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
//import { enableExperimentalWebImplementation } from "react-native-edge-to-edge";


const App = () => {


  connectToDatabase();

  // const insets = useSafeAreaInsets()k;


  return (
    <DbProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 , backgroundColor: '#b31212ff' }} edges={['top']}>
          <NavigationContainer>
            <CameraStack />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </DbProvider>
  );
};

export default App;

