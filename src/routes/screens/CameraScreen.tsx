import { CameraRoll, PhotoIdentifier } from "@react-native-camera-roll/camera-roll";
import React, { useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  Image,
  ImageSize,
} from "react-native";

import { Camera, CameraDevice, CameraDeviceFormat, PhotoFile, useCameraDevice, useCameraFormat, useCameraPermission } from "react-native-vision-camera";
import { addReceipt, getReceipts } from "../../db/receipt";
import { useDb } from "../../context/DbContext";
import { NitroSQLiteConnection } from "react-native-nitro-sqlite";
import { DirectoryPickerResponse, DocumentPickerResponse, pick, PickDirectoryResponse, types } from "@react-native-documents/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageProcessingStackParamList, ImageProps } from "../ImageProcessingStack";

type Props = NativeStackScreenProps<
  ImageProcessingStackParamList,
  "CameraScreen"
>;


const CameraScreen = ({ navigation }: Props): JSX.Element => {
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    { fps: 60 },
    { videoAspectRatio: 16 / 9 },
    { videoResolution: 'max' },
    { photoAspectRatio: 16 / 9 },
    { photoResolution: 'max' },
  ])
  const { hasPermission } = useCameraPermission();
  const db: NitroSQLiteConnection | null = useDb();
  const camera = useRef<Camera | null>(null);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [flash, setFlash] = useState<"on" | "off">("off");

  const savePhoto = async (imageUri: string | null): Promise<void> => {
    if (!imageUri) {
      Alert.alert(
        "Failed to save photo",
        "No captured photo to save"
      );
      return
    }

    const photoIdentifier: PhotoIdentifier = await CameraRoll.saveAsset(imageUri, {
      type: "photo",
      album: "PurchaseApp"
    });
    const SAVE_URI: string = photoIdentifier.node.image.uri;

    const imageProps: ImageProps = {
      imageUri: SAVE_URI,
      height: photoIdentifier.node.image.height,
      width: photoIdentifier.node.image.width
    }
    reviewImage(imageProps);
  }

  const capturePhoto = async (): Promise<void> => {
    const cameraRef: Camera | null = camera.current;

    if (!cameraRef) {
      Alert.alert(
        "Camera not available",
        "The camera is not ready or could not be accessed."
      );
      return;
    }

    try {
      const photo: PhotoFile = await cameraRef.takePhoto({ flash });
      setIsActive(false);

      const CAPTURE_URI: string = `file://${photo.path}`;
      setImageSource(CAPTURE_URI);
      await savePhoto(CAPTURE_URI);


    } catch (error) {
      console.error("Failed to take photo:", error);

      Alert.alert(
        "Capture failed",
        "Something went wrong while taking the photo. Please try again."
      );
    }
    setIsActive(true);
  };


  const openGallery = async (): Promise<void> => {
    try {
      const result: [DocumentPickerResponse, ...DocumentPickerResponse[]] = await pick({
        mode: 'open',
        type: [types.allFiles],
      })
      const file = result[0];
      console.log(file.uri)
      setImageSource(file.uri);

      // return value from gallery doesn't have the dimensions
      const data: ImageSize = await Image.getSize(file.uri);
      const imageProps: ImageProps = {
        imageUri: file.uri,
        height: data.height,
        width: data.width
      }

      reviewImage(imageProps);
    } catch (err) {
      console.log(`Error selecting image from gallery: ${err}`);
    }
  };

  const reviewImage = (imageProps: ImageProps): void => {
    navigation.navigate("ImageReviewScreen", {
      imageProps
    });
  }


  if (!hasPermission) return <PermissionsPage />
  if (device == null) return <NoCameraDeviceError />
  return (
    <View style={[style.container, { justifyContent: 'flex-start' }]}>
      <Camera
        ref={camera}
        style={style.camera}
        device={device}
        isActive={isActive}
        photo={true}
        format={format}
      />
      <View style={style.btnContainer}>

        <TouchableOpacity
          style={style.galleryButton}
          onPress={openGallery}
        />
        <TouchableOpacity
          style={style.camButton}
          onPress={capturePhoto}
        />
        <TouchableOpacity
          style={style.camButton}
          onPress={async () => { db && await getReceipts(db) }}
        >
          <Text>
            get recipt
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const PermissionsPage = (): JSX.Element => {
  const { requestPermission }: { requestPermission: () => Promise<boolean> } = useCameraPermission();

  const requestCameraPermission = async (): Promise<boolean> => {
    const permission: boolean = await requestPermission();
    if (permission === false) await Linking.openSettings();
    return permission;
  }

  return (
    <View style={style.container}>
      <Text>
        Please grant camera permission
      </Text>
      <TouchableOpacity
        onPress={requestCameraPermission}
      >
        <Text>Grant permission</Text>
      </TouchableOpacity>
    </View>
  )
}

const NoCameraDeviceError = (): JSX.Element => {
  return (
    <View style={style.container}>
      <Text>
        No camera device found
      </Text>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 16 / 9,
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#B2BEB5",
    borderWidth: 4,
    borderColor: "white"
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  galleryButton: {
    height: 80,
    width: 80,

    backgroundColor: "#B2BEB5",
    borderWidth: 4,
    borderColor: "white",
  },
})


export default CameraScreen;