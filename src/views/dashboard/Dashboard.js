import React, { useEffect, useState } from 'react';
import { 
  CContainer, 
  CRow, 
  CCol, 
  CCard, 
  CCardHeader, 
  CCardBody, 
  CProgress, 
  CBadge,
  CFormInput,
} from '@coreui/react';
import axios from 'axios';
import '../Users/Usermanagement.css';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [hunter, setHunter] = useState(0);
  const [provider, setProvider] = useState(0);
  const [guest, setGuest] = useState(0);
  // Initialize jobPostings as an object with a status sub-object and totalJobs count.
  const [jobPostings, setJobPostings] = useState({
    status: { Pending: 0, Assigned: 0, InProgress: 0, Completed: 0 },
    totalJobs: 0,
  });
  const [subscriptionRevenue, setSubscriptionRevenue] = useState(0);
  const [recentJobActivity, setRecentJobActivity] = useState([]);
  const [providerSearch, setProviderSearch] = useState("");
  const [providerPage, setProviderPage] = useState(1);
  const [providerList, setProviderList] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Color mapping for each job posting status.
  const jobPostingColors = {
    Pending: "danger",
    Assigned: "primary",
    InProgress: "warning",
    Completed: "success",
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const results = await Promise.allSettled([
          axios.get('http://54.236.98.193:7777/api/count/totalUsers'),
          axios.get('http://54.236.98.193:7777/api/jobs/getCount'),
          axios.get('http://54.236.98.193:7777/api/payment/totalRevenue'),
          axios.get('http://54.236.98.193:7777/api/jobs/getRecentJobs'),
        ]);

        if (results[0].status === "fulfilled") {
          setTotalUsers(results[0].value.data.totalUsers);
          setHunter(results[0].value.data.huntersCount);
          setProvider(results[0].value.data.providers);
          setGuest(results[0].value.data.guestModeProviders || 0);
        }

        if (results[1].status === "fulfilled") {
          // Expected API response structure: { success, message, data: { status: { ... }, totalJobs } }
          const jobData = results[1].value.data.data || { status: {}, totalJobs: 0 };
          setJobPostings(jobData);
        }

        if (results[2].status === "fulfilled" && results[2].value.data?.data?.totalRevenue) {
          setSubscriptionRevenue(results[2].value.data.data.totalRevenue);
        }

        if (results[3].status === "fulfilled") {
          setRecentJobActivity(results[3].value.data.data || []);
        }
      } catch (error) {
        console.error("Unexpected error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <CContainer fluid className="dashboard-container">
      <CRow className="mb-4">
        <CCol md={4}>
          <CCard className="dashboard-card hover-effect">
            <CCardHeader className="service-card-header">User Insights</CCardHeader>
            <CCardBody>
              <h2 className="text-center">{totalUsers}</h2>
              <p className="text-muted text-center">Total Users</p>
              <CRow>
                <CCol>
                  <CBadge color="info">Hunters: {hunter}</CBadge>
                </CCol>
                <CCol>
                  <CBadge color="success">Providers: {provider}</CBadge>
                </CCol>
                <CCol>
                  <CBadge color="secondary">Guests: {guest}</CBadge>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4}>
          <CCard className="dashboard-card hover-effect">
            <CCardHeader className="service-card-header">Job Postings</CCardHeader>
            <CCardBody>
              <div className="text-center mb-3">
                <strong>Total Jobs: {jobPostings.totalJobs}</strong>
              </div>
              <CRow>
                {Object.keys(jobPostings.status).map((status, index) => (
                  <CCol md={6} key={index} className="mb-2">
                    <strong>{status}:</strong> {jobPostings.status[status] || 0}
                    <CProgress 
                      color={jobPostingColors[status] || "info"} 
                      value={(jobPostings.status[status] / (totalUsers || 1)) * 100} 
                      className="mt-1" 
                    />
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4}>
          <CCard className="dashboard-card hover-effect">
            <CCardHeader className="service-card-header">Subscription Revenue</CCardHeader>
            <CCardBody className="text-center">
              <h1 className="text-success">${subscriptionRevenue}</h1>
              <p className="text-muted">Total Earnings</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={12}>
          <CCard className="dashboard-card">
            <CCardHeader className="service-card-header">Recent Job Activities</CCardHeader>
            <CCardBody>
              {recentJobActivity.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover custom-table">
                    <thead className="thead-light">
                      <tr>
                        <th>Title</th>
                        <th>Hunters Name</th>
                        <th>Providers Name</th>
                        <th>Location</th>
                        <th>Business Type</th>
                        <th>Status</th>
                        <th>Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentJobActivity.map((job, index) => (
                        <tr key={index}>
                          <td>{job.title}</td>
                          <td>{job.user.name}</td>
                          <td>{job.providername}</td>
                          <td>{job.jobLocation?.jobAddressLine}</td>
                          <td>
                            {Array.isArray(job.businessType)
                              ? job.businessType.join(", ")
                              : job.businessType}
                          </td>
                          <td>
                            <CBadge color={jobPostingColors[job.jobStatus] || "warning"}>
                              {job.jobStatus}
                            </CBadge>
                          </td>
                          <td>${job.estimatedBudget}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="service-card-header">No recent job activities.</p>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Dashboard;
