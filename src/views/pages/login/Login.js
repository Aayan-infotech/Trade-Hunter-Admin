import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set } from "firebase/database";

import { auth, db } from "../../chat/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { realtimeDb } from "../../chat/firestore";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e, userType) => {
    e.preventDefault();
    setError('');
    // setLoading(true);

    try {
      // Attempt to login
      const response = await fetch('http://54.236.98.193:7777/api/authAdmin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        console.log('Login successful');
        const firebaseUser = await signInWithEmailAndPassword(auth, email, password);
        const userId = firebaseUser.user.uid;
        localStorage.setItem("adminId" , userId)
        console.log("User login id", userId)
        navigate('/dashboard');
        return;
      }

      // If login fails, attempt signup



      setToastProps({ message: "User created successfully!", type: "success" });
      setTimeout(() => navigate(userType === "provider" ? `/provider/otp?email=${email}` : `/otp?email=${email}`), 2000);
    } catch (error) {
      console.error('Authentication Error:', error);
      setError('Failed to authenticate. Please check credentials.');
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4 shadow-lg rounded-lg">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1 className="text-center" style={{ color: '#333' }}>Login</h1>
                    <p className="text-center" style={{ color: '#666' }}>Sign in to your account</p>

                    {error && <p className="text-danger text-center">{error}</p>}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol className="text-center">
                        <CButton type="submit" color="primary" className="px-4 py-2" style={{ width: '100%' }}>
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
