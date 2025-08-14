"use client"

import { useState } from "react"
import { contactArtist } from "../../store/api/marketplaceAPI"

const PostDetail = ({ post }) => {
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactMessage, setContactMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContact = async () => {
    if (!contactMessage.trim()) {
      setShowContactForm(true)
      return
    }

    setIsSubmitting(true)
    try {
      await contactArtist(post.postId, contactMessage)
      alert("Message sent successfully!")
      setShowContactForm(false)
      setContactMessage("")
    } catch (error) {
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (min, max) => {
    if (min && max) {
      return `$${min}-$${max}`
    } else if (min) {
      return `From $${min}`
    } else if (max) {
      return `Up to $${max}`
    }
    return "Price negotiable"
  }

  const portfolioSamples = post.photos || [
    "/portfolio-sample-1.png",
    "/portfolio-sample-2.png",
    "/portfolio-sample-3.png",
    "/portfolio-sample-4.png",
  ]

  return (
    <div className="post-detail">
      <div className="post-detail-container">
        {/* Main Content */}
        <div className="post-main-content">
          {/* Left Side - Image */}
          <div className="post-image-section">
            <div className="main-image">
              <div className="crown-logo-large">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16L3 7l5.5 4L12 4l3.5 7L21 7l-2 9H5zm2.7-2h8.6l.9-4.4L14 12l-2-4-2 4-3.2-2.4L7.7 14z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="post-info-section">
            <div className="post-header">
              <div className="artist-info">
                <div className="artist-avatar">
                  <img
                    src={post.artistAvatar || "/placeholder.svg?height=50&width=50&query=artist avatar"}
                    alt="Artist"
                  />
                </div>
                <div className="artist-details">
                  <h3>{post.artistName || "Artist Name"}</h3>
                  <p className="artist-title">{post.artistTitle || "Professional Designer"}</p>
                </div>
              </div>
              <div className="post-status">
                <span className="status-dot"></span>
                <span className="status-text">Available</span>
              </div>
            </div>

            <div className="post-content">
              <h1 className="post-title">{post.title || "We need a banner"}</h1>

              <div className="post-meta">
                <div className="meta-item">
                  <span className="meta-label">Price:</span>
                  <span className="meta-value price">{formatPrice(post.budgetMin, post.budgetMax)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Deadline:</span>
                  <span className="meta-value">{post.duration || "1 week"}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Location:</span>
                  <span className="meta-value">{post.location || "Remote"}</span>
                </div>
              </div>

              <div className="post-description">
                <p>
                  {post.description ||
                    "I'm looking for a clean and professional banner for our company website. The banner will be used across multiple platforms and should be eye-catching. We need someone who can deliver high-quality work within the specified timeframe."}
                </p>
              </div>

              <div className="post-skills">
                <h4>Required Skills:</h4>
                <div className="skills-list">
                  {(post.skills || ["Design", "Photoshop", "Branding", "Creative Direction"]).map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="post-actions">
                {!showContactForm ? (
                  <button className="contact-btn primary" onClick={() => setShowContactForm(true)}>
                    Contact now
                  </button>
                ) : (
                  <div className="contact-form">
                    <textarea
                      placeholder="Write your message here..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                    />
                    <div className="form-actions">
                      <button
                        className="contact-btn primary"
                        onClick={handleContact}
                        disabled={isSubmitting || !contactMessage.trim()}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>
                      <button className="contact-btn secondary" onClick={() => setShowContactForm(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="post-stats">
                  <div className="stat-item">
                    <span className="stat-icon">👁</span>
                    <span className="stat-value">{post.views || 0} views</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">❤️</span>
                    <span className="stat-value">{post.likes || 0} likes</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">💬</span>
                    <span className="stat-value">{post.responses || 0} responses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="portfolio-section">
          <h3>Portfolio Samples</h3>
          <div className="portfolio-grid">
            {portfolioSamples.slice(0, 4).map((image, index) => (
              <div key={index} className="portfolio-item">
                <img src={image || "/placeholder.svg"} alt={`Portfolio sample ${index + 1}`} />
                <div className="portfolio-overlay">
                  <button className="view-btn">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        <div className="related-section">
          <h3>Similar Opportunities</h3>
          <div className="related-grid">
            {[1, 2, 3].map((item) => (
              <div key={item} className="related-card">
                <div className="related-image">
                  <div className="crown-logo-small">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16L3 7l5.5 4L12 4l3.5 7L21 7l-2 9H5zm2.7-2h8.6l.9-4.4L14 12l-2-4-2 4-3.2-2.4L7.7 14z" />
                    </svg>
                  </div>
                </div>
                <div className="related-content">
                  <h4>Similar Project {item}</h4>
                  <p className="related-price">$50-$150</p>
                  <p className="related-description">Looking for creative design work...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
