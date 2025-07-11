import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from '@coreui/react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { FaEdit, FaTrash } from 'react-icons/fa'
import '../Users/Usermanagement.css'

const commonConfig = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
}

const authConfig = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
}

const API_CREATE = "https://api.tradehunters.com.au/api/blog/postBlog"
const API_GET = "https://api.tradehunters.com.au/api/blog/getAll"
const API_DELETE = "https://api.tradehunters.com.au/api/blog/delete"
const API_UPDATE = "https://api.tradehunters.com.au/api/blog/update"
const API_GET_BY_ID = "https://api.tradehunters.com.au/api/blog/getById"

const stripHtml = (html) => html.replace(/<[^>]+>/g, '');

const BlogManagement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editBlog, setEditBlog] = useState(null);

  const [showReadModal, setShowReadModal] = useState(false);
  const [readBlog, setReadBlog] = useState(null);
  const [readLoading, setReadLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }
    try {
      const res = await fetch(API_CREATE, {
        method: 'POST',
        headers: authConfig.headers, 
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        window.alert(result.message || "Blog post created successfully!");
        fetchBlogs();
        setTitle('');
        setContent('');
        setImage(null);
      } else {
        window.alert(result.error || "Error creating blog post.");
      }
    } catch (error) {
      window.alert("Error creating blog post.");
      console.error("Error creating blog:", error);
    }
    setLoading(false);
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch(API_GET, commonConfig);
      const result = await res.json();
      if (result.blog && Array.isArray(result.blog)) {
        setBlogs(result.blog);
      } else if (Array.isArray(result)) {
        setBlogs(result);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleDeleteBlog = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const res = await fetch(`${API_DELETE}/${id}`, {
          ...commonConfig,
          method: 'DELETE'
        });
        const result = await res.json();
        if (res.ok) {
          window.alert(result.message || "Blog post deleted successfully!");
          fetchBlogs();
        } else {
          window.alert(result.error || "Error deleting blog post.");
        }
      } catch (error) {
        window.alert("Error deleting blog post.");
        console.error("Error deleting blog:", error);
      }
    }
  };

  const openEditModal = (blog, e) => {
    e.stopPropagation();
    setEditBlog({ ...blog });
    setShowEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditBlog(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEditBlog = async () => {
    if (!editBlog) return;
    try {
      const formData = new FormData();
      formData.append('title', editBlog.title);
      formData.append('content', editBlog.content);
      if (editBlog.newImage) {
        formData.append('image', editBlog.newImage);
      }
      const res = await fetch(`${API_UPDATE}/${editBlog._id}`, {
        method: 'PUT',
        headers: authConfig.headers, 
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        window.alert(result.message || "Blog post updated successfully!");
        fetchBlogs();
        setShowEditModal(false);
        setEditBlog(null);
      } else {
        window.alert(result.error || "Error updating blog post.");
      }
    } catch (error) {
      window.alert("Error updating blog post.");
      console.error("Error updating blog:", error);
    }
  };

  const handleCardClick = async (id) => {
    setReadLoading(true);
    try {
      const res = await fetch(`${API_GET_BY_ID}/${id}`, commonConfig);
      const result = await res.json();
      const blogData = result.blog ? result.blog : result;
      if (res.ok && blogData) {
        setReadBlog(blogData);
        setShowReadModal(true);
      } else {
        window.alert(result.error || "Error fetching blog details.");
      }
    } catch (error) {
      window.alert("Error fetching blog details.");
      console.error("Error fetching blog by ID:", error);
    }
    setReadLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <CContainer fluid className="d-flex align-items-center justify-content-center mt-5">
        <CCard
          className="voucher-card shadow"
          style={{ 
            maxWidth: '800px', 
            width: '100%',
            backgroundColor: 'var(--container-bg)',
            border: '1px solid var(--table-border-color)',
            boxShadow: '0 2px 10px var(--shadow-color)'
          }}
        >
          <CCardHeader className="voucher-card-header text-center">
            Create Blog Post
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="blogTitle">Blog Title</CFormLabel>
                  <CFormInput
                    type="text"
                    id="blogTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter blog title"
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>Blog Content</CFormLabel>
                  <ReactQuill
                    value={content}
                    onChange={setContent}
                    placeholder="Enter blog content here..."
                    style={{ height: '125px', marginBottom: '30px' }}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="blogImage">Blog Image (Optional)</CFormLabel>
                  <CFormInput
                    type="file"
                    id="blogImage"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </CCol>
              </CRow>
              <div className="text-center">
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? "Posting..." : "Post Blog"}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>

      <CContainer fluid className="mt-5">
        <CRow>
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <CCol md={4} key={blog._id} className="mb-4">
                <CCard
                  className="voucher-card shadow"
                  onClick={() => handleCardClick(blog._id)}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: 'var(--container-bg)',
                    border: '1px solid var(--table-border-color)'
                  }}
                >
                  <CCardHeader className="voucher-card-header">
                    {blog.title}
                  </CCardHeader>
                  <CCardBody>
                    <div>
                      {stripHtml(blog.content).length > 100
                        ? stripHtml(blog.content).slice(0, 100) + "..."
                        : stripHtml(blog.content)}
                    </div>
                    {blog.image && (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          marginTop: '10px',
                        }}
                      />
                    )}
                  </CCardBody>
                  <CCardFooter className="d-flex justify-content-between" onClick={(e) => e.stopPropagation()}>
                    <CButton
                      size="sm"
                      style={{
                        backgroundColor: '#f0ad4e',
                        borderColor: '#eea236',
                        borderRadius: '5px',
                        padding: '5px 10px',
                      }}
                      onClick={(e) => openEditModal(blog, e)}
                    >
                      <FaEdit style={{ marginRight: '5px', color: '#fff' }} /> Edit
                    </CButton>
                    <CButton
                      size="sm"
                      style={{
                        backgroundColor: '#d9534f',
                        borderColor: '#d43f3a',
                        borderRadius: '5px',
                        padding: '5px 10px',
                      }}
                      onClick={(e) => handleDeleteBlog(blog._id, e)}
                    >
                      <FaTrash style={{ marginRight: '5px', color: '#fff' }} /> Delete
                    </CButton>
                  </CCardFooter>
                </CCard>
              </CCol>
            ))
          ) : (
            <CCol md={12}>
              <p className="text-center">No blog posts available</p>
            </CCol>
          )}
        </CRow>
      </CContainer>

      {showReadModal && (
        <CModal
          scrollable
          visible={showReadModal}
          onClose={() => { setShowReadModal(false); setReadBlog(null) }}
        >
          <CModalHeader className="voucher-card-header text-center">
            <CModalTitle>{readBlog?.title}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {readLoading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <CSpinner color="primary" />
              </div>
            ) : (
              <>
                <div dangerouslySetInnerHTML={{ __html: readBlog?.content }} />
                {readBlog?.image && (
                  <img
                    src={readBlog.image}
                    alt={readBlog.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      marginTop: '10px',
                    }}
                  />
                )}
              </>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => { setShowReadModal(false); setReadBlog(null) }}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {showEditModal && editBlog && (
        <CModal
          scrollable
          visible={showEditModal}
          onClose={() => { setShowEditModal(false); setEditBlog(null) }}
        >
          <CModalHeader className="voucher-card-header text-center">
            <CModalTitle>Edit Blog Post</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="editBlogTitle">Blog Title</CFormLabel>
                  <CFormInput
                    type="text"
                    id="editBlogTitle"
                    value={editBlog.title}
                    onChange={(e) => handleEditChange('title', e.target.value)}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>Blog Content</CFormLabel>
                  <ReactQuill
                    value={editBlog.content}
                    onChange={(value) => handleEditChange('content', value)}
                    style={{ height: '125px', marginBottom: '30px' }}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="editBlogImage">Blog Image (Optional)</CFormLabel>
                  <CFormInput
                    type="file"
                    id="editBlogImage"
                    onChange={(e) => handleEditChange('newImage', e.target.files[0])}
                  />
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => { setShowEditModal(false); setEditBlog(null) }}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={handleSaveEditBlog}>
              Save Changes
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </>
  )
}

export default BlogManagement
