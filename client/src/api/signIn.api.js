import { serverURL } from "../constants";
import axios from "axios";

export async function onSignIn(signInData) {
  return await axios.post(`${serverURL}/api/sign-in`, signInData);
}

export async function onPinSubmit(pin) {
  return await axios.post(`${serverURL}/api/pin`, {
    session_pin: pin
  });
}
