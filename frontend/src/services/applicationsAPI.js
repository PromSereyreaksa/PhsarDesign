import api from '../lib/api'

/**
 * API service for managing application lifecycle (accept, reject, convert to project)
 */
class ApplicationsAPI {
  
  /**
   * Get applications that can be converted to projects
   * (pending applications where user is receiver)
   */
  async getConvertibleApplications(params = {}) {
    const { status = 'pending', limit = 20, offset = 0 } = params
    const response = await api.get('/api/applications/convertible', {
      params: { status, limit, offset }
    })
    return response.data
  }

  /**
   * Get incoming applications (received by current user)
   */
  async getIncomingApplications(params = {}) {
    const { status, limit = 20, offset = 0 } = params
    const response = await api.get('/api/applications/incoming', {
      params: { status, limit, offset }
    })
    
    // Handle different response formats from backend
    if (Array.isArray(response.data)) {
      return response.data
    } else if (response.data && response.data.applications) {
      return response.data.applications
    } else if (response.data && response.data.data) {
      return response.data.data
    }
    
    return response.data
  }

  /**
   * Get outgoing applications (sent by current user)
   */
  async getOutgoingApplications(params = {}) {
    const { status, limit = 20, offset = 0 } = params
    const response = await api.get('/api/applications/outgoing', {
      params: { status, limit, offset }
    })
    
    // Handle different response formats from backend
    if (Array.isArray(response.data)) {
      return response.data
    } else if (response.data && response.data.applications) {
      return response.data.applications
    } else if (response.data && response.data.data) {
      return response.data.data
    }
    
    return response.data
  }

  /**
   * Convert an accepted application to a project
   */
  async convertApplicationToProject(applicationId) {
    const response = await api.post(`/api/applications/${applicationId}/convert-to-project`)
    return response.data
  }

  /**
   * Reject an application
   */
  async rejectApplication(applicationId, rejectionReason = '') {
    const response = await api.post(`/api/applications/${applicationId}/reject`, {
      rejectionReason
    })
    return response.data
  }

  /**
   * Accept an application (this will automatically convert to project on backend)
   */
  async acceptApplication(applicationId) {
    const response = await api.post(`/api/applications/${applicationId}/convert-to-project`)
    return response.data
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(applicationId, status) {
    const response = await api.patch(`/api/applications/${applicationId}/status`, {
      status
    })
    return response.data
  }

  /**
   * Get application details by ID
   */
  async getApplicationById(applicationId) {
    const response = await api.get(`/api/applications/${applicationId}`)
    
    // Handle different response formats from backend
    if (response.data && response.data.data) {
      return response.data.data
    }
    
    return response.data
  }

  /**
   * Delete an application
   */
  async deleteApplication(applicationId) {
    const response = await api.delete(`/api/applications/${applicationId}`)
    return response.data
  }

  /**
   * Get applications by artist ID
   */
  async getArtistApplications(artistId, params = {}) {
    const { status, limit = 20, offset = 0 } = params
    const response = await api.get(`/api/applications/artist/${artistId}`, {
      params: { status, limit, offset }
    })
    return response.data
  }

  /**
   * Get applications by project ID
   */
  async getProjectApplications(projectId, params = {}) {
    const { status, limit = 20, offset = 0 } = params
    const response = await api.get(`/api/applications/project/${projectId}`, {
      params: { status, limit, offset }
    })
    return response.data
  }

  /**
   * Get applications by type
   */
  async getApplicationsByType(type, params = {}) {
    const { status, limit = 20, offset = 0 } = params
    const response = await api.get(`/api/applications/type/${type}`, {
      params: { status, limit, offset }
    })
    return response.data
  }

  /**
   * Apply to a job (artist applying to client's job)
   */
  async applyToJob(applicationData) {
    console.log('🔥 applicationsAPI.applyToJob called with:', applicationData)
    const response = await api.post('/api/applications/job', applicationData)
    console.log('🔥 applicationsAPI.applyToJob response:', response.data)
    return response.data
  }

  /**
   * Apply to a service (client requesting artist's service)
   */
  async applyToService(applicationData) {
    console.log('🔥 applicationsAPI.applyToService called with:', applicationData)
    const response = await api.post('/api/applications/service', applicationData)
    console.log('🔥 applicationsAPI.applyToService response:', response.data)
    return response.data
  }

  /**
   * Create a job post application
   */
  async createJobPostApplication(applicationData) {
    const response = await api.post('/api/applications/job', applicationData)
    return response.data
  }

  /**
   * Create an availability post application (service request)
   */
  async createAvailabilityPostApplication(applicationData) {
    const response = await api.post('/api/applications/service', applicationData)
    return response.data
  }

  /**
   * Get all applications for current user (both incoming and outgoing)
   */
  async getAllApplications(params = {}) {
    const { status, limit = 20, offset = 0 } = params
    const response = await api.get('/api/applications', {
      params: { status, limit, offset }
    })
    return response.data
  }

  /**
   * Get application statistics/count
   */
  async getApplicationStats() {
    const response = await api.get('/api/applications/stats')
    return response.data
  }

  /**
   * Bulk accept multiple applications
   */
  async bulkAcceptApplications(applicationIds) {
    const response = await api.post('/api/applications/bulk-accept', {
      applicationIds
    })
    return response.data
  }

  /**
   * Bulk reject multiple applications
   */
  async bulkRejectApplications(applicationIds, rejectionReason = '') {
    const response = await api.post('/api/applications/bulk-reject', {
      applicationIds,
      rejectionReason
    })
    return response.data
  }
}

export const applicationsAPI = new ApplicationsAPI()
export default applicationsAPI
