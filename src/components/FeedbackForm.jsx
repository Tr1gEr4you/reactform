import React, { useState } from 'react';
import RatingSystem from './RatingSystem';
import CommentSection from './CommentSection';
import Notification from './Notification';
import { submitFeedback } from '../apiService';
import '../styles/FeedbackForm.css';

const FeedbackForm = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    experience: '',
  });
  
  const [ratings, setRatings] = useState({
    usability: 0,
    design: 0,
    performance: 0,
    features: 0,
    support: 0,
  });
  
  const [comments, setComments] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [category, setCategory] = useState('general');
  const [notification, setNotification] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (name, value) => {
    setRatings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const feedbackData = {
      ...userData,
      ratings,
      comments,
      suggestions,
      category,
      timestamp: new Date().toISOString(),
    };

    try {
      await submitFeedback(feedbackData);
      setNotification({
        type: 'success',
        message: 'Спасибо за ваш отзыв! Ваше мнение очень важно для нас.',
      });
      setSubmitted(true);
      
      // Сброс формы после успешной отправки
      setTimeout(() => {
        setUserData({ name: '', email: '', experience: '' });
        setRatings({
          usability: 0,
          design: 0,
          performance: 0,
          features: 0,
          support: 0,
        });
        setComments('');
        setSuggestions('');
        setCategory('general');
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.',
      });
    }
  };

  return (
    <div className="feedback-container">
      <h2>Оставьте ваш отзыв о нашем продукте</h2>
      
      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message} 
          onClose={() => setNotification(null)}
        />
      )}
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="name">Ваше имя (необязательно)</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Иван Иванов"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email (необязательно)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="example@domain.com"
            />
          </div>
          
          <div className="form-group">
            <label>Оцените наш продукт:</label>
            <RatingSystem 
              ratings={ratings} 
              onRatingChange={handleRatingChange} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="experience">Расскажите о вашем опыте использования</label>
            <textarea
              id="experience"
              name="experience"
              value={userData.experience}
              onChange={handleChange}
              placeholder="Поделитесь вашими впечатлениями..."
              rows="4"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Категория отзыва</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="general">Общий отзыв</option>
              <option value="bug">Сообщение об ошибке</option>
              <option value="suggestion">Предложение по улучшению</option>
              <option value="question">Вопрос</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="comments">Комментарии</label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Ваши комментарии..."
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="suggestions">Предложения по улучшению</label>
            <textarea
              id="suggestions"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="Ваши предложения..."
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <button type="submit" className="submit-btn">
              Отправить отзыв
            </button>
          </div>
        </form>
      ) : (
        <div className="thank-you-message">
          <h3>Спасибо за ваш отзыв!</h3>
          <p>Мы ценим ваше время и усилия. Ваше мнение поможет нам сделать продукт лучше.</p>
        </div>
      )}
      
      <CommentSection />
    </div>
  );
};

export default FeedbackForm;