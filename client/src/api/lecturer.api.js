import axios from "axios";
axios.defaults.withCredentials = true;

export async function fetchUserSessions() {
  return await axios.get("http://localhost:8000/api/get-sessions", {});
}

export async function onCreateSession(name, module) {
  return await axios.post("http://localhost:8000/api/create-session", {
    session_name: name,
    module_id: module,
  });
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

export async function onCreateModule(name) {
  return await axios.post("http://localhost:8000/api/create-module", {
    module_name: name,
  });
}

export async function fetchUserModules() {
  return await axios.get("http://localhost:8000/api/get-modules", {});
}

export async function fetchModulesForStudent(number) {
  return await axios.post("http://localhost:8000/api/get-student-modules", {
    student_number: number,
  });
}

export async function fetchSignInsForStudentInModule(
  student_number,
  module_id
) {
  return await axios.post(
    "http://localhost:8000/api/get-student-signins-for-module",
    {
      student_number: student_number,
      module_id: module_id,
    }
  );
}

export async function fetchSessionsForModule(module_id) {
  return await axios.post("http://localhost:8000/api/get-sessions-in-module", {
    module_id: module_id,
  });
}

export async function fetchStudentModuleReportPieData(
  student_number,
  module_id
) {
  return await axios.post(
    "http://localhost:8000/api/get-student-module-pie-data",
    {
      student_number: student_number,
      module_id: module_id,
    }
  );
}

export async function fetchStudentModuleReportLineData(
  student_number,
  module_id
) {
  return await axios.post(
    "http://localhost:8000/api/get-student-module-line-data",
    {
      student_number: student_number,
      module_id: module_id,
    }
  );
}

export async function fetchModuleReportLineData(module_id) {
  return await axios.post("http://localhost:8000/api/get-module-line-data", {
    module_id: module_id,
  });
}

export async function fetchModuleReportBarData(module_id) {
  return await axios.post("http://localhost:8000/api/get-module-bar-data", {
    module_id: module_id,
  });
}

export async function fetchSessionReportChartData(session_id) {
  return await axios.post("http://localhost:8000/api/get-session-charts-data", {
    session_id: session_id,
  });
}

export async function fetchModuleInfo(module_id) {
  return await axios.post("http://localhost:8000/api/get-module-info", {
    module_id: module_id,
  });
}
