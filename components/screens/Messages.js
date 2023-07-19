import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import Wrapper from "../helpers/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../includes/NavBar";
import {
  COLOR_1,
  COLOR_5,
  COLOR_6,
  WRAPPER_PADDINGS,
} from "../helpers/Variables";
import { SwipeListView } from "react-native-swipe-list-view";
import { ImageDelete, ImageFadePart } from "../helpers/images";
import { Search } from "../includes/Search";
import AddNew from "../includes/AddNew";
import ScrollableAccordionItem from "../includes/ScrollableAccordionItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { allDialogRequest } from "../../store/reducers/allDialogSlice";
import { authRequest } from "../../store/reducers/authUserSlice";
import { allChatForumRequest } from "../../store/reducers/forumChatAllSlice";
import { chatForumOrderRequest } from "../../store/reducers/orderForumChatSlice";
import SearchModal from "../includes/SearchModal";
import { deleteChatRequest } from "../../store/reducers/deleteChatSlice";
import { chatOrderRequest } from "../../store/reducers/chatDialogOrderSlice";

const SearchIcon = require("../../assets/search.png");

function Messages({ route, navigation }) {
  const [tabs, setTabs] = useState(["Диалоги", "Чаты"]);
  const [activeTab, setActiveTab] = useState("Диалоги");
  const [searchValue, setSearchValue] = useState("");
  const [expandedList, setExpandedList] = useState(false);
  const [token, setToken] = useState();
  const [visibleModal, setVisibleModal] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.allDialogSlice);
  // const forumChats = useSelector((state) => state.forumChatAllSlice.data);
  const { last_messages, isLoading } = useSelector(
    (state) => state.forumChatAllSlice
  );
  const [filteredData, setFilteredData] = useState([]);
  const [changed, setChanged] = useState(true);
  const serachResult = useSelector(
    (state) => state.searchChatMembersSlice.data
  );
  const success = useSelector((state) => state.searchChatMembersSlice.success);
  const searchMessages = serachResult;
  const { currentPage } = route.params;
  const [compName, setCompName] = useState("");
  const [userName, setUserName] = useState("");
  const [deletedId, setDeletedId] = useState([]);

  useEffect(() => {
    success && setVisibleModal(false);
    success && setCompName("");
    success && setUserName("");
  }, [success]);
  useEffect(() => {
    if (serachResult) {
      setVisibleModal(false);
    }
  }, [serachResult]);
  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      setToken(result);
      dispatch(authRequest({ secret_token: result }));
    });
  }, [navigation]);

  useEffect(() => {
    activeTab == "Диалоги"
      ? dispatch(allDialogRequest({ token: token })).then((res) => {
          setFilteredData(res.payload.data.users);
        })
      : dispatch(allChatForumRequest({ token: token })).then((res) => {
          setFilteredData(res.payload.data.data.contacts);
        });
  }, [token, activeTab]);

  const convertedArray = Object.keys(filteredData).map(function (key) {
    return filteredData[key];
  });

  const convertForumChatToArray = Object.keys(filteredData).map(function (key) {
    return filteredData[key];
  });

  const renderItem = ({ item, index }) => {
    return (
      <>
        {!deletedId.includes(item.last_id) && (
          <ScrollableAccordionItem
            item={item}
            last_messages={last_messages}
            index={index}
            expandedList={expandedList}
            id={item?.last_id}
            onArrowPress={() => {
              setExpandedList(!expandedList);
            }}
            expanded={expandedList}
            activeTab={activeTab}
            onPress={() => {
              activeTab === "Чаты"
                ? dispatch(
                    chatForumOrderRequest({
                      token: token,
                      id: item.last_id,
                    })
                  )
                    .unwrap()
                    .then(() => {
                      navigation.navigate("Chat", {
                        currentPage: "Чаты",
                        title: item?.title || item.description,
                        id: item.last_id,
                      });
                    })
                : dispatch(
                    chatOrderRequest({
                      token: token,
                      id: item.last_id,
                    })
                  )
                    .unwrap()
                    .then(() => {
                      navigation.navigate("DialogChat", {
                        currentPage: "Диалоги",
                        title: item?.title || item.description,
                        id: item.last_id,
                      });
                    });
            }}
          />
        )}
      </>
    );
  };

  useEffect(() => {
    setFilteredData(
      activeTab === "Чаты"
        ? convertForumChatToArray
        : searchMessages?.length
        ? searchMessages
        : Object.keys(filteredData).map((key) => {
            return filteredData[key];
          })
    );
  }, [filteredData.length, activeTab, searchMessages]);

  const filteredMessages = (searchText) => {
    activeTab === "Диалоги" &&
      !serachResult.length &&
      setFilteredData(
        convertedArray.filter((m) => {
          alert();
          return m?.name?.includes(searchText);
        })
      );
    activeTab === "Чаты" &&
      setFilteredData(
        convertForumChatToArray.filter((m) => {
          return m?.title?.includes(searchText);
        })
      );
    activeTab === "Диалоги" &&
      serachResult.length &&
      setFilteredData(
        searchMessages.filter((m) => {
          return m?.name?.includes(searchText);
        })
      );
  };

  const onClick = () => {
    setChanged(true);
  };

  // useEffect(() => {
  //   activeTab === "Диалоги" &&
  //     searchValue === "" &&
  //     dispatch(allDialogRequest({ token }));

  //   activeTab === "Чаты" &&
  //     searchValue === "" &&
  //     dispatch(allChatForumRequest({ token }));
  // }, [searchValue === ""]);

  const headerComponent = () => {
    return (
      <View style={styles.header}>
        <NavBar
          tabs={tabs}
          activeTab={activeTab}
          onPress={(tab) => {
            setChanged(tab === "Диалоги" ? true : false);
            setActiveTab(tab);
          }}
        />
        <View style={styles.searchRow}>
          <Search
            style={styles.search}
            searchText={searchValue}
            onSearchText={(val) => {
              val == ""
                ? setSearchValue("") && filteredMessages("")
                : setSearchValue(val);
            }}
            resetText={resetText}
          />
          <TouchableOpacity
            activeOpacity={0.2}
            onPress={() => {
              setChanged(false);
              filteredMessages(searchValue);
            }}
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

  const removeItem = (id) => {
    dispatch(
      deleteChatRequest({
        token,
        id,
      })
    );
    setFilteredData(
      filteredData.filter((data) => {
        return data.last_id !== id;
      })
    );
  };

  const resetText = () => {
    setSearchValue("");
    filteredMessages("");
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
      <View style={styles.wrapper}>
        <SwipeListView
          data={filteredData}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return <Text style={styles.empty}>ничего не найдено</Text>;
          }}
          ListHeaderComponent={headerComponent()}
          renderHiddenItem={({ item, index }) =>
            activeTab === "Диалоги" && (
              <View style={styles.hiddenWrapper}>
                <TouchableOpacity
                  style={styles.hiddenItem}
                  onPress={() =>
                    // setDeletedId((state) => [...state, item.last_id])
                    removeItem(item.last_id)
                  }
                >
                  <View style={styles.hiddenBlock}>
                    <ImageDelete />

                    <View style={styles.hiddenItemTextBlock}>
                      <Text style={styles.hiddenItemText}>Удалить</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }
          rightOpenValue={-100}
          disableRightSwipe
          keyExtractor={(item) => item.last_id}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          // onEndReachedThreshold={0}
        />
        <View style={styles.fadeBlock}>
          <Image source={ImageFadePart} style={styles.fade} />
        </View>

        <Modal visible={loading || isLoading} transparent>
          <View
            style={{
              backgroundColor: "#00000030",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={50} />
          </View>
        </Modal>

        {activeTab === "Диалоги" && (
          <AddNew onPress={() => setVisibleModal(true)} />
        )}
        <SearchModal
          isVisible={visibleModal}
          value={compName}
          onChangeText={(val) => setCompName(val)}
          onChangeName={(val) => setUserName(val)}
          name={userName}
          onCancel={() => {
            setCompName("");
            setUserName("");
            setVisibleModal(false);
          }}
          onClick={onClick}
        />
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
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
  hiddenWrapperBig: {
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
    paddingLeft: 14,
  },
  hiddenItemBig: {
    position: "absolute",
    top: 70,
    right: 28,
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
  search: {
    flex: 1,
    marginRight: 8,
  },
  empty: {
    fontSize: 22,
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    textAlign: "center",
    marginTop: 40,
  },
});

export default Messages;
