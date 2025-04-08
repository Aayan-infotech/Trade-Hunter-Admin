import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CCardText,
  CRow,
  CCol,
  CButton,
} from "@coreui/react";
import "./Usermanagement.css";

const ProviderAssignedJobs = () => {
  const location = useLocation();
  const { providerId } = location.state || {}; // Extract providerId from location state

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem('token');
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  useEffect(() => {
    const fetchProviderProfile = async () => {
      try {
        console.log("Fetching provider data with id:", providerId);
        const response = await axios.get(
          `http://3.223.253.106:7777/api/provider/${providerId}`,authHeaders
        );
        console.log("Response Data:", response.data);
        if (response.data && response.data.success) {
          setProvider(response.data.data);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        console.error("Error fetching provider profile:", err);
        setError("Error fetching provider profile.");
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchProviderProfile();
    } else {
      setError("Provider ID is missing");
      setLoading(false);
    }
  }, [providerId]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  if (error) {
    return <div className="text-center mt-5">{error}</div>;
  }
  if (!provider) {
    return <div className="text-center mt-5">No provider data available</div>;
  }

  const assignedJobs = provider.assignedJobs || [];

  return (
    <CContainer className="jobs-hunter-wrapper mt-4">
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="bg-primary text-white text-center">
          <h2>Assigned Jobs</h2>
        </CCardHeader>
      </CCard>

      {/* Scrollable container for job cards */}
      <div style={{ maxHeight: "600px", overflowY: "auto", paddingRight: "15px" }}>
        {assignedJobs.length > 0 ? (
          <CRow className="g-4">
            {assignedJobs.map((job) => (
              <CCol md={6} key={job._id}>
                <CCard className="shadow-sm h-100">
                  <CCardHeader className="bg-secondary text-white">
                    <h5 className="mb-0">{job.title}</h5>
                  </CCardHeader>
                  <CCardBody>
                    <div className="mb-3">
                      <CCardTitle className="small text-muted">Location</CCardTitle>
                      <CCardText>{job.jobLocation?.jobAddressLine || "N/A"}</CCardText>
                    </div>
                    <div className="mb-3">
                      <CCardTitle className="small text-muted">Estimated Budget</CCardTitle>
                      <CCardText>${job.estimatedBudget}</CCardText>
                    </div>
                    <div className="mb-3">
                      <CCardTitle className="small text-muted">Business Type</CCardTitle>
                      <CCardText>
                        {Array.isArray(job.businessType)
                          ? job.businessType.join(", ")
                          : job.businessType}
                      </CCardText>
                    </div>
                    <div className="mb-3">
                      <CCardTitle className="small text-muted">Requirements</CCardTitle>
                      <CCardText>{job.requirements}</CCardText>
                    </div>
                    <div className="mb-3">
                      <CCardTitle className="small text-muted">Job Status</CCardTitle>
                      <CCardText>{job.jobStatus}</CCardText>
                    </div>
                    <div className="mb-3">
                      <CCardTitle className="small text-muted">Timeframe</CCardTitle>
                      <CCardText>
                        {job.timeframe
                          ? `${new Date(
                              job.timeframe.from * 1000
                            ).toLocaleString()} - ${new Date(
                              job.timeframe.to * 1000
                            ).toLocaleString()}`
                          : "N/A"}
                      </CCardText>
                    </div>
                    <div className="mb-3">
                      <CCardTitle className="small text-muted">Assigned By</CCardTitle>
                      <CCardText>{job.user ? job.user.name || job.user.contactName : "N/A"}</CCardText>
                    </div>
                    <div>
                      <CCardTitle className="small text-muted">User Email</CCardTitle>
                      <CCardText>{job.user ? job.user.email : "N/A"}</CCardText>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        ) : (
          <div className="text-center">No assigned jobs found.</div>
        )}
      </div>

      {/* Optional: Add a Back button */}
      <div className="mt-4 text-center">
        <CButton color="secondary" onClick={() => window.history.back()}>
          &larr; Back
        </CButton>
      </div>
    </CContainer>
  );
};

export default ProviderAssignedJobs;
