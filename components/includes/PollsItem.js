import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { COLOR_1, COLOR_3, COLOR_5 } from "../helpers/Variables";
import { useDispatch } from "react-redux";
import MyCheckbox from "./MyCheckbox";
import MyButton from "./MyButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import { getAnswerRequest } from "../../store/reducers/sendAnswerPollsSlice";
import { checkUserPollRequest } from "../../store/reducers/checkUserPollSlice";

function PollsItem({ optionsList, id, total, vote }) {
  const [checkedList, setCheckedList] = useState("");
  const [token, setToken] = useState("");
  const [submitted, setSubmitted] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });
    dispatch(checkUserPollRequest({ id }))
      .then(async (res) => {
        setSubmitted(res?.payload?.data?.data);
        setTimeout(() => {
          setLoading(false);
        }, 300);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [dispatch]);
  const checked = (item) => {
    setCheckedList(item);
  };

  const submit = () => {
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
      <Modal visible={loading} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000055",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={50} color={COLOR_5} />
        </View>
      </Modal>
      {optionsList?.map((option, index) => {
        if (option) {
          return (
            <View key={Math.random()}>
              <View style={styles.firstLine}>
                <Text style={styles.percentage}>
                  {Math.floor((vote[index] / total) * 100)
                    ? Math.floor((vote[index] / total) * 100)
                    : 0}
                  %
                </Text>
                <Text style={styles.title}>{option}</Text>
              </View>
              <View
                style={[
                  styles.line,
                  {
                    width: `${
                      Math.floor((vote[index] / total) * 100)
                        ? Math.floor((vote[index] / total) * 100)
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>
          );
        }
      })}
      <Text style={styles.smallText}>{vote.length} голоса</Text>
    </View>
  ) : (
    <View>
      {optionsList?.map((option, index) => {
        if (option) {
          return (
            <TouchableOpacity key={index} onPress={() => checked(option)}>
              <Text>
                <MyCheckbox
                  option={option}
                  id={option}
                  checkedList={checkedList}
                />
              </Text>
            </TouchableOpacity>
          );
        }
      })}
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
