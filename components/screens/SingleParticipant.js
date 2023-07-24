import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import Wrapper from "../helpers/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import SingleParticipantBlock from "../includes/SingleParticipantBlock";
import {
  ImageCallGreen,
  ImageEmailGreen,
  ImageMapPlaceholder,
  ImageMouseCursor,
  ImageOkSmall,
  ImageRating,
} from "../helpers/images";
import {COLOR_1, COLOR_6, WRAPPER_PADDINGS} from "../helpers/Variables";
import MyButton from "../includes/MyButton";
import ReviewItem from "../includes/ReviewItem";
import LeaveReviewModal from "../includes/LeaveReviewModal";
import {showMessage} from "react-native-flash-message";
import MoreReviewsModal from "../includes/MoreReviewsModal";
import {getProjectReviewsRequest} from "../../store/reducers/getAllProjectReviews";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import {chatOrderRequest} from "../../store/reducers/chatDialogOrderSlice";
import {projectReviewRequest} from "../../store/reducers/projectReview";
import * as Linking from "expo-linking";
import _ from "lodash";
import {checkUserReviewRequest} from "../../store/reducers/checkUserReviewSlice";

function SingleParticipant({route, navigation}) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showMoreReviewsModal, setShowMoreReviewsModal] = useState(false);
  const [toOrFrom, setToOrFrom] = useState("");
  const totalRate = [];
  const [reviewText, setReviewText] = useState("");
  const {currentPage} = route.params;
  const [rate, setRate] = useState("");
  const dispatch = useDispatch();
  const data = useSelector((state) => state.membersSingleSlice.data);
  const [successReviewSend, setSuccessReviewSend] = useState(false)
  const {rows, contacts} = useSelector(
    (state) => state.getAllProjectReviews.data
  );
  // const rows = useSelector((state) => state.getAllProjectReviews.data.rows);
  // const contacts = useSelector(
  //   (state) => state.getAllProjectReviews.data.contacts
  // );
  const [role, setRole] = useState("");
  const [token, setToken] = useState();
  useEffect(() => {
    setRole({
      operatorkp: data?.isoperatorkp ? "Экспедитор/" : "",
      owner: data?.isowner ? "Собственник КТК/" : "",
      sealine: data?.issealine ? "Морская линия/" : "",
      ownercargo: data?.isownercargo ? "Грузовладелец/" : "",
      ownerpc: data?.isownerpc ? "Собственник ПС/" : "",
    });
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });
    dispatch(getProjectReviewsRequest({token, id: route?.params.id}));
    dispatch(checkUserReviewRequest({
      token,
      last_id: route?.params.id,
      user_id: contacts[0]?.company.last_id
    })).then(res => {
      if (res.payload.success) {
        setSuccessReviewSend(res.payload.data)
      }
    })
    console.log(route.params.id)
  }, [data]);

  const leaveReview = () => {
    setShowReviewModal(true);
  };
  const reviewSubmit = () => {
    let star = null
    if (rate === 2) {
      star = 5
    } else if (rate === 1) {
      star = 4
    } else if (rate === 0) {
      star = 3
    } else if (rate === -1) {
      star = 2
    } else if (rate === -2) {
      star = 1
    }

    if (star == 3) {
      star = 'netral'
    } else if (star > 3) {
      star = 'plus'
    } else if (star < 3) {
      star = 'minus'
    }
    // star == 3 ? alert() : star > 3 ? "plus" : "minus"
    reviewText && star
    ? dispatch(
      projectReviewRequest({
        token,
        id: route?.params?.id,
        rate: star,
        // rate: new_rate,
        review: reviewText,
      })
    )
      .unwrap()
      .then((res) => {
        showMessage({
          message: "Ваш отзыв успешно сохранён",
          type: "success",
        });
        dispatch(getProjectReviewsRequest({token, id: route?.params.id}));
        setShowReviewModal(false);
        setReviewText("");
        setRate("");
      })
    : star < 1
      ? showMessage({
        message: "Поставьте оценку",
        type: "danger",
      })
      : showMessage({
        message: "Заполните данные",
        type: "danger",
      });
  };

  const moreReviews = (toOrFrom) => {
    setShowMoreReviewsModal(true);
    setToOrFrom(toOrFrom);
  };
  rows &&
  rows?.map((item) => {
    if (item.ball === 2) {
      totalRate.push(5);
    }
    if (item.ball === 1) {
      totalRate.push(4);
    }
    if (item.ball === 0) {
      totalRate.push(3);
    }
    if (item.ball === -1) {
      totalRate.push(2);
    }
    if (item.ball === -2) {
      totalRate.push(1);
    }
  });

  let totalRateing =
    rows && totalRate.length > 0
    ? totalRate.reduce((num, acc) => {
      return (num + acc) / totalRate?.length;
    })
    : null;
  let total_rate = 0;
  let rate_check = rows?.rate_minus
                   ? rows?.rate_minus
                   : 0 + rows?.rate_plus
                     ? rows?.rate_plus
                     : 0 + rows?.rate_good
                       ? rows?.rate_good
                       : 0 + rows?.rate_netral
                         ? rows?.rate_netral
                         : 0 + rows?.rate_negativ
                           ? rows?.rate_negativ
                           : 0;

  if (
    !_.isEmpty(rows?.rate_minus) ||
    !_.isEmpty(rows?.rate_plus) ||
    !_.isEmpty(rows?.rate_good) ||
    !_.isEmpty(rows?.rate_netral) ||
    !_.isEmpty(rows?.rate_negativ)
  ) {
    total_rate = rows?.rate_minus
                 ? rows?.rate_minus * 2
                 : 0 + rows?.rate_plus
                   ? rows?.rate_plus * 5
                   : 0 + rows?.rate_good
                     ? rows?.rate_good * 4
                     : 0 + rows?.rate_netral
                       ? rows?.rate_netral * 3
                       : 0 + rows?.rate_negativ
                         ? rows?.rate_negativ * 1
                         : 0;
  }

  console.log(total_rate, 152);

  const renderItem = ({item}) => {
    const date = item.date.$date.$numberLomg;
    return (
      <ReviewItem
        toOrFrom={"на"}
        review={{
          uri:
            "https://teus.online" + item.from.avatar_person || item.from.avatar,
          name: item.user.name,
          date: moment(date).format("DD.MM.YYYY"),
          id: 3,
          text: item.review,
          rating: item.ball,
        }}
      />
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
      <View style={styles.wrapper}>
        <Text style={styles.header}>Основные данные</Text>
        <SingleParticipantBlock uri={`https://teus.online/${data?.avatar}`}>
          <View style={styles.coWorked}>
            <ImageOkSmall/>
            <Text style={styles.coWorkedText}>Сотрудничали</Text>
          </View>
          <Text style={styles.companyName}>{data?.name}</Text>
          <Text style={styles.additionalInfo}>{data?.uradress}</Text>
          <Text style={styles.additionalInfo}>
            ИНН {data?.inn} / ОГРН 0000000000001
          </Text>
          <Text style={styles.additionalInfo}>
            Вид налогообложения: {data?.nalog?.title}
          </Text>
          <Text style={styles.jobInfo}>
            {role["operatorkp"] +
              role["owner"] +
              role["sealine"] +
              role["ownercargo"] +
              role["ownerpc"]}
          </Text>
          {data?.factadress && (
            <View style={styles.contactLine}>
              <ImageMapPlaceholder/>
              <Text style={styles.contactInfo}>{data?.factadress}</Text>
            </View>
          )}
          {data?.site && (
            <View style={styles.contactLine}>
              <ImageMouseCursor/>
              <Text style={styles.contactInfo}>{data?.site}</Text>
            </View>
          )}
        </SingleParticipantBlock>
        <Text style={styles.header}>Контакты</Text>
        <FlatList
          data={contacts}
          renderItem={({item}, index) => {
            return (
              <SingleParticipantBlock
                key={index}
                uri={"https://teus.online" + item.avatar}
                button={{
                  label: "Написать",
                  onPress: () => {
                    dispatch(
                      chatOrderRequest({
                        token: token,
                        id: item?.company.last_id,
                      })
                    )
                      .unwrap()
                      .then(() => {
                        navigation.navigate("Chat", {
                          title: item?.contact_person,
                          id: item?.company?.last_id,
                          currentPage: "Диалоги",
                        });
                      });
                  },
                }}
                style={styles.contactsBlock}
              >
                <Text style={styles.name}>{item?.contact_person}</Text>
                <Text style={styles.location}>
                  {item?.company.city.title.ru}
                </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL("tel:" + item.phone)}
                  style={styles.contacts}
                >
                  <Text style={styles.contactsText}>{item.phone}</Text>
                  <ImageCallGreen/>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL("mailto:" + item.email)}
                  style={styles.contacts}
                >
                  <Text style={styles.contactsText}>{item.email}</Text>
                  <ImageEmailGreen/>
                </TouchableOpacity>
              </SingleParticipantBlock>
            );
          }}
        />
        <View style={styles.reviewBlock}>
          <Text style={styles.header}>Отзывы на участника</Text>
          <View style={styles.reviewLine}>
            <ImageRating/>
            <View style={styles.reviewDescription}>
              <Text style={styles.averageReview}>{Math.round(total_rate)}</Text>
              <Text style={styles.reviewInfo}>
                (основан на {rows?.length} отзывах)
              </Text>
            </View>
          </View>
          <FlatList data={rows?.slice(0, 2)} renderItem={renderItem}/>
          <View style={styles.buttonRow}>
            <MyButton
              textStyle={styles.buttonText}
              style={styles.button}
              onPress={leaveReview}
            >
              Оставить отзыв
            </MyButton>
            <MyButton
              textStyle={styles.buttonText}
              style={styles.button}
              onPress={() => moreReviews("from")}
            >
              Ещё отзывы
            </MyButton>
          </View>
        </View>
      </View>
      {successReviewSend && <LeaveReviewModal
        // value={reviewText}
        onChangeText={(val) => setReviewText(val)}
        isVisible={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        onSubmit={reviewSubmit}
        // id={route?.params?.id}
        setRate={setRate}
        rate={rate}
      />}
      <MoreReviewsModal
        isVisible={showMoreReviewsModal}
        onCancel={() => setShowMoreReviewsModal(false)}
        toOrFrom={toOrFrom}
        data={rows && rows}
      />
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: WRAPPER_PADDINGS,
  },
  contactsList: {
    height: 350,
    marginBottom: 30,
  },
  contactsBlock: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR_6,
    paddingBottom: 20,
  },
  block: {
    marginBottom: 50,
  },
  coWorked: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  coWorkedText: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    marginLeft: 12,
    color: COLOR_1,
  },
  header: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    marginBottom: 20,
    color: COLOR_1,
  },
  companyName: {
    fontFamily: "GothamProMedium",
    color: COLOR_1,
    fontSize: 14,
    marginBottom: 20,
  },
  additionalInfo: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    color: COLOR_1,
    marginBottom: 5,
  },
  jobInfo: {
    fontSize: 9,
    fontFamily: "GothamProMedium",
    color: COLOR_1,
    marginBottom: 20,
  },
  contactLine: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  contactInfo: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    color: COLOR_1,
    marginLeft: 10,
  },
  contacts: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "90%",
  },
  contactsText: {
    fontSize: 12,
    fontFamily: "GothamProMedium",
    color: COLOR_1,
  },
  name: {
    marginBottom: 4,
  },
  location: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    color: COLOR_1,
    marginBottom: 20,
  },
  reviewLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewDescription: {
    marginLeft: 14,
  },
  averageReview: {
    fontSize: 12,
    fontFamily: "GothamProMedium",
    color: COLOR_1,
    marginBottom: 2,
  },
  reviewInfo: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    color: COLOR_1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 12,
  },
  reviewBlock: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR_6,
    marginBottom: 20,
  },
});

export default SingleParticipant;
