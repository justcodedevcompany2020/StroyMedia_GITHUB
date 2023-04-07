import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MyButton from "./MyButton";
import { COLOR_1, COLOR_5 } from "../helpers/Variables";
import MyInput from "./MyInput";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchMembersRequest } from "../../store/reducers/searchChatMembersSlice";
import { AntDesign } from "@expo/vector-icons";

function SearchModal(props) {
  const {
    onCancel,
    isVisible,
    value,
    name,
    onChangeText,
    onChangeName,
    id,
    onClick,
  } = props;
  const [token, setToken] = useState();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [valueError, setValueError] = useState("");
  const [fio, setFio] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });
  });

  const submith = () => {
    if (!value) {
      setValueError("Заполните эту строку");
      // if (!value) {
      //   setValueError("Заполните эту строку");
      //   return;
      // }
      return;
    }
    if (!fio) {
      setFio("Заполните эту строку");
      return;
    }
    if (value && fio) {
      dispatch(
        searchMembersRequest({
          secret_token: token,
          company_name: value,
          contact_person: name,
        })
      );
    }
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
          <Text style={styles.title}>Новый диалог</Text>
          <TouchableOpacity style={styles.cancel} onPress={onCancel}>
            <AntDesign name="close" size={26} color="red" />
          </TouchableOpacity>
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>
            Введите название компании или имя пользователя, чтобы найти
            собеседника и начать диалог
          </Text>
        </View>
        <Text style={styles.commentText}>Название компании</Text>
        <MyInput
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={"none"}
          multiline
          error={[valueError]}
          style={{
            height: undefined,
            lineHeight: 16,
            color: "black",
            fontFamily: "GothamProMedium",
          }}
        />

        <Text style={styles.commentText}>Ф.И.О. пользователя</Text>
        <MyInput
          value={name}
          onChangeText={onChangeName}
          autoCapitalize={"none"}
          multiline
          error={[fio]}
          style={{
            height: undefined,
            lineHeight: 16,
            color: "black",
            fontFamily: "GothamProMedium",
          }}
        />
        <MyButton
          onPress={() => {
            return submith();
          }}
          style={styles.button}
        >
          Найти
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
    marginBottom: 32,
  },
  button: {
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    fontSize: 12,
    alignItems: "center",
    alignSelf: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    marginBottom: -15,
    color: COLOR_1,
    marginLeft: 10,
    fontFamily: "GothamProMedium",
    fontSize: 14,
    fontWeight: "900",
  },
  ratingText: {
    color: "#666666",
    marginBottom: 20,
    fontFamily: "GothamProRegular",
    marginRight: 20,
    fontSize: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancel: {
    color: "red",
    fontSize: 24,
    marginTop: -10,
  },
  error: {
    textAlign: "center",
    color: "red",
  },
});

export default SearchModal;
