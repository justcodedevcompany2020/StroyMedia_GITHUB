import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import Wrapper from "../helpers/Wrapper";
import { useSelector, useDispatch } from "react-redux";
import SingleParticipantBlock from "../includes/SingleParticipantBlock";
import {
  ImageCallGreen,
  ImageEmailGreen,
  ImageMapPlaceholder,
  ImageMouseCursor,
  ImageOkSmall,
  ImageRating,
} from "../helpers/images";
import { COLOR_1, COLOR_6, WRAPPER_PADDINGS } from "../helpers/Variables";
import MyButton from "../includes/MyButton";
import ReviewItem from "../includes/ReviewItem";
import LeaveReviewModal from "../includes/LeaveReviewModal";
import { showMessage } from "react-native-flash-message";
import MoreReviewsModal from "../includes/MoreReviewsModal";
import { getProjectReviewsRequest } from "../../store/reducers/getAllProjectReviews";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { chatOrderRequest } from "../../store/reducers/chatDialogOrderSlice";

function SingleParticipant(props) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showMoreReviewsModal, setShowMoreReviewsModal] = useState(false);
  const [toOrFrom, setToOrFrom] = useState("");
  const totalRate = [];
  const [reviewText, setReviewText] = useState("");
  const { route, navigation } = props;
  const { currentPage } = route.params;
  const [rate, setRate] = useState(0);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.membersSingleSlice.data);
  const reviews = useSelector((state) => state.getAllProjectReviews.data.rows);
  const [role, setRole] = useState("");
  const contacts = useSelector(
    (state) => state.getAllProjectReviews.data.contacts
  );
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
    dispatch(getProjectReviewsRequest({ token, id: route?.params.id }));
  }, [data]);
  const leaveReview = () => {
    setShowReviewModal(true);
  };

  const reviewSubmit = () => {
    showMessage({
      message: "Ваш отзыв успешно сохранён",
      type: "success",
    });
    setShowReviewModal(false);
    setReviewText("");
  };

  const moreReviews = (toOrFrom) => {
    setShowMoreReviewsModal(true);
    setToOrFrom(toOrFrom);
  };
  reviews &&
    reviews?.map((item) => {
      totalRate.push(item.user.rate_plus);
    });

  let totalRateing =
    reviews && totalRate.length > 0
      ? totalRate.reduce((num, acc) => {
          return (num + acc) / totalRate?.length;
        })
      : null;

  const renderItem = ({ item }) => {
    const date = item.date.$date.$numberLomg;
    return (
      <ReviewItem
        toOrFrom={"на"}
        review={{
          uri: "https://teus.online" + item.user.avatar,
          name: item.user.name,
          date: moment(date).format("DD.MM.YYYY"),
          id: 3,
          text: item.review,
          rating: item.user.rate_plus,
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
            <ImageOkSmall />
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
          <View style={styles.contactLine}>
            <ImageMapPlaceholder />
            <Text style={styles.contactInfo}>{data?.factadress}</Text>
          </View>
          <View style={styles.contactLine}>
            <ImageMouseCursor />
            <Text style={styles.contactInfo}>{data?.site}</Text>
          </View>
        </SingleParticipantBlock>
        <Text style={styles.header}>Контакты</Text>
        <FlatList
          data={contacts}
          renderItem={({ item }, index) => {
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
                        id: item.company.last_id,
                      })
                    )
                      .unwrap()
                      .then(() => {
                        navigation.navigate("Chat", {
                          title: item?.contact_person,
                          id: item?.company?.last_id,
                          currentPage: 'Диалоги',
                        });
                      });
                  },
                }}
                style={styles.contactsBlock}
              >
                <Text style={styles.name}>{item?.contact_person}</Text>
                <Text style={styles.location}>
                  {item.company.city.title.ru}
                </Text>
                <View style={styles.contacts}>
                  <Text style={styles.contactsText}>{item.phone}</Text>
                  <ImageCallGreen />
                </View>
                <View style={styles.contacts}>
                  <Text style={styles.contactsText}>{item.email}</Text>
                  <ImageEmailGreen />
                </View>
              </SingleParticipantBlock>
            );
          }}
        />
        <View style={styles.reviewBlock}>
          <Text style={styles.header}>Отзывы на участника</Text>
          <View style={styles.reviewLine}>
            <ImageRating />
            <View style={styles.reviewDescription}>
              <Text style={styles.averageReview}>
                {Math.ceil(totalRateing)}
              </Text>
              <Text style={styles.reviewInfo}>(основан на 339 отзывах)</Text>
            </View>
          </View>
          <FlatList data={reviews?.slice(0, 2)} renderItem={renderItem} />
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
      <LeaveReviewModal
        value={reviewText}
        onChangeText={(val) => setReviewText(val)}
        isVisible={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        onSubmit={reviewSubmit}
        id={route?.params?.id}
        setRate={setRate}
        rate={rate}
      />
      <MoreReviewsModal
        isVisible={showMoreReviewsModal}
        onCancel={() => setShowMoreReviewsModal(false)}
        toOrFrom={toOrFrom}
        data={reviews}
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
