import axios from "axios";

export async function onSignIn(signInData) {
    return await axios.post(
      "http://localhost:8000/api/sign-in",
      signInData
    );
  }