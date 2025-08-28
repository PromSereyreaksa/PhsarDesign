import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Badge,
  Paper,
  Typography,
  Container
} from '@mui/material';
import {
  Inbox,
  Send,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import IncomingApplications from './IncomingApplications';
import OutgoingApplications from './OutgoingApplications';

const ApplicationsDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`applications-tabpanel-${index}`}
      aria-labelledby={`applications-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );

  const a11yProps = (index) => ({
    id: `applications-tab-${index}`,
    'aria-controls': `applications-tabpanel-${index}`,
  });

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <DashboardIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Applications Dashboard
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage all your incoming and outgoing applications in one place. 
          Track application status, respond to requests, and manage your professional connections.
        </Typography>

        <Paper elevation={1}>
          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              aria-label="applications tabs"
              variant="fullWidth"
            >
              <Tab
                icon={
                  <Badge badgeContent={0} color="error" max={99}>
                    <Inbox />
                  </Badge>
                }
                label="Incoming Applications"
                {...a11yProps(0)}
                sx={{
                  minHeight: 72,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                }}
              />
              <Tab
                icon={
                  <Badge badgeContent={0} color="info" max={99}>
                    <Send />
                  </Badge>
                }
                label="Outgoing Applications"
                {...a11yProps(1)}
                sx={{
                  minHeight: 72,
                  '&.Mui-selected': {
                    backgroundColor: 'secondary.light',
                    color: 'secondary.contrastText'
                  }
                }}
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <TabPanel value={activeTab} index={0}>
            <IncomingApplications />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <OutgoingApplications />
          </TabPanel>
        </Paper>

        {/* Quick Stats or Help Section */}
        <Box sx={{ mt: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            📋 Application Tips
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Incoming:</strong> Review and respond to applications promptly to maintain good relationships
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Outgoing:</strong> Follow up on pending applications after a reasonable time
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Status Updates:</strong> Keep applicants informed about their application status
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Professional Communication:</strong> Always maintain professional and respectful communication
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ApplicationsDashboard;
