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
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilViewColumn } from "@coreui/icons";
import "../Users/Usermanagement.css";

const SubscriptionUsersManagement = () => {
  const [subscriptionUsers, setSubscriptionUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewSubscription, setViewSubscription] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const token = localStorage.getItem("token");
  const commonConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    fetchSubscriptionUsers();
  }, []);

  const fetchSubscriptionUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://18.209.91.97:7787/api/SubscriptionNew/subscription-users",
        commonConfig
      );
      const data = response.data.data || [];
      const sortedData = data.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      setSubscriptionUsers(sortedData);
    } catch (err) {
      console.error("Error fetching subscription users:", err);
      setError("Failed to load subscription users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubscription = (subscription) => {
    setViewSubscription(subscription);
    setShowViewModal(true);
  };

  return (
    <CContainer>
      <CCard>
        <CCardHeader className="service-card-header">
          <h4>Subscribed Users</h4>
        </CCardHeader>
        <CCardBody style={{ maxHeight: "400px", overflowY: "auto" }}>
          {error && <p className="text-danger">{error}</p>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Contact Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Subscription Type</CTableHeaderCell>
                  <CTableHeaderCell>Plan Name</CTableHeaderCell>
                  <CTableHeaderCell>$</CTableHeaderCell>
                  <CTableHeaderCell>Start Date</CTableHeaderCell>
                  <CTableHeaderCell>End Date</CTableHeaderCell>
                  <CTableHeaderCell>Km Radius</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {subscriptionUsers.length > 0 ? (
                  subscriptionUsers.map((subscription) => (
                    <CTableRow key={subscription._id}>
                      <CTableDataCell>
                        {subscription.userId?.contactName || "N/A"}
                      </CTableDataCell>
                      <CTableDataCell>
                        {subscription.userId?.email || "N/A"}
                      </CTableDataCell>
                      <CTableDataCell>
                        {subscription.subscriptionPlanId?.type?.type || "N/A"}
                      </CTableDataCell>
                      <CTableDataCell>
                        {subscription.subscriptionPlanId?.planName || "N/A"}
                      </CTableDataCell>
                      <CTableDataCell>
                        ${subscription.subscriptionPlanId?.amount || "0.00"}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(subscription.startDate).toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(subscription.endDate).toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        {subscription.kmRadius || "N/A"}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CIcon
                          className="me-2 text-primary cursor-pointer"
                          title="view"
                          onClick={() => handleViewSubscription(subscription)}
                          icon={cilViewColumn}
                          size="lg"
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center">
                      No subscribed users available.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={showViewModal} onClose={() => setShowViewModal(false)}>
        <CModalHeader className="service-card-header">
          <CModalTitle>Subscription Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewSubscription && (
            <div>
              <p>
                <strong>Contact Name:</strong>{" "}
                {viewSubscription.userId?.contactName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {viewSubscription.userId?.email || "N/A"}
              </p>
              <p>
                <strong>Subscription Type:</strong>{" "}
                {viewSubscription.subscriptionPlanId?.type?.type || "N/A"}
              </p>
              <p>
                <strong>Plan Name:</strong>{" "}
                {viewSubscription.subscriptionPlanId?.planName || "N/A"}
              </p>
              <p>
                <strong>Amount:</strong> $
                {viewSubscription.subscriptionPlanId?.amount || "0.00"}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(viewSubscription.startDate).toLocaleString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(viewSubscription.endDate).toLocaleString()}
              </p>
              <p>
                <strong>Km Radius:</strong>{" "}
                {viewSubscription.kmRadius || "N/A"}
              </p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default SubscriptionUsersManagement;
