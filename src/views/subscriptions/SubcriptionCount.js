import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import "../Users/Usermanagement.css";

const SubscriptionUsersByPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const commonConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://api.tradehunters.com.au/api/SubscriptionNew/usersByPlan",
        commonConfig
      );
      const { data = [] } = response.data;
      setPlans(data);
    } catch (err) {
      console.error("Error fetching subscription plans:", err);
      setError("Failed to load subscription plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CContainer>
      <CCard>
        <CCardHeader className="service-card-header">
          <h4 className="mb-0">Users by Subscription Plan </h4>
        </CCardHeader>
        <CCardBody style={{ maxHeight: "400px", overflowY: "auto" }}>
          {error && <p className="text-danger">{error}</p>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <CTable hover responsive>
              <CTableHead className="sticky-header">
                <CTableRow>
                  <CTableHeaderCell>Plan Name</CTableHeaderCell>
                  <CTableHeaderCell>User Count</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {plans.length > 0 ? (
                  plans.map((plan) => (
                    <CTableRow key={plan.subscriptionPlanId}>
                      <CTableDataCell>{plan.planName}</CTableDataCell>
                      <CTableDataCell>{plan.count}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={2} className="text-center">
                      No plans found.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default SubscriptionUsersByPlan;
