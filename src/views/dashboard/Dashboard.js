import React, { useEffect, useState } from 'react';
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react';
import axios from 'axios';
import '../Users/Usermanagement.css';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [hunter, setHunter] = useState(0);
  const [provider, setProvider] = useState(0);
  const [jobPostings, setJobPostings] = useState({ active: 0, completed: 0, cancelled: 0 });
  const [subscriptionRevenue, setSubscriptionRevenue] = useState(0);
  const [recentJobActivity, setRecentJobActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const results = await Promise.allSettled([
          axios.get('http://localhost:7777/api/count/totalUsers'),
          axios.get('http://localhost:7777/api/admin/jobPostings'),
          axios.get('http://54.236.98.193:7777/api/payment/totalRevenue'), 
          axios.get('http://localhost:7777/api/admin/recentJobActivity'),
        ]);
    
        if (results[0].status === "fulfilled") {
          setTotalUsers(results[0].value.data.totalUsers);
          setHunter(results[0].value.data.huntersCount)
          setProvider(results[0].value.data.providersCount)
        } else {
          console.error("Failed to fetch total users:", results[0].reason);
        }
    
        if (results[1].status === "fulfilled") {
          setJobPostings(results[1].value.data);
        } else {
          console.error("Failed to fetch job postings:", results[1].reason);
        }
    
        if (results[2].status === "fulfilled" && results[2].value.data?.data?.totalRevenue) {
          setSubscriptionRevenue(results[2].value.data.data.totalRevenue);
        } else {
          console.error("Failed to fetch revenue or missing totalRevenue:", results[2].reason);
        }
    
        if (results[3].status === "fulfilled") {
          setRecentJobActivity(results[3].value.data.activities);
        } else {
          console.error("Failed to fetch recent job activity:", results[3].reason);
        }
      } catch (error) {
        console.error("Unexpected error fetching dashboard data:", error);
      }
    };
    

    fetchDashboardData();
  }, []);

  return (
    <CContainer fluid style={{ minHeight: '100vh', overflow: 'hidden', padding: '2rem' }}>
      <CRow className="mb-4">
        <CCol md={4}>
          <CCard className="text-center">
            <CCardHeader>User's Insight</CCardHeader>
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
              <p>Active: {jobPostings.active}</p>
              <p>Completed: {jobPostings.completed}</p>
              <p>Cancelled: {jobPostings.cancelled}</p>
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
        <CCol md={4}>
          <CCard className="text-center">
            <CCardHeader>Recent Job Activity</CCardHeader>
            <CCardBody>
              {recentJobActivity.length > 0 ? (
                recentJobActivity.map((job, index) => (
                  <p key={index}>
                    {job.title} - {job.status}
                  </p>
                ))
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
