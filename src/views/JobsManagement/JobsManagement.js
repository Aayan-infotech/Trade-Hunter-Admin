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
    CPagination,
    CFormInput,
    CPaginationItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilPencil, cilViewColumn, cilArrowBottom, cilArrowTop, cilSearch } from "@coreui/icons";
import '../Users/Usermanagement.css';
const JobsManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [sortedJobs, setSortedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('')
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [viewJob, setViewJob] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editJob, setEditJob] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://44.196.64.110:7777/api/jobs/?page=${page}&limit=10&search=${search}`);
            setJobs(response.data.data.jobPosts || []);
            setTotalPages(response.data.data.pagination.totalPages || 1);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setError("Failed to load jobs. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchJobs();
    }, [page, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setPage(1)
    }

    useEffect(() => {
        setSortedJobs(jobs);
    }, [jobs]);

    const toggleSortOrder = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
        sortJobs(newOrder);
    };

    const sortJobs = (order) => {
        const sorted = [...jobs].sort((a, b) => {
            if (order === "asc") {
                return a.businessType.localeCompare(b.businessType);
            } else {
                return b.businessType.localeCompare(a.businessType);
            }
        });
        setSortedJobs(sorted);
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                await axios.delete(`http://44.196.64.110:7777/api/jobs/${jobId}`);
                fetchJobs();
            } catch (error) {
                console.error("Error deleting job:", error);
                alert("Failed to delete job.");
            }
        }
    };

    const handleViewJob = (job) => {
        setViewJob(job);
        setShowViewModal(true);
    };

    const handleEditJob = (job) => {
        setEditJob({ ...job });
        setShowEditModal(true);
    };

    const handleSaveEditJob = async () => {
        try {
            await axios.put(`http://44.196.64.110:7777/api/jobs/${editJob._id}`, editJob);
            fetchJobs();
            setShowEditModal(false);
            setEditJob(null);
        } catch (error) {
            console.error("Error updating job:", error);
            alert("Failed to update job.");
        }
    };

    return (
        <CContainer style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <CCard>
                <CCardHeader className="card-header">
                    <h4>Job Management</h4>
                    <div className="d-flex align-items-center">
                        <CFormInput
                            type="text"
                            placeholder="Search by Title"
                            value={search}
                            onChange={handleSearch}
                            className="me-2 mb-0 c-form-input"
                        />
                        <CButton color="primary" onClick={fetchJobs} className="btn d-flex flex-row gap-2 align-items-center">
                            <CIcon icon={cilSearch} /> Search
                        </CButton>
                    </div>
                </CCardHeader>
                <CCardBody style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                    {error && <p className="text-danger">{error}</p>}
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Title</CTableHeaderCell>
                                    <CTableHeaderCell>Location</CTableHeaderCell>
                                    <CTableHeaderCell>Hunter Name</CTableHeaderCell>
                                    <CTableHeaderCell
                                        onClick={toggleSortOrder}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Business Type
                                        <CIcon
                                            icon={sortOrder === "asc" ? cilArrowBottom : cilArrowTop}
                                            className="ms-2"
                                        />
                                    </CTableHeaderCell>

                                    <CTableHeaderCell>Status</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {sortedJobs.length > 0 ? (
                                    sortedJobs.map((job) => (
                                        <CTableRow key={job._id}>
                                            <CTableDataCell>{job.title}</CTableDataCell>
                                            <CTableDataCell>
                                                {job.jobLocation?.jobAddressLine
                                                    ? job.jobLocation.jobAddressLine.length > 25
                                                        ? job.jobLocation.jobAddressLine.slice(0, 25) + "..."
                                                        : job.jobLocation.jobAddressLine
                                                    : "N/A"}
                                            </CTableDataCell>
                                            <CTableDataCell>{job.user?.name}</CTableDataCell>
                                            <CTableDataCell>{job.businessType}</CTableDataCell>
                                            <CTableDataCell>{job.jobStatus}</CTableDataCell>
                                            <CTableDataCell>
                                                <CIcon
                                                    className="me-2 text-primary"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleViewJob(job)}
                                                    icon={cilViewColumn}
                                                    size="lg"
                                                />
                                                <CIcon
                                                    className="me-2 text-success"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleEditJob(job)}
                                                    icon={cilPencil}
                                                    size="lg"
                                                />
                                                <CIcon
                                                    className="text-danger"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleDeleteJob(job._id)}
                                                    icon={cilTrash}
                                                    size="lg"
                                                />
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan={6} className="text-center">
                                            No jobs available.
                                        </CTableDataCell>
                                    </CTableRow>
                                )}
                            </CTableBody>
                        </CTable>
                    )}

                    <CPagination align="center" className="mt-3">
                        <CPaginationItem
                            style={{ cursor: 'pointer' }}
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </CPaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <CPaginationItem
                                style={{ cursor: 'pointer' }}
                                key={i + 1}
                                active={i + 1 === page}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </CPaginationItem>
                        ))}
                        <CPaginationItem
                            style={{ cursor: 'pointer' }}
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </CPaginationItem>
                    </CPagination>
                </CCardBody>
            </CCard>

            <CModal
                scrollable
                visible={showViewModal}
                onClose={() => setShowViewModal(false)}
                className="custom-modal"
            >
                <CModalHeader>
                    <CModalTitle>Job Details</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {viewJob && (
                        <div>
                            <p><strong>Title:</strong> {viewJob.title}</p>
                            <p><strong>Location:</strong> {viewJob.jobLocation?.jobAddressLine || "N/A"}</p>
                            <p><strong>Job Radius:</strong> {viewJob.jobLocation?.jobRadius} meters</p>
                            <p><strong>Estimated Budget:</strong> ${viewJob.estimatedBudget}</p>
                            <p><strong>Business Type:</strong> {viewJob.businessType}</p>
                            <p><strong>Services:</strong> {viewJob.services}</p>
                            <p><strong>Requirements:</strong> {viewJob.requirements}</p>
                            <p><strong>Hunter id:</strong>{viewJob.user?._id}</p>
                            <p><strong>Hunter Name:</strong>{viewJob.user?.name}</p>
                            <p><strong>Hunter email</strong>{viewJob.user?.email}</p>
                            <p><strong>Job Status:</strong> {viewJob.jobStatus}</p>
                            <p><strong>Timeframe:</strong></p>
                            <ul>
                                <li><strong>From:</strong> {new Date(viewJob.timeframe?.from * 1000).toLocaleString()}</li>
                                <li><strong>To:</strong> {new Date(viewJob.timeframe?.to * 1000).toLocaleString()}</li>
                            </ul>
                            {viewJob.documents.length > 0 ? (
                                <div>
                                    <p><strong>Documents:</strong></p>
                                    <ul>
                                        {viewJob.documents.map((doc, index) => (
                                            <li key={index}>
                                                <a href={doc} target="_blank" rel="noopener noreferrer">
                                                    Document {index + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p><strong>Documents:</strong> No documents uploaded.</p>
                            )}
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton style={{ cursor: 'pointer' }} color="secondary" onClick={() => setShowViewModal(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal
                scrollable
                visible={showEditModal}
                onClose={() => setShowEditModal(false)}
                className="custom-modal"
            >
                <CModalHeader>
                    <CModalTitle>Edit Job</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {editJob && (
                        <div>
                            <label>Title</label>
                            <input
                                type="text"
                                value={editJob.title}
                                onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                                className="form-control mb-2"
                            />
                            <label>Location</label>
                            <input
                                type="text"
                                value={editJob.jobLocation?.jobAddressLine || ""}
                                onChange={(e) => setEditJob({
                                    ...editJob,
                                    jobLocation: {
                                        ...editJob.jobLocation,
                                        jobAddressLine: e.target.value
                                    }
                                })}
                                className="form-control mb-2"
                            />
                            <label>Estimated Budget ($)</label>
                            <input
                                type="number"
                                value={editJob.estimatedBudget || ""}
                                onChange={(e) => setEditJob({ ...editJob, estimatedBudget: e.target.value })}
                                className="form-control mb-2"
                            />
                            <label>Business Type</label>
                            <input
                                type="text"
                                value={editJob.businessType || ""}
                                onChange={(e) => setEditJob({ ...editJob, businessType: e.target.value })}
                                className="form-control mb-2"
                            />
                            <label>Job Status</label>
                            <select
                                value={editJob.jobStatus || ""}
                                onChange={(e) => setEditJob({ ...editJob, jobStatus: e.target.value })}
                                className="form-control mb-2"
                            >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton style={{ cursor: 'pointer' }} color="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </CButton>
                    <CButton style={{ cursor: 'pointer' }} color="primary" onClick={handleSaveEditJob}>
                        Save Changes
                    </CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

export default JobsManagement;
