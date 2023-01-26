import { useEffect, useState } from "react";
import { getUserInfo } from "../api/auth";
import Layout from "../components/layout";

const Sessions = () => {
  const [id, setId] = useState();

  useEffect(() => {
    (async () => {
      const content = await getUserInfo();
      const userId = content.data.info.id;
      setId(userId);
    })();
  });



  return <Layout>
    <h1>Sessions Page</h1>
    <p>User ID: {id}</p>
  </Layout>;
};

export default Sessions;
