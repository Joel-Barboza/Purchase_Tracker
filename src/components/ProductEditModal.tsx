import { JSX, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CATEGORIES, Product } from '../utils/types';
import { Picker } from '@react-native-picker/picker';

const ProductEditModal = ({
  isOpen,
  onSave,
  onClose,
  product,
}: {
  isOpen: boolean;
  onSave: (
    prodNameChange: string,
    prodCodeChange: string,
    prodQuantityChange: string,
    prodUnitPriceChange: string,
    prodTotalPriceChange: string,
    prodCategoryChange: string,
  ) => void;
  onClose: () => void;
  product: Product;
}): JSX.Element | null => {
  // Used to store the values when the edit modal is showing
  const [prodNameChange, setProdNameChange] = useState<string>(
    product.name ?? '',
  );
  const [prodCodeChange, setProdCodeChange] = useState<string>(
    product.prodCode ?? '',
  );
  const [prodQuantityChange, setProdQuantityChange] = useState<string>(
    product.quantity?.toString() ?? '',
  );
  const [prodUnitPriceChange, setProdUnitPriceChange] = useState<string>(
    product.unitPrice?.toString() ?? '',
  );
  const [prodTotalPriceChange, setProdTotalPriceChange] = useState<string>(
    product.totalPrice?.toString() ?? '',
  );
  const [prodCategoryChange, setProdCategoryChange] = useState<string>(
    product.category ?? '',
  );

  if (!isOpen) return null;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>Product Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setProdNameChange}
            value={prodNameChange}
          />
          <Text>Product ID</Text>
          <TextInput
            style={styles.input}
            onChangeText={setProdCodeChange}
            value={prodCodeChange}
          />
          <Text>Quantity</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              setProdQuantityChange(text);
              setProdUnitPriceChange(
                (parseInt(prodTotalPriceChange) / parseInt(text)).toString(),
              );
            }}
            value={prodQuantityChange}
          />
          {prodQuantityChange != '1' && (
            <>
              <Text>Unit Price</Text>
              <TextInput
                style={styles.input}
                onChangeText={() => setProdUnitPriceChange}
                value={prodUnitPriceChange.toString()}
              />
            </>
          )}
          <Text>Total Price</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              setProdTotalPriceChange(text);
              prodQuantityChange == '1' && setProdUnitPriceChange(text);
            }}
            value={prodTotalPriceChange.toString()}
          />
          <Text>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={prodCategoryChange}
              onValueChange={itemValue => setProdCategoryChange(itemValue)}
            >
              {CATEGORIES.map((category, index) => (
                <Picker.Item
                  style={styles.pickerItem}
                  key={index}
                  label={category}
                  value={category}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[styles.button, styles.btnCancel]}
              onPress={() => {
                onClose();
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.btnSave]}
              onPress={() => {
                onSave(
                  prodNameChange,
                  prodCodeChange,
                  prodQuantityChange,
                  prodUnitPriceChange,
                  prodTotalPriceChange,
                  prodCategoryChange
                );
              }}
            >
              <Text style={styles.textStyle}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  pickerItem: {
    color: '#e8e8e8',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'gray',
    borderRadius: 20,
    padding: 20,
    width: '75%',
    height: 'auto',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    color: '#e8e8e8',
    height: 40,
    margin: 12,
    width: '100%',
    borderWidth: 1,
    padding: 10,
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
});

export default ProductEditModal;
