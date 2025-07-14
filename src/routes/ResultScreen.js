import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  useColorScheme,
  View,
  Dimensions,
  Modal,
  TextInput,
} from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { launchImageLibrary } from "react-native-image-picker";
import { readFromFile, addDataToFile } from "../utils/saveData";
import { decrypt, generateKey } from "react-native-aes-crypto";
import Config from 'react-native-config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addToDB } from "../utils/utils";
import { useDb } from "../context/DbContext";

const ResultScreen = ({ route }) => {
  const db = useDb();
  const { text = { wordList: [], discard: [], products: [] } } = route.params || {}; // Default values
  const { wordList, discard, products } = text;
  const [showDateModal, setShowDateModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [productList, setProductList] = useState(products);

  // Used to store the values when the edit modal is showing
  const [prodListIndex, setProdListIndex] = useState(-1);
  const [prodNameChange, setProdNameChange] = useState("");
  const [prodCodeChange, setProdCodeChange] = useState("");
  const [prodQuantityChange, setProdQuantityChange] = useState("");
  const [prodUnitPriceChange, setProdUnitPriceChange] = useState("");
  const [prodTotalPriceChange, setProdTotalPriceChange] = useState("");

  const tableData = {
    tableHead: ['Product Name', 'Product ID', 'Price'],
    tableData: [],
  };
  products.forEach(product => {
    tableData.tableData.push([product.name, product.prodCode, "₡" + product.totalPrice])
  });
  const [data, setData] = useState(tableData);

  // check this out!!!!!!!!!!!!!!!!!!!!!
  // looks like the funcion is having error, and change the name!!!!!!!!
  const sdfasdf = async () => {
    await addDataToFile(products, date);
    const fileData = await readFromFile();
    const { cipher, iv } = fileData;
    const key = await generateKey(
      Config.ENCRYPT_PSSWRD,
      Config.ENCRYPT_SALT,
      parseInt(Config.ENCRYPT_COST),
      parseInt(Config.ENCRYPT_LENGTH)
    );
    let fsfs = await decrypt({ cipher, iv }, key);
    console.log(fsfs, "no?");

  }
  // useEffect(() => {
  //   sdfasdf();

  // }, [])

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      console.log(selectedDate);
      setDate(currentDate);
    }
    setShowDateModal(false);
  }

  const formatDate = (date) => {
    if (!date) return 'YYYY-MM-DD';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const YYYYMMDDDate = `${year}-${month}-${day}`;
    if (!/(\d{4}-\d{2}-\d{2})/.test(YYYYMMDDDate)) return null;
    return YYYYMMDDDate;
  };

  const openEditModal = (productIndex) => {
    setProdListIndex(productIndex);
    setProdNameChange(productList[productIndex].name);
    setProdCodeChange(productList[productIndex].prodCode);
    setProdQuantityChange(productList[productIndex].quantity);
    setProdUnitPriceChange(productList[productIndex].unitPrice);
    setProdTotalPriceChange(productList[productIndex].totalPrice);
    setShowEditProductModal(true);
    // console.log(productIndex);
    // console.log(productList[productIndex].name);
    // console.log(productList[productIndex].prodCode);
    // console.log(productList[productIndex].quantity);
    // console.log(productList[productIndex].unitPrice);
    // console.log(productList[productIndex].totalPrice);
    // console.log(showEditProductModal);
  }

  const editExtractedProductList = () => {
    if (prodListIndex == -1) return;

    // to avoid mutating the array source: https://react.dev/learn/updating-arrays-in-state#replacing-items-in-an-array
    const newProductList = productList.map((elem, i) => {
      if (i === prodListIndex) {
        let editedElem = elem;
        editedElem.name = prodNameChange;
        editedElem.prodCode = prodCodeChange;
        editedElem.quantity = prodQuantityChange;
        editedElem.unitPrice = prodUnitPriceChange;
        editedElem.totalPrice = prodTotalPriceChange;
        return editedElem;
      } else {
        return elem;
      }
    });
    setProductList(newProductList);

    resetProductEditVariables();
    setShowEditProductModal(false);
  }

  const resetProductEditVariables = () => {
    setProdListIndex(-1);
    setProdNameChange("");
    setProdCodeChange("");
    setProdQuantityChange("");
    setProdUnitPriceChange("");
    setProdTotalPriceChange("");
  }

  // useEffect(() => {
  //   console.log(new Date())
  // }, [])
  

  return (
    <ScrollView style={styles.mainContainer}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showEditProductModal}
        onRequestClose={() => setShowEditProductModal(false)}
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
            <Text>Amount</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setProdQuantityChange(text);
                setProdUnitPriceChange(parseInt(prodTotalPriceChange)/parseInt(text))
              }}
              value={prodQuantityChange}
            />
            {prodQuantityChange != "1" &&
              (<>
                <Text>Unit Price</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setProdUnitPriceChange}
                  value={prodUnitPriceChange}
                />
              </>
              )}
            <Text>Total Price</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setProdTotalPriceChange(text);
                prodQuantityChange == "1" && setProdUnitPriceChange(text);
              }}
              value={prodTotalPriceChange}
            />
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[styles.button, styles.btnCancel]}
                onPress={() => {
                  setShowEditProductModal(false);
                  resetProductEditVariables();
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.btnSave]}
                onPress={() => editExtractedProductList()}>
                <Text style={styles.textStyle}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.dateContainer}>

        <TouchableOpacity onPress={() => setShowDateModal(true)} style={styles.dateBtn}>
          <Text style={styles.dateText}>Date: {date ? formatDate(date) : 'DD-MM-YYYY'}</Text>
          {/* <Text style={styles.btnText}>Select Date</Text> */}
        </TouchableOpacity>
      </View>
      {
        showDateModal && (
          <DateTimePicker
            mode={'date'}
            value={date || new Date()}
            onChange={handleDateChange}
          />

        )
      }
      {/* <TouchableOpacity onPress={() => sdfasdf()} style={styles.saveDataBtn}>
        <Text style={styles.btnText}>Save Date</Text>
      </TouchableOpacity> */}
      {
        productList.map((product, index) => (

          <TouchableOpacity
            key={index}
            style={styles.productCard}
            delayLongPress={300}
            onLongPress={() => { openEditModal(index); console.log(JSON.stringify(product) + " " + " " + JSON.stringify(index)) }}
          >
            <View style={styles.leftSideCard}>
              <Text style={styles.mainText}>{product.name}</Text>
              <Text style={styles.secondaryText}>{product.prodCode}</Text>
            </View>
            <View style={styles.rightSideCard}>
              {(product.quantity != "1") && <Text style={styles.secondaryText}>{product.quantity} x ₡{product.unitPrice}</Text>}
              <Text style={styles.mainText}>₡{product.totalPrice}</Text>
            </View>
          </TouchableOpacity>

        ))
      }

      <TouchableOpacity
        style={styles.button}
        onPress={() => { addToDB(productList, date, db); console.log(productList) }}>
        <Text style={styles.textStyle}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
  title: {
    fontSize: 30,
    color: 'black'
  },
  mainContainer: {
    backgroundColor: "#070709"
  },
  tableContainer: { flex: 1, padding: 10, justifyContent: 'center', backgroundColor: '#fff' },
  head: { height: 44, backgroundColor: 'darkblue' },
  headText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white' },
  tableText: { margin: 6, fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: 'black' },
  dateBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    width: 25,
    height: 40
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'space-evenly',

  },
  dateText: {
    color: 'white',
    fontSize: 20
  },
  productCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'top',
    padding: 10,
    margin: 10,
    marginLeft: 15,
    marginRight: 15,
    height: 100,
    borderRadius: 12,
    width: "auto",//Dimensions.get('window').width - 30
    backgroundColor: "#252429"
  },
  leftSideCard: {
    flex: 1,
    justifyContent: "center",

    //backgroundColor: "#ccaaaa"

  },
  rightSideCard: {
    flex: 1,
    //flexDirection:"row",
    alignItems: "flex-end",
    justifyContent: "center",
    //flexWrap:"wrap",
    //backgroundColor: "#aaccaa",

  },
  mainText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dddddd",
  },
  secondaryText: {
    fontSize: 15,
    color: "#ddddddaa",
  },
  btnText: {
    color: 'black',
    fontSize: 20,
  },
  saveDataBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    width: '100%',
    height: 40
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ResultScreen;
