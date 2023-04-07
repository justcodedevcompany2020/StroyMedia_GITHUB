import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MyButton from "./MyButton";
import { COLOR_1, COLOR_5 } from "../helpers/Variables";
import MyInput from "./MyInput";
import { AntDesign } from "@expo/vector-icons";

class ForgotPasswordModal extends Component {
  render() {
    const { onSubmit, onCancel, isVisible, value, onChangeText, error } =
      this.props;
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
          <Text style={styles.title}>
            Для восстановления пароля укажите свою эл.почту
          </Text>
          <MyInput
            value={value}
            onChangeText={onChangeText}
            keyboardType={"email-address"}
            autoCapitalize={"none"}
          />
          <Text style={styles.erorMessage}>{error}</Text>
          <MyButton onPress={onSubmit} style={styles.button}>
            Отправить
          </MyButton>
          <TouchableOpacity style={styles.cancel} onPress={onCancel}>
            <AntDesign name="close" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    backgroundColor: COLOR_5,
    width: "76%",
    position: "absolute",
    paddingHorizontal: 30,
    paddingVertical: 25,
    borderRadius: 10,
  },
  title: {
    color: COLOR_1,
    fontFamily: "GothamProMedium",
    fontSize: 12,
    lineHeight: 14,
  },
  button: {
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    fontSize: 12,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  cancel: {
    position: "absolute",
    right: 8,
    top: 6,
  },
  erorMessage: {
    color: "red",
    fontFamily: "GothamProMedium",
    fontSize: 12,
    lineHeight: 14,
    textAlign: "center",
  },
});

export default ForgotPasswordModal;
