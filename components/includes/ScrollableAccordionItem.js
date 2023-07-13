import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLOR_1, COLOR_5, COLOR_6, COLOR_9, WRAPPER_PADDINGS, } from "../helpers/Variables";
import { ImageArrowDown, ImageArrowUp } from "../helpers/images";
import { useDispatch } from "react-redux";
import { allDialogRequest } from "../../store/reducers/allDialogSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { authRequest } from "../../store/reducers/authUserSlice";

function ScrollableAccordionItem( {
  children,
  onPress,
  arrowComponent,
  wrapperStyle,
  headerStyle,
  arrowStyle,
  childrenStyle,
  item,
  expanded,
  activeTab,
  last_messages,
  index
} ) {
  const dispatch = useDispatch();
  const [ userLastMessage, setUserLastMessage ] = useState();
  const [ openLastMessage, setOpenLastMessage ] = useState( false );
  const [ token, setToken ] = useState();

  // useEffect(() => {
  //   activeTab === "Чаты" &&
  //     dispatch(chatForumOrderRequest({ token: token, id: item.last_id }))
  //       .unwrap()
  //       .then((result) => {
  //         setlastMessage(result.data.data.messages);
  //       });

  //   dispatch(chatOrderRequest({ token: token, id: item.last_id }))
  //     .unwrap()
  //     .then((result) => {
  //       setlastMessage(result.data.data.messages);
  //     });
  //   const lastMessage =
  //     activeTab === "Чаты"
  //       ? _.filter(
  //           forumMessage,
  //           (item) => item?.user?.last_id !== user?.last_id
  //         )
  //       : _.filter(messages, (item) => item?.from?.last_id !== user?.last_id);
  //   setUserLastMessage(lastMessage.reverse()[0]?.comment);
  // }, [token, dispatch, item, activeTab, lastMessages]);

  const date = +item?.date_create?.$date?.$numberLong;
  useEffect( () => {
    AsyncStorage.getItem( "token" ).then( ( result ) => {
      // dispatch( allDialogRequest( { token : result } ) );
      dispatch( authRequest( { secret_token : result } ) );
      setToken( result );
    } );
  }, [] );


  return (
    <View style={ [ styles.wrapper, wrapperStyle ] }>
      <TouchableOpacity
        style={ [ styles.header, !expanded && styles.headerBorder, headerStyle ] }
        onPress={ onPress }
        activeOpacity={ 0.5 }
      >
        <View style={ styles.item }>
          <Image
            style={ styles.photo }
            source={ {
              uri : activeTab === "Чаты" ? "https://teus.online" + item?.developer?.avatar_person : "https://teus.online" + item.avatar,
            } }
          />
          <View style={ styles.block }>
            <View style={ styles.row }>
              <View style={ styles.nameRow }>
                <Text style={ styles.personName }>
                  { activeTab === "Чаты" ? item?.developer?.contact_person : item.contact_person }
                </Text>
                <Text style={ styles.companyName }>
                  { activeTab === "Чаты" ? item?.developer?.name : item?.name?.slice( 0, 10 ) }
                </Text>
              </View>
              <Text style={ styles.time }>
                { activeTab === "Чаты" ? moment( date ).format( "HH-MM" ) : "15:36" }
              </Text>
            </View>
            <Text
              style={ styles.chatName }
              ellipsizeMode={ "tail" }
              numberOfLines={ 1 }
            >
              { activeTab === "Чаты" ? item.title : item.description }
            </Text>

            { openLastMessage && (
              <Text
                style={ styles.expandedText }
                ellipsizeMode={ "tail" }
                numberOfLines={ 4 }
              >
                { activeTab == "Диалоги" ? item?.last_message : last_messages[ index ] }
              </Text>
            ) }

            <Text
              style={ styles.lastMessage }
              ellipsizeMode={ "tail" }
              numberOfLines={ 1 }
            >
              { activeTab == "Диалоги" ? item?.last_message : last_messages[ index ] }
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={ [ styles.arrowView, arrowStyle ] }
          onPress={ () => setOpenLastMessage( !openLastMessage ) }
        >
          { arrowComponent ? (
            arrowComponent
          ) : openLastMessage ? (
            <ImageArrowUp/>
          ) : (
            <ImageArrowDown/>
          ) }
        </TouchableOpacity>
      </TouchableOpacity>
      { expanded && (
        <View style={ [ styles.children, childrenStyle ] }>{ children }</View>
      ) }
    </View>
  );
}

const styles = StyleSheet.create( {
  wrapper : {
    backgroundColor : COLOR_5,
  },
  header : {},
  headerBorder : {},
  arrowView : {
    position : "absolute",
    right : 2,
    top : 10,
    paddingVertical : 30,
    paddingHorizontal : 30,
  },
  children : {},
  expandedText : {
    color : COLOR_9,
    fontSize : 9,
    fontFamily : "GothamProRegular",
    lineHeight : 11,
    marginVertical : 10,
    marginLeft : 10,
  },
  item : {
    backgroundColor : COLOR_5,
    paddingVertical : 20,
    borderBottomColor : COLOR_6,
    borderBottomWidth : 1,
    paddingHorizontal : WRAPPER_PADDINGS,
    flexDirection : "row",
    alignItems : "center",
  },
  row : {
    flexDirection : "row",
    alignItems : "center",
    marginBottom : 6,
    justifyContent : "space-between",
  },
  photo : {
    width : 50,
    height : 50,
    borderRadius : 50,
    marginRight : 10,
  },
  block : {
    flex : 1,
  },
  personName : {
    fontSize : 10,
    fontFamily : "GothamProRegular",
    color : COLOR_1,
    marginRight : 6,
  },
  companyName : {
    fontSize : 10,
    fontFamily : "GothamProRegular",
    color : COLOR_9,
  },
  time : {
    fontSize : 10,
    fontFamily : "GothamProRegular",
    color : COLOR_9,
  },
  chatName : {
    fontSize : 10,
    fontFamily : "GothamProMedium",
    color : COLOR_1,
    marginBottom : 6,
    width : "90%",
  },
  lastMessage : {
    fontSize : 9,
    fontFamily : "GothamProRegular",
    color : COLOR_9,
  },
  messageAuthor : {
    fontSize : 10,
    fontFamily : "GothamProMedium",
    color : COLOR_9,
  },
  nameRow : {
    flexDirection : "row",
  },
} );

export default ScrollableAccordionItem;
