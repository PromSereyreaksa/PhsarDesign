import { useState } from "react"
import { useSelector } from "react-redux"
import { applicationsAPI, artistsAPI } from "../../lib/api"
import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { Label } from "./label"
import { Modal } from "./modal"
import { X, DollarSign, Clock, FileText } from "lucide-react"

export function ProposalModal({ isOpen, onClose, project, onSuccess }) {
  const { user } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({
    message: "",
    proposedBudget: "",
    timeline: "",
    attachments: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (!user) {
        setError("You must be logged in to submit a proposal")
        return
      }

      // Get artist profile
      const artistResponse = await artistsAPI.getByUserId(user.userId)
      const artistId = artistResponse.data.artistId

      const applicationData = {
        projectId: project.projectId || project.id,
        artistId: artistId,
        message: formData.message,
        metadata: {
          proposedBudget: formData.proposedBudget,
          timeline: formData.timeline,
          attachments: formData.attachments
        }
      }

      const response = await applicationsAPI.create(applicationData)
      
      if (response.data.success) {
        onSuccess?.()
        onClose()
        // Reset form
        setFormData({
          message: "",
          proposedBudget: "",
          timeline: "",
          attachments: []
        })
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit proposal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#202020] rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Submit Proposal</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">{project?.title}</h3>
          <p className="text-gray-400 text-sm">Budget: ${project?.budget}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="message" className="text-white">
              Cover Letter *
            </Label>
            <Textarea
              id="message"
              placeholder="Explain why you're the perfect fit for this project. Include your relevant experience and approach."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="mt-1 min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
            <p className="text-sm text-gray-400 mt-1">
              Be specific about your experience and how you'll approach this project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="proposedBudget" className="text-white">
                Your Proposed Budget
              </Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="proposedBudget"
                  type="number"
                  placeholder="1000"
                  value={formData.proposedBudget}
                  onChange={(e) => handleInputChange('proposedBudget', e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Your bid for this project
              </p>
            </div>

            <div>
              <Label htmlFor="timeline" className="text-white">
                Delivery Timeline
              </Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="timeline"
                  placeholder="e.g. 2 weeks"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">
                When can you deliver this project?
              </p>
            </div>
          </div>

          <div>
            <Label className="text-white">
              Attachments (Optional)
            </Label>
            <div className="mt-2">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-[#A95BAB]/30 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-[#A95BAB]/10 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <FileText className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> portfolio samples
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    // Handle file upload logic here
                  }}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Upload relevant work samples or documents (images, PDF, DOC)
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.message.trim()}
              className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Proposal"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}