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

  

  return <Layout>Sessions Page!</Layout>;
};

export default Sessions;
