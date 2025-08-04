"use client"

import { useState } from "react"
import { X, Star } from "lucide-react"
import { Button } from "./button"
import { Textarea } from "./textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { reviewsAPI } from "../../services/api"

export function ReviewModal({ 
  isOpen, 
  onClose, 
  project, 
  artistId,
  onSuccess 
}) {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen || !project) return null

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (!reviewText.trim()) {
      setError('Please write a review')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const reviewData = {
        artistId: artistId,
        projectId: project.projectId || project.id,
        rating: rating,
        reviewText: reviewText.trim()
      }

      await reviewsAPI.create(reviewData)
      
      onSuccess?.()
      onClose()
      setRating(0)
      setReviewText("")
    } catch (error) {
      console.error('Review submission error:', error)
      setError(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Write a Review</h2>
            <p className="text-gray-400 text-sm mt-1">
              How was your experience with this artist?
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Project Info */}
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-sm">Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-medium">{project.title}</p>
              <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
            </CardContent>
          </Card>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Rate your experience *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-600 hover:text-gray-400"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-white">
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Write your review *
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience working with this artist. What did you like? How was the quality, communication, and overall experience?"
              rows={6}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              Be honest and constructive in your feedback
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0 || !reviewText.trim()}
            className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  )
}