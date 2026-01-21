import HomeScreen from './screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from '../components/TabBar';
import { HomeBottomTabsParamList } from '../utils/types.ts';

const Tab = createBottomTabNavigator<HomeBottomTabsParamList>();

const HomeBottomTabs = () => {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      {/*<Tab.Screen*/}
      {/*  name="Stats"*/}
      {/*  component={PurchasesScreen}*/}
      {/*  options={{ headerShown: false }}*/}
      {/*/>*/}
      {/*<Tab.Screen*/}
      {/*  name="Wallet"*/}
      {/*  component={WalletScreen}*/}
      {/*  options={{ headerShown: false }}*/}
      {/*/>*/}
      {/*<Tab.Screen*/}
      {/*  name="ShoppingCart"*/}
      {/*  component={ShoppingCartScreen}*/}
      {/*  options={{ headerShown: false }}*/}
      {/*/>*/}
    </Tab.Navigator>
  );
};

export default HomeBottomTabs;
