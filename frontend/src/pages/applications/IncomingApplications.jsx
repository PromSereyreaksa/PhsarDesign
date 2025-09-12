import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Avatar, 
  Chip, 
  Button, 
  Box, 
  Grid, 
  Divider, 
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating
} from '@mui/material';
import {
  Person,
  Business,
  Email,
  AttachMoney,
  Schedule,
  CheckCircle,
  Cancel,
  Visibility
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const IncomingApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const limit = 10;

  useEffect(() => {
    fetchIncomingApplications();
  }, [page, statusFilter, fetchIncomingApplications]);

  const fetchIncomingApplications = useCallback(async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const response = await fetch(
        `/api/applications/incoming?status=${statusFilter}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch incoming applications');
      }

      const data = await response.json();
      console.log('[Applications] Incoming applications API response:', data);
      
      // Handle different response structures
      const applicationsData = data.applications || data.data?.applications || [];
      const totalCount = data.total || data.data?.total || 0;
      
      console.log('[Applications] Processed data:', {
        applicationsCount: applicationsData.length,
        totalCount,
        firstApp: applicationsData[0]
      });
      
      // Debug log to check application structure
      if (applicationsData && applicationsData.length > 0) {
        console.log('[Applications] Sample application structure:', applicationsData[0]);
        console.log('[Applications] Available ID properties:', {
          applicationId: applicationsData[0].applicationId,
          id: applicationsData[0].id,
          hasApplicationId: 'applicationId' in applicationsData[0],
          hasId: 'id' in applicationsData[0]
        });
      }
      
      setApplications(applicationsData);
      setTotalPages(Math.ceil(totalCount / limit));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, limit]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setActionLoading(true);
      
      console.log('[Applications] handleStatusUpdate called with:', { applicationId, newStatus });
      
      // Check if applicationId is defined
      if (!applicationId) {
        console.error('[Applications] Application ID is undefined');
        setError('Application ID is missing. Cannot update status.');
        return;
      }
      
      console.log('[Applications] Making API call to update status...');
      const response = await fetch(
        `/api/applications/${applicationId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      console.log('[Applications] Status update response:', response.status, response.ok);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[Applications] Status update failed:', errorData);
        throw new Error(`Failed to update application status: ${response.status} ${errorData}`);
      }

      console.log('[Applications] Status updated successfully, refreshing list...');
      // Refresh applications list
      await fetchIncomingApplications();
      setSelectedApplication(null);
    } catch (err) {
      console.error('[Applications] Status update error:', err);
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const ApplicationCard = ({ application }) => (
    <Card sx={{ mb: 2, elevation: 2 }}>
      <CardHeader
        avatar={
          <Avatar 
            src={application.sender?.avatarURL} 
            sx={{ width: 56, height: 56 }}
          >
            {application.sender?.firstName?.charAt(0) || 'U'}
          </Avatar>
        }
        title={
          <Typography variant="h6" component="div">
            {application.sender?.firstName} {application.sender?.lastName}
          </Typography>
        }
        subheader={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" />
              {application.sender?.email}
            </Typography>
            {application.sender?.role === 'artist' && application.sender?.artist && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Rating 
                  value={application.sender.artist.rating || 0} 
                  readOnly 
                  size="small" 
                />
                <Typography variant="body2">
                  ${application.sender.artist.hourlyRate}/hr
                </Typography>
              </Box>
            )}
            {application.sender?.role === 'client' && application.sender?.client && (
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Business fontSize="small" />
                {application.sender.client.organizationName} • {application.sender.client.industry}
              </Typography>
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip 
              label={application.status} 
              color={getStatusColor(application.status)}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        }
      />
      
      <CardContent>
        {/* Job Post Information */}
        {application.jobPost && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Job Application
            </Typography>
            <Typography variant="h6" gutterBottom>
              {application.jobPost.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {application.jobPost.description}
            </Typography>
            {application.jobPost.budget && (
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney fontSize="small" />
                Budget: {formatCurrency(application.jobPost.budget)}
              </Typography>
            )}
          </Box>
        )}

        {/* Availability Post Information */}
        {application.availabilityPost && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="secondary" gutterBottom>
              Service Application
            </Typography>
            <Typography variant="h6" gutterBottom>
              {application.availabilityPost.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {application.availabilityPost.description}
            </Typography>
          </Box>
        )}

        {/* Application Message */}
        {application.message && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Message:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {application.message}
            </Typography>
          </Box>
        )}

        {/* Skills Display */}
        {application.sender?.artist?.skills && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Skills:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {application.sender.artist.skills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  size="small" 
                  variant="outlined" 
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => setSelectedApplication(application)}
          >
            View Details
          </Button>
          
          {application.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => {
                  const appId = application.applicationId || application.id;
                  if (!appId) {
                    console.error('Application ID is missing:', application);
                    setError('Application ID is missing. Cannot accept application.');
                    return;
                  }
                  handleStatusUpdate(appId, 'accepted');
                }}
                disabled={actionLoading}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={() => {
                  const appId = application.applicationId || application.id;
                  if (!appId) {
                    console.error('Application ID is missing:', application);
                    setError('Application ID is missing. Cannot reject application.');
                    return;
                  }
                  handleStatusUpdate(appId, 'rejected');
                }}
                disabled={actionLoading}
              >
                Reject
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const ApplicationDetailsDialog = ({ application, open, onClose }) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Application Details
      </DialogTitle>
      <DialogContent>
        {application && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Applicant Information</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar 
                    src={application.sender?.avatarURL} 
                    sx={{ width: 80, height: 80 }}
                  >
                    {application.sender?.firstName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {application.sender?.firstName} {application.sender?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {application.sender?.email}
                    </Typography>
                    <Chip 
                      label={application.sender?.role} 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
                
                {application.sender?.artist && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Artist Details</Typography>
                    <Typography variant="body2">Rating: {application.sender.artist.rating}/5</Typography>
                    <Typography variant="body2">Hourly Rate: ${application.sender.artist.hourlyRate}</Typography>
                  </Box>
                )}
                
                {application.sender?.client && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Client Details</Typography>
                    <Typography variant="body2">Organization: {application.sender.client.organizationName}</Typography>
                    <Typography variant="body2">Industry: {application.sender.client.industry}</Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Application Details</Typography>
                <Typography variant="body2">Status: 
                  <Chip 
                    label={application.status} 
                    color={getStatusColor(application.status)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Applied: {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                </Typography>
                
                {application.message && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Message:</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      "{application.message}"
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {application?.status === 'pending' && (
          <>
            <Button
              color="success"
              variant="contained"
              onClick={() => {
                const appId = application.applicationId || application.id;
                if (!appId) {
                  console.error('Application ID is missing:', application);
                  setError('Application ID is missing. Cannot accept application.');
                  return;
                }
                handleStatusUpdate(appId, 'accepted');
              }}
              disabled={actionLoading}
            >
              Accept
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                const appId = application.applicationId || application.id;
                if (!appId) {
                  console.error('Application ID is missing:', application);
                  setError('Application ID is missing. Cannot reject application.');
                  return;
                }
                handleStatusUpdate(appId, 'rejected');
              }}
              disabled={actionLoading}
            >
              Reject
            </Button>
          </>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Incoming Applications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filter Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            label="Status"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No incoming applications found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Applications will appear here when others apply to your posts.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {applications.map((application) => (
            <ApplicationCard 
              key={application.applicationId || application.id || `app-${applications.indexOf(application)}`} 
              application={application} 
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Application Details Dialog */}
      <ApplicationDetailsDialog
        application={selectedApplication}
        open={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </Box>
  );
};

export default IncomingApplications;
