import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CContainer,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';

const AllFeedbacks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { provider } = location.state || {};
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider) return navigate('/');
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        setFeedbacks(provider.ratings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [provider, navigate]);

  const renderStars = (rating) => {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  };

  return (
    <CContainer>
      <CButton color="secondary" onClick={() => navigate(-1)} className="mb-3">
        Back
      </CButton>
      <CCard>
        <CCardHeader className="service-card-header">
          <h4>Feedbacks for {provider.businessName}</h4>
          <p>{provider.email}</p>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div>Loading...</div>
          ) : feedbacks.length === 0 ? (
            <p>No feedback available.</p>
          ) : (
            feedbacks.map((fb, idx) => (
              <CCard key={idx} className="mb-3">
                <CCardHeader className='service-card-header'>{fb.user.name}</CCardHeader>
                <CCardBody>
                    <p><strong>Job Title:</strong>{fb.job.title}</p>
                  <p><strong>Rating:</strong> {renderStars(fb.rating)}</p>
                  <p><strong>Review:</strong> {fb.review}</p>
                </CCardBody>
              </CCard>
            ))
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default AllFeedbacks;