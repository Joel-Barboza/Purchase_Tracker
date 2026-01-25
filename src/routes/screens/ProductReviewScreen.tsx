import React, { JSX, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDb } from '../../context/DbContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ImageProcessingStackParamList,
  ImageProps,
  Product,
  ProductDetails,
  Store,
} from '../../utils/types';
import { persistPurchaseData } from '../../utils/utils';

type Props = NativeStackScreenProps<
  ImageProcessingStackParamList,
  'ProductReviewScreen'
>;

const ProductReviewScreen = ({ route, navigation }: Props): JSX.Element => {
  const db = useDb();
  const extractedProductDetails: ProductDetails[] = route.params.productDetails;
  const imageProps: ImageProps = route.params.imageProps;
  const serialized_ocr: string = route.params.serialized_ocr;
  const store: Store = route.params.store;

  const [productDetails, setProductDetails] = useState<ProductDetails[]>(
    extractedProductDetails,
  );

  console.log(extractedProductDetails);

  const handleSaveData = () => {
    db &&
      persistPurchaseData(db, {
        productDetails: productDetails,
        image_uri: imageProps.imageUri,
        serialized_ocr,
        store,
      });
    navigation.popToTop();
  };

  const goToProductEditScreen = (index: number) => {
    navigation.navigate('ProductEditScreen', {
      productDetails: productDetails[index],
      productIndex: index,
      imageProps: imageProps,
      onSave: (updatedProduct: Product, productIndex: number) => {
        setProductDetails(prevState =>
          prevState.map((detail, i) => {
            return i === productIndex
              ? {
                  product: updatedProduct,
                  productImageFrame: detail.productImageFrame,
                }
              : detail;
          }),
        );
      },
    });
  };

  return (
    <ScrollView style={styles.mainContainer}>
      {productDetails.map((details, index) => (
        <TouchableOpacity
          key={index}
          style={styles.productCard}
          // delayLongPress={90}
          onPress={() => {
            goToProductEditScreen(index);
          }}
        >
          <View style={styles.leftSideCard}>
            <Text style={styles.mainText}>{details.product.name}</Text>
            <Text style={styles.secondaryText}>{details.product.prodCode}</Text>
            <Text style={styles.secondaryText}>
              {details.product.category?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.rightSideCard}>
            {details.product.quantity !== 1 && (
              <Text style={styles.secondaryText}>
                {details.product.quantity} x ₡{details.product.unitPrice}
              </Text>
            )}
            <Text style={styles.mainText}>₡{details.product.totalPrice}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSaveData}>
        <Text style={styles.textStyle}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#070709',
    paddingTop: 20,
    marginBottom: 48,
  },
  productCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    margin: 10,
    marginLeft: 15,
    marginRight: 15,
    height: 100,
    borderRadius: 12,
    width: 'auto', //Dimensions.get('window').width - 30
    backgroundColor: '#252429',
  },
  leftSideCard: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSideCard: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  mainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dddddd',
  },
  secondaryText: {
    fontSize: 15,
    color: '#ddddddaa',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
});

export default ProductReviewScreen;
