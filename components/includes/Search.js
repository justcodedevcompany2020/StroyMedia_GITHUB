import React from "react";
import { StyleSheet, View } from "react-native";
import { COLOR_6 } from "../helpers/Variables";
import MyInput from "./MyInput";

export const Search = ({
  style,
  onSearchText,
  resetText,
  value,
  keyboardType,
}) => {
  return (
    <View style={[styles.wrapper, style]}>
      <MyInput
        value={value}
        onChangeText={onSearchText}
        style={styles.input}
        // filtered={value ? true : false}
        resetText={resetText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  input: {
    backgroundColor: COLOR_6,
    paddingLeft: 10,
  },
  search: {
    position: "absolute",
    left: 14,
    top: 36,
  },
});
