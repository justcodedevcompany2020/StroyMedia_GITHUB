import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Platform,
} from "react-native";
import Wrapper from "../helpers/Wrapper";
import HelpFooter from "../includes/HelpFooter";
import AccordionItem from "../includes/AccordionItem";
import { COLOR_1, COLOR_6, WRAPPER_PADDINGS } from "../helpers/Variables";
import { ImageArrowRight } from "../helpers/images";
import { useDispatch, useSelector } from "react-redux";
import RenderHtml from "react-native-render-html";
import { getHelpsQueryRequest } from "../../store/reducers/getHelpsQuestionsSlice";
function Help(props) {
  const { navigation, route } = props;
  const { currentPage } = route.params;
  const { width } = useWindowDimensions();
  const regex = /(<([^>]+)>)/gi;
  const simvolRegexp = /&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6})/;
  const spacesRegex = /&(nbsp|amp|quot|lt|gt|);/g;
  const { data } = useSelector((state) => state.getHelpsQuestionsSlice);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHelpsQueryRequest());
  }, []);
  return (
    <Wrapper
      withContainer
      header={{
        currentPage,
        home: true,
        navigation,
      }}
      footer={<HelpFooter />}
    >
      <View style={styles.wrapper}>
        {data.map((d) => (
          <AccordionItem
            key={new Date() + Math.random()}
            headerStyle={styles.headerStyle}
            arrowStyle={styles.arrowStyle}
            titleComponent={<Text style={styles.header}>{d?.title}</Text>}
          >
            <Text style={styles.text}>
              {Platform.OS === "ios" ? (
                <RenderHtml contentWidth={width} source={{ html: d.short }} />
              ) : (
                d?.short
                  ?.replace(regex, "")
                  .replace(simvolRegexp, " ")
                  .replace(spacesRegex, "")
                  .replace(/[&\/\\#,+()$~%.'":*?<>{};]/g,'')
                  .trim()
              )}
            </Text>
          </AccordionItem>
        ))}
        <AccordionItem
          wrapperStyle={styles.wrapperStyle}
          headerStyle={{ ...styles.headerStyle, borderBottomWidth: 0 }}
          arrowStyle={styles.arrowStyle}
          arrowComponent={<ImageArrowRight style={styles.arrowRight} />}
          titleComponent={
            <Text style={styles.header}>Пользовательское соглашение</Text>
          }
          onPress={() => {
            navigation.navigate("TermsOfAgreement", {
              currentPage: "Польз.-ское соглашение",
            });
          }}
        />
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: WRAPPER_PADDINGS,
  },
  text: {
    fontSize: 11,
    fontFamily: "GothamProRegular",
    lineHeight: 14,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_6,
    paddingBottom: 20,
  },
  arrowRight: {
    marginRight: 3,
  },
  header: {
    fontSize: 12,
    fontFamily: "GothamProMedium",
    color: COLOR_1,
  },
  headerStyle: {
    paddingVertical: 18,
    paddingRight: 20,
  },
  arrowStyle: {
    top: 20,
  },
});

export default Help;
