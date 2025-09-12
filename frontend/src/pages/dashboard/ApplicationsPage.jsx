import { CheckCircle, Clock, Eye, User, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AuthNavbar from '../../components/layout/AuthNavbar'
import Loader from '../../components/ui/Loader'
import { showToast } from '../../components/ui/toast'
import {
  acceptApplication,
  clearErrors,
  fetchIncomingApplications,
  fetchOutgoingApplications,
  rejectApplication
} from '../../store/slices/applicationsSlice'
import { fetchNotifications } from '../../store/slices/notificationsSlice'

const ApplicationsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('incoming') // 'incoming', 'outgoing'
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const {
    incoming,
    outgoing,
    incomingLoading,
    outgoingLoading,
    accepting,
    rejecting,
    actionError
  } = useSelector((state) => state.applications)

  useEffect(() => {
    // Fetch all application types
    console.log('[ApplicationsPage] Fetching applications...')
    dispatch(fetchIncomingApplications())
    dispatch(fetchOutgoingApplications())
    
    // Clear any previous errors
    dispatch(clearErrors())
  }, [dispatch])

  // Add some debugging to see what data we're getting
  useEffect(() => {
    console.log('[ApplicationsPage] Current state:', {
      incoming: incoming.length,
      outgoing: outgoing.length,
      incomingLoading,
      outgoingLoading,
      actionError
    })
  }, [incoming, outgoing, incomingLoading, outgoingLoading, actionError])

  const handleAcceptApplication = async (applicationId) => {
    try {
      console.log('[ApplicationsPage] Accepting application with ID:', applicationId);
      if (!applicationId) {
        throw new Error('Application ID is required');
      }
      
      await dispatch(acceptApplication({ 
        applicationId,
        convertToProject: true 
      })).unwrap()
      showToast('Application accepted and converted to project successfully!', 'success')
      // Refresh notifications
      dispatch(fetchNotifications())
    } catch (error) {
      console.error('[ApplicationsPage] Accept application error:', error);
      showToast(error || 'Failed to accept application', 'error')
    }
  }

  const handleRejectApplication = async () => {
    if (!selectedApplication) return
    
    const applicationId = selectedApplication.id || selectedApplication.applicationId
    
    try {
      await dispatch(rejectApplication({
        applicationId,
        rejectionReason
      })).unwrap()
      showToast('Application rejected successfully!', 'success')
      setShowRejectModal(false)
      setSelectedApplication(null)
      setRejectionReason('')
      // Refresh notifications
      dispatch(fetchNotifications())
    } catch (error) {
      showToast(error || 'Failed to reject application', 'error')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20'
      case 'accepted':
        return 'text-green-400 bg-green-400/20'
      case 'rejected':
        return 'text-red-400 bg-red-400/20'
      case 'converted':
        return 'text-blue-400 bg-blue-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const ApplicationCard = ({ application, type }) => {
    const isIncoming = type === 'incoming'
    const otherUser = isIncoming ? application.sender : application.receiver
    
    // Handle different ID field names from backend
    const applicationId = application.id || application.applicationId

    return (
      <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              {application.subject}
            </h3>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>
                  {otherUser ? 
                    `${otherUser.firstName} ${otherUser.lastName}` : 
                    'Unknown User'
                  }
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{formatDate(application.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-gray-300 text-sm leading-relaxed">
            {application.message}
          </p>
          
          {application.proposedBudget && (
            <div className="text-sm">
              <span className="text-gray-400">Proposed Budget: </span>
              <span className="text-[#A95BAB] font-semibold">
                ${application.proposedBudget}
              </span>
            </div>
          )}
          
          {application.proposedDeadline && (
            <div className="text-sm">
              <span className="text-gray-400">Proposed Deadline: </span>
              <span className="text-white">
                {new Date(application.proposedDeadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-4 border-t border-gray-700/50">
          <button
            onClick={() => navigate(`/dashboard/applications/${applicationId}`)}
            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
          
          {isIncoming && application.status === 'pending' && (
            <>
              <button
                onClick={() => handleAcceptApplication(applicationId)}
                disabled={accepting}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{accepting ? 'Accepting...' : 'Accept'}</span>
              </button>
              
              <button
                onClick={() => {
                  setSelectedApplication(application)
                  setShowRejectModal(true)
                }}
                disabled={rejecting}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>{rejecting ? 'Rejecting...' : 'Reject'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const getCurrentApplications = () => {
    switch (activeTab) {
      case 'incoming':
        return Array.isArray(incoming) ? incoming : []
      case 'outgoing':
        return Array.isArray(outgoing) ? outgoing : []
      default:
        return []
    }
  }

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'incoming':
        return incomingLoading
      case 'outgoing':
        return outgoingLoading
      default:
        return false
    }
  }

  const tabs = [
    { id: 'incoming', label: 'Incoming', count: incoming.length },
    { id: 'outgoing', label: 'Outgoing', count: outgoing.length }
  ]

  const currentApplications = getCurrentApplications()
  const isLoading = getCurrentLoading()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />
      
      <div className="pt-28 max-w-7xl mx-auto px-6 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Applications</h1>
          <p className="text-gray-400">Manage your job applications and service requests</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/40 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#A95BAB] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-600/50 text-gray-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader />
            <p className="text-gray-400 mt-4">Loading applications...</p>
          </div>
        ) : actionError ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">
              Error Loading Applications
            </h3>
            <p className="text-gray-400 mb-4">
              {actionError}
            </p>
            <button
              onClick={() => {
                dispatch(fetchIncomingApplications())
                dispatch(fetchOutgoingApplications())
              }}
              className="px-4 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg text-white transition-colors"
            >
              Retry
            </button>
          </div>
        ) : currentApplications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No {activeTab} applications
            </h3>
            <p className="text-gray-400">
              {activeTab === 'incoming' && "You haven't received any applications yet."}
              {activeTab === 'outgoing' && "You haven't sent any applications yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentApplications.map((application) => (
              <ApplicationCard
                key={application.id || application.applicationId}
                application={application}
                type={activeTab}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <XCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-semibold text-white">Reject Application</h3>
            </div>
            
            <p className="text-gray-400 mb-4">
              Are you sure you want to reject this application from{' '}
              <span className="text-white font-medium">
                {selectedApplication.sender?.firstName} {selectedApplication.sender?.lastName}
              </span>?
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Rejection Reason (Optional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#A95BAB] resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setSelectedApplication(null)
                  setRejectionReason('')
                }}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectApplication}
                disabled={rejecting}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors disabled:opacity-50"
              >
                {rejecting ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicationsPage
