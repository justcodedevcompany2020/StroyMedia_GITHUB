import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLOR_1, COLOR_2, COLOR_5 } from "../helpers/Variables";
import {
  ImageBid,
  ImageEvents,
  ImageMessages,
  ImageOffers,
  ImageParticipants,
  ImagePoll,
} from "../helpers/images";
import { useDispatch, useSelector } from "react-redux";
import { allCatRequest } from "../../store/reducers/allCatSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMembersReques } from "../../store/reducers/getMembersDataSlice";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const BORDER_RADIUS = 10;

const HomeMainButtons = () => {
  const [token, setToken] = useState();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.getAllSuggestionsSlice);
  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });
  }, []);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("Events", { currentPage: "Мероприятие" })
        }
        style={[styles.block, styles.borderTopLeft, styles.bgBlue]}
      >
        <ImageEvents style={styles.image} />
        <Text style={styles.text}>Мероприятие</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          dispatch(getMembersReques({ token }))
            .unwrap()
            .then(() => {
              navigation.navigate("Participants", { currentPage: "Участники" });
            });
        }}
        style={[styles.block, styles.bgGreen]}
      >
        <ImageParticipants style={styles.image} />
        <Text style={styles.text}>Участники</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("Messages", { currentPage: "Сообщения" })
        }
        style={[styles.block, styles.borderTopRight, styles.bgBlue]}
      >
        <ImageMessages style={styles.image} />
        <Text style={styles.text}>Чаты</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate("Offers", { currentPage: "Предложения" });
        }}
        style={[styles.block, styles.borderBottomLeft, styles.bgGreen]}
      >
        {!loading ? (
          <>
            <ImageOffers style={styles.image} />
            <Text style={styles.text}>Предложения</Text>
          </>
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <ActivityIndicator color={COLOR_1} size={"large"} />
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={async () => {
          navigation.navigate("MyApplications", {
            currentPage: "Мои заявки",
          });
          // dispatch(
          //   allCatRequest({
          //     token,
          //     tab: "В работе",
          //     // offset,
          //   })
          // )
          //   .unwrap()
          //   .then((res) => {
          //     console.log("📢[HomeMainButtons.js:108]: res: ", res);
          //   })
          //   .catch((err) => {
          //     console.log("📢[HomeMainButtons.js:113]: err: ", err);
          //   });
        }}
        style={[styles.block, styles.bgBlue]}
      >
        <ImageBid style={styles.image} />
        <Text style={styles.text}>Мои заявки</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Polls", { currentPage: "Опросы" })}
        style={[styles.block, styles.borderBottomRight, styles.bgGreen]}
      >
        <ImagePoll style={styles.image} />
        <Text style={styles.text}>Опросы</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 230,
    justifyContent: "space-between",
    flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "space-between",
  },
  block: {
    width: "32%",
    height: "48.5%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bgBlue: {
    backgroundColor: COLOR_1,
  },
  bgGreen: {
    backgroundColor: COLOR_2,
  },
  borderTopRight: {
    borderTopRightRadius: BORDER_RADIUS,
  },
  borderTopLeft: {
    borderTopLeftRadius: BORDER_RADIUS,
  },
  borderBottomRight: {
    borderBottomRightRadius: BORDER_RADIUS,
  },
  borderBottomLeft: {
    borderBottomLeftRadius: BORDER_RADIUS,
  },
  image: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
  text: {
    color: COLOR_5,
    marginBottom: 16,
    marginTop: 16,
    fontSize: 10,
    fontFamily: "GothamProRegular",
  },
});

export default HomeMainButtons;
