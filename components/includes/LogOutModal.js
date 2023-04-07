import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, Text, StyleSheet } from "react-native";
import MyButton from "./MyButton";
import { COLOR_1, COLOR_5 } from "../helpers/Variables";

class LogOutModal extends Component {
  render() {
    const { onSubmit, onCancel, isVisible, deleted } = this.props;
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
          {!deleted ? (
            <Text style={styles.title}>
              Вы уверены, что хотите выйти из Приложения?
            </Text>
          ) : (
            <Text style={styles.title}>
              Вы уверены, что хотите удалить свой аккаунт ?
            </Text>
          )}
          <View style={styles.buttonRow}>
            <MyButton onPress={onSubmit} style={styles.button}>
              Да
            </MyButton>
            <MyButton onPress={onCancel} style={styles.button}>
              Нет
            </MyButton>
          </View>
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
    width: "80%",
    position: "absolute",
    paddingHorizontal: 30,
    paddingVertical: 25,
    borderRadius: 10,
  },
  title: {
    color: COLOR_1,
    fontFamily: "GothamProMedium",
    fontSize: 12,
    marginBottom: 20,
    lineHeight: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    fontSize: 12,
    width: "40%",
    alignItems: "center",
  },
});

export default LogOutModal;
