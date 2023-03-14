import React, { Fragment, useState } from "react";
import { onCreateSession } from "../../api/lecturer.api";

const CreateSession = ({ modules }) => {
  const [name, setName] = useState("");
  const [module, setModule] = useState();
  const [error, setError] = useState(false);

  const create = async (e) => {
    e.preventDefault();
    try {
      await onCreateSession(name, module);
      window.location.reload();
    } catch (err) {
      console.error(err.response.data.errors[0].msg);
      setError(err.response.data.errors[0].msg);
    }
  };

  const onClose = () => {
    setName("");
    setModule();
    setError(false);
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-success"
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
              <select
                className="form-select form-control mb-2"
                aria-label="Default select example"
                onChange={(e) => setModule(e.target.value)}
              >
                <option defaultValue value="-1">
                  Module
                </option>
                {modules.map((module) => (
                  <option value={module.module_id}>{module.module_name}</option>
                ))}
              </select>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="session_name"
                  placeholder="Session Name"
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
                className="btn btn-success"
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
