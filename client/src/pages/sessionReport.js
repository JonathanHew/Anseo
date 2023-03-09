import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { fetcchSessionReportChartData } from "../api/lecturer.api";
import DoughnutChart from "../components/DoughnutChart";
import Layout from "../components/layout";
import PieChart from "../components/pieChart";

const SessionReport = () => {
  const { session_id } = useParams();

  const [signins, setSignins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [piedata, setPiedata] = useState({});

  useEffect(() => {
    (async () => {
      await fetcchSessionReportChartData(session_id).then((res) => {
        setSignins(res.data.signins);

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
          <div class="col-md-6">
            <h4>Attendance Pie Chart</h4>
            <DoughnutChart chartData={piedata}></DoughnutChart>
          </div>
          <div class="col-md-6 mt-5"></div>
        </div>
      </div>
    </Layout>
  );
};

export default SessionReport;
