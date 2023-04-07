import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLOR_1 } from "../helpers/Variables";

class Button extends React.Component {
  render() {
    const { style, textStyle, children, ...p } = this.props;
    return (
      <TouchableOpacity style={[styles.wrapper, style]} {...p}>
        <Text style={[styles.text, textStyle]}>{children}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: COLOR_1,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 14,
    color: COLOR_1,
    fontFamily: "GothamProRegular",
  },
});

export default Button;
