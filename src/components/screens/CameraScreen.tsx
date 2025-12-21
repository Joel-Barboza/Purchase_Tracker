import { CameraRoll } from "@react-native-camera-roll/camera-roll";
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
} from "react-native";

import { Camera, CameraDevice, CameraDeviceFormat, PhotoFile, useCameraDevice, useCameraFormat, useCameraPermission } from "react-native-vision-camera";

const CameraScreen = (): JSX.Element => {
    const device = useCameraDevice('back');
    const format = useCameraFormat(device, [
        { fps: 60 },
        { videoAspectRatio: 16 / 9 },
        { videoResolution: 'max' },
        { photoAspectRatio: 16 / 9 },
        { photoResolution: 'max' },
    ])
    const { hasPermission } = useCameraPermission();

    const camera = useRef<Camera | null>(null);
    const [imageSource, setImageSource] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(true);
    const [photo, setPhoto] = useState<PhotoFile | null>(null);
    const [flash, setFlash] = useState<"on" | "off">("off");

    useEffect(() => {
        if (!photo) return;

        savePhoto();
        setTimeout(() => {
            setIsActive(true);
        }, 500);
        
    }, [photo]);



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

            setPhoto(photo);
            setIsActive(false);

        } catch (error) {
            console.error("Failed to take photo:", error);

            Alert.alert(
                "Capture failed",
                "Something went wrong while taking the photo. Please try again."
            );
        }
    };

    const savePhoto = async (): Promise<void> => {
        if (!photo) {
            Alert.alert(
                "Failed to save photo",
                "No captured photo to save"
            );
            return
        }
        if (photo.path) {
            await CameraRoll.saveAsset(`file://${photo.path}`, {
                type: "photo",
                album: "PurchaseApp"
            });
            setImageSource(`file://${photo.path}`);
        }
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
            <TouchableOpacity
                style={style.camButton}
                onPress={capturePhoto}
            />
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
        borderColor: "white",
    }
})


export default CameraScreen;