import React from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/layout';

const StudentReport = () => {
    const {student_number, module_id} = useParams();
  return (
    <Layout>
        <p>student number : {student_number}</p>
        <p>module id : {module_id}</p>
    </Layout>
  )
}

export default StudentReport