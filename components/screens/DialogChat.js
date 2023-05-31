import React, {useCallback, useEffect, useRef, useState} from "react";
import {Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import Wrapper from "../helpers/Wrapper";
import {COLOR_1, COLOR_10, COLOR_5, COLOR_8, COLOR_9, WRAPPER_PADDINGS,} from "../helpers/Variables";
import {Search} from "../includes/Search";
import MyInput from "../includes/MyInput";
import {ImageAttach, ImageSend,} from "../helpers/images";
import {useDispatch, useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import {sendMessageRequest} from "../../store/reducers/sendMessageSlice";
import * as ImagePicker from "expo-image-picker";
import {useNavigation} from "@react-navigation/native";
import {chatOrderRequest} from "../../store/reducers/chatDialogOrderSlice";
import {ImagesViewModal} from "../includes/ImagesViewModal";

const SearchIcon = require("../../assets/search.png");
const HEIGHT = Dimensions.get("window").width;
const ITEM_HEIGHT = 100;

export const DialogChat = ({route}) => {
  const navigation = useNavigation();
  const messagesRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [inputBottom, setInputBottom] = useState(6);
  const [inputHeight, setInputHeight] = useState(40);
  const [isChanged, setIsChanged] = useState(false);
  const user = useSelector((state) => state.authUserSlice?.data?.user);
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  const {currentPage} = route.params;
  const [id, setId] = useState();
  const [token, setToken] = useState();
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [local, setLocal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const state = useSelector(state1 => state1)
  const {messages} = state.chatDialogOrderSlice.data
  const {send_message} = state.sendMessageSlice

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      setToken(result);
      dispatch(chatOrderRequest({token: result, id: route.params.id, offset: "10"}))

    });
  }, [navigation]);

  function getImageFormat(str) {
    const afterDot = str.substr(str.indexOf(".") + 1);
    return afterDot;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });
    if (!result.canceled) {
      getImageFormat(result.assets[0].uri);
      setFileName(result.assets[0].uri.split("/").pop());
      setFilePath(result.assets[0].uri);
    }
  };

  const sendMessage = async () => {

    // let item = {...filteredData}
    // item.comment = inputValue
    // item.from = {
    //   avatar_person: user?.avatar_person,
    //   contact_person: user?.contact_person,
    //   name: user?.name,
    // }
    // item.date = {
    //   $date: {
    //     $numberLong: new Date()
    //   }
    // }
    // item.last_id = new Date().toISOString()
    // item.files = filePath ? filePath : ""
    // item.local = true
    //
    // setFilteredData(item)
    setFilteredData([
        ...filteredData,
        {
          comment: inputValue,
          from: {
            avatar_person: user?.avatar_person,
            contact_person: user?.contact_person,
            name: user?.name,
          },
          date: {
            $date: {
              $numberLong: new Date(),
            },
          },
          last_id: new Date().toISOString(),
          files: filePath ? filePath : "",
          local: true,
        }
      ]
    );
    let data = new FormData();
    data.append(
      "file_dialog",
      filePath && {
        uri: filePath,
        // Platform.OS === "android"
        //   ? filePath
        //   : filePath.replace("file://", ""),
        name: fileName,
        // type: `image/${getImageFormat(filePath)}`,
        type: `image/jpg`,
      }
    );
    data.append("secret_token", token);
    data.append("last_id", route.params.id);
    data.append("message", inputValue);

    dispatch(sendMessageRequest({data}))


    setInputValue("");
    setFilePath("")
    setInputHeight(40);
  };


  const actionHandler = useCallback(
    () => {
      dispatch(chatOrderRequest({token: token, id: route.params.id, offset: 20}))
    },
    [messages]
  );

  useEffect(() => {
    if (messages?.length > 0) {
      setFilteredData(messages)

    }
  }, [messages]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      actionHandler()
    }, 8000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [navigation, messages])

  const footerComponent = () => {
    return (
      <>
        {filePath ? (
          <View style={styles.selectImage}>
            <Image
              source={{uri: filePath}}
              style={{
                width: 60,
                height: 60,
              }}
            />

            <Text onPress={() => setFilePath("")} style={styles.cancel}>
              X
            </Text>
          </View>
        ) : (
          <View></View>
        )}
        <View style={styles.footer}>
          <TouchableOpacity onPress={pickImage} style={styles.attach}>
            <View style={styles.attachImage}>
              <ImageAttach/>
            </View>
          </TouchableOpacity>
          <View style={styles.inputView}>
            <MyInput
              value={inputValue}
              onChangeText={(val) => setInputValue(val)}
              style={{
                width: "85%",
                paddingRight: "6%",
                marginBottom: 0,
                marginLeft: 10,
              }}
              maxHeight={100}
              multiline={true}
              onContentSizeChange={(event) => {
                setInputBottom(
                  countInputBottom(event?.nativeEvent?.contentSize?.height)
                );
                setInputHeight(event?.nativeEvent?.contentSize?.height);
              }}
              placeholder={"Напишите сообщение..."}
              sendComponent={
                inputValue || filePath ? (
                  <TouchableOpacity
                    style={[
                      styles.send,
                      {bottom: countSendBottom(inputBottom)},
                    ]}
                    onPress={sendMessage}
                  >
                    <View style={{paddingTop: 8, paddingRight: HEIGHT / 8}}>
                      <ImageSend/>
                    </View>
                  </TouchableOpacity>
                ) : null
              }
            />
          </View>
        </View>
      </>
    );
  };

  const filteredMessages = (searchText) => {
    // route.params.currentPage === "Диалоги"
    //   ? setFilteredData(
    //     dialogMessage.filter((m) => {
    //       return m?.comment?.includes(searchText);
    //     })
    //   )
    //   :
    setFilteredData(
      filteredData.filter((m) => {
        return m?.comment?.includes(searchText);
      })
    );
  };

  const resetText = () => {
    setSearchValue("");
    filteredMessages("");
  };

  const headerComponent = () => {
    return (
      <View style={styles.headerComponent}>
        <Text style={styles.header}>{route.params.title}</Text>
        <View style={styles.searchRow}>
          <Search
            style={styles.search}
            searchText={searchValue}
            onSearchText={(val) => setSearchValue(val)}
            filtered
            resetText={resetText}
          />
          <TouchableOpacity
            activeOpacity={0.2}
            onPress={() => {
              filteredMessages(searchValue);
            }}
          >
            <Image source={SearchIcon} style={{width: 25, height: 25}}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  console.log(messages, 'item.files')
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.item}>
        <Image
          style={styles.photo}
          source={{
            uri: "https://teus.online/" + item?.from?.avatar_person

          }}
        />
        <View style={styles.messagesList}>
          <View style={styles.messageBlock}>
            <View style={styles.row}>
              <View style={styles.nameBlock}>
                <Text style={styles.name}>
                  {item?.from?.contact_person}
                </Text>
                <Text style={styles.companyName}>
                  {item?.from?.name !== "undefined"
                    ? item?.from?.name
                    : ""
                  }
                </Text>
              </View>
              <View style={styles.timeBlock}>
                <View>
                  <Text style={styles.time}>
                    {moment(+item?.date?.$date?.$numberLong).format("hh:mm")}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.message}>{item.comment} </Text>
            <View style={!item.comment ? {marginTop: -16} : {marginTop: 8}}>
              {item.files ? (
                <TouchableOpacity
                  onPress={() => {
                    // setSelectedFile(item?.files);
                    setLocal(item?.local);
                  }}
                >

                  <Image
                    source={{uri: item.files}}
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  />
                </TouchableOpacity>
              ) : (

                <></>
              )}
            </View>
          </View>
          <View style={styles.triangle}/>
        </View>
      </View>
    );
  };

  const countInputBottom = (height) => {
    const lines = Math.floor((Math.round(height) - 26) / 14);
    return lines < 5 ? lines * 8 : 42;
  };

  const countSendBottom = (inputBottom) => {
    const lines = Math.floor(inputBottom / 10);
    if (!lines) return 5;
    else if (lines < 5) return lines * 8;
    else return 40;
  };

  // const getItemLayout = (data, index) => ({
  // 			length: HEIGHT,
  // 			offset: HEIGHT,
  // 			index,
  // 		}
  // 	)
  // ;

  return (
    <Wrapper
      withoutScrollView
      withContainer
      header={{
        currentPage,
        home: true,
        navigation,
      }}
    >
      <View style={styles.listWrapper}>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          ref={messagesRef}
          ListHeaderComponent={headerComponent}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, $) => item.last_id}
          ListEmptyComponent={() => (
            <View>
              <Text
                style={{
                  marginTop: 50,
                  textAlign: "center",
                  fontSize: 20,
                }}
              >
                У Вас нет сообщений
              </Text>
            </View>
          )}
          onContentSizeChange={() => {
            filteredData?.length > 0 &&
            messagesRef?.current?.scrollToEnd(0);
          }}
          getItemLayout={(data, index) => {
            return {
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index + 100,
              index,
            };
          }}
          nestedScrollEnabled
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={20}
        />
        {footerComponent()}
      </View>

      <ImagesViewModal
        isVisible={selectedFile ? true : false}
        fileName={selectedFile}
        item={filteredData}
        local={local}
        onCancel={() => {
          setSelectedFile("");
        }}
      />
    </Wrapper>
  );
}

const styles = StyleSheet.create({
    wrapper: {
      paddingHorizontal: WRAPPER_PADDINGS,
    },
    headerComponent: {
      backgroundColor: COLOR_5,
    },
    header: {
      fontSize: 12,
      fontFamily: "GothamProMedium",
      color: COLOR_1,
      paddingHorizontal: WRAPPER_PADDINGS,
      marginTop: 20,
    },
    searchRow: {
      paddingHorizontal: WRAPPER_PADDINGS,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    listWrapper: {
      // flex: 1,
      height: "100%",
      // width: "100%",
      // height:
      //   Dimensions.get("window").height - Platform.OS === "ios" ? -120 : -100,
      paddingBottom: 80,
// backgroundColor: "red",
    },
    item: {
      marginBottom: 20,
      paddingHorizontal: WRAPPER_PADDINGS,
      flexDirection: "row",
      alignItems: "flex-end",
    },
    footer: {
      paddingHorizontal: WRAPPER_PADDINGS,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      position: "absolute",
      bottom: 0,
      zIndex: 9999,
      height: 60,
      backgroundColor: "white",
    },
    inputView: {
      width: "100%",
    },
    input: {
      height: 80,
      color: COLOR_8,
      fontSize: 10,
      fontFamily: "GothamProRegular",
      width: "90%",
      flex: 1,
    }
    ,
    send: {
      position: "absolute",
      zIndex: 2,
      right: 0,
      top: 26,
    },
    triangle: {
      width: 10,
      height: 10,
      position: "absolute",
      bottom: 0,
      left: -9,
      borderLeftWidth: 10,
      borderLeftColor: "transparent",
      borderRightWidth: 10,
      borderRightColor: "transparent",
      borderBottomWidth: 10,
      borderBottomColor: COLOR_10,
    }
    ,
    photo: {
      width: 50,
      height: 50,
      borderRadius: 50,
      marginRight: 10,
    },
    messagesList: {
      width: "82%",
    },
    messageBlock: {
      backgroundColor: COLOR_10,
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 10,
      marginTop: 10,
    },
    forwardedBlock: {
      paddingLeft: 20,
      marginBottom: 20,
    },
    forwardIcon: {
      position: "absolute",
      left: 0,
      top: 0,
    },
    nameBlock: {
      flexDirection: "row",
      marginBottom: 7,
    },
    name: {
      fontSize: 9,
      fontFamily: "GothamProRegular",
      color: COLOR_1,
      marginRight: 5,
    },
    companyName: {
      fontSize: 9,
      fontFamily: "GothamProRegular",
      color: COLOR_9,
    },
    forwardedMessage: {
      fontSize: 9,
      fontFamily: "GothamProRegular",
      color: COLOR_9,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    timeBlock: {
      flexDirection: "row",
      alignItems: "center",
    },
    time: {
      fontSize: 9,
      fontFamily: "GothamProRegular",
      color: COLOR_9,
      marginRight: 8,
    },
    message: {
      fontSize: 9,
      fontFamily: "GothamProRegular",
      color: COLOR_9,
      lineHeight: 11,
    },
    attach: {
      height: 50,
      justifyContent: "center",
    },
    selectImage: {
      paddingHorizontal: 20,
      justifyContent: "flex-end",
      flexDirection: "row",
      position: "relative",
    },
    cancel: {
      color: "red",
      position: "absolute",
      right: 15,
      top: -10,
      zIndex: 1,
    },
    search: {
      flex: 1,
      marginRight: 8,
    },
    attachImage: {}
    ,
  })
;
