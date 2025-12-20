import {
  View,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
const WalletScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.main}>
        <Text>Wallet Screen</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "93%", // excluding the footer
  },
  main: {
    backgroundColor: "#070709",
    width: "100%",
  },
});

export default WalletScreen;