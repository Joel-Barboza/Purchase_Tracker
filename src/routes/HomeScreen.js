import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  useColorScheme,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { test, writeToFile, encryptData, generateKey, readFromFile, restartFile, readEncrypted } from "../utils/saveData";
import Config from 'react-native-config';

const yes = async () => {
  const key = await generateKey(
    Config.ENCRYPT_PSSWRD,
    Config.ENCRYPT_SALT,
    parseInt(Config.ENCRYPT_COST),
    parseInt(Config.ENCRYPT_LENGTH)
  );
  const { cipher, iv } = await encryptData(JSON.stringify({ "purchases": [], "products": [] }), key);
  console.log('Data encrypteds:', { cipher, iv });
  await writeToFile(JSON.stringify({ "cipher": cipher, "iv": iv }), key);
  console.log();

}
const HomeScreen = ({ navigation }) => {
  // useEffect(() => {
  //   console.log("fsdf");
  //   yes();
  // }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.main}>
        <Text>asdfasdfasdf</Text>
        <Text>asdfasdfasdf</Text>
        <Text>asdfasdfasdfa</Text>
        <Text>fasdfasdfasdf</Text>
      </ScrollView>
      {/* <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => navigation.navigate("PurchasesScreen")}
        >
        <TouchableOpacity
          style={styles.footerBtn}
          // onPress={async() => await restartFile()}
          onPress={async() => {console.log(await readFromFile())}}
        >
          <Text>Test</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerBtn}
          // onPress={async() => await restartFile()}
          onPress={async() => await readEncrypted()}
        >
          <Text>Encrypted</Text>
        </TouchableOpacity>
      </View> */}
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
    backgroundColor: "#070709",
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
