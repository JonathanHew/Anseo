import React, { Fragment } from "react";
import { deleteSignIn } from "../../api/lecturer.api";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DeleteSignin = ({ signin_id }) => {
  const deleteSignin = async (e) => {
    e.preventDefault();
    try {
      await deleteSignIn(signin_id);
      window.location.reload();
    } catch (err) {
      console.error(err.response.data.errors[0].msg);
    }
  };
  return (
    <Fragment>
      <FontAwesomeIcon
        icon={faTrashCan}
        onClick={deleteSignIn()}
        className="hover-cursor"
      ></FontAwesomeIcon>
    </Fragment>
  );
};

export default DeleteSignin;
