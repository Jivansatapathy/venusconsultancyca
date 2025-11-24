// client/src/pages/Privacy.jsx
import React from "react";
import "./Privacy.css";

const Privacy = () => {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-last-updated">Last Updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2 className="legal-section-title">1. Introduction</h2>
            <p>
              Venus Hiring ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us. This policy complies with the Personal Information Protection and Electronic Documents Act (PIPEDA) and other applicable Canadian privacy laws.
            </p>
            <p>
              By using our services, you consent to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">2. Information We Collect</h2>
            
            <h3 className="legal-subsection-title">2.1 Personal Information</h3>
            <p>We may collect the following types of personal information:</p>
            <ul>
              <li><strong>Contact Information:</strong> Name, email address, phone number, mailing address</li>
              <li><strong>Professional Information:</strong> Resume, work history, education, skills, certifications, references</li>
              <li><strong>Employment Information:</strong> Job preferences, salary expectations, availability, work authorization status</li>
              <li><strong>Account Information:</strong> Username, password, account preferences</li>
              <li><strong>Communication Records:</strong> Correspondence, interview notes, feedback</li>
            </ul>

            <h3 className="legal-subsection-title">2.2 Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul>
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>To provide recruitment and talent placement services</li>
              <li>To match candidates with job opportunities</li>
              <li>To communicate with you about job opportunities, services, and updates</li>
              <li>To process job applications and manage the hiring process</li>
              <li>To improve our services and website functionality</li>
              <li>To comply with legal obligations and protect our rights</li>
              <li>To send marketing communications (with your consent)</li>
              <li>To analyze website usage and trends</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">4. Disclosure of Information</h2>
            <p>We may share your personal information in the following circumstances:</p>
            <ul>
              <li><strong>With Employers:</strong> We share candidate information with potential employers for job placement purposes</li>
              <li><strong>Service Providers:</strong> We may share information with third-party service providers who assist us in operating our business</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests</li>
              <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">6. Your Rights</h2>
            <p>Under Canadian privacy laws, you have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Withdraw consent for certain uses of your information</li>
              <li>Request deletion of your personal information (subject to legal requirements)</li>
              <li>File a complaint with the Privacy Commissioner of Canada</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie preferences through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">9. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">11. Contact Us</h2>
            <p>If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:</p>
            <div className="legal-contact-info">
              <p><strong>Venus Hiring</strong></p>
              <p>#205 - 1085 Bellamy Road North</p>
              <p>Toronto, ON, Canada</p>
              <p>Email: <a href="mailto:info@venushiring.com">info@venushiring.com</a></p>
              <p>Phone: <a href="tel:647-722-0837">647-722-0837</a></p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;

