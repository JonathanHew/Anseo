import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSessionReportChartData } from "../api/lecturer.api";
import DoughnutChart from "../components/DoughnutChart";
import Layout from "../components/layout";

const SessionReport = () => {
  const { session_id } = useParams();

  const [signins, setSignins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [piedata, setPiedata] = useState({});
  const [percent, setPercent] = useState();

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

      setLoading(false);
    })();
  }, []);
  return loading ? (
    <Layout>Loading ...</Layout>
  ) : (
    <Layout>
      <div class="container text-center" style={{}}>
        <div class="row">
          <div class="col-md-5">
            <h4>Attendance Pie Chart</h4>
            <DoughnutChart chartData={piedata}></DoughnutChart>
          </div>
          <div class="col-md-7 mt-5 container text-center">
            <h4 class="mb-5">Session Summary</h4>
            <div className="row">
              <div class="card w-75 m-auto">
                <div class="card-body">
                  <h5 class="card-title">Attendance</h5>
                  <p class="card-text" style={{ fontSize: "50px" }}>
                    {signins.length}
                  </p>
                </div>
              </div>
            </div>
            <div class="row mt-5">
              <div class="card w-75 m-auto">
                <div class="card-body">
                  <h5 class="card-title">On Campus</h5>
                  <p class="card-text" style={{ fontSize: "50px" }}>
                    {percent}%
                  </p>
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
          {
            /*
           <tr>
             <td>C19472842</td>
             <td>Jonathan</td>
             <td>02/02/23</td>
             <td>13:00</td>
           </tr>
           */

            signins.map((signin) => (
              <tr key={signin.signin_id}>
                <td>{signin.signin_number}</td>
                <td>{signin.signin_name}</td>
                <td>{format(parseISO(signin.signin_date), "dd/MM/yyyy")}</td>
                <td>{signin.signin_time}</td>
                <td>{signin.signin_on_campus.toString()}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Layout>
  );
};

export default SessionReport;
