import React, { Fragment } from "react";
import QRCode from "react-qr-code";


const QRcode = ({ id, pin, students, sessionToggle }) => {
  const url = "http://localhost:3000/sign-in/" + id;
  return (
    <Fragment>
      <div class="container text-center">
        <h1>Sign in by scanning the QR code!</h1>
        <button
          type="button"
          className="btn btn-danger"
          onClick={(e) => sessionToggle(e)}
        >
          End Session
        </button>
        <div
          style={{
            height: "auto",
            margin: "4% auto",
            maxWidth: 450,
            width: "100%",
          }}
        >
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={url}
            viewBox={`0 0 256 256`}
          />
        </div>
        <h4>Student Count: {students.length}</h4>
        <h5>PIN: {pin}</h5>
      </div>
    </Fragment>
  );
};

export default QRcode;
