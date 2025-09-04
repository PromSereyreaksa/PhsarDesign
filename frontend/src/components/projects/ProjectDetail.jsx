import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  User, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Check,
  Clock,
  CreditCard
} from 'lucide-react';
import { format, isValid } from 'date-fns';

import { 
  fetchProjectById, 
  updateProject, 
  updateProjectStatus, 
  deleteProject,
  fetchProjectChecklists,
  createChecklist,
  updateChecklist,
  deleteChecklist
} from '../../store/slices/projectSlice';
import ChecklistItem from './ChecklistItem';
import AuthNavbar from '../layout/AuthNavbar';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentProject, checklists, loading, error } = useSelector((state) => state.projects);

  const [isEditing, setIsEditing] = useState(false);
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [editData, setEditData] = useState({});
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newChecklistDescription, setNewChecklistDescription] = useState('');

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
      dispatch(fetchProjectChecklists(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (currentProject && !isEditing) {
      setEditData({
        title: currentProject.title || '',
        description: currentProject.description || '',
        budget: currentProject.budget || '',
        deadline: currentProject.deadline ? new Date(currentProject.deadline).toISOString().slice(0, 16) : '',
        status: currentProject.status || 'open'
      });
    }
  }, [currentProject, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: currentProject.title || '',
      description: currentProject.description || '',
      budget: currentProject.budget || '',
      deadline: currentProject.deadline ? new Date(currentProject.deadline).toISOString().slice(0, 16) : '',
      status: currentProject.status || 'open'
    });
  };

  const handleSaveEdit = async () => {
    try {
      const updateData = {
        title: editData.title,
        description: editData.description,
        budget: parseFloat(editData.budget),
        deadline: editData.deadline ? new Date(editData.deadline).toISOString() : null
      };

      await dispatch(updateProject({ projectId, projectData: updateData })).unwrap();
      setIsEditing(false);
    } catch {
      // Handle error appropriately - could show a toast or error message
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateProjectStatus({ projectId, status: newStatus })).unwrap();
    } catch {
      // Handle error appropriately - could show a toast or error message
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        navigate('/projects');
      } catch {
        // Handle error appropriately - could show a toast or error message
      }
    }
  };

  const handleAddChecklist = async () => {
    if (!newChecklistTitle.trim()) return;

    try {
      const checklistData = {
        projectId: parseInt(projectId),
        title: newChecklistTitle.trim(),
        description: newChecklistDescription.trim(),
        isCompleted: false,
        order: checklists.length
      };

      await dispatch(createChecklist(checklistData)).unwrap();
      setNewChecklistTitle('');
      setNewChecklistDescription('');
      setShowAddChecklist(false);
    } catch {
      // Handle error appropriately - could show a toast or error message
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <CheckCircle className="h-4 w-4" /> };
      case 'in_progress':
        return { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <Clock className="h-4 w-4" /> };
      case 'open':
        return { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: <AlertCircle className="h-4 w-4" /> };
      case 'cancelled':
        return { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <XCircle className="h-4 w-4" /> };
      case 'paid':
        return { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: <CreditCard className="h-4 w-4" /> };
      default:
        return { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: <AlertCircle className="h-4 w-4" /> };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM dd, yyyy hh:mm a') : 'Invalid date';
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'UN';
  };

  const canEdit = user?.role === 'client' && currentProject?.clientId === user?.userId;
  const statusConfig = getStatusConfig(currentProject?.status);

  if (loading && !currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-28 pb-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700/30 rounded w-1/3 mb-8"></div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
                <div className="h-6 bg-gray-700/30 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700/30 rounded w-full"></div>
                  <div className="h-4 bg-gray-700/30 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700/30 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-28 pb-12">
          <div className="max-w-6xl mx-auto px-6">
            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="text-center py-12">
                <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Error Loading Project</h3>
                <p className="text-red-400">{error}</p>
                <Button
                  onClick={() => navigate('/projects')}
                  className="mt-4 bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                >
                  Back to Projects
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-28 pb-12">
          <div className="max-w-6xl mx-auto px-6">
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Project Not Found</h3>
                <p className="text-gray-400">The project you're looking for doesn't exist or you don't have access to it.</p>
                <Button
                  onClick={() => navigate('/projects')}
                  className="mt-4 bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                >
                  Back to Projects
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />
      
      <div className="pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/projects')}
                variant="outline"
                size="sm"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{currentProject.title}</h1>
                <div className="flex items-center gap-3">
                  <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                    {statusConfig.icon}
                    {(currentProject.status || 'unknown').replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-gray-400">Project #{currentProject.projectId}</span>
                </div>
              </div>
            </div>

            {canEdit && (
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                    >
                      Save Changes
                    </Button>
                  </>
                )}
                
                <Button
                  onClick={handleDeleteProject}
                  variant="destructive"
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Details */}
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-white font-medium mb-2">Title</label>
                        <Input
                          value={editData.title}
                          onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Description</label>
                        <Textarea
                          value={editData.description}
                          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all"
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Budget</label>
                          <Input
                            type="number"
                            value={editData.budget}
                            onChange={(e) => setEditData(prev => ({ ...prev, budget: e.target.value }))}
                            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2">Deadline</label>
                          <Input
                            type="datetime-local"
                            value={editData.deadline}
                            onChange={(e) => setEditData(prev => ({ ...prev, deadline: e.target.value }))}
                            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-white font-medium mb-2">Description</h3>
                        <p className="text-gray-300 leading-relaxed">
                          {currentProject.description || 'No description provided'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-green-400" />
                          <div>
                            <span className="text-white font-medium text-lg">
                              ${currentProject.budget ? Number(currentProject.budget).toLocaleString() : '0'}
                            </span>
                            <p className="text-gray-400 text-sm">Budget</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-blue-400" />
                          <div>
                            <span className="text-white font-medium">
                              {formatDate(currentProject.deadline)}
                            </span>
                            <p className="text-gray-400 text-sm">Deadline</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-orange-400" />
                          <div>
                            <span className="text-white font-medium">
                              {formatDate(currentProject.createdAt)}
                            </span>
                            <p className="text-gray-400 text-sm">Created</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-purple-400" />
                          <div>
                            <span className="text-white font-medium capitalize">
                              {currentProject.paymentStatus || 'pending'}
                            </span>
                            <p className="text-gray-400 text-sm">Payment Status</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Checklist Section */}
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Project Checklist</CardTitle>
                    <Button
                      onClick={() => setShowAddChecklist(true)}
                      size="sm"
                      className="bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Add New Checklist Item */}
                  {showAddChecklist && (
                    <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/50">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <Input
                            placeholder="Checklist item title..."
                            value={newChecklistTitle}
                            onChange={(e) => setNewChecklistTitle(e.target.value)}
                            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all"
                          />
                          <Textarea
                            placeholder="Description (optional)..."
                            value={newChecklistDescription}
                            onChange={(e) => setNewChecklistDescription(e.target.value)}
                            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={handleAddChecklist}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Add
                            </Button>
                            <Button
                              onClick={() => {
                                setShowAddChecklist(false);
                                setNewChecklistTitle('');
                                setNewChecklistDescription('');
                              }}
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Checklist Items */}
                  {checklists.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400">No checklist items yet</p>
                      <p className="text-gray-500 text-sm">Add items to track project progress</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {checklists.map((checklist) => (
                        <ChecklistItem
                          key={checklist.checklistId}
                          checklist={checklist}
                          onUpdate={(checklistId, data) => dispatch(updateChecklist({ checklistId, checklistData: data }))}
                          onDelete={(checklistId) => dispatch(deleteChecklist(checklistId))}
                          canEdit={canEdit}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Team */}
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Project Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentProject.client && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentProject.client.avatarURL} />
                        <AvatarFallback className="bg-blue-500 text-white">
                          {getInitials(currentProject.client.firstName, currentProject.client.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">
                          {currentProject.client.firstName} {currentProject.client.lastName}
                        </p>
                        <p className="text-gray-400 text-sm">Client</p>
                      </div>
                    </div>
                  )}

                  {currentProject.artist ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentProject.artist.avatarURL} />
                        <AvatarFallback className="bg-purple-500 text-white">
                          {getInitials(currentProject.artist.firstName, currentProject.artist.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">
                          {currentProject.artist.firstName} {currentProject.artist.lastName}
                        </p>
                        <p className="text-gray-400 text-sm">Artist</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No artist assigned</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status Management */}
              {canEdit && (
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Status Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={currentProject.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900/95 backdrop-blur-sm border-gray-700/50">
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              )}

              {/* Project Stats */}
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Checklist Progress</span>
                      <span className="text-white font-medium">
                        {checklists.filter(c => c.isCompleted).length}/{checklists.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-[#A95BAB] h-2 rounded-full transition-all duration-300"
                        style={{
                          width: checklists.length > 0 
                            ? `${(checklists.filter(c => c.isCompleted).length / checklists.length) * 100}%` 
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
