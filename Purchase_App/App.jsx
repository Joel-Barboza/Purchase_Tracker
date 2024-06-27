/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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
import {
  Camera,
  useCameraDevice,
} from "react-native-vision-camera";
import { launchImageLibrary } from "react-native-image-picker";

function App() {
  const [counter, setCounter] = useState(0);
  const isDarkMode = useColorScheme() === "dark";
  const [text, setText] = useState("");
  const camera = useRef(null);
  const device = useCameraDevice("back", {
    physicalDevices: [
      "ultra-wide-angle-camera",
      "wide-angle-camera",
      "telephoto-camera",
    ],
  });


  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState("");

  const ExtractText = async (image) => {
    if (image !== "") {
      const result = await TextRecognition.recognize(`file://${image}`);
      setText(result.text);
    }
  };

  useEffect(() => {
    ExtractText(imageSource);
  }, [imageSource]);

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      console.log(`Camera permission status: ${permission}`);
      if (permission === "denied") await Linking.openSettings();
    })();
  }, []);

  const capturePhoto = async () => {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({ flash: "off" });
      await CameraRoll.saveAsset(`file://${photo.path}`, {
        type: "photo",
      });
      setImageSource(photo.path);
      ExtractText(photo.path);
    } else {
      console.log("camera ref is null");
    }
  };

  const openGallery = () => {
    launchImageLibrary({}, (selected) =>
      selected.assets !== undefined ? setImageSource(selected.assets[0].uri) : null
    );
  };

  const backToMenu = () => {
    setShowCamera(false);
  };

  if (device == null) {
    return <Text>Camera not available</Text>;
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showCamera}
            photo={true}
          />
          <Text>{imageSource.toString()}</Text>
          <Text>{text}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={openGallery}
            />
            <TouchableOpacity style={styles.camButton} onPress={capturePhoto} />
            <Button
              style={styles.backButton}
              onPress={backToMenu}
              title="Back"
              color="#841584"
              accessibilityLabel="Back to main page"></Button>
          </View>
        </>
      ) : (
        <>
          <Button
            onPress={() => setShowCamera(true)}
            title="Camera"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          ></Button>
        </>
      )}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    position: "absolute",
    width: "100%",
    bottom: 0,
    padding: 20,
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,

    backgroundColor: "#B2BEB5",
    borderWidth: 4,
    borderColor: "white",
  },
  galleryButton: {
    height: 80,
    width: 80,

    backgroundColor: "#B2BEB5",
    borderWidth: 4,
    borderColor: "white",
  },
  backButton: {
    height: 30,
    width: 30,
    borderRadius: 2,

    backgroundColor: "#B2BEB5",
    borderWidth: 4,
    borderColor: "white",
  },
});

export default App;
