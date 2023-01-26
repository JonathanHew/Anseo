import { useEffect, useState } from "react";
import Layout from "../components/layout";

const Sessions = () => {
  
  useEffect(() => {
    retrieveUser();
  }, []);

  const retrieveUser = async () => {
    //example
  };
  return <Layout>Sessions Page!</Layout>;
};

export default Sessions;
