import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cardStyle } from "../../styles/card";
import { useEffect, useState } from "react";
import { useDb } from "../../context/DbContext";
import { getAllProducts } from "../../../db/product";
import { getProductPriceById } from "../../../db/productPrice";

const ProductsScreen = () => {
  const navigation = useNavigation();
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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {
          productList.map((product, index) => (
            <TouchableOpacity 
              key={index} 
              style={cardStyle.productCard}
              onLongPress={()=> console.log("1")}
            >
              <View style={cardStyle.leftSideCard}>
                <Text style={cardStyle.mainText}>{product.product_name}</Text>
                <Text style={cardStyle.secondaryText}>{product.product_code}</Text>
              </View>
              <View style={cardStyle.rightSideCard}>
                <Text style={cardStyle.mainText}>₡{product.last_price}</Text>
                <TouchableOpacity
                  onPress={async () => { await seeMore(product.id) }}>
                  <Text style={cardStyle.secondaryText}>More Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

          ))
        }

        {/* <TouchableOpacity
          style={styles.btnText}
          onPress={() => { fd(db) }}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
  container: {
    height: "93%", // exluding the footer
  },
  scrollView: {
    backgroundColor: "#070709",
  },
  btnText: {
    color: 'white',
    fontSize: 20,
  },
});

export default ProductsScreen;