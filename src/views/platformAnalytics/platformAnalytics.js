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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../Users/Usermanagement.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const formatDate = (dateObj) => {
  if (!dateObj) return "N/A";
  const date = new Date(dateObj);
  return date.toLocaleDateString();
};

const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    let fillPercentage = 0;
    if (rating >= i + 1) {
      fillPercentage = 100;
    } else if (rating > i) {
      fillPercentage = (rating - i) * 100;
    }
    stars.push(
      <span
        key={i}
        style={{
          position: "relative",
          display: "inline-block",
          width: "1em",
        }}
      >

        <FontAwesomeIcon icon={faStar} style={{ color: "#e4e5e9" }} />
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${fillPercentage}%`,
            overflow: "hidden",
            whiteSpace: "nowrap",
            color: "#ffc107",
          }}
        >
          <FontAwesomeIcon icon={faStar} />
        </span>
      </span>
    );
  }
  return <span>{stars}</span>;
};

const AnalyticsReports = () => {
  // State variables
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
  const [providerList, setProviderList] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerStatsChartData, setProviderStatsChartData] = useState(null);
  const [providerStatsChartOptions, setProviderStatsChartOptions] = useState(null);

  const token = localStorage.getItem("token");
  const commonConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    axios
      .get(`http://3.223.253.106:7787/api/Prvdr?search=${providerSearch}`, commonConfig)
      .then((res) => {
        if (res.data.data && Array.isArray(res.data.data)) {
          setProviderList(res.data.data);
        } else {
          setProviderList([]);
        }
      })
      .catch((err) => console.error("Error fetching providers:", err));
  }, [providerSearch]);

  useEffect(() => {
    axios
      .get("http://3.223.253.106:7787/api/count/activeUsers", commonConfig)
      .then((res) => {
        if (res.data.totalActiveUsers !== undefined) {
          setActiveUsers(res.data.totalActiveUsers);
        }
      })
      .catch((err) => console.error("Error fetching active users:", err));

    axios
      .get("http://3.223.253.106:7787/api/auth/recentSignups", commonConfig)
      .then((res) => {
        if (res.data.totalNewSignups !== undefined) {
          setNewSignups(res.data.totalNewSignups);
        }
      })
      .catch((err) => console.error("Error fetching recent signups:", err));

    axios
      .get("http://3.223.253.106:7787/api/SubscriptionNew/retentionRate", commonConfig)
      .then((res) => {
        if (res.data.data && res.data.data.retentionRate !== undefined) {
          setRetentionRate(res.data.data.retentionRate);
        }
      })
      .catch((err) => console.error("Error fetching retention rate:", err));

    axios
      .get("http://3.223.253.106:7787/api/jobPost/getJobTrends", commonConfig)
      .then((res) => {
        setJobTrends({
          dailyCount: res.data.data.dailyCount || 0,
          weeklyCount: res.data.data.weeklyCount || 0,
          monthlyCount: res.data.data.monthlyCount || 0,
        });
      })
      .catch((err) => console.error("Error fetching job trends:", err));

    axios
      .get("http://3.223.253.106:7787/api/jobPost/getTopBusinessCount", commonConfig)
      .then((res) => {
        if (res.data.data && Array.isArray(res.data.data)) {
          setTopBusinessCount(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching top business count:", err));

    axios
      .get("http://3.223.253.106:7787/api/jobpost/topLocation", commonConfig)
      .then((res) => {
        if (res.data.data && Array.isArray(res.data.data)) {
          setTopLocations(res.data.data);
        }
      })
      .catch((err) =>
        console.error("Error fetching top demanded cities:", err)
      );
  }, []);

  const handleProviderClick = (provider) => {
    const providerId = provider._id || provider.id;
    setSelectedProvider({
      ...provider,
      acceptanceCount: provider.jobAcceptCount,
      completionCount: provider.jobCompleteCount,
      responseTime: provider.responseTime || "2 hrs",
      avgRating: provider.avgRating,
      name: provider.name || provider.contactName,
    });

    axios
      .get(`http://3.223.253.106:7787/api/provider/completionRate/${providerId}`, commonConfig)
      .then((res) => {
        if (res.data.completionRate !== undefined) {
          setSelectedProvider((prev) => ({
            ...prev,
            completionRate: res.data.completionRate,
          }));
        }
      })
      .catch((err) =>
        console.error("Error fetching provider completion rate:", err)
      );

    axios
      .get(`http://3.223.253.106:7787/api/rating/getAvgRating/${providerId}`, commonConfig)
      .then((res) => {
        if (res.data.data && res.data.data.avgRating !== undefined) {
          setSelectedProvider((prev) => ({
            ...prev,
            avgRating: res.data.data.avgRating,
          }));
        } else if (res.data.avgRating !== undefined) {
          setSelectedProvider((prev) => ({
            ...prev,
            avgRating: res.data.avgRating,
          }));
        }
      })
      .catch((err) =>
        console.error("Error fetching provider average rating:", err)
      );
  };

  useEffect(() => {
    if (selectedProvider) {
      const acceptanceCount = parseInt(selectedProvider.acceptanceCount) || 0;
      const completionCount = parseInt(selectedProvider.completionCount) || 0;
      const completionRate = parseFloat(selectedProvider.completionRate) || 0;

      setProviderStatsChartData({
        labels: ["Acceptance Count", "Completion Count", "Completion Rate"],
        datasets: [
          {
            label: "Provider Stats",
            data: [acceptanceCount, completionCount, completionRate],
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
      });

      setProviderStatsChartOptions({
        indexAxis: "y",
        scales: {
          x: {
            ticks: {
              callback: (value, index) => {
                if (index === 2) {
                  return value + "%";
                }
                return value;
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = providerStatsChartData.labels[context.dataIndex];
                let value = context.parsed.x;
                if (context.dataIndex === 2) {
                  return `${label}: ${value}%`;
                }
                return `${label}: ${value}`;
              },
            },
          },
        },
        maintainAspectRatio: false,
      });
    }
  }, [selectedProvider]);

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

  return (
    <CContainer className="mt-4 analytics-container">
      <h4 className="mb-4 analytics-header">Platform Analytics &amp; Reports</h4>

      <CRow className="mb-4">
        <CCol md={4}>
          <CCard className="text-center mb-3 analytics-card">
            <CCardHeader className="service-card-header">
              Active Users
            </CCardHeader>
            <CCardBody>
              <h3>{activeUsers}</h3>
              <CIcon icon={cilUser} size="xl" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center mb-3 analytics-card">
            <CCardHeader className="service-card-header">
              New Sign-ups
            </CCardHeader>
            <CCardBody>
              <h3>{newSignups}</h3>
              <CIcon icon={cilCalendar} size="xl" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center mb-3 analytics-card">
            <CCardHeader className="service-card-header">
              Retention Rate
            </CCardHeader>
            <CCardBody>
              <h3>
                {!isNaN(Number(retentionRate))
                  ? Number(retentionRate).toFixed(2)
                  : "0.00"}
                %
              </h3>
              <CIcon icon={cilCalendar} size="xl" />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="mb-4 analytics-chart-card">
        <CCardHeader className="service-card-header">
          Job Posting Trends
        </CCardHeader>
        <CCardBody style={{ height: "300px" }}>
          <Bar data={jobPostingData} options={{ maintainAspectRatio: false }} />
        </CCardBody>
      </CCard>

      <CRow className="mb-4">
        <CCol md={6}>
          <CCard className="mb-3 analytics-card" style={{ height: "300px" }}>
            <CCardHeader className="service-card-header">
              Service Demand
            </CCardHeader>
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
          <CCard className="text-center analytics-card" style={{ height: "300px" }}>
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

      <CCard className="mb-4 analytics-card">
        <CCardHeader className="service-card-header">
          Provider Performance
        </CCardHeader>
        <CCardBody>
          <CFormInput
            type="text"
            placeholder="Search providers..."
            value={providerSearch}
            onChange={(e) => setProviderSearch(e.target.value)}
            className="mb-3"
          />
          <div
            className="provider-list"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {providerList.map((provider) => (
              <div
                key={provider.id}
                className="provider-item"
                onClick={() => handleProviderClick(provider)}
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
                Provider Stats:{" "}
                {selectedProvider.name || selectedProvider.contactName}
              </CCardHeader>
              <CCardBody style={{ height: "200px" }}>
                {providerStatsChartData && providerStatsChartOptions && (
                  <Bar
                    data={providerStatsChartData}
                    options={providerStatsChartOptions}
                  />
                )}
                <div className="mt-3">
                  <strong>Average Rating: </strong>
                  {selectedProvider.avgRating
                    ? Number(selectedProvider.avgRating).toFixed(2)
                    : "0.00"}{" "}
                  {renderStars(Number(selectedProvider.avgRating) || 0)}
                </div>
              </CCardBody>
            </CCard>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default AnalyticsReports;
