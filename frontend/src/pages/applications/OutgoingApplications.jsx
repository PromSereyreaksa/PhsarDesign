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
  Rating,
  LinearProgress
} from '@mui/material';
import {
  Person,
  Business,
  Email,
  AttachMoney,
  Schedule,
  Visibility,
  Edit,
  Delete,
  Refresh
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const OutgoingApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const limit = 10;

  const fetchOutgoingApplications = useCallback(async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const response = await fetch(
        `/api/applications/outgoing?status=${statusFilter}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch outgoing applications');
      }

      const data = await response.json();
      setApplications(data.data.applications);
      setTotalPages(Math.ceil(data.data.total / limit));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, limit]);

  useEffect(() => {
    fetchOutgoingApplications();
  }, [fetchOutgoingApplications]);

  const handleWithdrawApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(
        `/api/applications/${applicationId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to withdraw application');
      }

      // Refresh applications list
      await fetchOutgoingApplications();
      setSelectedApplication(null);
    } catch (err) {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '❔';
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
            src={application.receiver?.avatarURL} 
            sx={{ width: 56, height: 56 }}
          >
            {application.receiver?.firstName?.charAt(0) || 'U'}
          </Avatar>
        }
        title={
          <Typography variant="h6" component="div">
            {application.receiver?.firstName} {application.receiver?.lastName}
          </Typography>
        }
        subheader={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" />
              {application.receiver?.email}
            </Typography>
            {application.receiver?.role === 'artist' && application.receiver?.artist && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Rating 
                  value={application.receiver.artist.rating || 0} 
                  readOnly 
                  size="small" 
                />
                <Typography variant="body2">
                  ${application.receiver.artist.hourlyRate}/hr
                </Typography>
              </Box>
            )}
            {application.receiver?.role === 'client' && application.receiver?.client && (
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Business fontSize="small" />
                {application.receiver.client.organizationName} • {application.receiver.client.industry}
              </Typography>
            )}
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip 
              label={`${getStatusIcon(application.status)} ${application.status}`}
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
              Applied for Job
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
              Applied for Service
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
              Your Message:
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontStyle: 'italic',
                backgroundColor: 'grey.50',
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              "{application.message}"
            </Typography>
          </Box>
        )}

        {/* Status Progress */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Application Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={application.status === 'pending' ? 33 : application.status === 'accepted' ? 100 : 0}
                color={application.status === 'rejected' ? 'error' : 'primary'}
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {application.status === 'pending' && 'Awaiting response...'}
              {application.status === 'accepted' && 'Congratulations! Application accepted'}
              {application.status === 'rejected' && 'Application was declined'}
            </Typography>
          </Box>
        </Box>

        {/* Receiver Skills Display */}
        {application.receiver?.artist?.skills && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Receiver's Skills:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {application.receiver.artist.skills.map((skill, index) => (
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
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => {
                const appId = application.applicationId || application.id;
                if (!appId) {
                  console.error('Application ID is missing:', application);
                  // Could show toast error here
                  return;
                }
                handleWithdrawApplication(appId);
              }}
              disabled={actionLoading}
            >
              Withdraw
            </Button>
          )}

          {application.status === 'accepted' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Schedule />}
              onClick={() => {
                // Navigate to project or chat
                console.log('Navigate to project/chat');
              }}
            >
              View Project
            </Button>
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
                <Typography variant="h6" gutterBottom>Recipient Information</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar 
                    src={application.receiver?.avatarURL} 
                    sx={{ width: 80, height: 80 }}
                  >
                    {application.receiver?.firstName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {application.receiver?.firstName} {application.receiver?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {application.receiver?.email}
                    </Typography>
                    <Chip 
                      label={application.receiver?.role} 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
                
                {application.receiver?.artist && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Artist Details</Typography>
                    <Typography variant="body2">Rating: {application.receiver.artist.rating}/5</Typography>
                    <Typography variant="body2">Hourly Rate: ${application.receiver.artist.hourlyRate}</Typography>
                  </Box>
                )}
                
                {application.receiver?.client && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Client Details</Typography>
                    <Typography variant="body2">Organization: {application.receiver.client.organizationName}</Typography>
                    <Typography variant="body2">Industry: {application.receiver.client.industry}</Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Application Timeline</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Status: 
                    <Chip 
                      label={`${getStatusIcon(application.status)} ${application.status}`}
                      color={getStatusColor(application.status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Applied: {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                  </Typography>
                  {application.updatedAt !== application.createdAt && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Last Updated: {formatDistanceToNow(new Date(application.updatedAt), { addSuffix: true })}
                    </Typography>
                  )}
                </Box>
                
                {application.message && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Your Message:</Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontStyle: 'italic',
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        p: 2,
                        borderRadius: 1 
                      }}
                    >
                      "{application.message}"
                    </Typography>
                  </Box>
                )}

                {/* Application Type Info */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Application Type:</Typography>
                  {application.jobPost && (
                    <Chip label="Job Application" color="primary" variant="outlined" />
                  )}
                  {application.availabilityPost && (
                    <Chip label="Service Application" color="secondary" variant="outlined" />
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Post Details */}
            {(application.jobPost || application.availabilityPost) && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {application.jobPost ? 'Job Details' : 'Service Details'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {application.jobPost?.title || application.availabilityPost?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {application.jobPost?.description || application.availabilityPost?.description}
                </Typography>
                {application.jobPost?.budget && (
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Budget: {formatCurrency(application.jobPost.budget)}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {application?.status === 'pending' && (
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              const appId = application.applicationId || application.id;
              if (!appId) {
                console.error('Application ID is missing:', application);
                return;
              }
              handleWithdrawApplication(appId);
            }}
            disabled={actionLoading}
          >
            Withdraw Application
          </Button>
        )}
        {application?.status === 'accepted' && (
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              // Navigate to project or chat
              console.log('Navigate to project/chat');
            }}
          >
            Go to Project
          </Button>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Outgoing Applications
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchOutgoingApplications}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

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
              No outgoing applications found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your application history will appear here after you apply to jobs or services.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {applications.map((application) => (
            <ApplicationCard 
              key={application.applicationId || application.id || `outgoing-app-${applications.indexOf(application)}`} 
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

export default OutgoingApplications;
