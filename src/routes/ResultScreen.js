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
import { Table, Row, Rows } from 'react-native-table-component';
import { readFromFile, addDataToFile } from "../utils/saveData";
import { decrypt, generateKey } from "react-native-aes-crypto";
import Config from 'react-native-config';
import DateTimePicker from '@react-native-community/datetimepicker';

const ResultScreen = ({ route }) => {
  const { text = { wordList: [], discard: [], products: [] } } = route.params || {}; // Default values
  const { wordList, discard, products } = text;
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(null);

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
    let fsfs= await decrypt({cipher, iv}, key);
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
    setShowModal(false);
  }

  const formatDate = (date) => {
    if (!date) return 'DD-MM-YYYY';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <ScrollView>
      <View style={styles.dateContainer}>

      <Text style={styles.dateText}>Date: {date ? formatDate(date) : 'DD-MM-YYYY'}</Text>
      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.dateBtn}>
        <Text style={styles.btnText}>Select Date</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 4, borderColor: 'teal' }}>
          <Row data={data.tableHead} style={styles.head} textStyle={styles.headText} />
          <Rows data={data.tableData} textStyle={styles.tableText} />
        </Table>
      </View>
      {
        showModal && (
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
  container: { flex: 1, padding: 10, justifyContent: 'center', backgroundColor: '#fff' },
  head: { height: 44, backgroundColor: 'darkblue' },
  headText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white' },
  tableText: { margin: 6, fontSize: 12, fontWeight: 'bold', textAlign: 'center', color:'black' },
  dateBtn: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    width: 25,
    height: 40
  },
  dateContainer: {
    flex:1,
    flexDirection: 'row',
    justifyContent:'space-between',
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
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    width: '100%',
    height: 40
  }
});

export default ResultScreen;
