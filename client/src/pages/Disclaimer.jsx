// client/src/pages/Disclaimer.jsx
import React from "react";
import "./Disclaimer.css";

const Disclaimer = () => {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1 className="legal-title">Disclaimer</h1>
          <p className="legal-last-updated">Last Updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2 className="legal-section-title">1. General Information</h2>
            <p>
              The information contained on the Venus Hiring website and in our services is provided on an "as is" basis. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on our website.
            </p>
            <p>
              Any reliance you place on such information is strictly at your own risk. We will not be liable for any loss or damage, including without limitation, indirect or consequential loss or damage, arising from the use of or reliance on any information provided through our services.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">2. No Employment Guarantee</h2>
            <p>
              Venus Hiring is a recruitment and talent placement service provider. We facilitate connections between job seekers and employers but do not guarantee:
            </p>
            <ul>
              <li>Job placement or employment opportunities</li>
              <li>That any candidate will be selected for a position</li>
              <li>That any employer will offer employment to any candidate</li>
              <li>The suitability of any job opportunity for any candidate</li>
              <li>The accuracy of job descriptions or employer information</li>
            </ul>
            <p>
              Job seekers are responsible for evaluating job opportunities and making their own decisions regarding employment. Employers are responsible for their hiring decisions and compliance with applicable employment laws.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">3. Third-Party Information</h2>
            <p>
              Our website may contain information provided by third parties, including employers, job seekers, and other service providers. We do not verify, endorse, or assume responsibility for the accuracy, completeness, or reliability of any third-party information.
            </p>
            <p>
              We are not responsible for the content, privacy practices, or terms of service of any third-party websites or services that may be linked from our website.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">4. Professional Advice</h2>
            <p>
              The information provided through our services is for general informational purposes only and does not constitute professional advice, including but not limited to:
            </p>
            <ul>
              <li>Legal advice</li>
              <li>Financial advice</li>
              <li>Career counseling (beyond general guidance)</li>
              <li>Immigration advice</li>
              <li>Tax advice</li>
            </ul>
            <p>
              You should consult with qualified professionals for advice specific to your situation. We are not licensed to provide legal, financial, immigration, or other professional services.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">5. Immigration and Work Authorization</h2>
            <p>
              While we may provide general information about work authorization requirements in Canada, we are not immigration consultants or lawyers. We cannot and do not provide:
            </p>
            <ul>
              <li>Immigration legal advice</li>
              <li>Work permit application assistance</li>
              <li>Permanent residency guidance</li>
              <li>LMIA (Labour Market Impact Assessment) services</li>
            </ul>
            <p>
              For immigration-related matters, you should consult with a licensed immigration consultant or immigration lawyer registered with the Immigration Consultants of Canada Regulatory Council (ICCRC) or a member of a provincial law society.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">6. Service Availability</h2>
            <p>
              We do not guarantee that our services will be available at all times or that they will be uninterrupted, secure, or error-free. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without notice.
            </p>
            <p>
              We are not responsible for any technical issues, including but not limited to server downtime, network problems, or software errors that may affect your ability to access or use our services.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">7. Candidate and Employer Verification</h2>
            <p>
              While we make reasonable efforts to verify information provided by candidates and employers, we cannot guarantee the accuracy, completeness, or authenticity of all information. Users are responsible for:
            </p>
            <ul>
              <li>Verifying candidate qualifications and references</li>
              <li>Conducting background checks where appropriate</li>
              <li>Verifying employer legitimacy and job opportunities</li>
              <li>Ensuring compliance with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Venus Hiring, its officers, directors, employees, agents, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:
            </p>
            <ul>
              <li>Your use of or inability to use our services</li>
              <li>Any errors or omissions in our content</li>
              <li>Any unauthorized access to or use of our servers or data</li>
              <li>Any interruption or cessation of our services</li>
              <li>Any loss of data, profits, or business opportunities</li>
              <li>Any decisions made based on information provided through our services</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">9. Changes to Services</h2>
            <p>
              We reserve the right to modify, update, or discontinue any aspect of our services, including features, content, and functionality, at any time without prior notice. We are not obligated to provide updates or maintain compatibility with previous versions of our services.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">10. No Endorsement</h2>
            <p>
              Reference to any specific employer, job opportunity, candidate, product, service, or third-party website does not constitute an endorsement or recommendation by Venus Hiring. We are not responsible for the quality, safety, or legality of any job opportunities or the conduct of any employers or candidates.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">11. Jurisdiction</h2>
            <p>
              This disclaimer is governed by the laws of the Province of Ontario, Canada. Any disputes arising from this disclaimer or your use of our services shall be subject to the exclusive jurisdiction of the courts of Ontario.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">12. Contact Us</h2>
            <p>If you have questions about this Disclaimer, please contact us:</p>
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

export default Disclaimer;

