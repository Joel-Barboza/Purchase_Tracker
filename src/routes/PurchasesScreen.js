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

const PurchasesScreen = ({ route }) => {
  const [data, setData] = useState(null);

  // Function to load data from the file
  const loadData = async () => {
    try {
      const dataOnFile = await readFromFile(); // Your function to read the file
      const dataJSON = JSON.parse(dataOnFile); // Parse the JSON data
      setData(dataJSON);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData(); // Load the data when the component mounts
  }, []);

  // Render loading state while data is being loaded
  if (!data) {
    return <Text style={styles.loadingText}>Loading data...</Text>;
  }

  const { purchases } = data;

  return (
    <ScrollView>
      {purchases.map(([date, products], index) => {
        // Prepare the table data for the current purchase
        const tableData = {
          tableHead: ['Product Name', 'Product ID', 'Price'],
          tableData: products.map(product => [
            product.name,
            product.prodId,
            `₡${product.totalPrice}`,
          ]),
        };

        return (
          <View key={index} style={styles.tableContainer}>
            {/* Render the date */}
            <Text style={styles.dateText}>{`Date: ${new Date(date).toLocaleString()}`}</Text>

            {/* Render the table */}
            <View style={styles.container}>
              <Table borderStyle={{ borderWidth: 2, borderColor: 'teal' }}>
                <Row data={tableData.tableHead} style={styles.head} textStyle={styles.headText} />
                <Rows data={tableData.tableData} textStyle={styles.tableText} />
              </Table>
            </View>

            {/* Separator */}
            <View style={styles.separator} />
          </View>
        );
      })}
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
  }
});

export default PurchasesScreen;
