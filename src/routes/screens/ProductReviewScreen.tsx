import React, { Fragment, JSX, useEffect, useRef, useState } from 'react';
import {
  Animated,
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
  const [longPressProductIndex, setLongPressProductIndex] = useState<
    number | null
  >(null);
  const [toggleTranslate, setToggleTranslate] = useState<0 | -100>(0);

  const transformAnim = useRef(new Animated.Value(0)).current;
  // https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
  // https://reactnavigation.org/docs/params/#passing-params-to-a-previous-screen
  useEffect(() => {
    if (route.params?.productDetails && productIndex) {
      setProductDetails(extractedProductDetails);
      setProductIndex(null);
    }
  }, [extractedProductDetails, productIndex, route.params?.productDetails]);


  const handleDeleteProduct = (indexToDelete: number) => {
    setProductDetails(prevItems =>
      prevItems.filter((_, index) => index !== indexToDelete),
    );
    setLongPressProductIndex(null);
  };

  const transformLeft = () => {
    const toggle: 0 | -100 = toggleTranslate === -100 ? 0 : -100;
    setToggleTranslate(toggle);

    // Reset the animation value before animating
    transformAnim.stopAnimation(() => {
      transformAnim.setValue(toggleTranslate); // Start from current state
      Animated.timing(transformAnim, {
        toValue: toggle,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    toggle === 0 && setLongPressProductIndex(null);
  };

  const handleSaveData = () => {
    db && productDetails.length !== 0 &&
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
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        {productDetails.map((details, index) => (
          <Fragment key={index}>
            <TouchableOpacity
              style={[styles.card, styles.deleteButton, { top: 120 * index }]}
              onPress={() => handleDeleteProduct(index)}
            >
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.card,
                longPressProductIndex === index && {
                  transform: [{ translateX: transformAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.productCard}
                activeOpacity={1}
                delayLongPress={120}
                onLongPress={() => {
                  setLongPressProductIndex(index);
                  transformLeft();
                }}
                onPress={() => {
                  longPressProductIndex
                    ? transformLeft()
                    : goToProductEditScreen(index);
                  setLongPressProductIndex(null);
                }}
              >
                <>
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
                        {details.product.quantity} x ₡
                        {details.product.unitPrice}
                      </Text>
                    )}
                    <Text style={styles.mainText}>
                      ₡{details.product.totalPrice}
                    </Text>
                  </View>
                </>
              </TouchableOpacity>
            </Animated.View>
          </Fragment>
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
  card: {
    zIndex: 1000,
    height: 100,
    margin: 10,
    marginLeft: 15,
    marginRight: 15,
    overflow: 'hidden',
    borderRadius: 12,
  },
  productCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
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
  deleteOptions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  deleteButton: {
    backgroundColor: 'red',
    zIndex: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    width: 120,
    padding: 15,
    right: 0,
  },
});

export default ProductReviewScreen;
