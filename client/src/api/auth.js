// auth api functions and their routes to communicate with the backend
import axios from "axios";
axios.defaults.withCredentials = true;

export async function onRegistration(registrationData) {
  return await axios.post(
    "http://localhost:8000/api/register",
    registrationData
  );
}

export async function onLogin(loginData) {
  return await axios.post("http://localhost:8000/api/login", loginData);
}

export async function onLogout() {
  return await axios.get("http://localhost:8000/api/logout");
}
 
export async function fetchProtectedInfo(){
    return await axios.get("http://localhost:8000/api/protected");
}

export async function fetchUserInfo(){
  return await axios.get("http://localhost:8000/api/get-user-info");
}
