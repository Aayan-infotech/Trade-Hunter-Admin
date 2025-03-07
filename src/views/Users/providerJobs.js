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
} from "@coreui/react";
import "./Usermanagement.css";

const ProviderAssignedJobs = () => {
  const location = useLocation();
  const { providerId } = location.state || {}; // Extract providerId from location state

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProviderProfile = async () => {
      try {
        console.log("Fetching provider data with id:", providerId);
        const response = await axios.get(
          `http://54.236.98.193:7777/api/provider/${providerId}`
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
      {assignedJobs.length > 0 ? (
        <CRow>
          {assignedJobs.map((job) => (
            <CCol md={6} key={job._id} className="mb-3">
              <CCard className="shadow-sm">
                <CCardHeader className="bg-secondary text-white">
                  {job.title}
                </CCardHeader>
                <CCardBody>
                  <CCardTitle>Location</CCardTitle>
                  <CCardText>
                    {job.jobLocation?.jobAddressLine || "N/A"}
                  </CCardText>
                  <CCardTitle>Estimated Budget</CCardTitle>
                  <CCardText>${job.estimatedBudget}</CCardText>
                  <CCardTitle>Business Type</CCardTitle>
                  <CCardText>
                    {Array.isArray(job.businessType)
                      ? job.businessType.join(", ")
                      : job.businessType}
                  </CCardText>
                  <CCardTitle>Requirements</CCardTitle>
                  <CCardText>{job.requirements}</CCardText>
                  <CCardTitle>Job Status</CCardTitle>
                  <CCardText>{job.jobStatus}</CCardText>
                  <CCardTitle>Timeframe</CCardTitle>
                  <CCardText>
                    {job.timeframe
                      ? `${new Date(
                          job.timeframe.from * 1000
                        ).toLocaleString()} - ${new Date(
                          job.timeframe.to * 1000
                        ).toLocaleString()}`
                      : "N/A"}
                  </CCardText>
                  {/* Display the populated user details */}
                  <CCardTitle>Assigned By</CCardTitle>
                  <CCardText>
                    {job.user ? job.user.name : "N/A"}
                  </CCardText>
                  <CCardTitle>User Email</CCardTitle>
                  <CCardText>
                    {job.user ? job.user.email : "N/A"}
                  </CCardText>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      ) : (
        <div className="text-center">No assigned jobs found.</div>
      )}
    </CContainer>
  );
};

export default ProviderAssignedJobs;
