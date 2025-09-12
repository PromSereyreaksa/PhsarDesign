import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, User, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import { convertApplicationToProject } from '../../store/slices/projectSlice';
import { updateApplicationStatus } from '../../store/slices/applicationsSlice';

const ApplicationCard = ({ application, onStatusUpdate, userType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Debug log the application structure
  console.log('[ApplicationCard] Received application:', application);

  // Get application ID with fallback
  const getApplicationId = () => {
    const appId = application?.applicationId || application?.id;
    console.log('[ApplicationCard] Application ID check:', {
      applicationId: application?.applicationId,
      id: application?.id,
      finalAppId: appId
    });
    if (!appId) {
      console.error('[ApplicationCard] Application ID is missing:', application);
    }
    return appId;
  };

  const handleAccept = async () => {
    const appId = getApplicationId();
    if (!appId) {
      alert('Application ID is missing. Cannot accept application.');
      return;
    }

    try {
      setLoading(true);

      // First update application status to accepted
      await dispatch(updateApplicationStatus({
        applicationId: appId,
        status: 'accepted'
      })).unwrap();

      // Then convert to project
      await dispatch(convertApplicationToProject({
        applicationId: appId
      })).unwrap();

      // Navigate to projects page
      navigate('/projects');
      
      // Update parent component if callback provided
      if (onStatusUpdate) {
        onStatusUpdate(appId, 'accepted');
      }

    } catch (error) {
      console.error('Error accepting application:', error);
      // Show error message to user
      alert('Failed to accept application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const appId = getApplicationId();
    if (!appId) {
      alert('Application ID is missing. Cannot reject application.');
      return;
    }

    try {
      setLoading(true);
      
      await dispatch(updateApplicationStatus({
        applicationId: appId,
        status: 'rejected'
      })).unwrap();

      if (onStatusUpdate) {
        onStatusUpdate(appId, 'rejected');
      }

    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    const appId = getApplicationId();
    if (!appId) {
      alert('Application ID is missing. Cannot view details.');
      return;
    }
    navigate(`/dashboard/applications/${appId}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case 'accepted': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:border-[#A95BAB]/30 transition-all duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={application.applicant?.profileImage} />
              <AvatarFallback className="bg-[#A95BAB] text-white">
                {application.applicant?.firstName?.[0]}{application.applicant?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-white">
                {application.applicant?.firstName} {application.applicant?.lastName}
              </CardTitle>
              <p className="text-sm text-gray-400">
                Applied for: {application.post?.title}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {application.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <DollarSign className="w-4 h-4 text-[#A95BAB]" />
            <span>Budget: {formatCurrency(application.proposedBudget)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4 text-[#A95BAB]" />
            <span>Applied: {formatDate(application.createdAt)}</span>
          </div>
        </div>

        {application.estimatedDuration && (
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Clock className="w-4 h-4 text-[#A95BAB]" />
            <span>Duration: {application.estimatedDuration} days</span>
          </div>
        )}

        {application.coverLetter && (
          <>
            <Separator className="bg-gray-700" />
            <div>
              <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-[#A95BAB]" />
                Cover Letter
              </h4>
              <p className="text-sm text-gray-300 line-clamp-3">
                {application.coverLetter}
              </p>
            </div>
          </>
        )}

        {application.portfolio && (
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Portfolio</h4>
            <a 
              href={application.portfolio} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-[#A95BAB] hover:text-[#8A4A8F] underline"
            >
              View Portfolio
            </a>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewDetails}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          View Details
        </Button>

        {userType === 'client' && application.status === 'pending' && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              disabled={loading}
              className="border-red-600 text-red-400 hover:bg-red-600/10"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              disabled={loading}
              className="bg-[#A95BAB] hover:bg-[#8A4A8F] text-white"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-1" />
              )}
              {loading ? 'Processing...' : 'Accept'}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;