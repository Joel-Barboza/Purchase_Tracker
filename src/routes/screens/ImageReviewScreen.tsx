import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { JSX } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ImageProcessingStackParamList } from "../ImageProcessingStack";
import { ExtractText } from "../../utils/OCR";

type Props = NativeStackScreenProps<
  ImageProcessingStackParamList,
  "ImageReviewScreen"
>;

const ImageReviewScreen = ({ navigation, route }: Props): JSX.Element => {

  const { imageUri, height, width } = route.params.imageProps;

  return (
    <View style={[style.container, { justifyContent: 'flex-start' }]}>
      <Image
        source={{ uri: imageUri }}
        style={[style.image, { aspectRatio: width / height }]}
        resizeMode="contain"
      />
      <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={style.simpleBtn}
          onPress={navigation.goBack}
        >
          <Text>Re-take</Text>

        </TouchableOpacity>
        <TouchableOpacity
          style={style.simpleBtn}
          onPress={() => ExtractText(imageUri)}
          accessibilityLabel="Go to text extraction page"
        >
          <Text>Extract</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  image: {
    backgroundColor: 'gray',
    width: '101%'
  },
  simpleBtn: {
    backgroundColor: '#ee3a28',
    borderRadius: 8,
    padding: 15,
  },
})

export default ImageReviewScreen;