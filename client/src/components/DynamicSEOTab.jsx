// client/src/components/DynamicSEOTab.jsx
import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { pageSchemas, getPageSchema, getAllPagePaths, getIndustrySlugs, getBlogSlugs, getJobRoleKeys, getServiceCategoryKeys } from '../config/pageSchemas';
import './DynamicSEOTab.css';

const DynamicSEOTab = ({ onSave }) => {
  const [selectedPage, setSelectedPage] = useState('/');
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [pageContent, setPageContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [allPages, setAllPages] = useState([]);
  const [industrySlugs, setIndustrySlugs] = useState([]);
  const [blogSlugs, setBlogSlugs] = useState([]);
  const [jobRoleKeys, setJobRoleKeys] = useState([]);
  const [serviceCategoryKeys, setServiceCategoryKeys] = useState([]);

  useEffect(() => {
    // Load all available pages
    const pages = getAllPagePaths();
    setAllPages(pages);
    
    // Load dynamic route data
    loadDynamicRoutes();
    
    // Load content for selected page
    loadPageContent(selectedPage);
  }, []);
  
  const loadDynamicRoutes = async () => {
    const [industries, blogs, jobRoles, categories] = await Promise.all([
      getIndustrySlugs(),
      getBlogSlugs(),
      getJobRoleKeys(),
      getServiceCategoryKeys()
    ]);
    setIndustrySlugs(industries);
    setBlogSlugs(blogs);
    setJobRoleKeys(jobRoles);
    setServiceCategoryKeys(categories);
  };

  useEffect(() => {
    // Update selected page when industry changes
    if (selectedIndustry) {
      const newPath = `/industry/${selectedIndustry}`;
      setSelectedPage(newPath);
      loadPageContent(newPath);
    }
  }, [selectedIndustry]);

  useEffect(() => {
    loadPageContent(selectedPage);
  }, [selectedPage]);


  const loadPageContent = async (pagePath) => {
    setLoading(true);
    try {
      // Try to load page-specific SEO content
      const encodedPath = encodeURIComponent(pagePath);
      const { data } = await API.get(`/seo/page/${encodedPath}`);
      setPageContent(data || {});
    } catch (err) {
      // If no page-specific content exists, start with empty object
      setPageContent({});
    } finally {
      setLoading(false);
    }
  };

  const getNestedValue = (obj, path) => {
    if (!path) return undefined;
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const newObj = { ...obj };
    let current = newObj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    return newObj;
  };

  const handleFieldChange = (fieldPath, value) => {
    setPageContent(prev => setNestedValue(prev, fieldPath, value));
  };

  const handleArrayItemChange = (arrayPath, index, fieldKey, value) => {
    setPageContent(prev => {
      const newContent = { ...prev };
      const keys = arrayPath.split('.');
      let current = newContent;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      if (!current[keys[keys.length - 1]]) {
        current[keys[keys.length - 1]] = [];
      }
      
      if (!current[keys[keys.length - 1]][index]) {
        current[keys[keys.length - 1]][index] = {};
      }
      
      current[keys[keys.length - 1]][index][fieldKey] = value;
      return newContent;
    });
  };

  const handleArrayItemAdd = (arrayPath, itemFields) => {
    setPageContent(prev => {
      const newContent = { ...prev };
      const keys = arrayPath.split('.');
      let current = newContent;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      if (!current[keys[keys.length - 1]]) {
        current[keys[keys.length - 1]] = [];
      }
      
      const newItem = {};
      itemFields.forEach(f => {
        newItem[f.key] = '';
      });
      
      current[keys[keys.length - 1]] = [...current[keys[keys.length - 1]], newItem];
      return newContent;
    });
  };

  const handleArrayItemRemove = (arrayPath, index) => {
    setPageContent(prev => {
      const newContent = { ...prev };
      const keys = arrayPath.split('.');
      let current = newContent;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      if (current[keys[keys.length - 1]]) {
        current[keys[keys.length - 1]] = current[keys[keys.length - 1]].filter((_, i) => i !== index);
      }
      
      return newContent;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const encodedPath = encodeURIComponent(selectedPage);
      // Save to Firebase database - this persists across reloads and deployments
      await API.put(`/seo/page/${encodedPath}`, {
        ...pageContent,
        pagePath: selectedPage
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Page content saved successfully! Changes are now live and will persist across reloads and deployments.' 
      });
      
      // Reload the content to show the saved data
      await loadPageContent(selectedPage);
      
      if (onSave) onSave();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to save content. Please try again.' 
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const renderField = (field, value, onChange) => {
    const fieldValue = value || '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={fieldValue}
            onChange={(e) => onChange(field.path || field.key, e.target.value)}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            className="seo-field-input"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={fieldValue}
            onChange={(e) => onChange(field.path || field.key, e.target.value)}
            placeholder={field.placeholder}
            className="seo-field-input"
          />
        );
      default:
        return (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => onChange(field.path || field.key, e.target.value)}
            placeholder={field.placeholder}
            className="seo-field-input"
          />
        );
    }
  };

  const renderArrayField = (field, arrayValue) => {
    const items = arrayValue || [];
    
    return (
      <div className="seo-array-field">
        {items.map((item, index) => (
          <div key={index} className="seo-array-item">
            <div className="seo-array-item-header">
              <h4>Item {index + 1}</h4>
              <button 
                type="button"
                className="seo-array-item-remove"
                onClick={() => handleArrayItemRemove(field.path || field.key, index)}
              >
                Remove
              </button>
            </div>
            <div className="seo-array-item-fields">
              {field.itemFields.map(itemField => (
                <div key={itemField.key} className="seo-form-group">
                  <label>{itemField.label}</label>
                  {renderField(itemField, item[itemField.key], (key, value) => 
                    handleArrayItemChange(field.path || field.key, index, key, value)
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="seo-array-item-add"
          onClick={() => handleArrayItemAdd(field.path || field.key, field.itemFields)}
        >
          + Add Item
        </button>
      </div>
    );
  };

  const schema = getPageSchema(selectedPage);

  if (loading) {
    return <div className="loading">Loading page content...</div>;
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Dynamic Page Content Management</h2>
        <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0 }}>
          Edit content for any page on your website. Changes will be saved to the database and displayed on the respective pages.
        </p>
      </div>

      {/* Page Selector */}
      <div className="seo-page-selector">
        <div className="seo-form-group">
          <label>Select Page Type</label>
          <select 
            value={selectedPage} 
            onChange={(e) => {
              setSelectedPage(e.target.value);
              setSelectedIndustry(null);
            }}
            className="seo-field-input"
          >
            {allPages.filter(page => !page.schema.dynamic).map(page => (
              <option key={page.pattern} value={page.pattern}>
                {page.schema.name} ({page.pattern})
              </option>
            ))}
            {allPages.filter(page => page.schema.dynamic).map(page => {
              let dynamicItems = [];
              
              if (page.pattern === '/industry/:industrySlug') {
                dynamicItems = industrySlugs.map(item => ({
                  value: item.path,
                  label: item.title
                }));
              } else if (page.pattern === '/blog/:slug') {
                dynamicItems = blogSlugs.map(item => ({
                  value: item.path,
                  label: item.title || item.slug
                }));
              } else if (page.pattern === '/hiring/:jobRole') {
                dynamicItems = jobRoleKeys.map(item => ({
                  value: item.path,
                  label: item.title
                }));
              } else if (page.pattern === '/service-category/:categoryKey') {
                dynamicItems = serviceCategoryKeys.map(item => ({
                  value: item.path,
                  label: item.title || item.key
                }));
              }
              
              if (dynamicItems.length > 0) {
                return (
                  <optgroup key={page.pattern} label={page.schema.name}>
                    {dynamicItems.map(item => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </optgroup>
                );
              }
              return null;
            })}
          </select>
        </div>
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

      {schema ? (
        <form onSubmit={handleSave} className="seo-form">
          {Object.entries(schema.sections).map(([sectionKey, section]) => (
            <div key={sectionKey} className="seo-section">
              <h3>{section.title}</h3>
              {section.fields.map(field => {
                const fieldValue = getNestedValue(pageContent, field.path || field.key);
                
                if (field.array && field.itemFields) {
                  return (
                    <div key={field.key} className="seo-form-group">
                      <label>{field.label}</label>
                      {renderArrayField(field, fieldValue)}
                      {field.description && <small>{field.description}</small>}
                    </div>
                  );
                }
                
                return (
                  <div key={field.key} className="seo-form-group">
                    <label>{field.label}</label>
                    {renderField(field, fieldValue, handleFieldChange)}
                    {field.description && <small>{field.description}</small>}
                  </div>
                );
              })}
            </div>
          ))}
          
          <div className="seo-form-actions">
            <button type="submit" disabled={saving} className="seo-save-button">
              {saving ? 'Saving...' : 'Save Page Content'}
            </button>
          </div>
        </form>
      ) : (
        <div className="seo-no-schema">
          <p>No schema defined for this page. Add it to <code>pageSchemas.js</code></p>
        </div>
      )}
    </div>
  );
};

export default DynamicSEOTab;

