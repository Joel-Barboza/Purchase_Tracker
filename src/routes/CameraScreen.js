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
  Dimensions,
  Image,
} from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useFocusEffect } from '@react-navigation/native';
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { launchImageLibrary } from "react-native-image-picker";
import { ExtractText } from "../utils/utils";
import { request, PERMISSIONS } from "react-native-permissions";
import { pick, types } from "@react-native-documents/picker";

const CameraScreen = ({ navigation }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [counter, setCounter] = useState(0);
  const isDarkMode = useColorScheme() === "dark";
  const [imageSource, setImageSource] = useState("");
  const [text, setText] = useState();
  const camera = useRef(null);
  const [isActive, setIsActive] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [flash, setFlash] = useState("off");
  const device = useCameraDevice("back", {
    physicalDevices: [
      "ultra-wide-angle-camera",
      "wide-angle-camera",
      "telephoto-camera",
    ],
  });


  // Start camera when entering the screen
  useFocusEffect(
    React.useCallback(() => {
      setIsActive(true);
      return () => {
        setPhoto(null);
      };
    }, [])
  );



  useEffect(() => {
    ExtractText(imageSource).then((extractedText) => setText(extractedText));
  }, [imageSource]);

  const grantCameraPermission = async () => {
    const permission = await requestPermission();
    if (permission === false) await Linking.openSettings();
  }

  const capturePhoto = async () => {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({ flash: flash });
      setImageSource(`file://${photo.path}`);
      setPhoto(photo);
      setIsActive(false);

    } else {
      console.log("camera ref is null");
    }
  };

  const toggleFlashState = () => {
    if (flash == "off") {
      setFlash("on");
    } else if (flash == "on") {
      setFlash("off");
    }
  }

  // request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES).then((status) => {
  //   console.log("Camera status: " + status)
  // })
  // launchImageLibrary({}, (selected) => {
  //   if (selected.assets !== undefined) {
  //     setImageSource(selected.assets[0].uri);
  //     setPhoto(selected.assets[0]);
  //     setIsActive(false);
  //     console.log(selected);
  //   }

  // }
  // );


  const openGallery = async () => {
    try {
        const [result] = await pick({
          mode: 'open',
          type: [types.images],
        })
        setImageSource(result.uri);
        setPhoto(result);
        setIsActive(false);
      } catch (err) {
        // see error handling https://react-native-documents.github.io/docs/sponsor-only/errors
        console.log(err);
      }
  };

  const processPhoto = async () => {
    console.log("Starting to process photo");
    if (photo.path) {
      await CameraRoll.saveAsset(`file://${photo.path}`, {
        type: "photo",
        album: "PurchaseApp"
      });
      setImageSource(`file://${photo.path}`);
      console.log("Ended to process photo");
    }
    navigation.navigate("ResultScreen", { text: text });
  }



  if (device == null) {
    return <Text>Camera not available</Text>;
  }


  if (!hasPermission) return (
    <View style={styles.container}>
      <Text style={styles.darkText}>Camera permission need to be granted</Text>
      <TouchableOpacity
        style={styles.simpleBtn}
        // onPress={async() => await restartFile()}
        onPress={() => { grantCameraPermission() }}
      >
        <Text>Grand permission</Text>
      </TouchableOpacity>
    </View>
  )


  return (
    <View style={styles.container}>
      <>
        <View style={styles.cameraContainer}>
          {isActive ? (
            <Camera
              ref={camera}
              style={styles.camera}
              device={device}
              isActive={isActive}
              photo={true}
              resizeMode="contain"
              photoQualityBalance="speed"
              // onPreviewStarted={() => console.log('Preview started!')}
              // onPreviewStopped={() => console.log('Preview stopped!')}
            />

          ) : (

            <Image style={
              styles.camera}
              source={{ uri: imageSource }}
              resizeMode="contain"
            />

          )}
        </View>
        <Text>{imageSource.toString()}</Text>
        {/* <Text>{text.textBlocks[0].text}</Text> */}
        <View style={styles.buttonContainer}>
          {isActive ? (
            <>
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={openGallery}
              />
              <TouchableOpacity
                style={styles.camButton}
                onPress={capturePhoto}
              />
              <TouchableOpacity
                style={styles.simpleBtn}
                onPress={toggleFlashState}
                color="#841584"
              >
                <Text>Flash {flash}</Text>
              </TouchableOpacity>
            </>

          ) : (
            <>
              <TouchableOpacity
                style={styles.simpleBtn}
                onPress={() => setIsActive(true)}
              >
                <Text>Re-take</Text>

              </TouchableOpacity>
              <TouchableOpacity
                style={styles.simpleBtn}
                onPress={processPhoto}
                accessibilityLabel="Go to text extraction page"
              >
                <Text>Extract</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    position: "absolute",
    top: 0,
  },
  camera: {
    position: 'relative',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 120, // excluding buttonContainer height
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",

    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.84)",
    position: "absolute",
    width: "100%",
    height: 120,
    padding: 20,
    bottom: 0,
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
  simpleBtn: {
    backgroundColor: '#531289',
    borderRadius: 8,
    padding: 15,
  },
  darkText: {
    color: "black",
  },
});

export default CameraScreen;
