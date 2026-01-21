import React, { JSX } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
// import { useLinkBuilder, useTheme } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// const icons = {
//   Home: 'house',
//   Stats: 'square-poll-vertical',
//   Wallet: 'wallet',
//   ShoppingCart: 'cart-shopping',
// };

const TabBar = ({
  // state,
  // descriptors,
  navigation,
}: BottomTabBarProps): JSX.Element => {
  // const { colors } = useTheme();
  // const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.footer}>
      <View style={styles.cont1}>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => navigation.navigate('CameraScreen')}
        >
          <FontAwesome6
            name="plus"
            iconStyle="solid"
            size={24}
            color={'#999dac'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    backgroundColor: 'lightblue',
    width: '100%',
  },
  footer: {
    position: 'absolute',
    backgroundColor: '#120f10',
    width: '100%',
    height: '8%',
    bottom: 50,
    flex: 1,
    // flexDirection: "row",
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  footerBtn: {
    color: 'white',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    // margin: 'auto',
    backgroundColor: '#ee3a28',
    borderRadius: 50,
    padding: 15,
    width: 70,
    height: 70,
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // margin: [0, 'auto'],
    position: 'relative',
    bottom: '9%',
  },
  midButton: {
    // backgroundColor: '#60ff22',
    borderRadius: 8,
    padding: 15,
  },
  leftIcons: {
    // backgroundColor: '#ff9822ff',
    borderRadius: 8,
    marginRight: 35,
  },
  rightIcons: {
    // backgroundColor: '#22ffdaff',
    borderRadius: 8,
    marginLeft: 35,
  },
  cont1: {
    flex: 1,
    flexDirection: 'row',
    height: 0,
  },
  cont2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    bottom: '3.5%',
  },
  tabBarIcon: {
    width: 24,
    height: 24,
  },
});

export default TabBar;
