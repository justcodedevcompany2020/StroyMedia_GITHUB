import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../components/screens/Home";
import Help from "../components/screens/Help";
import Events from "../components/screens/Events";
import Messages from "../components/screens/Messages";
import MyApplications from "../components/screens/MyApplications";
import MyProfile from "../components/screens/MyProfile";
import Offers from "../components/screens/Offers";
import Participants from "../components/screens/Participants";
import Polls from "../components/screens/Polls";
import SingleParticipant from "../components/screens/SingleParticipant";
import SendOffer from "../components/screens/SendOffer";
import CreatingApplication from "../components/screens/CreatingApplication";
import EditApplication from "../components/screens/EditApplication";
import Chat from "../components/screens/Chat";
import TermsOfAgreement from "../components/screens/TermsOfAgreement";

const Stack = createNativeStackNavigator();

class MainNavigation extends React.Component {
  render() {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Help" component={Help} />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="Messages" component={Messages} />
          <Stack.Screen name="MyApplications" component={MyApplications} />
          <Stack.Screen name="MyProfile" component={MyProfile} />
          <Stack.Screen name="Offers" component={Offers} />
          <Stack.Screen name="Participants" component={Participants} />
          <Stack.Screen name="Polls" component={Polls} />
          <Stack.Screen
            name="SingleParticipant"
            component={SingleParticipant}
          />
          <Stack.Screen name="SendOffer" component={SendOffer} />
          <Stack.Screen
            name="CreatingApplication"
            component={CreatingApplication}
          />
          <Stack.Screen name="EditApplication" component={EditApplication} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="TermsOfAgreement" component={TermsOfAgreement} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default MainNavigation;
