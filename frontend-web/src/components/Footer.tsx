import { Heart, Mail, Phone, MapPin, Shield, HelpCircle, FileText, Globe, Send } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="site-footer-modern" aria-label="Website Footer">
      <div className="footer-top-grid">
        {/* Brand & About Us */}
        <div className="footer-col footer-col-about">
          <div className="footer-brand">
            <div className="brand-logo small" aria-hidden="true">
              AAU
            </div>
            <span className="footer-brand-title">AAU Campus Market</span>
          </div>
          <p className="footer-about-text">
            The dedicated digital marketplace connecting Addis Ababa University students across 4 Kilo, 5 Kilo, 6 Kilo, Sefer Selam, Mexico, and Ledeta campuses. Buy and sell with safety, peer trust, and zero hassle.
          </p>
          <div className="footer-campuses-list">
            <span className="campus-mini-pill">4 Kilo (Science)</span>
            <span className="campus-mini-pill">5 Kilo (AAiT)</span>
            <span className="campus-mini-pill">6 Kilo (Main)</span>
            <span className="campus-mini-pill">Mexico (Commerce)</span>
          </div>
        </div>

        {/* Quick Links & Customer Support */}
        <div className="footer-col">
          <h4 className="footer-heading">Customer Support</h4>
          <ul className="footer-nav-list">
            <li>
              <a href="#help-center" className="footer-link">
                <HelpCircle size={14} /> Help Center & FAQs
              </a>
            </li>
            <li>
              <a href="#how-to-buy" className="footer-link">
                How to Buy on Campus
              </a>
            </li>
            <li>
              <a href="#seller-guide" className="footer-link">
                Student Seller Guidelines
              </a>
            </li>
            <li>
              <a href="#buyer-protection" className="footer-link">
                <Shield size={14} /> Buyer Protection & Pickup Points
              </a>
            </li>
            <li>
              <a href="#report-listing" className="footer-link">
                Report a Listing or Incident
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & AAU Office */}
        <div className="footer-col">
          <h4 className="footer-heading">Contact & Location</h4>
          <div className="footer-contact-items">
            <div className="contact-item">
              <MapPin size={16} className="contact-icon" />
              <span>Addis Ababa University Main Campus, Sidist Kilo, Addis Ababa, Ethiopia</span>
            </div>
            <div className="contact-item">
              <Mail size={16} className="contact-icon" />
              <a href="mailto:support@aau-campus-market.et" className="footer-contact-link">
                support@aau-campus-market.et
              </a>
            </div>
            <div className="contact-item">
              <Phone size={16} className="contact-icon" />
              <span>+251 (0) 11 123 9700</span>
            </div>
          </div>

          <h4 className="footer-heading terms-heading">Legal & Compliance</h4>
          <ul className="footer-nav-list inline">
            <li>
              <a href="#terms" className="footer-link">
                <FileText size={14} /> Terms and Conditions
              </a>
            </li>
            <li>
              <a href="#privacy" className="footer-link">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#student-code" className="footer-link">
                AAU Student Code
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media & Newsletter */}
        <div className="footer-col">
          <h4 className="footer-heading">Stay Connected</h4>
          <p className="footer-sub-text">
            Get notifications about campus book swaps, flash sales, and new dorm arrivals.
          </p>

          <form onSubmit={handleSubscribe} className="footer-newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your AAU student email..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn" aria-label="Subscribe to updates">
              <Send size={15} />
            </button>
          </form>
          {subscribed && (
            <p className="newsletter-success">Thank you! You are now subscribed to campus updates.</p>
          )}

          <div className="footer-social-strip">
            <span className="social-label">Follow Student Hub:</span>
            <div className="social-links-row">
              <a href="https://t.me/aau_campus_market" target="_blank" rel="noreferrer" className="social-pill" title="Telegram Channel">
                Telegram
              </a>
              <a href="https://twitter.com/aau_market" target="_blank" rel="noreferrer" className="social-pill" title="X / Twitter">
                Twitter
              </a>
              <a href="https://instagram.com/aau_market" target="_blank" rel="noreferrer" className="social-pill" title="Instagram">
                Instagram
              </a>
              <a href="https://linkedin.com/school/addis-ababa-university" target="_blank" rel="noreferrer" className="social-pill" title="LinkedIn">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <p className="copyright-text">
            © 2026 Addis Ababa University Campus Market — University Student Commerce Platform. All rights reserved.
          </p>
          <div className="footer-bottom-badges">
            <span className="footer-mini-badge">
              <Globe size={13} /> English (Amharic available)
            </span>
            <span className="footer-mini-badge">
              Made with <Heart size={13} fill="#ec4899" color="#ec4899" /> by AAU Student Developers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
