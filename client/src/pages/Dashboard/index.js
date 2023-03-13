import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { NavLink } from "react-router-dom";
import { fetchDashboardData, fetchUserModules, fetchUserSessions } from "../../api/lecturer.api";
import CreateSession from "../../components/CreateSession";
import CreateModule from "../../components/CreateModule";
import SessionList from "../../components/SessionList";
import "./style.css";
import {
  faChartLine,
  faUsersViewfinder,
  faGraduationCap
} from "@fortawesome/free-solid-svg-icons";

import {
  faCalendarCheck
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [modules, setModules] = useState([]);
  const [activeCount, setActiveCount ] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [moduleCount, setModuleCount] = useState(0);
  const [signinCount, setSigninCount] = useState(0);

  useEffect(() => {
    (async () => {
      const sessionContent = await fetchUserSessions();
      setSessions(sessionContent.data.sessions);
      const moduleContent = await fetchUserModules();
      setModules(moduleContent.data.modules);
      const dashboardContent = await fetchDashboardData();
      setActiveCount(dashboardContent.data.activeSessions);
      setStudentCount(dashboardContent.data.studentCount);
      setModuleCount(dashboardContent.data.moduleCount);
      setSigninCount(dashboardContent.data.signinCount);

      setLoading(false);
    })();
  }, []);

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        <h1 className="text-center">Dashboard</h1>
        <div className="w-75 m-auto">
          <div class="row text-center mt-5">
            <div class="col-sm-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Active Sessions</h5>
                  <div id="block">
                    <FontAwesomeIcon icon={faChartLine} size="3x" />

                    <span className="card-text ms-1" style={{ fontSize: "50px" }}>
                      {activeCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-6 ">
              <div class="card ">
                <div class="card-body">
                  <h5 class="card-title">Students</h5>
                  <div id="block">
                    <FontAwesomeIcon icon={faGraduationCap} size="3x" />

                    <span className="card-text ms-1" style={{ fontSize: "50px" }}>
                      {studentCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row text-center mt-3">
            <div class="col-sm-6">
              <div class="card  ">
                <div class="card-body">
                  <h5 class="card-title">Modules</h5>
                  <div id="block">
                    <FontAwesomeIcon icon={faUsersViewfinder} size="3x" />

                    <span className="card-text ms-1" style={{ fontSize: "50px" }}>
                      {moduleCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Sign Ins</h5>
                  <div id="block">
                    <FontAwesomeIcon icon={faCalendarCheck} size="3x" />

                    <span className="card-text ms-1" style={{ fontSize: "50px" }}>
                      {signinCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card w-100 m-auto mt-5">
          <div class="card-body">
            <div className="container">
              <div className="row">
                <div className="col-9">
                  <h2 className="ms-3">My Sessions</h2>
                </div>
                <div className="col-3">
                  <CreateSession modules={modules} />
                  <CreateModule />
                </div>
              </div>
            </div>

            <SessionList sessions={sessions} />

            <label>Student Report:</label>
            <NavLink to="/select-student" className="mx-3">
              <span>Search</span>
            </NavLink>
            <br></br>
            <label>Module Report:</label>
            <NavLink to="/select-module" className="mx-3">
              <span>Select</span>
            </NavLink>
            <br></br>
            <label>Session Report:</label>
            <NavLink to="/select-session" className="mx-3">
              <span>Select</span>
            </NavLink>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Dashboard;
