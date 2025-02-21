import React, { useEffect, useState } from 'react';
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react';
import axios from 'axios';
import '../Users/Usermanagement.css';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [hunter, setHunter] = useState(0);
  const [provider, setProvider] = useState(0);
  const [jobPostings, setJobPostings] = useState({ Pending: 0, Assigned: 0, InProgress: 0, Completed: 0 });
  const [subscriptionRevenue, setSubscriptionRevenue] = useState(0);
  const [recentJobActivity, setRecentJobActivity] = useState([]);

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
          setProvider(results[0].value.data.providersCount);
        }

        if (results[1].status === "fulfilled") {
          setJobPostings(results[1].value.data.data || {});
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
    <CContainer fluid style={{ minHeight: '100vh', padding: '2rem' }}>
      <CRow className="mb-4">
        <CCol md={4}>
          <CCard className="text-center">
            <CCardHeader>User Insights</CCardHeader>
            <CCardBody>
              <h5>Total Users: {totalUsers}</h5>
              <p>Hunters: {hunter}</p>
              <p>Providers: {provider}</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center">
            <CCardHeader>Job Postings</CCardHeader>
            <CCardBody>
              {Object.keys(jobPostings).map((status) => (
                <p key={status}>{status}: {jobPostings[status] || 0}</p>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center">
            <CCardHeader>Subscription Revenue</CCardHeader>
            <CCardBody>
              <h2>${subscriptionRevenue}</h2>
              <p>Revenue Insights</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>Recent Job Activity</CCardHeader>
            <CCardBody>
              {recentJobActivity.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
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
                        <td>{job.jobLocation?.jobAddressLine}</td>
                        <td>{job.businessType}</td>
                        <td>{job.jobStatus}</td>
                        <td>${job.estimatedBudget}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No recent activity</p>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Dashboard;
