import Layout from "../components/layout";
import QRCodeSVG from "qrcode.react";
import { useParams } from "react-router-dom";

const Join = () => {
  
  const {id} = useParams();

    return (
      <Layout>
        <h1>Sign In By Scanning the QR Code!</h1>
        <div class="row mt-5">
            <div class="col-8">
                <QRCodeSVG value = "http://localhost:3000/sign-in" size={256}/>
            </div>
            <div class="col-4">
              <p>Student Count:</p>
            </div>
        </div>
        <p>Session ID is: {id}</p>
      </Layout>
    );
  };
  
  export default Join;
  