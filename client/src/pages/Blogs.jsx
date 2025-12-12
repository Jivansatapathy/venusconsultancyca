// client/src/pages/Blogs.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { usePageSEO } from "../hooks/usePageSEO";
import "./Blogs.css";

const Blogs = () => {
  const { pageSEO, getNestedValue } = usePageSEO('/blogs');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const heroTitle = getNestedValue(pageSEO, 'hero.title') || 'Insights & Articles';
  const heroSubtitle = getNestedValue(pageSEO, 'hero.subtitle') || 'Latest thinking on hiring, talent strategy and interview best practices from the Venus Hiring team.';
  const heroDescription = getNestedValue(pageSEO, 'hero.description') || '';
  const emptyTitle = getNestedValue(pageSEO, 'empty.title') || 'No blog posts available at the moment.';
  const emptyMessage = getNestedValue(pageSEO, 'empty.message') || '';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/blogs');
        setBlogs(data.blogs || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="blogs-page">
        <div className="blogs-container">
          <div className="blogs-loading">Loading blogs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blogs-page">
        <div className="blogs-container">
          <div className="blogs-error">
            <h2>Error Loading Blogs</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blogs-page">
      <div className="blogs-container">
        <header className="blogs-header">
          <h1>{heroTitle}</h1>
          <p className="blogs-subtitle">{heroSubtitle}</p>
          {heroDescription && <p style={{ marginTop: '1rem', fontSize: '1rem' }}>{heroDescription}</p>}
        </header>

        {blogs.length === 0 ? (
          <div className="blogs-empty">
            <p>{emptyTitle}</p>
            {emptyMessage && <p style={{ marginTop: '0.5rem' }}>{emptyMessage}</p>}
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <article key={blog.id || blog._id} className="blog-card">
                <Link to={`/blog/${blog.slug}`} className="blog-card-link">
                  <div className="blog-card-image">
                    {blog.imageUrl ? (
                      <img src={blog.imageUrl} alt={blog.title} loading="lazy" />
                    ) : (
                      <div className="blog-card-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="blog-card-content">
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="blog-card-tags">
                        {blog.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="blog-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <h2 className="blog-card-title">{blog.title}</h2>
                    <p className="blog-card-excerpt">
                      {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                    </p>
                    <div className="blog-card-meta">
                      <span className="blog-author">{blog.authorName || 'Admin'}</span>
                      {blog.createdAt && (
                        <span className="blog-date">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    <span className="blog-read-more">Read more →</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;

