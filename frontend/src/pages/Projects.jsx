import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectList from '../components/projects/ProjectList';
import ProjectDetail from '../components/projects/ProjectDetail';

const Projects = () => {
  return (
    <Routes>
      <Route index element={<ProjectList />} />
      <Route path=":projectId" element={<ProjectDetail />} />
    </Routes>
  );
};

export default Projects;
