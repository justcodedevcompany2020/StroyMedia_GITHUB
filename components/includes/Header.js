import React, {useEffect, useState} from "react";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {COLOR_1, COLOR_2, COLOR_3, COLOR_5, COLOR_6, COLOR_8, COLOR_9, WRAPPER_PADDINGS,} from "../helpers/Variables";
import {ImageBackArrow, ImageHomeIcon, ImageNotificationsIcon, ImageOffersArrow, ImageSave,} from "../helpers/images";
import {useDispatch, useSelector} from "react-redux";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getAllNotificationsRequest} from "../../store/reducers/getAllNotificationsSlice";
import {FontAwesome, FontAwesome5} from "@expo/vector-icons";
import {workRequestGetDataRequest} from "../../store/reducers/workRequestGetDataSlice";
import {workRequestAcceptRequest} from "../../store/reducers/workRequestAcceptSlice";
import {workRequestCancelRequest} from "../../store/reducers/workRequestCancelSlice";
import moment from "moment";

function Header({currentPage, home, navigation, onSavePress}) {
  const state = useSelector((state) => state);
  const {notification_data} = state.getAllNotificationsSlice;
  const [token, setToken] = useState(null);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [modalRequest, setModalRequest] = useState(false);
  // const {work_request_data} = state.workRequestGetDataSlice;
  const [work_request_data, setWork_request_data] = useState([])

  const timeStamnp =
    +work_request_data?.request?.comments[0]?.date.$date.$numberLong;

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        dispatch(getAllNotificationsRequest({token: result}));
        setToken(result);
      }
    });
  }, [dispatch, navigation]);

  const isVisible = () => {
    setVisible(true);
  };
  const onCancel = () => {
    setVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.leftPart}>
        {currentPage && (
          <>
            <TouchableOpacity
              onPress={navigation.goBack}
              style={styles.imageView}
            >
              <ImageBackArrow style={styles.image}/>
            </TouchableOpacity>
            <Text style={styles.currentPage}>{currentPage}</Text>
          </>
        )}
      </View>
      <View style={styles.rightPart}>
        {home ? (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.homeImageView}
            >
              <ImageHomeIcon style={styles.homeImage}/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={isVisible}
              style={styles.notificationImageView}
            >
              <ImageNotificationsIcon style={styles.notificationImage}/>
            </TouchableOpacity>
          </>
        ) : (
           <TouchableOpacity style={styles.saveIconView} onPress={onSavePress}>
             <ImageSave style={styles.saveIcon}/>
           </TouchableOpacity>
         )}
      </View>
      <Modal
        style={styles.modal}
        isVisible={visible}
        transparent={true}
        animationIn={"fadeInUp"}
        animationOut={"fadeOutDown"}
        // onRequestClose={onCancel}
        hardwareAccelerated={true}
        onBackdropPress={onCancel}
        backdropOpacity={0.3}
        animationInTiming={100}
        animationOutTiming={100}
      >
        <View style={styles.modalWrapper}>
          <Text style={styles.title}>Уведомления</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {notification_data ? (
              notification_data.values?.map((item, index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.notificationWrapper}
                      key={index}
                      onPress={() => {
                        console.log(item[0]?.object?.request.last_id)
                        let form_data = new FormData();
                        form_data.append("secret_token", token);
                        form_data.append("last_id", item[0]?.object?.request.last_id);
                        dispatch(
                          workRequestGetDataRequest(form_data)
                        ).then((res) => {

                          if (res.payload.message === "Successfully data got") {
                            setWork_request_data(res.payload.data)

                            onCancel();
                            if (item[0]?.type === "request_service_comment") {
                              setModalRequest(true);
                            }
                          }
                        });
                      }}
                    >
                      <Image
                        source={{
                          uri: "https://teus.online" + item[0]?.author?.avatar,
                        }}
                        style={styles.imageStyles}
                      />
                      <View
                        style={{
                          alignItems: "flex-end",
                        }}
                      >
                        <Text style={styles.authorNotification}>
                          {item[0]?.author?.name}
                        </Text>
                        <Text style={styles.notifyText}>
                          {item[0]?.comment}
                        </Text>
                      </View>
                      {item[0]?.read == 0 ? (
                        <FontAwesome5 name="envelope" size={20} color="black"/>
                      ) : (
                         <FontAwesome
                           name="envelope-open-o"
                           size={20}
                           color="black"
                         />
                       )}
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
               <Text style={styles.noDataText}>У Вас нет уведомлений</Text>
             )}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        isVisible={modalRequest}
        style={styles.modal}
        transparent={true}
        animationIn={"fadeInUp"}
        animationOut={"fadeOutDown"}
        hardwareAccelerated={true}
        onBackdropPress={() => setModalRequest(false)}
        backdropOpacity={0.3}
        animationInTiming={100}
        animationOutTiming={100}
      >
        <View
          style={{
            width: "95%",
            height: "50%",
            backgroundColor: "white",
            shadowRadius: 10,
            shadowOffset: {width: 0, height: 0},
            shadowColor: "black",
            elevation: 5,
            borderRadius: 20,
            // justifyContent: "center",
          }}
        >
          <Text style={[styles.title, {marginTop: 20, marginBottom: 30}]}>
            Вам поступило предложение
          </Text>
          <View
            style={{
              backgroundColor: COLOR_5,
              paddingVertical: 20,
              borderBottomColor: COLOR_6,
              borderBottomWidth: 1,
              paddingHorizontal: 10,
              maxWidth: "100%",
            }}
          >
            <View style={styles.row}>
              <View style={styles.img}>
                <Image
                  source={{
                    uri:
                      typeof work_request_data?.request?.img === "string"
                      ? "https://teus.online" + work_request_data?.img
                      : Array.isArray(work_request_data?.request?.img)
                        ? "https://teus.online" +
                          work_request_data?.request.img[0]?.url
                        : null,
                  }}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 5,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={styles.number}>
                  <Text style={styles.numbertext}>
                    N:{work_request_data?.request?.last_id}
                  </Text>
                </View>
                <Text style={styles.date}>
                  {" "}
                  {moment(timeStamnp).format("YYYY-MM-DD")}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.leftBlock}>
                <Text style={styles.type}>
                  {typeof work_request_data?.request?.service?.title === "string"
                   ? work_request_data?.request?.service?.title
                   : work_request_data?.request?.service?.title?.ru}
                </Text>
                <Text style={styles.type2}>
                  Тип КТК: {work_request_data?.request?.type_container?.title}{" "}
                </Text>
              </View>
              <View style={styles.rightBlock}>
                <View
                  style={[
                    styles.locationInfo,
                    {
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      columnGap: 5,
                    },
                  ]}
                >
                  <Text style={styles.fromCity}>
                    {work_request_data?.request?.from_city?.title?.ru ||
                      work_request_data?.request?.dislokaciya?.title.ru}
                  </Text>
                  <ImageOffersArrow/>
                  <Text style={styles.toCity}>
                    {work_request_data?.request?.to_city?.title?.ru}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.quantity}>
                    Количество: {work_request_data?.request?.count}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={styles.priceText}>Цена:</Text>
                    <Text style={styles.price}>
                      {work_request_data?.request?.price
                       ? work_request_data?.request.price +
                         " " +
                         work_request_data?.request?.currency?.sign
                       : "по запросу"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.commentBlock}>
              <Text style={styles.commentHeader}>
                {work_request_data?.request?.decription}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              columnGap: 20,
              justifyContent: "center",
              paddingTop: 20,
            }}
          >
            {!work_request_data?.request?.comments[0]?.accept &&
              !work_request_data?.request?.comments[0]?.disable && (
                <>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: "#00a8ff",
                      height: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      dispatch(
                        workRequestAcceptRequest({
                          secret_token: token,
                          last_id:
                            work_request_data?.request?.last_id.toString(),
                          comment_id:
                            work_request_data?.request?.comments[0].last_id.toString(),
                        })
                      ).then((res) => {
                        console.log(res, 'res.payload')
                        if (res.payload.success) {
                          setModalRequest(false)
                          navigation.navigate("DialogChat", {})

                        }
                      });
                    }}
                  >
                    <Text style={{color: "white"}}>Принять</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: "#fb6067",
                      height: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      dispatch(
                        workRequestCancelRequest({
                          secret_token: token,
                          last_id:
                            work_request_data?.request?.last_id.toString(),
                          comment_id:
                            work_request_data?.request?.comments[0].last_id.toString(),
                        })
                      ).then((res) => {
                        console.log(res, "res.payload");
                        if (res.payload.success) {
                          setModalRequest(false)
                        }
                      });
                    }}
                  >
                    <Text style={{color: "white"}}>отказать</Text>
                  </TouchableOpacity>
                </>
              )}
            {work_request_data?.request?.comments[0]?.accept == 1 && (
              <Text style={{color: "#34A303"}}>ПРИНЯТО</Text>
            )}
            {work_request_data?.request?.comments[0]?.disable == 1 && (
              <Text style={{color: "#fb6067"}}>ОТКАЗАНО</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    paddingTop: 60,
    width: "100%",
    paddingHorizontal: WRAPPER_PADDINGS,
    backgroundColor: COLOR_5,
    zIndex: 2,
    paddingBottom: 14,
  },
  authorNotification: {
    color: COLOR_2,
    fontFamily: "GothamProRegular",
    fontSize: 15,
  },
  notificationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  imageStyles: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  modalWrapper: {
    backgroundColor: COLOR_5,
    width: "94%",
    height: "60%",
    position: "absolute",
    paddingHorizontal: 30,
    paddingVertical: 25,
    borderRadius: 10,
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  imageView: {
    marginRight: 20,
  },
  image: {
    width: 22,
    height: 20,
  },
  currentPage: {
    fontFamily: "GothamProRegular",
    fontSize: 14,
    color: COLOR_1,
  },
  leftPart: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightPart: {
    flexDirection: "row",
    alignItems: "center",
  },
  homeImageView: {
    marginRight: 20,
  },
  homeImage: {
    width: 22,
    height: 22,
  },
  notificationImageView: {},
  notificationImage: {
    width: 19,
    height: 22,
  },
  saveIconView: {},
  saveIcon: {},
  title: {
    textAlign: "center",
    fontFamily: "GothamProRegular",
    fontSize: 18,
    color: COLOR_1,
  },
  notifyText: {
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    fontSize: 12,
    marginTop: 5,

    // flex: 1,
    // flexWrap: "wrap"

  },
  noDataText: {
    textAlign: "center",
    marginTop: 50,
    fontFamily: "GothamProRegular",
    color: COLOR_1,
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  fromCity: {
    // marginRight: 10,
    color: COLOR_8,
    fontSize: 12,
    fontFamily: "GothamProMedium",
  },
  toCity: {
    // marginLeft: 10,
    color: COLOR_8,
    fontSize: 12,
    fontFamily: "GothamProMedium",
  },
  rightBlock: {
    height: 50,
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 10,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  leftBlock: {
    // marginRight: 20,
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
  },
  numbertext: {
    color: COLOR_5,
    fontSize: 12,
    fontFamily: "GothamProMedium",
  },
  date: {
    color: COLOR_9,
    fontSize: 10,
    fontFamily: "GothamProRegular",
  },
  number: {
    // marginRight: 20,
    color: COLOR_5,
    fontSize: 12,
    fontFamily: "GothamProMedium",
    paddingVertical: 7,
    paddingHorizontal: 8,
    backgroundColor: COLOR_3,
    borderRadius: 10,
  },
  item: {
    backgroundColor: COLOR_5,
    paddingVertical: 20,
    borderBottomColor: COLOR_6,
    borderBottomWidth: 1,
    paddingHorizontal: WRAPPER_PADDINGS,
    maxWidth: "100%",
  },
  img: {
    position: "absolute",
    right: 0,
  },
  quantity: {
    color: COLOR_8,
    fontSize: 10,
    fontFamily: "GothamProRegular",
    marginRight: 24,
  },
  priceText: {
    color: COLOR_8,
    fontSize: 12,
    fontFamily: "GothamProMedium",
    marginRight: 2,
  },
  price: {
    color: COLOR_5,
    fontSize: 12,
    fontFamily: "GothamProMedium",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: COLOR_2,
    borderRadius: 10,
  },
});

export default Header;
