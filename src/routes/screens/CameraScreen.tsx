import React, { useRef, useState } from 'react';
import type { JSX } from 'react';
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
} from 'react-native';

import {
  Camera,
  PhotoFile,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  DocumentPickerResponse,
  pick,
  types,
} from '@react-native-documents/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ImageProcessingStackParamList, ImageProps } from '../../utils/types';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<
  ImageProcessingStackParamList,
  'CameraScreen'
>;

const CameraScreen = ({ navigation }: Props): JSX.Element => {
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    { fps: 60 },
    { videoAspectRatio: 16 / 9 },
    { videoResolution: 'max' },
    { photoAspectRatio: 16 / 9 },
    { photoResolution: 'max' },
  ]);
  const { hasPermission } = useCameraPermission();
  const camera = useRef<Camera | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [flash, setFlash] = useState<'on' | 'off'>('off');

  const capturePhoto = async (): Promise<void> => {
    const cameraRef: Camera | null = camera.current;

    if (!cameraRef) {
      Alert.alert(
        'Camera not available',
        'The camera is not ready or could not be accessed.',
      );
      return;
    }

    try {
      const photo: PhotoFile = await cameraRef.takePhoto({ flash });
      setIsActive(false);

      const CAPTURE_URI: string = `file://${photo.path}`;
      const imageProps: ImageProps = {
        imageUri: CAPTURE_URI,
        height: photo.height,
        width: photo.width,
        source: 'camera',
      };
      reviewImage(imageProps);
    } catch (error) {
      console.error('Failed to take photo:', error);

      Alert.alert(
        'Capture failed',
        'Something went wrong while taking the photo. Please try again.',
      );
    }
    setIsActive(true);
  };

  const openGallery = async (): Promise<void> => {
    try {
      const result: [DocumentPickerResponse, ...DocumentPickerResponse[]] =
        await pick({
          mode: 'open',
          type: [types.allFiles],
        });
      const file = result[0];
      console.log(file.uri);

      // return value from gallery doesn't have the dimensions
      const data: ImageSize = await Image.getSize(file.uri);
      const imageProps: ImageProps = {
        imageUri: file.uri,
        height: data.height,
        width: data.width,
        source: 'gallery',
      };

      reviewImage(imageProps);
    } catch (err) {
      console.log(`Error selecting image from gallery: ${err}`);
    }
  };

  const reviewImage = (imageProps: ImageProps): void => {
    navigation.navigate('ImageReviewScreen', {
      imageProps,
    });
  };

  const toggleFlashState = () => {
    if (flash == "off") {
      setFlash("on");
    } else if (flash == "on") {
      setFlash("off");
    }
  }

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;
  return (
    <SafeAreaView edges={['bottom']} style={[style.container, { justifyContent: 'flex-start' }]}>
      <Camera
        ref={camera}
        style={style.camera}
        device={device}
        isActive={isActive}
        photo={true}
        format={format}
      />
      <View style={style.btnContainer}>
        <TouchableOpacity style={style.galleryButton} onPress={openGallery} />
        <TouchableOpacity style={style.camButton} onPress={capturePhoto} />
        <TouchableOpacity
          style={style.simpleBtn}
          onPress={toggleFlashState}

        >
          <Text>Flash {flash}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const PermissionsPage = (): JSX.Element => {
  const { requestPermission }: { requestPermission: () => Promise<boolean> } =
    useCameraPermission();

  const requestCameraPermission = async (): Promise<boolean> => {
    const permission: boolean = await requestPermission();
    if (permission === false) await Linking.openSettings();
    return permission;
  };

  return (
    <View style={style.container}>
      <Text>Please grant camera permission</Text>
      <TouchableOpacity onPress={requestCameraPermission}>
        <Text>Grant permission</Text>
      </TouchableOpacity>
    </View>
  );
};

const NoCameraDeviceError = (): JSX.Element => {
  return (
    <View style={style.container}>
      <Text>No camera device found</Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120f10',
    // backgroundColor: '#FFFFFF',
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width * 16) / 9,
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#B2BEB5',
    borderWidth: 4,
    borderColor: 'white',
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  galleryButton: {
    height: 80,
    width: 80,

    backgroundColor: '#B2BEB5',
    borderWidth: 4,
    borderColor: 'white',
  },
  simpleBtn: {
    backgroundColor: '#ee3a28',
    borderRadius: 8,
    padding: 15,
    // color:"#841584"
  },
});

export default CameraScreen;
