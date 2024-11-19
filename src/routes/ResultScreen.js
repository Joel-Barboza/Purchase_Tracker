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

const ResultScreen = ({ route }) => {
  const { text = { wordList: [], discard: [], products: [] } } = route.params || {}; // Default values
  const { wordList, discard, products } = text;
  const tableData = {
    tableHead: ['Product Name', 'Product ID', 'Price'],
    tableData: [],
  };
  products.forEach(product => {
    tableData.tableData.push([product.name, product.prodId, "₡" + product.totalPrice])
  });
  const [data, setData] = useState(tableData);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 4, borderColor: 'teal' }}>
          <Row data={data.tableHead} style={styles.head} textStyle={styles.headText} />
          <Rows data={data.tableData} textStyle={styles.tableText} />
        </Table>
      </View>
      <Text style={styles.title}>Lines</Text>
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
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
  title: {
    fontSize: 30,
  },
  container: { flex: 1, padding: 10, justifyContent: 'center', backgroundColor: '#fff' },
  head: { height: 44, backgroundColor: 'darkblue' },
  headText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'white' },
  tableText: { margin: 6, fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
});

export default ResultScreen;
