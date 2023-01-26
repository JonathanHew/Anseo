import axios from "axios";
axios.defaults.withCredentials = true;

export async function fetchUserSessions(user_id) {
    return await axios.get(
      "http://localhost:8000/api/get-sessions",
      {user_id: user_id}
    );
  }