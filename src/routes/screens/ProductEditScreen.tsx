import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  CATEGORIES,
  ImageProcessingStackParamList,
  Product,
} from '../../utils/types.ts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { categorize } from '../../utils/categorization.ts';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductFrameOnReceiptImage from '../../components/ProductFrameOnReceiptImage.tsx';

type Props = NativeStackScreenProps<
  ImageProcessingStackParamList,
  'ProductEditScreen'
>;
const ProductEditScreen = ({ route, navigation }: Props) => {
  const { productDetails, productIndex, imageProps, onSave } = route.params;
  const product = productDetails?.product;

  // const [draft, setDraft] = useState<Product>(productDetails.product);
  //
  // const updateDraft = <K extends keyof Product>(key: K, value: Product[K] | string) => {
  //   setDraft(prev => ({ ...prev, [key]: value }));
  // };

  const [name, setName] = useState<string>(product?.name || '');
  const [productCode, setProductCode] = useState<string>(
    product?.prodCode || '',
  );
  const [quantity, setQuantity] = useState<string>(
    String(product?.quantity || ''),
  );
  const [unitPrice, setUnitPrice] = useState<string>(
    String(product?.unitPrice || ''),
  );
  const [totalPrice, setTotalPrice] = useState<string>(
    String(product?.totalPrice || ''),
  );
  const [category, setCategory] = useState<string>(product?.category || '');
  const [soldByKg, setSoldByKg] = useState<0 | 1>(
    productDetails.product.soldByKg || 0,
  );

  const [isValidQuantity, setIsValidQuantity] = useState<boolean>(!!quantity);

  const checkQuantityFormat = (text: string): boolean => {
    const regex = /^-?\d*[,.]?\d+$/;

    return regex.test(text);
  };

  useEffect(() => {
    if (totalPrice && parseFloat(quantity.replace(',', '.')) > 0) {
      setUnitPrice(
        String(
          Math.round(
            parseInt(totalPrice, 10) / parseFloat(quantity.replace(',', '.')),
          ),
        ),
      );
    }
  }, [totalPrice, quantity]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Product on receipt</Text>
      <ProductFrameOnReceiptImage
        productDetails={productDetails}
        imageProps={imageProps}
      />
      <Text>Product Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text>Product Code</Text>
      <TextInput
        style={styles.input}
        value={productCode}
        onChangeText={value => {
          setProductCode(value);
          /\.*k$/i.test(value) ? setSoldByKg(1) : setSoldByKg(0);
        }}
      />

      <Text>Quantity</Text>
      <TextInput
        style={
          isValidQuantity ? styles.input : [styles.input, styles.invalidInput]
        }
        value={quantity}
        keyboardType={'numeric'}
        onChangeText={text => {
          const hasQuantityFormat: boolean = checkQuantityFormat(text);
          setIsValidQuantity(hasQuantityFormat);
          setQuantity(text);
        }}
      />
      {quantity !== '1' && isValidQuantity && (
        <>
          <Text>Unit Price</Text>
          <TextInput
            style={styles.input}
            value={unitPrice}
            keyboardType={'numeric'}
            onChangeText={setUnitPrice}
          />
        </>
      )}

      <Text>Total Price</Text>
      <TextInput
        style={styles.input}
        value={totalPrice}
        keyboardType={'numeric'}
        onChangeText={text => {
          setTotalPrice(text);
          if (quantity === '1') {
            setUnitPrice(text);
          }
        }}
      />
      <Text>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={category}
          onValueChange={setCategory}
        >
          {CATEGORIES.map((categoryName, index) => (
            <Picker.Item
              key={index}
              label={categoryName}
              value={categoryName}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[styles.button, styles.btnCancel]}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.textStyle}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.btnSave]}
          onPress={() => {
            if (!isValidQuantity) {
              Alert.alert('Invalid Quantity');
              return;
            }
            onSave(
              {
                name,
                prodCode: productCode,
                quantity: parseFloat(quantity.replace(',', '.')),
                unitPrice: parseInt(unitPrice, 10),
                totalPrice: parseInt(totalPrice, 10),
                soldByKg,
                category,
              },
              productIndex,
            );
            navigation.goBack();
          }}
        >
          <Text style={styles.textStyle}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#8f8e8e',
    paddingTop: 10,
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 5,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '90%',
    marginTop: 10,
  },
  btnCancel: {
    backgroundColor: '#acacac',
  },
  btnSave: {
    backgroundColor: '#2196F3',
    marginLeft: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
  input: {
    color: '#e8e8e8',
    height: 40,
    margin: 12,
    width: '90%',
    borderWidth: 1,
    padding: 10,
  },
  invalidInput: {
    borderColor: 'red',
  },
  pickerContainer: {
    width: '90%',
    height: 62,
    borderWidth: 1,
    margin: 12,
  },
  picker: {
    position: 'absolute',
    height: 60,
    width: '100%',
  },
});

export default ProductEditScreen;
