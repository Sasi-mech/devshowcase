// src/components/pages/Discover.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiSearch, FiHome, FiCompass, FiUser, FiBell, FiSettings, 
    FiLogOut, FiUpload, FiMenu, FiX, FiMonitor, FiStar, FiMessageSquare,
    FiTrendingUp, FiActivity, FiHeart, FiCode, FiBookmark, FiUsers,
    FiChevronRight, FiZap, FiAward, FiCalendar, FiBarChart2,FiGithub,
    FiFilter, FiGrid, FiList, FiTrendingUp as FiFire,
    FiExternalLink, FiGitBranch, FiEye, FiClock, FiTag,
    FiThumbsUp, FiGlobe, FiUsers as FiUserIcon
} from 'react-icons/fi';

// --- Custom CSS for Discover ---
const discoverStyles = `
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
    
    .project-card-featured {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        border: 1px solid rgba(102, 126, 234, 0.3);
    }
    
    .tag-chip {
        transition: all 0.2s ease;
    }
    
    .tag-chip:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .vote-button:hover {
        background: rgba(249, 115, 22, 0.15) !important;
    }
    
    .search-input:focus {
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }
`;

// --- Configuration ---
const SIDEBAR_EXPANDED_WIDTH = '280px';
const SIDEBAR_CONTRACTED_WIDTH = '90px';
const HEADER_HEIGHT = '80px';

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

// --- NavLink Component ---
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
    author, 
    authorAvatar,
    votes, 
    comments, 
    views,
    tags, 
    isFeatured,
    githubUrl,
    liveUrl,
    createdAt,
    onUpvote,
    isUpvoted
}) => {
    const [localVotes, setLocalVotes] = useState(votes);
    const [localIsUpvoted, setLocalIsUpvoted] = useState(isUpvoted);

    const handleUpvote = async (e) => {
        e.stopPropagation();
        const newUpvotedState = !localIsUpvoted;
        setLocalIsUpvoted(newUpvotedState);
        setLocalVotes(newUpvotedState ? localVotes + 1 : localVotes - 1);
        await onUpvote(id, newUpvotedState);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getTagColor = (tag) => {
        // Assign consistent colors to tags
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4fd1c5', 
            '#38b2ac', '#ed8936', '#ecc94b', '#48bb78', '#4299e1'
        ];
        const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`dashboard-card-hover dashboard-glass-effect ${isFeatured ? 'project-card-featured' : ''}`}
            style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                marginBottom: '1.5rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {isFeatured && (
                <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '0.25rem 1rem',
                    borderBottomLeftRadius: '0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    zIndex: 1,
                }}>
                    <FiStar size={12} /> Featured
                </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
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
                            {authorAvatar ? (
                                <img 
                                    src={authorAvatar} 
                                    alt={author}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                author?.charAt(0)?.toUpperCase() || 'U'
                            )}
                        </div>
                        <div>
                            <h3 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: 'bold', 
                                color: 'var(--color-text)', 
                                marginBottom: '0.25rem',
                                lineHeight: '1.2'
                            }}>
                                {title}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                    @{author}
                                </span>
                                <span style={{ 
                                    color: 'var(--color-text-muted)', 
                                    fontSize: '0.8rem',
                                    opacity: 0.7
                                }}>
                                    • {formatDate(createdAt)}
                                </span>
                                <span style={{ 
                                    color: 'var(--color-text-muted)', 
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    <FiEye size={10} /> {views || 0}
                                </span>
                            </div>
                        </div>
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
                        {description}
                    </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '1rem', flexShrink: 0 }}>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleUpvote}
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
                        className="vote-button"
                    >
                        <FiHeart size={20} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                            {localVotes}
                        </span>
                    </motion.button>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <FiMessageSquare size={20} style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                            {comments}
                        </span>
                    </div>
                </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {tags?.slice(0, 5).map((tag, index) => (
                        <motion.span 
                            key={index} 
                            className="tag-chip"
                            whileHover={{ scale: 1.05 }}
                            style={{
                                fontSize: '0.75rem',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '2rem',
                                background: `rgba(${hexToRgb(getTagColor(tag))}, 0.1)`,
                                color: getTagColor(tag),
                                fontWeight: '500',
                                border: `1px solid rgba(${hexToRgb(getTagColor(tag))}, 0.2)`,
                            }}
                        >
                            {tag}
                        </motion.span>
                    ))}
                    {tags?.length > 5 && (
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '2rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'var(--color-text-muted)',
                            fontWeight: '500',
                        }}>
                            +{tags.length - 5} more
                        </span>
                    )}
                </div>
                
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {githubUrl && (
                        <a 
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.85rem',
                                color: 'var(--color-text-muted)',
                                textDecoration: 'none',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.color = 'var(--color-text-muted)';
                            }}
                        >
                            <FiGithub size={14} /> Code
                        </a>
                    )}
                    
                    {liveUrl && (
                        <a 
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.85rem',
                                color: '#667eea',
                                textDecoration: 'none',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(102, 126, 234, 0.1)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                            }}
                        >
                            <FiGlobe size={14} /> Live Demo
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// --- Filter Button Component ---
const FilterButton = ({ label, icon: Icon, isActive, onClick, count, color = '#667eea' }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '0.75rem',
            background: isActive ? `rgba(${hexToRgb(color)}, 0.15)` : 'transparent',
            border: isActive ? `1px solid rgba(${hexToRgb(color)}, 0.3)` : '1px solid rgba(255, 255, 255, 0.1)',
            color: isActive ? color : 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
        }}
    >
        {Icon && <Icon />}
        {label}
        {count > 0 && (
            <span style={{
                marginLeft: '0.5rem',
                background: isActive ? color : 'rgba(255, 255, 255, 0.1)',
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

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
        : '102, 126, 234';
};

// --- Main Discover Component ---
export default function DiscoverPage() {
    const { session, loading: authLoading, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [projects, setProjects] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [userVotes, setUserVotes] = useState({});
    const [techStacks, setTechStacks] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [uniqueTags, setUniqueTags] = useState([]);

    const user_id = session?.user?.id;
    const currentSidebarWidth = isSidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_CONTRACTED_WIDTH;

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // --- Data Fetching: Profile ---
    useEffect(() => {
        if (!user_id) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, avatar_url, full_name, bio')
                    .eq('id', user_id)
                    .single();

                if (error) throw error;
                setProfile(data);
            } catch (err) {
                console.error('Error fetching profile:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user_id]);

    // --- Data Fetching: Projects from ALL USERS ---
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoadingProjects(true);
            try {
                // Fetch published projects from all users
                const { data: projectsData, error: projectsError } = await supabase
                    .from('projects')
                    .select(`
                        *,
                        profiles:user_id (
                            username,
                            avatar_url
                        )
                    `)
                    .eq('is_published', true)
                    .order('created_at', { ascending: false });

                if (projectsError) throw projectsError;

                // Fetch user's votes if logged in
                let votesMap = {};
                if (user_id) {
                    const { data: userVotesData } = await supabase
                        .from('votes')
                        .select('project_id')
                        .eq('user_id', user_id);

                    if (userVotesData) {
                        userVotesData.forEach(vote => {
                            votesMap[vote.project_id] = true;
                        });
                    }
                    setUserVotes(votesMap);
                }

                // Fetch tech stacks
                const { data: techData } = await supabase
                    .from('tech_stacks')
                    .select('name, icon, color')
                    .order('name');

                if (techData) {
                    setTechStacks(techData);
                }

                // Transform projects data
                const formattedProjects = projectsData.map(project => ({
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    author: project.profiles?.username || 'Anonymous',
                    authorAvatar: project.profiles?.avatar_url,
                    votes: project.votes_count || 0,
                    comments: project.comments_count || 0,
                    views: project.views_count || 0,
                    tags: project.tags || [],
                    isFeatured: project.is_featured || false,
                    githubUrl: project.github_url,
                    liveUrl: project.live_url,
                    createdAt: project.created_at,
                    isUpvoted: votesMap[project.id] || false
                }));

                setProjects(formattedProjects);
                setFilteredProjects(formattedProjects);

                // Extract unique tags for filtering
                const tags = Array.from(new Set(formattedProjects.flatMap(p => p.tags))).slice(0, 10);
                setUniqueTags(tags);

            } catch (error) {
                console.error('Error fetching data:', error);
                // Use mock data as fallback
                const mockProjects = getMockProjects();
                setProjects(mockProjects);
                setFilteredProjects(mockProjects);
            } finally {
                setIsLoadingProjects(false);
            }
        };

        fetchAllData();
    }, [user_id]);

    // Mock data fallback
    const getMockProjects = () => {
        return [
            {
                id: '1',
                title: 'CodeCollab AI',
                description: 'Real-time collaborative code editor with AI pair programming assistant. Supports multiple languages and has built-in debugging tools.',
                author: 'sarah_dev',
                authorAvatar: 'https://i.pravatar.cc/150?img=1',
                votes: 142,
                comments: 23,
                views: 450,
                tags: ['React', 'AI', 'WebSockets', 'TypeScript', 'Node.js'],
                isFeatured: true,
                githubUrl: 'https://github.com',
                liveUrl: 'https://demo.com',
                createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
                isUpvoted: false
            },
            {
                id: '2',
                title: 'EcoTrack Pro',
                description: 'Advanced carbon footprint tracker with ML-powered recommendations for reducing environmental impact.',
                author: 'marcus_lee',
                authorAvatar: 'https://i.pravatar.cc/150?img=2',
                votes: 89,
                comments: 12,
                views: 320,
                tags: ['Python', 'Machine Learning', 'Next.js', 'Docker', 'PostgreSQL'],
                isFeatured: false,
                githubUrl: 'https://github.com',
                liveUrl: 'https://demo.com',
                createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
                isUpvoted: true
            },
            {
                id: '3',
                title: 'HealthFlow',
                description: 'Comprehensive health monitoring platform with real-time analytics and doctor-patient communication.',
                author: 'jamiewilson',
                authorAvatar: 'https://i.pravatar.cc/150?img=3',
                votes: 67,
                comments: 8,
                views: 210,
                tags: ['TypeScript', 'GraphQL', 'Docker', 'AWS', 'React Native'],
                isFeatured: true,
                githubUrl: 'https://github.com',
                liveUrl: 'https://demo.com',
                createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
                isUpvoted: false
            },
            {
                id: '4',
                title: 'MusicAI Studio',
                description: 'AI-powered music creation studio with neural networks for melody generation and sound synthesis.',
                author: 'taylor_codes',
                authorAvatar: 'https://i.pravatar.cc/150?img=4',
                votes: 203,
                comments: 45,
                views: 890,
                tags: ['Python', 'TensorFlow', 'React', 'Web Audio API', 'Flask'],
                isFeatured: false,
                githubUrl: 'https://github.com',
                liveUrl: 'https://demo.com',
                createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
                isUpvoted: true
            },
            {
                id: '5',
                title: 'DevTools Pro',
                description: 'Collection of essential developer tools including code formatters, validators, and API testers.',
                author: 'john_doe',
                authorAvatar: 'https://i.pravatar.cc/150?img=5',
                votes: 56,
                comments: 7,
                views: 180,
                tags: ['JavaScript', 'Node.js', 'Chrome Extension', 'CSS'],
                isFeatured: false,
                githubUrl: 'https://github.com',
                liveUrl: 'https://demo.com',
                createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
                isUpvoted: false
            },
        ];
    };

    // Handle upvote
    const handleUpvote = async (projectId, isUpvoted) => {
        if (!user_id) {
            alert('Please login to upvote projects');
            return;
        }

        try {
            if (isUpvoted) {
                // Add vote
                const { error } = await supabase
                    .from('votes')
                    .insert([
                        {
                            user_id: user_id,
                            project_id: projectId
                        }
                    ]);

                if (error) throw error;
                
                // Update project votes count
                await supabase
                    .from('projects')
                    .update({ votes_count: projects.find(p => p.id === projectId).votes + 1 })
                    .eq('id', projectId);
            } else {
                // Remove vote
                const { error } = await supabase
                    .from('votes')
                    .delete()
                    .match({ user_id: user_id, project_id: projectId });

                if (error) throw error;
                
                // Update project votes count
                await supabase
                    .from('projects')
                    .update({ votes_count: projects.find(p => p.id === projectId).votes - 1 })
                    .eq('id', projectId);
            }

            // Update local state
            setProjects(prev => prev.map(project => 
                project.id === projectId 
                    ? { 
                        ...project, 
                        votes: isUpvoted ? project.votes + 1 : project.votes - 1,
                        isUpvoted 
                    }
                    : project
            ));

            setUserVotes(prev => ({
                ...prev,
                [projectId]: isUpvoted
            }));

        } catch (error) {
            console.error('Error upvoting:', error);
            alert('Failed to update vote. Please try again.');
        }
    };

    // Filter and sort projects
    useEffect(() => {
        let filtered = [...projects];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                project.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (activeFilter === 'featured') {
            filtered = filtered.filter(project => project.isFeatured);
        } else if (activeFilter === 'trending') {
            filtered = filtered.filter(project => project.votes > 10);
        } else if (activeFilter === 'recent') {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(project => new Date(project.createdAt) > weekAgo);
        } else if (activeFilter !== 'all' && uniqueTags.includes(activeFilter)) {
            filtered = filtered.filter(project => project.tags.includes(activeFilter));
        }

        // Sort based on filter
        if (activeFilter === 'trending') {
            filtered.sort((a, b) => b.votes - a.votes);
        } else if (activeFilter === 'recent') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredProjects(filtered);
    }, [projects, searchTerm, activeFilter, uniqueTags]);

    // Get count for filter badges
    const getFilterCount = (filter) => {
        if (filter === 'all') return projects.length;
        if (filter === 'featured') return projects.filter(p => p.isFeatured).length;
        if (filter === 'trending') return projects.filter(p => p.votes > 10).length;
        if (filter === 'recent') {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return projects.filter(p => new Date(p.createdAt) > weekAgo).length;
        }
        return projects.filter(p => p.tags.includes(filter)).length;
    };

    // Get unique developer count
    const uniqueDevelopers = new Set(projects.map(p => p.author)).size;

    // Animation styles
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
    
    if (!session) {
        return (
            <div style={{ 
                padding: '4rem', 
                textAlign: 'center', 
                color: 'var(--color-text-muted)',
                background: 'var(--color-background-dark)',
                minHeight: '100vh',
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Please log in to discover projects.</h2>
                <Link to="/auth?mode=login" style={primaryButtonStyle}>
                    Go to Login
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
            <style>{discoverStyles}</style>
            
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
            
            {/* --- SIDEBAR --- */}
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
                
                {/* User Profile */}
                {isSidebarExpanded && profile && (
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
                                {profile.avatar_url ? (
                                    <img 
                                        src={profile.avatar_url} 
                                        alt={profile.username}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    profile.username?.charAt(0)?.toUpperCase() || 'U'
                                )}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>@{profile.username}</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{profile.full_name || 'Developer'}</div>
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
                        isActive={true}
                    />
                    <NavLink 
                        to="/notifications" 
                        icon={FiBell} 
                        text="Notifications" 
                        isExpanded={isSidebarExpanded}
                        isActive={false}
                        
                    />
                    <NavLink 
                        to={`/u/${profile?.username}`} 
                        icon={FiUser} 
                        text="Profile" 
                        isExpanded={isSidebarExpanded}
                        isActive={false}
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
                
                {/* Stats Section */}
                {isSidebarExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '1.5rem',
                            margin: '0 1rem 2rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '1rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Discover Stats</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Projects</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#667eea' }}>{projects.length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Developers</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#667eea' }}>{uniqueDevelopers}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Tags</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#667eea' }}>{uniqueTags.length}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
                
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

            {/* --- MAIN CONTENT AREA --- */}
            <main style={mainContainerStyle}>
                
                {/* --- HEADER --- */}
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
                            placeholder="Search projects, developers, or tags..."
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
                            className="search-input"
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
                        >
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>@{profile?.username || 'User'}</div>
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
                                {profile?.avatar_url ? (
                                    <img 
                                        src={profile.avatar_url} 
                                        alt={profile.username}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    profile?.username?.charAt(0)?.toUpperCase() || 'U'
                                )}
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* --- DISCOVER CONTENT --- */}
                <section style={{ padding: '2rem 0', position: 'relative', zIndex: 1 }}>
                    
                    {/* Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ marginBottom: '3rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h1 style={{ 
                                fontSize: '3rem', 
                                fontWeight: 'bold', 
                                lineHeight: '1.2',
                            }}>
                                <span className="dashboard-gradient-text">Discover</span>
                                <span style={{ 
                                    marginLeft: '1rem',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    fontSize: '1rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    fontWeight: '600',
                                    verticalAlign: 'middle',
                                }}>
                                    {projects.length} projects • {uniqueDevelopers} developers
                                </span>
                            </h1>
                            
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode('list')}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '0.75rem',
                                        background: viewMode === 'list' ? 'rgba(102, 126, 234, 0.15)' : 'transparent',
                                        border: viewMode === 'list' ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                                        color: viewMode === 'list' ? '#667eea' : 'var(--color-text-muted)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <FiList size={20} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode('grid')}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '0.75rem',
                                        background: viewMode === 'grid' ? 'rgba(102, 126, 234, 0.15)' : 'transparent',
                                        border: viewMode === 'grid' ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                                        color: viewMode === 'grid' ? '#667eea' : 'var(--color-text-muted)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <FiGrid size={20} />
                                </motion.button>
                            </div>
                        </div>
                        <p style={{ 
                            color: 'var(--color-text-muted)', 
                            fontSize: '1.25rem',
                            maxWidth: '800px',
                            marginBottom: '1.5rem',
                        }}>
                            Explore amazing projects from developers around the world. Get inspired and share your own creations!
                        </p>
                        
                        {/* Quick Stats */}
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ 
                                    width: '10px', 
                                    height: '10px', 
                                    borderRadius: '50%', 
                                    background: '#667eea' 
                                }} />
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                    <strong>{projects.filter(p => p.isFeatured).length}</strong> featured projects
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ 
                                    width: '10px', 
                                    height: '10px', 
                                    borderRadius: '50%', 
                                    background: '#48bb78' 
                                }} />
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                    <strong>{projects.reduce((sum, p) => sum + p.votes, 0)}</strong> total upvotes
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ 
                                    width: '10px', 
                                    height: '10px', 
                                    borderRadius: '50%', 
                                    background: '#ed8936' 
                                }} />
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                    <strong>{uniqueTags.length}</strong> technologies
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ 
                            marginBottom: '2rem',
                            padding: '1.5rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '1rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-text)' }}>
                                <FiFilter style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                Filter Projects
                            </h3>
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                {filteredProjects.length} of {projects.length} projects
                            </span>
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                            <FilterButton 
                                label="All" 
                                icon={FiGrid}
                                isActive={activeFilter === 'all'}
                                onClick={() => setActiveFilter('all')}
                                count={getFilterCount('all')}
                                color="#667eea"
                            />
                            <FilterButton 
                                label="Featured" 
                                icon={FiStar}
                                isActive={activeFilter === 'featured'}
                                onClick={() => setActiveFilter('featured')}
                                count={getFilterCount('featured')}
                                color="#f97316"
                            />
                            <FilterButton 
                                label="Trending" 
                                icon={FiFire}
                                isActive={activeFilter === 'trending'}
                                onClick={() => setActiveFilter('trending')}
                                count={getFilterCount('trending')}
                                color="#ef4444"
                            />
                            <FilterButton 
                                label="Recent" 
                                icon={FiClock}
                                isActive={activeFilter === 'recent'}
                                onClick={() => setActiveFilter('recent')}
                                count={getFilterCount('recent')}
                                color="#10b981"
                            />
                        </div>
                        
                        {/* Tech Stack Filters */}
                        {uniqueTags.length > 0 && (
                            <>
                                <h4 style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                                    <FiTag style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                    Technologies
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    {uniqueTags.map(tag => {
                                        const tech = techStacks.find(t => t.name === tag);
                                        return (
                                            <FilterButton 
                                                key={tag}
                                                label={tag}
                                                icon={FiCode}
                                                isActive={activeFilter === tag}
                                                onClick={() => setActiveFilter(tag)}
                                                count={getFilterCount(tag)}
                                                color={tech?.color || '#667eea'}
                                            />
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* Projects List */}
                    {isLoadingProjects ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '3px solid rgba(102, 126, 234, 0.3)',
                                    borderTopColor: '#667eea',
                                    borderRadius: '50%',
                                    margin: '0 auto 2rem',
                                }}
                            />
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                                Loading amazing projects...
                            </p>
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        <AnimatePresence>
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    {...project}
                                    onUpvote={handleUpvote}
                                />
                            ))}
                        </AnimatePresence>
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
                                <FiCompass />
                            </div>
                            <h3 style={{ 
                                fontSize: '1.5rem', 
                                fontWeight: 'bold', 
                                marginBottom: '0.5rem',
                                color: 'var(--color-text)',
                            }}>
                                {searchTerm ? 'No matching projects found' : 'No projects available yet'}
                            </h3>
                            <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
                                {searchTerm 
                                    ? `We couldn't find any projects matching "${searchTerm}"`
                                    : "Be the first developer to share an amazing project!"
                                }
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                {searchTerm && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSearchTerm('')}
                                        style={{
                                            ...secondaryButtonStyle,
                                            padding: '0.75rem 1.5rem',
                                        }}
                                    >
                                        Clear search
                                    </motion.button>
                                )}
                                <Link to="/create">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            ...primaryButtonStyle,
                                            padding: '0.75rem 1.5rem',
                                        }}
                                    >
                                        <FiUpload /> Share Your Project
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* Community Stats */}
                    {projects.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            style={{
                                marginTop: '3rem',
                                padding: '2rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '1rem',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
                                <FiUserIcon style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                Community Stats
                            </h3>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                                gap: '1.5rem',
                                textAlign: 'center',
                            }}>
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="dashboard-gradient-text">
                                        {projects.length}
                                    </div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total Projects</div>
                                </div>
                                
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="dashboard-gradient-text">
                                        {uniqueDevelopers}
                                    </div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Developers</div>
                                </div>
                                
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="dashboard-gradient-text">
                                        {projects.reduce((sum, p) => sum + p.votes, 0).toLocaleString()}
                                    </div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total Upvotes</div>
                                </div>
                                
                                <div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="dashboard-gradient-text">
                                        {uniqueTags.length}
                                    </div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Technologies</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
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
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
                        Showing {filteredProjects.length} of {projects.length} projects • Updated just now
                    </div>
                </footer>
            </main>
        </div>
    );
}