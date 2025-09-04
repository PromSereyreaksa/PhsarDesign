import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Alert, 
  AlertDescription 
} from '@/components/ui/alert';
import { 
  User, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ConvertApplicationToProject = ({ 
  applicationId, 
  onSuccess, 
  onError,
  className = "" 
}) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [error, setError] = useState(null);

  // Fetch application details
  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/applications/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setApplication(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch application');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load application');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToProject = async () => {
    try {
      setConverting(true);
      setError(null);

      const response = await axios.post(
        `/api/applications/${applicationId}/convert-to-project`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Application successfully converted to project!');
        setShowConfirmDialog(false);
        onSuccess?.(response.data.data);
      } else {
        throw new Error(response.data.error || 'Failed to convert application');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to convert application';
      setError(errorMessage);
      toast.error(errorMessage);
      onError?.(err);
    } finally {
      setConverting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <Alert className={`border-red-200 ${className}`}>
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          {error || 'Application not found'}
        </AlertDescription>
      </Alert>
    );
  }

  const canConvert = application.status === 'pending';
  const isArtistToJob = application.applicationType === 'artist_to_job' || 
                        (application.sender?.artist && application.receiver?.client);

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Application Details
            </CardTitle>
            {getStatusBadge(application.status)}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Application Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{application.subject}</h3>
              {application.message && (
                <p className="text-gray-600 mt-2">{application.message}</p>
              )}
            </div>

            {/* Sender & Receiver Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {isArtistToJob ? 'Artist' : 'Client'} (Sender)
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">
                    {application.sender?.firstName} {application.sender?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{application.sender?.email}</p>
                  {application.sender?.artist && (
                    <div className="mt-2">
                      <p className="text-sm">Skills: {application.sender.artist.skills?.join(', ') || 'N/A'}</p>
                      <p className="text-sm">Rate: {formatCurrency(application.sender.artist.hourlyRate)}/hr</p>
                      <p className="text-sm">Rating: {application.sender.artist.rating || 'N/A'}/5</p>
                    </div>
                  )}
                  {application.sender?.client && (
                    <div className="mt-2">
                      <p className="text-sm">Organization: {application.sender.client.organizationName}</p>
                      <p className="text-sm">Industry: {application.sender.client.industry}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {isArtistToJob ? 'Client' : 'Artist'} (Receiver)
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">
                    {application.receiver?.firstName} {application.receiver?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{application.receiver?.email}</p>
                  {application.receiver?.client && (
                    <div className="mt-2">
                      <p className="text-sm">Organization: {application.receiver.client.organizationName}</p>
                      <p className="text-sm">Industry: {application.receiver.client.industry}</p>
                    </div>
                  )}
                  {application.receiver?.artist && (
                    <div className="mt-2">
                      <p className="text-sm">Skills: {application.receiver.artist.skills?.join(', ') || 'N/A'}</p>
                      <p className="text-sm">Rate: {formatCurrency(application.receiver.artist.hourlyRate)}/hr</p>
                      <p className="text-sm">Rating: {application.receiver.artist.rating || 'N/A'}/5</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.proposedBudget && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Proposed Budget</p>
                    <p className="font-medium">{formatCurrency(application.proposedBudget)}</p>
                  </div>
                </div>
              )}

              {application.proposedDeadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Proposed Deadline</p>
                    <p className="font-medium">{formatDate(application.proposedDeadline)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info */}
            {(application.experience || application.additionalNotes) && (
              <div className="space-y-2">
                {application.experience && (
                  <div>
                    <h4 className="font-medium">Experience</h4>
                    <p className="text-gray-600">{application.experience}</p>
                  </div>
                )}
                {application.additionalNotes && (
                  <div>
                    <h4 className="font-medium">Additional Notes</h4>
                    <p className="text-gray-600">{application.additionalNotes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Related Post Info */}
            {(application.jobPost || application.availabilityPost) && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4" />
                  Related {application.jobPost ? 'Job Post' : 'Service Post'}
                </h4>
                {application.jobPost && (
                  <div>
                    <p className="font-medium">{application.jobPost.title}</p>
                    <p className="text-sm text-gray-600">{application.jobPost.description}</p>
                    <p className="text-sm text-blue-600">Budget: {formatCurrency(application.jobPost.budget)}</p>
                  </div>
                )}
                {application.availabilityPost && (
                  <div>
                    <p className="font-medium">{application.availabilityPost.title}</p>
                    <p className="text-sm text-gray-600">{application.availabilityPost.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          {canConvert && (
            <div className="flex justify-end pt-4 border-t">
              <Button 
                onClick={() => setShowConfirmDialog(true)}
                className="flex items-center gap-2"
                size="lg"
              >
                Convert to Project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {!canConvert && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                This application cannot be converted to a project. 
                {application.status === 'accepted' && ' It has already been processed.'}
                {application.status === 'rejected' && ' It has been rejected.'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert Application to Project</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p>
              Are you sure you want to convert this application to a project? This will:
            </p>
            
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
              <li>Change the application status to "Accepted"</li>
              <li>Create a new project with the proposed details</li>
              <li>Assign the artist to the project</li>
              <li>Send notifications to both parties</li>
              <li>This action cannot be undone</li>
            </ul>

            {error && (
              <Alert className="border-red-200">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              disabled={converting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConvertToProject}
              disabled={converting}
              className="flex items-center gap-2"
            >
              {converting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Converting...
                </>
              ) : (
                <>
                  Convert to Project
                  <CheckCircle className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConvertApplicationToProject;
