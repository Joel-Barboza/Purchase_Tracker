import { StyleSheet } from "react-native";

export const cardStyle = StyleSheet.create({
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
  }
});