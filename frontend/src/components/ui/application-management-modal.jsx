import { useState } from "react"
import { applicationsAPI } from "../../lib/api"
import { Button } from "./button"
import { Textarea } from "./textarea"
import { Label } from "./label"
import { Modal } from "./modal"
import { Badge } from "./badge"
import { X, Check, Users, Star, Calendar, DollarSign } from "lucide-react"

export function ApplicationManagementModal({ isOpen, onClose, project, applications, onSuccess }) {
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientMessage, setClientMessage] = useState("")
  const [error, setError] = useState("")

  const handleStatusUpdate = async (applicationId, status) => {
    setIsProcessing(true)
    setError("")

    try {
      const statusData = {
        status,
        clientMessage: clientMessage.trim() || undefined
      }

      const response = await applicationsAPI.updateStatus(applicationId, statusData)
      
      if (response.data.success) {
        onSuccess?.()
        setClientMessage("")
        if (status === 'accepted') {
          onClose()
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update application status.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'accepted': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#202020] rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Applications</h2>
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
          <p className="text-gray-400 text-sm">Budget: ${project?.budget} • {applications?.length || 0} Applications</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!applications || applications.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No applications received yet</p>
            <p className="text-gray-500 text-sm mt-2">Applications will appear here when artists apply to your project</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application.applicationId || application.id || `modal-app-${applications.indexOf(application)}`} className="border border-white/10 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#A95BAB] rounded-full flex items-center justify-center text-white font-semibold">
                      {application.artist?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{application.artist?.name || 'Anonymous Artist'}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400" />
                          {application.artist?.rating || 'No rating'}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${application.artist?.hourlyRate || 'Rate not set'}/hr
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(application.status)} text-white border-0`}>
                      {application.status}
                    </Badge>
                    <span className="text-sm text-gray-400 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-white">Cover Letter</Label>
                  <p className="text-gray-300 mt-2 p-3 bg-white/5 rounded border border-white/10">
                    {application.message || 'No message provided'}
                  </p>
                </div>

                {application.metadata && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {application.metadata.proposedBudget && (
                      <div>
                        <Label className="text-white">Proposed Budget</Label>
                        <p className="text-gray-300">${application.metadata.proposedBudget}</p>
                      </div>
                    )}
                    {application.metadata.timeline && (
                      <div>
                        <Label className="text-white">Timeline</Label>
                        <p className="text-gray-300">{application.metadata.timeline}</p>
                      </div>
                    )}
                  </div>
                )}

                {application.status === 'pending' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`message-${application.applicationId || application.id}`} className="text-white">
                        Message to Artist (Optional)
                      </Label>
                      <Textarea
                        id={`message-${application.applicationId || application.id}`}
                        placeholder="Add a personal message to the artist..."
                        value={selectedApplication === (application.applicationId || application.id) ? clientMessage : ""}
                        onChange={(e) => {
                          setSelectedApplication(application.applicationId || application.id)
                          setClientMessage(e.target.value)
                        }}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const appId = application.applicationId || application.id;
                          if (!appId) {
                            console.error('Application ID is missing:', application);
                            return;
                          }
                          handleStatusUpdate(appId, 'rejected');
                        }}
                        disabled={isProcessing}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {isProcessing ? "Processing..." : "Reject"}
                      </Button>
                      <Button
                        onClick={() => {
                          const appId = application.applicationId || application.id;
                          if (!appId) {
                            console.error('Application ID is missing:', application);
                            return;
                          }
                          handleStatusUpdate(appId, 'accepted');
                        }}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        {isProcessing ? "Processing..." : "Accept & Hire"}
                      </Button>
                    </div>
                  </div>
                )}

                {application.status !== 'pending' && (
                  <div className="bg-white/5 rounded p-3">
                    <p className="text-sm text-gray-400">
                      Application {application.status} on {new Date(application.updatedAt || application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}