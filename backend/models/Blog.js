import { Schema, model } from "mongoose";

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: [10, "title should be above 10 characters"]
  },
  slug: {
    type: String,
    unique: true,
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  categories: {
    type: String,
    enum: [
      'Technology', 'Health & Fitness', 'Lifestyle', 'Travel', 'Food & Drink',
      'Business & Finance', 'Education', 'Entertainment', 'Fashion', 'Sports',
      'Science', 'Art & Culture', 'Personal Development', 'Parenting', 'News & Politics',
      'Music', 'Gaming', 'Environment', 'Self-Improvement', 'Books & Literature',
      'Relationships', 'History', 'Photography', 'Tech Reviews', 'Productivity',
      'DIY (Do It Yourself)', 'Social Media', 'Mental Health', 'Philosophy', 'Pets'
    ],
    required: true
  },
  featuredImage: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }],
  viewedBy: [{ // Field to track users who have viewed the blog
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  bookmarks: [{ // New field to track users who have bookmarked the blog
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: true
});

blogSchema.pre("save", function(next) {
  this.slug = this.title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
  next();
});

blogSchema.index({ author: 1 }); // Ensure indexing for performance

const Blog = model("Blog", blogSchema);

export default Blog;