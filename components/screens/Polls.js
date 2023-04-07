import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Wrapper from "../helpers/Wrapper";
import { useDispatch } from "react-redux";
import { COLOR_1, COLOR_6, WRAPPER_PADDINGS } from "../helpers/Variables";
import AccordionItem from "../includes/AccordionItem";
import PollsItem from "../includes/PollsItem";
import { useSelector } from "react-redux";
import { getAllPollsRequest } from "../../store/reducers/getAllPolsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Polls({ route, navigation }) {
  const { data } = useSelector((state) => state.getAllPolsSlice);

  const { currentPage } = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        dispatch(getAllPollsRequest({ token: result }));
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
      <View style={styles.wrapper}>
        <Text style={styles.title}>Уважаемый пользователь!</Text>
        {data.map((d) => {
          const vote1 = d?.vote1?.length || 0;
          const vote2 = d?.vote2?.length || 0;
          const vote3 = d?.vote3?.length || 0;
          const vote4 = d?.vote4?.lengthZ || 0;
          const totalVote = vote1 + vote2 + vote3 + vote4;
          const options = [
            {
              id: 1,
              key: d?.title1,
              value: "1",
              vote: Math.round((vote1 / totalVote) * 100),
            },
            {
              id: 2,
              key: d?.title2,
              value: "2",
              vote: Math.round((vote2 / totalVote) * 100),
            },
            {
              id: 3,
              key: d?.title3,
              value: "3",
              vote: Math.round((vote3 / totalVote) * 100),
            },
            {
              id: 4,
              key: d?.title4,
              value: "4",
              vote: Math.round((vote4 / totalVote) * 100),
            },
          ];

          return (
            <AccordionItem
              key={new Date() + Math.random()}
              headerStyle={styles.headerStyle}
              arrowStyle={styles.arrowStyle}
              titleComponent={<Text style={styles.header}>{d.title}</Text>}
            >
              <View style={styles.itemWrapper}>
                <PollsItem
                  vote1={vote1}
                  vote2={vote2}
                  vote3={vote3}
                  vote4={vote4}
                  total={totalVote}
                  id={d.last_id}
                  optionsList={options}
                />
              </View>
            </AccordionItem>
          );
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
