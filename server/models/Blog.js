const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true // This will automatically add createdAt and updatedAt fields
});

// Add a virtual for the formatted dates
blogSchema.virtual('formattedDates').get(function() {
  return {
    created_at: this.createdAt,
    updated_at: this.updatedAt
  };
});

// Ensure virtuals are included when converting to JSON
blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Blog', blogSchema);
