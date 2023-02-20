import React, { Fragment, useState } from "react";
import { onCreateSession } from "../api/lecturer.api";

const CreateModule = ({ id }) => {

  const [values, setValues] = useState({
    user_id: id,
    module_name: "",
  });

  const [error, setError] = useState(false);

  const create = async (e) => {
    e.preventDefault();
    try {
      //await onCreateSession(values);
      console.log("Create module hit!!");
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
    setValues({ ...values, user_id: id, module_name: "" });
    setError(false);
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-primary ms-2"
        data-bs-toggle="modal"
        data-bs-target="#moduleModal"
      >
        Create Module
      </button>

      <div
        className="modal fade"
        id="moduleModal"
        tabIndex="-1"
        aria-labelledby="moduleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="moduleModalLabel">
                Give your module a name
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
                  value={values.module_name}
                  onChange={(e) => onChange(e)}
                  name="module_name"
                  placeholder="Module Name"
                  required
                ></input>
                <label htmlFor="floatingInput">Module Name</label>
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

export default CreateModule;
