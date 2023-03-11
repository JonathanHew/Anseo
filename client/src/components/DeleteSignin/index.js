import React, { Fragment } from "react";
import { deleteSignIn } from "../../api/lecturer.api";

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
      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={(e) => deleteSignin(e)}
      >
        x
      </button>
    </Fragment>
  );
};

export default DeleteSignin;
