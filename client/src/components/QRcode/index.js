import React, { Fragment } from "react";
import { clientURL } from "../../constants";
import QRCode from "react-qr-code";

const QRcode = ({ id }) => {
  const url = `${clientURL}/sign-in/` + id;
  return (
    <Fragment>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={url}
        viewBox={`0 0 256 256`}
      />
    </Fragment>
  );
};

export default QRcode;
