import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [seoContent, setSeoContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showRecruiterModal, setShowRecruiterModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editingRecruiter, setEditingRecruiter] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "jobs") {
        const { data } = await API.get("/jobs/admin/all");
        setJobs(data);
      } else if (activeTab === "recruiters") {
        const { data } = await API.get("/recruiters");
        setRecruiters(data);
      } else if (activeTab === "applications") {
        const { data } = await API.get("/applications");
        setApplications(data.applications || []);
      } else if (activeTab === "reviews") {
        // For demo purposes, fetch from localStorage
        // In production, this would be: const { data } = await API.get("/reviews");
        const storedReviews = JSON.parse(localStorage.getItem('venus_reviews') || '[]');
        setReviews(storedReviews);
      } else if (activeTab === "bookings") {
        const { data } = await API.get("/bookings");
        setBookings(data.bookings || []);
      } else if (activeTab === "seo") {
        const { data } = await API.get("/seo");
        setSeoContent(data);
      } else if (activeTab === "blogs") {
        const { data } = await API.get("/blogs/admin/all");
        setBlogs(data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await API.delete(`/jobs/${jobId}`);
        setJobs(jobs.filter(job => (job.id || job._id) !== jobId));
      } catch (err) {
        console.error("Error deleting job:", err);
        alert("Failed to delete job");
      }
    }
  };

  const handleDeleteRecruiter = async (recruiterId) => {
    if (window.confirm("Are you sure you want to delete this recruiter?")) {
      try {
        await API.delete(`/recruiters/${recruiterId}`);
        setRecruiters(recruiters.filter(recruiter => (recruiter.id || recruiter._id) !== recruiterId));
      } catch (err) {
        console.error("Error deleting recruiter:", err);
        alert("Failed to delete recruiter");
      }
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await API.delete(`/applications/${applicationId}`);
        setApplications(applications.filter(app => (app.id || app._id) !== applicationId));
      } catch (err) {
        console.error("Error deleting application:", err);
        alert("Failed to delete application");
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        // For demo purposes, update localStorage
        // In production, this would be: await API.delete(`/reviews/${reviewId}`);
        const storedReviews = JSON.parse(localStorage.getItem('venus_reviews') || '[]');
        const updatedReviews = storedReviews.filter(review => review._id !== reviewId);
        localStorage.setItem('venus_reviews', JSON.stringify(updatedReviews));
        setReviews(updatedReviews);
      } catch (err) {
        console.error("Error deleting review:", err);
        alert("Failed to delete review");
      }
    }
  };

  const handleToggleReviewStatus = async (reviewId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
      // For demo purposes, update localStorage
      // In production, this would be: await API.put(`/reviews/${reviewId}`, { status: newStatus });
      const storedReviews = JSON.parse(localStorage.getItem('venus_reviews') || '[]');
      const updatedReviews = storedReviews.map(review => 
        review._id === reviewId 
          ? { ...review, status: newStatus }
          : review
      );
      localStorage.setItem('venus_reviews', JSON.stringify(updatedReviews));
      setReviews(updatedReviews);
    } catch (err) {
      console.error("Error updating review status:", err);
      alert("Failed to update review status");
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status, adminNotes) => {
    try {
      await API.patch(`/bookings/${bookingId}/status`, {
        status,
        adminNotes
      });
      // Refresh bookings data
      const { data } = await API.get("/bookings");
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update booking status");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking request?")) {
      try {
        await API.delete(`/bookings/${bookingId}`);
        // Refresh bookings data
        const { data } = await API.get("/bookings");
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Error deleting booking:", err);
        alert("Failed to delete booking");
      }
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name || user?.email}</p>
        </header>

        <div className="dashboard-tabs">
          <button 
            className={activeTab === "jobs" ? "active" : ""}
            onClick={() => setActiveTab("jobs")}
          >
            Jobs ({jobs.length})
          </button>
          <button 
            className={activeTab === "recruiters" ? "active" : ""}
            onClick={() => setActiveTab("recruiters")}
          >
            Recruiters ({recruiters.length})
          </button>
          <button 
            className={activeTab === "applications" ? "active" : ""}
            onClick={() => setActiveTab("applications")}
          >
            Applications ({applications.length})
          </button>
          <button 
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({reviews.length})
          </button>
          <button 
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings ({bookings.length})
          </button>
          <button 
            className={activeTab === "seo" ? "active" : ""}
            onClick={() => setActiveTab("seo")}
          >
            SEO Management
          </button>
          <button 
            className={activeTab === "blogs" ? "active" : ""}
            onClick={() => setActiveTab("blogs")}
          >
            Blogs ({blogs.length})
          </button>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {activeTab === "jobs" && (
                <JobsTab 
                  jobs={jobs}
                  onEdit={(job) => {
                    setEditingJob(job);
                    setShowJobModal(true);
                  }}
                  onDelete={handleDeleteJob}
                  onAdd={() => {
                    setEditingJob(null);
                    setShowJobModal(true);
                  }}
                />
              )}

              {activeTab === "recruiters" && (
                <RecruitersTab 
                  recruiters={recruiters}
                  onEdit={(recruiter) => {
                    setEditingRecruiter(recruiter);
                    setShowRecruiterModal(true);
                  }}
                  onDelete={handleDeleteRecruiter}
                  onAdd={() => {
                    setEditingRecruiter(null);
                    setShowRecruiterModal(true);
                  }}
                />
              )}

              {activeTab === "applications" && (
                <ApplicationsTab 
                  applications={applications}
                  onDelete={handleDeleteApplication}
                />
              )}

              {activeTab === "reviews" && (
                <ReviewsTab 
                  reviews={reviews}
                  onDelete={handleDeleteReview}
                  onToggleStatus={handleToggleReviewStatus}
                />
              )}
              {activeTab === "bookings" && (
                <BookingsTab 
                  bookings={bookings}
                  onUpdateStatus={handleUpdateBookingStatus}
                  onDelete={handleDeleteBooking}
                />
              )}
              {activeTab === "seo" && (
                <SEOTab 
                  seoContent={seoContent}
                  onSave={fetchData}
                />
              )}
              {activeTab === "blogs" && (
                <BlogsTab 
                  blogs={blogs}
                  onSave={fetchData}
                />
              )}
            </>
          )}
        </div>

        {showJobModal && (
          <JobModal
            job={editingJob}
            onClose={() => {
              setShowJobModal(false);
              setEditingJob(null);
            }}
            onSave={() => {
              setShowJobModal(false);
              setEditingJob(null);
              fetchData();
            }}
          />
        )}

        {showRecruiterModal && (
          <RecruiterModal
            recruiter={editingRecruiter}
            onClose={() => {
              setShowRecruiterModal(false);
              setEditingRecruiter(null);
            }}
            onSave={() => {
              setShowRecruiterModal(false);
              setEditingRecruiter(null);
              fetchData();
            }}
          />
        )}
      </div>
    </div>
  );
};

const JobsTab = ({ jobs, onEdit, onDelete, onAdd }) => {
  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Job Management</h2>
        <button className="btn btn-primary" onClick={onAdd}>
          Add New Job
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => {
              const jobId = job.id || job._id;
              return (
              <tr key={jobId}>
                <td>{job.title}</td>
                <td>{job.department}</td>
                <td>{job.location}</td>
                <td>{job.type}</td>
                <td>
                  <span className={`status ${job.isActive ? 'active' : 'inactive'}`}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => onEdit(job)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(jobId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecruitersTab = ({ recruiters, onEdit, onDelete, onAdd }) => {
  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Recruiter Management</h2>
        <button className="btn btn-primary" onClick={onAdd}>
          Add New Recruiter
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recruiters.map(recruiter => {
              const recruiterId = recruiter.id || recruiter._id;
              return (
              <tr key={recruiterId}>
                <td>{recruiter.name}</td>
                <td>{recruiter.email}</td>
                <td>{recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => onEdit(recruiter)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(recruiterId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ApplicationsTab = ({ applications, onDelete }) => {
  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Application Management</h2>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Job</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(application => {
              const appId = application.id || application._id;
              return (
              <tr key={appId}>
                <td>{application.name}</td>
                <td>{application.email}</td>
                <td>{application.jobId?.title || application.job?.title || 'N/A'}</td>
                <td>
                  <span className={`status ${application.status}`}>
                    {application.status}
                  </span>
                </td>
                <td>{application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(appId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const JobModal = ({ job, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    department: job?.department || "",
    location: job?.location || "",
    type: job?.type || "Full-Time",
    description: job?.description || "",
    tags: job?.tags?.join(", ") || "",
    isActive: job?.isActive ?? true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      };

      const jobId = job?.id || job?._id;
      if (jobId) {
        await API.put(`/jobs/${jobId}`, data);
      } else {
        await API.post("/jobs", data);
      }

      onSave();
    } catch (err) {
      console.error("Error saving job:", err);
      alert("Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{job ? "Edit Job" : "Add New Job"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Job Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              required
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="React, JavaScript, Node.js"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
              Active
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RecruiterModal = ({ recruiter, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: recruiter?.name || "",
    email: recruiter?.email || "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { ...formData };
      if (!recruiter && !data.password) {
        alert("Password is required for new recruiters");
        setLoading(false);
        return;
      }

      const recruiterId = recruiter?.id || recruiter?._id;
      if (recruiterId) {
        // Update existing recruiter
        if (data.password) {
          await API.put(`/recruiters/${recruiterId}`, data);
        } else {
          // Don't send password if not provided
          const { password, ...updateData } = data;
          await API.put(`/recruiters/${recruiterId}`, updateData);
        }
      } else {
        // Create new recruiter
        await API.post("/recruiters", data);
      }

      onSave();
    } catch (err) {
      console.error("Error saving recruiter:", err);
      alert("Failed to save recruiter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{recruiter ? "Edit Recruiter" : "Add New Recruiter"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Password {!recruiter && "*"}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required={!recruiter}
              placeholder={recruiter ? "Leave blank to keep current password" : ""}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Recruiter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReviewsTab = ({ reviews, onDelete, onToggleStatus }) => {
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Review Management</h2>
        <div className="review-stats">
          <span className="stat-item">
            Total: {reviews.length}
          </span>
          <span className="stat-item">
            Approved: {reviews.filter(r => r.status === 'approved').length}
          </span>
          <span className="stat-item">
            Pending: {reviews.filter(r => r.status === 'pending').length}
          </span>
        </div>
      </div>

      <div className="reviews-container">
        {reviews.length === 0 ? (
          <div className="empty-state">
            <p>No reviews submitted yet.</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map(review => {
              const reviewId = review.id || review._id;
              return (
              <div key={reviewId} className="review-card">
                <div className="review-header">
                  <div className="review-meta">
                    <h4 className="reviewer-name">{review.name}</h4>
                    <p className="reviewer-company">{review.company}</p>
                    <div className="review-rating">
                      <span className="stars">{renderStars(review.rating)}</span>
                      <span className="rating-number">({review.rating}/5)</span>
                    </div>
                  </div>
                  <div className="review-status">
                    <span className={`status-badge ${review.status}`}>
                      {review.status}
                    </span>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="review-content">
                  <p className="review-text">{review.review}</p>
                </div>
                
                <div className="review-actions">
                  <button 
                    className={`btn btn-sm ${review.status === 'approved' ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => onToggleStatus(reviewId, review.status)}
                  >
                    {review.status === 'approved' ? 'Unapprove' : 'Approve'}
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(reviewId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};

// BookingsTab Component
const BookingsTab = ({ bookings, onUpdateStatus, onDelete }) => {
  const [editingBooking, setEditingBooking] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', adminNotes: '' });

  const handleStatusUpdate = (booking) => {
    setEditingBooking(booking);
    setStatusForm({ 
      status: booking.status, 
      adminNotes: booking.adminNotes || '' 
    });
  };

  const handleSubmitStatus = () => {
    if (editingBooking) {
      const bookingId = editingBooking.id || editingBooking._id;
      onUpdateStatus(bookingId, statusForm.status, statusForm.adminNotes);
      setEditingBooking(null);
      setStatusForm({ status: '', adminNotes: '' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#10b981';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bookings-tab">
      <div className="tab-header">
        <h3>Call Booking Requests</h3>
        <div className="stats">
          <span className="stat-item">
            Total: {bookings.length}
          </span>
          <span className="stat-item">
            Pending: {bookings.filter(b => b.status === 'pending').length}
          </span>
          <span className="stat-item">
            Confirmed: {bookings.filter(b => b.status === 'confirmed').length}
          </span>
          <span className="stat-item">
            Completed: {bookings.filter(b => b.status === 'completed').length}
          </span>
        </div>
      </div>

      <div className="bookings-container">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>No booking requests yet.</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map(booking => {
              const bookingId = booking.id || booking._id;
              return (
              <div key={bookingId} className="booking-card">
                <div className="booking-header">
                  <div className="booking-info">
                    <h4>{booking.name}</h4>
                    <p className="booking-email">{booking.email}</p>
                    {booking.company && <p className="booking-company">{booking.company}</p>}
                  </div>
                  <div 
                    className="booking-status"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{booking.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Call Type:</span>
                    <span className="detail-value">{booking.callType.replace('-', ' ')}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Preferred Date:</span>
                    <span className="detail-value">{formatDate(booking.preferredDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Preferred Time:</span>
                    <span className="detail-value">{formatTime(booking.preferredTime)} ({booking.timezone})</span>
                  </div>
                  {booking.message && (
                    <div className="detail-row">
                      <span className="detail-label">Message:</span>
                      <span className="detail-value">{booking.message}</span>
                    </div>
                  )}
                  {booking.adminNotes && (
                    <div className="detail-row">
                      <span className="detail-label">Admin Notes:</span>
                      <span className="detail-value">{booking.adminNotes}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">Submitted:</span>
                    <span className="detail-value">{formatDate(booking.createdAt)}</span>
                  </div>
                </div>

                <div className="booking-actions">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleStatusUpdate(booking)}
                  >
                    Update Status
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(bookingId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {editingBooking && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Update Booking Status</h3>
              <button 
                className="modal-close"
                onClick={() => setEditingBooking(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Admin Notes:</label>
                <textarea
                  value={statusForm.adminNotes}
                  onChange={(e) => setStatusForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                  rows="3"
                  placeholder="Add any notes about this booking..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setEditingBooking(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// SEO Management Tab Component
const SEOTab = ({ seoContent, onSave }) => {
  const [formData, setFormData] = useState({
    // Homepage Content - Hero Section
    heroGreeting: '',
    heroTitleLine1: '',
    heroTitleLine2: '',
    heroSubtitle: '',
    heroButton1Text: '',
    heroButton1Link: '',
    heroButton2Text: '',
    heroButton2Link: '',
    // Homepage Content - About Section
    aboutTag: '',
    aboutTitle: '',
    aboutDescription: '',
    aboutStatClients: 0,
    aboutStatSatisfaction: 0,
    aboutStatSuccess: 0,
    aboutStatClientsLabel: '',
    aboutStatSatisfactionLabel: '',
    aboutStatSuccessLabel: '',
    aboutCtaText: '',
    aboutCtaLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (seoContent) {
      setFormData({
        // Homepage Content - Hero Section
        heroGreeting: seoContent.heroGreeting || '',
        heroTitleLine1: seoContent.heroTitleLine1 || '',
        heroTitleLine2: seoContent.heroTitleLine2 || '',
        heroSubtitle: seoContent.heroSubtitle || '',
        heroButton1Text: seoContent.heroButton1Text || '',
        heroButton1Link: seoContent.heroButton1Link || '',
        heroButton2Text: seoContent.heroButton2Text || '',
        heroButton2Link: seoContent.heroButton2Link || '',
        // Homepage Content - About Section
        aboutTag: seoContent.aboutTag || '',
        aboutTitle: seoContent.aboutTitle || '',
        aboutDescription: seoContent.aboutDescription || '',
        aboutStatClients: seoContent.aboutStatClients || 0,
        aboutStatSatisfaction: seoContent.aboutStatSatisfaction || 0,
        aboutStatSuccess: seoContent.aboutStatSuccess || 0,
        aboutStatClientsLabel: seoContent.aboutStatClientsLabel || '',
        aboutStatSatisfactionLabel: seoContent.aboutStatSatisfactionLabel || '',
        aboutStatSuccessLabel: seoContent.aboutStatSuccessLabel || '',
        aboutCtaText: seoContent.aboutCtaText || '',
        aboutCtaLink: seoContent.aboutCtaLink || ''
      });
    }
  }, [seoContent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await API.put('/seo', formData);
      setMessage({ type: 'success', text: 'Homepage content saved successfully!' });
      if (onSave) {
        onSave();
      }
      // Reload SEO content
      const { data } = await API.get('/seo');
      setFormData({
        // Homepage Content - Hero Section
        heroGreeting: data.heroGreeting || '',
        heroTitleLine1: data.heroTitleLine1 || '',
        heroTitleLine2: data.heroTitleLine2 || '',
        heroSubtitle: data.heroSubtitle || '',
        heroButton1Text: data.heroButton1Text || '',
        heroButton1Link: data.heroButton1Link || '',
        heroButton2Text: data.heroButton2Text || '',
        heroButton2Link: data.heroButton2Link || '',
        // Homepage Content - About Section
        aboutTag: data.aboutTag || '',
        aboutTitle: data.aboutTitle || '',
        aboutDescription: data.aboutDescription || '',
        aboutStatClients: data.aboutStatClients || 0,
        aboutStatSatisfaction: data.aboutStatSatisfaction || 0,
        aboutStatSuccess: data.aboutStatSuccess || 0,
        aboutStatClientsLabel: data.aboutStatClientsLabel || '',
        aboutStatSatisfactionLabel: data.aboutStatSatisfactionLabel || '',
        aboutStatSuccessLabel: data.aboutStatSuccessLabel || '',
        aboutCtaText: data.aboutCtaText || '',
        aboutCtaLink: data.aboutCtaLink || ''
      });
    } catch (err) {
      console.error('Error saving SEO content:', err);
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save homepage content' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  if (loading) {
    return <div className="loading">Loading SEO content...</div>;
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Homepage Content & SEO Management</h2>
        <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0 }}>
          Edit your homepage content and SEO metadata. Changes will be saved to the database and displayed on the home page.
        </p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`} style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '4px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="seo-form">
        <div className="seo-section">
          <h3>Homepage Content - Hero Section</h3>
          
          <div className="form-group">
            <label>Hero Greeting</label>
            <input
              type="text"
              name="heroGreeting"
              value={formData.heroGreeting}
              onChange={handleChange}
              placeholder="- Empower Your Workforce -"
            />
            <small>Small text above the main title</small>
          </div>

          <div className="form-group">
            <label>Hero Title Line 1</label>
            <input
              type="text"
              name="heroTitleLine1"
              value={formData.heroTitleLine1}
              onChange={handleChange}
              placeholder="Shape the Future of"
            />
            <small>First line of the main hero title</small>
          </div>

          <div className="form-group">
            <label>Hero Title Line 2</label>
            <input
              type="text"
              name="heroTitleLine2"
              value={formData.heroTitleLine2}
              onChange={handleChange}
              placeholder="Your Organization Today"
            />
            <small>Second line of the main hero title</small>
          </div>

          <div className="form-group">
            <label>Hero Subtitle</label>
            <textarea
              name="heroSubtitle"
              value={formData.heroSubtitle}
              onChange={handleChange}
              placeholder="Connect with top-tier talent across Canada..."
              rows={3}
            />
            <small>Description text below the hero title</small>
          </div>

          <div className="form-group">
            <label>Primary Button Text</label>
            <input
              type="text"
              name="heroButton1Text"
              value={formData.heroButton1Text}
              onChange={handleChange}
              placeholder="Book a Consultation"
            />
            <small>Text for the primary CTA button</small>
          </div>

          <div className="form-group">
            <label>Primary Button Link</label>
            <input
              type="text"
              name="heroButton1Link"
              value={formData.heroButton1Link}
              onChange={handleChange}
              placeholder="/book-call"
            />
            <small>Link URL for the primary button</small>
          </div>

          <div className="form-group">
            <label>Secondary Button Text</label>
            <input
              type="text"
              name="heroButton2Text"
              value={formData.heroButton2Text}
              onChange={handleChange}
              placeholder="Our Services"
            />
            <small>Text for the secondary button</small>
          </div>

          <div className="form-group">
            <label>Secondary Button Link</label>
            <input
              type="text"
              name="heroButton2Link"
              value={formData.heroButton2Link}
              onChange={handleChange}
              placeholder="/services"
            />
            <small>Link URL for the secondary button</small>
          </div>
        </div>

        <div className="seo-section">
          <h3>Homepage Content - About Section</h3>
          
          <div className="form-group">
            <label>About Tag</label>
            <input
              type="text"
              name="aboutTag"
              value={formData.aboutTag}
              onChange={handleChange}
              placeholder="ABOUT VENUS HIRING"
            />
            <small>Tag/label above the about section title</small>
          </div>

          <div className="form-group">
            <label>About Title</label>
            <input
              type="text"
              name="aboutTitle"
              value={formData.aboutTitle}
              onChange={handleChange}
              placeholder="Driving Success With An Expert Staffing"
            />
            <small>Main title of the about section</small>
          </div>

          <div className="form-group">
            <label>About Description</label>
            <textarea
              name="aboutDescription"
              value={formData.aboutDescription}
              onChange={handleChange}
              placeholder="At Venus Consultancy, we understand..."
              rows={5}
            />
            <small>Main description text for the about section</small>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Stat 1 - Number</label>
              <input
                type="number"
                name="aboutStatClients"
                value={formData.aboutStatClients}
                onChange={handleChange}
                placeholder="77"
              />
            </div>
            <div className="form-group">
              <label>Stat 2 - Number</label>
              <input
                type="number"
                name="aboutStatSatisfaction"
                value={formData.aboutStatSatisfaction}
                onChange={handleChange}
                placeholder="98"
              />
            </div>
            <div className="form-group">
              <label>Stat 3 - Number</label>
              <input
                type="number"
                name="aboutStatSuccess"
                value={formData.aboutStatSuccess}
                onChange={handleChange}
                placeholder="99"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Stat 1 - Label</label>
              <input
                type="text"
                name="aboutStatClientsLabel"
                value={formData.aboutStatClientsLabel}
                onChange={handleChange}
                placeholder="Trusted Partnerships"
              />
            </div>
            <div className="form-group">
              <label>Stat 2 - Label</label>
              <input
                type="text"
                name="aboutStatSatisfactionLabel"
                value={formData.aboutStatSatisfactionLabel}
                onChange={handleChange}
                placeholder="Client Satisfaction"
              />
            </div>
            <div className="form-group">
              <label>Stat 3 - Label</label>
              <input
                type="text"
                name="aboutStatSuccessLabel"
                value={formData.aboutStatSuccessLabel}
                onChange={handleChange}
                placeholder="Success Rate"
              />
            </div>
          </div>

          <div className="form-group">
            <label>About CTA Button Text</label>
            <input
              type="text"
              name="aboutCtaText"
              value={formData.aboutCtaText}
              onChange={handleChange}
              placeholder="JOIN OUR NETWORK"
            />
            <small>Text for the call-to-action button</small>
          </div>

          <div className="form-group">
            <label>About CTA Button Link</label>
            <input
              type="text"
              name="aboutCtaLink"
              value={formData.aboutCtaLink}
              onChange={handleChange}
              placeholder="/book-call"
            />
            <small>Link URL for the CTA button</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Homepage Content'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Blog Management Tab Component
const BlogsTab = ({ blogs, onSave }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    para1: '',
    para2: '',
    para3: '',
    para4: '',
    conclusion: '',
    excerpt: '',
    tags: '',
    published: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [paraImages, setParaImages] = useState({
    para1: { file: null, preview: null },
    para2: { file: null, preview: null },
    para3: { file: null, preview: null },
    para4: { file: null, preview: null }
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleAdd = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      para1: '',
      para2: '',
      para3: '',
      para4: '',
      conclusion: '',
      excerpt: '',
      tags: '',
      published: false
    });
    setImageFile(null);
    setImagePreview(null);
    setParaImages({
      para1: { file: null, preview: null },
      para2: { file: null, preview: null },
      para3: { file: null, preview: null },
      para4: { file: null, preview: null }
    });
    setShowModal(true);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    
    // Try to parse structured content from JSON
    let parsedContent = {
      para1: '',
      para2: '',
      para3: '',
      para4: '',
      conclusion: '',
      para1Image: null,
      para2Image: null,
      para3Image: null,
      para4Image: null
    };
    
    if (blog.content) {
      try {
        const parsed = JSON.parse(blog.content);
        if (parsed.para1 || parsed.para2) {
          // It's structured content
          parsedContent = parsed;
        } else {
          // Legacy content - put it in para1
          parsedContent.para1 = blog.content;
        }
      } catch (e) {
        // Not JSON, treat as legacy content
        parsedContent.para1 = blog.content;
      }
    }
    
    setFormData({
      title: blog.title || '',
      para1: parsedContent.para1 || '',
      para2: parsedContent.para2 || '',
      para3: parsedContent.para3 || '',
      para4: parsedContent.para4 || '',
      conclusion: parsedContent.conclusion || '',
      excerpt: blog.excerpt || '',
      tags: blog.tags ? (Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags) : '',
      published: blog.published || false
    });
    setImageFile(null);
    setImagePreview(blog.imageUrl || null);
    setParaImages({
      para1: { file: null, preview: parsedContent.para1Image || null },
      para2: { file: null, preview: parsedContent.para2Image || null },
      para3: { file: null, preview: parsedContent.para3Image || null },
      para4: { file: null, preview: parsedContent.para4Image || null }
    });
    setShowModal(true);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    setDeleting(blogId);
    try {
      await API.delete(`/blogs/${blogId}`);
      if (onSave) onSave();
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog');
    } finally {
      setDeleting(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleParaImageChange = (paraNum, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setParaImages(prev => ({
          ...prev,
          [paraNum]: { file: file, preview: reader.result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveParaImage = (paraNum) => {
    setParaImages(prev => ({
      ...prev,
      [paraNum]: { file: null, preview: null }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Build structured content JSON
      const structuredContent = {
        para1: formData.para1 || '',
        para2: formData.para2 || '',
        para3: formData.para3 || '',
        para4: formData.para4 || '',
        conclusion: formData.conclusion || '',
        para1Image: paraImages.para1.preview || null,
        para2Image: paraImages.para2.preview || null,
        para3Image: paraImages.para3.preview || null,
        para4Image: paraImages.para4.preview || null
      };

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', JSON.stringify(structuredContent));
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('published', formData.published ? 'true' : 'false');

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (!imagePreview && editingBlog) {
        // If no image preview and editing, delete the image
        formDataToSend.append('deleteImage', 'true');
      }

      if (editingBlog) {
        await API.put(`/blogs/${editingBlog.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await API.post('/blogs', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowModal(false);
      if (onSave) onSave();
    } catch (err) {
      console.error('Error saving blog:', err);
      alert('Failed to save blog: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Blog Management</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          Add New Blog
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Author</th>
              <th>Status</th>
              <th>Views</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(blog => {
              const blogId = blog.id || blog._id;
              return (
                <tr key={blogId}>
                  <td>
                    {blog.imageUrl ? (
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <span style={{ color: '#999' }}>No image</span>
                    )}
                  </td>
                  <td>{blog.title}</td>
                  <td>
                    <a 
                      href={`/blog/${blog.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#007bff', textDecoration: 'none' }}
                    >
                      {blog.slug}
                    </a>
                  </td>
                  <td>{blog.authorName || 'Admin'}</td>
                  <td>
                    <span className={`status ${blog.published ? 'active' : 'inactive'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{blog.views || 0}</td>
                  <td>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleEdit(blog)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(blogId)}
                      disabled={deleting === blogId}
                    >
                      {deleting === blogId ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>{editingBlog ? 'Edit Blog' : 'Add New Blog'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Blog post title"
                />
              </div>

              <div className="form-group">
                <label>Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={3}
                  placeholder="Short description of the blog post"
                />
                <small>Brief summary (will be auto-generated from content if left empty)</small>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="tag1, tag2, tag3"
                />
                <small>Comma-separated tags</small>
              </div>

              <div className="form-group">
                <label>Featured Image</label>
                {imagePreview && (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                    />
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn btn-sm btn-danger"
                      style={{ marginTop: '0.5rem' }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small>Upload a featured image for the blog post</small>
              </div>

              <div className="form-group">
                <label>Paragraph 1 *</label>
                <textarea
                  value={formData.para1}
                  onChange={(e) => setFormData({...formData, para1: e.target.value})}
                  required
                  rows={5}
                  placeholder="First paragraph content"
                />
              </div>

              <div className="form-group">
                <label>Image 1</label>
                {paraImages.para1.preview && (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={paraImages.para1.preview} 
                      alt="Para 1 Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                    />
                    <button 
                      type="button"
                      onClick={() => handleRemoveParaImage('para1')}
                      className="btn btn-sm btn-danger"
                      style={{ marginTop: '0.5rem' }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleParaImageChange('para1', e)}
                />
                <small>Upload image for paragraph 1</small>
              </div>

              <div className="form-group">
                <label>Paragraph 2 *</label>
                <textarea
                  value={formData.para2}
                  onChange={(e) => setFormData({...formData, para2: e.target.value})}
                  required
                  rows={5}
                  placeholder="Second paragraph content"
                />
              </div>

              <div className="form-group">
                <label>Image 2</label>
                {paraImages.para2.preview && (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={paraImages.para2.preview} 
                      alt="Para 2 Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                    />
                    <button 
                      type="button"
                      onClick={() => handleRemoveParaImage('para2')}
                      className="btn btn-sm btn-danger"
                      style={{ marginTop: '0.5rem' }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleParaImageChange('para2', e)}
                />
                <small>Upload image for paragraph 2</small>
              </div>

              <div className="form-group">
                <label>Paragraph 3 *</label>
                <textarea
                  value={formData.para3}
                  onChange={(e) => setFormData({...formData, para3: e.target.value})}
                  required
                  rows={5}
                  placeholder="Third paragraph content"
                />
              </div>

              <div className="form-group">
                <label>Image 3</label>
                {paraImages.para3.preview && (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={paraImages.para3.preview} 
                      alt="Para 3 Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                    />
                    <button 
                      type="button"
                      onClick={() => handleRemoveParaImage('para3')}
                      className="btn btn-sm btn-danger"
                      style={{ marginTop: '0.5rem' }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleParaImageChange('para3', e)}
                />
                <small>Upload image for paragraph 3</small>
              </div>

              <div className="form-group">
                <label>Paragraph 4 *</label>
                <textarea
                  value={formData.para4}
                  onChange={(e) => setFormData({...formData, para4: e.target.value})}
                  required
                  rows={5}
                  placeholder="Fourth paragraph content"
                />
              </div>

              <div className="form-group">
                <label>Image 4</label>
                {paraImages.para4.preview && (
                  <div style={{ marginBottom: '1rem' }}>
                    <img 
                      src={paraImages.para4.preview} 
                      alt="Para 4 Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                    />
                    <button 
                      type="button"
                      onClick={() => handleRemoveParaImage('para4')}
                      className="btn btn-sm btn-danger"
                      style={{ marginTop: '0.5rem' }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleParaImageChange('para4', e)}
                />
                <small>Upload image for paragraph 4</small>
              </div>

              <div className="form-group">
                <label>Conclusion *</label>
                <textarea
                  value={formData.conclusion}
                  onChange={(e) => setFormData({...formData, conclusion: e.target.value})}
                  required
                  rows={5}
                  placeholder="Conclusion content"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  />
                  Published
                </label>
                <small>Check to publish the blog post immediately</small>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
