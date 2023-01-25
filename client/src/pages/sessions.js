import { useState } from "react";
import Layout from "../components/layout";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);

  const getSessions = async () => {
    //example 
  };
  return <Layout>Sessions Page!</Layout>;
};

export default Sessions;
