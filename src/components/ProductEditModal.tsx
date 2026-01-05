import { JSX, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Product } from "../utils/types";

const ProductEditModal = (
  { isOpen, onSave, onClose, product }: {
    isOpen: boolean,
    onSave: (
      prodNameChange: string,
      prodCodeChange: string,
      prodQuantityChange: string,
      prodUnitPriceChange: string,
      prodTotalPriceChange: string) => void,
    onClose: () => void,
    product: Product
  }
): JSX.Element | null => {
  if (!isOpen) return null;

  // Used to store the values when the edit modal is showing
  const [prodNameChange, setProdNameChange] = useState<string>(product.name ?? "");
  const [prodCodeChange, setProdCodeChange] = useState<string>(product.prodCode ?? "");
  const [prodQuantityChange, setProdQuantityChange] = useState<string>(product.quantity?.toString() ?? "");
  const [prodUnitPriceChange, setProdUnitPriceChange] = useState<string>(product.unitPrice?.toString() ?? "");
  const [prodTotalPriceChange, setProdTotalPriceChange] = useState<string>(product.totalPrice?.toString() ?? "");

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
            onChangeText={(text) => {
              setProdQuantityChange(text);
              setProdUnitPriceChange((parseInt(prodTotalPriceChange) / parseInt(text)).toString())
            }}
            value={prodQuantityChange}
          />
          {prodQuantityChange != '1' &&
            (<>
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
            onChangeText={(text) => {
              setProdTotalPriceChange(text);
              prodQuantityChange == '1' && setProdUnitPriceChange(text);
            }}
            value={prodTotalPriceChange.toString()}
          />
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[styles.button, styles.btnCancel]}
              onPress={() => {
                onClose();
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.btnSave]}
              onPress={() => {
                onSave(prodNameChange, prodCodeChange, prodQuantityChange, prodUnitPriceChange, prodTotalPriceChange)
              }}>
              <Text style={styles.textStyle}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  // text: {
  //   color: "black",
  // },
  // title: {
  //   fontSize: 30,
  //   color: 'black'
  // },
  // mainContainer: {
  //   backgroundColor: "#070709",
  //   paddingTop: 20,
  //   marginBottom: 48
  // },
  // tableContainer: { flex: 1, padding: 10, justifyContent: 'center', backgroundColor: '#fff' },
  // head: { height: 44, backgroundColor: 'darkblue' },
  // headText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white' },
  // tableText: { margin: 6, fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: 'black' },
  // dateBtn: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   // backgroundColor: 'red',
  //   width: 25,
  //   height: 40
  // },
  // dateText: {
  //   color: 'white',
  //   fontSize: 20
  // },
  // productCard: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'flex-start',
  //   padding: 10,
  //   margin: 10,
  //   marginLeft: 15,
  //   marginRight: 15,
  //   height: 100,
  //   borderRadius: 12,
  //   width: "auto",//Dimensions.get('window').width - 30
  //   backgroundColor: "#252429"
  // },
  // leftSideCard: {
  //   flex: 1,
  //   justifyContent: "center",

  //   //backgroundColor: "#ccaaaa"

  // },
  // rightSideCard: {
  //   flex: 1,
  //   //flexDirection:"row",
  //   alignItems: "flex-end",
  //   justifyContent: "center",
  //   //flexWrap:"wrap",
  //   //backgroundColor: "#aaccaa",

  // },
  // mainText: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  //   color: "#dddddd",
  // },
  // secondaryText: {
  //   fontSize: 15,
  //   color: "#ddddddaa",
  // },
  // btnText: {
  //   color: 'black',
  //   fontSize: 20,
  // },
  // saveDataBtn: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   // backgroundColor: 'red',
  //   width: '100%',
  //   height: 40
  // },



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
    width: "75%",
    height: "auto",
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
    height: 40,
    margin: 12,
    width: "100%",
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
  // modalText: {
  //   marginBottom: 15,
  //   textAlign: 'center',
  // },
});


export default ProductEditModal;