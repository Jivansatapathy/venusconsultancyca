// client/src/pages/Terms.jsx
import React from "react";
import { usePageSEO } from "../hooks/usePageSEO";
import "./Terms.css";

const Terms = () => {
  const { pageSEO, getNestedValue } = usePageSEO('/terms');
  
  const pageTitle = getNestedValue(pageSEO, 'header.title') || 'Terms of Service';
  const lastUpdated = getNestedValue(pageSEO, 'header.lastUpdated') || new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  const contentSections = getNestedValue(pageSEO, 'content.sections') || [];

  // Default content if no SEO content
  const defaultSections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using the services provided by Venus Hiring ("we," "our," or "us"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use our services.\n\nThese Terms constitute a legally binding agreement between you and Venus Hiring. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting on our website.'
    }
  ];

  const sections = contentSections.length > 0 ? contentSections : defaultSections;

  return (
    <main className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1 className="legal-title">{pageTitle}</h1>
          <p className="legal-last-updated">Last Updated: {lastUpdated}</p>
        </div>

        <div className="legal-content">
          {sections.map((section, index) => (
            <section key={index} className="legal-section">
              <h2 className="legal-section-title">{section.title}</h2>
              {section.content.split('\n').map((paragraph, pIndex) => (
                paragraph.trim() && (
                  <p key={pIndex}>{paragraph}</p>
                )
              ))}
            </section>
          ))}

          <section className="legal-section">
            <h2 className="legal-section-title">2. Description of Services</h2>
            <p>
              Venus Hiring provides recruitment and talent placement services, connecting job seekers with employers across Canada. Our services include but are not limited to:
            </p>
            <ul>
              <li>Job posting and listing services</li>
              <li>Candidate screening and matching</li>
              <li>Resume and application management</li>
              <li>Interview coordination and scheduling</li>
              <li>Career counseling and guidance</li>
              <li>Employer recruitment solutions</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">3. User Accounts and Registration</h2>
            <p>
              To access certain features of our services, you may be required to create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information to keep it accurate</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent or illegal activities.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">4. User Conduct and Responsibilities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our services for any unlawful purpose or in violation of any applicable laws</li>
              <li>Impersonate any person or entity or misrepresent your identity</li>
              <li>Upload false, misleading, or fraudulent information</li>
              <li>Interfere with or disrupt the operation of our services</li>
              <li>Attempt to gain unauthorized access to our systems or data</li>
              <li>Use automated systems to access our services without permission</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate any intellectual property rights</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">5. Job Seekers</h2>
            <h3 className="legal-subsection-title">5.1 Responsibilities</h3>
            <p>As a job seeker, you agree to:</p>
            <ul>
              <li>Provide accurate and truthful information in your profile and applications</li>
              <li>Maintain the confidentiality of any job opportunities shared with you</li>
              <li>Attend scheduled interviews and respond to communications in a timely manner</li>
              <li>Notify us of any changes to your availability or job preferences</li>
            </ul>

            <h3 className="legal-subsection-title">5.2 No Guarantee of Placement</h3>
            <p>
              We do not guarantee job placement or employment opportunities. Our services facilitate connections between job seekers and employers, but we cannot guarantee that you will be selected for any position or that any employer will offer you employment.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">6. Employers</h2>
            <h3 className="legal-subsection-title">6.1 Responsibilities</h3>
            <p>As an employer, you agree to:</p>
            <ul>
              <li>Provide accurate job descriptions and requirements</li>
              <li>Comply with all applicable employment and labor laws in Canada</li>
              <li>Conduct fair and non-discriminatory hiring practices</li>
              <li>Respect candidate privacy and confidentiality</li>
              <li>Honor any agreements made regarding candidate referrals</li>
            </ul>

            <h3 className="legal-subsection-title">6.2 Fees and Payment</h3>
            <p>
              Certain employer services may be subject to fees. All fees will be clearly disclosed before you commit to a service. Payment terms, including refund policies, will be specified in separate service agreements.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">7. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, images, and software, is the property of Venus Hiring or its licensors and is protected by Canadian and international copyright and trademark laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, or create derivative works from our content without our express written permission.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">8. Privacy</h2>
            <p>
              Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Venus Hiring shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of our services.
            </p>
            <p>
              Our total liability for any claims arising from these Terms or our services shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Venus Hiring, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of our services, violation of these Terms, or infringement of any rights of another party.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to our services at any time, with or without cause or notice, for any reason, including violation of these Terms.
            </p>
            <p>
              You may terminate your account at any time by contacting us or using the account deletion features available on our website.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions. Any disputes arising from these Terms or our services shall be subject to the exclusive jurisdiction of the courts of Ontario.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">13. Dispute Resolution</h2>
            <p>
              Before initiating any legal proceedings, you agree to first contact us to attempt to resolve any dispute amicably. If a resolution cannot be reached, disputes will be resolved through binding arbitration or in the courts of Ontario, as applicable.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">14. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">15. Contact Us</h2>
            <p>If you have questions about these Terms of Service, please contact us:</p>
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

export default Terms;

