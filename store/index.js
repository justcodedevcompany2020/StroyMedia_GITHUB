import {
  configureStore,
  combineReducers,
  createImmutableStateInvariantMiddleware,
} from "@reduxjs/toolkit";
import loginSlice from "./reducers/loginSlice";
import authUserSlice from "./reducers/authUserSlice";
import getCitysSlice from "./reducers/getCitysSlice";
import getCountrysSlice from "./reducers/getCountrysSlice";
import deleteUserSlice from "./reducers/deleteUserSlice";
import addFavoriteDataSlice from "./reducers/addFavoriteDataSlice";
import editUserDataSlice from "./reducers/editUserDataSlice";
import getMembersSlice from "./reducers/getMembersDataSlice";
import globalMessageSlice from "./reducers/globalMessageSlice";
import globalNotificationSlice from "./reducers/globalNotificationSlice";
import hideUserDataSlice from "./reducers/hideUserDataSlice";
import membersSingleSlice from "./reducers/membersSingleSlice";
import offerMessageSlice from "./reducers/offerMessageSlice";
import offerNotificationSlice from "./reducers/offerNotificationSlice";
import personalMessageSlice from "./reducers/personalMessageSlice";
import personalNotificationSlice from "./reducers/personalNotificationSlice";
import allCatSlice from "./reducers/allCatSlice";
import projectReview from "./reducers/projectReview";
import sendCatSlice from "./reducers/sendCatSlice";
import getAllNotificationsSlice from "./reducers/getAllNotificationsSlice";
import getAllProjectReviews from "./reducers/getAllProjectReviews";
import getEventsSlice from "./reducers/getEventsAllSlice";
import getAllSuggestionsSlice from "./reducers/getAllSuggestionsSlice";
import liklyCatSlice from "./reducers/liklyCatSlice";
import allDialogSlice from "./reducers/allDialogSlice";
import checkChatExistSlice from "./reducers/checkChatExistSlice";
import getAllPolsSlice from "./reducers/getAllPolsSlice";
import sendAnswerPollsSlice from "./reducers/sendAnswerPollsSlice";
import getHelpsQuestionsSlice from "./reducers/getHelpsQuestionsSlice";
import checkLikliSlice from "./reducers/checkLikliSlice";
import checkLiklyOfferSlice from "./reducers/checkOfferLiklySlice";
import checkEventsLikeSlice from "./reducers/checkEventsLikeSlice";
import likeEventsPostSlice from "./reducers/likeEventsPostSlice";
import chatDialogOrderSlice from "./reducers/chatDialogOrderSlice";
import sendMessageSlice from "./reducers/sendMessageSlice";
import forumChatAllSlice from "./reducers/forumChatAllSlice";
import orderForumChatSlice from "./reducers/orderForumChatSlice";
import sendForumMessageSlice from "./reducers/sendForumMessageSlice";
import searchChatMembersSlice from "./reducers/searchChatMembersSlice";
import workRequestSlice from "./reducers/workRequestSlice";
import editAplicationsSlice from "./reducers/editAplicationsSlice";
import deleteChatSlice from "./reducers/deleteChatSlice";
import forgotPasswordSlice from "./reducers/forgotPasswordSlice";
const RootReducer = combineReducers({
  loginSlice,
  getCountrysSlice,
  getCitysSlice,
  authUserSlice,
  deleteUserSlice,
  addFavoriteDataSlice,
  getMembersSlice,
  editUserDataSlice,
  globalMessageSlice,
  globalNotificationSlice,
  hideUserDataSlice,
  membersSingleSlice,
  offerMessageSlice,
  offerNotificationSlice,
  personalMessageSlice,
  personalNotificationSlice,
  projectReview,
  allCatSlice,
  sendCatSlice,
  getAllProjectReviews,
  getAllNotificationsSlice,
  getEventsSlice,
  getAllSuggestionsSlice,
  liklyCatSlice,
  allDialogSlice,
  checkChatExistSlice,
  getAllPolsSlice,
  sendAnswerPollsSlice,
  getHelpsQuestionsSlice,
  checkLikliSlice,
  checkLiklyOfferSlice,
  likeEventsPostSlice,
  checkEventsLikeSlice,
  chatDialogOrderSlice,
  sendMessageSlice,
  forumChatAllSlice,
  orderForumChatSlice,
  sendForumMessageSlice,
  searchChatMembersSlice,
  workRequestSlice,
  editAplicationsSlice,
  deleteChatSlice,
  forgotPasswordSlice,
});

const configureCustomStore = () => {
  const store = configureStore({
    reducer: RootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: {
          ignoredPaths: [
            "ignoredPath",
            "ignoredNested.one",
            "ignoredNested.two",
          ],
        },
        serializableCheck: false,
      }),
  });
  return { store };
};

export const { store } = configureCustomStore();
