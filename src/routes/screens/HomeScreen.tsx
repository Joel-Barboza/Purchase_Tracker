import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { HomeBottomTabsParamList } from '../../utils/types.ts';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = BottomTabScreenProps<HomeBottomTabsParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.main}>
        <Text style={styles.text}>Home screen</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#070709',
    height: '93%', // excluding the footer
  },
  main: {
    top: 30,
    width: '100%',
  },
  footer: {
    position: 'absolute',
    backgroundColor: '#cacaca',
    width: '100%',
    height: '20%',
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  footerBtn: {
    backgroundColor: '#531289',
    borderRadius: 8,
    padding: 15,
  },
  text: {
    fontSize: 18,
    color: '#fff',
  }
});

export default HomeScreen;
