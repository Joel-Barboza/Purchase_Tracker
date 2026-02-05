import React, { JSX } from 'react';
import { ImageProps, ProductDetails } from '../utils/types.ts';
import { Image, PixelRatio, useWindowDimensions, View } from 'react-native';

const ProductFrameOnReceiptImage = ({
  productDetails,
  imageProps,
}: {
  productDetails: ProductDetails;
  imageProps: ImageProps;
}): JSX.Element | undefined => {
  const { width } = useWindowDimensions();

  const scaleCorrection = 0.03;
  const leftOffsetCorrection = 10;

  // https://reactnative.dev/docs/pixelratio
  // image sizes are given in 'physical' pixels and rn works with 'logical' px
  if (!productDetails.productImageFrame) return;
  const scale =
    width / (productDetails.productImageFrame.width / PixelRatio.get()) -
    scaleCorrection;
  const imageWidth = (imageProps.width / PixelRatio.get()) * scale;
  const imageHeight = (imageProps.height / PixelRatio.get()) * scale;
  return (
    <View
      style={{
        height:
          (productDetails.productImageFrame.height / PixelRatio.get()) * scale +
          2,
        width: width,
        backgroundColor: 'blue',
        overflow: 'hidden',
      }}
    >
      <Image
        style={{
          left:
            -(productDetails.productImageFrame.left / PixelRatio.get()) *
              scale +
            leftOffsetCorrection,
          top:
            -(productDetails.productImageFrame.top / PixelRatio.get()) * scale,
          width: imageWidth,
          height: imageHeight,
          backgroundColor: 'gray',
        }}
        source={{ uri: imageProps.imageUri }}
        alt={'Product Image'}
      />
    </View>
  );
};

export default ProductFrameOnReceiptImage;
