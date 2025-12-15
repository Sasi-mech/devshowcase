// src/components/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiSearch, FiHome, FiCompass, FiUser, FiBell, FiSettings, 
    FiLogOut, FiUpload, FiMenu, FiX, FiMonitor, FiStar, FiMessageSquare,
    FiHeart, FiBookmark, FiUsers, FiBarChart2,
    FiMail, FiMapPin, FiGlobe, FiGithub, FiTwitter,
    FiEdit2, FiSend, FiShare2, FiExternalLink,
    FiFolder, FiEye, FiPlus,FiCalendar,
    FiUserCheck, FiUserPlus, FiThumbsUp, FiActivity
} from 'react-icons/fi';

// --- Custom CSS for Profile (Same as Dashboard) ---
const profileStyles = `
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
    
    .sidebar-gradient-bg {
        background: linear-gradient(180deg, rgba(15, 15, 25, 0.95) 0%, rgba(30, 30, 50, 0.95) 100%);
        backdrop-filter: blur(20px);
    }
    
    .nav-item-hover:hover {
        background: rgba(102, 126, 234, 0.1);
        border-left: 3px solid #667eea;
        transform: translateX(5px);
    }
    
    .tab-active {
        background: rgba(102, 126, 234, 0.15);
        border-bottom: 2px solid #667eea;
        color: #667eea !important;
    }
`;

// --- Configuration (Same as Dashboard) ---
const SIDEBAR_EXPANDED_WIDTH = '280px';
const SIDEBAR_CONTRACTED_WIDTH = '90px';
const HEADER_HEIGHT = '80px';

// --- Button Styles (Same as Dashboard) ---
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

// --- NavLink Component (Same as Dashboard) ---
const NavLink = ({ to, icon: Icon, text, isExpanded, isActive = false, badge }) => (
    <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
    >
        <Link 
            to={to} 
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1.25rem',
                borderRadius: '0.75rem',
                background: isActive ? 'rgba(102, 126, 234, 0.15)' : 'transparent',
                color: isActive ? '#667eea' : 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                justifyContent: isExpanded ? 'flex-start' : 'center',
                position: 'relative',
                borderLeft: isActive ? '3px solid #667eea' : '3px solid transparent',
                margin: '0.25rem 0',
            }}
            className="nav-item-hover"
        >
            <Icon style={{ 
                minWidth: '1.5rem', 
                height: '1.5rem', 
                color: isActive ? '#667eea' : 'var(--color-primary)',
                filter: isActive ? 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.5))' : 'none'
            }} />
            {isExpanded && (
                <>
                    <span style={{ 
                        fontWeight: '500', 
                        whiteSpace: 'nowrap',
                        fontSize: '0.95rem'
                    }}>
                        {text}
                    </span>
                    {badge && (
                        <span style={{
                            marginLeft: 'auto',
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '1rem',
                            fontWeight: '600',
                        }}>
                            {badge}
                        </span>
                    )}
                </>
            )}
        </Link>
    </motion.div>
);

// --- Project Card Component ---
const ProjectCard = ({ 
    id, 
    title, 
    description, 
    votes_count = 0, 
    comments_count = 0, 
    tags = [], 
    is_featured = false,
    github_url,
    live_url,
    created_at,
    onUpvote,
    isUpvoted = false,
    views_count = 0
}) => {
    const [localVotes, setLocalVotes] = useState(votes_count);
    const [localIsUpvoted, setLocalIsUpvoted] = useState(isUpvoted);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpvote = async (e) => {
        e.stopPropagation();
        if (isProcessing) return;
        
        setIsProcessing(true);
        try {
            if (localIsUpvoted) {
                const { error } = await supabase
                    .from('votes')
                    .delete()
                    .eq('project_id', id)
                    .eq('user_id', (await supabase.auth.getUser()).data.user.id);
                
                if (!error) {
                    setLocalVotes(prev => prev - 1);
                    setLocalIsUpvoted(false);
                    if (onUpvote) onUpvote(id, false);
                }
            } else {
                const { error } = await supabase
                    .from('votes')
                    .insert({ 
                        project_id: id, 
                        user_id: (await supabase.auth.getUser()).data.user.id 
                    });
                
                if (!error) {
                    setLocalVotes(prev => prev + 1);
                    setLocalIsUpvoted(true);
                    if (onUpvote) onUpvote(id, true);
                }
            }
        } catch (error) {
            console.error('Error toggling vote:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="dashboard-card-hover dashboard-glass-effect"
            style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                marginBottom: '1.5rem',
                cursor: 'pointer',
            }}
            onClick={() => window.location.href = `/project/${id}`}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <h3 style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 'bold', 
                            color: 'var(--color-text)', 
                            marginBottom: '0.25rem',
                            lineHeight: '1.2'
                        }}>
                            {title || 'Untitled Project'}
                        </h3>
                        {is_featured && (
                            <span style={{
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                            }}>
                                <FiStar size={12} /> Featured
                            </span>
                        )}
                    </div>
                    
                    <p style={{ 
                        color: 'var(--color-text-muted)', 
                        marginBottom: '1rem', 
                        fontSize: '0.95rem', 
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {description || 'No description provided'}
                    </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '1rem', flexShrink: 0 }}>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleUpvote}
                        disabled={isProcessing}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: 'transparent',
                            border: 'none',
                            color: localIsUpvoted ? '#f97316' : 'var(--color-text-muted)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = localIsUpvoted 
                                ? 'rgba(249, 115, 22, 0.1)' 
                                : 'rgba(255, 255, 255, 0.05)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <FiHeart size={20} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                            {localVotes}
                        </span>
                    </motion.button>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <FiMessageSquare size={20} style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                            {comments_count}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <FiEye size={20} style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                            {views_count}
                        </span>
                    </div>
                </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {tags && tags.length > 0 ? (
                        tags.slice(0, 3).map((tag, index) => (
                            <span key={index} style={{
                                fontSize: '0.75rem',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '2rem',
                                background: 'rgba(102, 126, 234, 0.1)',
                                color: '#667eea',
                                fontWeight: '500',
                                border: '1px solid rgba(102, 126, 234, 0.2)',
                            }}>
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '2rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--color-text-muted)',
                            fontWeight: '500',
                        }}>
                            No tags
                        </span>
                    )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {formatDate(created_at)}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {github_url && (
                            <a 
                                href={github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--color-text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.color = 'white';
                                }}
                            >
                                <FiGithub size={16} />
                            </a>
                        )}
                        
                        {live_url && (
                            <a 
                                href={live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                                }}
                            >
                                <FiExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- User Card Component for Followers/Following ---
const UserCard = ({ user, currentUserId, onFollowToggle }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        checkIfFollowing();
    }, [user.id, currentUserId]);

    const checkIfFollowing = async () => {
        if (!currentUserId || !user.id) return;
        
        const { data, error } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', currentUserId)
            .eq('following_id', user.id)
            .single();
            
        setIsFollowing(!!data && !error);
    };

    const handleFollowToggle = async () => {
        if (isProcessing || !currentUserId) return;
        
        setIsProcessing(true);
        try {
            if (isFollowing) {
                const { error } = await supabase
                    .from('follows')
                    .delete()
                    .eq('follower_id', currentUserId)
                    .eq('following_id', user.id);
                    
                if (!error) {
                    setIsFollowing(false);
                    if (onFollowToggle) onFollowToggle(user.id, false);
                }
            } else {
                const { error } = await supabase
                    .from('follows')
                    .insert({
                        follower_id: currentUserId,
                        following_id: user.id
                    });
                    
                if (!error) {
                    setIsFollowing(true);
                    if (onFollowToggle) onFollowToggle(user.id, true);
                }
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="dashboard-glass-effect"
            style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                marginBottom: '1rem',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        color: 'white',
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        flexShrink: 0,
                    }}>
                        {user.avatar_url ? (
                            <img 
                                src={user.avatar_url} 
                                alt={user.username}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            (user.username || 'U').charAt(0).toUpperCase()
                        )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <Link to={`/u/${user.username}`} style={{ textDecoration: 'none' }}>
                            <h4 style={{ 
                                fontWeight: 'bold', 
                                marginBottom: '0.25rem',
                                color: 'var(--color-text)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {user.full_name || user.username || 'User'}
                            </h4>
                        </Link>
                        <p style={{ 
                            color: 'var(--color-text-muted)', 
                            fontSize: '0.85rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            @{user.username || 'user'}
                        </p>
                        {user.bio && (
                            <p style={{ 
                                color: 'var(--color-text-muted)', 
                                fontSize: '0.85rem',
                                marginTop: '0.5rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}>
                                {user.bio}
                            </p>
                        )}
                    </div>
                </div>
                
                {currentUserId && currentUserId !== user.id && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleFollowToggle}
                        disabled={isProcessing}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            background: isFollowing 
                                ? 'transparent' 
                                : 'linear-gradient(135deg, #667eea, #764ba2)',
                            border: isFollowing ? '1px solid rgba(102, 126, 234, 0.3)' : 'none',
                            color: isFollowing ? '#667eea' : 'white',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {isProcessing ? (
                            '...'
                        ) : isFollowing ? (
                            <>
                                <FiUserCheck /> Following
                            </>
                        ) : (
                            <>
                                <FiUserPlus /> Follow
                            </>
                        )}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

// --- Tab Button Component ---
const TabButton = ({ label, isActive, onClick, count = 0 }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: 'none',
            color: isActive ? '#667eea' : 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '500',
            position: 'relative',
            transition: 'all 0.3s ease',
            borderBottom: isActive ? '2px solid #667eea' : '2px solid transparent',
        }}
        className={isActive ? 'tab-active' : ''}
    >
        {label}
        {count > 0 && (
            <span style={{
                marginLeft: '0.5rem',
                background: isActive ? '#667eea' : 'rgba(255, 255, 255, 0.1)',
                color: isActive ? 'white' : 'var(--color-text-muted)',
                fontSize: '0.75rem',
                padding: '0.1rem 0.5rem',
                borderRadius: '1rem',
                fontWeight: '600',
            }}>
                {count}
            </span>
        )}
    </motion.button>
);

// --- Main UserProfile Component ---
export default function UserProfilePage() {
    const { session, loading: authLoading, logout } = useAuth();
    const { username } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('projects');
    
    // Data states
    const [projects, setProjects] = useState([]);
    const [likedProjects, setLikedProjects] = useState([]);
    const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowingProfile, setIsFollowingProfile] = useState(false);
    const [userStats, setUserStats] = useState({
        projects: 0,
        upvotes: 0,
        followers: 0,
        following: 0,
        totalViews: 0
    });

    const user_id = session?.user?.id;
    const currentSidebarWidth = isSidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_CONTRACTED_WIDTH;
    const isOwnProfile = user_id && profileUser?.id === user_id;

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // --- Data Fetching: Current User Profile ---
    useEffect(() => {
        if (!user_id) {
            return;
        }

        const fetchCurrentProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user_id)
                    .single();

                if (error) throw error;
                setCurrentUserProfile(data || {});
            } catch (err) {
                console.error('Error fetching current profile:', err.message);
                setCurrentUserProfile({});
            }
        };

        fetchCurrentProfile();
    }, [user_id]);

    // --- Data Fetching: Profile User ---
    useEffect(() => {
        const fetchProfileUser = async () => {
            setLoading(true);
            try {
                let profileData = {};
                
                if (username) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('username', username)
                        .single();

                    if (error) throw error;
                    profileData = data || {};
                } else if (session?.user?.id) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (error) throw error;
                    profileData = data || {};
                } else {
                    throw new Error('No user found');
                }

                setProfileUser(profileData);
                if (profileData.id) {
                    await fetchUserStats(profileData.id);
                    await fetchUserContent(profileData.id);
                }
            } catch (err) {
                console.error('Error fetching profile user:', err.message);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (username || session?.user?.id) {
            fetchProfileUser();
        } else {
            setLoading(false);
        }
    }, [username, session, navigate]);

    // Check if current user is following profile user
    useEffect(() => {
        const checkFollowingStatus = async () => {
            if (!user_id || !profileUser?.id) return;
            
            try {
                const { data, error } = await supabase
                    .from('follows')
                    .select('id')
                    .eq('follower_id', user_id)
                    .eq('following_id', profileUser.id)
                    .single();
                    
                setIsFollowingProfile(!!data && !error);
            } catch (error) {
                setIsFollowingProfile(false);
            }
        };

        checkFollowingStatus();
    }, [user_id, profileUser?.id]);

    // Fetch user statistics
    const fetchUserStats = async (userId) => {
        try {
            // Get projects count
            const { count: projectsCount, error: projectsError } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('is_published', true);

            // Get total upvotes and views
            const { data: projectsData, error: projectsDataError } = await supabase
                .from('projects')
                .select('votes_count, views_count')
                .eq('user_id', userId)
                .eq('is_published', true);

            const totalUpvotes = projectsData?.reduce((sum, project) => sum + (project.votes_count || 0), 0) || 0;
            const totalViews = projectsData?.reduce((sum, project) => sum + (project.views_count || 0), 0) || 0;

            // Get followers count
            const { count: followersCount, error: followersError } = await supabase
                .from('follows')
                .select('*', { count: 'exact', head: true })
                .eq('following_id', userId);

            // Get following count
            const { count: followingCount, error: followingError } = await supabase
                .from('follows')
                .select('*', { count: 'exact', head: true })
                .eq('follower_id', userId);

            setUserStats({
                projects: projectsCount || 0,
                upvotes: totalUpvotes,
                followers: followersCount || 0,
                following: followingCount || 0,
                totalViews: totalViews
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
            setUserStats({
                projects: 0,
                upvotes: 0,
                followers: 0,
                following: 0,
                totalViews: 0
            });
        }
    };

    // Fetch all user content
    const fetchUserContent = async (userId) => {
        try {
            // Fetch user's projects
            const { data: projectsData, error: projectsError } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', userId)
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (projectsData) {
                // Check which projects current user has upvoted
                const projectsWithVotes = await Promise.all(
                    projectsData.map(async (project) => {
                        if (!session?.user?.id) return { ...project, isUpvoted: false };
                        
                        const { data: vote } = await supabase
                            .from('votes')
                            .select('id')
                            .eq('user_id', session.user.id)
                            .eq('project_id', project.id)
                            .single();
                            
                        return { ...project, isUpvoted: !!vote };
                    })
                );
                setProjects(projectsWithVotes || []);
            } else {
                setProjects([]);
            }

            // Fetch liked projects
            if (session?.user?.id) {
                const { data: votesData, error: votesError } = await supabase
                    .from('votes')
                    .select('project_id')
                    .eq('user_id', userId);

                if (votesData && votesData.length > 0) {
                    const projectIds = votesData.map(vote => vote.project_id);
                    const { data: likedProjectsData, error: likedError } = await supabase
                        .from('projects')
                        .select('*')
                        .in('id', projectIds)
                        .eq('is_published', true);

                    if (likedProjectsData) {
                        setLikedProjects(likedProjectsData || []);
                    } else {
                        setLikedProjects([]);
                    }
                } else {
                    setLikedProjects([]);
                }
            }

            // Fetch bookmarked projects (only for own profile)
            if (session?.user?.id === userId) {
                const { data: bookmarksData, error: bookmarksError } = await supabase
                    .from('bookmarks')
                    .select('project_id')
                    .eq('user_id', userId);

                if (bookmarksData && bookmarksData.length > 0) {
                    const projectIds = bookmarksData.map(bookmark => bookmark.project_id);
                    const { data: bookmarkedProjectsData, error: bookmarkedError } = await supabase
                        .from('projects')
                        .select('*')
                        .in('id', projectIds)
                        .eq('is_published', true);

                    if (bookmarkedProjectsData) {
                        setBookmarkedProjects(bookmarkedProjectsData || []);
                    } else {
                        setBookmarkedProjects([]);
                    }
                } else {
                    setBookmarkedProjects([]);
                }
            }

            // Fetch followers
            const { data: followersData, error: followersError } = await supabase
                .from('follows')
                .select('follower_id')
                .eq('following_id', userId);

            if (followersData && followersData.length > 0) {
                const followerIds = followersData.map(f => f.follower_id);
                const { data: followersProfiles, error: followersProfilesError } = await supabase
                    .from('profiles')
                    .select('*')
                    .in('id', followerIds);

                if (followersProfiles) {
                    setFollowers(followersProfiles || []);
                } else {
                    setFollowers([]);
                }
            } else {
                setFollowers([]);
            }

            // Fetch following
            const { data: followingData, error: followingError } = await supabase
                .from('follows')
                .select('following_id')
                .eq('follower_id', userId);

            if (followingData && followingData.length > 0) {
                const followingIds = followingData.map(f => f.following_id);
                const { data: followingProfiles, error: followingProfilesError } = await supabase
                    .from('profiles')
                    .select('*')
                    .in('id', followingIds);

                if (followingProfiles) {
                    setFollowing(followingProfiles || []);
                } else {
                    setFollowing([]);
                }
            } else {
                setFollowing([]);
            }
        } catch (error) {
            console.error('Error fetching user content:', error);
            // Set empty arrays on error
            setProjects([]);
            setLikedProjects([]);
            setBookmarkedProjects([]);
            setFollowers([]);
            setFollowing([]);
        }
    };

    // Handle upvote
    const handleUpvote = async (projectId, isUpvoted) => {
        try {
            // Update local state optimistically
            setProjects(prev => prev.map(project => 
                project.id === projectId 
                    ? { 
                        ...project, 
                        votes_count: isUpvoted ? (project.votes_count || 0) + 1 : Math.max(0, (project.votes_count || 0) - 1),
                        isUpvoted 
                    }
                    : project
            ));
            
            // Update user stats
            setUserStats(prev => ({
                ...prev,
                upvotes: isUpvoted ? prev.upvotes + 1 : Math.max(0, prev.upvotes - 1)
            }));
        } catch (error) {
            console.error('Error handling upvote:', error);
        }
    };

    // Handle follow/unfollow
    const handleFollowToggle = async () => {
        if (!session?.user?.id || !profileUser?.id) return;
        
        try {
            if (isFollowingProfile) {
                // Unfollow
                const { error } = await supabase
                    .from('follows')
                    .delete()
                    .eq('follower_id', session.user.id)
                    .eq('following_id', profileUser.id);
                    
                if (!error) {
                    setIsFollowingProfile(false);
                    setUserStats(prev => ({ 
                        ...prev, 
                        followers: Math.max(0, prev.followers - 1) 
                    }));
                    // Refresh followers list
                    await fetchUserContent(profileUser.id);
                }
            } else {
                // Follow
                const { error } = await supabase
                    .from('follows')
                    .insert({
                        follower_id: session.user.id,
                        following_id: profileUser.id
                    });
                    
                if (!error) {
                    setIsFollowingProfile(true);
                    setUserStats(prev => ({ 
                        ...prev, 
                        followers: prev.followers + 1 
                    }));
                    // Refresh followers list
                    await fetchUserContent(profileUser.id);
                }
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    // Handle follow toggle in followers/following list
    const handleUserFollowToggle = async (userId, isFollowing) => {
        // Update stats when following/unfollowing from the list
        setUserStats(prev => ({
            ...prev,
            [isFollowing ? 'following' : 'followers']: isFollowing 
                ? prev.following + 1 
                : Math.max(0, prev.following - 1)
        }));
    };

    // --- Animation Styles ---
    const mainContainerStyle = {
        flexGrow: 1,
        marginLeft: currentSidebarWidth,
        padding: '2rem',
        paddingTop: HEADER_HEIGHT,
        minHeight: '100vh',
        background: 'var(--color-background-dark)',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    const headerStyle = {
        position: 'fixed',
        top: 0,
        left: currentSidebarWidth,
        right: 0,
        height: HEADER_HEIGHT,
        zIndex: 100,
        padding: '0 2rem',
        background: 'rgba(15, 15, 25, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    // Loading state
    if (authLoading || loading) {
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
    
    // No session and no username parameter
    if (!session && !username) {
        return (
            <div style={{ 
                padding: '4rem', 
                textAlign: 'center', 
                color: 'var(--color-text-muted)',
                background: 'var(--color-background-dark)',
                minHeight: '100vh',
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Please log in to view profiles.</h2>
                <Link to="/auth?mode=login" style={primaryButtonStyle}>
                    Go to Login
                </Link>
            </div>
        );
    }

    // Profile not found
    if (!profileUser) {
        return (
            <div style={{ 
                padding: '4rem', 
                textAlign: 'center', 
                color: 'var(--color-text-muted)',
                background: 'var(--color-background-dark)',
                minHeight: '100vh',
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>User not found</h2>
                <Link to="/discover" style={primaryButtonStyle}>
                    Browse Projects
                </Link>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--color-background-dark)', 
            color: 'var(--color-text)',
            display: 'flex',
            position: 'relative',
        }}>
            {/* Add CSS styles */}
            <style>{profileStyles}</style>
            
            {/* Animated background elements */}
            <div style={{
                position: 'fixed',
                top: '20%',
                left: '5%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
                animation: 'float 20s ease-in-out infinite',
                zIndex: 0,
            }} />
            
            {/* --- EXACT SAME SIDEBAR AS DASHBOARD (Only for logged-in users) --- */}
            {session && (
                <motion.aside
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="sidebar-gradient-bg"
                    style={{
                        width: currentSidebarWidth,
                        minWidth: currentSidebarWidth,
                        position: 'fixed',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        zIndex: 200,
                        padding: '1.5rem 0',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '20px 0 40px rgba(0, 0, 0, 0.3)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    
                    {/* Sidebar Header */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: isSidebarExpanded ? 'space-between' : 'center', 
                        padding: '0 1.5rem',
                        marginBottom: '2rem',
                    }}>
                        
                        {isSidebarExpanded ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                            >
                                <div style={{ 
                                    width: '3rem', 
                                    height: '3rem', 
                                    borderRadius: '1rem', 
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                                }}>
                                    <FiMonitor style={{ color: 'white', fontSize: '1.5rem' }} />
                                </div>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="dashboard-gradient-text">DevShowcase</span>
                            </motion.div>
                        ) : (
                            <div style={{ 
                                width: '3rem', 
                                height: '3rem', 
                                borderRadius: '1rem', 
                                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                            }}>
                                <FiMonitor style={{ color: 'white', fontSize: '1.5rem' }} />
                            </div>
                        )}
                        
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleSidebar} 
                            style={{ 
                                background: 'rgba(255, 255, 255, 0.1)', 
                                border: 'none', 
                                cursor: 'pointer', 
                                color: 'var(--color-text)',
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '2.5rem',
                                height: '2.5rem',
                            }}
                        >
                            {isSidebarExpanded ? <FiX size={20} /> : <FiMenu size={20} />}
                        </motion.button>
                    </div>
                    
                    {/* User Profile in Sidebar */}
                    {isSidebarExpanded && currentUserProfile && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '1.5rem',
                                margin: '0 1rem 2rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '1rem',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '3.5rem',
                                    height: '3.5rem',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    overflow: 'hidden',
                                }}>
                                    {currentUserProfile.avatar_url ? (
                                        <img 
                                            src={currentUserProfile.avatar_url} 
                                            alt={currentUserProfile.username}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        (currentUserProfile.username || 'U').charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{currentUserProfile.username || 'User'}</div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{currentUserProfile.full_name || 'Developer'}</div>
                                </div>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.85rem',
                                color: '#667eea',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <FiStar /> Pro Member
                            </div>
                        </motion.div>
                    )}
                    
                    {/* Navigation Links */}
                    <nav style={{ padding: '0 1rem', marginBottom: '2rem' }}>
                        <NavLink 
                            to="/dashboard" 
                            icon={FiHome} 
                            text="Dashboard" 
                            isExpanded={isSidebarExpanded} 
                            isActive={false}
                        />
                        <NavLink 
                            to="/feed" 
                            icon={FiCompass} 
                            text="Discover" 
                            isExpanded={isSidebarExpanded}
                            isActive={false}
                        />
                        <NavLink 
                            to="/notifications" 
                            icon={FiBell} 
                            text="Notifications" 
                            isExpanded={isSidebarExpanded}
                            isActive={false}
                           
                        />
                        <NavLink 
                            to={`/u/${currentUserProfile?.username || 'profile'}`} 
                            icon={FiUser} 
                            text="Profile" 
                            isExpanded={isSidebarExpanded}
                            isActive={true}
                        />
                        <NavLink 
                            to="/bookmarks" 
                            icon={FiBookmark} 
                            text="Bookmarks" 
                            isExpanded={isSidebarExpanded}
                            isActive={false}
                        />
                        <NavLink 
                            to="/analytics" 
                            icon={FiBarChart2} 
                            text="Analytics" 
                            isExpanded={isSidebarExpanded}
                            isActive={false}
                        />
                        <NavLink 
                            to="/settings" 
                            icon={FiSettings} 
                            text="Settings" 
                            isExpanded={isSidebarExpanded}
                            isActive={false}
                        />
                    </nav>
                    
                    {/* Upload Button */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        style={{ padding: '0 1rem', marginBottom: '2rem' }}
                    >
                        <Link 
                            to="/create" 
                            style={{
                                ...primaryButtonStyle,
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.95rem',
                                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                            }}
                        >
                            <FiUpload /> {isSidebarExpanded && 'Upload Project'}
                        </Link>
                    </motion.div>
                    
                    {/* Footer / Logout */}
                    <div style={{ 
                        marginTop: 'auto', 
                        padding: '1rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={logout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.875rem 1.25rem',
                                borderRadius: '0.75rem',
                                background: 'transparent',
                                color: 'var(--color-text-muted)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
                                width: '100%',
                            }}
                            onMouseEnter={e => { 
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; 
                                e.currentTarget.style.color = '#ef4444'; 
                            }}
                            onMouseLeave={e => { 
                                e.currentTarget.style.background = 'transparent'; 
                                e.currentTarget.style.color = 'var(--color-text-muted)'; 
                            }}
                        >
                            <FiLogOut style={{ minWidth: '1.5rem', height: '1.5rem' }} />
                            {isSidebarExpanded && <span>Logout</span>}
                        </motion.button>
                    </div>
                </motion.aside>
            )}

            {/* --- MAIN CONTENT AREA --- */}
            <main style={{
                ...mainContainerStyle,
                marginLeft: session ? currentSidebarWidth : 0,
            }}>
                
                {/* --- HEADER (Only for logged-in users) --- */}
                {session && (
                    <header style={headerStyle}>
                        
                        {/* Search Bar */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ position: 'relative', flexGrow: 1, maxWidth: '600px' }}
                        >
                            <FiSearch style={{ 
                                position: 'absolute', 
                                left: '1.25rem', 
                                top: '50%', 
                                transform: 'translateY(-50%)', 
                                color: 'var(--color-text-muted)',
                                fontSize: '1.25rem',
                            }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1.25rem 0.875rem 3.5rem',
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--color-text)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                }}
                                onFocus={e => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={e => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                        </motion.div>
                        
                        {/* User Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{ 
                                    background: 'transparent', 
                                    border: 'none', 
                                    color: 'var(--color-text)', 
                                    cursor: 'pointer',
                                    position: 'relative',
                                    fontSize: '1.5rem',
                                }}
                            >
                                <FiBell />
                                <span style={{ 
                                    position: 'absolute', 
                                    top: '-5px', 
                                    right: '-5px', 
                                    background: '#ef4444', 
                                    color: 'white', 
                                    borderRadius: '50%', 
                                    width: '18px', 
                                    height: '18px', 
                                    fontSize: '11px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                }}>
                                    3
                                </span>
                            </motion.button>
                            
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                                onClick={() => navigate(`/u/${currentUserProfile?.username || 'profile'}`)}
                            >
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '600', fontSize: '1rem' }}>{currentUserProfile?.username || 'User'}</div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Pro Member</div>
                                </div>
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
                                    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
                                }}>
                                    {currentUserProfile?.avatar_url ? (
                                        <img 
                                            src={currentUserProfile.avatar_url} 
                                            alt={currentUserProfile.username}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        (currentUserProfile?.username || 'U').charAt(0).toUpperCase()
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </header>
                )}

                {/* --- PROFILE CONTENT --- */}
                <section style={{ padding: '2rem 0', position: 'relative', zIndex: 1 }}>
                    
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="dashboard-glass-effect"
                        style={{
                            padding: '2.5rem',
                            borderRadius: '1.5rem',
                            marginBottom: '2rem',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Background Pattern */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '300px',
                            height: '300px',
                            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                            borderRadius: '50%',
                            transform: 'translate(100px, -100px)',
                        }} />
                        
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
                            {/* Avatar */}
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    width: '10rem',
                                    height: '10rem',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '3rem',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    overflow: 'hidden',
                                    border: '4px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                                }}>
                                    {profileUser.avatar_url ? (
                                        <img 
                                            src={profileUser.avatar_url} 
                                            alt={profileUser.username}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        (profileUser.username || 'U').charAt(0).toUpperCase()
                                    )}
                                </div>
                                
                                {isOwnProfile && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => navigate('/settings')}
                                        style={{
                                            position: 'absolute',
                                            bottom: '0.5rem',
                                            right: '0.5rem',
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            borderRadius: '50%',
                                            background: 'rgba(102, 126, 234, 0.9)',
                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <FiEdit2 size={14} />
                                    </motion.button>
                                )}
                            </div>
                            
                            {/* Profile Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h1 style={{ 
                                            fontSize: '3rem', 
                                            fontWeight: 'bold', 
                                            marginBottom: '0.5rem',
                                            lineHeight: '1.2',
                                        }}>
                                            {profileUser.full_name || profileUser.username || 'User'}
                                        </h1>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                            <span style={{ 
                                                fontSize: '1.25rem', 
                                                color: 'var(--color-text-muted)',
                                                fontWeight: '500',
                                            }}>
                                                @{profileUser.username || 'user'}
                                            </span>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '2rem',
                                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                                color: '#667eea',
                                                fontWeight: '500',
                                                fontSize: '0.85rem',
                                            }}>
                                                <FiStar /> Pro Member
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        {!isOwnProfile && session && (
                                            <>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handleFollowToggle}
                                                    style={{
                                                        ...primaryButtonStyle,
                                                        padding: '0.75rem 1.5rem',
                                                        background: isFollowingProfile 
                                                            ? 'transparent' 
                                                            : 'linear-gradient(135deg, #667eea, #764ba2)',
                                                        border: isFollowingProfile ? '2px solid rgba(102, 126, 234, 0.3)' : 'none',
                                                        color: isFollowingProfile ? '#667eea' : 'white',
                                                    }}
                                                >
                                                    {isFollowingProfile ? (
                                                        <>
                                                            <FiUserCheck /> Following
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiUserPlus /> Follow
                                                        </>
                                                    )}
                                                </motion.button>
                                                
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        ...secondaryButtonStyle,
                                                        padding: '0.75rem 1.5rem',
                                                    }}
                                                >
                                                    <FiSend /> Message
                                                </motion.button>
                                            </>
                                        )}
                                        
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '0.75rem',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: 'var(--color-text-muted)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <FiShare2 />
                                        </motion.button>
                                    </div>
                                </div>
                                
                                {/* Bio */}
                                {profileUser.bio && (
                                    <p style={{ 
                                        color: 'var(--color-text)', 
                                        fontSize: '1.1rem',
                                        lineHeight: '1.6',
                                        marginBottom: '1.5rem',
                                        maxWidth: '800px',
                                    }}>
                                        {profileUser.bio}
                                    </p>
                                )}
                                
                                {/* Social Links & Info */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    {profileUser.location && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                                            <FiMapPin /> {profileUser.location}
                                        </div>
                                    )}
                                    
                                    {profileUser.website && (
                                        <a 
                                            href={profileUser.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: '#667eea',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <FiGlobe /> Website
                                        </a>
                                    )}
                                    
                                    {profileUser.github_username && (
                                        <a 
                                            href={`https://github.com/${profileUser.github_username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: 'var(--color-text-muted)',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <FiGithub /> GitHub
                                        </a>
                                    )}
                                    
                                    {profileUser.twitter_username && (
                                        <a 
                                            href={`https://twitter.com/${profileUser.twitter_username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: 'var(--color-text-muted)',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <FiTwitter /> Twitter
                                        </a>
                                    )}
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                                        <FiCalendar /> Joined {profileUser.created_at ? new Date(profileUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                                    </div>
                                </div>
                                
                                {/* Stats */}
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                                    gap: '1rem',
                                    marginTop: '1.5rem',
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="dashboard-gradient-text">
                                            {userStats.projects}
                                        </div>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Projects</div>
                                    </div>
                                    
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="dashboard-gradient-text">
                                            {userStats.upvotes}
                                        </div>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Upvotes</div>
                                    </div>
                                    
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="dashboard-gradient-text">
                                            {userStats.followers}
                                        </div>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Followers</div>
                                    </div>
                                    
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="dashboard-gradient-text">
                                            {userStats.following}
                                        </div>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Following</div>
                                    </div>

                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="dashboard-gradient-text">
                                            {userStats.totalViews}
                                        </div>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Views</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tabs */}
                    <div style={{ 
                        display: 'flex', 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        marginBottom: '2rem',
                        overflowX: 'auto',
                    }}>
                        <TabButton 
                            label="Projects" 
                            isActive={activeTab === 'projects'}
                            onClick={() => setActiveTab('projects')}
                            count={projects.length}
                        />
                        <TabButton 
                            label="Liked" 
                            isActive={activeTab === 'liked'}
                            onClick={() => setActiveTab('liked')}
                            count={likedProjects.length}
                        />
                        {isOwnProfile && (
                            <TabButton 
                                label="Bookmarks" 
                                isActive={activeTab === 'bookmarks'}
                                onClick={() => setActiveTab('bookmarks')}
                                count={bookmarkedProjects.length}
                            />
                        )}
                        <TabButton 
                            label="Following" 
                            isActive={activeTab === 'following'}
                            onClick={() => setActiveTab('following')}
                            count={following.length}
                        />
                        <TabButton 
                            label="Followers" 
                            isActive={activeTab === 'followers'}
                            onClick={() => setActiveTab('followers')}
                            count={followers.length}
                        />
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'projects' && (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {projects.length > 0 ? (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                                                <span className="dashboard-gradient-text">Projects</span>
                                                <span style={{ 
                                                    marginLeft: '1rem',
                                                    background: 'rgba(102, 126, 234, 0.1)',
                                                    color: '#667eea',
                                                    fontSize: '0.9rem',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '1rem',
                                                    fontWeight: '600',
                                                    verticalAlign: 'middle',
                                                }}>
                                                    {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                                                </span>
                                            </h2>
                                            
                                            {isOwnProfile && (
                                                <Link to="/create">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        style={{
                                                            ...primaryButtonStyle,
                                                            padding: '0.75rem 1.5rem',
                                                        }}
                                                    >
                                                        <FiPlus /> New Project
                                                    </motion.button>
                                                </Link>
                                            )}
                                        </div>
                                        
                                        {projects.map((project) => (
                                            <ProjectCard
                                                key={project.id}
                                                {...project}
                                                onUpvote={handleUpvote}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{
                                            textAlign: 'center',
                                            padding: '4rem 2rem',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        <div style={{
                                            width: '6rem',
                                            height: '6rem',
                                            borderRadius: '50%',
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 2rem',
                                            fontSize: '2.5rem',
                                            color: '#667eea',
                                        }}>
                                            <FiFolder />
                                        </div>
                                        <h3 style={{ 
                                            fontSize: '1.5rem', 
                                            fontWeight: 'bold', 
                                            marginBottom: '0.5rem',
                                            color: 'var(--color-text)',
                                        }}>
                                            {isOwnProfile ? 'No projects yet' : 'No projects found'}
                                        </h3>
                                        <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
                                            {isOwnProfile 
                                                ? "You haven't shared any projects yet. Start by creating your first project!"
                                                : `${profileUser.username || 'This user'} hasn't shared any projects yet.`
                                            }
                                        </p>
                                        {isOwnProfile && (
                                            <Link to="/create">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        ...primaryButtonStyle,
                                                        padding: '0.75rem 1.5rem',
                                                    }}
                                                >
                                                    <FiUpload /> Create First Project
                                                </motion.button>
                                            </Link>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                        
                        {activeTab === 'liked' && (
                            <motion.div
                                key="liked"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {likedProjects.length > 0 ? (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                                                <span className="dashboard-gradient-text">Liked Projects</span>
                                                <span style={{ 
                                                    marginLeft: '1rem',
                                                    background: 'rgba(102, 126, 234, 0.1)',
                                                    color: '#667eea',
                                                    fontSize: '0.9rem',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '1rem',
                                                    fontWeight: '600',
                                                    verticalAlign: 'middle',
                                                }}>
                                                    {likedProjects.length} {likedProjects.length === 1 ? 'project' : 'projects'}
                                                </span>
                                            </h2>
                                        </div>
                                        
                                        {likedProjects.map((project) => (
                                            <ProjectCard
                                                key={project.id}
                                                {...project}
                                                onUpvote={handleUpvote}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{ textAlign: 'center', padding: '4rem 2rem' }}
                                    >
                                        <div style={{
                                            width: '6rem',
                                            height: '6rem',
                                            borderRadius: '50%',
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 2rem',
                                            fontSize: '2.5rem',
                                            color: '#667eea',
                                        }}>
                                            <FiHeart />
                                        </div>
                                        <h3 style={{ 
                                            fontSize: '1.5rem', 
                                            fontWeight: 'bold', 
                                            marginBottom: '0.5rem',
                                            color: 'var(--color-text)',
                                        }}>
                                            No Liked Projects
                                        </h3>
                                        <p style={{ fontSize: '1rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                                            {isOwnProfile 
                                                ? "Projects you've liked will appear here."
                                                : `${profileUser.username || 'This user'} hasn't liked any projects yet.`
                                            }
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                        
                        {activeTab === 'bookmarks' && (
                            <motion.div
                                key="bookmarks"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isOwnProfile ? (
                                    bookmarkedProjects.length > 0 ? (
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                                                    <span className="dashboard-gradient-text">Bookmarked Projects</span>
                                                    <span style={{ 
                                                        marginLeft: '1rem',
                                                        background: 'rgba(102, 126, 234, 0.1)',
                                                        color: '#667eea',
                                                        fontSize: '0.9rem',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '1rem',
                                                        fontWeight: '600',
                                                        verticalAlign: 'middle',
                                                    }}>
                                                        {bookmarkedProjects.length} {bookmarkedProjects.length === 1 ? 'project' : 'projects'}
                                                    </span>
                                                </h2>
                                            </div>
                                            
                                            {bookmarkedProjects.map((project) => (
                                                <ProjectCard
                                                    key={project.id}
                                                    {...project}
                                                    onUpvote={handleUpvote}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            style={{ textAlign: 'center', padding: '4rem 2rem' }}
                                        >
                                            <div style={{
                                                width: '6rem',
                                                height: '6rem',
                                                borderRadius: '50%',
                                                background: 'rgba(102, 126, 234, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 2rem',
                                                fontSize: '2.5rem',
                                                color: '#667eea',
                                            }}>
                                                <FiBookmark />
                                            </div>
                                            <h3 style={{ 
                                                fontSize: '1.5rem', 
                                                fontWeight: 'bold', 
                                                marginBottom: '0.5rem',
                                                color: 'var(--color-text)',
                                            }}>
                                                No Bookmarks Yet
                                            </h3>
                                            <p style={{ fontSize: '1rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                                                Projects you bookmark will appear here.
                                            </p>
                                        </motion.div>
                                    )
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{ textAlign: 'center', padding: '4rem 2rem' }}
                                    >
                                        <div style={{
                                            width: '6rem',
                                            height: '6rem',
                                            borderRadius: '50%',
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 2rem',
                                            fontSize: '2.5rem',
                                            color: '#667eea',
                                        }}>
                                            <FiBookmark />
                                        </div>
                                        <h3 style={{ 
                                            fontSize: '1.5rem', 
                                            fontWeight: 'bold', 
                                            marginBottom: '0.5rem',
                                            color: 'var(--color-text)',
                                        }}>
                                            Private Bookmarks
                                        </h3>
                                        <p style={{ fontSize: '1rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                                            Only you can see your bookmarks.
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                        
                        {activeTab === 'followers' && (
                            <motion.div
                                key="followers"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {followers.length > 0 ? (
                                    <div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                                                <span className="dashboard-gradient-text">Followers</span>
                                                <span style={{ 
                                                    marginLeft: '1rem',
                                                    background: 'rgba(102, 126, 234, 0.1)',
                                                    color: '#667eea',
                                                    fontSize: '0.9rem',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '1rem',
                                                    fontWeight: '600',
                                                    verticalAlign: 'middle',
                                                }}>
                                                    {followers.length} {followers.length === 1 ? 'follower' : 'followers'}
                                                </span>
                                            </h2>
                                        </div>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                            {followers.map((follower) => (
                                                <UserCard 
                                                    key={follower.id}
                                                    user={follower}
                                                    currentUserId={session?.user?.id}
                                                    onFollowToggle={handleUserFollowToggle}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{ textAlign: 'center', padding: '4rem 2rem' }}
                                    >
                                        <div style={{
                                            width: '6rem',
                                            height: '6rem',
                                            borderRadius: '50%',
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 2rem',
                                            fontSize: '2.5rem',
                                            color: '#667eea',
                                        }}>
                                            <FiUsers />
                                        </div>
                                        <h3 style={{ 
                                            fontSize: '1.5rem', 
                                            fontWeight: 'bold', 
                                            marginBottom: '0.5rem',
                                            color: 'var(--color-text)',
                                        }}>
                                            No Followers Yet
                                        </h3>
                                        <p style={{ fontSize: '1rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                                            {isOwnProfile 
                                                ? "When people follow you, they'll appear here."
                                                : `${profileUser.username || 'This user'} doesn't have any followers yet.`
                                            }
                                        </p>
                                        {isOwnProfile && (
                                            <Link to="/discover">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        ...secondaryButtonStyle,
                                                        padding: '0.75rem 1.5rem',
                                                    }}
                                                >
                                                    <FiCompass /> Discover Projects
                                                </motion.button>
                                            </Link>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                        
                        {activeTab === 'following' && (
                            <motion.div
                                key="following"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {following.length > 0 ? (
                                    <div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                                                <span className="dashboard-gradient-text">Following</span>
                                                <span style={{ 
                                                    marginLeft: '1rem',
                                                    background: 'rgba(102, 126, 234, 0.1)',
                                                    color: '#667eea',
                                                    fontSize: '0.9rem',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '1rem',
                                                    fontWeight: '600',
                                                    verticalAlign: 'middle',
                                                }}>
                                                    {following.length} {following.length === 1 ? 'user' : 'users'}
                                                </span>
                                            </h2>
                                        </div>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                            {following.map((followedUser) => (
                                                <UserCard 
                                                    key={followedUser.id}
                                                    user={followedUser}
                                                    currentUserId={session?.user?.id}
                                                    onFollowToggle={handleUserFollowToggle}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{ textAlign: 'center', padding: '4rem 2rem' }}
                                    >
                                        <div style={{
                                            width: '6rem',
                                            height: '6rem',
                                            borderRadius: '50%',
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 2rem',
                                            fontSize: '2.5rem',
                                            color: '#667eea',
                                        }}>
                                            <FiUsers />
                                        </div>
                                        <h3 style={{ 
                                            fontSize: '1.5rem', 
                                            fontWeight: 'bold', 
                                            marginBottom: '0.5rem',
                                            color: 'var(--color-text)',
                                        }}>
                                            {isOwnProfile ? "You're Not Following Anyone Yet" : `${profileUser.username || 'This user'} Is Not Following Anyone`}
                                        </h3>
                                        <p style={{ fontSize: '1rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                                            {isOwnProfile 
                                                ? "Discover amazing developers and follow them to see their projects here."
                                                : ""
                                            }
                                        </p>
                                        {isOwnProfile && (
                                            <Link to="/discover">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        ...primaryButtonStyle,
                                                        padding: '0.75rem 1.5rem',
                                                    }}
                                                >
                                                    <FiCompass /> Discover Developers
                                                </motion.button>
                                            </Link>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
                
                {/* Footer */}
                <footer style={{ 
                    padding: '3rem 0', 
                    textAlign: 'center', 
                    color: 'var(--color-text-muted)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    marginTop: '3rem',
                    fontSize: '0.9rem',
                }}>
                    © {new Date().getFullYear()} DevShowcase. Built with ❤ for developers.
                </footer>
            </main>
        </div>
    );
}