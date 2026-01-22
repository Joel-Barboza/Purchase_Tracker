import React, { JSX } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
// import { useLinkBuilder, useTheme } from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView edges={['bottom']} style={styles.footer}>
      {/*<View style={styles.cont1}>*/}
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => navigation.navigate('CameraScreen')}
        >
          <FontAwesome6
            name="plus"
            iconStyle="solid"
            size={24}
            color={'#c6cad8'}
          />
        </TouchableOpacity>
      {/*</View>*/}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#252525',
    width: '100%',
    alignItems: 'center',
  },
  footerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ee3a28',
    borderRadius: 50,
    width: 60,
    height: 60,
    top: -30,
  },
});

export default TabBar;
