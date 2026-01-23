import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  CATEGORIES,
  ImageProcessingStackParamList,
  Product,
} from '../../utils/types.ts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { categorize } from '../../utils/categorization.ts';

type Props = NativeStackScreenProps<
  ImageProcessingStackParamList,
  'ProductEditScreen'
>;
const ProductEditScreen = ({ route, navigation }: Props) => {
  const { product, productIndex, onSave } = route.params;

  const [draft, setDraft] = useState<Product>(() => ({ ...product }));

  const updateDraft = <K extends keyof Product>(key: K, value: Product[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={draft.name ?? ''}
        onChangeText={text => {
          updateDraft('name', text);
          updateDraft('category', categorize(text));
        }}
      />

      <Text>Product ID</Text>
      <TextInput
        style={styles.input}
        value={draft.prodCode ?? ''}
        onChangeText={text => updateDraft('prodCode', text)}
      />

      <Text>Quantity</Text>
      <TextInput
        style={styles.input}
        value={String(draft.quantity ?? '')}
        onChangeText={text => {
          const qty = parseInt(text, 10) || 0;
          updateDraft('quantity', qty);
          if (draft.totalPrice && qty > 0) {
            updateDraft('unitPrice', draft.totalPrice / qty);
          }
        }}
      />

      {draft.quantity !== 1 && (
        <>
          <Text>Unit Price</Text>
          <TextInput
            style={styles.input}
            value={String(draft.unitPrice ?? '')}
            onChangeText={text =>
              updateDraft('unitPrice', parseInt(text, 10) || 0)
            }
          />
        </>
      )}

      <Text>Total Price</Text>
      <TextInput
        style={styles.input}
        value={String(draft.totalPrice ?? '')}
        onChangeText={text => {
          const total = parseInt(text, 10) || 0;
          updateDraft('totalPrice', total);
          if (draft.quantity === 1) {
            updateDraft('unitPrice', total);
          }
        }}
      />
      <Text>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={draft.category}
          onValueChange={value => updateDraft('category', value)}
        >
          {CATEGORIES.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
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
            onSave(draft, productIndex);
            navigation.goBack();
          }}
        >
          <Text style={styles.textStyle}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8f8e8e',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 5,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
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
    width: '100%',
    borderWidth: 1,
    padding: 10,
  },
  pickerContainer: {
    width: '100%',
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
