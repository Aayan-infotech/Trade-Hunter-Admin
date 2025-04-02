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
  const [providerList, setProviderList] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerStatsChartData, setProviderStatsChartData] = useState(null);
  const [providerStatsChartOptions, setProviderStatsChartOptions] = useState(null);

  // Helper function to render stars with partial filling
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
          {/* Empty star */}
          <FontAwesomeIcon icon={faStar} style={{ color: "#e4e5e9" }} />
          {/* Overlay filled star with width set to fillPercentage */}
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

  useEffect(() => {
    const url = `http://3.223.253.106:7777/api/Prvdr?search=${providerSearch}`;
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
  }, [providerSearch]);

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

  // Handler for provider click
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

    fetch(`http://3.223.253.106:7777/api/provider/completionRate/${providerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.completionRate !== undefined) {
          setSelectedProvider((prev) => ({
            ...prev,
            completionRate: data.completionRate,
          }));
        }
      })
      .catch((err) =>
        console.error("Error fetching provider completion rate:", err)
      );

    fetch(`http://3.223.253.106:7777/api/rating/getAvgRating/${providerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.avgRating !== undefined) {
          setSelectedProvider((prev) => ({
            ...prev,
            avgRating: data.data.avgRating,
          }));
        } else if (data.avgRating !== undefined) {
          setSelectedProvider((prev) => ({
            ...prev,
            avgRating: data.avgRating,
          }));
        }
      })
      .catch((err) =>
        console.error("Error fetching provider average rating:", err)
      );
  };

  // Prepare provider stats chart data and options if selectedProvider is available
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
                const label =
                  providerStatsChartData.labels[context.dataIndex];
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
