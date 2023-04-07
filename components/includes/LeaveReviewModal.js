import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MyButton from "./MyButton";
import { COLOR_1, COLOR_5 } from "../helpers/Variables";
import MyInput from "./MyInput";
import { Rating } from "react-native-ratings";
import { useDispatch } from "react-redux";
import { projectReviewRequest } from "../../store/reducers/projectReview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

function LeaveReviewModal(props) {
  const { onSubmit, onCancel, isVisible, value, onChangeText } = props;
  const { id, setRate, rate } = props;
  const [token, setToken] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });
  });
  const ratingFinish = (rate) => {
    setRate(rate);
  };

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
          <Text style={styles.title}>Оставьте отзыв</Text>
          <TouchableOpacity style={styles.onCancel} onPress={onCancel}>
            <AntDesign name="close" size={26} color="red" />
          </TouchableOpacity>
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>Выберите оценку:</Text>
          <Rating
            type="custom"
            ratingColor="#3498db"
            ratingBackgroundColor="#ccc"
            ratingCount={5}
            imageSize={22}
            onFinishRating={ratingFinish}
            startingValue={0}
            style={{ marginTop: 20, opacity: 0.8 }}
            tintColor="#fff"
            jumpValue={10}
          />
        </View>
        <Text style={styles.commentText}>Комментарии</Text>
        <MyInput
          value={value}
          onChangeText={onChangeText}
          textarea={true}
          keyboardType={"email-address"}
          autoCapitalize={"none"}
          multiline
          maxHeight={400}
          style={{
            height: undefined,
            lineHeight: 20,
            color: COLOR_1,
            fontFamily: "GothamProMedium",
            justifyContent: "flex-start",
          }}
        />
        <MyButton
          onPress={() => {
            dispatch(
              projectReviewRequest({
                token,
                id,
                rate: rate === 3 ? "netral" : rate > 3 ? "plus" : "minus",
                review: value,
              })
            );
            return onSubmit();
          }}
          style={styles.button}
        >
          Отправить
        </MyButton>
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
    fontSize: 16,
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
    color: COLOR_1,
    marginTop: 20,
    fontFamily: "GothamProRegular",
    marginRight: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cancel: {
    color: "red",
    fontSize: 24,
    marginTop: -10,
  },
});

export default LeaveReviewModal;
