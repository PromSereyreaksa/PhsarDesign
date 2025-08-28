import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Chip,
  Button,
  Box,
  Rating,
  Divider
} from '@mui/material';
import {
  Person,
  Business,
  Email,
  AttachMoney,
  Visibility,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const ApplicationCard = ({ 
  application, 
  type = 'incoming', // 'incoming' or 'outgoing'
  onViewDetails,
  onAccept,
  onReject,
  onWithdraw,
  loading = false
}) => {
  const user = type === 'incoming' ? application.sender : application.receiver;
  const isIncoming = type === 'incoming';
  
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

  return (
    <Card sx={{ mb: 2, elevation: 2 }}>
      <CardHeader
        avatar={
          <Avatar 
            src={user?.avatarURL} 
            sx={{ width: 56, height: 56 }}
          >
            {user?.firstName?.charAt(0) || 'U'}
          </Avatar>
        }
        title={
          <Typography variant="h6" component="div">
            {user?.firstName} {user?.lastName}
          </Typography>
        }
        subheader={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" />
              {user?.email}
            </Typography>
            
            {/* Artist Info */}
            {user?.role === 'artist' && user?.artist && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Rating 
                  value={user.artist.rating || 0} 
                  readOnly 
                  size="small" 
                />
                <Typography variant="body2">
                  ${user.artist.hourlyRate}/hr
                </Typography>
              </Box>
            )}
            
            {/* Client Info */}
            {user?.role === 'client' && user?.client && (
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Business fontSize="small" />
                {user.client.organizationName} • {user.client.industry}
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
              {isIncoming ? 'Job Application' : 'Applied for Job'}
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
              {isIncoming ? 'Service Application' : 'Applied for Service'}
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
              {isIncoming ? 'Message:' : 'Your Message:'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={!isIncoming ? {
                fontStyle: 'italic',
                backgroundColor: 'grey.50',
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200'
              } : {}}
            >
              {isIncoming ? application.message : `"${application.message}"`}
            </Typography>
          </Box>
        )}

        {/* Skills Display */}
        {user?.artist?.skills && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {isIncoming ? 'Skills:' : 'Their Skills:'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {user.artist.skills.map((skill, index) => (
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
            onClick={() => onViewDetails(application)}
          >
            View Details
          </Button>
          
          {/* Incoming Application Actions */}
          {isIncoming && application.status === 'pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => onAccept(application.applicationId)}
                disabled={loading}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={() => onReject(application.applicationId)}
                disabled={loading}
              >
                Reject
              </Button>
            </>
          )}

          {/* Outgoing Application Actions */}
          {!isIncoming && application.status === 'pending' && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => onWithdraw(application.applicationId)}
              disabled={loading}
            >
              Withdraw
            </Button>
          )}

          {!isIncoming && application.status === 'accepted' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => console.log('Navigate to project')}
            >
              View Project
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
