import React, { useState } from "react";
import {
  Button,
  View,
  useColorScheme,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.main}>
        <Text>asdfasdfasdf</Text>
        <Text>asdfasdfasdf</Text>
        <Text>asdfasdfasdfa</Text>
        <Text>fasdfasdfasdf</Text>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => navigation.navigate("CameraScreen")}
        >
          <Text>Purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => navigation.navigate("CameraScreen")}
        >
          <Text>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => navigation.navigate("CameraScreen")}
        >
          <Text>Budget</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    backgroundColor: "red",
    width: "100%",
  },
  footer: {
    position: "absolute",
    backgroundColor: "#cacaca",
    width: "100%",
    height: "20%",
    bottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  footerBtn: {
    backgroundColor: '#531289',
    borderRadius: 8,
    padding: 15,
  },
});

export default HomeScreen;
