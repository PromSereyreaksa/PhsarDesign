import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { CheckCircle, Circle, Edit, Trash2, Save, X } from 'lucide-react';

const ChecklistItem = ({ checklist, onUpdate, onDelete, canEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: checklist.title || '',
    description: checklist.description || '',
    isCompleted: checklist.isCompleted || false
  });

  const handleToggleComplete = async () => {
    if (!canEdit) return;
    
    const newStatus = !checklist.isCompleted;
    await onUpdate(checklist.checklistId, {
      ...checklist,
      isCompleted: newStatus
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: checklist.title || '',
      description: checklist.description || '',
      isCompleted: checklist.isCompleted || false
    });
  };

  const handleSave = async () => {
    await onUpdate(checklist.checklistId, {
      ...checklist,
      title: editData.title,
      description: editData.description,
      isCompleted: editData.isCompleted
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: checklist.title || '',
      description: checklist.description || '',
      isCompleted: checklist.isCompleted || false
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this checklist item?')) {
      await onDelete(checklist.checklistId);
    }
  };

  return (
    <Card className={`transition-all duration-200 ${
      checklist.isCompleted 
        ? 'bg-green-500/5 border-green-500/20' 
        : 'bg-gray-700 border-gray-600'
    }`}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Checklist item title..."
            />
            <Textarea
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Description (optional)..."
              rows={2}
            />
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={editData.isCompleted}
                  onChange={(e) => setEditData(prev => ({ ...prev, isCompleted: e.target.checked }))}
                  className="rounded border-gray-600 bg-gray-800 text-[#A95BAB] focus:ring-[#A95BAB]"
                />
                Mark as completed
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <button
              onClick={handleToggleComplete}
              disabled={!canEdit}
              className={`mt-1 transition-colors ${
                canEdit 
                  ? 'text-[#A95BAB] hover:text-[#A95BAB]/80' 
                  : 'text-gray-500 cursor-not-allowed'
              }`}
            >
              {checklist.isCompleted ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <div className="flex-1">
              <h4 className={`font-medium ${
                checklist.isCompleted ? 'text-gray-400 line-through' : 'text-white'
              }`}>
                {checklist.title}
              </h4>
              {checklist.description && (
                <p className={`text-sm mt-1 ${
                  checklist.isCompleted ? 'text-gray-500' : 'text-gray-300'
                }`}>
                  {checklist.description}
                </p>
              )}
            </div>

            {canEdit && (
              <div className="flex gap-1">
                <Button
                  onClick={handleEdit}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white p-1 h-auto"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleDelete}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-red-400 p-1 h-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChecklistItem;
