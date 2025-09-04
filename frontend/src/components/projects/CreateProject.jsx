import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Save, Plus, Calendar } from 'lucide-react';

import { createProject } from '../../store/slices/projectSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import AuthNavbar from '../layout/AuthNavbar';

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.categories);
  const { loading, error } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    categoryId: '',
    deadline: '',
    paymentStatus: 'pending',
    status: 'open'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch categories for the dropdown
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user makes selection
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Please enter a valid budget amount';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare project data matching backend fields
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: parseFloat(formData.budget),
        categoryId: parseInt(formData.categoryId),
        clientId: user?.userId,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        paymentStatus: formData.paymentStatus,
        status: formData.status
      };

      const result = await dispatch(createProject(projectData)).unwrap();

      // Navigate to the new project
      navigate(`/projects/${result.projectId}`);
    } catch (error) {
      setErrors({ general: error.message || 'Failed to create project. Please try again.' });
    }
  };

  const handleBack = () => {
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />
      
      <div className="pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Create New Project</h1>
              <p className="text-gray-300">Set up a new project to work with an artist</p>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Project Title *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter project title..."
                    className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-[#A95BAB] ${
                      errors.title ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Project Description *
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project requirements..."
                    rows={4}
                    className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-[#A95BAB] ${
                      errors.description ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Budget and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Budget ($) *
                    </label>
                    <Input
                      name="budget"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-[#A95BAB] ${
                        errors.budget ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.budget && (
                      <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Category *
                    </label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(value) => handleSelectChange('categoryId', value)}
                    >
                      <SelectTrigger className={`bg-gray-900 border-gray-600 text-white focus:border-[#A95BAB] ${
                        errors.categoryId ? 'border-red-500' : ''
                      }`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {categories?.map((category) => (
                          <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>
                    )}
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Deadline (Optional)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      name="deadline"
                      type="datetime-local"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-900 border-gray-600 text-white focus:border-[#A95BAB]"
                    />
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Payment Status
                  </label>
                  <Select 
                    value={formData.paymentStatus} 
                    onValueChange={(value) => handleSelectChange('paymentStatus', value)}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white focus:border-[#A95BAB]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Error Display */}
                {error && (
                  <Card className="bg-red-500/10 border-red-500/20">
                    <CardContent className="p-4">
                      <p className="text-red-400 text-center">{error}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#A95BAB] hover:bg-[#A95BAB]/80 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Create Project
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
