import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { COLOR_2, COLOR_5 } from "../helpers/Variables";

class RegistrationModal extends React.Component {
  render() {
    const { setShowModal, showModal } = this.props;
    return (
      <Modal
        isVisible={showModal}
        transparent={true}
        animationIn={"fadeInUp"}
        animationOut={"fadeOutDown"}
        onRequestClose={() => setShowModal(false)}
        hardwareAccelerated={true}
        style={styles.modal}
        onBackdropPress={() => setShowModal(false)}
        backdropOpacity={0}
        animationInTiming={100}
        animationOutTiming={100}
      >
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalWrapper}>
            {Dimensions.get("window").height > 800 && (
              <View style={styles.triangle}></View>
            )}
            <Text style={styles.modalText}>
              Для регистрации в Системе и получения доступа к мобильному
              приложению просим обратиться к Организатору:
            </Text>
            <Text style={styles.modalTextBold}>
              support@teus.online | 8-904-895-77-75
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
  },
  modalWrapper: {
    backgroundColor: COLOR_2,
    width: "76%",
    position: "absolute",
    top:
      Dimensions.get("window").height > 800
        ? (Dimensions.get("window").height * 65) / 100
        : undefined,
    bottom: Dimensions.get("window").height < 800 ? 0 : undefined,
    paddingHorizontal: 20,
    paddingVertical: (Dimensions.get("window").height * 3) / 100,
    borderRadius: 10,
  },
  modalText: {
    fontFamily: "GothamProRegular",
    fontSize: 10,
    color: COLOR_5,
    lineHeight: 16,
    marginBottom: 20,
  },
  triangle: {
    width: 10,
    height: 10,
    position: "absolute",
    top: -10,
    alignSelf: "center",
    borderLeftWidth: 10,
    borderLeftColor: "transparent",
    borderRightWidth: 10,
    borderRightColor: "transparent",
    borderBottomWidth: 10,
    borderBottomColor: COLOR_2,
  },
  modalTextBold: {
    fontFamily: "GothamProMedium",
    fontSize: 10,
    color: COLOR_5,
    lineHeight: 16,
  },
});

export default RegistrationModal;
