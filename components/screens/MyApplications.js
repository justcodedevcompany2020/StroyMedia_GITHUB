import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import Wrapper from "../helpers/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import NavBar from "../includes/NavBar";
import {COLOR_1, COLOR_2, COLOR_3, COLOR_5, COLOR_6, COLOR_8, COLOR_9, WRAPPER_PADDINGS,} from "../helpers/Variables";
import {SwipeListView} from "react-native-swipe-list-view";
import {allCatRequest} from "../../store/reducers/allCatSlice";
import {ImageBlankApplications, ImageEdit, ImageFadePart, ImageOffersArrow,} from "../helpers/images";
import {Search} from "../includes/Search";
import AddNew from "../includes/AddNew";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import {authRequest} from "../../store/reducers/authUserSlice";
import {Entypo} from "@expo/vector-icons";
import {useNavigation, useRoute} from "@react-navigation/native";

const SearchIcon = require("../../assets/search.png");

function MyApplications() {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState("В работе");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const {currentPage} = route.params;
  const [token, setToken] = useState();
  const dispatch = useDispatch();
  const state = useSelector((state1) => state1);
  const {loading, data} = state.allCatSlice;
  const user = state.authUserSlice?.data?.user;
  const [filteredData, setFilteredData] = useState([]);
  const timeStamnp = +filteredData[0]?.date_create?.$date.$numberLong;

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
        dispatch(authRequest({secret_token: result})).then((res) => {
          setToken(res.payload?.data?.token);
        });
      }
    });
  }, [navigation]);

  useEffect(() => {
    const isFocused = navigation.addListener("focus", () => {
      AsyncStorage.getItem("token").then((result) => {
        if (result) {
          setToken(result);
          dispatch(authRequest({secret_token: result})).then((res) => {
            // setToken(res.payload?.data?.token);
          });
        }
      });
    });

    return () => {
      isFocused();
    };
  }, [navigation]);

  const getData = () => {
    let type = "";
    if (activeTab == "В работе") {
      type = "onwork";
    } else if (activeTab == "Черновик") {
      type = "draft";
    } else if (activeTab == "Архив") {
      type = "closed";
    }
    // activeTab == "В работе" ? "onwork" : "draft"
    dispatch(
      allCatRequest({
        token,
        tab: type,
        offset,
      })
    ).then((res) => {
      if (res.payload) {
        setFilteredData(res.payload?.data?.aplications?.aplications);
      }
    });
  };

  useEffect(() => {
    resetText();
    getData();

    const onFocus = navigation.addListener("focus", () => {
      getData();
    });
    return () => {
      onFocus();
    };
  }, [activeTab, token, navigation]);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.item}>
        <View style={styles.row}>
          <View style={styles.img}>
            <Image
              source={{
                uri:
                  typeof item?.img === "string"
                  ? "https://teus.online" + item?.img
                  : Array.isArray(item?.img)
                    ? "https://teus.online" + item.img[0]?.url
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
              <Text style={styles.numbertext}>N:{item.last_id}</Text>
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
              {typeof item?.service?.title === "string"
               ? item?.service?.title
               : item?.service?.title?.ru}
            </Text>
            <Text style={styles.type2}>
              Тип КТК: {item?.type_container?.title}{" "}
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
                {item?.from_city?.title?.ru || item?.dislokaciya?.title.ru}
              </Text>
              <ImageOffersArrow/>
              <Text style={styles.toCity}>{item?.to_city?.title?.ru}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.quantity}>Количество: {item?.count}</Text>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={styles.priceText}>Цена:</Text>
                <Text style={styles.price}>
                  {item?.price
                   ? item.price + " " + item?.currency?.sign
                   : "по запросу"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.commentBlock}>
          <Text style={styles.commentHeader}>{item?.decription}</Text>
        </View>
      </View>
    );
  };

  const filtered = (searchText) => {
    setFilteredData(
      filteredData.filter((m) => {
        return m?.title?.includes(searchText);
      })
    );
  };

  useEffect(() => {
    if (searchValue.trim().length < 1) {
      resetText();
    }
  }, [searchValue, activeTab]);

  const resetText = () => {
    setSearchValue("");
    filtered("");
    setFilteredData(data);
  };

  const headerComponent = () => {
    return (
      <View style={styles.header}>
        <NavBar
          tabs={["В работе", "Черновик", "Архив"]}
          activeTab={activeTab}
          onPress={async (tab) => {
            setPage(1);
            setOffset(0);
            setActiveTab(tab);
          }}
        />
        <View style={styles.searchRow}>
          <View style={{flex: 1}}>
            <Search
              style={styles.search}
              keyboardType={"web-search"}
              value={searchValue}
              onSearchText={(val) => {
                setSearchValue(val);
              }}
              resetText={resetText}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.2}
            style={{marginLeft: 10}}
            onPress={() => filtered(searchValue)}
          >
            <Image
              source={SearchIcon}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const nextPage = () => {
    setOffset(offset + 5);
    setPage(page + 1);
    dispatch(
      allCatRequest({
        token,
        tab: activeTab == "В работе" ? "onwork" : "draft",
        offset: offset + 5,
        searchText: searchValue ? searchValue : null,
      })
    ).then((res) => {
      if (res.payload) {
        setFilteredData(res.payload?.data?.aplications?.aplications);
      }
    });
  };

  const previusPage = () => {
    setOffset(offset - 5);
    setPage(page - 1);
    dispatch(
      allCatRequest({
        token,
        tab: activeTab == "В работе" ? "onwork" : "draft",
        offset: offset - 5,
        searchText: searchValue ? searchValue : null,
      })
    ).then((res) => {
      if (res.payload) {
        setFilteredData(res.payload?.data?.aplications?.aplications);
      }
    });
  };

  return (
    <Wrapper
      withContainer
      withoutScrollView
      header={{
        currentPage,
        home: true,
        navigation,
      }}
    >
      <Modal visible={loading} transparent={true} statusBarTranslucent>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: "#00000055",
          }}
        >
          <ActivityIndicator color={COLOR_1} size={50}/>
        </View>
      </Modal>
      {headerComponent()}
      {/* && activeTab !== "Архив" */}
      {data.length ? (
        <View style={styles.wrapper}>
          <SwipeListView
            data={filteredData}
            nestedScrollEnabled
            scrollEnabled
            disableLeftSwipe={activeTab === "Архив"}
            ListEmptyComponent={() => {
              return <Text style={styles.empty}>ничего не найдено</Text>;
            }}
            ListFooterComponent={() => {
              return filteredData.length ? (
                <View
                  style={{
                    flex: 1,
                    height: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <TouchableOpacity
                      disabled={page <= 1 ? true : false}
                      onPress={previusPage}
                    >
                      <Entypo name="chevron-left" size={28} color={"gray"}/>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <View style={styles.pageCount}>
                      <Text style={styles.count}>{page}</Text>
                    </View>
                  </View>
                  <View>
                    <TouchableOpacity
                      disabled={filteredData.length === 5 ? false : true}
                      onPress={nextPage}
                    >
                      <Entypo name="chevron-right" size={28} color={"gray"}/>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null;
            }}
            renderItem={renderItem}
            // ListHeaderComponent={headerComponent()}
            renderHiddenItem={({item}) => (
              <View style={styles.hiddenWrapper}>
                <TouchableOpacity
                  style={styles.hiddenItem}
                  onPress={() => {
                    navigation.navigate("EditApplication", {
                      currentPage: "Редактирование заявки",
                      activeSecondaryTab: item?.service?.title,
                      typeKTK: item?.type_container?.title,
                      user: user,
                      token,
                      last_id: item?.last_id?.toString(),
                      price_: item?.price?.toString(),
                      count_: item?.count?.toString(),
                      to_city_: item?.to_city?.title?.ru?.toString(),
                      from_city_:
                        item?.from_city?.title?.ru?.toString() ||
                        item?.dislokaciya?.title.ru?.toString(),
                      to_city_id: item?.to_city?.last_id?.toString(),
                      from_city_id:
                        item?.from_city?.last_id?.toString() ||
                        item?.dislokaciya?.last_id?.toString(),
                      date: timeStamnp,
                      activeTab,
                      decription: item?.description,
                      img: item?.img,
                      valut: item?.currency?.sign,
                      paymentType: item?.typepay?.title.hasOwnProperty("ru")
                                   ? item?.typepay?.title.ru
                                   : item?.typepay?.title,
                      reestrrzhd_: item?.reestrrzhd?.title.hasOwnProperty("ru")
                                   ? item?.reestrrzhd?.title?.ru
                                   : item?.reestrrzhd?.title,
                      condition_: item?.condition?.title.hasOwnProperty("ru")
                                  ? item?.condition?.title?.ru
                                  : item?.condition?.title,
                      cargo: item?.cargo?.toString(),
                      comment_: item?.comment?.toString(),
                    });
                  }}
                >
                  <View style={styles.hiddenBlock}>
                    <ImageEdit/>

                    <View style={styles.hiddenItemTextBlock}>
                      <Text style={styles.hiddenItemText}>Редактировать</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            rightOpenValue={-112}
            disableRightSwipe
            keyExtractor={(item) => item.last_id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexShrink: 0}}
            // stickyHeaderIndices={[0]}
          />
          <View style={styles.fadeBlock}>
            <Image source={ImageFadePart} style={styles.fade}/>
          </View>
        </View>
      ) : (
         <View style={styles.wrapper}>
           {/* <NavBar
            tabs={["В работе", "Черновик", "Архив"]}
            activeTab={activeTab}
            onPress={async (tab) => {
              setActiveTab(tab);
            }}
          /> */}
           <View style={styles.blankTextBlock}>
             <Text style={styles.blankText}>Здесь будут ваши заявки.</Text>
             <Text style={styles.blankText}>Нажмите на «+» чтобы</Text>
             <Text style={styles.blankText}>добавить заявку</Text>
           </View>
           <View style={styles.blankImage}>
             <ImageBlankApplications/>
           </View>
         </View>
       )}
      <AddNew
        end={true}
        onPress={() =>
          navigation.navigate("CreatingApplication", {
            currentPage: "Создание новой заявки",
          })
        }
      />
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: "82.9%",
  },
  empty: {
    fontSize: 22,
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    textAlign: "center",
    marginTop: 40,
  },
  count: {
    color: "white",
  },
  pageCount: {
    width: 25,
    height: 25,
    backgroundColor: COLOR_3,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  header: {
    backgroundColor: COLOR_5,
  },
  searchRow: {
    paddingHorizontal: WRAPPER_PADDINGS,
    marginTop: -20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: COLOR_5,
    paddingVertical: 20,
    borderBottomColor: COLOR_6,
    borderBottomWidth: 1,
    paddingHorizontal: WRAPPER_PADDINGS,
    maxWidth: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
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
  leftBlock: {
    // marginRight: 20,
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: {
    color: COLOR_8,
    fontSize: 10,
    marginTop: 3,
    fontFamily: "GothamProRegular",
  },
  type2: {
    color: COLOR_8,
    fontSize: 10,
    fontFamily: "GothamProRegular",
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
  fadeBlock: {
    height: "100%",
    width: WRAPPER_PADDINGS,
    position: "absolute",
    zIndex: 2,
    top: 150,
    left: 0,
  },
  fade: {
    width: "100%",
    height: "100%",
  },
  hiddenWrapper: {
    paddingVertical: 16,
    position: "absolute",
    right: 0,
    top: 0,
    paddingRight: WRAPPER_PADDINGS,
    height: "100%",
  },
  hiddenItem: {
    alignSelf: "flex-end",
    justifyContent: "center",
    borderLeftColor: COLOR_6,
    borderLeftWidth: 1,
    height: "100%",
    paddingLeft: 8,
  },
  hiddenBlock: {
    alignItems: "center",
  },
  hiddenItemTextBlock: {
    alignItems: "center",
    marginTop: 10,
  },
  hiddenItemText: {
    color: "#000",
    fontSize: 9,
    fontFamily: "GothamProRegular",
  },
  commentBlock: {
    marginTop: 8,
  },
  commentHeader: {
    color: COLOR_8,
    fontSize: 10,
    fontFamily: "GothamProMedium",
    marginBottom: 8,
  },
  commentText: {
    color: COLOR_8,
    fontSize: 10,
    fontFamily: "GothamProRegular",
    lineHeight: 11,
  },
  blankTextBlock: {
    marginTop: 70,
  },
  blankText: {
    alignSelf: "center",
    marginBottom: 10,
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    fontSize: 14,
  },
  blankImage: {
    alignSelf: "center",
    marginTop: 50,
  },
  img: {
    position: "absolute",
    right: 0,
  },
});

export default MyApplications;
