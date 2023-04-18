// auth api functions and their routes to communicate with the backend
import { serverURL } from "../constants";
import axios from "axios";
axios.defaults.withCredentials = true;

export async function onRegistration(registrationData) {
  return await axios.post(`${serverURL}/api/register`, registrationData);
}

export async function onLogin(loginData) {
  return await axios.post(`${serverURL}/api/login`, loginData);
}

export async function onLogout() {
  return await axios.get(`${serverURL}/api/logout`);
}

export async function fetchProtectedInfo() {
  return await axios.get(`${serverURL}/api/protected`);
}

export async function fetchUserInfo() {
  return await axios.get(`${serverURL}/api/get-user-info`);
}
