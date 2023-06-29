import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Wrapper from "../helpers/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../includes/NavBar";
import { Search } from "../includes/Search";
import FilterItem from "../includes/FilterItem";
import ParticipantItem from "../includes/ParticipantItem";
import {
  COLOR_1,
  COLOR_10,
  COLOR_3,
  WRAPPER_PADDINGS,
} from "../helpers/Variables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCitys } from "../../store/reducers/getCitysSlice";
import { Entypo } from "@expo/vector-icons";
import { getMembersReques } from "../../store/reducers/getMembersDataSlice";

const SearchIcon = require("../../assets/search.png");

function Participants({ route, navigation }) {
  const tabs = ["Все", "Избранное"];
  const [activeTab, setActiveTab] = useState("Все");
  const [searchValue, setSearchValue] = useState("");
  const [citys, setCitys] = useState([]);
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(null);
  const [cityId, setCityId] = useState();
  const [token, setToken] = useState();
  const [role, setRole] = useState("");
  const [cityName, setCityName] = useState("");
  // const [liked, setLiked] = useState(false);
  const state = useSelector((state) => state);
  const { data, favoriteList } = state.getMembersSlice;
  const { currentPage } = route.params;
  const dispatch = useDispatch();
  let liked = false;

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });

    dispatch(getCitys())
      .unwrap()
      .then((result) => {
        setCitys(result.data.data.citys);
      });
  }, [citys]);

  // useEffect(() => {
  //   dispatch(getMembersReques({ token }))
  //     .unwrap()
  //     .then((res) => {
  //       console.log(res?.data?.data?.isLike, "favoriteList");
  //       favoriteList = res?.data?.data?.isLike;
  //     });
  //   // setLikedList(favoriteList);
  // }, [success]);

  const resetText = () => {
    setSearchValue("");
    filtered("");
  };

  const resetFiltered = () => {
    setCityId(null);
    filtered("");
    setRole("");
    setCityName("");
  };

  const nextPage = () => {
    setOffset(offset + 5);
    setPage(page + 1);
    dispatch(
      getMembersReques({
        token,
        offset: offset + 5,
        city: cityId ? cityId : null,
        role: role ? role : null,
      })
    );
  };

  const previusPage = () => {
    setOffset(offset - 5);
    setPage(page - 1);
    dispatch(
      getMembersReques({
        token,
        offset: offset - 5,
        city: cityId ? cityId : null,
        role: role ? role : null,
      })
    );
  };

  const filtered = (id, role, companyName = null) => {
    setPage(1);
    setOffset(null);
    dispatch(
      getMembersReques({ token, offset: null, role, city: id, companyName })
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
        onPress={(tab) => {
          resetFiltered();
          setActiveTab(tab);
        }}
        tabs={tabs}
        activeTab={activeTab}
      />
      <View style={styles.wrapper}>
        <View style={styles.searchRow}>
          <Search
            style={styles.search}
            searchText={searchValue}
            onSearchText={(val) => {
              val === "" && resetFiltered();
              setSearchValue(val);
            }}
            resetText={resetText}
          />
          <TouchableOpacity
            activeOpacity={0.2}
            onPress={() => {
              filtered(cityId, role, searchValue);
              setSearchValue("");
            }}
          >
            <Image source={SearchIcon} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.filtersRow}>
          {activeTab === "Все" ? (
            <>
              <FilterItem
                isCitys={false}
                title={role ? role : "Профиль деятельности"}
                options={[
                  "Собственник КТК",
                  "Экспедитор-sender",
                  "Собственник ПС",
                  "Грузовладелец",
                  "Морская линия",
                  "Другое",
                ]}
                onSelect={(option) => {
                  setRole(option.title);
                  filtered(cityId, option.title, searchValue);
                  setSearchValue("");
                }}
              />
              <FilterItem
                isCitys
                title={cityName ? cityName : "Город"}
                options={citys}
                onSelect={(option) => {
                  setCityId(option?.last_id);
                  filtered(option.last_id, role, searchValue);
                  setCityName(option.title);
                  setSearchValue("");
                }}
              />
            </>
          ) : null}
        </View>
        {(role || cityName) && activeTab === "Все" ? (
          <TouchableOpacity onPress={resetFiltered} style={styles.resetButton}>
            <Text style={styles.resetText}>Сброс x</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        data={data}
        ListEmptyComponent={() => {
          return <Text style={styles.empty}>ничего не найдено</Text>;
        }}
        renderItem={({ item, index }) => {
          if (favoriteList[index] == "is_Favorite") {
            liked = true;
          } else if (favoriteList[index] == "not_Favorite") {
            liked = false;
          }
          return (
            <View
              style={{
                flex: 1,
                marginHorizontal: 20,
                justifyContent: "space-between",
              }}
            >
              <ParticipantItem
                likedList={liked}
                favorites={activeTab}
                imageUri={`https://teus.online/${item?.avatar}`}
                companyName={item?.name || item?.contact_person}
                city={item?.factadress ? item?.factadress : "нет данных"}
                doingProfile={item?.inn}
                navigation={navigation}
                id={item?.last_id}
              />
            </View>
          );
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {activeTab !== "Избранное" && data?.length === 5 ? (
          <>
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
          </>
        ) : null}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: WRAPPER_PADDINGS,
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
  searchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -20,
  },
  search: {
    width: "90%",
  },
  filtersRow: {
    flexDirection: "row",
  },
  resetButton: {
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

export default Participants;
