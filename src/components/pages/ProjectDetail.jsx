// src/components/pages/ProjectDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiArrowLeft, FiHeart, FiMessageSquare, FiEye, FiShare2, FiBookmark,
    FiStar, FiGitBranch, FiExternalLink, FiCalendar, FiTag, FiUser,
    FiChevronUp, FiChevronDown, FiSend, FiMoreVertical, FiEdit2,
    FiTrash2, FiCopy, FiCheck, FiCode, FiGlobe, FiClock,
    FiThumbsUp, FiCornerUpRight, FiAlertCircle
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

// --- Custom CSS for Project Detail ---
const projectDetailStyles = `
    @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
    }
    
    .dashboard-gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #f093fb 100%);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 8s ease infinite;
    }
    
    .dashboard-glass-effect {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .dashboard-card-hover {
        transition: all 0.3s ease;
    }
    
    .dashboard-card-hover:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .markdown-content h1 {
        font-size: 2rem;
        font-weight: bold;
        margin: 1.5rem 0 1rem;
        color: var(--color-text);
    }
    
    .markdown-content h2 {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 1.25rem 0 0.75rem;
        color: var(--color-text);
    }
    
    .markdown-content h3 {
        font-size: 1.25rem;
        font-weight: bold;
        margin: 1rem 0 0.5rem;
        color: var(--color-text);
    }
    
    .markdown-content p {
        margin-bottom: 1rem;
        line-height: 1.6;
        color: var(--color-text-muted);
    }
    
    .markdown-content ul, .markdown-content ol {
        margin-bottom: 1rem;
        padding-left: 1.5rem;
    }
    
    .markdown-content li {
        margin-bottom: 0.5rem;
        line-height: 1.6;
        color: var(--color-text-muted);
    }
    
    .markdown-content code {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
    }
    
    .markdown-content pre {
        background: rgba(15, 15, 25, 0.5);
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin-bottom: 1rem;
    }
    
    .markdown-content pre code {
        background: transparent;
        color: var(--color-text);
        padding: 0;
    }
    
    .markdown-content blockquote {
        border-left: 3px solid #667eea;
        padding-left: 1rem;
        margin-left: 0;
        color: var(--color-text-muted);
        font-style: italic;
    }
    
    .markdown-content a {
        color: #667eea;
        text-decoration: none;
        border-bottom: 1px solid rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
    }
    
    .markdown-content a:hover {
        border-bottom-color: #667eea;
    }
`;

// --- Button Styles ---
const primaryButtonStyle = { 
    padding: '0.75rem 1.5rem', 
    borderRadius: '0.75rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
};

const secondaryButtonStyle = { 
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    background: 'transparent',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    color: 'var(--color-text)',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
};

// --- Comment Component ---
const Comment = ({ comment, isOwner, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard-glass-effect"
            style={{
                padding: '1.25rem',
                borderRadius: '1rem',
                marginBottom: '1rem',
            }}
        >
            <div style={{ display: 'flex', gap: '1rem' }}>
                {/* Avatar */}
                <Link to={`/u/${comment.author.username}`}>
                    <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        color: 'white',
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        flexShrink: 0,
                    }}>
                        {comment.author.avatar_url ? (
                            <img 
                                src={comment.author.avatar_url} 
                                alt={comment.author.username}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            comment.author.username?.charAt(0) || 'U'
                        )}
                    </div>
                </Link>
                
                {/* Comment Content */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                            <Link to={`/u/${comment.author.username}`} style={{ textDecoration: 'none' }}>
                                <span style={{ 
                                    fontWeight: '600', 
                                    color: 'var(--color-text)',
                                    fontSize: '0.95rem',
                                }}>
                                    {comment.author.username}
                                </span>
                            </Link>
                            {comment.author.isOwner && (
                                <span style={{
                                    marginLeft: '0.5rem',
                                    fontSize: '0.75rem',
                                    padding: '0.1rem 0.5rem',
                                    borderRadius: '1rem',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                }}>
                                    Author
                                </span>
                            )}
                            <span style={{ 
                                marginLeft: '0.5rem',
                                fontSize: '0.85rem', 
                                color: 'var(--color-text-muted)' 
                            }}>
                                • {formatDate(comment.created_at)}
                            </span>
                        </div>
                        
                        <div style={{ position: 'relative' }}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowActions(!showActions)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--color-text-muted)',
                                    cursor: 'pointer',
                                    padding: '0.25rem',
                                    borderRadius: '0.25rem',
                                }}
                            >
                                <FiMoreVertical />
                            </motion.button>
                            
                            {showActions && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    background: 'rgba(30, 30, 50, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '0.5rem',
                                    padding: '0.5rem',
                                    zIndex: 100,
                                    minWidth: '120px',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                                }}>
                                    {(isOwner || comment.isOwnComment) && (
                                        <button
                                            onClick={() => {
                                                onDelete(comment.id);
                                                setShowActions(false);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem 0.75rem',
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                fontSize: '0.9rem',
                                                borderRadius: '0.25rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <FiTrash2 size={14} /> Delete
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(comment.content);
                                            setShowActions(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem 0.75rem',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--color-text)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontSize: '0.9rem',
                                            borderRadius: '0.25rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <FiCopy size={14} /> Copy
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="markdown-content" style={{ 
                        color: 'var(--color-text-muted)', 
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                    }}>
                        <ReactMarkdown>
                            {isExpanded || comment.content.length < 300 
                                ? comment.content 
                                : `${comment.content.substring(0, 300)}...`
                            }
                        </ReactMarkdown>
                        
                        {comment.content.length > 300 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#667eea',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    marginTop: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                }}
                            >
                                {isExpanded ? 'Show less' : 'Read more'} 
                                {isExpanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                            </button>
                        )}
                    </div>
                    
                    {/* Comment Actions */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                background: 'transparent',
                                border: 'none',
                                color: comment.isLiked ? '#f97316' : 'var(--color-text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                            }}
                        >
                            <FiThumbsUp size={14} /> {comment.likes}
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                            }}
                        >
                            <FiCornerUpRight size={14} /> Reply
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main ProjectDetail Component ---
export default function ProjectDetailPage() {
    const { projectId } = useParams();
    const { session } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [voteCount, setVoteCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const commentInputRef = useRef(null);

    // Fetch project data
    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            try {
                // Mock project data - replace with Supabase query
                const mockProject = {
                    id: projectId || '1',
                    title: 'CodeCollab AI',
                    description: 'Real-time collaborative code editor with AI pair programming assistant. Supports multiple languages and has built-in debugging tools.',
                    long_description: `# CodeCollab AI

## 🚀 Overview
CodeCollab AI is a revolutionary real-time collaborative code editor that brings AI-powered pair programming to developers worldwide. Built with cutting-edge technologies, it allows multiple developers to work on the same codebase simultaneously with AI assistance.

## ✨ Features

### 🔄 Real-time Collaboration
- Live code editing with multiple collaborators
- Cursor tracking and presence indicators
- Real-time syntax highlighting
- Conflict-free merging

### 🤖 AI Pair Programming
- Code completion suggestions
- Bug detection and fixes
- Code optimization recommendations
- Documentation generation

### 🛠 Tech Stack
- *Frontend*: React, TypeScript, Monaco Editor
- *Backend*: Node.js, WebSockets
- *AI*: OpenAI GPT-4, Custom ML Models
- *Database*: PostgreSQL, Redis
- *Infrastructure*: Docker, AWS

## 🎯 Use Cases
1. *Remote Team Collaboration*: Perfect for distributed teams
2. *Education*: Great for coding bootcamps and workshops
3. *Code Reviews*: Simplify the review process
4. *Pair Programming Sessions*: Enhanced with AI assistance

## 📦 Installation
\\\`bash
git clone https://github.com/username/codecollab-ai.git
cd codecollab-ai
npm install
npm run dev
\\\`

## 🔧 Configuration
Create a \.env\ file with:
\\\`env
OPENAI_API_KEY=your_key_here
DATABASE_URL=your_db_url
WEBSOCKET_URL=ws://localhost:3001
\\\`

## 🤝 Contributing
We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

## 📄 License
MIT License - see [LICENSE](LICENSE) file for details.`,
                    author: {
                        id: 'user123',
                        username: 'sarahdev',
                        full_name: 'Sarah Johnson',
                        avatar_url: 'https://i.pravatar.cc/150?img=1',
                        bio: 'Full-stack developer passionate about AI and open source.',
                    },
                    votes: 142,
                    comments: 23,
                    views: 1245,
                    tags: ['React', 'AI', 'WebSockets', 'TypeScript', 'Real-time', 'Collaboration'],
                    isFeatured: true,
                    github_url: 'https://github.com/username/codecollab-ai',
                    live_url: 'https://demo.codecollab.ai',
                    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
                    updated_at: new Date(Date.now() - 1 * 3600000).toISOString(),
                    tech_stack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'OpenAI API', 'PostgreSQL'],
                };

                // Mock comments
                const mockComments = [
                    {
                        id: 'comment1',
                        content: 'This is amazing! The AI suggestions are incredibly accurate. How did you train the model?',
                        author: {
                            username: 'marcuslee',
                            avatar_url: 'https://i.pravatar.cc/150?img=2',
                            isOwner: false,
                        },
                        likes: 12,
                        isLiked: false,
                        created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
                        isOwnComment: false,
                    },
                    {
                        id: 'comment2',
                        content: 'Great work on the real-time collaboration feature! The WebSocket implementation looks solid. Any plans to add video chat integration?',
                        author: {
                            username: 'jamiewilson',
                            avatar_url: 'https://i.pravatar.cc/150?img=3',
                            isOwner: false,
                        },
                        likes: 8,
                        isLiked: true,
                        created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
                        isOwnComment: false,
                    },
                    {
                        id: 'comment3',
                        content: 'Thanks for sharing this! The code quality is excellent. I particularly like the error handling implementation. Are you planning to add support for more languages?',
                        author: {
                            username: session?.user?.user_metadata?.username || 'currentuser',
                            avatar_url: session?.user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?img=4',
                            isOwner: false,
                        },
                        likes: 5,
                        isLiked: false,
                        created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
                        isOwnComment: true,
                    },
                ];

                setProject(mockProject);
                setAuthor(mockProject.author);
                setComments(mockComments);
                setVoteCount(mockProject.votes);
                setViewCount(mockProject.views);
                setIsUpvoted(false); // In real app, check if user has upvoted
                setIsBookmarked(false); // In real app, check if user has bookmarked
                setIsOwner(session?.user?.id === mockProject.author.id);

                // Increment view count
                setViewCount(prev => prev + 1);
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, session]);

    // Handle upvote
    const handleUpvote = async () => {
        if (!session) {
            navigate('/auth?mode=login');
            return;
        }

        try {
            if (isUpvoted) {
                setVoteCount(prev => prev - 1);
            } else {
                setVoteCount(prev => prev + 1);
            }
            setIsUpvoted(!isUpvoted);
            
            // In real app: Call Supabase to update vote
        } catch (error) {
            console.error('Error upvoting:', error);
        }
    };

    // Handle bookmark
    const handleBookmark = async () => {
        if (!session) {
            navigate('/auth?mode=login');
            return;
        }

        try {
            setIsBookmarked(!isBookmarked);
            // In real app: Call Supabase to update bookmark
        } catch (error) {
            console.error('Error bookmarking:', error);
        }
    };

    // Handle share
    const handleShare = () => {
        setShowShareMenu(!showShareMenu);
        if (navigator.share) {
            navigator.share({
                title: project?.title,
                text: project?.description,
                url: window.location.href,
            });
        }
    };

    // Handle copy link
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareMenu(false);
            // Show success toast in real app
        } catch (error) {
            console.error('Error copying link:', error);
        }
    };

    // Handle add comment
    const handleAddComment = async () => {
        if (!session) {
            navigate('/auth?mode=login');
            return;
        }

        if (!newComment.trim()) return;

        try {
            const newCommentObj = {
                id: `comment${Date.now()}`,
                content: newComment,
                author: {
                    username: session.user.user_metadata?.username || 'currentuser',
                    avatar_url: session.user.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?img=4',
                    isOwner: false,
                },
                likes: 0,
                isLiked: false,
                created_at: new Date().toISOString(),
                isOwnComment: true,
            };

            setComments(prev => [newCommentObj, ...prev]);
            setNewComment('');
            
            // In real app: Call Supabase to add comment
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Handle delete comment
    const handleDeleteComment = (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            setComments(prev => prev.filter(comment => comment.id !== commentId));
            // In real app: Call Supabase to delete comment
        }
    };

    // Handle delete project (owner only)
    const handleDeleteProject = async () => {
        if (!isOwner) return;
        
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            try {
                // In real app: Call Supabase to delete project
                navigate('/dashboard');
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate read time
    const calculateReadTime = (text) => {
        const wordsPerMinute = 200;
        const wordCount = text.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min read`;
    };

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'var(--color-background-dark)',
            }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                        width: '3rem',
                        height: '3rem',
                        border: '3px solid rgba(102, 126, 234, 0.3)',
                        borderTopColor: '#667eea',
                        borderRadius: '50%',
                    }}
                />
            </div>
        );
    }

    if (!project) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'var(--color-background-dark)',
                color: 'var(--color-text-muted)',
                padding: '2rem',
                textAlign: 'center',
            }}>
                <FiAlertCircle size={64} style={{ marginBottom: '1rem', color: '#ef4444' }} />
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Project Not Found</h1>
                <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>The project you're looking for doesn't exist or has been removed.</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            ...secondaryButtonStyle,
                            padding: '0.75rem 1.5rem',
                        }}
                    >
                        <FiArrowLeft /> Go Back
                    </button>
                    <button
                        onClick={() => navigate('/discover')}
                        style={{
                            ...primaryButtonStyle,
                            padding: '0.75rem 1.5rem',
                        }}
                    >
                        Browse Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--color-background-dark)', 
            color: 'var(--color-text)',
        }}>
            {/* Add CSS styles */}
            <style>{projectDetailStyles}</style>
            
            {/* Animated background */}
            <div style={{
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                height: '400px',
                background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%)',
                zIndex: 0,
            }} />

            {/* Navigation Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '1rem 2rem',
                background: 'rgba(15, 15, 25, 0.9)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text)',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <FiArrowLeft /> Back
                </motion.button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {isOwner && (
                        <>
                            <Link to={`/edit/${projectId}`}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        ...secondaryButtonStyle,
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    <FiEdit2 /> Edit
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDeleteProject}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.5rem',
                                    background: 'transparent',
                                    border: '2px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <FiTrash2 /> Delete
                            </motion.button>
                        </>
                    )}
                    
                    <div style={{ position: 'relative' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleShare}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'var(--color-text)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                            }}
                        >
                            <FiShare2 /> Share
                        </motion.button>
                        
                        {showShareMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                background: 'rgba(30, 30, 50, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.75rem',
                                padding: '0.5rem',
                                minWidth: '150px',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                                zIndex: 1000,
                            }}>
                                <button
                                    onClick={handleCopyLink}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--color-text)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontSize: '0.9rem',
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <FiCopy size={16} /> Copy Link
                                </button>
                                <div style={{ 
                                    height: '1px', 
                                    background: 'rgba(255, 255, 255, 0.1)', 
                                    margin: '0.5rem 0' 
                                }} />
                                <button
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title)}&url=${encodeURIComponent(window.location.href)}`)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--color-text)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontSize: '0.9rem',
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <FiShare2 size={16} /> Share on Twitter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                padding: '2rem',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Project Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="dashboard-glass-effect"
                    style={{
                        padding: '2.5rem',
                        borderRadius: '1.5rem',
                        marginBottom: '2rem',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                {project.isFeatured && (
                                    <span style={{
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        color: 'white',
                                        padding: '0.25rem 1rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                    }}>
                                        <FiStar size={14} /> Featured
                                    </span>
                                )}
                                <span style={{ 
                                    fontSize: '0.9rem', 
                                    color: 'var(--color-text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                }}>
                                    <FiClock size={14} /> {calculateReadTime(project.long_description)}
                                </span>
                            </div>
                            
                            <h1 style={{ 
                                fontSize: '3rem', 
                                fontWeight: 'bold', 
                                marginBottom: '1rem',
                                lineHeight: '1.2',
                            }}>
                                {project.title}
                            </h1>
                            
                            <p style={{ 
                                color: 'var(--color-text-muted)', 
                                fontSize: '1.25rem',
                                lineHeight: '1.6',
                                marginBottom: '1.5rem',
                                maxWidth: '800px',
                            }}>
                                {project.description}
                            </p>
                        </div>
                    </div>
                    
                    {/* Author & Stats */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to={`/u/${author?.username}`} style={{ textDecoration: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '3rem',
                                    height: '3rem',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    overflow: 'hidden',
                                }}>
                                    {author?.avatar_url ? (
                                        <img 
                                            src={author.avatar_url} 
                                            alt={author.username}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        author?.username?.charAt(0) || 'U'
                                    )}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--color-text)' }}>
                                        {author?.full_name || author?.username}
                                    </div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                        @{author?.username}
                                    </div>
                                </div>
                            </div>
                        </Link>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="dashboard-gradient-text">
                                    {voteCount}
                                </div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Upvotes</div>
                            </div>
                            
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="dashboard-gradient-text">
                                    {comments.length}
                                </div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Comments</div>
                            </div>
                            
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="dashboard-gradient-text">
                                    {viewCount}
                                </div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Views</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tags & Meta */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginTop: '1.5rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {project.tags.map((tag, index) => (
                                <span key={index} style={{
                                    fontSize: '0.85rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '2rem',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    fontWeight: '500',
                                    border: '1px solid rgba(102, 126, 234, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                }}>
                                    <FiTag size={12} /> {tag}
                                </span>
                            ))}
                        </div>
                        
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            <FiCalendar style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Posted {formatDate(project.created_at)}
                        </div>
                    </div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                    {/* Main Content Column */}
                    <div>
                        {/* Project Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="dashboard-glass-effect"
                            style={{
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                marginBottom: '2rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleUpvote}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '0.75rem',
                                        background: isUpvoted ? 'rgba(249, 115, 22, 0.1)' : 'rgba(102, 126, 234, 0.1)',
                                        border: isUpvoted ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid rgba(102, 126, 234, 0.3)',
                                        color: isUpvoted ? '#f97316' : '#667eea',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                    }}
                                >
                                    <FiHeart /> {isUpvoted ? 'Upvoted' : 'Upvote'} ({voteCount})
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBookmark}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '0.75rem',
                                        background: isBookmarked ? 'rgba(234, 179, 8, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        border: isBookmarked ? '1px solid rgba(234, 179, 8, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                                        color: isBookmarked ? '#eab308' : 'var(--color-text-muted)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                    }}
                                >
                                    <FiBookmark /> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                                </motion.button>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {project.github_url && (
                                    <a 
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: 'var(--color-text)',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                            e.currentTarget.style.color = 'var(--color-text)';
                                        }}
                                    >
                                        <FiGitBranch /> View Code
                                    </a>
                                )}
                                
                                {project.live_url && (
                                    <a 
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            ...primaryButtonStyle,
                                            padding: '0.75rem 1.5rem',
                                        }}
                                    >
                                        <FiExternalLink /> Live Demo
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* Project Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="dashboard-glass-effect"
                            style={{
                                padding: '2.5rem',
                                borderRadius: '1rem',
                                marginBottom: '2rem',
                            }}
                        >
                            <div className="markdown-content">
                                <ReactMarkdown>
                                    {project.long_description}
                                </ReactMarkdown>
                            </div>
                        </motion.div>

                        {/* Comments Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="dashboard-glass-effect"
                            style={{
                                padding: '2rem',
                                borderRadius: '1rem',
                            }}
                        >
                            <h2 style={{ 
                                fontSize: '1.75rem', 
                                fontWeight: 'bold', 
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <FiMessageSquare /> Comments ({comments.length})
                            </h2>
                            
                            {/* Add Comment */}
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start', 
                                    gap: '1rem',
                                    marginBottom: '1rem',
                                }}>
                                    <div style={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1rem',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                    }}>
                                        {session?.user?.user_metadata?.avatar_url ? (
                                            <img 
                                                src={session.user.user_metadata.avatar_url} 
                                                alt={session.user.user_metadata.username}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            session?.user?.email?.charAt(0) || 'U'
                                        )}
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                        <textarea
                                            ref={commentInputRef}
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder={session ? "Add a comment..." : "Please login to comment"}
                                            disabled={!session}
                                            rows={4}
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                borderRadius: '0.75rem',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: 'var(--color-text)',
                                                fontSize: '1rem',
                                                resize: 'vertical',
                                                outline: 'none',
                                                fontFamily: 'inherit',
                                            }}
                                            onFocus={e => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                                            }}
                                            onBlur={e => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            }}
                                        />
                                        
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                            {session ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handleAddComment}
                                                    disabled={!newComment.trim()}
                                                    style={{
                                                        ...primaryButtonStyle,
                                                        padding: '0.75rem 1.5rem',
                                                        opacity: !newComment.trim() ? 0.5 : 1,
                                                        cursor: !newComment.trim() ? 'not-allowed' : 'pointer',
                                                    }}
                                                >
                                                    <FiSend /> Post Comment
                                                </motion.button>
                                            ) : (
                                                <button
                                                    onClick={() => navigate('/auth?mode=login')}
                                                    style={{
                                                        ...primaryButtonStyle,
                                                        padding: '0.75rem 1.5rem',
                                                    }}
                                                >
                                                    <FiUser /> Login to Comment
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Comments List */}
                            <AnimatePresence>
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <Comment
                                            key={comment.id}
                                            comment={comment}
                                            isOwner={isOwner}
                                            onDelete={handleDeleteComment}
                                        />
                                    ))
                                ) : (
                                    <div style={{ 
                                        textAlign: 'center', 
                                        padding: '3rem 2rem',
                                        color: 'var(--color-text-muted)',
                                    }}>
                                        <FiMessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                            No comments yet
                                        </h3>
                                        <p>Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Sidebar Column */}
                    <div>
                        {/* Tech Stack */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="dashboard-glass-effect"
                            style={{
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <h3 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: 'bold', 
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <FiCode /> Tech Stack
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {project.tech_stack?.map((tech, index) => (
                                    <span key={index} style={{
                                        fontSize: '0.85rem',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '0.5rem',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        color: '#667eea',
                                        fontWeight: '500',
                                    }}>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Project Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="dashboard-glass-effect"
                            style={{
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <h3 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: 'bold', 
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <FiTrendingUp /> Project Stats
                            </h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Upvotes</span>
                                    <span style={{ fontWeight: '600' }}>{voteCount}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Comments</span>
                                    <span style={{ fontWeight: '600' }}>{comments.length}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Views</span>
                                    <span style={{ fontWeight: '600' }}>{viewCount}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Bookmarks</span>
                                    <span style={{ fontWeight: '600' }}>45</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Related Projects */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="dashboard-glass-effect"
                            style={{
                                padding: '1.5rem',
                                borderRadius: '1rem',
                            }}
                        >
                            <h3 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: 'bold', 
                                marginBottom: '1rem',
                            }}>
                                More from {author?.username}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[1, 2, 3].map((item) => (
                                    <Link 
                                        key={item}
                                        to={`/project/project-${item}`}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                            textDecoration: 'none',
                                            color: 'var(--color-text)',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                                    >
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                                            Project Title {item}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                            12 upvotes • 3 comments
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ 
                padding: '3rem 2rem', 
                textAlign: 'center', 
                color: 'var(--color-text-muted)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                marginTop: '3rem',
                fontSize: '0.9rem',
            }}>
                © {new Date().getFullYear()} DevShowcase. Built with ❤ for developers.
            </footer>
        </div>
    );
}