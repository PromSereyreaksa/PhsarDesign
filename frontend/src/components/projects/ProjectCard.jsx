import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Calendar, 
  DollarSign, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  CreditCard
} from 'lucide-react';
import { format, isValid } from 'date-fns';

const ProjectCard = ({ project, onViewDetails, userRole }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: <CheckCircle className="h-4 w-4" />
        };
      case 'in_progress':
        return {
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: <Clock className="h-4 w-4" />
        };
      case 'open':
        return {
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: <AlertCircle className="h-4 w-4" />
        };
      case 'cancelled':
        return {
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: <XCircle className="h-4 w-4" />
        };
      case 'paid':
        return {
          color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          icon: <CreditCard className="h-4 w-4" />
        };
      default:
        return {
          color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          icon: <AlertCircle className="h-4 w-4" />
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM dd, yyyy') : null;
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'UN';
  };

  return (
    <div className="group relative h-full">
      <div
        className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5 hover:-translate-y-1 h-full flex flex-col"
        onClick={() => onViewDetails(project.projectId)}
      >
        {/* Header Section */}
        <div className="p-4 pb-3">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-white line-clamp-2 flex-1 mr-2 group-hover:text-[#A95BAB] transition-colors">
              {project.title || 'Untitled Project'}
            </h3>
            
            <Badge className={`${statusConfig.color} flex items-center gap-1 flex-shrink-0`}>
              {statusConfig.icon}
              {(project.status || 'unknown').replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Project participants */}
          <div className="flex items-center gap-3 text-sm">
            {project.client && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={project.client.user.avatarURL} />
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {getInitials(project.client.user.firstName, project.client.user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-300">
                  {project.client.user.firstName} {project.client.user.lastName}
                </span>
                {userRole !== 'client' && (
                  <span className="px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400">
                    Client
                  </span>
                )}
              </div>
            )}

            {project.artist && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={project.artist.user.avatarURL} />
                  <AvatarFallback className="bg-purple-500 text-white text-xs">
                    {getInitials(project.artist.user.firstName, project.artist.user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-300">
                  {project.artist.user.firstName} {project.artist.user.lastName}
                </span>
                {userRole !== 'artist' && (
                  <span className="px-1.5 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-400">
                    Artist
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 pt-0 space-y-3 flex-1 flex flex-col">
          {/* Price - prominently displayed */}
          <div className="text-right">
            <div className="text-[#A95BAB] font-bold text-xl">
              ${project.budget ? Number(project.budget).toLocaleString() : '0'}
            </div>
            {project.paymentStatus && (
              <div className="text-xs text-gray-400">
                {project.paymentStatus}
              </div>
            )}
          </div>

          {/* Project Description */}
          {project.description && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Project Details Pills */}
          <div className="flex flex-wrap gap-1 pt-1">
            {project.deadline && formatDate(project.deadline) && (
              <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-white/20 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(project.deadline)}
              </span>
            )}
            
            {project.createdAt && formatDate(project.createdAt) && (
              <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-white/20 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(project.createdAt)}
              </span>
            )}

            {project.categoryId && (
              <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-white/20">
                Category {project.categoryId}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-3 flex justify-between items-center border-t border-white/10">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-300">
                Project #{project.projectId}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}
            </span>
          </div>

          {/* Action Button */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(project.projectId);
              }}
              className="w-full flex items-center justify-center space-x-1 py-2 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 text-white hover:shadow-lg hover:shadow-[#A95BAB]/20"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </button>

            {/* Additional action buttons based on user role and project status */}
            {userRole === 'client' && project.status === 'completed' && project.paymentStatus !== 'paid' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle payment logic
                }}
                className="flex items-center justify-center space-x-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/20"
              >
                <CreditCard className="h-4 w-4" />
                <span>Pay</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
