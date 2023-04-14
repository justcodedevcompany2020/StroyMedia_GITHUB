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
          const vote4 = d?.vote4?.length || 0;
          const vote5 = d?.vote5?.length || 0;
          const vote6 = d?.vote6?.length || 0;
          const vote7 = d?.vote7?.length || 0;
          const vote8 = d?.vote8?.length || 0;
          const vote9 = d?.vote9?.length || 0;
          const vote10 = d?.vote10?.length || 0;
          const vote11 = d?.vote11?.length || 0;
          const vote12 = d?.vote12?.length || 0;
          const vote13 = d?.vote13?.length || 0;
          const vote14 = d?.vote14?.length || 0;
          const vote15 = d?.vote15?.length || 0;
          const totalVote =
            vote1 +
            vote2 +
            vote3 +
            vote4 +
            vote5 +
            vote6 +
            vote7 +
            vote8 +
            vote9 +
            vote10 +
            vote11 +
            vote12 +
            vote13 +
            vote14 +
            vote15;
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
            {
              id: 5,
              key: d?.title5,
              value: "6",
              vote: Math.round((vote5 / totalVote) * 100),
            },

            {
              id: 6,
              key: d?.title6,
              value: "6",
              vote: Math.round((vote6 / totalVote) * 100),
            },
            {
              id: 7,
              key: d?.title7,
              value: "7",
              vote: Math.round((vote7 / totalVote) * 100),
            },
            {
              id: 8,
              key: d?.title8,
              value: "8",
              vote: Math.round((vote8 / totalVote) * 100),
            },
            {
              id: 9,
              key: d?.title9,
              value: "9",
              vote: Math.round((vote9 / totalVote) * 100),
            },
            {
              id: 10,
              key: d?.title10,
              value: "10",
              vote: Math.round((vote10 / totalVote) * 100),
            },
            {
              id: 11,
              key: d?.title11,
              value: "11",
              vote: Math.round((vote11 / totalVote) * 100),
            },
            {
              id: 12,
              key: d?.title12,
              value: "12",
              vote: Math.round((vote12 / totalVote) * 100),
            },
            {
              id: 13,
              key: d?.title13,
              value: "13",
              vote: Math.round((vote13 / totalVote) * 100),
            },
            {
              id: 14,
              key: d?.title14,
              value: "14",
              vote: Math.round((vote14 / totalVote) * 100),
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
                  // vote1={vote1}
                  // vote2={vote2}
                  // vote3={vote3}
                  // vote4={vote4}
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
