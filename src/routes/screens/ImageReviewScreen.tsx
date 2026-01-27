import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { JSX } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, } from 'react-native';
import { processReceiptImage } from '../../utils/processReceiptImage';
import { NitroSQLiteConnection } from 'react-native-nitro-sqlite';
import { useDb } from '../../context/DbContext';
import { ImageProcessingStackParamList, ImageProps, ReceiptProcessResult, } from '../../utils/types';
import { CameraRoll, PhotoIdentifier, } from '@react-native-camera-roll/camera-roll';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<
  ImageProcessingStackParamList,
  'ImageReviewScreen'
>;

const ImageReviewScreen = ({ navigation, route }: Props): JSX.Element => {
  const db: NitroSQLiteConnection | null = useDb();
  const { imageUri, height, width, source } = route.params.imageProps;
  const windowWidth = useWindowDimensions().width;

  const savePhoto = async (
    // imageUri: string | null,
  ): Promise<ImageProps | undefined> => {
    if (source === 'gallery') return;
    if (!imageUri) {
      Alert.alert('Failed to save photo', 'No captured photo to save');
      return;
    }

    const photoIdentifier: PhotoIdentifier = await CameraRoll.saveAsset(
      imageUri,
      {
        type: 'photo',
        album: 'PurchaseApp',
      },
    );
    const SAVE_URI: string = photoIdentifier.node.image.uri;

    return {
      imageUri: SAVE_URI,
      height: photoIdentifier.node.image.height,
      width: photoIdentifier.node.image.width,
      source: 'camera',
    };
  };

  const handleUsefulPhoto = async (): Promise<void> => {
    if (!imageUri || !db) return;

    try {
      const imageProps: ImageProps | undefined = await savePhoto();
      // if (!imageProps) return;
      console.log(source);
      let image_uri: string;
      if (imageProps) {
        image_uri = imageProps.imageUri; // just saved path
      } else {
        image_uri = imageUri; // gallery path passed by route.params
      }

      const result: ReceiptProcessResult | undefined =
        await processReceiptImage(db, image_uri);

      if (!result) {
        Alert.alert('Failed to process receipt');
        return;
      }

      if (!result.serialized_ocr) {
        Alert.alert('Error serializing');
        return;
      }

      navigation.navigate('ProductReviewScreen', {
        productDetails: result.productDetails,
        imageProps: imageProps ? imageProps : route.params.imageProps,
        serialized_ocr: result.serialized_ocr,
        store: result.store,
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Unexpected error processing receipt');
    }
  };


  return (
    <SafeAreaView
      edges={['bottom']}
      style={style.container}
    >
      <Image
        source={{ uri: imageUri }}
        style={[
          style.image,
          {
            width: windowWidth + 1,
            aspectRatio: source === 'camera' ? height / width : width / height
          },
        ]}
        // resizeMode="contain"
      />
      <View style={style.btnContainer}>
        <TouchableOpacity style={style.simpleBtn} onPress={navigation.goBack}>
          <Text>Re-take</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.simpleBtn}
          onPress={handleUsefulPhoto}
          accessibilityLabel="Go to text extraction page"
        >
          <Text>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#120f10',
    width: '100%',
  },
  image: {
    backgroundColor: 'gray',
    // width: '101%',
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  simpleBtn: {
    backgroundColor: '#ee3a28',
    borderRadius: 8,
    padding: 15,
  },
});

export default ImageReviewScreen;
