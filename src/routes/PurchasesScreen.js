import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllProducts } from "../../db/product";
import { useDb } from "../context/DbContext";
import { getProductPriceById } from "../../db/productPrice";
import { cardStyle } from "../styles/card";

const PurchasesScreen = ({ route }) => {
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
      {
        productList.map((product, index) => (
          <View key={index} style={cardStyle.productCard}>
            <View style={cardStyle.leftSideCard}>
              <Text style={cardStyle.mainText}>{product.product_name}</Text>
              <Text style={cardStyle.secondaryText}>{product.product_code}</Text>
            </View>
            <TouchableOpacity
              style={cardStyle.rightSideCard}
              onPress={async () => { await seeMore(product.id) }}>
              <Text style={styles.mainText}>More Details</Text>
            </TouchableOpacity>
          </View>

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
  mainContainer: {
    backgroundColor: "#070709"
  },
  btnText: {
    color: 'white',
    fontSize: 20,
  },
});

export default PurchasesScreen;
