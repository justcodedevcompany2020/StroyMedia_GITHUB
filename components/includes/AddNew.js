import React, {Component} from "react";
import {ImageAddNew} from "../helpers/images";
import {Dimensions, StyleSheet, TouchableOpacity} from "react-native";

class AddNew extends Component {
  render() {
    const {
      onPress,
      end
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.wrapper,
          {alignSelf: end ? "flex-end" : "center"},
          {right: end && 15},
        ]}
        activeOpacity={0.6}
      >
        <ImageAddNew/>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: Dimensions.get('window').height / 12,
  },
});

export default AddNew;
