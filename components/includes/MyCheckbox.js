import * as React from "react";
import { COLOR_1, COLOR_6 } from "../helpers/Variables";
import { StyleSheet, Text, View } from "react-native";
import { ImageOk } from "../helpers/images";

function MyCheckbox(props) {
  const { option, id, checkedList } = props;

  return (
    <View style={styles.checkRow}>
      <View style={styles.checkbox}>
        {checkedList === id && <ImageOk style={styles.image} />}
      </View>
      <Text style={styles.label}>{option.key}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checkRow: {
    flexDirection: "row",
    width: "100%",
    paddingTop: 8,
    alignItems: "center",
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 5,
    backgroundColor: COLOR_6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  label: {
    fontFamily: "GothamProMedium",
    fontSize: 10,
    color: COLOR_1,
    width: 200,
    flex: 1,
  },
});

export default MyCheckbox;
