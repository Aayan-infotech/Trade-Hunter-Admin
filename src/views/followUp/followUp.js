import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
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
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import "../Users/Usermanagement.css";

const socket = io("http://18.209.91.97:7787");

const formatDate = (dateObj) => {
  if (!dateObj) return "N/A";
  const date = new Date(dateObj);
  return date.toLocaleDateString();
};

const FollowUp = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const commonConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://18.209.91.97:7787/api/contact/getAll",
        commonConfig
      );
      const fetchedContacts = response.data.contacts || [];
      const sortedContacts = fetchedContacts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setContacts(sortedContacts);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const markAllAsRead = async () => {
      try {
        await axios.put('http://18.209.91.97:7787/api/contact/markAllRead');
      } catch (err) {
        console.error('Failed to mark all as read', err);
      }
    };
    markAllAsRead();
    fetchContacts();

    socket.on("newContact", (newContact) => {
      toast.success(`New Contact from ${newContact.name}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setContacts((prev) => [newContact, ...prev]);
    });

    return () => {
      socket.off("newContact");
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(
          `http://18.209.91.97:7787/api/contact/delete/${id}`,
          commonConfig
        );
        alert("Contact deleted successfully.");
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact._id !== id)
        );
      } catch (err) {
        console.error("Error deleting contact:", err);
        alert("Failed to delete contact.");
      }
    }
  };

  return (
    <CContainer className="jobs-container">
      <ToastContainer />
      <CCard>
        <CCardHeader className="service-card-header">
          <h4>Follow Ups</h4>
        </CCardHeader>
        <CCardBody className="card-body-custom">
          {error && <p className="error-text">{error}</p>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              <CTable hover responsive className="jobs-table">
                <CTableHead className="sticky-header">

                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>UserType</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Message</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <CTableRow key={contact._id}>
                        <CTableDataCell>{contact.name}</CTableDataCell>
                        <CTableDataCell>{contact.userType}</CTableDataCell>
                        <CTableDataCell>{contact.email}</CTableDataCell>
                        <CTableDataCell>{contact.message}</CTableDataCell>
                        <CTableDataCell>{formatDate(contact.createdAt)}</CTableDataCell>
                        <CTableDataCell>
                          <CIcon
                            icon={cilTrash}
                            size="lg"
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={() => handleDelete(contact._id)}
                          />
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={5} className="text-center">
                        No contacts available.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default FollowUp;
