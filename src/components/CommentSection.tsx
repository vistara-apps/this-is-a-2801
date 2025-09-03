import React, { useState } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: Date;
}

interface CommentSectionProps {
  remixId: string;
  comments: Comment[];
  onAddComment?: (text: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  remixId,
  comments,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user, openAuthModal } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      if (onAddComment) {
        await onAddComment(commentText);
      }
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-white/70" />
        <h3 className="text-white font-medium">Comments</h3>
        <span className="text-white/50 text-sm">({comments.length})</span>
      </div>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={isAuthenticated ? "Add a comment..." : "Log in to comment"}
            disabled={!isAuthenticated || isSubmitting}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
          />
          
          <button
            type="submit"
            disabled={!isAuthenticated || !commentText.trim() || isSubmitting}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white disabled:text-white/30 transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
      
      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-white/50 text-sm text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-sm">
                    {comment.username}
                  </span>
                  <span className="text-white/50 text-xs">
                    {formatDate(comment.timestamp)}
                  </span>
                </div>
                
                <p className="text-white/80 text-sm mt-1">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;

