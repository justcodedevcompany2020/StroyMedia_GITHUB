import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Wrapper from "../helpers/Wrapper";
import { useDispatch } from "react-redux";
import {
  COLOR_1,
  COLOR_5,
  COLOR_6,
  WRAPPER_PADDINGS,
} from "../helpers/Variables";
import AccordionItem from "../includes/AccordionItem";
import PollsItem from "../includes/PollsItem";
import { useSelector } from "react-redux";
import { getAllPollsRequest } from "../../store/reducers/getAllPolsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal } from "react-native";
import { ActivityIndicator } from "react-native";

function Polls({ route, navigation }) {
  const { loading } = useSelector((state) => state.getAllPolsSlice);
  const [data, setData] = useState([]);
  console.log(data);
  let filteredData = [];
  const { currentPage } = route.params;
  const dispatch = useDispatch();

  const [sending, setSending] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        dispatch(getAllPollsRequest({ token: result })).then((res) => {
          console.log(res.payload.data?.data.rows);
          setData(res.payload.data?.data.rows);
        });
      }
    });
  }, []);

  return (
    <Wrapper
      withContainer
      header={{
        currentPage,
        home: true,
        navigation,
      }}
    >
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
      
      <View style={styles.wrapper}>
        <Text style={styles.title}>Уважаемый пользователь!</Text>

        {data?.map((item) => {
          let data = [];
          let title = "";
          let last_id = "";
          let vote = [];
          let total = 0;
          Object.keys(item)?.map((value, index) => {
            if (value === "last_id") {
              last_id = item[value];
            }
            if (value === "title") {
              title = item[value];
            } else if (
              value !== "title" &&
              value.includes("title") &&
              item[value].trim().length > 0
            ) {
              data.push(item[value]);
            } else if (
              value !== "vote" &&
              value.includes("vote") &&
              value.length < 15
            ) {
              if (item[value][0] !== null) {
                vote.push(item[value]);
              }

              total += +item[value];
            }
          });
          filteredData.push({
            title: title,
            value: data,
            last_id: last_id,
            total: total,
            vote: vote,
          });
        })}

        {filteredData.map((d, i) => {
          let sended = false;

          if (d.value) {
            return (
              <AccordionItem
                key={new Date() + Math.random()}
                headerStyle={styles.headerStyle}
                arrowStyle={styles.arrowStyle}
                titleComponent={<Text style={styles.header}>{d.title}</Text>}
              >
                <View style={styles.itemWrapper}>
                  <PollsItem
                    total={d.total}
                    vote={d.vote}
                    id={d.last_id}
                    optionsList={d.value}
                  />
                </View>
              </AccordionItem>
            );
          }
        })}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: WRAPPER_PADDINGS,
  },
  title: {
    color: COLOR_1,
    fontFamily: "GothamProMedium",
    fontSize: 14,
    marginBottom: 26,
    marginTop: 30,
  },
  description: {
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    fontSize: 12,
    marginBottom: 20,
    lineHeight: 14,
  },
  header: {
    fontSize: 12,
    fontFamily: "GothamProMedium",
    color: COLOR_1,
    width: "90%",
  },
  headerStyle: {
    paddingVertical: 18,
  },
  arrowStyle: {
    top: 20,
  },
  itemWrapper: {
    borderBottomColor: COLOR_6,
    borderBottomWidth: 1,
    paddingLeft: 20,
    width: "80%",
  },
});

export default Polls;
