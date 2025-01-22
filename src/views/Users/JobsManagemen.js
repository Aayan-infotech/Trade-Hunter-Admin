import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const JobsManagemen = () => {
  const { state } = useLocation(); // Access the passed state from `navigate`
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`http://44.196.64.110:7777/api/users/jobposts/${state._id}`);
        setJobData(response.data?.data?.[0]); // Access the job data from the response
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (state?._id) {
      fetchJobData();
    }
  }, [state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!jobData) {
    return <div>No data found for the provided ID.</div>;
  }

  return (
    <div>
      <h2>Job Details</h2>
      <p><strong>Title:</strong> {jobData.title}</p>
      <p><strong>Location:</strong> {jobData.location?.jobaddress || 'N/A'}</p>
      <p><strong>Estimated Budget:</strong> ${jobData.estimatedBudget}</p>
      <p><strong>Service Type:</strong> {jobData.serviceType}</p>
      <p><strong>Service:</strong> {jobData.service}</p>
      <p><strong>documents:</strong> {jobData.documents}</p>
      <p><strong>Timeframe:</strong> {new Date(jobData.timeframe.from).toLocaleString()} to {new Date(jobData.timeframe.to).toLocaleString()}</p>
    </div>
  );
};

export default JobsManagemen;
