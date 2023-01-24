import Form  from "react-bootstrap/Form";
import React from "react";

const AddListForm = () => {
  return (
   <Form>
      <Form.Group>
        <Form.Label>Enter List Name</Form.Label>
          <Form.Control type="text" placeholder="Name"required/>
      </Form.Group>
   </Form>
  );
};

export default AddListForm;
