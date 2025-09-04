import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Search, Filter, FolderOpen, Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';

import { fetchProjects, fetchClientProjects, fetchArtistProjects, updateProjectStats } from '../../store/slices/projectSlice';
import ProjectCard from './ProjectCard';
import AuthNavbar from '../layout/AuthNavbar';

const ProjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const {
    projects = [],
    loading,
    error,
    projectStats
  } = useSelector((state) => state.projects);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Fetch projects based on user role
    if (user?.role === 'client' && user?.userId) {
      dispatch(fetchClientProjects(user.userId));
    } else if (user?.role === 'artist' && user?.userId) {
      dispatch(fetchArtistProjects(user.userId));
    } else if (user?.userId) {
      dispatch(fetchProjects());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Update project stats when projects change
    if (Array.isArray(projects) && projects.length > 0) {
      dispatch(updateProjectStats());
    }
  }, [projects, dispatch]);

  const handleViewDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  // Filter and search projects
  const filteredProjects = React.useMemo(() => {
    if (!Array.isArray(projects)) return [];

    let filtered = [...projects];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title?.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => {
        const projectStatus = project.status || 'open'; // Default status if null
        return projectStatus === statusFilter;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
        case 'oldest':
          return new Date(a.createdAt || a.updatedAt) - new Date(b.createdAt || b.updatedAt);
        case 'budget_high':
          return (b.budget || 0) - (a.budget || 0);
        case 'budget_low':
          return (a.budget || 0) - (b.budget || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, statusFilter, sortBy]);

  const getStatusCounts = () => {
    const safeProjects = Array.isArray(projects) ? projects : [];
    
    return {
      all: safeProjects.length,
      open: safeProjects.filter(p => (p.status || 'open') === 'open').length,
      in_progress: safeProjects.filter(p => p.status === 'in_progress').length,
      completed: safeProjects.filter(p => p.status === 'completed').length,
      cancelled: safeProjects.filter(p => p.status === 'cancelled').length,
      paid: safeProjects.filter(p => p.status === 'paid').length,
    };
  };  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-28 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700/30 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <div className="h-6 bg-gray-700/30 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700/30 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700/30 rounded w-2/3 mb-4"></div>
                    <div className="h-10 bg-gray-700/30 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />
      
      <div className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.role === 'client' ? 'My Projects' : 'Projects'}
              </h1>
              <p className="text-gray-300">
                {user?.role === 'client' 
                  ? 'Manage and track your creative projects' 
                  : 'View and manage assigned projects'
                }
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{statusCounts.all}</div>
                <div className="text-sm text-gray-400">Total</div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-500/10 backdrop-blur-sm border-yellow-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{statusCounts.open}</div>
                <div className="text-sm text-gray-400">Open</div>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 backdrop-blur-sm border-blue-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">{statusCounts.in_progress}</div>
                <div className="text-sm text-gray-400">In Progress</div>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 backdrop-blur-sm border-green-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{statusCounts.completed}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </CardContent>
            </Card>

            <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">{statusCounts.cancelled}</div>
                <div className="text-sm text-gray-400">Cancelled</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/10 backdrop-blur-sm border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{statusCounts.paid}</div>
                <div className="text-sm text-gray-400">Paid</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-none mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white placeholder-gray-400 focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-sm border-gray-700/50">
                    <SelectItem value="all">All Projects ({statusCounts.all})</SelectItem>
                    <SelectItem value="open">Open ({statusCounts.open})</SelectItem>
                    <SelectItem value="in_progress">In Progress ({statusCounts.in_progress})</SelectItem>
                    <SelectItem value="completed">Completed ({statusCounts.completed})</SelectItem>
                    <SelectItem value="cancelled">Cancelled ({statusCounts.cancelled})</SelectItem>
                    <SelectItem value="paid">Paid ({statusCounts.paid})</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white focus:border-[#A95BAB]/50 focus:ring-1 focus:ring-[#A95BAB]/50 transition-all">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-sm border-gray-700/50">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="budget_high">Budget: High to Low</SelectItem>
                    <SelectItem value="budget_low">Budget: Low to High</SelectItem>
                    <SelectItem value="title">Title: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          {error && (
            <Card className="bg-red-500/10 border-red-500/20 mb-6">
              <CardContent className="p-4">
                <p className="text-red-400 text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {filteredProjects.length === 0 ? (
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="text-center py-12">
                <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No projects match your filters' 
                    : 'No projects found'
                  }
                </h3>
                <p className="text-gray-400 mb-6">
                  {user?.role === 'client' 
                    ? searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Projects will appear here when applications are accepted and converted to projects'
                    : searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'  
                      : 'No projects have been assigned to you yet'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.projectId}
                  project={project}
                  onViewDetails={handleViewDetails}
                  userRole={user?.role}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
