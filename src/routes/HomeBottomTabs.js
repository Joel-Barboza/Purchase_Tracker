import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "./screens/CameraScreen";
import ResultScreen from "./screens/ResultScreen";
import HomeScreen from "./screens/HomeScreen";
import PurchasesScreen from "./StatsMaterialTopTabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBar from "../components/TabBar";
import WalletScreen from "./screens/WalletScreen";
import ShoppingCartScreen from "./screens/ShoppingCartScreen";

const Tab = createBottomTabNavigator();

const HomeBottomTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Stats" component={PurchasesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Wallet" component={WalletScreen} options={{ headerShown: false }} />
      <Tab.Screen name="ShoppingCart" component={ShoppingCartScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default HomeBottomTabs;