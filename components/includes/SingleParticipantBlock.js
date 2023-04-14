import React from "react";
import { StyleSheet, View, Image } from "react-native";
import MyButton from "./MyButton";

export default SingleParticipantBlock = ({ uri, children, button, style }) => {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.row}>
        <View style={styles.imageBlock}>
          <Image source={{ uri }} style={styles.image} />
        </View>
        <View style={styles.mainBlock}>{children}</View>
      </View>
      {button && (
        <MyButton onPress={button.onPress} style={styles.button}>
          {button.label}
        </MyButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
  },
  imageBlock: {},
  mainBlock: {
    width: "65%",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 26,
  },
  button: {
    alignSelf: "center",
    marginTop: 10,
  },
});

SingleParticipantBlock;
