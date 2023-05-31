import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, StyleSheet, Dimensions } from "react-native";
import { COLOR_5 } from "../helpers/Variables";
import QRCode from "react-native-qrcode-svg";

function QrModal({ onCancel, isVisible, value }) {
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      transparent={true}
      animationIn={"fadeInUp"}
      animationOut={"fadeOutDown"}
      onRequestClose={onCancel}
      hardwareAccelerated={true}
      onBackdropPress={onCancel}
      backdropOpacity={0.3}
      animationInTiming={100}
      animationOutTiming={100}
    >
      <View style={styles.wrapper}>
        <QRCode
          value={value}
          size={Dimensions.get("window").width - 100}
          enableLinearGradient
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    backgroundColor: COLOR_5,
    position: "absolute",
    paddingHorizontal: 30,
    paddingVertical: 25,
    borderRadius: 10,
  },
});

export default QrModal;
