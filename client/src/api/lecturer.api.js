import axios from "axios";
axios.defaults.withCredentials = true;

export async function fetchUserSessions() {
  return await axios.get("http://localhost:8000/api/get-sessions", {
  });
}

export async function onCreateSession(name, id) {
  return await axios.post(
    "http://localhost:8000/api/create-session",{
      session_name: name,
      user_id: id,
    }
  );
}

export async function fetchStudentsInSession(id) {
  return await axios.post("http://localhost:8000/api/get-students-in-session", {
    session_id: id,
  });
}

export async function fetchSessionInfo(id) {
  return await axios.post("http://localhost:8000/api/get-session-info", {
    session_id: id,
  });
}

export async function onSetSessionStatus(id) {
  return await axios.post("http://localhost:8000/api/set-session-status", {
    session_id: id,
  });
}

export async function fetchSessionsForStudent(id) {
  return await axios.post("http://localhost:8000/api/search", {
    student_number: id,
  });
}

export async function onCreateModule(name, id) {
  return await axios.post(
    "http://localhost:8000/api/create-module",{
      module_name: name,
      user_id: id,
    }
  );
}

export async function fetchUserModules() {
  return await axios.get("http://localhost:8000/api/get-modules", {
  });
}