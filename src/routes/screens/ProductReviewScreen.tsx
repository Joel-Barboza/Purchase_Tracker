import React, { JSX, useEffect, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [productIndex, setProductIndex] = useState<number | null>(null);

  // https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
  // https://reactnavigation.org/docs/params/#passing-params-to-a-previous-screen
  useEffect(() => {
    if (route.params?.productDetails && productIndex) {
      setProductDetails(extractedProductDetails);
      setProductIndex(null);
    }
  }, [extractedProductDetails, productIndex, route.params?.productDetails]);

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
      productDetails: extractedProductDetails,
      imageProps,
      serialized_ocr,
      store,
      productIndex: index,
      // productDetails: productDetails[index],
      // productIndex: index,
      // imageProps: imageProps,

      // onSave: (updatedProduct: Product, productIndex: number) => {
      // },
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
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
              <Text style={styles.secondaryText}>
                {details.product.prodCode}
              </Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    height: '100%',
    backgroundColor: '#070709',
  },
  mainContainer: {
    // paddingTop: 20,
    // marginBottom: 48,
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
