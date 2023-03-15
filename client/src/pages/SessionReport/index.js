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
import SigninList from "../../components/SigninList";

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
      <div className="mb-5">
        <h1 className="text-center mt-5">{name} Session Report</h1>
        <div class="container text-center mt-4" style={{}}>
          <div class="row">
            <div class="col-md-5">
              <div className="card">
                <div className="card-body">
                  <h4>Attendance Record</h4>
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
        <SigninList students={signins} />
      </div>
    </Layout>
  );
};

export default SessionReport;
