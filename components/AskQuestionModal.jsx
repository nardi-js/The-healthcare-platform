"use client";

import React, { useState, useRef } from 'react';
import { FaQuestion, FaTags, FaCloudUploadAlt } from 'react-icons/fa';

const AskQuestionModal = ({ isOpen, onClose }) => {
  // State Management
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDetails, setQuestionDetails] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);

  // Predefined Tags
  const availableTags = [
    'Healthcare', 
    'Medical Research', 
    'Patient Care', 
    'Nutrition', 
    'Mental Health', 
    'Medical Technology'
  ];

  // File Upload Ref
  const fileInputRef = useRef(null);

  // Tag Selection Handler
  const handleTagToggle = (tag) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  // File Upload Handler
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      // Validate file types and size
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return allowedTypes.includes(file.type) && file.size <= maxSize;
    });

    setAttachedFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  // Remove Attached File
  const removeFile = (fileToRemove) => {
    setAttachedFiles(prevFiles => 
      prevFiles.filter(file => file !== fileToRemove)
    );
  };

  // Question Submission Handler
  const handleSubmitQuestion = async () => {
    // Comprehensive Validation
    const validationErrors = [];

    if (!questionTitle.trim()) {
      validationErrors.push("Question title is required");
    }

    if (questionTitle.length < 10) {
      validationErrors.push("Question title must be at least 10 characters");
    }

    if (selectedTags.length === 0) {
      validationErrors.push("Please select at least one tag");
    }

    // Display Validation Errors
    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }

    // Prepare Question Payload
    const questionPayload = {
      title: questionTitle,
      details: questionDetails,
      tags: selectedTags,
      attachments: attachedFiles.map(file => file.name),
      timestamp: new Date().toISOString(),
      author: {
        id: 'current_user_id', // Replace with actual user ID
        name: 'Current User' // Replace with actual username
      },
      status: 'open',
      views: 0,
      answers: 0
    };

    try {
      // Simulated API Call (Replace with actual backend integration)
      console.log('Submitting Question:', questionPayload);

      // Optional: File Upload Logic
      const formData = new FormData();
      attachedFiles.forEach(file => {
        formData.append('files', file);
      });

      // Reset Form
      setQuestionTitle('');
      setQuestionDetails('');
      setSelectedTags([]);
      setAttachedFiles([]);

      // Close Modal
      onClose();

      // Success Notification
      alert('Question submitted successfully!');

    } catch (error) {
      console.error('Question Submission Error:', error);
      alert('Failed to submit question. Please try again.');
    }
  };

  // Render Method
  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaQuestion className="mr-3 text-blue-500" /> Ask a Question
        </h2>

        {/* Question Title */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Question Title</label>
          <input 
            type="text" 
            value={questionTitle}
            onChange={(e) => setQuestionTitle(e.target.value)}
            placeholder="What's your healthcare-related question?"
            className="w-full p-2 border rounded"
            maxLength={200}
          />
          <p className="text-sm text-gray-500 mt-1">
            {questionTitle.length}/200 characters
          </p>
        </div>

        {/* Question Details */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Question Details</label>
          <textarea 
            value={questionDetails}
            onChange={(e) => setQuestionDetails(e.target.value)}
            placeholder="Provide more context to your question..."
            className="w-full p-2 border rounded h-32"
            maxLength={1000}
          />
          <p className="text-sm text-gray-500 mt-1">
            {questionDetails.length}/1000 characters
          </p>
        </div>

        {/* Tags Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold flex items-center">
            <FaTags className="mr-2 text-green-500" /> Select Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`
                  px-3 py-1 rounded-full text-sm 
                  ${selectedTags.includes(tag) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'}
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold flex items-center">
            <FaCloudUploadAlt className="mr-2 text-purple-500" /> 
            Attach Files (Optional)
          </label>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple 
            accept="image/jpeg,image/png,application/pdf"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Upload Files
          </button>

          {/* Attached Files Preview */}
          {attachedFiles.length > 0 && (
            <div className="mt-2">
              {attachedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-gray-100 p-2 rounded mb-1"
                >
                  <span>{file.name}</span>
                  <button 
                    onClick={() => removeFile(file)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button 
            onClick ={() => onClose()} 
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmitQuestion} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Question
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AskQuestionModal;