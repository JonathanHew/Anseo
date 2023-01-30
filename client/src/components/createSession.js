import React, { Fragment, useState } from "react";
import { onCreateSession } from "../api/lecturer.api";

const CreateSession = ({ id }) => {
  const user_id = id;

  const [values, setValues] = useState({
    user_id: user_id,
    session_name: "",
  });

  const [error, setError] = useState(false);

  const create = async (e) => {
    e.preventDefault();
    try {
      const { data } = await onCreateSession(values);
      window.location = "/sessions";
    } catch (err) {
      console.error(err.response.data.errors[0].msg);
      setError(err.response.data.errors[0].msg);
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onClose = () => {
    setValues({ ...values, user_id: user_id, session_name: "" });
    setError(false);
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Create Session
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Give your session a name
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={values.session_name}
                  onChange={(e) => onChange(e)}
                  name="session_name"
                  required
                ></input>
                <label htmlFor="floatingInput">Session Name</label>
              </div>

              <div style={{ color: "red", margin: "10px 0" }}>{error}</div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => onClose()}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => create(e)}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateSession;
