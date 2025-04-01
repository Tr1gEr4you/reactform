import React, { useState, useEffect } from 'react';
import { fetchComments, postComment } from '../apiService';
import '../styles/CommentSection.css';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const data = await fetchComments();
        setComments(data);
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить комментарии. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };
    
    loadComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const comment = {
        text: newComment,
        date: new Date().toISOString(),
        author: 'Анонимный пользователь',
        likes: 0,
        category: 'general',
      };
      
      await postComment(comment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Не удалось отправить комментарий. Пожалуйста, попробуйте позже.');
    }
  };

  const filteredComments = comments.filter(comment => {
    // Фильтрация по категории
    if (filter !== 'all' && comment.category !== filter) return false;
    
    // Поиск по тексту
    if (searchQuery && !comment.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'oldest') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'likes') {
      return b.likes - a.likes;
    }
    return 0;
  });

  const handleLike = (id) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
    ));
  };

  return (
    <div className="comment-section">
      <h3>Комментарии и предложения</h3>
      
      <div className="comment-controls">
        <div className="filter-controls">
          <label>
            Фильтр:
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Все</option>
              <option value="general">Общие</option>
              <option value="bug">Ошибки</option>
              <option value="suggestion">Предложения</option>
            </select>
          </label>
          
          <label>
            Сортировка:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="likes">По популярности</option>
            </select>
          </label>
        </div>
        
        <div className="search-controls">
          <input
            type="text"
            placeholder="Поиск комментариев..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="add-comment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Добавьте ваш комментарий или предложение..."
          rows="3"
        />
        <button type="submit">Отправить</button>
      </form>
      
      {loading ? (
        <div className="loading">Загрузка комментариев...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="comments-list">
          {sortedComments.length === 0 ? (
            <div className="no-comments">Нет комментариев, соответствующих вашим критериям.</div>
          ) : (
            sortedComments.map((comment, index) => (
              <div key={index} className={`comment ${comment.category}`}>
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                  <span className="comment-category">{comment.category}</span>
                </div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-footer">
                  <button 
                    className="like-btn"
                    onClick={() => handleLike(comment.id)}
                  >
                    👍 {comment.likes || 0}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;