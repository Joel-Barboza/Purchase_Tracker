import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PurchasesScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.text}>Products Screen</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    text: {
        color: "black",
    },
    container: {
        height: "93%", // exluding the footer
    },
    scrollView: {
        backgroundColor: "#070709",
    },
    btnText: {
        color: 'white',
        fontSize: 20,
    },
});

export default PurchasesScreen;