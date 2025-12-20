import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "./screens/CameraScreen";
import ResultScreen from "./screens/ResultScreen";
import HomeBottomTabs from "./HomeBottomTabs";

const Stack = createNativeStackNavigator();

const CameraStack = () => {
    return (
        <Stack.Navigator>
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
                name="ResultScreen"
                component={ResultScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default CameraStack;