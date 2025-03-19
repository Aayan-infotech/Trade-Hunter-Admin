import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CButton,
} from "@coreui/react";
import "./Usermanagement.css";

const JobsHuunter = () => {
  const { state } = useLocation();
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(
          `http://3.223.253.106:7777/api/users/jobposts/${state._id}`
        );
        setJobData(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (state?._id) {
      fetchJobData();
    }
  }, [state]);

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`http://3.223.253.106:7777/api/jobs/${jobId}`);
      setJobData((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete the job. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (jobData.length === 0) {
    return (
      <div className="text-center mt-5">
        No data found for the provided ID.
      </div>
    );
  }

  return (
    <CContainer className="jobs-hunter-wrapper mt-4">
      {/* Header */}
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="bg-primary text-white text-center">
          <h2 className="mb-0">Job Details</h2>
        </CCardHeader>
      </CCard>

      {/* Scrollable container for job cards */}
      <div style={{ maxHeight: "600px", overflowY: "auto", paddingRight: "15px" }}>
        <CRow className="g-4">
          {jobData.map((job) => (
            <CCol md={6} key={job._id}>
              <CCard className="shadow-sm h-100">
                <CCardHeader className="bg-secondary text-white">
                  <h5 className="mb-0">{job.title}</h5>
                </CCardHeader>
                <CCardBody>
                  <div className="mb-3">
                    <strong>Location:</strong>
                    <p className="text-muted mb-0">
                      {job.location?.jobaddress || "N/A"}
                    </p>
                  </div>
                  <div className="mb-3">
                    <strong>Estimated Budget:</strong>
                    <p className="text-muted mb-0">${job.estimatedBudget}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Business Type:</strong>
                    <p className="text-muted mb-0">{job.businessType}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Services:</strong>
                    <p className="text-muted mb-0">{job.services}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Requirements:</strong>
                    <p className="text-muted mb-0">{job.requirements}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Timeframe:</strong>
                    <p className="text-muted mb-0">
                      {new Date(job.timeframe.from).toLocaleString()} to{" "}
                      {new Date(job.timeframe.to).toLocaleString()}
                    </p>
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <CButton
                      color="danger"
                      onClick={() => handleDeleteJob(job._id)}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete Job"}
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </div>

      {/* Back Button */}
      <div className="mt-4 text-center">
        <CButton color="secondary" onClick={() => window.history.back()}>
          &larr; Back
        </CButton>
      </div>
    </CContainer>
  );
};

export default JobsHuunter;
