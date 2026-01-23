import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImageReviewScreen from './screens/ImageReviewScreen';
import { JSX } from 'react';
import CameraScreen from './screens/CameraScreen';
import ProductReviewScreen from './screens/ProductReviewScreen';
import { ImageProcessingStackParamList } from '../utils/types';
import HomeBottomTabs from './HomeBottomTabs.tsx';
import ProductEditScreen from './screens/ProductEditScreen.tsx';

const Stack = createNativeStackNavigator<ImageProcessingStackParamList>();

const ImageProcessingStack = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="HomeTabs">
      <Stack.Screen
        name="HomeTabs"
        component={HomeBottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImageReviewScreen"
        component={ImageReviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductReviewScreen"
        component={ProductReviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductEditScreen"
        component={ProductEditScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ImageProcessingStack;
