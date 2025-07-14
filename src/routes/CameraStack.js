import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "./CameraScreen";
import ResultScreen from "./ResultScreen";
import HomeTabs from "./HomeTabs";

const Stack = createNativeStackNavigator();

const CameraTab = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeTabs"
                component={HomeTabs}
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

export default CameraTab;