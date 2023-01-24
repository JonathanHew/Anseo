import { Button, Modal } from 'bootstrap'
import React from 'react'

const AddListForm = () => {
    return (
     <Modal>
        <Modal.Header>
          <Modal.Title>
              Create New List
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Form
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Close</Button>
        </Modal.Footer>
    </Modal>
    );
  };
  
  export default AddListForm;
  