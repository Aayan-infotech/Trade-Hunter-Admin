import React, { useEffect, useState } from 'react';
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react';
import axios from 'axios';
import '../Users/Usermanagement.css';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [jobPostings, setJobPostings] = useState({ active: 0, completed: 0, cancelled: 0 });
  const [subscriptionRevenue, setSubscriptionRevenue] = useState(0);
  const [recentJobActivity, setRecentJobActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, jobPostingsRes, revenueRes, activityRes] = await Promise.all([
          axios.get('http://localhost:7777/api/admin/totalUsers'),
          axios.get('http://localhost:7777/api/admin/jobPostings'),
          axios.get('http://localhost:7777/api/admin/subscriptionRevenue'),
          axios.get('http://localhost:7777/api/admin/recentJobActivity'),
        ]);

        setTotalUsers(usersRes.data.totalUsers);
        setJobPostings(jobPostingsRes.data);
        setSubscriptionRevenue(revenueRes.data.totalRevenue);
        setRecentJobActivity(activityRes.data.activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <CContainer fluid style={{ minHeight: '100vh', overflow: 'hidden', padding: '2rem' }}>
      <CRow className="mb-4">
        <CCol md={4}>
          <CCard className="text-center">
            <CCardHeader>Total Users</CCardHeader>
            <CCardBody>
              <h2>{totalUsers}</h2>
              <p>Clients & Providers</p>
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
