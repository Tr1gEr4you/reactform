import React from 'react';
import '../styles/RatingSystem.css';

const RatingSystem = ({ ratings, onRatingChange }) => {
  const ratingCategories = [
    { id: 'usability', label: 'Удобство использования' },
    { id: 'design', label: 'Дизайн и интерфейс' },
    { id: 'performance', label: 'Производительность' },
    { id: 'features', label: 'Функциональность' },
    { id: 'support', label: 'Поддержка' },
  ];

  return (
    <div className="rating-system">
      {ratingCategories.map((category) => (
        <div key={category.id} className="rating-category">
          <label>{category.label}</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= ratings[category.id] ? 'filled' : ''}`}
                onClick={() => onRatingChange(category.id, star)}
                onMouseEnter={(e) => {
                  if (e.buttons === 1) {
                    onRatingChange(category.id, star);
                  }
                }}
                onMouseDown={() => onRatingChange(category.id, star)}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-value">{ratings[category.id]}/5</span>
        </div>
      ))}
    </div>
  );
};

export default RatingSystem;