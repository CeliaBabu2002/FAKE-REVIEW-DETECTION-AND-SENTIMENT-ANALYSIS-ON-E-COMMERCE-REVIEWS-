const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 4000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/E-commerce', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for the comments
const commentSchema = new mongoose.Schema({
  name: String,
  email: String,
  category: String,
  text_: String,
  rating: Number,
  timestamp: Date // Add timestamp field to the schema
});

// Create a model based on the schema
const Comment = mongoose.model('Comment', commentSchema);

// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve your HTML form, CSS files, and the comments page
app.use(express.static(path.join(__dirname, 'public')));
app.get('/comments', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'display_comment.html'));
});

// Handle form submission
app.post('/submit-comment', async (req, res) => {
  const { name, email, category, text_, rating } = req.body; // Extract rating from request body

  // Generate a random timestamp
  const randomTimestamp = new Date(Date.now() - Math.floor(Math.random() * 1000 * 3600 * 24 * 30)); // Random timestamp within the last 30 days

  // Create a new comment object
  const newComment = new Comment({
    name,
    email,
    category,
    text_,
    rating,
    timestamp: randomTimestamp // Include random timestamp in the new comment
  });

 // Save the comment to MongoDB
await newComment.save();

// Redirect to index.html
res.redirect('/index.html');

});

// API endpoint to fetch comments
app.get('/api/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

