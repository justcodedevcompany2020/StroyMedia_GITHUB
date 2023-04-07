import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Wrapper from "../helpers/Wrapper";
import { COLOR_1, COLOR_2, LOGIN_PAGE_PADDINGS } from "../helpers/Variables";
import MyInput from "../includes/MyInput";
import MyButton from "../includes/MyButton";
import RegistrationModal from "../includes/RegistrationModal";
import { ImageLogo } from "../helpers/images";
import ForgotPasswordModal from "../includes/ForgotPasswordModal";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../../store/reducers/loginSlice";
import {
  changeAnswerForgotPassword,
  forgotPasswordRequest,
} from "./../../store/reducers/forgotPasswordSlice";
import AnswerForgotPasswordModal from "../includes/AnswerForgotPasswordModal";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailForNewPassword, setEmailForNewPassword] = useState("");
  const [errors, setError] = useState("");
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const { error, loading } = state.loginSlice;
  const { success } = state.forgotPasswordSlice;

  const onLoginPress = () => {
    if (!login) {
      setLoginError("Заполните эту строку");
      if (!password) {
        setPasswordError("Заполните эту строку");
        return;
      }
      return;
    }
    if (!password) {
      setPasswordError("Заполните эту строку");
      return;
    }
    if (password && login) {
      dispatch(loginRequest({ login: login, password: password, auth: "api" }));
    }
  };

  const onLoginChange = (val) => {
    setLogin(val);
    if (loginError) setLoginError("");
  };

  const onPasswordChange = (val) => {
    setPassword(val);
    if (passwordError) setPasswordError("");
  };

  const submitEmailForNewPassword = () => {
    if (!emailForNewPassword.includes("@gmail.com")) {
      setError("Неверный Эл. адрес");
    } else {
      dispatch(forgotPasswordRequest({ email: emailForNewPassword }));
      setShowForgotPasswordModal(false);
      setEmailForNewPassword("");
      setError("");
    }
  };

  return (
    <Wrapper withImage withPaddings>
      <View style={styles.block}>
        <View style={styles.logoView}>
          <ImageLogo style={styles.logo} />
        </View>
        <MyInput
          label={"Логин"}
          autoCapitalize={"none"}
          value={login}
          error={[loginError]}
          onChangeText={(val) => onLoginChange(val)}
        />
        <MyInput
          label={"Пароль"}
          autoCapitalize={"none"}
          secureTextEntry={!showPassword}
          showEye={true}
          onChangeText={(val) => onPasswordChange(val)}
          style={!showPassword && styles.passwordInput}
          textContentType={"password"}
          value={password}
          error={[passwordError]}
          onEyePressed={() => setShowPassword(!showPassword)}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.buttonsView}>
          <MyButton onPress={onLoginPress} style={styles.loginButton}>
            {loading ? <ActivityIndicator color={COLOR_1} /> : "Войти"}
          </MyButton>
          <TouchableOpacity onPress={() => setShowForgotPasswordModal(true)}>
            <Text style={styles.smallButton}>Забыли пароль?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Text style={styles.smallButton}>Регистрация</Text>
          </TouchableOpacity>
          <RegistrationModal
            showModal={showModal}
            setShowModal={setShowModal}
          />
          <ForgotPasswordModal
            error={errors}
            isVisible={showForgotPasswordModal}
            onSubmit={submitEmailForNewPassword}
            value={emailForNewPassword}
            onChangeText={(val) => setEmailForNewPassword(val)}
            onCancel={() => {
              setShowForgotPasswordModal(false);
              setEmailForNewPassword("");
              setError("");
              return;
            }}
          />
          <AnswerForgotPasswordModal
            onSubmit={() => {
              dispatch(changeAnswerForgotPassword());
            }}
            isVisible={success}
          />
        </View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  block: {
    marginTop: (Dimensions.get("window").height * 20) / 100,
    paddingHorizontal: LOGIN_PAGE_PADDINGS,
  },
  logoView: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 32,
  },
  passwordInput: {
    color: COLOR_2,
    fontSize: 24,
    letterSpacing: 4,
    paddingTop: 0,
    paddingBottom: 0,
  },
  loginButton: {
    marginVertical: (Dimensions.get("window").height * 5) / 100,
  },
  buttonsView: {
    flexDirection: "column",
    alignItems: "center",
  },
  smallButton: {
    color: COLOR_1,
    marginBottom: 20,
  },
  error: {
    textAlign: "center",
    color: "red",
  },
});

export default Login;
