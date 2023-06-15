import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import Wrapper from "../helpers/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../includes/NavBar";
import MyInput from "../includes/MyInput";
import { COLOR_1, COLOR_10, COLOR_8, WRAPPER_PADDINGS, } from "../helpers/Variables";
import DatePicker from "../includes/DatePicker";
import AccordionItem from "../includes/AccordionItem";
import MyButton from "../includes/MyButton";
import BlockWithSwitchButton from "../includes/BlockWithSwitchButton";
import SelectDropdown from "react-native-select-dropdown";
import { getCitys } from "../../store/reducers/getCitysSlice";
import { sendCatRequest } from "../../store/reducers/sendCatSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authRequest } from "../../store/reducers/authUserSlice";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";
import Modal from "react-native-modal";
import DelayInput from "react-native-debounce-input";
import * as DocumentPicker from "expo-document-picker";

const container = [ "40 ST", "20 (30)", "20 (24)", "40 HQ" ];
const valuta = [ "₽", "€", "$" ];
const conditations = [ "Б/у", "Новый" ];
const typespay = [ "Любой вариант", "безналичный расчет", "наличный расчет" ];
const reestrized = [ "Любой исключен", "включен" ];

function CreatingApplication( {
  route,
  navigation
} ) {
  const [ secondaryTabs, setSecondaryTabs ] = useState( [
    "Продажа КТК", "Поиск КТК", "Выдача КТК", "Поездной сервис", "Заявка на ТЭО",
  ] );
  const [ activeSecondaryTab, setActiveSecondaryTab ] = useState( "Продажа КТК" );
  const [ whereFrom, setWhereFrom ] = useState( "" );
  const [ whereTo, setWhereTo ] = useState( "" );
  const [ containerCount, setContainerCount ] = useState( "" );
  const [ date, setDate ] = useState( new Date() );
  const [ comment, setComment ] = useState( "" );
  const [ price, setPrice ] = useState( "" );
  const [ token, setToken ] = useState( "" );
  const [ showDatePicker, setShowDatePicker ] = useState( "" );
  const [ currency, setCurrency ] = useState( "" );
  const [ saveAsDraft, setSaveAsDraft ] = useState( false );
  const [ whereToCount, setWhereToCount ] = useState( 1 );
  const [ termOfUse, setTermOfUse ] = useState( null );
  const [ from_city, setFrom_city ] = useState( "" );
  const [ to_city, setTo_city ] = useState( "" );
  const [ weight, setWeight ] = useState( "" );
  const [ citys, setCitys ] = useState( [] );
  const dispatch = useDispatch();
  const state = useSelector( state1 => state1 );
  const { user } = state.authUserSlice.data;
  const { currentPage } = route.params;
  const [ openCitys, setOpenCitys ] = useState( false );
  const [ openCitysFrom, setOpenCitysFrom ] = useState( false );
  const [ typeContainer, setTypeContiner ] = useState();
  const [ fromCityName, setFromCityName ] = useState( "" );
  const [ toCityName, setToCityName ] = useState( "" );
  const [ conditation, setConditation ] = useState( "" );
  const [ typePay, setTypePay ] = useState( "" );
  const [ restrict, setRestrict ] = useState( "" );
  const [ selectedImage, setSelectedImage ] = useState( "" );
  const [ fileName, setFileName ] = useState( "" );
  const [ fileType, setFileType ] = useState( "" );
  const [ searchValue, setSearchValue ] = useState( "" );
  const [ hash, setHash ] = useState( null );
  const [ loading, setLoading ] = useState( false );
  let allCitys = useSelector( ( state ) => state.getCitysSlice?.data?.data?.data?.citys );
  const DropDownRef = useRef( {} );
  const DrowDownTypeContainerRef = useRef( {} );
  //   const getFileSize = async (fileUri) => {
  //     let fileInfo = await FileSystem.getInfoAsync(fileUri);
  //     return fileInfo.size;
  //   };
  // const deleteSelectImage = (selectImage) => {
  //   /* @ts-ignore */
  //   const filteredList = selectedImage?.filter((item) => item !== selectImage);
  //   setSelectedImage(filteredList);
  // };

  function getImageFormat( str ) {
    const afterDot = str.substr( str.indexOf( "." ) + 1 );
    return afterDot;
  }


  const pickImage = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync( {
    //   mediaTypes : ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing : true,
    //   aspect : [ 1, 1 ],
    //   quality : 0,
    // } );

    // if( !result.canceled ) {
    //   setFileName( result.assets[ 0 ].uri.split( "/" )
    //     .pop() );
    //   setSelectedImage( result.assets[ 0 ].uri );
    // }


    let result = await DocumentPicker.getDocumentAsync( {
      type : [ "image/*", ]
    } );


    const {
      type,
      uri,
      mimeType,
      size,
      name
    } = result;


    if( size < 500000 ) {
      if( type === "success" ) {
        // getImageFormat( uri );
        // setFileName( uri.split( "/" )
        //   .pop() );
        setFileName( name );
        setSelectedImage( uri );
        setFileType( mimeType );
      }
    } else {
      showMessage( {
        type : "info",
        message : "Размер фото не должен превышать 5 МВ",
        color : "green"
      } );
    }
  };


  useEffect( () => {
    AsyncStorage.getItem( "token" )
      .then( ( result ) => {
        if( result ) {
          setToken( result );
          dispatch( authRequest( { secret_token : result } ) );
        }
      } );
  }, [ navigation, dispatch ] );

  const openCitysModal = () => {
    setOpenCitys( !openCitys );
  };

  const openCytysFromModal = () => {
    setOpenCitysFrom( !openCitysFrom );
  };
  // const compareData = {
  //   from_city,
  //   to_city,
  //   typeContainer : typeContainer,
  //   containerCount : containerCount,
  //   date,
  //   price : price,
  //   currency : currency,
  // };
  // const compareDataSales = {
  //   ...compareData,
  //   typePay : typePay,
  //   conditation : conditation,
  //   comment,
  //   selectedImage,
  //   restrict,
  //   to_city : "10",
  // };
  const compareData = {
    // from_city,
    // to_city,
    // typeContainer : typeContainer,
    // containerCount : containerCount,
    // date,
    // price : price,
    // currency : currency,


    activeSecondaryTab,
    typePay,
    conditation,
    restrict,
    currency,
    typeContainer,
    price,
    from_city,
    containerCount
  };
  const compareDataSales = {
    ...compareData,
    typePay : typePay,
    conditation : conditation,
    comment,
    selectedImage,
    restrict,
    to_city : "10",
  };
  const save = () => {
    let changed_tab = "";
    let payType = "";
    let new_or_used = "";
    let restrick = "";
    let price_type = "";
    let typeKTK = "";

    if( activeSecondaryTab == "Продажа КТК" ) {
      changed_tab = "5";
    } else if( activeSecondaryTab == "Поиск КТК" ) {
      changed_tab = "2";
    } else if( activeSecondaryTab == "Выдача КТК" ) {
      changed_tab = "3";
    } else if( activeSecondaryTab == "Поездной сервис" ) {
      changed_tab = "6";
    } else if( activeSecondaryTab == "Заявка на ТЭО" ) {
      changed_tab = "7";
    }

    if( typePay == "Любой вариант" ) {
      payType = "4";
    } else if( typePay == "безналичный расчет" ) {
      payType = "3";
    } else if( typePay == "наличный расчет" ) {
      payType = "2";
    }

    if( conditation == "Б/у" ) {
      new_or_used = "3";
    } else if( conditation == "Новый" ) {
      new_or_used = "2";
    }


    if( restrict == "Любой исключен" ) {
      restrick = "3";
    } else if( restrict == "включен" ) {
      restrick = "2";
    }

    if( currency == "₽" ) {
      price_type = "1";
    } else if( currency == "$" ) {
      price_type = "2";
    } else if( currency == "€" ) {
      price_type = "3";
    }

    if( typeContainer == "40 ST" ) {
      typeKTK = "4";
    } else if( typeContainer == "20 (30)" ) {
      typeKTK = "4";
    } else if( typeContainer == "40 HQ" ) {
      typeKTK = "3";
    } else if( typeContainer == "20 (24)" ) {
      typeKTK = "2";
    }

    var myHeaders = new Headers();
    var formdata = new FormData();

    myHeaders.append( "Content-Type", "multipart/form-data" );

    formdata.append( "secret_token", token );
    formdata.append( "last_id", changed_tab );
    formdata.append( "price", price );
    formdata.append( "dislokaciya", from_city );
    formdata.append( "condition", new_or_used );
    formdata.append( "description", comment );
    formdata.append( "typepay", payType );
    formdata.append( "reestrrzhd", restrick );
    formdata.append( "type_container", typeKTK );
    formdata.append( "currency", price_type );
    formdata.append( "responsible", user?.last_id );
    formdata.append( "img", selectedImage, // name : data.fileName,
      // type : data.fileType
    );
    formdata.append( "_type_op", saveAsDraft ? "draft" : "onwork" );


    setLoading( true );
    if( activeSecondaryTab == "Продажа КТК" ) {
      dispatch( sendCatRequest( {
        formdata,
        myHeaders,
        form_data
      } ) )
        .unwrap()
        .then( ( res ) => {
          setLoading( false );
          if( res?.success ) {
            navigation.goBack();
          }
        } )
        .catch( ( e ) => {
          setLoading( false );
          showMessage( {
            message : "Все поля должны быть заполнены",
            type : "danger",
          } );
        } );
    }
    // activeSecondaryTab === "Продажа КТК" && !_.every( Object.values( compareDataSales ) ) && showMessage( {
    //   message : "Все поля должны быть заполнены",
    //   type : "danger",
    // } );
    //
    // activeSecondaryTab !== "Продажа КТК" && !_.every( Object.values( compareData ) ) && showMessage( {
    //   message : "Все поля должны быть заполнены",
    //   type : "danger",
    // } );
    var form_data = new FormData();

    form_data.append( "secret_token", token );
    form_data.append( "last_id", changed_tab );
    form_data.append( "from_city", from_city );
    form_data.append( "to_city", to_city );
    form_data.append( "count", new_or_used );
    form_data.append( "date_shipment", date );
    form_data.append( "period", date );
    form_data.append( "price", price );
    form_data.append( "type_container", typeKTK );
    form_data.append( "currency", price_type );
    form_data.append( "responsible", user?.last_id );
    // form_data.append( "img", selectedImage, // name : data.fileName,
    form_data.append( "_type_op", saveAsDraft ? "draft" : "onwork" );

    activeSecondaryTab !== "Продажа КТК" && dispatch( sendCatRequest( {
      // secret_token : token,
      // last_id : changed_tab,
      // from_city : from_city,
      // to_city : to_city ,
      // count : containerCount + "",
      // date_shipment : date + "",
      // period : date + "",
      // price : price + "",
      // type_container : typeContainer,
      // currency : currency,
      // responsible : user?.last_id + "",
      // _type_op : saveAsDraft ? "draft" : "onwork",
      form_data,
      myHeaders,
    } ) )
      .unwrap()
      .then( ( e ) => {
        setLoading( false );
        navigation.goBack();
      } )
      .catch( ( e ) => {
        setLoading( false );
        showMessage( {
          message : "Все поля должны быть заполнены",
          type : "danger",
        } );
      } );
  };

  useEffect( () => {
    const getCytys = () => {
      dispatch( getCitys() )
        .unwrap()
        .then( ( result ) => {
          setCitys( result.data.data.citys );
        } );
    };
    getCytys();
  }, [] );


  useEffect( () => {
    (
      async () => {
        const status = ImagePicker.requestMediaLibraryPermissionsAsync();
        setHash( status === "granted" );
      }
    )();
  }, [] );

  const resetData = () => {
    setWhereFrom( "" );
    setWhereTo( "" );
    setContainerCount( "" );
    setComment( "" );
    setPrice( "" );
    setShowDatePicker( "" );
    setCurrency( "" );
    setSaveAsDraft( false );
    setWhereToCount( 1 );
    setTermOfUse( null );
    setWeight( "" );
    setFrom_city( "" );
    setTo_city( "" );
    setFromCityName( "" );
    setToCityName( "" );
    setTypeContiner( "" );
    DropDownRef?.current?.reset();
    DrowDownTypeContainerRef?.current?.reset();
    setOpenCitys( false );
    setOpenCitysFrom( false );
    setSearchValue( "" );
  };

  useEffect( () => {
    AsyncStorage.getItem( "token" )
      .then( ( result ) => {
        setToken( result );
        dispatch( authRequest( { secret_token : result } ) );
      } );
  }, [ dispatch, navigation ] );

  useEffect( () => {
    searchValue && filtered( searchValue );
  }, [ searchValue ] );

  const searchKTK = () => {
    return (
      <>
        <AccordionItem
          titleComponent={ <Text style={ styles.selectText }>
            { fromCityName ? fromCityName : "Откуда" }
          </Text> }
          wrapperStyle={ openCitys ? styles.openModal : styles.select }
          headerStyle={ styles.selectHeader }
          arrowStyle={ styles.selectArrowStyle }
          isopenModal={ openCitysModal }
        >
          <View style={ styles.citysSearch }>
            <DelayInput
              placeholder="Search"
              value={ searchValue }
              minLength={ 1 }
              onChangeText={ ( text ) => setSearchValue( text ) }
              delayTimeout={ 500 }
              style={ styles.searchInput }
            />
          </View>
          <FlatList
            data={ citys }
            keyExtractor={ ( item ) => item.last_id }
            nestedScrollEnabled={ true }
            scrollEnabled={ true }
            renderItem={ ( { item } ) => {
              return (
                <TouchableOpacity
                  onPress={ () => {
                    setFromCityName( item?.title?.ru || item.title );
                    setFrom_city( item.last_id );
                  } }
                >
                  <Text style={ { marginBottom : 8 } }>
                    { item.title.ru || item.title }
                  </Text>
                </TouchableOpacity>
              );
            } }
            maxToRenderPerBatch={ 10 }
            updateCellsBatchingPeriod={ 20 }
          />
        </AccordionItem>
        <AccordionItem
          titleComponent={ <Text style={ styles.selectText }>
            { toCityName ? toCityName : "Куда" }
          </Text> }
          wrapperStyle={ openCitysFrom ? styles.openModal : styles.select }
          headerStyle={ styles.selectHeader }
          arrowStyle={ styles.selectArrowStyle }
          isopenModal={ openCytysFromModal }
        >
          <View style={ styles.citysSearch }>
            <DelayInput
              placeholder="Search"
              value={ searchValue }
              minLength={ 1 }
              onChangeText={ ( text ) => setSearchValue( text ) }
              delayTimeout={ 500 }
              style={ styles.searchInput }
            />
          </View>
          <FlatList
            data={ citys }
            nestedScrollEnabled
            keyExtractor={ ( item ) => item.last_id }
            renderItem={ ( { item } ) => {
              return (
                <TouchableOpacity
                  onPress={ () => {
                    setToCityName( item?.title?.ru || item.title );
                    setTo_city( item.last_id );
                  } }
                >
                  <Text style={ { marginBottom : 8 } }>
                    { item.title.ru || item.title }
                  </Text>
                </TouchableOpacity>
              );
            } }
            maxToRenderPerBatch={ 10 }
            updateCellsBatchingPeriod={ 20 }
          />
        </AccordionItem>
        <View style={ styles.containerStyle }>
          <SelectDropdown
            searchInputStyle={ {
              borderColor : "black",
              borderWidth : 0.2,
              marginVertical : 10,
              height : 40,
            } }
            ref={ DrowDownTypeContainerRef }
            dropdownIconPosition="right"
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            defaultButtonText="Выберите тип контейнера"
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            // search
            data={ container }
            onSelect={ (
              selectedItem,
              index
            ) => {
              setTypeContiner( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
        <MyInput
          label={ "Количество контейнеров" }
          value={ containerCount }
          onChangeText={ ( val ) => setContainerCount( val ) }
          keyboardType={ "numeric" }
        />
        <DatePicker
          date={ date }
          setDate={ (
            event,
            date
          ) => {
            setShowDatePicker( false );
            return setDate( date );
          } }
        />
        <MyInput
          label={ "Ставка" }
          value={ price }
          onChangeText={ ( val ) => setPrice( val ) }
          keyboardType={ "numeric" }
        />
        <View style={ styles.containerStyle }>
          <SelectDropdown
            ref={ DropDownRef }
            defaultButtonText="Валюта"
            dropdownIconPosition="right"
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            data={ valuta }
            onSelect={ (
              selectedItem,
              index
            ) => {
              console.log( selectedItem );
              setCurrency( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
      </>
    );
  };

  const sellKTK = () => {
    return (
      <>
        <View style={ styles.containerStyle }>
          <SelectDropdown
            searchInputStyle={ {
              marginVertical : 10,
              height : 40,
            } }
            ref={ DrowDownTypeContainerRef }
            defaultButtonText="Выберите тип контейнера"
            dropdownIconPosition="right"
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            // search
            data={ container }
            onSelect={ (
              selectedItem,
              index
            ) => {
              setTypeContiner( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
        <MyInput
          label={ "Количество контейнеров" }
          value={ containerCount }
          onChangeText={ ( val ) => setContainerCount( val ) }
          keyboardType={ "numeric" }
        />
        <MyInput
          label={ "Цена" }
          value={ price }
          onChangeText={ ( val ) => setPrice( val ) }
          keyboardType={ "numeric" }
        />
        <View style={ styles.containerStyle }>
          <SelectDropdown
            ref={ DropDownRef }
            dropdownIconPosition="right"
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            defaultButtonText="Валюта"
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            data={ valuta }
            onSelect={ (
              selectedItem,
              index
            ) => {
              setCurrency( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
        <AccordionItem
          titleComponent={ <Text style={ styles.selectText }>
            { fromCityName ? fromCityName : "Город расположения" }
          </Text> }
          wrapperStyle={ openCitys ? styles.openModal : styles.select }
          headerStyle={ styles.selectHeader }
          arrowStyle={ styles.selectArrowStyle }
          isopenModal={ openCitysModal }
        >
          <View style={ styles.citysSearch }>
            <DelayInput
              placeholder="Search"
              value={ searchValue }
              minLength={ 1 }
              onChangeText={ ( text ) => setSearchValue( text ) }
              delayTimeout={ 500 }
              style={ styles.searchInput }
            />
          </View>
          <FlatList
            nestedScrollEnabled
            data={ citys }
            keyExtractor={ ( item ) => item.last_id }
            renderItem={ ( { item } ) => {
              return (
                <TouchableOpacity
                  onPress={ () => {
                    setFromCityName( item?.title?.ru || item.title );
                    setFrom_city( item.last_id );
                  } }
                >
                  <Text style={ { marginBottom : 8 } }>
                    { item.title.ru || item.title }
                  </Text>
                </TouchableOpacity>
              );
            } }
            maxToRenderPerBatch={ 10 }
            updateCellsBatchingPeriod={ 20 }
          />
        </AccordionItem>
        <View style={ styles.containerStyle }>
          <SelectDropdown
            searchInputStyle={ {
              borderColor : "black",
              borderWidth : 0.2,
              marginVertical : 10,
              height : 40,
            } }
            ref={ DropDownRef }
            dropdownIconPosition="right"
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            defaultButtonText="Состояние"
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            data={ conditations }
            onSelect={ (
              selectedItem,
              index
            ) => {
              setConditation( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
        <TouchableOpacity onPress={ pickImage }>
          <Text
            style={ {
              fontFamily : "GothamProRegular",
              color : COLOR_1,
              marginVertical : 40,
            } }
          >
            Добавить фото
          </Text>
        </TouchableOpacity>
        { selectedImage ? (
          <View>
            <Image source={ { uri : selectedImage } } style={ styles.imageStyle }/>
            <TouchableOpacity
              onPress={ () => setSelectedImage( "" ) }
              style={ styles.cancelImage }
            >
              <Text style={ { color : "red" } }>X</Text>
            </TouchableOpacity>
          </View>
        ) : null }
        <MyInput
          label={ "Описание" }
          value={ comment }
          onChangeText={ ( val ) => setComment( val ) }
          style={ styles.commentInput }
          multiline
        />
        <View style={ styles.containerStyle }>
          <SelectDropdown
            searchInputStyle={ {
              borderColor : "black",
              borderWidth : 0.2,
              marginVertical : 10,
              height : 40,
            } }
            ref={ DropDownRef }
            dropdownIconPosition="right"
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            defaultButtonText="Условия оплаты"
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            data={ typespay }
            onSelect={ (
              selectedItem,
              index
            ) => {
              setTypePay( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
        <View style={ styles.containerStyle }>
          <SelectDropdown
            searchInputStyle={ {
              borderColor : "black",
              borderWidth : 0.2,
              marginVertical : 10,
              height : 40,
            } }
            ref={ DropDownRef }
            dropdownIconPosition="right"
            defaultButtonText="Реестр РЖД"
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            data={ reestrized }
            onSelect={ (
              selectedItem,
              index
            ) => {
              setRestrict( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
      </>
    );
  };

  const extraditionKTK = () => {
    return (
      <>
        <AccordionItem
          titleComponent={ <Text style={ styles.selectText }>
            { fromCityName ? fromCityName : "Откуда" }
          </Text> }
          wrapperStyle={ openCitys ? styles.openModal : styles.select }
          headerStyle={ styles.selectHeader }
          arrowStyle={ styles.selectArrowStyle }
          isopenModal={ openCitysModal }
        >
          <View style={ styles.citysSearch }>
            <DelayInput
              placeholder="Search"
              value={ searchValue }
              minLength={ 1 }
              onChangeText={ ( text ) => setSearchValue( text ) }
              delayTimeout={ 500 }
              style={ styles.searchInput }
            />
          </View>
          <FlatList
            data={ citys }
            keyExtractor={ ( item ) => item.last_id }
            nestedScrollEnabled
            renderItem={ ( { item } ) => {
              return (
                <TouchableOpacity
                  onPress={ () => {
                    setFromCityName( item?.title?.ru || item.title );
                    setFrom_city( item.last_id );
                  } }
                >
                  <Text style={ { marginBottom : 8 } }>
                    { item.title.ru || item.title }
                  </Text>
                </TouchableOpacity>
              );
            } }
            maxToRenderPerBatch={ 10 }
            updateCellsBatchingPeriod={ 20 }
          />
        </AccordionItem>
        <AccordionItem
          titleComponent={ <Text style={ styles.selectText }>
            { toCityName ? toCityName : "Куда" }
          </Text> }
          wrapperStyle={ openCitysFrom ? styles.openModal : styles.select }
          headerStyle={ styles.selectHeader }
          arrowStyle={ styles.selectArrowStyle }
          isopenModal={ openCytysFromModal }
        >
          <View style={ styles.citysSearch }>
            <DelayInput
              placeholder="Search"
              value={ searchValue }
              minLength={ 1 }
              onChangeText={ ( text ) => setSearchValue( text ) }
              delayTimeout={ 500 }
              style={ styles.searchInput }
            />
          </View>
          <FlatList
            data={ citys }
            keyExtractor={ ( item ) => item.last_id }
            nestedScrollEnabled
            renderItem={ ( { item } ) => {
              return (
                <TouchableOpacity
                  onPress={ () => {
                    setToCityName( item?.title?.ru || item.title );
                    setTo_city( item.last_id );
                  } }
                >
                  <Text style={ { marginBottom : 8 } }>
                    { item.title.ru || item.title }
                  </Text>
                </TouchableOpacity>
              );
            } }
            maxToRenderPerBatch={ 10 }
            updateCellsBatchingPeriod={ 20 }
          />
        </AccordionItem>
        <View style={ styles.containerStyle }>
          <SelectDropdown
            searchInputStyle={ {
              borderColor : "black",
              borderWidth : 0.2,
              marginVertical : 10,
              height : 40,
            } }
            ref={ DrowDownTypeContainerRef }
            dropdownIconPosition="right"
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            defaultButtonText="Выберите тип контейнера"
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            data={ container }
            onSelect={ (
              selectedItem,
              index
            ) => {
              setTypeContiner( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
        <MyInput
          label={ "Количество контейнеров" }
          value={ containerCount }
          onChangeText={ ( val ) => setContainerCount( val ) }
          keyboardType={ "numeric" }
        />
        <DatePicker
          body="Cрок"
          date={ date }
          setDate={ (
            event,
            date
          ) => {
            setShowDatePicker( false );
            return setDate( date );
          } }
        />
        <MyInput
          label={ "Ставка" }
          value={ price }
          onChangeText={ ( val ) => setPrice( val ) }
          keyboardType={ "numeric" }
        />
        <View style={ styles.containerStyle }>
          <SelectDropdown
            ref={ DropDownRef }
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            dropdownIconPosition="right"
            defaultButtonText="Валюта"
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            data={ valuta }
            onSelect={ (
              selectedItem,
              index
            ) => {
              setCurrency( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
      </>
    );
  };

  const trainService = () => {
    return (
      <>
        <AccordionItem
          titleComponent={ <Text style={ styles.selectText }>
            { fromCityName ? fromCityName : "Откуда" }
          </Text> }
          wrapperStyle={ openCitys ? styles.openModal : styles.select }
          headerStyle={ styles.selectHeader }
          arrowStyle={ styles.selectArrowStyle }
          isopenModal={ openCitysModal }
        >
          <View style={ styles.citysSearch }>
            <DelayInput
              placeholder="Search"
              value={ searchValue }
              minLength={ 1 }
              onChangeText={ ( text ) => setSearchValue( text ) }
              delayTimeout={ 500 }
              style={ styles.searchInput }
            />
          </View>
          <FlatList
            data={ citys }
            keyExtractor={ ( item ) => item.last_id }
            nestedScrollEnabled
            renderItem={ ( { item } ) => {
              return (
                <TouchableOpacity
                  onPress={ () => {
                    setFromCityName( item?.title?.ru || item.title );
                    setFrom_city( item.last_id );
                  } }
                >
                  <Text style={ { marginBottom : 8 } }>
                    { item.title.ru || item.title }
                  </Text>
                </TouchableOpacity>
              );
            } }
            maxToRenderPerBatch={ 10 }
            updateCellsBatchingPeriod={ 20 }
          />
        </AccordionItem>
        <AccordionItem
          titleComponent={ <Text style={ styles.selectText }>
            { toCityName ? toCityName : "Куда" }
          </Text> }
          wrapperStyle={ openCitysFrom ? styles.openModal : styles.select }
          headerStyle={ styles.selectHeader }
          arrowStyle={ styles.selectArrowStyle }
          isopenModal={ openCytysFromModal }
        >
          <View style={ styles.citysSearch }>
            <DelayInput
              placeholder="Search"
              value={ searchValue }
              minLength={ 1 }
              onChangeText={ ( text ) => setSearchValue( text ) }
              delayTimeout={ 500 }
              style={ styles.searchInput }
            />
          </View>
          <FlatList
            data={ citys }
            keyExtractor={ ( item ) => item.last_id }
            nestedScrollEnabled
            renderItem={ ( { item } ) => {
              return (
                <TouchableOpacity
                  onPress={ () => {
                    setToCityName( item?.title?.ru || item.title );
                    setTo_city( item.last_id );
                  } }
                >
                  <Text style={ { marginBottom : 8 } }>
                    { item.title.ru || item.title }
                  </Text>
                </TouchableOpacity>
              );
            } }
            maxToRenderPerBatch={ 10 }
            updateCellsBatchingPeriod={ 20 }
          />
        </AccordionItem>
        <View style={ styles.containerStyle }>
          <SelectDropdown
            searchInputStyle={ {
              borderColor : "black",
              borderWidth : 0.2,
              marginVertical : 10,
              height : 40,
            } }
            ref={ DrowDownTypeContainerRef }
            dropdownIconPosition="right"
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            defaultButtonText="Выберите тип контейнера"
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            data={ container }
            onSelect={ (
              selectedItem,
              index
            ) => {
              setTypeContiner( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
        <MyInput
          label={ "Количество контейнеров" }
          value={ containerCount }
          onChangeText={ ( val ) => setContainerCount( val ) }
          keyboardType={ "numeric" }
        />
        <DatePicker
          body="Cрок"
          date={ date }
          setDate={ (
            event,
            date
          ) => {
            setShowDatePicker( false );
            return setDate( date );
          } }
        />
        <MyInput
          label={ "Ставка" }
          value={ price }
          onChangeText={ ( val ) => setPrice( val ) }
          keyboardType={ "numeric" }
        />
        <View style={ styles.containerStyle }>
          <SelectDropdown
            ref={ DropDownRef }
            defaultButtonText="Валюта"
            dropdownIconPosition="right"
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            data={ valuta }
            onSelect={ (
              selectedItem,
              index
            ) => {
              setCurrency( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
      </>
    );
  };

  const applicationOnTEO = () => {
    return (
      <>
        <AccordionItem
          titleComponent={ <Text style={ styles.selectText }>
            { fromCityName ? fromCityName : "Откуда" }
          </Text> }
          wrapperStyle={ openCitys ? styles.openModal : styles.select }
          headerStyle={ styles.selectHeader }
          arrowStyle={ styles.selectArrowStyle }
          isopenModal={ openCitysModal }
        >
          <View style={ styles.citysSearch }>
            <DelayInput
              placeholder="Search"
              value={ searchValue }
              minLength={ 1 }
              onChangeText={ ( text ) => setSearchValue( text ) }
              delayTimeout={ 500 }
              style={ styles.searchInput }
            />
          </View>
          <FlatList
            data={ citys }
            nestedScrollEnabled
            keyExtractor={ ( item ) => item.last_id }
            renderItem={ ( { item } ) => {
              return (
                <TouchableOpacity
                  onPress={ () => {
                    setFromCityName( item?.title?.ru || item.title );
                    setFrom_city( item.last_id );
                  } }
                >
                  <Text style={ { marginBottom : 8 } }>
                    { item.title.ru || item.title }
                  </Text>
                </TouchableOpacity>
              );
            } }
            maxToRenderPerBatch={ 10 }
            updateCellsBatchingPeriod={ 20 }
          />
        </AccordionItem>
        <AccordionItem
          titleComponent={ <Text style={ styles.selectText }>
            { toCityName ? toCityName : "Куда" }
          </Text> }
          wrapperStyle={ openCitysFrom ? styles.openModal : styles.select }
          headerStyle={ styles.selectHeader }
          arrowStyle={ styles.selectArrowStyle }
          isopenModal={ openCytysFromModal }
        >
          <View style={ styles.citysSearch }>
            <DelayInput
              placeholder="Search"
              value={ searchValue }
              minLength={ 1 }
              onChangeText={ ( text ) => setSearchValue( text ) }
              delayTimeout={ 500 }
              style={ styles.searchInput }
            />
          </View>

          <FlatList
            data={ citys }
            scrollEnabled
            // style={{ zIndex: 10 }}
            nestedScrollEnabled
            keyExtractor={ ( item ) => item.last_id }
            renderItem={ ( { item } ) => {
              return (
                <TouchableOpacity
                  onPress={ () => {
                    setToCityName( item?.title?.ru || item.title );
                    setTo_city( item.last_id );
                  } }
                >
                  <Text style={ { marginBottom : 8 } }>
                    { item.title.ru || item.title }
                  </Text>
                </TouchableOpacity>
              );
            } }
            maxToRenderPerBatch={ 10 }
            updateCellsBatchingPeriod={ 20 }
          />
        </AccordionItem>
        <View style={ styles.containerStyle }>
          <SelectDropdown
            searchInputStyle={ {
              borderColor : "black",
              borderWidth : 0.2,
              marginVertical : 10,
              height : 40,
            } }
            ref={ DrowDownTypeContainerRef }
            dropdownIconPosition="right"
            renderDropdownIcon={ () => {
              return (
                <Entypo name="chevron-small-down" size={ 32 } color={ COLOR_1 }/>
              );
            } }
            defaultButtonText="Выберите тип контейнера"
            buttonTextStyle={ {
              color : COLOR_1,
              fontSize : 14,
              textAlign : "left",
            } }
            buttonStyle={ {
              height : 40,
              width : "100%",
              borderRadius : 8
            } }
            data={ container }
            onSelect={ (
              selectedItem,
              index
            ) => {
              setTypeContiner( selectedItem );
            } }
            rowStyle={ {
              flex : 1,
              justifyContent : "space-between",
              backgroundColor : "white",
              borderBottomColor : "white",
            } }
            rowTextStyle={ {
              textAlign : "left",
              fontSize : 16,
            } }
          />
        </View>
        <MyInput
          label={ "Количество контейнеров" }
          value={ containerCount }
          onChangeText={ ( val ) => setContainerCount( val ) }
          keyboardType={ "numeric" }
        />
        <DatePicker
          body="Cрок"
          date={ date }
          setDate={ (
            event,
            date
          ) => {
            setShowDatePicker( false );
            return setDate( date );
          } }
        />
        <MyInput
          label={ "Груз" }
          value={ weight }
          onChangeText={ ( val ) => setWeight( val ) }
        />
        <MyInput
          label={ "Комментарий" }
          value={ comment }
          onChangeText={ ( val ) => setComment( val ) }
          style={ styles.commentInput }
          multiline
        />
      </>
    );
  };

  const filtered = ( searchText ) => {
    setCitys( allCitys?.filter( ( c ) => {
      return c?.title?.ru?.includes( searchText );
    } ) );
  };

  return (
    <Wrapper
      withContainer
      header={ {
        currentPage,
        home : false,
        navigation,
        onSavePress : save,
      } }
    >
      <NavBar
        tabs={ secondaryTabs }
        activeTab={ activeSecondaryTab }
        onPress={ ( tab ) => {
          resetData();
          setActiveSecondaryTab( tab );
        } }
        secondary
      />
      <View style={ styles.wrapper }>
        { activeSecondaryTab === "Поиск КТК" ? searchKTK() : activeSecondaryTab === "Продажа КТК" ? sellKTK() : activeSecondaryTab === "Выдача КТК" ? extraditionKTK() : activeSecondaryTab === "Поездной сервис" ? trainService() : activeSecondaryTab === "Заявка на ТЭО" ? applicationOnTEO() : null }
        <BlockWithSwitchButton
          title={ "Сохранить как черновик" }
          titleStyle={ styles.selectText }
          onToggle={ ( val ) => setSaveAsDraft( val ) }
          isOn={ saveAsDraft }
        />
        <MyButton onPress={ save } style={ styles.button }>
          Разместить
        </MyButton>
      </View>
      { loading && (
        <Modal backdropOpacity={ 0.75 } isVisible={ true }>
          <View>
            <ActivityIndicator size="large"/>
          </View>
        </Modal>
      ) }
    </Wrapper>
  );
}

const styles = StyleSheet.create( {
  wrapper : {
    paddingHorizontal : WRAPPER_PADDINGS,
  },
  containerStyle : {
    marginBottom : 20,
    backgroundColor : COLOR_10,
    borderRadius : 6,
    height : 46,
    borderTopColor : "transparent",
    borderTopWidth : 1,
  },
  openModal : {
    height : 200,
    marginBottom : 100,
  },
  commentInput : {
    height : undefined,
    color : COLOR_8,
    fontSize : 14,
    fontFamily : "GothamProRegular",
  },
  select : {
    backgroundColor : COLOR_10,
    borderRadius : 10,
    marginBottom : 20,
  },
  selectText : {
    color : COLOR_1,
    fontSize : 12,
    fontFamily : "GothamProMedium",
  },
  selectHeader : {
    borderBottomWidth : 0,
    paddingHorizontal : 10,
    paddingVertical : 18,
  },

  selectArrowStyle : {
    top : 20,
    right : 14,
  },
  button : {
    alignSelf : "center",
    marginTop : 20,
    marginBottom : 20,
  },
  imageStyle : {
    width : 50,
    height : 50,
    borderRadius : 5,
    marginHorizontal : 5,
  },
  cancelImage : {
    color : "red",
    marginLeft : 5,
  },
  citysSearch : {
    flexDirection : "row",
    alignItems : "center",
  },
  searchInput : {
    flex : 1,
    borderWidth : 0.5,
    borderColor : COLOR_1,
    borderRadius : 5,
    height : 30,
    marginBottom : 8,
    padding : 5,
    marginRight : 8,
  },
} );

export default CreatingApplication;
