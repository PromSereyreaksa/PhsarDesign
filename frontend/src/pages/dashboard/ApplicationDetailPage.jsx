import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, FileText, MessageSquare, Star, User, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AuthNavbar from '../../components/layout/AuthNavbar'
import Loader from '../../components/ui/Loader'
import { showToast } from '../../components/ui/toast'
import applicationsAPI from '../../services/applicationsAPI'
import {
  acceptApplication,
  rejectApplication
} from '../../store/slices/applicationsSlice'
import { fetchNotifications } from '../../store/slices/notificationsSlice'

const ApplicationDetailPage = () => {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  
  const { accepting, rejecting } = useSelector((state) => state.applications)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true)
        const response = await applicationsAPI.getApplicationById(applicationId)
        console.log('[ApplicationDetail] Raw API response:', response)
        console.log('[ApplicationDetail] Application data structure:', {
          applicationId: response?.applicationId,
          subject: response?.subject,
          message: response?.message,
          status: response?.status,
          senderId: response?.senderId,
          receiverId: response?.receiverId,
          proposedBudget: response?.proposedBudget,
          proposedStartDate: response?.proposedStartDate,
          proposedDeadline: response?.proposedDeadline,
          createdAt: response?.createdAt,
          artist: response?.artist,
          artistUser: response?.artist?.user,
          client: response?.client,
          receiver: response?.receiver,
          sender: response?.sender,
          // Check if receiver data might be nested differently
          fullResponse: response
        })
        setApplication(response)
      } catch (err) {
        console.error('[ApplicationDetail] Error fetching application:', err)
        setError(err.response?.data?.message || 'Failed to load application details')
      } finally {
        setLoading(false)
      }
    }

    if (applicationId) {
      fetchApplicationDetails()
    }
  }, [applicationId])

  const handleAcceptApplication = async () => {
    try {
      const appId = application.applicationId || application.id
      console.log('[ApplicationDetailPage] Accepting application with ID:', appId);
      
      if (!appId) {
        throw new Error('Application ID is required');
      }
      
      await dispatch(acceptApplication({ 
        applicationId: appId,
        convertToProject: true 
      })).unwrap()
      showToast('Application accepted and converted to project successfully!', 'success')
      // Refresh notifications
      dispatch(fetchNotifications())
      // Navigate back to applications page
      navigate('/dashboard/applications')
    } catch (error) {
      console.error('[ApplicationDetailPage] Accept application error:', error);
      showToast(error || 'Failed to accept application', 'error')
    }
  }

  const handleRejectApplication = async () => {
    try {
      const appId = application.applicationId || application.id
      await dispatch(rejectApplication({
        applicationId: appId,
        rejectionReason
      })).unwrap()
      showToast('Application rejected successfully!', 'success')
      setShowRejectModal(false)
      setRejectionReason('')
      // Refresh notifications
      dispatch(fetchNotifications())
      // Navigate back to applications page
      navigate('/dashboard/applications')
    } catch (error) {
      showToast(error || 'Failed to reject application', 'error')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
      case 'accepted':
        return 'text-green-400 bg-green-400/20 border-green-400/30'
      case 'rejected':
        return 'text-red-400 bg-red-400/20 border-red-400/30'
      case 'converted':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/30'
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-28 flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader />
            <p className="text-gray-400 mt-4">Loading application details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-28 max-w-4xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">
              Error Loading Application
            </h3>
            <p className="text-gray-400 mb-6">
              {error || 'Application not found'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/applications')}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
              >
                Back to Applications
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg text-white transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isIncomingApplication = application.receiverId === user?.userId || application.receiverId === user?.id
  const isPending = application.status === 'pending'
  
  // Get the correct user information based on application direction
  let otherUser = null
  let userType = 'Unknown'
  
  console.log('[ApplicationDetail] Debug user detection:', {
    isIncomingApplication,
    receiver: application.receiver,
    sender: application.sender,
    currentUserId: user?.userId || user?.id,
    receiverId: application.receiverId,
    senderId: application.senderId,
    artist: application.artist,
    client: application.client,
    fullApplication: application
  })
  
  if (isIncomingApplication) {
    // For incoming applications, show sender info (who sent the application to me)
    console.log('[ApplicationDetail] Incoming application - showing SENDER info...')
    
    // Try sender object first
    if (application.sender) {
      otherUser = application.sender
      userType = application.sender.role === 'artist' ? 'Artist' : 'Client'
      console.log('[ApplicationDetail] Found sender:', otherUser)
    }
    // Try to construct sender from individual fields
    else if (application.senderFirstName || application.senderLastName || application.senderEmail) {
      otherUser = {
        userId: application.senderId,
        firstName: application.senderFirstName,
        lastName: application.senderLastName,
        email: application.senderEmail,
        avatarURL: application.senderAvatarURL,
        role: application.senderRole
      }
      userType = application.senderRole === 'artist' ? 'Artist' : 'Client'
      console.log('[ApplicationDetail] Constructed sender from fields:', otherUser)
    }
    // Try client.user structure if sender is client
    else if (application.client?.user) {
      otherUser = application.client.user
      userType = 'Client'
      console.log('[ApplicationDetail] Found client.user as sender:', otherUser)
    }
    // Try artist.user structure if sender is artist
    else if (application.artist?.user) {
      otherUser = application.artist.user
      userType = 'Artist'
      console.log('[ApplicationDetail] Found artist.user as sender:', otherUser)
    }
  } else {
    // For outgoing applications, show receiver info (who I sent the application to)
    console.log('[ApplicationDetail] Outgoing application - showing RECEIVER info...')
    
    // Try receiver object first
    if (application.receiver) {
      otherUser = application.receiver
      userType = application.receiver.role === 'artist' ? 'Artist' : 'Client'
      console.log('[ApplicationDetail] Found receiver:', otherUser)
    }
    // Try to construct receiver from individual fields in application object
    else if (application.receiverFirstName || application.receiverLastName || application.receiverEmail) {
      otherUser = {
        userId: application.receiverId,
        firstName: application.receiverFirstName,
        lastName: application.receiverLastName,
        email: application.receiverEmail,
        avatarURL: application.receiverAvatarURL,
        role: application.receiverRole
      }
      userType = application.receiverRole === 'artist' ? 'Artist' : 'Client'
      console.log('[ApplicationDetail] Constructed receiver from fields:', otherUser)
    }
    // For job applications (artist to client), receiver should be the client
    else if (application.jobId && application.client?.user) {
      otherUser = application.client.user
      userType = 'Client'
      console.log('[ApplicationDetail] Found client.user as receiver for job application:', otherUser)
    }
    // For service requests (client to artist), receiver should be the artist
    else if (application.postId && application.artist?.user) {
      otherUser = application.artist.user
      userType = 'Artist'
      console.log('[ApplicationDetail] Found artist.user as receiver for service request:', otherUser)
    }
    // Last resort: try to find any user info in the response
    else {
      // Check if there's any user info in nested structures
      const allKeys = Object.keys(application)
      console.log('[ApplicationDetail] Checking all application keys for user data:', allKeys)
      
      // Look for any structure that might contain user info
      for (const key of allKeys) {
        if (application[key] && typeof application[key] === 'object') {
          if (application[key].firstName || application[key].lastName || application[key].email) {
            otherUser = application[key]
            userType = application[key].role === 'artist' ? 'Artist' : 'Client'
            console.log(`[ApplicationDetail] Found user data in ${key}:`, otherUser)
            break
          }
        }
      }
    }
  }
  
  console.log('[ApplicationDetail] Final user detection result:', {
    otherUser,
    userType,
    hasReceiver: !!application.receiver,
    receiverRole: application.receiver?.role
  })
  
  console.log('[ApplicationDetail] User detection:', {
    currentUserId: user?.userId || user?.id,
    applicationReceiverId: application.receiverId,
    applicationSenderId: application.senderId,
    isIncomingApplication,
    otherUser,
    userType,
    artist: application.artist,
    client: application.client,
    receiver: application.receiver,
    sender: application.sender,
    receiverRole: application.receiver?.role,
    receiverClient: application.receiver?.client,
    receiverArtist: application.receiver?.artist
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />
      
      <div className="pt-24 max-w-6xl mx-auto px-6 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/applications')}
              className="p-2 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-700/50 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Application Details</h1>
              <p className="text-gray-400 text-sm">Review and manage this application</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`px-4 py-2 rounded-xl text-xs font-semibold border ${getStatusColor(application.status || 'unknown')}`}>
              {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Unknown'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Details - Main Column */}
          <div className="space-y-6">
            {/* Subject and Message */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-[#A95BAB]/20 rounded-lg">
                  <FileText className="h-5 w-5 text-[#A95BAB]" />
                </div>
                  <div className="flex-1 space-y-3 min-w-0">
                    <h2 className="text-lg font-bold text-white">
                      {application.subject || 'No Subject'}
                    </h2>
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                      {application.message || 'No message provided'}
                    </div>
                  </div>
              </div>
            </div>

            {/* Additional Notes */}
            {application.additionalNotes && (
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-[#A95BAB]/20 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-[#A95BAB]" />
                  </div>
                  <div className="flex-1 space-y-3 min-w-0">
                    <h3 className="text-lg font-bold text-white">
                      Additional Notes
                    </h3>
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                      {application.additionalNotes}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience and Past Projects */}
            {(application.experience || application.pastProjects) && (
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Experience & Background</h3>
                <div className="space-y-4">
                  {application.experience && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-[#A95BAB] uppercase tracking-wider">Experience</h4>
                      <div className="text-gray-300 leading-relaxed break-words overflow-hidden">{application.experience}</div>
                    </div>
                  )}
                  {application.pastProjects && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-[#A95BAB] uppercase tracking-wider">Past Projects</h4>
                      <div className="text-gray-300 leading-relaxed break-words overflow-hidden">{application.pastProjects}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Project Details */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-xl p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-2 bg-[#A95BAB]/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-[#A95BAB]" />
                </div>
                <h3 className="text-lg font-bold text-white">Project Details</h3>
              </div>
              
              <div className="space-y-4">
                {application.proposedBudget && (
                  <div className="bg-[#A95BAB]/10 border border-[#A95BAB]/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-[#A95BAB]/20 rounded">
                        <DollarSign className="h-4 w-4 text-[#A95BAB]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#A95BAB] uppercase tracking-wider mb-1">
                          Proposed Budget
                        </p>
                        <p className="font-bold text-white text-xl">
                          {formatCurrency(application.proposedBudget)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {application.proposedStartDate && (
                    <div className="flex items-center space-x-3 p-3 bg-[#A95BAB]/10 border border-[#A95BAB]/20 rounded-lg">
                      <div className="p-1.5 bg-[#A95BAB]/20 rounded">
                        <Calendar className="h-4 w-4 text-[#A95BAB]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#A95BAB] uppercase tracking-wider">
                          Start Date
                        </p>
                        <p className="font-semibold text-white text-sm">
                          {new Date(application.proposedStartDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {application.proposedDeadline && (
                    <div className="flex items-center space-x-3 p-3 bg-[#A95BAB]/10 border border-[#A95BAB]/20 rounded-lg">
                      <div className="p-1.5 bg-[#A95BAB]/20 rounded">
                        <Clock className="h-4 w-4 text-[#A95BAB]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#A95BAB] uppercase tracking-wider">
                          Deadline
                        </p>
                        <p className="font-semibold text-white text-sm">
                          {new Date(application.proposedDeadline).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 p-3 bg-gray-700/30 border border-gray-600/30 rounded-lg">
                    <div className="p-1.5 bg-gray-600/30 rounded">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Applied On
                      </p>
                      <p className="font-semibold text-white text-sm">
                        {application.createdAt ? formatDate(application.createdAt) : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Post */}
            {(application.jobPost || application.availabilityPost) && (
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-[#A95BAB]/20 rounded-lg">
                    <FileText className="h-5 w-5 text-[#A95BAB]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Related Post</h3>
                </div>
                
                <div className="space-y-3">
                  {application.jobPost && (
                    <div className="p-4 bg-[#A95BAB]/10 border border-[#A95BAB]/20 rounded-lg">
                      <p className="text-xs font-semibold text-[#A95BAB] uppercase tracking-wider mb-1">Job Post</p>
                      <p className="font-bold text-white mb-2">{application.jobPost.title}</p>
                      <div className="text-gray-300 leading-relaxed text-sm break-words overflow-hidden">
                        {application.jobPost.description}
                      </div>
                      {application.jobPost.budget && (
                        <div className="mt-3 flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-[#A95BAB]" />
                          <span className="text-[#A95BAB] font-semibold text-sm">
                            Budget: {formatCurrency(application.jobPost.budget)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {application.availabilityPost && (
                    <div className="p-4 bg-[#A95BAB]/10 border border-[#A95BAB]/20 rounded-lg">
                      <p className="text-xs font-semibold text-[#A95BAB] uppercase tracking-wider mb-1">Service Post</p>
                      <p className="font-bold text-white mb-2">{application.availabilityPost.title}</p>
                      <div className="text-gray-300 leading-relaxed text-sm break-words overflow-hidden">
                        {application.availabilityPost.description}
                      </div>
                      {application.availabilityPost.pricing && (
                        <div className="mt-3 flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-[#A95BAB]" />
                          <span className="text-[#A95BAB] font-semibold text-sm">
                            Starting at: {formatCurrency(application.availabilityPost.pricing)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Original Post - Always show if available */}
            {(isIncomingApplication && application.jobPost) || (!isIncomingApplication && application.availabilityPost) ? null : 
              ((!isIncomingApplication && application.jobPost) || (isIncomingApplication && application.availabilityPost)) && (
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {!isIncomingApplication && application.jobPost ? 'Job Post You Applied To' : 'Service Post They Applied To'}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {!isIncomingApplication && application.jobPost && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Original Job Post</p>
                      <p className="font-bold text-white mb-2">{application.jobPost.title}</p>
                      <div className="text-gray-300 leading-relaxed text-sm break-words overflow-hidden">
                        {application.jobPost.description}
                      </div>
                      {application.jobPost.budget && (
                        <div className="mt-3 flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 font-semibold text-sm">
                            Budget: {formatCurrency(application.jobPost.budget)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {isIncomingApplication && application.availabilityPost && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Your Service Post</p>
                      <p className="font-bold text-white mb-2">{application.availabilityPost.title}</p>
                      <div className="text-gray-300 leading-relaxed text-sm break-words overflow-hidden">
                        {application.availabilityPost.description}
                      </div>
                      {application.availabilityPost.pricing && (
                        <div className="mt-3 flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 font-semibold text-sm">
                            Starting at: {formatCurrency(application.availabilityPost.pricing)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#A95BAB]/20 rounded-lg">
                  <User className="h-5 w-5 text-[#A95BAB]" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {userType}
                </h3>
              </div>
              
              {otherUser ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-[#A95BAB] rounded-xl flex items-center justify-center overflow-hidden">
                        {otherUser.avatarURL ? (
                          <img
                            src={otherUser.avatarURL}
                            alt={`${otherUser.firstName || ''} ${otherUser.lastName || ''}`}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold">
                            {(otherUser?.firstName?.charAt(0) || '') + (otherUser?.lastName?.charAt(0) || '')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">
                        {otherUser.firstName || 'Unknown'} {otherUser.lastName || 'User'}
                      </p>
                      <p className="text-gray-400 text-sm truncate">{otherUser.email || 'No email'}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-[#A95BAB]/20 text-[#A95BAB] border border-[#A95BAB]/30 mt-1">
                        {userType}
                      </span>
                    </div>
                  </div>
                  
                  {/* Show organization for client */}
                  {userType === 'Client' && (
                    (application.client?.organizationName || 
                     otherUser?.client?.organizationName || 
                     application.receiver?.client?.organizationName)
                  ) && (
                    <div className="pt-3 border-t border-gray-700/50">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Organization
                          </p>
                          <p className="text-gray-300 text-sm">
                            {application.client?.organizationName || 
                             otherUser?.client?.organizationName || 
                             application.receiver?.client?.organizationName}
                          </p>
                        </div>
                        {(application.client?.industry || 
                          otherUser?.client?.industry || 
                          application.receiver?.client?.industry) && (
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Industry
                            </p>
                            <p className="text-gray-300 text-sm">
                              {application.client?.industry || 
                               otherUser?.client?.industry || 
                               application.receiver?.client?.industry}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Show artist details if available */}
                  {userType === 'Artist' && (
                    (application.artist || 
                     otherUser?.artist || 
                     application.receiver?.artist)
                  ) && (
                    <div className="pt-3 border-t border-gray-700/50 space-y-3">
                      {(application.artist?.specialties || 
                        otherUser?.artist?.specialties || 
                        application.receiver?.artist?.specialties) && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            Specialties
                          </p>
                          <p className="text-gray-300 text-sm">
                            {application.artist?.specialties || 
                             otherUser?.artist?.specialties || 
                             application.receiver?.artist?.specialties}
                          </p>
                        </div>
                      )}
                      {(application.artist?.skills || 
                        otherUser?.artist?.skills || 
                        application.receiver?.artist?.skills) && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            Skills
                          </p>
                          <p className="text-gray-300 text-sm">
                            {(() => {
                              const skills = application.artist?.skills || otherUser?.artist?.skills || application.receiver?.artist?.skills;
                              return Array.isArray(skills) ? skills.join(', ') : (skills || 'Not specified');
                            })()}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        {(application.artist?.rating || 
                          otherUser?.artist?.rating || 
                          application.receiver?.artist?.rating) && (
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(parseFloat(
                                      application.artist?.rating || 
                                      otherUser?.artist?.rating || 
                                      application.receiver?.artist?.rating
                                    ))
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-white font-medium text-xs">
                              {application.artist?.rating || 
                               otherUser?.artist?.rating || 
                               application.receiver?.artist?.rating}
                            </span>
                          </div>
                        )}
                        {(application.artist?.hourlyRate || 
                          otherUser?.artist?.hourlyRate || 
                          application.receiver?.artist?.hourlyRate) && (
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Rate</p>
                            <p className="text-[#A95BAB] font-bold text-sm">
                              ${application.artist?.hourlyRate || 
                                otherUser?.artist?.hourlyRate || 
                                application.receiver?.artist?.hourlyRate}/hr
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Unknown User</p>
                    <p className="text-gray-400 text-sm">User information not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {isIncomingApplication && isPending && (
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-[#A95BAB]/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-[#A95BAB]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Actions</h3>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleAcceptApplication}
                    disabled={accepting}
                    className="w-full flex items-center justify-center space-x-2 bg-[#A95BAB]/20 hover:bg-[#A95BAB]/30 border border-[#A95BAB]/40 hover:border-[#A95BAB]/60 disabled:bg-gray-600/20 disabled:border-gray-600/40 rounded-lg p-4 transition-all duration-300 transform hover:scale-[1.01] disabled:hover:scale-100"
                  >
                    <CheckCircle className="w-4 h-4 text-[#A95BAB]" />
                    <span className="font-semibold text-[#A95BAB] text-sm">
                      {accepting ? 'Accepting...' : 'Accept & Convert'}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={rejecting}
                    className="w-full flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 disabled:bg-gray-600/20 disabled:border-gray-600/40 rounded-lg p-4 transition-all duration-300 transform hover:scale-[1.01] disabled:hover:scale-100"
                  >
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="font-semibold text-red-400 text-sm">
                      {rejecting ? 'Rejecting...' : 'Reject Application'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Application Status for Outgoing */}
            {!isIncomingApplication && (
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-[#A95BAB]/20 rounded-lg">
                    <Clock className="h-5 w-5 text-[#A95BAB]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Application Status</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-semibold border ${getStatusColor(application.status || 'unknown')}`}>
                      {application.status === 'pending' && <Clock className="w-4 h-4 mr-2" />}
                      {application.status === 'accepted' && <CheckCircle className="w-4 h-4 mr-2" />}
                      {application.status === 'rejected' && <XCircle className="w-4 h-4 mr-2" />}
                      {application.status === 'converted' && <CheckCircle className="w-4 h-4 mr-2" />}
                      {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Unknown'}
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-300 text-sm">
                    {application.status === 'pending' && 'Your application is being reviewed. You will be notified once a decision is made.'}
                    {application.status === 'accepted' && 'Congratulations! Your application has been accepted and converted to a project.'}
                    {application.status === 'rejected' && 'Unfortunately, your application was not accepted this time.'}
                    {application.status === 'converted' && 'Your application has been successfully converted to an active project.'}
                    {!application.status && 'Application status is currently unknown.'}
                  </div>

                  {application.rejectionReason && application.status === 'rejected' && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                        Rejection Reason
                      </p>
                      <div className="text-gray-300 text-sm leading-relaxed break-words overflow-hidden">
                        {application.rejectionReason}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-2xl">
                <XCircle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Reject Application</h3>
            </div>
            
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Are you sure you want to reject this application from{' '}
              <span className="text-white font-semibold">
                {otherUser ? `${otherUser.firstName || 'Unknown'} ${otherUser.lastName || 'User'}` : 'Unknown User'}
              </span>?
            </p>
            
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Rejection Reason (Optional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#A95BAB] focus:ring-2 focus:ring-[#A95BAB]/20 resize-none transition-all duration-300"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                }}
                className="flex-1 py-4 px-6 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 rounded-2xl text-white font-semibold transition-all duration-300 transform hover:scale-[1.02]"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectApplication}
                disabled={rejecting}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 rounded-2xl text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-red-500/25"
              >
                {rejecting ? 'Rejecting...' : 'Reject Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicationDetailPage
