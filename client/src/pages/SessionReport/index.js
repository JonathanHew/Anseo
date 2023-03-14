import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchSessionInfo,
  fetchSessionReportChartData,
} from "../../api/lecturer.api";
import DoughnutChart from "../../components/DoughnutChart";
import Layout from "../../components/Layout";
import {
  faBuildingCircleCheck,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SessionReport = () => {
  const { session_id } = useParams();

  const [signins, setSignins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [piedata, setPiedata] = useState({});
  const [percent, setPercent] = useState();
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      await fetchSessionReportChartData(session_id).then((res) => {
        setSignins(res.data.signins);

        if (res.data.signins.length == 0) {
          setPercent(0);
        } else {
          setPercent(
            Math.round((res.data.onCampus / res.data.signins.length) * 100)
          );
        }

        setPiedata({
          labels: ["On Campus", "Off Campus"],
          datasets: [
            {
              label: "Students",
              data: [res.data.onCampus, res.data.offCampus],
              backgroundColor: ["#87bc45", "#ea5545"],
            },
          ],
        });
      });

      await fetchSessionInfo(session_id).then((res) => {
        setName(res.data.result[0].session_name);
      });

      setLoading(false);
    })();
  }, []);
  return loading ? (
    <Layout>Loading ...</Layout>
  ) : (
    <Layout>
      <h1 className="text-center mt-5">{name} Session Report</h1>
      <div class="container text-center mt-4" style={{}}>
        <div class="row">
          <div class="col-md-5">
            <div className="card">
              <div className="card-body">
                <h4>Attendance Pie Chart</h4>
                <DoughnutChart chartData={piedata}></DoughnutChart>
              </div>
            </div>
          </div>
          <div class="col-md-7 mt-5 container text-center">
            <h4 class="mb-5">Session Summary</h4>
            <div className="row">
              <div class="card w-75 m-auto">
                <div class="card-body">
                  <h5 class="card-title">Attendance</h5>
                  <div id="block">
                    <FontAwesomeIcon icon={faGraduationCap} size="3x" />

                    <span
                      className="card-text ms-1"
                      style={{ fontSize: "50px" }}
                    >
                      {signins.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mt-5">
              <div class="card w-75 m-auto">
                <div class="card-body">
                  <h5 class="card-title">On Campus</h5>
                  <div id="block">
                    <FontAwesomeIcon icon={faBuildingCircleCheck} size="3x" />

                    <span
                      className="card-text ms-1"
                      style={{ fontSize: "50px" }}
                    >
                      {percent}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h4 className="text-center mt-5">Signed In Students</h4>
      <table className="table mt-3 text-center">
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Campus</th>
          </tr>
        </thead>
        <tbody>
          {signins.map((signin) => (
            <tr key={signin.signin_id}>
              <td>{signin.signin_number}</td>
              <td>{signin.signin_name}</td>
              <td>{format(parseISO(signin.signin_date), "dd/MM/yyyy")}</td>
              <td>{signin.signin_time}</td>
              <td>{signin.signin_on_campus.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default SessionReport;
