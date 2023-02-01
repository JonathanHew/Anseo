import axios from "axios";
axios.defaults.withCredentials = true;

export async function fetchUserSessions(user_id) {
  return await axios.get("http://localhost:8000/api/get-sessions", {
    user_id: user_id,
  });
}

export async function onCreateSession(session_data) {
  return await axios.post(
    "http://localhost:8000/api/create-session",
    session_data
  );
}


export async function fetchStudentsInSession(id) {
  return await axios.post("http://localhost:8000/api/get-students-in-session", {
    session_id: id,
  });
}
