import {
  StyleSheet,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PurchasesScreen from "./screens/PurchasesScreen";
import ProductsScreen from "./screens/ProductsScreen";
import MaterialTopTabBar from "../components/MaterialTopTabBar";

const PurchasesTab = createMaterialTopTabNavigator();

const PurchasesMaterialTopTab = ({ route }) => {
  return (
    <PurchasesTab.Navigator
      // tabBar={(props) => <MaterialTopTabBar {...props} />}
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, color: 'white' },
        // tabBarItemStyle: { width: 100 },
        tabBarStyle: { backgroundColor: '#120f10' },
      }}
    >
      <PurchasesTab.Screen
        name="Purchases"
        component={PurchasesScreen}
        options={{ headerShown: false }}
      />
      <PurchasesTab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ headerShown: false }}
      />
    </PurchasesTab.Navigator>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
  container: {
    height: "93%", // exluding the footer
  },
  scrollView: {
    backgroundColor: "#120f10",
  },
  btnText: {
    color: 'white',
    fontSize: 20,
  },
});

export default PurchasesMaterialTopTab;
