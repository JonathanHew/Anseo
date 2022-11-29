import Layout from "../components/layout";
import QRCodeSVG from "qrcode.react";

const Display = () => {

    //const url = "http://localhost:8000/api/sign-in";

    return (
      <Layout>
        <h1>Sign In By Scanning the QR Code!</h1>
        <div class="row mt-5">
            <div class="col-8">
                <QRCodeSVG value = "http://localhost:8000/api/sign-in" size={256}/>
            </div>
            <div class="col-4">
              <p>Student Count:</p>
            </div>
        </div>
      </Layout>
    );
  };
  
  export default Display;
  