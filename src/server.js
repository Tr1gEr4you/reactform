const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, 'data.json');

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    feedbacks: [],
    comments: []
  }));
}

function readData() {
  try {
    const rawData = fs.readFileSync(DATA_FILE);
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { feedbacks: [], comments: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
  }
}

app.post('/api/feedback', (req, res) => {
  try {
    const data = readData();
    const feedback = {
      ...req.body,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    data.feedbacks.push(feedback);
    writeData(data);
    
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

app.get('/api/comments', (req, res) => {
  try {
    const data = readData();
    res.json(data.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/api/comments', (req, res) => {
  try {
    const data = readData();
    const comment = {
      ...req.body,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      likes: 0,
      author: req.body.author || 'Анонимный пользователь'
    };
    
    data.comments.push(comment);
    writeData(data);
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error submitting comment:', error);
    res.status(500).json({ error: 'Failed to submit comment' });
  }
});

app.put('/api/comments/:id/like', (req, res) => {
  try {
    const data = readData();
    const comment = data.comments.find(c => c.id === req.params.id);
    
    if (comment) {
      comment.likes = (comment.likes || 0) + 1;
      writeData(data);
      res.json(comment);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Failed to like comment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});