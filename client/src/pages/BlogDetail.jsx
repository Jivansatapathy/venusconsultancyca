// client/src/pages/BlogDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/blogs/slug/${slug}`);
        setBlog(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-error">
        <h2>Blog Not Found</h2>
        <p>The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Parse structured content
  const parseContent = () => {
    if (!blog.content) return null;
    
    try {
      const parsed = JSON.parse(blog.content);
      // Check if it's structured content (has para1 property)
      if (parsed.para1 !== undefined) {
        return parsed;
      }
    } catch (e) {
      // Not JSON, treat as legacy content
    }
    
    return null;
  };

  const structuredContent = parseContent();

  return (
    <div className="blog-detail">
      <article className="blog-detail-container">
        {/* Header */}
        <header className="blog-detail-header">
          <Link to="/" className="blog-back-link">← Back to Home</Link>
          <h1 className="blog-detail-title">{blog.title}</h1>
          <div className="blog-detail-meta">
            <span className="blog-author">By {blog.authorName || 'Admin'}</span>
            <span className="blog-date">{formatDate(blog.createdAt)}</span>
            {blog.views && <span className="blog-views">{blog.views} views</span>}
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-tags">
              {blog.tags.map((tag, index) => (
                <span key={index} className="blog-tag">{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {blog.imageUrl && (
          <div className="blog-detail-image">
            <img src={blog.imageUrl} alt={blog.title} />
          </div>
        )}

        {/* Excerpt */}
        {blog.excerpt && (
          <div className="blog-detail-excerpt">
            <p>{blog.excerpt}</p>
          </div>
        )}

        {/* Content */}
        <div className="blog-detail-content">
          {structuredContent ? (
            <>
              {/* Paragraph 1 */}
              {structuredContent.para1 && (
                <div className="blog-paragraph">
                  <p style={{ whiteSpace: 'pre-wrap' }}>{structuredContent.para1}</p>
                </div>
              )}
              
              {/* Image 1 */}
              {structuredContent.para1Image && (
                <div className="blog-detail-image">
                  <img src={structuredContent.para1Image} alt="Paragraph 1" />
                </div>
              )}

              {/* Paragraph 2 */}
              {structuredContent.para2 && (
                <div className="blog-paragraph">
                  <p style={{ whiteSpace: 'pre-wrap' }}>{structuredContent.para2}</p>
                </div>
              )}
              
              {/* Image 2 */}
              {structuredContent.para2Image && (
                <div className="blog-detail-image">
                  <img src={structuredContent.para2Image} alt="Paragraph 2" />
                </div>
              )}

              {/* Paragraph 3 */}
              {structuredContent.para3 && (
                <div className="blog-paragraph">
                  <p style={{ whiteSpace: 'pre-wrap' }}>{structuredContent.para3}</p>
                </div>
              )}
              
              {/* Image 3 */}
              {structuredContent.para3Image && (
                <div className="blog-detail-image">
                  <img src={structuredContent.para3Image} alt="Paragraph 3" />
                </div>
              )}

              {/* Paragraph 4 */}
              {structuredContent.para4 && (
                <div className="blog-paragraph">
                  <p style={{ whiteSpace: 'pre-wrap' }}>{structuredContent.para4}</p>
                </div>
              )}
              
              {/* Image 4 */}
              {structuredContent.para4Image && (
                <div className="blog-detail-image">
                  <img src={structuredContent.para4Image} alt="Paragraph 4" />
                </div>
              )}

              {/* Conclusion */}
              {structuredContent.conclusion && (
                <div className="blog-paragraph blog-conclusion">
                  <p style={{ whiteSpace: 'pre-wrap' }}>{structuredContent.conclusion}</p>
                </div>
              )}
            </>
          ) : (
            // Legacy content display
            <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
          )}
        </div>

        {/* Footer */}
        <footer className="blog-detail-footer">
          <Link to="/" className="btn btn-outline">← Back to Home</Link>
        </footer>
      </article>
    </div>
  );
};

export default BlogDetail;

