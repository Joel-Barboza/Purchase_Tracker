import React, { useEffect, useState } from "react";
import {
  createStaticNavigation,
  NavigationContainer,
} from '@react-navigation/native';
import { View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { Icon } from "react-native-vector-icons/Icon";

const icons = {
  Home: "house",
  Purchases: "money-bill"
}

const TabBar = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.footer}>
      <View style={styles.cont1}>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => navigation.navigate("CameraScreen")}
        >
          <FontAwesome6
            name={"plus" || "circle"}
            iconStyle="solid"
            size={24}
            color={"#999dac"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.cont2}>
        {state.routes.map((route, index) => {
          // console.log(descriptors)
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            console.log(route.name);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <PlatformPressable
              href={buildHref(route.name, route.params)}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              key={route.key}
              style={
                index == 1
                  ? [styles.leftIcons, { flex: 1, alignItems: "center" }]
                  : index == 2
                    ? [styles.rightIcons, { flex: 1, alignItems: "center" }]
                    : { flex: 1, alignItems: "center" }
              }
            >
              <FontAwesome6
                name={icons[route.name] || "circle"}
                iconStyle="solid"
                size={24}
                color={isFocused ? colors.primary : "#999dac"}
              />
              <Text style={{ color: isFocused ? colors.primary : colors.text }}>
                {/* {label} */}
              </Text>
            </PlatformPressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    backgroundColor: "lightblue",
    width: "100%",
  },
  footer: {
    position: "absolute",
    backgroundColor: "#120f10",
    width: "100%",
    height: "7%",
    bottom: 0,
    flex: 1,
    // flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
    marginRight: 35
  },
  rightIcons: {
    // backgroundColor: '#22ffdaff',
    borderRadius: 8,
    marginLeft: 35
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
  }
});

export default TabBar;
