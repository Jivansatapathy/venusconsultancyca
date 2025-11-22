// client/src/components/BlogSection.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./BlogSection.css";
import API from "../utils/api";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await API.get('/blogs?limit=3');
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="vh-blog" aria-labelledby="vh-blog-heading">
        <div className="vh-blog__card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading blogs...</div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null; // Don't show section if no blogs
  }

  return (
    <section className="vh-blog" aria-labelledby="vh-blog-heading">
      <div className="vh-blog__card">
        <header className="vh-blog__header">
          <h2 id="vh-blog-heading" className="vh-blog__heading">Insights & Articles</h2>
          <p className="vh-blog__sub">
            Latest thinking on hiring, talent strategy and interview best practices from the Venus Hiring team.
          </p>
        </header>

        <div className="vh-blog__grid">
          {blogs.map((blog) => (
            <article key={blog.id || blog._id} className="vh-blog__item">
              <Link to={`/blog/${blog.slug}`} className="vh-blog__media-link" aria-label={`Read full article: ${blog.title}`}>
                <div className="vh-blog__media">
                  {blog.imageUrl ? (
                    <img src={blog.imageUrl} alt={blog.title} loading="lazy" decoding="async" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f2f5f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                      No Image
                    </div>
                  )}
                </div>
              </Link>

              <div className="vh-blog__content">
                {blog.tags && blog.tags.length > 0 && (
                  <div className="vh-blog__meta">
                    {blog.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="vh-blog__tag">{tag}</span>
                    ))}
                  </div>
                )}

                <h3 className="vh-blog__title">
                  <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h3>

                <p className="vh-blog__excerpt">{blog.excerpt || blog.content?.substring(0, 150) + '...'}</p>

                <Link to={`/blog/${blog.slug}`} className="vh-blog__readlink">
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="vh-blog__more">
          <Link to="/blogs" className="btn btn--primary">View all articles</Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
