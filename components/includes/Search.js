import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { COLOR_6 } from "../helpers/Variables";
import MyInput from "./MyInput";
import { ImageSearch } from "../helpers/images";

function Search(props) {
  const { style, searchText, onSearchText, resetText, value, keyboardType } =
    props;
  return (
    <View style={[styles.wrapper, style]}>
      <MyInput
        value={searchText ? searchText : value}
        onChangeText={(value) => onSearchText(value)}
        style={styles.input}
        filtered={searchText ? true : false}
        resetText={resetText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

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

export default Search;
