import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Wrapper from "../helpers/Wrapper";
import {
  ImageCallGreen,
  ImageEmailGreen,
  ImageOffersArrow,
  ImageRatingSmall,
} from "../helpers/images";
import {
  COLOR_1,
  COLOR_2,
  COLOR_5,
  COLOR_6,
  COLOR_8,
  COLOR_9,
  COLOR_10,
  WRAPPER_PADDINGS,
} from "../helpers/Variables";
import SingleParticipantBlock from "../includes/SingleParticipantBlock";
import MyInput from "../includes/MyInput";
import MyButton from "../includes/MyButton";
import moment from "moment";
import { Entypo } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { workRequest } from "../../store/reducers/workRequestSlice";
import Modal from "react-native-modal";
import { showMessage } from "react-native-flash-message";
import { chatOrderRequest } from "../../store/reducers/chatDialogOrderSlice";
const valuta = ["₽", "€", "$"];

function SendOffer(props) {
  const [price, setPrice] = useState(null);
  const [periodOfUsing, setPeriodOfUsing] = useState();
  const [comment, setComment] = useState("");
  const [currency, setCurrency] = useState("");
  const [token, setToken] = useState("");
  const { route, navigation } = props;
  const { currentPage, item, id } = route.params;
  const date = moment(+item?.date_create?.$date.$numberLong).format("DD MMMM");
  const { loading, error } = useSelector((state) => state.workRequestSlice);
  const dispatch = useDispatch();
  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });
  }, [token]);
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
        <View style={styles.infoBlock}>
          <View style={styles.row}>
            <View style={styles.locationInfo}>
              <Text style={styles.fromCity}>
                {item?.from_city?.title?.ru?.replace("(RU)", "")}
              </Text>
              <ImageOffersArrow />
              <Text style={styles.toCity}>
                {item?.to_city?.title?.ru?.replace("(RU)", "")}
              </Text>
            </View>
            <Text style={styles.price}>
              {item.price > 0 ? item.price + " p" : item.price}
            </Text>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.type}>{item?.type_container?.title}</Text>
              <Text style={styles.type}>{date}</Text>
            </View>
            <Text style={styles.dateAdded}>
              {moment(+item?.date_create?.$date.$numberLong).format(
                "YYYY-MM-DD"
              )}
            </Text>
          </View>
        </View>
        <View style={styles.company}>
          <Image
            style={styles.companyPhoto}
            source={{
              uri: item?.user?.avatar_person
                ? "https://teus.online/" + item?.user?.avatar
                : "https://vyshnevyi-partners.com/wp-content/uploads/2016/12/no-avatar.png",
            }}
          />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              {item?.user.name || item?.user?.contact_person}
            </Text>
            <Text style={styles.companyCity}>
              {item?.user?.city?.title?.ru}
            </Text>
            <Text style={styles.companyPosition}>
              {item?.user?.post !== "undefined" && item?.user?.post}
            </Text>
            <View style={styles.companyRating}>
              <ImageRatingSmall />
              <Text style={styles.companyRatingText}>
                {item.user.rate_plus}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.header}>Контакты</Text>
        <View style={styles.contactsList}>
          <SingleParticipantBlock
            key={item.last_id}
            uri={
              item?.user?.avatar_person
                ? "https://teus.online/" + item?.user?.avatar_person
                : "https://vyshnevyi-partners.com/wp-content/uploads/2016/12/no-avatar.png"
            }
            button={{
              label: "Написать",
              onPress: () => {
                dispatch(
                  chatOrderRequest({ token: token, id: item.user.last_id })
                )
                  .unwrap()
                  .then(() => {
                    navigation.navigate("Chat", {
                      currentPage: "Диалоги",
                      title: item.user.name,
                      id: item.user.last_id,
                    });
                  });
              },
            }}
            style={styles.contactsBlock}
          >
            <Text style={styles.name}>{item?.user?.contact_person}</Text>
            <Text style={styles.location}>
              {item?.user?.country?.title?.ru}
            </Text>
            <View style={styles.contacts}>
              <Text style={styles.contactsText}>{item?.user?.phone}</Text>
              <ImageCallGreen />
            </View>
            <View style={styles.contacts}>
              <Text style={styles.contactsText}>{item?.user?.email}</Text>
              <ImageEmailGreen />
            </View>
          </SingleParticipantBlock>
        </View>

        <Text style={styles.header}>Направить предложение</Text>
        <MyInput
          label={"Ваша цена"}
          keyboardType={"numeric"}
          value={price}
          onChangeText={(val) => setPrice(val)}
        />
        <MyInput
          label={"Срок пользования/перевозки, дней"}
          keyboardType={"numeric"}
          value={periodOfUsing}
          onChangeText={(val) => setPeriodOfUsing(val)}
        />
        <MyInput
          label={"Комментарий"}
          value={comment}
          onChangeText={(val) => setComment(val)}
          style={styles.commentInput}
          multiline
        />
        <View style={styles.containerStyle}>
          <SelectDropdown
            onSelect={() => {}}
            defaultButtonText="Валюта"
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            // search
            data={valuta}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
        <MyButton
          style={styles.submitButton}
          onPress={() => {
            dispatch(
              workRequest({
                secret_token: token,
                last_id: item.last_id,
                type: id,
                price,
                currency,
                comment,
                days: periodOfUsing,
                op: "enable",
              })
            )
              .unwrap()
              .then((res) => {
                if (!res) {
                  navigation.goBack();
                } else {
                  showMessage({
                    type: "danger",
                    message: "Неверные данные",
                  });
                }
              });
          }}
        >
          Направить предложение
        </MyButton>
      </View>
      {loading && (
        <Modal backdropOpacity={0.75} color="red" isVisible={true}>
          <View>
            <ActivityIndicator size="large" />
          </View>
        </Modal>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: WRAPPER_PADDINGS,
  },
  contactsList: {
    height: 200,
    marginBottom: 30,
  },
  contactsBlock: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR_6,
    paddingBottom: 20,
  },
  containerStyle: {
    marginBottom: 30,
    backgroundColor: COLOR_10,
    borderRadius: 6,
    // height: 46,
    borderTopColor: "transparent",
    borderTopWidth: 1,
  },
  infoBlock: {
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  fromCity: {
    marginRight: 10,
    color: COLOR_8,
    fontSize: 12,
    fontFamily: "GothamProMedium",
  },
  toCity: {
    marginLeft: 10,
    color: COLOR_8,
    fontSize: 12,
    fontFamily: "GothamProMedium",
  },
  price: {
    color: COLOR_5,
    fontSize: 12,
    fontFamily: "GothamProMedium",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLOR_2,
    borderRadius: 10,
  },
  type: {
    color: COLOR_8,
    fontSize: 10,
    fontFamily: "GothamProRegular",
    marginBottom: 4,
  },
  dateAdded: {
    color: COLOR_9,
    fontSize: 10,
    fontFamily: "GothamProRegular",
    marginTop: 18,
    marginRight: 10,
  },
  company: {
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  companyPhoto: {
    height: 80,
    width: 80,
    borderRadius: 50,
    marginRight: 30,
  },
  companyInfo: {},
  companyName: {
    color: COLOR_1,
    fontSize: 12,
    fontFamily: "GothamProRegular",
    marginBottom: 6,
  },
  companyCity: {
    color: COLOR_1,
    fontSize: 9,
    fontFamily: "GothamProRegular",
    marginBottom: 6,
  },
  companyPosition: {
    color: COLOR_1,
    fontSize: 9,
    fontFamily: "GothamProMedium",
    marginBottom: 10,
  },
  companyRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyRatingText: {
    marginLeft: 4,
    color: COLOR_1,
    fontSize: 10,
    fontFamily: "GothamProRegular",
  },
  header: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    marginBottom: 20,
    color: COLOR_1,
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
  contactWrapper: {
    borderBottomColor: COLOR_6,
    borderBottomWidth: 1,
    paddingBottom: 30,
  },
  commentInput: {
    height: undefined,
    marginBottom: 20,
  },
  submitButton: {
    alignSelf: "center",
    marginBottom: 50,
  },
});

export default SendOffer;
