import React from "react";
import Layout from "../../components/Layout";
import "../../App.css"
import {
  faUser,
  faPersonChalkboard,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

const SelectReport = () => {
  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="text-center">Select A Report</h1>
        <div className="row row-cols-1 row-cols-md-3 mt-5">
          <div className="col">
            <div className="card text-bg-danger text-center report-card">
              <NavLink
                to="/select-student"
                style={{ textDecoration: "none", color: "white" }}
              >
                <div className="report-card-body">
                  <FontAwesomeIcon
                    icon={faUser}
                    size="10x"
                    className="mt-5"
                  ></FontAwesomeIcon>
                  <p className="report-card-text mt-5">Student</p>
                </div>
              </NavLink>
            </div>
          </div>
          <div className="col">
          <div className="card text-bg-success text-center report-card">
              <NavLink
                to="/select-session"
                style={{ textDecoration: "none", color: "white" }}
              >
                <div className="report-card-body">
                  <FontAwesomeIcon
                    icon={faPersonChalkboard}
                    size="10x"
                    className="mt-5"
                  ></FontAwesomeIcon>
                  <p className="report-card-text mt-5">Session</p>
                </div>
              </NavLink>
            </div>
          </div>
          <div className="col">
          <div className="card text-bg-primary text-center report-card">
              <NavLink
                to="/select-module"
                style={{ textDecoration: "none", color: "white" }}
              >
                <div className="report-card-body">
                  <FontAwesomeIcon
                    icon={faPeopleGroup}
                    size="10x"
                    className="mt-5"
                  ></FontAwesomeIcon>
                  <p className="report-card-text mt-5">Module</p>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectReport;
