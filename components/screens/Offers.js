import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Wrapper from "../helpers/Wrapper";
import { useSelector } from "react-redux";
import NavBar from "../includes/NavBar";
import Search from "../includes/Search";
import { ImageFadePart, ImageSend } from "../helpers/images";
import FilterItem from "../includes/FilterItem";
import { useDispatch } from "react-redux";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  COLOR_10,
  COLOR_2,
  COLOR_5,
  COLOR_6,
  COLOR_8,
  COLOR_9,
  COLOR_1,
  WRAPPER_PADDINGS,
  COLOR_3,
} from "../helpers/Variables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OfferItem } from "../includes/OfferItem";
import { getCitys } from "../../store/reducers/getCitysSlice";
import Modal from "react-native-modal";
import { allSuggestionRequest } from "../../store/reducers/getAllSuggestionsSlice";
import { Entypo } from "@expo/vector-icons";

const SearchIcon = require("../../assets/search.png");

function Offers(props) {
  const [tabs, setTabs] = useState(["Все предложения", "Избранное"]);
  const [activeTab, setActiveTab] = useState("Все предложения");
  const { data, loading } = useSelector(
    (state) => state.getAllSuggestionsSlice
  );
  const [citys, setCitys] = useState([]);
  const typeContainer = ["40 ST", "20 (30)", "20 (24)", "40 HQ"];
  const secondaryTabs = [
    "Поиск КТК",
    "Продажа КТК",
    "Выдача КТК",
    "Контейнерный сервис",
    "Заявка на ТЭО",
  ];
  const [activeSecondaryTab, setActiveSecondaryTab] = useState("Поиск КТК");
  const [searchValue, setSearchValue] = useState("");
  const [load, setLoad] = useState(false);
  const [id, setId] = useState();
  const [token, setToken] = useState();
  const { route, navigation } = props;
  const { currentPage } = route.params;
  const [containerType, setTypeContainer] = useState("");
  const [searchName, setSearchName] = useState("");
  const [cityFromName, setFromCityName] = useState("");
  const [cityToName, setToCityName] = useState("");
  const [offset, setOffset] = useState(5);
  const [page, setPage] = useState(1);
  const [likedList, setLikedList] = useState([]);
  const timeStamnp = +data[0]?.date_create?.$date.$numberLong;
  let allCitys = useSelector(
    (state) => state.getCitysSlice?.data?.data?.data?.citys
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setId(
      activeSecondaryTab === "Поиск КТК"
        ? "2"
        : activeSecondaryTab === "Продажа КТК"
        ? "5"
        : activeSecondaryTab === "Выдача КТК"
        ? "3"
        : activeSecondaryTab === "Контейнерный сервис"
        ? "6"
        : "7"
    );
  }, [activeSecondaryTab]);

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });
    const getCytys = () => {
      dispatch(getCitys())
        .unwrap()
        .then((result) => {
          setCitys(result.data.data.citys);
        });
    };
    getCytys();
  }, []);
  const filtered = () => {
    setCitys(
      allCitys?.filter((c) => {
        return c?.title?.ru?.includes(searchValue);
      })
    );
  };

  const filteretData = () => {
    setLoad(true);
    dispatch(
      allSuggestionRequest({
        token,
        id: activeSecondaryTab,
        offset: 5,
        searchText: searchValue ? searchValue : null,
        to_city: cityToName ? cityToName.last_id : null,
        from_city: cityFromName ? cityFromName.last_id : null,
        type_container:
          containerType === "40 ST" || containerType === "20 (30)"
            ? 4
            : containerType === "20 (24)"
            ? 2
            : containerType === "40 HQ"
            ? 3
            : null,
      })
    )
      .unwrap()
      .then(() => setLoad(false));
  };

  const renderItem = ({ item, index }) => {
    return (
      <OfferItem
        likedList={likedList}
        navigation={navigation}
        date={item?.date_create?.$date?.$numberLong}
        id={item.last_id}
        typeId={id}
        item={item}
        timeStamnp={timeStamnp}
        tab={activeTab}
      />
    );
  };

  const filterFromCitys = (data) => {
    setPage(1);
    setLoad(true);
    dispatch(
      allSuggestionRequest({
        token,
        id: activeSecondaryTab,
        offset: 5,
        searchText: searchValue ? searchValue : null,
        to_city: cityToName ? cityToName.last_id : null,
        from_city: data,
        type_container:
          containerType === "40 ST" || containerType === "20 (30)"
            ? 4
            : containerType === "20 (24)"
            ? 2
            : containerType === "40 HQ"
            ? 3
            : null,
      })
    )
      .unwrap()
      .then(() => setLoad(false));
  };

  const filterToCitys = (data) => {
    setLoad(true);
    setPage(1);
    dispatch(
      allSuggestionRequest({
        token,
        id: activeSecondaryTab,
        offset: 5,
        searchText: searchValue ? searchValue : null,
        to_city: data,
        from_city: cityFromName ? cityFromName : null,
        type_container:
          containerType === "40 ST" || containerType === "20 (30)"
            ? 4
            : containerType === "20 (24)"
            ? 2
            : containerType === "40 HQ"
            ? 3
            : null,
      })
    )
      .unwrap()
      .then(() => setLoad(false));
  };

  const filterTypeContainer = (data) => {
    setLoad(true);
    setPage(1);
    dispatch(
      allSuggestionRequest({
        token,
        id: activeSecondaryTab,
        offset: 5,
        searchText: searchValue ? searchValue : null,
        to_city: cityToName ? cityToName.last_id : null,
        from_city: cityFromName ? cityFromName.last_id : null,
        type_container:
          data === "40 ST" || data === "20 (30)"
            ? 4
            : data === "20 (24)"
            ? 2
            : data === "40 HQ"
            ? 3
            : null,
      })
    )
      .unwrap()
      .then(() => setLoad(false));
  };

  useEffect(() => {
    cityToName && filteretData();
  }, [containerType, cityToName, cityToName]);

  const resetText = () => {
    setCitys(allCitys);
    setSearchValue("");
    setTypeContainer(null);
    setFromCityName(null);
    setToCityName(null);
  };

  const resetFiltered = () => {
    setPage(1);
    setSearchName("");
    setTypeContainer(null);
    setFromCityName(null);
    setToCityName(null);
    dispatch(
      allSuggestionRequest({ token, id: activeSecondaryTab, offset: 5 })
    );
  };

  const renderCitys = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setPage(1);
          setLoad(true);
          setSearchName(item.title.ru || item.title);
          dispatch(
            allSuggestionRequest({
              token,
              id: activeSecondaryTab,
              offset: 5,
              searchText: [item.last_id, item.last_id],
              to_city: cityToName ? cityToName.last_id : null,
              from_city: cityFromName ? cityFromName : null,
              type_container:
                containerType === "40 ST" || containerType === "20 (30)"
                  ? 4
                  : containerType === "20 (24)"
                  ? 2
                  : containerType === "40 HQ"
                  ? 3
                  : null,
            })
          )
            .unwrap()
            .then(() => {
              setSearchValue("");
              setCitys(allCitys);
              setLoad(false);
            });
        }}
      >
        <Text style={{ marginBottom: 8 }}>{item.title.ru || item.title}</Text>
      </TouchableOpacity>
    );
  };
  const headerComponent = () => {
    return (
      <View style={styles.header}>
        <NavBar
          tabs={tabs}
          activeTab={activeTab}
          onPress={(tab) => {
            setActiveTab(tab);
          }}
        />
        <NavBar
          tabs={secondaryTabs}
          activeTab={activeSecondaryTab}
          onPress={(tab) => {
            setCitys(allCitys);
            setSearchValue("");
            setPage(1);
            setOffset(5);
            setPage(1);
            setTypeContainer(null);
            setFromCityName(null);
            setToCityName(null);
            dispatch(allSuggestionRequest({ token, id: tab, offset: 5 }));
            setActiveSecondaryTab(tab);
          }}
          secondary
        />
        <View style={styles.searchRow}>
          <Search
            value={searchName}
            style={styles.search}
            searchText={searchValue}
            onSearchText={(val) => {
              setSearchValue(val);
            }}
            resetText={resetText}
          />
          <TouchableOpacity activeOpacity={0.2} onPress={filtered}>
            <Image source={SearchIcon} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.filtersRow}>
          <FilterItem
            isCitys
            offers
            title={cityFromName ? cityFromName : "Откуда"}
            options={citys}
            top={274}
            onSelect={(option) => {
              setFromCityName(option);
              filterFromCitys(option.last_id);
            }}
          />
          <FilterItem
            offers
            isCitys={false}
            title={containerType ? containerType : "Тип контейнера"}
            options={typeContainer}
            onSelect={(option) => {
              setTypeContainer(option);
              filterTypeContainer(option);
            }}
            top={274}
          />
          <FilterItem
            isCitys
            offers
            onSelect={(option) => {
              setToCityName(option);
              filterToCitys(option.last_id);
            }}
            title={cityToName ? cityToName : "Куда"}
            options={citys}
            top={274}
          />
        </View>
        {containerType || cityFromName || cityToName || searchName ? (
          <TouchableOpacity onPress={resetFiltered} style={styles.resetButton}>
            <Text style={styles.resetText}>Сброс x</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const nextPage = () => {
    setOffset(offset + 5);
    setPage(page + 1);
    dispatch(
      allSuggestionRequest({
        token,
        id: activeSecondaryTab,
        offset: offset + 5,
        searchText: searchValue ? searchValue : null,
        to_city: cityToName ? cityToName.last_id : null,
        from_city: cityFromName ? cityFromName.last_id : null,
        type_container:
          containerType === "40 ST" || containerType === "20 (30)"
            ? 4
            : containerType === "20 (24)"
            ? 2
            : containerType === "40 HQ"
            ? 3
            : null,
      })
    )
      .unwrap()
      .then((res) => setLikedList(res?.data.data.isLike));
  };

  const previusPage = () => {
    setOffset(offset - 5);
    setPage(page - 1);
    dispatch(
      allSuggestionRequest({
        token,
        id: activeSecondaryTab,
        offset: offset - 5,
        searchText: searchValue ? searchValue : null,
        to_city: cityToName ? cityToName.last_id : null,
        from_city: cityFromName ? cityFromName.last_id : null,
        type_container:
          containerType === "40 ST" || containerType === "20 (30)"
            ? 4
            : containerType === "20 (24)"
            ? 2
            : containerType === "40 HQ"
            ? 3
            : null,
      })
    )
      .unwrap()
      .then((res) => setLikedList(res?.data.data.isLike));
  };

  useEffect(() => {
    dispatch(allSuggestionRequest({ token, id: "Поиск КТК", offset }))
      .unwrap()
      .then((res) => {
        // console.log(res?.data.data.isLike,'res?.data.data.isLike');
        setLikedList(res?.data.data.isLike);
      });
  }, [token]);

  return (
    <>
      {loading && (
        <Modal backdropOpacity={0.75} isVisible={true}>
          <View>
            <ActivityIndicator size="large" />
          </View>
        </Modal>
      )}
      <Wrapper
        withoutScrollView
        withContainer
        header={{
          currentPage,
          home: true,
          navigation,
        }}
      >
        {searchValue ? (
          <View style={styles.searchModal}>
            <FlatList
              data={citys}
              keyExtractor={(item) => item.last_id}
              renderItem={renderCitys}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={20}
            />
          </View>
        ) : null}
        <SwipeListView
          data={data}
          renderItem={renderItem}
          ListHeaderComponent={headerComponent()}
          ListFooterComponent={() => {
            return data.length === 5 && activeTab !== "Избранное" ? (
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
                    disabled={page === 1 ? true : false}
                    onPress={previusPage}
                  >
                    <Entypo name="chevron-left" size={28} color={"gray"} />
                  </TouchableOpacity>
                </View>
                <View>
                  <View style={styles.pageCount}>
                    <Text style={styles.count}>{page}</Text>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    disabled={data.length === 5 ? false : true}
                    onPress={nextPage}
                  >
                    <Entypo name="chevron-right" size={28} color={"gray"} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null;
          }}
          ListEmptyComponent={() => {
            return <Text style={styles.empty}>ничего не найдено</Text>;
          }}
          renderHiddenItem={({ item }) => (
            <View style={styles.hiddenWrapper}>
              <TouchableOpacity
                style={styles.hiddenItem}
                onPress={() =>
                  navigation.navigate("SendOffer", {
                    currentPage: "Отправить предложение",
                    item,
                    id,
                  })
                }
              >
                <View style={styles.hiddenBlock}>
                  <ImageSend />
                  <View style={styles.hiddenItemTextBlock}>
                    <Text style={styles.hiddenItemText}>Отправить</Text>
                    <Text style={styles.hiddenItemText}>предложение</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-110}
          disableRightSwipe
          keyExtractor={(item) => item.last_id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          stickyHeaderIndices={[0]}
        />
        <View style={styles.fadeBlock}>
          <Image source={ImageFadePart} style={styles.fade} />
        </View>
      </Wrapper>
    </>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: WRAPPER_PADDINGS,
    marginTop: -20,
    position: "relative",
    zIndex: 9999,
  },
  count: {
    color: "white",
  },
  searchModal: {
    height: 300,
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 9,
    position: "absolute",
    // bottom: 0,
    top: 200,
    width: "90%",
    zIndex: 9999,
    flex: 1,
    padding: 16,
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
  search: {
    width: "90%",
  },
  filtersRow: {
    flexDirection: "row",
    paddingBottom: 10,
    paddingHorizontal: WRAPPER_PADDINGS,
  },
  item: {
    backgroundColor: COLOR_5,
    paddingVertical: 20,
    borderBottomColor: COLOR_6,
    borderBottomWidth: 1,
    paddingHorizontal: WRAPPER_PADDINGS,
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
    marginBottom: 6,
  },
  ratingBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: COLOR_9,
    fontSize: 10,
    fontFamily: "GothamProRegular",
    marginLeft: 5,
    marginRight: 15,
  },
  companyName: {
    color: COLOR_9,
    fontSize: 10,
    fontFamily: "GothamProRegular",
  },
  dateAdded: {
    color: COLOR_9,
    fontSize: 10,
    fontFamily: "GothamProRegular",
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
  header: {
    backgroundColor: COLOR_5,
  },
  fadeBlock: {
    height: "100%",
    width: WRAPPER_PADDINGS,
    position: "absolute",
    zIndex: 2,
    top: 200,
    left: 0,
  },
  fade: {
    width: "100%",
    height: "100%",
  },
  date: {
    position: "absolute",
    bottom: -40,
    right: 0,
    fontFamily: "GothamProRegular",
  },
  resetButton: {
    left: 25,
    bottom: -10,
    height: 30,
    width: 80,
    backgroundColor: COLOR_10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: {
    fontSize: 12,
    color: "red",
    fontFamily: "GothamProRegular",
  },
  empty: {
    fontSize: 22,
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    textAlign: "center",
    marginTop: 40,
  },
});

export default Offers;
