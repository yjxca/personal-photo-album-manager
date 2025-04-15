'use client';

import { useState, useEffect } from 'react';
import { FaEnvelope, FaUser, FaComment, FaPaperPlane } from 'react-icons/fa';

// Class component for the contact form (to meet requirement for Class Component)
import React from 'react';

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      message: '',
      errors: {},
      submitted: false,
      isSubmitting: false
    };
  }

  validateForm = () => {
    const { name, email, message } = this.state;
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!message.trim()) {
      errors.message = 'Message is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: ''
      }
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    const { valid, errors } = this.validateForm();
    if (!valid) {
      this.setState({ errors });
      return;
    }
    
    this.setState({ isSubmitting: true });
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.setState({
        submitted: true,
        name: '',
        email: '',
        message: '',
        isSubmitting: false
      });
      
      // Reset the submitted state after 5 seconds
      setTimeout(() => {
        this.setState({ submitted: false });
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      this.setState({
        errors: { ...this.state.errors, form: 'Failed to submit the form. Please try again.' },
        isSubmitting: false
      });
    }
  };

  render() {
    const { name, email, message, errors, submitted, isSubmitting } = this.state;
    
    if (submitted) {
      return (
        <div className="success-message">
          <h3>Thank you for your message!</h3>
          <p>We'll get back to you as soon as possible.</p>
        </div>
      );
    }
    
    return (
      <form onSubmit={this.handleSubmit} className="contact-form">
        {errors.form && <div className="error-message">{errors.form}</div>}
        
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <FaUser className="form-icon" /> Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder="Your name"
            value={name}
            onChange={this.handleChange}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <FaEnvelope className="form-icon" /> Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            placeholder="Your email"
            value={email}
            onChange={this.handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            <FaComment className="form-icon" /> Message
          </label>
          <textarea
            id="message"
            name="message"
            className={`form-input textarea ${errors.message ? 'input-error' : ''}`}
            placeholder="Your message"
            value={message}
            onChange={this.handleChange}
            rows="5"
          ></textarea>
          {errors.message && <p className="error-text">{errors.message}</p>}
        </div>
        
        <button type="submit" className="form-button" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : (
            <>
              <FaPaperPlane className="btn-icon" /> Send Message
            </>
          )}
        </button>
      </form>
    );
  }
}

// Functional component for the Contact page
const ContactPage = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  
  useEffect(() => {
    // Fetch company info from an external API (simulated)
    const fetchCompanyInfo = async () => {
      try {
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock company data
        setCompanyInfo({
          name: 'PhotoAlbum Inc.',
          address: '123 Photo Street, Suite 101',
          city: 'Toronto, ON M5V 2K4',
          phone: '+1 (416) 555-0123',
          email: 'contact@photoalbum.com',
          hours: 'Monday - Friday: 9AM - 5PM EST'
        });
      } catch (error) {
        console.error('Error fetching company info:', error);
      }
    };
    
    fetchCompanyInfo();
  }, []);

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-info-side">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-description">
            Have questions or feedback? We'd love to hear from you! Fill out the form and we'll get back to you as soon as possible.
          </p>
          
          {companyInfo && (
            <div className="company-info">
              <h3>{companyInfo.name}</h3>
              <address>
                <p>{companyInfo.address}</p>
                <p>{companyInfo.city}</p>
              </address>
              
              <div className="contact-details">
                <p>
                  <strong>Phone:</strong> {companyInfo.phone}
                </p>
                <p>
                  <strong>Email:</strong> {companyInfo.email}
                </p>
                <p>
                  <strong>Hours:</strong> {companyInfo.hours}
                </p>
              </div>
            </div>
          )}
          
          <div className="map-container">
            <div className="map-placeholder">
              <p>Google Map would be embedded here</p>
            </div>
          </div>
        </div>
        
        <div className="contact-form-side">
          <div className="form-container">
            <h2>Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          background-color: var(--light-gray);
        }
        
        .contact-container {
          display: flex;
          max-width: 1200px;
          margin: 0 auto;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
        }
        
        .contact-info-side {
          flex: 1;
          padding: 3rem;
          background-color: var(--primary-color);
          color: white;
        }
        
        .contact-form-side {
          flex: 1;
          padding: 3rem;
        }
        
        .page-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .company-info {
          margin-top: 3rem;
          margin-bottom: 2rem;
        }
        
        .map-container {
          margin-top: 2rem;
          border-radius: var(--border-radius);
          overflow: hidden;
          height: 200px;
        }
        
        .map-placeholder {
          height: 100%;
          background-color: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-style: italic;
        }
        
        @media (max-width: 768px) {
          .contact-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;