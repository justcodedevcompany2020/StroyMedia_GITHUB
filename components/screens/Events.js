import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import Wrapper from "../helpers/Wrapper";
import { useSelector } from "react-redux";
import NavBar from "../includes/NavBar";
import {
  COLOR_1,
  COLOR_6,
  COLOR_8,
  COLOR_9,
  WRAPPER_PADDINGS,
} from "../helpers/Variables";
import {
  ImageBiggerPlaceholder,
  ImageCalendar,
  ImageNextArrow,
} from "../helpers/images";

import AccordionItem from "../includes/AccordionItem";
import { useDispatch } from "react-redux";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getEventsRequest } from "../../store/reducers/getEventsAllSlice";
import EventsItem from "../includes/eventsItem";
import RenderHtml from "react-native-render-html";
import { checkChatExistRequest } from "../../store/reducers/checkChatExistSlice";

function Events(props) {
  const [tabs, setTabs] = useState(["1 день", "2 день"]);
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("1 день");
  const { route, navigation } = props;
  const { currentPage } = route.params;
  const [token, setToken] = useState();
  const session = useSelector((state) => state.getEventsSlice.data.schedule);
  const data = useSelector((state) => state.getEventsSlice.data.rows);
  const dispatch = useDispatch();
  const regex = /(<([^>]+)>)/gi;
  const simvolRegexp = /&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6})/;
  const spacesRegex = /&(nbsp|amp|quot|lt|gt);/g;

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
        dispatch(getEventsRequest({ token: result, events_id: 1 }));
        dispatch(getEventsRequest({ token: result, events_id: "index" }));
      }
    });
    dispatch(getEventsRequest({ token, events_id: 1 }));
    dispatch(getEventsRequest({ token, events_id: "index" }));
  }, [dispatch]);

  const titleComponent = (startTime, endTime, listTitleText) => {
    return (
      <View style={styles.listTitleBlock}>
        <View style={styles.time}>
          <Text style={styles.startTime}>{startTime}</Text>
          <Text style={styles.endTime}>{endTime}</Text>
        </View>
        <Text style={styles.listTitleText}>{listTitleText}</Text>
      </View>
    );
  };

  return (
    <Wrapper
      withContainer
      header={{
        currentPage,
        home: true,
        navigation,
      }}
    >
      <NavBar
        onPress={(tab) => setActiveTab(tab)}
        tabs={tabs}
        activeTab={activeTab}
      />
      <View style={styles.wrapper}>
        {data?.map((d) => {
          const date = d?.date && d.date.$date.$numberLong;
          return (
            <View key={d.last_id}>
              <Text style={styles.title}>{d.title}</Text>
              <View style={styles.info}>
                <View style={styles.date}>
                  <ImageCalendar />
                  <Text style={styles.dateText}>
                    {moment(+date).format("YYYY-MM-DD")}
                  </Text>
                </View>
                <TouchableOpacity style={styles.location}>
                  <ImageBiggerPlaceholder />
                  <Text style={styles.locationText}>{d.place}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.header}>Программа мероприятия</Text>
            </View>
          );
        })}
        {session?.map((s) => {
          return s.day === "1" && activeTab === "1 день" ? (
            <AccordionItem
              key={s.last_id}
              arrowStyle={styles.arrowStyle}
              titleComponent={titleComponent(`${s.time}`, `${s.title}`)}
            >
              <View style={styles.item}>
                <EventsItem
                  navigation={navigation}
                  title={s.moderator_post || s.event.title}
                  text={
                    Platform.OS === "android"
                      ? s?.full
                          ?.replace(regex, "")
                          .replace(simvolRegexp, "")
                          .replace(spacesRegex, "")
                          .trim() ||
                        s?.event?.full
                          ?.replace(regex, "")
                          .replace(spacesRegex, "")
                          .replace(simvolRegexp, " ")
                          .trim()
                      : (
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: s.full }}
                          />
                        ) || (
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: s.event.full }}
                          />
                        )
                  }
                  personName={s.moderator}
                  token={token}
                  id={s.last_id}
                  photoUri={
                    s.moderator_avatar ? s.moderator_avatar : s.event.img
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      checkChatExistRequest({ token: token, id: s.last_id })
                    )
                      .unwrap()
                      .then(() => {
                        navigation.navigate("Chat", {
                          currentPage: "Чаты",
                          title: s.event.title,
                          id: s.last_id,
                        });
                      });
                  }}
                  style={styles.nextArrow}
                >
                  <ImageNextArrow />
                </TouchableOpacity>
              </View>
            </AccordionItem>
          ) : null;
        })}
        {session?.map((s) => {
          return s.day === "2" && activeTab === "2 день" ? (
            <AccordionItem
              key={s.last_id}
              arrowStyle={styles.arrowStyle}
              titleComponent={titleComponent(`${s.time}`, `${s.title}`)}
            >
              <View style={styles.item}>
                <EventsItem
                  navigation={navigation}
                  title={s.moderator_post || s.event.title}
                  text={
                    Platform.OS === "android"
                      ? s?.full
                          ?.replace(regex, "")
                          .replace(spacesRegex, "")
                          .replace(simvolRegexp, " ")
                          .trim() ||
                        s?.event?.full
                          ?.replace(regex, "")
                          .replace(spacesRegex, "")
                          .replace(simvolRegexp, " ")
                          .trim()
                      : (
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: s.full }}
                          />
                        ) || (
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: s.event.full }}
                          />
                        )
                  }
                  personName={s.moderator}
                  token={token}
                  id={s.last_id}
                  photoUri={
                    s.moderator_avatar ? s.moderator_avatar : s.event.img
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      checkChatExistRequest({ token: token, id: s.last_id })
                    )
                      .unwrap()
                      .then(() => {
                        navigation.navigate("Chat", {
                          currentPage: "Чаты",
                          title: s.event.title,
                          id: s.last_id,
                        });
                      });
                  }}
                  style={styles.nextArrow}
                >
                  <ImageNextArrow />
                </TouchableOpacity>
              </View>
            </AccordionItem>
          ) : null;
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
    fontFamily: "GothamProMedium",
    fontSize: 12,
    color: COLOR_8,
    marginBottom: 20,
    marginTop: 30,
  },
  info: {
    paddingLeft: 20,
    marginBottom: 30,
  },
  date: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dateText: {
    fontFamily: "GothamProMedium",
    fontSize: 12,
    color: COLOR_1,
    marginLeft: 10,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingLeft: 2,
  },
  locationText: {
    fontFamily: "GothamProRegular",
    fontSize: 10,
    color: COLOR_1,
    marginLeft: 13,
    textDecorationLine: "underline",
  },
  header: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    marginBottom: 20,
    color: COLOR_1,
  },
  listTitleBlock: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  time: {
    marginRight: 20,
  },
  startTime: {
    fontFamily: "GothamProMedium",
    fontSize: 12,
    color: COLOR_1,
    marginBottom: 6,
  },
  endTime: {
    fontFamily: "GothamProRegular",
    fontSize: 12,
    color: COLOR_1,
    fontWeight: "400",
  },
  listTitleText: {
    fontFamily: "GothamProMedium",
    fontSize: 12,
    color: COLOR_1,
  },
  item: {
    marginTop: -26,
    borderBottomColor: COLOR_6,
    borderBottomWidth: 1,
  },
  section: {
    marginBottom: 36,
  },
  sectionContent: {
    paddingLeft: 58,
  },
  sectionTitle: {
    fontFamily: "GothamProRegular",
    fontSize: 12,
    color: COLOR_1,
    marginBottom: 14,
  },
  sectionText: {
    fontFamily: "GothamProRegular",
    fontSize: 9,
    color: COLOR_9,
    marginBottom: 14,
    lineHeight: 11,
  },
  personBlock: {
    marginBottom: 34,
  },
  personName: {
    fontFamily: "GothamProRegular",
    fontSize: 10,
    color: COLOR_1,
  },
  personPosition: {
    fontFamily: "GothamProRegular",
    fontSize: 10,
    color: COLOR_9,
  },
  personPhoto: {
    width: 44,
    height: 44,
    borderRadius: 30,
    position: "absolute",
    left: -60,
    top: -8,
  },
  buttonRow: {},
  sectionButton: {
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 12,
  },
  like: {
    position: "absolute",
    right: 40,
    top: 6,
  },
  arrowStyle: {
    top: 14,
  },
  nextArrow: {
    position: "absolute",
    right: 0,
    bottom: 44,
  },
});

export default Events;
