import React, { useEffect, useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CBadge,
  CFormSelect,
} from '@coreui/react'
import { CChartPie } from '@coreui/react-chartjs'
import axios from 'axios'
import '../Users/Usermanagement.css'

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0)
  const [hunter, setHunter] = useState(0)
  const [provider, setProvider] = useState(0)
  const [guest, setGuest] = useState(0)
  const [jobPostings, setJobPostings] = useState({
    status: { Pending: 0, Assigned: 0,  Completed: 0 },
    totalJobs: 0,
  })
  const [subscriptionRevenue, setSubscriptionRevenue] = useState(0)
  const [recentJobActivity, setRecentJobActivity] = useState([])

  const [revenueMonth, setRevenueMonth] = useState('')
  const [financialYear, setFinancialYear] = useState('')

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const financialYears = ['2023-2024', '2024-2025', '2025-2026']

  const jobPostingColors = {
    Pending: 'danger',
    Assigned: 'primary',
    Completed: 'success',
    Deleted: 'secondary',
  }
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const commonConfig = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }

        const results = await Promise.allSettled([
          axios.get('http://18.209.91.97:7777/api/count/totalUsers', commonConfig),
          axios.get('http://18.209.91.97:7777/api/jobs/getCount', commonConfig),
          axios.get('http://18.209.91.97:7777/api/eway/totalRevenue', {
            ...commonConfig,
            params: { month: revenueMonth, financialYear: financialYear },
          }),
          axios.get('http://18.209.91.97:7777/api/jobs/getRecentJobs', commonConfig),
        ])

        if (results[0].status === 'fulfilled') {
          setTotalUsers(results[0].value.data.totalUsers)
          setHunter(results[0].value.data.huntersCount)
          setProvider(results[0].value.data.providers)
          setGuest(results[0].value.data.guestModeProviders || 0)
        }

        if (results[1].status === 'fulfilled') {
          const jobData = results[1].value.data.data || { status: {}, totalJobs: 0 }
          setJobPostings(jobData)
        }

        if (
          results[2].status === 'fulfilled' &&
          results[2].value.data?.data?.totalRevenue !== undefined
        ) {
          setSubscriptionRevenue(results[2].value.data.data.totalRevenue)
        }

        if (results[3].status === 'fulfilled') {
          setRecentJobActivity(results[3].value.data.data || [])
        }
      } catch (error) {
        console.error('Unexpected error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [revenueMonth, financialYear])

  const jobStatusLabels = Object.keys(jobPostings.status)
  const jobStatusValues = Object.values(jobPostings.status)
  const jobStatusColors = jobStatusLabels.map((status) => {
    switch (status) {
      case 'Pending':
        return '#dc3545' 
      case 'Assigned':
        return '#007bff'
      case 'Completed':
        return '#28a745' 
      case 'Deleted':
        return '#6c757d' 
      default:
        return '#17a2b8' 
    }
  })

  const jobStatusData = {
    labels: jobStatusLabels,
    datasets: [
      {
        data: jobStatusValues,
        backgroundColor: jobStatusColors,
      },
    ],
  }

  const jobStatusOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  return (
    <CContainer fluid className="dashboard-container">
      <CRow className="mb-4 d-flex">
        <CCol md={4}>
          <CCard className="dashboard-card hover-effect h-100 d-flex flex-column">
            <CCardHeader className="service-card-header">User Insights</CCardHeader>
            <CCardBody className="flex-grow-1 d-flex flex-column justify-content-center">
              <h2 className="text-center">{totalUsers}</h2>
              <p className="text-muted text-center">Total Users</p>
              <div
                className="d-flex justify-content-around align-items-center"
                style={{ whiteSpace: 'nowrap' }}
              >
                <CBadge color="info" className="mx-1">
                  Hunters: {hunter}
                </CBadge>
                <CBadge color="success" className="mx-1">
                  Providers: {provider}
                </CBadge>
                <CBadge color="secondary" className="mx-1">
                  Guests: {guest}
                </CBadge>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4}>
          <CCard className="dashboard-card hover-effect h-100 d-flex flex-column">
            <CCardHeader className="service-card-header">Job Postings</CCardHeader>
            <CCardBody className="flex-grow-1 d-flex flex-column">
              <div className="text-center mb-3">
                <strong>Total Jobs: {jobPostings.totalJobs}</strong>
              </div>
              <div style={{ flexGrow: 1, position: 'relative' }}>
                <CChartPie data={jobStatusData} options={jobStatusOptions} />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4}>
          <CCard className="dashboard-card hover-effect h-100 d-flex flex-column">
            <CCardHeader className="service-card-header">Subscription Revenue</CCardHeader>
            <CCardBody className="flex-grow-1 d-flex flex-column justify-content-center text-center">
              <div className="d-flex justify-content-center mb-3">
                <CFormSelect
                  value={revenueMonth}
                  onChange={(e) => setRevenueMonth(e.target.value)}
                  className="me-2"
                  style={{ maxWidth: '150px' }}
                >
                  <option value="">All Months</option>
                  {months.map((m, index) => (
                    <option key={index} value={index + 1}>
                      {m}
                    </option>
                  ))}
                </CFormSelect>
                <CFormSelect
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  style={{ maxWidth: '150px' }}
                >
                  <option value="">All Financial Years</option>
                  {financialYears.map((fy, index) => (
                    <option key={index} value={fy}>
                      {fy}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              <h1 className="text-success">${parseFloat(subscriptionRevenue).toFixed(2)}</h1>
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
                        <th>Business Name</th>
                        <th>Location</th>
                        <th>Business Type</th>
                        <th>Status</th>
                        <th>Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentJobActivity.map((job, index) => (
                        <tr key={index}>
                          <td>{job.title || 'N/A'}</td>
                          <td>{job.user?.name || 'N/A'}</td>
                          <td>{job.provider?.businessName || 'N/A'}</td>
                          <td>{job.jobLocation?.jobAddressLine || 'N/A'}</td>
                          <td>
                            {Array.isArray(job.businessType)
                              ? job.businessType.join(', ')
                              : job.businessType || 'N/A'}
                          </td>
                          <td>
                            <CBadge color={jobPostingColors[job.jobStatus] || 'warning'}>
                              {job.jobStatus || 'N/A'}
                            </CBadge>
                          </td>
                          <td>${job.estimatedBudget || '0.00'}</td>
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
  )
}

export default Dashboard
