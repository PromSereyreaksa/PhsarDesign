import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import applicationsAPI from '../../services/applicationsAPI'
import { convertApplicationToProject, fetchProjects, fetchClientProjects } from './projectSlice'

// Async thunks
export const fetchIncomingApplications = createAsyncThunk(
  'applications/fetchIncoming',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('[Applications] Fetching incoming applications...')
      const response = await applicationsAPI.getIncomingApplications(params)
      console.log('[Applications] Incoming applications API response:', response)
      return response
    } catch (error) {
      console.error('[Applications] Failed to fetch incoming applications:', error)
      console.error('[Applications] Error response:', error.response)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incoming applications')
    }
  }
)

export const fetchOutgoingApplications = createAsyncThunk(
  'applications/fetchOutgoing',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('[Applications] Fetching outgoing applications...')
      const response = await applicationsAPI.getOutgoingApplications(params)
      console.log('[Applications] Outgoing applications API response:', response)
      return response
    } catch (error) {
      console.error('[Applications] Failed to fetch outgoing applications:', error)
      console.error('[Applications] Error response:', error.response)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch outgoing applications')
    }
  }
)

export const acceptApplication = createAsyncThunk(
  'applications/accept',
  async ({ applicationId, postId, convertToProject = true }, { rejectWithValue, dispatch, getState }) => {
    try {
      console.log('[Applications] Accepting application:', { applicationId, postId, convertToProject })
      const response = await applicationsAPI.acceptApplication(applicationId)
      console.log('[Applications] Application accepted:', response)
      
      // If convertToProject is true, convert the accepted application to a project
      if (convertToProject && response.data) {
        try {
          const application = response.data;
          const state = getState();
          const currentUser = state.auth.user;
          
          // Create project data matching backend fields exactly
          const projectData = {
            title: `Project for ${application.artist?.firstName || 'Artist'}`,
            description: `Project created from accepted application. Original message: ${application.message || 'No message provided'}`,
            budget: 100, // Default budget - can be updated later
            paymentStatus: 'pending',
            status: 'open', // Default to open as specified
            categoryId: 1, // Default category - should be updated
            clientId: application.clientId || currentUser?.userId,
            artistId: application.artistId,
            deadline: null // Can be set later
          };
          
          console.log('[Applications] Converting to project with data:', projectData);
          
          // Convert application to project
          await dispatch(convertApplicationToProject({ 
            applicationId, 
            projectData 
          })).unwrap();
          
          // Refresh projects list for the current user
          if (currentUser?.role === 'client' && currentUser?.userId) {
            await dispatch(fetchClientProjects(currentUser.userId));
          } else {
            await dispatch(fetchProjects());
          }
          
          console.log('[Applications] Project conversion and refresh completed successfully');
        } catch (conversionError) {
          console.error('[Applications] Failed to convert to project:', conversionError);
          // Don't fail the entire operation if conversion fails
        }
      }
      
      // Refresh applications after accepting
      dispatch(fetchIncomingApplications())
      dispatch(fetchOutgoingApplications())
      
      return { applicationId, ...response }
    } catch (error) {
      console.error('[Applications] Failed to accept application:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to accept application')
    }
  }
)

export const rejectApplication = createAsyncThunk(
  'applications/reject',
  async ({ applicationId, rejectionReason }, { rejectWithValue, dispatch }) => {
    try {
      console.log('[Applications] Rejecting application:', applicationId)
      const response = await applicationsAPI.rejectApplication(applicationId, rejectionReason)
      console.log('[Applications] Application rejected:', response)
      
      // Refresh applications after rejecting
      dispatch(fetchIncomingApplications())
      dispatch(fetchOutgoingApplications())
      
      return { applicationId, ...response }
    } catch (error) {
      console.error('[Applications] Failed to reject application:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to reject application')
    }
  }
)

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    // Incoming applications (received by user)
    incoming: [],
    incomingLoading: false,
    incomingError: null,
    incomingTotal: 0,
    
    // Outgoing applications (sent by user)
    outgoing: [],
    outgoingLoading: false,
    outgoingError: null,
    outgoingTotal: 0,
    
    // Action states
    accepting: false,
    rejecting: false,
    actionError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.incomingError = null
      state.outgoingError = null
      state.actionError = null
    },
    
    clearApplications: (state) => {
      state.incoming = []
      state.outgoing = []
    },
    
    updateApplicationStatus: (state, action) => {
      const { applicationId, status } = action.payload
      
      // Update in incoming applications
      const incomingIndex = state.incoming.findIndex(app => app.id === applicationId)
      if (incomingIndex !== -1) {
        state.incoming[incomingIndex].status = status
      }
      
      // Update in outgoing applications
      const outgoingIndex = state.outgoing.findIndex(app => app.id === applicationId)
      if (outgoingIndex !== -1) {
        state.outgoing[outgoingIndex].status = status
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch incoming applications
    builder
      .addCase(fetchIncomingApplications.pending, (state) => {
        state.incomingLoading = true
        state.incomingError = null
      })
      .addCase(fetchIncomingApplications.fulfilled, (state, action) => {
        state.incomingLoading = false
        console.log('[applicationsSlice] Incoming applications response:', action.payload)
        
        // Handle different response formats
        let applications = []
        if (Array.isArray(action.payload)) {
          applications = action.payload
        } else if (action.payload?.applications && Array.isArray(action.payload.applications)) {
          applications = action.payload.applications
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          applications = action.payload.data
        } else if (action.payload && typeof action.payload === 'object' && action.payload.applicationId) {
          // Single application object
          applications = [action.payload]
        }
        
        state.incoming = applications
        state.incomingTotal = action.payload.total || applications.length
        console.log('[applicationsSlice] Processed incoming applications:', applications.length)
      })
      .addCase(fetchIncomingApplications.rejected, (state, action) => {
        state.incomingLoading = false
        state.incomingError = action.payload
      })
    
    // Fetch outgoing applications
    builder
      .addCase(fetchOutgoingApplications.pending, (state) => {
        state.outgoingLoading = true
        state.outgoingError = null
      })
      .addCase(fetchOutgoingApplications.fulfilled, (state, action) => {
        state.outgoingLoading = false
        console.log('[applicationsSlice] Outgoing applications response:', action.payload)
        
        // Handle different response formats
        let applications = []
        if (Array.isArray(action.payload)) {
          applications = action.payload
        } else if (action.payload?.applications && Array.isArray(action.payload.applications)) {
          applications = action.payload.applications
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          applications = action.payload.data
        } else if (action.payload && typeof action.payload === 'object' && action.payload.applicationId) {
          // Single application object
          applications = [action.payload]
        }
        
        state.outgoing = applications
        state.outgoingTotal = action.payload.total || applications.length
        console.log('[applicationsSlice] Processed outgoing applications:', applications.length)
      })
      .addCase(fetchOutgoingApplications.rejected, (state, action) => {
        state.outgoingLoading = false
        state.outgoingError = action.payload
      })
    
    // Accept application
    builder
      .addCase(acceptApplication.pending, (state) => {
        state.accepting = true
        state.actionError = null
      })
      .addCase(acceptApplication.fulfilled, (state, action) => {
        state.accepting = false
        // Update application status locally
        const { applicationId } = action.payload
        applicationsSlice.caseReducers.updateApplicationStatus(state, {
          payload: { applicationId, status: 'accepted' }
        })
      })
      .addCase(acceptApplication.rejected, (state, action) => {
        state.accepting = false
        state.actionError = action.payload
      })
    
    // Reject application
    builder
      .addCase(rejectApplication.pending, (state) => {
        state.rejecting = true
        state.actionError = null
      })
      .addCase(rejectApplication.fulfilled, (state, action) => {
        state.rejecting = false
        // Update application status locally
        const { applicationId } = action.payload
        applicationsSlice.caseReducers.updateApplicationStatus(state, {
          payload: { applicationId, status: 'rejected' }
        })
      })
      .addCase(rejectApplication.rejected, (state, action) => {
        state.rejecting = false
        state.actionError = action.payload
      })
  }
})

export const { clearErrors, clearApplications, updateApplicationStatus } = applicationsSlice.actions
export default applicationsSlice.reducer
