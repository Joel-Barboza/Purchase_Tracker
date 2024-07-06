import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import TextRecognition from "@react-native-ml-kit/text-recognition";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { launchImageLibrary } from "react-native-image-picker";

const ResultScreen = ({ route }) => {
  const { text = { wordList: [], discard: [] } } = route.params || {}; // Default values
  const { wordList, discard } = text;

  console.log(text);
  return (
    <ScrollView>
      {wordList.map((elem, index) => (
        <Text key={"word" + index} style={styles.text}>
          {elem}
        </Text>
      ))}
      <Text style={styles.title}>Discarded words</Text>
      {discard.map((elem, index) => (
        <Text key={"discarded" + index} style={styles.text}>
          {elem}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
  title: {
    fontSize: 30,
  },
});

export default ResultScreen;
