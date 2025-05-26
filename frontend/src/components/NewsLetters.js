// src/components/Newsletter.js
import { useState } from 'react';

const Newsletters = () => {
  // Optional: local state for contact form (you can handle submission later)
  const [contact, setContact] = useState({ name: '', email: '', message: '' });

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the contact form submission (API call, etc.)
    alert(`Message sent by ${contact.name}`);
    setContact({ name: '', email: '', message: '' });
  };

  return (
    <div className="newsletter bg-primary text-white py-5 text-center">
      {/* Newsletter Subscription */}
      <h4>Stay Updated!</h4>
      <p>Subscribe to get the latest courses and offers.</p>
      <form className="d-flex justify-content-center mb-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="form-control w-50 me-2"
          required
        />
        <button className="btn btn-light">Subscribe</button>
      </form>

      {/* Contact Us Form */}
      <h4>Contact Us</h4>
      <form
        onSubmit={handleContactSubmit}
        className="d-flex flex-column align-items-center gap-3 mx-auto"
        style={{ maxWidth: '500px' }}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="form-control"
          value={contact.name}
          onChange={handleContactChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="form-control"
          value={contact.email}
          onChange={handleContactChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          className="form-control"
          rows="4"
          value={contact.message}
          onChange={handleContactChange}
          required
        />
        <button type="submit" className="btn btn-light px-4">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Newsletters;
