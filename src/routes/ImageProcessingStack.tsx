import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ImageReviewScreen from "./screens/ImageReviewScreen";
import { JSX } from "react";
import CameraScreen from "./screens/CameraScreen";
// import ResultScreen from "./screens/ResultScreen";
// import HomeBottomTabs from "./HomeBottomTabs";


export type ImageProcessingStackParamList = {
  CameraScreen: undefined;
  ImageReviewScreen: {
    imageProps: ImageProps
  };
};

export type ImageProps = {
  imageUri: string,
  height: number,
  width: number
}


const Stack = createNativeStackNavigator<ImageProcessingStackParamList>();

const ImageProcessingStack = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="CameraScreen">
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
    </Stack.Navigator>
  );
};

export default ImageProcessingStack;