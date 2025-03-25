import React, { useState, useEffect } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CFormInput,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilCalendar, cilMap } from "@coreui/icons";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../Users/Usermanagement.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AnalyticsReports = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [newSignups, setNewSignups] = useState(0);
  const [retentionRate, setRetentionRate] = useState("0");
  const [jobTrends, setJobTrends] = useState({
    dailyCount: 0,
    weeklyCount: 0,
    monthlyCount: 0,
  });
  const [topBusinessCount, setTopBusinessCount] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [providerSearch, setProviderSearch] = useState("");
  const [providerPage, setProviderPage] = useState(1);
  const [providerList, setProviderList] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Fetch provider list
  useEffect(() => {
    const url = `http://3.223.253.106:7777/api/Prvdr?page=${providerPage}&limit=10&search=${providerSearch}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setProviderList(data.data);
        } else {
          setProviderList([]);
        }
      })
      .catch((err) => console.error("Error fetching providers:", err));
  }, [providerSearch, providerPage]);

  // Fetch analytics data
  useEffect(() => {
    fetch("http://3.223.253.106:7777/api/count/activeUsers")
      .then((res) => res.json())
      .then((data) => {
        if (data.totalActiveUsers !== undefined) {
          setActiveUsers(data.totalActiveUsers);
        }
      })
      .catch((err) => console.error("Error fetching active users:", err));

    fetch("http://3.223.253.106:7777/api/auth/recentSignups")
      .then((res) => res.json())
      .then((data) => {
        if (data.totalNewSignups !== undefined) {
          setNewSignups(data.totalNewSignups);
        }
      })
      .catch((err) => console.error("Error fetching recent signups:", err));

    fetch("http://3.223.253.106:7777/api/SubscriptionNew/retentionRate")
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.retentionRate !== undefined) {
          setRetentionRate(data.data.retentionRate);
        }
      })
      .catch((err) => console.error("Error fetching retention rate:", err));

    fetch("http://3.223.253.106:7777/api/jobPost/getJobTrends")
      .then((res) => res.json())
      .then((data) => {
        setJobTrends({
          dailyCount: data.data.dailyCount || 0,
          weeklyCount: data.data.weeklyCount || 0,
          monthlyCount: data.data.monthlyCount || 0,
        });
      })
      .catch((err) => console.error("Error fetching job trends:", err));

    fetch("http://3.223.253.106:7777/api/jobPost/getTopBusinessCount")
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setTopBusinessCount(data.data);
        }
      })
      .catch((err) =>
        console.error("Error fetching top business count:", err)
      );

    fetch("http://3.223.253.106:7777/api/jobpost/topLocation")
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setTopLocations(data.data);
        }
      })
      .catch((err) =>
        console.error("Error fetching top demanded cities:", err)
      );
  }, []);

  const jobPostingData = {
    labels: ["Daily", "Weekly", "Monthly"],
    datasets: [
      {
        label: "Jobs Posted",
        data: [
          jobTrends.dailyCount,
          jobTrends.weeklyCount,
          jobTrends.monthlyCount,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  let providerStatsChartData = null;
  let providerStatsChartOptions = null;
  if (selectedProvider) {
    const acceptanceRate = parseFloat(selectedProvider.acceptanceRate) || 75;
    const completionRate = parseFloat(selectedProvider.completionRate) || 80;

    providerStatsChartData = {
      labels: ["Acceptance Rate", "Completion Rate"],
      datasets: [
        {
          label: "Percentage",
          data: [acceptanceRate, completionRate],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    providerStatsChartOptions = {
      indexAxis: "y",
      scales: {
        x: {
          max: 100,
          ticks: {
            callback: (value) => value + "%",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
    };
  }

  return (
    <CContainer className="mt-4 analytics-container">
      <h4 className="mb-4 analytics-header">Platform Analytics &amp; Reports</h4>

      {/* Stats Cards */}
      <CRow className="mb-4">
        <CCol md={4}>
          <CCard className="text-center mb-3 analytics-card">
            <CCardHeader className="service-card-header">Active Users</CCardHeader>
            <CCardBody>
              <h3>{activeUsers}</h3>
              <CIcon icon={cilUser} size="xl" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center mb-3 analytics-card">
            <CCardHeader className="service-card-header">New Sign-ups</CCardHeader>
            <CCardBody>
              <h3>{newSignups}</h3>
              <CIcon icon={cilCalendar} size="xl" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center mb-3 analytics-card">
            <CCardHeader className="service-card-header">Retention Rate</CCardHeader>
            <CCardBody>
              <h3>{retentionRate}%</h3>
              <CIcon icon={cilCalendar} size="xl" />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Job Posting Trends Chart */}
      <CCard className="mb-4 analytics-chart-card">
        <CCardHeader className="service-card-header">Job Posting Trends</CCardHeader>
        <CCardBody style={{ height: "300px" }}>
          <Bar data={jobPostingData} options={{ maintainAspectRatio: false }} />
        </CCardBody>
      </CCard>

      {/* Service and Location Demand */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CCard className="mb-3 analytics-card">
            <CCardHeader className="service-card-header">Service Demand</CCardHeader>
            <CCardBody>
              <p>Top Demanded Services:</p>
              <ul className="analytics-list">
                {topBusinessCount.length > 0
                  ? topBusinessCount.map((item, idx) => (
                      <li key={idx}>
                        {item.businessType} - {item.count}
                      </li>
                    ))
                  : "No data available"}
              </ul>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard className="text-center mb-3 analytics-card">
            <CCardHeader className="service-card-header">
              Geographical Demand
            </CCardHeader>
            <CCardBody>
              <p>Top Demanded Areas:</p>
              <ul className="analytics-list">
                {topLocations.length > 0
                  ? topLocations.map((loc, idx) => (
                      <li key={idx}>
                        {loc.city} - {loc.count}
                      </li>
                    ))
                  : "No data available"}
              </ul>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Provider Performance Section */}
      <CCard className="mb-4 analytics-card">
        <CCardHeader className="service-card-header">Provider Performance</CCardHeader>
        <CCardBody>
          <CFormInput
            type="text"
            placeholder="Search providers..."
            value={providerSearch}
            onChange={(e) => {
              setProviderSearch(e.target.value);
              setProviderPage(1);
            }}
            className="mb-3"
          />
          <div className="provider-list" style={{ maxHeight: "200px", overflowY: "auto" }}>
            {providerList.map((provider) => (
              <div
                key={provider.id}
                className="provider-item"
                onClick={() =>
                  setSelectedProvider({
                    ...provider,
                    acceptanceRate: provider.acceptanceRate || "75",
                    completionRate: provider.completionRate || "80",
                    responseTime: provider.responseTime || "2 hrs",
                    name: provider.name || provider.contactName,
                  })
                }
              >
                <div>
                  <strong>{provider.contactName}</strong>
                  <br />
                  <span>{provider.email}</span>
                </div>
                <CIcon icon={cilMap} size="lg" />
              </div>
            ))}
            {providerList.length === 0 && <p>No providers found</p>}
          </div>
          {selectedProvider && (
            <CCard className="mt-3 provider-stats-card">
              <CCardHeader className="service-card-header">
                Provider Stats: {selectedProvider.name || selectedProvider.contactName}
              </CCardHeader>
              <CCardBody>
                <div style={{ height: "200px" }}>
                  <Bar
                    data={providerStatsChartData}
                    options={providerStatsChartOptions}
                  />
                </div>
                <table className="table mt-3">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Response Time</strong>
                      </td>
                      <td>{selectedProvider.responseTime || "2 hrs"}</td>
                    </tr>
                  </tbody>
                </table>
              </CCardBody>
            </CCard>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default AnalyticsReports;
