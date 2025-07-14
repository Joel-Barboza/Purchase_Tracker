import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "./CameraScreen";
import ResultScreen from "./ResultScreen";
import HomeScreen from "./HomeScreen";
import PurchasesScreen from "./PurchasesScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBar from "../components/TabBar";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Purchases" component={PurchasesScreen} options={{ headerShown: false }} />
      {/* <Tab.Screen name="Cam" component={CameraTab} options={{ headerShown: false }} /> */}
      <Tab.Screen name="H" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="P" component={PurchasesScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default HomeTabs;