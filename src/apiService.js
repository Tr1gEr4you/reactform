// src/apiService.js
const API_BASE_URL = 'http://localhost:5000/api';

export const submitFeedback = async (feedbackData) => {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }
  
  return response.json();
};

export const fetchComments = async () => {
  const response = await fetch(`${API_BASE_URL}/comments`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  
  return response.json();
};

export const postComment = async (commentData) => {
  const response = await fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to post comment');
  }
  
  return response.json();
};