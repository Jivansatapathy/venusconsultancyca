// client/src/components/ContactSection.jsx
import React from "react";
import "./ContactSection.css";

/**
 * ContactSection - displays office locations and contact information
 */
const ContactSection = () => {
  const offices = [
    {
      title: "Toronto, Canada",
      flag: "https://flagcdn.com/w40/ca.png",
      flagWrapperClass: "office-flag-wrapper--canada",
      address: "#205 - 1085 Bellamy Road North, Toronto, ON",
      phones: ["647-722-0837"]
    },
    {
      title: "Michigan, USA",
      flag: "https://flagcdn.com/w40/us.png",
      flagWrapperClass: "office-flag-wrapper--usa",
      address: "880 W Long Lake Rd Ste 225 | Troy, MI 48098",
      phones: ["248-275-1077", "718-715-0770"]
    },
    {
      title: "India",
      flag: "https://flagcdn.com/w40/in.png",
      flagWrapperClass: "office-flag-wrapper--india",
      address: "Mumbai, Surat, Chennai, Hyderabad",
      phones: ["+91-261-2601177", "+91-261-391177"]
    }
  ];

  return (
    <section className="contact-section" aria-label="Contact information">
      <div className="contact-container">
        <h3 className="contact-title">Our Office Locations</h3>
        <p className="contact-subtitle">Connect with us across Canada and beyond—serving businesses from coast to coast</p>
        
        <div className="offices-grid">
          {offices.map((office, index) => (
            <div key={index} className="office-card">
              <div className="office-header">
                <div className={`office-flag-wrapper ${office.flagWrapperClass}`}>
                  <img 
                    src={office.flag} 
                    alt={`${office.title} flag`}
                    className="office-flag"
                  />
                </div>
                <h4 className="office-title">{office.title}</h4>
              </div>
              
              <div className="office-details">
                <div className="office-detail-item">
                  <svg className="office-icon office-icon--green" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="office-address">{office.address}</span>
                </div>
                
                {office.phones.map((phone, idx) => (
                  <div key={idx} className="office-detail-item">
                    <svg className="office-icon office-icon--green" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.08 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.81.3 1.61.54 2.39a2 2 0 0 1-.45 2.11L9.1 10.9a16 16 0 0 0 6 6l1.68-1.01a2 2 0 0 1 2.11-.45c.78.24 1.58.42 2.39.54A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="office-phone">{phone}</a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
