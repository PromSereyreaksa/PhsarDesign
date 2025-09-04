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
    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-white text-lg font-semibold line-clamp-2 group-hover:text-[#A95BAB] transition-colors">
            {project.title || 'Untitled Project'}
          </CardTitle>
          
          <Badge className={`${statusConfig.color} flex items-center gap-1 flex-shrink-0 ml-2`}>
            {statusConfig.icon}
            {(project.status || 'unknown').replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Project participants */}
        <div className="flex items-center gap-3 text-sm">
          {project.client && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={project.client.avatarURL} />
                <AvatarFallback className="bg-blue-500 text-white text-xs">
                  {getInitials(project.client.firstName, project.client.lastName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-300">
                {project.client.firstName} {project.client.lastName}
              </span>
              {userRole !== 'client' && (
                <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                  Client
                </Badge>
              )}
            </div>
          )}

          {project.artist && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={project.artist.avatarURL} />
                <AvatarFallback className="bg-purple-500 text-white text-xs">
                  {getInitials(project.artist.firstName, project.artist.lastName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-300">
                {project.artist.firstName} {project.artist.lastName}
              </span>
              {userRole !== 'artist' && (
                <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                  Artist
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Description */}
        {project.description && (
          <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-400 flex-shrink-0" />
            <div>
              <span className="text-white font-medium">
                ${project.budget ? Number(project.budget).toLocaleString() : '0'}
              </span>
              {project.paymentStatus && (
                <div className="text-xs text-gray-400">
                  {project.paymentStatus}
                </div>
              )}
            </div>
          </div>

          {project.deadline && formatDate(project.deadline) && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-gray-300">
                  {formatDate(project.deadline)}
                </span>
                <div className="text-xs text-gray-400">Deadline</div>
              </div>
            </div>
          )}

          {project.createdAt && formatDate(project.createdAt) && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-400 flex-shrink-0" />
              <div>
                <span className="text-gray-300">
                  {formatDate(project.createdAt)}
                </span>
                <div className="text-xs text-gray-400">Created</div>
              </div>
            </div>
          )}

          {project.categoryId && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-400 flex-shrink-0" />
              <div>
                <span className="text-gray-300">Category {project.categoryId}</span>
                <div className="text-xs text-gray-400">Category</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onViewDetails(project.projectId)}
            variant="outline"
            size="sm"
            className="flex-1 border-white/30 text-white hover:bg-white/10 hover:border-[#A95BAB] transition-all duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>

          {/* Additional action buttons based on user role and project status */}
          {userRole === 'client' && project.status === 'completed' && project.paymentStatus !== 'paid' && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pay
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
