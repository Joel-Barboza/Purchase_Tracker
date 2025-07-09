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
  useColorScheme,
  View,
} from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import TextRecognition from "@react-native-ml-kit/text-recognition";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { launchImageLibrary } from "react-native-image-picker";
import { readFromFile, addDataToFile } from "../utils/saveData";
import { decrypt, generateKey } from "react-native-aes-crypto";
import Config from 'react-native-config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAllProducts } from "../../db/product";
import { useDb } from "../context/DbContext";
import { getProductPriceById } from "../../db/productPrice";

const PurchasesScreen = ({ route }) => {
  // const [data, setData] = useState(null);

  // // Function to load data from the file
  // const loadData = async () => {
  //   try {
  //     const dataOnFile = await readFromFile(); // Your function to read the file
  //     const dataJSON = JSON.parse(dataOnFile); // Parse the JSON data
  //     setData(dataJSON);
  //   } catch (error) {
  //     console.error("Error loading data:", error);
  //   }
  // };

  // useEffect(() => {
  //   loadData(); // Load the data when the component mounts
  // }, []);

  // // Render loading state while data is being loaded
  // if (!data) {
  //   return <Text style={styles.loadingText}>Loading data...</Text>;
  // }

  // const { purchases } = data;

  // <ScrollView>
  //   {purchases.map(([date, products], index) => {
  //     // Prepare the table data for the current purchase
  //     const tableData = {
  //       tableHead: ['Product Name', 'Product ID', 'Price'],
  //       tableData: products.map(product => [
  //         product.name,
  //         product.prodId,
  //         `₡${product.totalPrice}`,
  //       ]),
  //     };

  //     return (
  //       <View key={index} style={styles.tableContainer}>
  //         {/* Render the date */}
  //         <Text style={styles.dateText}>{`Date: ${new Date(date).toLocaleString()}`}</Text>

  //         {/* Render the table */}
  //         <View style={styles.container}>
  //           <Table borderStyle={{ borderWidth: 2, borderColor: 'teal' }}>
  //             <Row data={tableData.tableHead} style={styles.head} textStyle={styles.headText} />
  //             <Rows data={tableData.tableData} textStyle={styles.tableText} />
  //           </Table>
  //         </View>

  //         {/* Separator */}
  //         <View style={styles.separator} />
  //       </View>
  //     );
  //   })}
  // </ScrollView>
  const [productList, setProductList] = useState([]);
  const db = useDb();
  const fd = async (db) => {
    console.log("dfadfasdfasdfasjlljlasjl");
    const result = await getAllProducts(db);
    let auxList = []
    for (let i = 0; i < result.length; i++) {
      auxList.push(result.item(i));
    }
    console.log(auxList);
    setProductList(auxList);
  }

  // useEffect( async () => {
  //   const result = await getAllProducts(db);
  //   let list = [];
  //   for (let i = 0; i < array.length; i++) {
  //     list.push(result.item(i))

  //   }
  //   console.log(list)
  //   setProductList(list);
  // }, [])


  useEffect(() => {
    fd(db);
  }, [])

  const seeMore = async (prodId) => {
    let prices = await getProductPriceById(db, prodId);
    for (let i = 0; i < prices.length; i++) {
      console.log(prices.item(i));
      
    }
  }

  return (

    <ScrollView style={styles.mainContainer}>
      {/* <Modal
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
      </Modal> */}
      {/* <View style={styles.dateContainer}>

        <TouchableOpacity onPress={() => setShowDateModal(true)} style={styles.dateBtn}>
          <Text style={styles.dateText}>Date: {date ? formatDate(date) : 'DD-MM-YYYY'}</Text>
          <Text style={styles.btnText}>Select Date</Text> 
        </TouchableOpacity>
      </View> */}
      {/* {
        showDateModal && (
          <DateTimePicker
            mode={'date'}
            value={date || new Date()}
            onChange={handleDateChange}
          />

        )
      } */}
      {/* <TouchableOpacity onPress={() => sdfasdf()} style={styles.saveDataBtn}>
        <Text style={styles.btnText}>Save Date</Text>
      </TouchableOpacity> */}
      {
        productList.map((product, index) => (
          <View key={index} style={styles.productCard}>
            <View style={styles.leftSideCard}>
              <Text style={styles.mainText}>{product.product_name}</Text>
              <Text style={styles.secondaryText}>{product.product_code}</Text>
            </View>
            {/* <View style={styles.leftSideCard}>
              <Text style={styles.mainText}>{product.product_name}</Text>
              <Text style={styles.secondaryText}>{product.product_code}</Text>
            </View> */}
            <TouchableOpacity
              style={styles.rightSideCard}
              onPress={async () => { await seeMore(product.id) }}>
              <Text style={styles.btnText}>More Details</Text>
            </TouchableOpacity>
            {/* <View style={styles.rightSideCard}>
              {(product.quantity != "1") && <Text style={styles.secondaryText}>{product.quantity} x ₡{product.unitPrice}</Text>}
              <Text style={styles.mainText}>₡{product.totalPrice}</Text>
            </View> */}

          </View>
          // <TouchableOpacity
          //   key={index}
          //   style={styles.productCard}
          //   delayLongPress={300}
          //   onLongPress={() => { openEditModal(index); console.log(JSON.stringify(product) + " " + " " + JSON.stringify(index)) }}
          // >
          // </TouchableOpacity>

        ))
      }

      <TouchableOpacity
        style={styles.btnText}
        onPress={() => { fd(db) }}>
        <Text style={styles.btnText}>Save</Text>
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
    backgroundColor: "#2c2c2c"
  },
  container: { flex: 1, padding: 10, justifyContent: 'center', backgroundColor: '#fff' },
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
});

export default PurchasesScreen;
