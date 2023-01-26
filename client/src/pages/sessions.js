import { useEffect } from "react";
import { fetchUserSessions } from "../api/lecturer.api";
import Layout from "../components/layout";

const Sessions = ({ id }) => {
  
  useEffect(() => {
    (async () => {
      const content = await fetchUserSessions({id});
      console.log(content);
    })();
  });
  return (
    <Layout>
      <h1>Sessions Page</h1>
      <p>User ID: {id}</p>
    </Layout>
  );
};

export default Sessions;
