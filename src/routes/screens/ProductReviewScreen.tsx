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
  Product,
  Store,
} from '../../utils/types';
import { persistPurchaseData } from '../../utils/utils';

type Props = NativeStackScreenProps<
  ImageProcessingStackParamList,
  'ProductReviewScreen'
>;

const ProductReviewScreen = ({ route, navigation }: Props): JSX.Element => {
  const db = useDb();
  const products: Product[] = route.params.productList;
  const image_uri: string = route.params.image_uri;
  const serialized_ocr: string = route.params.serialized_ocr;
  const store: Store = route.params.store;

  const [productList, setProductList] = useState<Product[]>(products);

  const handleSaveData = () => {
    db &&
      persistPurchaseData(db, {
        products: productList,
        image_uri,
        serialized_ocr,
        store,
      });
    navigation.popToTop();
  };

  const goToProductEditScreen = (index: number) => {
    navigation.navigate('ProductEditScreen', {
      product: productList[index],
      productIndex: index,
      onSave: (updatedProduct: Product, productIndex: number) => {
        setProductList(prev =>
          prev.map((p, i) => (i === productIndex ? updatedProduct : p)),
        );
      },
    });
  };

  return (
    <ScrollView style={styles.mainContainer}>
      {productList.map((product, index) => (
        <TouchableOpacity
          key={index}
          style={styles.productCard}
          delayLongPress={300}
          onLongPress={() => {
            goToProductEditScreen(index);
            console.log(
              JSON.stringify(product) + ' ' + ' ' + JSON.stringify(index),
            );
          }}
        >
          <View style={styles.leftSideCard}>
            <Text style={styles.mainText}>{product.name}</Text>
            <Text style={styles.secondaryText}>{product.prodCode}</Text>
            <Text style={styles.secondaryText}>
              {product.category?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.rightSideCard}>
            {product.quantity != 1 && (
              <Text style={styles.secondaryText}>
                {product.quantity} x ₡{product.unitPrice}
              </Text>
            )}
            <Text style={styles.mainText}>₡{product.totalPrice}</Text>
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
