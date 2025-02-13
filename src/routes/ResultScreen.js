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
import { Table, Row, Rows } from 'react-native-table-component';
import { readFromFile, addDataToFile } from "../utils/saveData";
import { decrypt, generateKey } from "react-native-aes-crypto";
import Config from 'react-native-config';
import DateTimePicker from '@react-native-community/datetimepicker';

const ResultScreen = ({ route }) => {
  const { text = { wordList: [], discard: [], products: [] } } = route.params || {}; // Default values
  const { wordList, discard, products } = text;
  const [showDateModal, setShowDateModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [date, setDate] = useState(null);
  const [productList, setProductList] = useState(products);

  // Used to store the values when the edit modal is showing
  const [prodNameChange, setProdNameChange] = useState("");
  const [prodIdChange, setProdIdChange] = useState("");
  const [prodAmountChange, setProdAmountChange] = useState("");
  const [prodUnitPriceChange, setProdUnitPriceChange] = useState("");
  const [prodTotalPriceChange, setProdTotalPriceChange] = useState("");

  const tableData = {
    tableHead: ['Product Name', 'Product ID', 'Price'],
    tableData: [],
  };
  products.forEach(product => {
    tableData.tableData.push([product.name, product.prodId, "₡" + product.totalPrice])
  });
  const [data, setData] = useState(tableData);

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
    if (!date) return 'DD-MM-YYYY';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const editExtractedInfo = (productIndex) => {
    setProdNameChange(productList[productIndex].name);
    setProdIdChange(productList[productIndex].prodId);
    // setProdAmountChange(productList[productIndex]);
    // setProdUnitPriceChange(productList[productIndex]);
    setProdTotalPriceChange(productList[productIndex].totalPrice);
    setShowEditProductModal(!showEditProductModal);
  }

  return (
    <ScrollView style={styles.mainContainer}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showEditProductModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setShowEditProductModal(!showEditProductModal);
        }}>
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
              onChangeText={setProdIdChange}
              value={prodIdChange}
            />
            <Text>Amount</Text>
            <TextInput
              style={styles.input}
              onChangeText={setProdAmountChange}
              value={prodAmountChange}
            />
            <Text>Unit Price</Text>
            <TextInput
              style={styles.input}
              onChangeText={setProdUnitPriceChange}
              value={prodUnitPriceChange}
            />
            <Text>Total Price</Text>
            <TextInput
              style={styles.input}
              onChangeText={setProdTotalPriceChange}
              value={prodTotalPriceChange}
            />
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowEditProductModal(!showEditProductModal)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.dateContainer}>

        <Text style={styles.dateText}>Date: {date ? formatDate(date) : 'DD-MM-YYYY'}</Text>
        <TouchableOpacity onPress={() => setShowDateModal(true)} style={styles.dateBtn}>
          <Text style={styles.btnText}>Select Date</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.tableContainer}>
        <Table borderStyle={{ borderWidth: 4, borderColor: 'teal' }}>
          <Row data={data.tableHead} style={styles.head} textStyle={styles.headText} />
          <Rows data={data.tableData} textStyle={styles.tableText} />
        </Table>
      </View> */}
      {
        showDateModal && (
          <DateTimePicker
            mode={'date'}
            value={date || new Date()}
            onChange={handleDateChange}
          />

        )
      }
      <TouchableOpacity onPress={() => sdfasdf()} style={styles.saveDataBtn}>
        <Text style={styles.btnText}>Save Date</Text>
      </TouchableOpacity>
      {/* <Text style={styles.title}>Lines</Text>
      {wordList.map((elem, index) => (
        <Text key={"word" + index} style={styles.text}>
          {elem}
        </Text>
      ))}
      <Text style={styles.title}>Discarded words</Text>
      {discard.map((elem, index) => (
        <Text key={"discarded" + index} style={styles.text}>
          {elem}
        </Text>
      ))} */}
      {
        productList.map((product, index) => (
          <TouchableOpacity
            key={index}
            style={styles.productCard}
            onLongPress={() => editExtractedInfo(index)}
          >
            <View style={styles.leftSideCard}>
              <Text style={styles.mainText}>{product.name}</Text>
              <Text style={styles.secondaryText}>{product.prodId}</Text>
            </View>
            <View style={styles.rightSideCard}>
              <Text style={styles.secondaryText}>{1} x ₡{99.999}</Text>
              <Text style={styles.mainText}>₡{product.totalPrice}</Text>
            </View>
          </TouchableOpacity>

        ))
      }

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
    backgroundColor: "#2c2c2c"
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
    backgroundColor: "#c2c2c2"
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
    color: "#222",
  },
  secondaryText: {
    fontSize: 15,
    color: "#222a",
  },
  dateText: {
    color: 'black',
    fontSize: 20
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
    padding: 35,
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
    borderWidth: 1,
    padding: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 200,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ResultScreen;
