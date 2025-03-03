import React, { useState } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CFormSelect,
  CFormInput,
  CButton,
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
  const [timePeriod, setTimePeriod] = useState("daily");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("");
  const [userType, setUserType] = useState("all");

  const providersData = [
    { id: 1, name: "Provider A", acceptanceRate: "90%", completionRate: "85%", responseTime: "2 hrs" },
    { id: 2, name: "Provider B", acceptanceRate: "85%", completionRate: "80%", responseTime: "3 hrs" },
    { id: 3, name: "Provider C", acceptanceRate: "95%", completionRate: "90%", responseTime: "1.5 hrs" },
  ];

  const [providerSearch, setProviderSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);

  const filteredProviders = providersData.filter((provider) =>
    provider.name.toLowerCase().includes(providerSearch.toLowerCase())
  );

  const activeUsers = 1234;
  const newSignups = 234;
  const retentionRate = "85%";
  const jobsDaily = 50;
  const jobsWeekly = 300;
  const jobsMonthly = 1200;
  const topServices = ["Plumbing", "Electrician", "Carpentry"];
  const highDemandAreas = ["New York", "Los Angeles", "Chicago"];

  const handleApplyFilters = () => {
    console.log("Applying filters:", { timePeriod, category, location, userType });
  };

  const jobPostingData = {
    labels: ["Daily", "Weekly", "Monthly"],
    datasets: [
      {
        label: "Jobs Posted",
        data: [jobsDaily, jobsWeekly, jobsMonthly],
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
    providerStatsChartData = {
      labels: ["Acceptance Rate", "Completion Rate"],
      datasets: [
        {
          label: "Percentage",
          data: [
            parseFloat(selectedProvider.acceptanceRate),
            parseFloat(selectedProvider.completionRate),
          ],
          backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
          borderWidth: 1,
        },
      ],
    };

    providerStatsChartOptions = {
      indexAxis: 'y',
      scales: {
        x: {
          max: 100,
          ticks: {
            callback: (value) => value + '%',
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
    <CContainer className="mt-4">
      <CCard className="mb-4">
        <CCardHeader className="service-card-header">
          <h4>Filter Users</h4>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={3}>
              <label>Time Period</label>
              <CFormSelect value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <label>Category</label>
              <CFormSelect value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">All</option>
                <option value="jobs">Jobs</option>
                <option value="services">Services</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <label>Location</label>
              <CFormInput
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </CCol>
            <CCol md={3}>
              <label>User Type</label>
              <CFormSelect value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="all">All</option>
                <option value="hunter">Hunters</option>
                <option value="provider">Providers</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CButton color="primary" onClick={handleApplyFilters}>
            Apply Filters
          </CButton>
        </CCardBody>
      </CCard>

      <h4 className="mb-3">Platform Analytics &amp; Reports</h4>

      <CRow className="mb-4">
        <CCol md={4}>
          <CCard className="text-center mb-3">
            <CCardHeader className="service-card-header">Active Users</CCardHeader>
            <CCardBody>
              <h3>{activeUsers}</h3>
              <CIcon icon={cilUser} size="xl" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center mb-3">
            <CCardHeader className="service-card-header">New Sign-ups</CCardHeader>
            <CCardBody>
              <h3>{newSignups}</h3>
              <CIcon icon={cilCalendar} size="xl" />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={4}>
          <CCard className="text-center mb-3">
            <CCardHeader className="service-card-header">Retention Rate</CCardHeader>
            <CCardBody>
              <h3>{retentionRate}</h3>
              <CIcon icon={cilCalendar} size="xl" />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader className="service-card-header">Job Posting Trends</CCardHeader>
        <CCardBody style={{ height: "300px" }}>
          <Bar data={jobPostingData} options={{ maintainAspectRatio: false }} />
        </CCardBody>
      </CCard>

      <CRow className="mb-4">
        <CCol md={6}>
          <CCard className="mb-3">
            <CCardHeader className="service-card-header">Service Demand</CCardHeader>
            <CCardBody>
              <p>Most requested services:</p>
              <ul>
                {topServices.map((service, idx) => (
                  <li key={idx}>{service}</li>
                ))}
              </ul>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard className="text-center mb-3">
            <CCardHeader className="service-card-header">Geographical Demand</CCardHeader>
            <CCardBody>
              <p>High-demand areas:</p>
              <ul>
                {highDemandAreas.map((area, idx) => (
                  <li key={idx}>{area}</li>
                ))}
              </ul>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader className="service-card-header">Provider Performance</CCardHeader>
        <CCardBody>
          <CFormInput
            type="text"
            placeholder="Search providers..."
            value={providerSearch}
            onChange={(e) => setProviderSearch(e.target.value)}
            className="mb-3"
          />
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedProvider(provider)}
              >
                {provider.name}
              </div>
            ))}
            {filteredProviders.length === 0 && <p>No providers found</p>}
          </div>
          {selectedProvider && (
            <CCard className="mt-3">
              <CCardHeader className="service-card-header">
                Provider Stats: {selectedProvider.name}
              </CCardHeader>
              <CCardBody>
                <div style={{ height: "200px" }}>
                  <Bar data={providerStatsChartData} options={providerStatsChartOptions} />
                </div>
                <p className="mt-3">
                  <strong>Response Time:</strong> {selectedProvider.responseTime}
                </p>
              </CCardBody>
            </CCard>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default AnalyticsReports;
