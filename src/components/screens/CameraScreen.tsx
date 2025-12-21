import React, { useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
    Dimensions,
    Image,
    Permission,
} from "react-native";

import { Camera, CameraDevice, useCameraDevice, useCameraPermission } from "react-native-vision-camera";

const CameraScreen = (): JSX.Element => {
    const device: CameraDevice | undefined = useCameraDevice('back');
    const { hasPermission }: { hasPermission: boolean } = useCameraPermission();

    if (!hasPermission) return <PermissionsPage />
    if (device == null) return <NoCameraDeviceError />
    return (
        <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
        />
    )
}

const PermissionsPage = (): JSX.Element => {
    const { requestPermission }: { requestPermission: () =>Promise<boolean> } = useCameraPermission();

    const requestCameraPermission = async (): Promise<boolean> =>{
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
    }
})


export default CameraScreen;