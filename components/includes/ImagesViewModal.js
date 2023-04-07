import React from "react";
import Modal from "react-native-modal";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLOR_1, COLOR_5 } from "../helpers/Variables";
import { AntDesign } from "@expo/vector-icons";


function ImagesViewhModal(props) {
  const { onCancel, isVisible, fileName, local } = props;
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
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onCancel}>
          <AntDesign name="close" size={20} color="red" />
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: local ? fileName : "https://teus.online" + fileName }}
          style={{
            width: "100%",
            height: 200,
          }}
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
    width: "94%",
    position: "absolute",
    paddingHorizontal: 30,
    paddingVertical: 25,
    borderRadius: 10,
  },
  title: {
    color: COLOR_1,
    fontFamily: "GothamProMedium",
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "900",
  },
  button: {
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    fontSize: 12,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    marginBottom: -15,
    marginTop: 20,
    color: COLOR_1,
    marginLeft: 10,
    fontFamily: "GothamProRegular",
    fontSize: 14,
    fontWeight: "900",
  },
  ratingText: {
    color: "black",
    marginTop: 20,
    fontFamily: "GothamProRegular",
    marginRight: 20,
    fontSize: 13,
  },
  modalHeader: {
    position: "absolute",
    right: 6,
    top: 6,
  }
});

export default ImagesViewhModal;
