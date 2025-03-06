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

const formatDate = (dateObj) => {
  if (!dateObj) return "N/A";
  const date = new Date(dateObj);
  return date.toLocaleDateString();
};

const followUp = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://54.236.98.193:7777/api/contact/getAll");
      setContacts(response.data.contacts || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <CContainer className="jobs-container">
      <CCard>
        <CCardHeader className="service-card-header">
          <h4>Follow Ups</h4>
        </CCardHeader>
        <CCardBody className="card-body-custom">
          {error && <p className="error-text">{error}</p>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <CTable hover responsive className="jobs-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Message</CTableHeaderCell>
                  <CTableHeaderCell>Created At</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <CTableRow key={contact._id}>
                      <CTableDataCell>{contact.name}</CTableDataCell>
                      <CTableDataCell>{contact.email}</CTableDataCell>
                      <CTableDataCell>{contact.message}</CTableDataCell>
                      <CTableDataCell>{formatDate(contact.createdAt)}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={4} className="text-center">
                      No contacts available.
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

export default followUp;
