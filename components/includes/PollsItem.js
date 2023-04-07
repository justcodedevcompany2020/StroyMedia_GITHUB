import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { COLOR_1, COLOR_3 } from "../helpers/Variables";
import { useDispatch } from "react-redux";
import MyCheckbox from "./MyCheckbox";
import MyButton from "./MyButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import { getAnswerRequest } from "../../store/reducers/sendAnswerPollsSlice";

function PollsItem(props) {
  const [checkedList, setCheckedList] = useState("");
  const [token, setToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { optionsList, id, total } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });
  }, []);

  const checked = (item) => {
    console.log(item.id);
    setCheckedList(item?.id);
  };

  const submit = () => {
    console.log(checkedList, "lissssssssstttttttttttttttt");
    checkedList
      ? dispatch(
          getAnswerRequest({ token: token, id: id, answer: checkedList })
        )
          .unwrap()
          .then(setSubmitted(true))
          .catch(() =>
            showMessage({
              message: "Ваш ответ был отправлен",
              type: "info",
            })
          )
      : showMessage({
          message: "Выберите один из ответов",
          type: "danger",
        });
  };

  return submitted ? (
    <View>
      {optionsList.map((option) => {
        return (
          <View key={Math.random()}>
            <View style={styles.firstLine}>
              <Text style={styles.percentage}>{option.vote}%</Text>
              <Text style={styles.title}>{option.key}</Text>
            </View>
            <View style={[styles.line, { width: `${option.vote}%` }]} />
          </View>
        );
      })}
      <Text style={styles.smallText}>{total} голоса</Text>
    </View>
  ) : (
    <View>
      {optionsList.map((option) => (
        <TouchableOpacity key={option.id} onPress={() => checked(option)}>
          <Text>
            <MyCheckbox
              option={option}
              id={option.id}
              checkedList={checkedList}
              key={option.id}
            />
          </Text>
        </TouchableOpacity>
      ))}
      <MyButton onPress={submit} style={styles.button}>
        Отправить
      </MyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
    marginTop: 18,
    alignSelf: "center",
  },
  firstLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentage: {
    fontSize: 10,
    fontFamily: "GothamProMedium",
    width: 30,
    marginRight: 20,
    color: COLOR_1,
  },
  title: {
    fontSize: 10,
    fontFamily: "GothamProRegular",
    color: COLOR_1,
  },
  line: {
    height: 4,
    borderRadius: 4,
    backgroundColor: COLOR_3,
    marginTop: 8,
    marginBottom: 20,
  },
  smallText: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    color: COLOR_1,
    marginBottom: 20,
  },
});

export default PollsItem;
