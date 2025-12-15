// src/components/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
    FiUser, FiLogIn, FiUserPlus, FiMonitor, FiArrowRight,
    FiSearch, FiHeart, FiMessageCircle, FiShare2, FiZap,
    FiCode, FiUsers, FiTrendingUp, FiAward, FiStar, FiChevronRight
} from 'react-icons/fi';
import { motion } from 'framer-motion';

// --- Configuration ---
const HEADER_HEIGHT = '5rem'; 

// --- Custom CSS for animations ---
const styles = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
    
    @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #f093fb 100%);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 8s ease infinite;
    }
    
    .gradient-bg {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #f093fb 100%);
        background-size: 300% 300%;
        animation: gradient-shift 8s ease infinite;
    }
    
    .card-hover {
        transition: all 0.3s ease;
    }
    
    .card-hover:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .float-animation {
        animation: float 6s ease-in-out infinite;
    }
    
    .glow-effect {
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    }
    
    .glass-effect {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .typewriter {
        overflow: hidden;
        border-right: 2px solid #667eea;
        white-space: nowrap;
        animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
    }
    
    @keyframes typing {
        from { width: 0 }
        to { width: 100% }
    }
    
    @keyframes blink-caret {
        from, to { border-color: transparent }
        50% { border-color: #667eea; }
    }
`;

// --- Enhanced Button Styles ---
const primaryButtonStyle = { 
    padding: '1rem 2rem', 
    borderRadius: '0.75rem',
    background: 'linear-gradient(135deg, var(--color-primary), #764ba2)',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.1rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    border: 'none',
    cursor: 'pointer',
};

const secondaryButtonStyle = { 
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    background: 'transparent',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    color: 'var(--color-text)',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.1rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
};

// --- Enhanced Project Card ---
const ProjectCard = ({ title, description, tags, author, fire, comments, liked, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
        whileHover={{ scale: 1.05 }}
        className="card-hover glass-effect"
        style={{ 
            padding: '1.75rem', 
            borderRadius: '1.5rem', 
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
        }}
    >
        {/* Gradient border effect */}
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.1))',
            borderRadius: '1.5rem',
            opacity: 0,
            transition: 'opacity 0.3s ease',
        }} className="card-hover:hover:opacity-100" />
        
        <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '0.5rem' }}>{title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiUser style={{ color: 'white', fontSize: '1rem' }} />
                        </div>
                        <span style={{ fontWeight: '600', color: 'var(--color-text-muted)' }}>{author}</span>
                    </div>
                </div>
                <button style={{ 
                    color: liked ? '#ff4757' : 'var(--color-text-muted)', 
                    cursor: 'pointer', 
                    background: 'transparent', 
                    border: 'none',
                    fontSize: '1.5rem',
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    {liked ? '♥' : '♡'}
                </button>
            </div>
            
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.6' }}>
                {description}
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {tags.map((tag, index) => (
                    <span key={index} 
                          style={{ 
                              fontSize: '0.8rem', 
                              padding: '0.4rem 0.9rem', 
                              borderRadius: '2rem', 
                              background: 'rgba(102, 126, 234, 0.1)', 
                              color: '#667eea',
                              fontWeight: '500',
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                          }}>
                        {tag}
                    </span>
                ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                        <FiZap style={{ color: '#ffa502', fontSize: '1.25rem' }} />
                        <span style={{ fontWeight: '600' }}>{fire}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                        <FiMessageCircle style={{ fontSize: '1.25rem' }} />
                        <span>{comments}</span>
                    </div>
                </div>
                <button style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '2rem',
                    background: 'transparent',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    color: '#667eea',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                }}>
                    View Project <FiChevronRight style={{ marginLeft: '0.25rem' }} />
                </button>
            </div>
        </div>
    </motion.div>
);

// --- Feature Card Component ---
const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -10 }}
        className="glass-effect card-hover"
        style={{
            padding: '2rem',
            borderRadius: '1.5rem',
            textAlign: 'center',
        }}
    >
        <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '1rem',
            background: `linear-gradient(135deg,${color.start}, ${color.end})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '1.5rem',
            color: 'white',
        }}>
            <Icon />
        </div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-text)' }}>{title}</h3>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{description}</p>
    </motion.div>
);

// --- Main Landing Page Component ---
export default function LandingPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        setIsLoaded(true);
        
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const stats = [
        { value: '1,234+', label: 'Projects Shared', icon: FiCode },
        { value: '8,901+', label: 'Upvotes Given', icon: FiHeart },
        { value: '567+', label: 'Active Developers', icon: FiUsers },
        { value: '15+', label: 'Tech Stacks', icon: FiTrendingUp },
        { value: '42+', label: 'Featured', icon: FiAward },
        { value: '4.9', label: 'Rating', icon: FiStar },
    ];

    const features = [
        {
            icon: FiCode,
            title: 'Showcase Your Work',
            description: 'Display your projects with beautiful cards, tags, and detailed descriptions.',
            color: { start: '#667eea', end: '#764ba2' }
        },
        {
            icon: FiUsers,
            title: 'Community Feedback',
            description: 'Get valuable feedback and upvotes from fellow developers worldwide.',
            color: { start: '#f093fb', end: '#f5576c' }
        },
        {
            icon: FiTrendingUp,
            title: 'Gain Visibility',
            description: 'Increase your chances of getting noticed by recruiters and collaborators.',
            color: { start: '#4facfe', end: '#00f2fe' }
        },
        {
            icon: FiAward,
            title: 'Win Awards',
            description: 'Participate in monthly challenges and win amazing prizes.',
            color: { start: '#43e97b', end: '#38f9d7' }
        },
    ];

    const projects = [
        { title: 'CodeCollab', description: 'Real-time collaborative code editor with video chat and project management features.', tags: ['React', 'Node.js', 'WebSockets', 'MongoDB'], author: 'Sarah Johnson', fire: 42, comments: 12, liked: false },
        { title: 'FitTrack AI', description: 'AI-powered fitness tracker with form correction and personalized workout plans.', tags: ['Python', 'OpenCV', 'Flutter'], author: 'Marcus Lee', fire: 67, comments: 23, liked: true },
        { title: 'EcoTrack', description: 'Carbon footprint calculator with sustainability tips and community challenges.', tags: ['Vue.js', 'Firebase', 'Supabase'], author: 'Jamie Wilson', fire: 35, comments: 8, liked: false },
    ];

    return (
        <div ref={containerRef} style={{ 
            minHeight: '100vh', 
            background: 'var(--color-background-dark)', 
            color: 'var(--color-text)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Add CSS styles */}
            <style>{styles}</style>
            
            {/* Animated background elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                animation: 'float 15s ease-in-out infinite',
            }} />
            
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)',
                animation: 'float 18s ease-in-out infinite',
                animationDelay: '1s',
            }} />
            
            {/* Mouse follower gradient */}
            <div style={{
                position: 'fixed',
                top: mousePosition.y - 250,
                left: mousePosition.x - 250,
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0,
                transition: 'all 0.1s ease',
            }} />

            {/* --- ENHANCED HEADER --- */}
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    position: 'sticky', 
                    top: 0,
                    left: 0, 
                    right: 0,
                    height: HEADER_HEIGHT,
                    zIndex: 1000, 
                    padding: '0 5vw', 
                    background: 'rgba(15, 15, 25, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                
                {/* Logo Area */}
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                >
                    <div className="gradient-bg" style={{ 
                        width: '3rem', 
                        height: '3rem', 
                        borderRadius: '1rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                    }}>
                        <FiMonitor style={{ color: 'white', fontSize: '1.5rem' }} />
                    </div>
                    <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }} className="gradient-text">DevShowcase</span>
                </motion.div>
                
                {/* Navigation */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {['Discover', 'Trending', 'Community', 'Challenges'].map((item) => (
                        <motion.a
                            key={item}
                            whileHover={{ scale: 1.1, color: '#667eea' }}
                            style={{
                                color: 'var(--color-text-muted)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'color 0.3s ease',
                            }}
                        >
                            {item}
                        </motion.a>
                    ))}
                </nav>
                
                {/* Auth Options */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Link to="/auth?mode=login" style={secondaryButtonStyle}>
                            <FiLogIn /> Sign In
                        </Link>
                    </motion.div>
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/auth?mode=signup" style={primaryButtonStyle}>
                            <FiUserPlus /> Get Started
                        </Link>
                    </motion.div>
                </div>
            </motion.header>

            {/* --- MAIN CONTENT AREA --- */}
            <main style={{ position: 'relative', zIndex: 1 }}>
                
                {/* Hero Section */}
                <section style={{ 
                    padding: '8rem 5vw 6rem',
                    position: 'relative',
                    maxWidth: '1400px',
                    margin: '0 auto',
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ maxWidth: '900px' }}
                    >
                        <div style={{ 
                            fontSize: '0.95rem', 
                            fontWeight: '600', 
                            color: '#667eea',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}>
                            <FiStar /> TRENDING PLATFORM FOR DEVELOPERS
                        </div>
                        
                        <h1 style={{ 
                            fontSize: '4.5rem', 
                            fontWeight: 'bold', 
                            marginBottom: '1.5rem', 
                            lineHeight: '1.1',
                        }}>
                            Showcase Your{' '}
                            <span className="gradient-text">Creative Code</span>
                            <br />
                            To The <span style={{ position: 'relative' }}>
                                World
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        position: 'absolute',
                                        right: '-60px',
                                        top: '50%',
                                        fontSize: '3rem',
                                        color: '#667eea',
                                    }}
                                >
                                    ✦
                                </motion.span>
                            </span>
                        </h1>
                        
                        <p style={{ 
                            color: 'var(--color-text-muted)', 
                            fontSize: '1.35rem', 
                            marginBottom: '3rem',
                            lineHeight: '1.6',
                            maxWidth: '800px',
                        }}>
                            Join thousands of developers sharing, discovering, and upvoting innovative projects. 
                            Build your portfolio, get valuable feedback, and connect with like-minded creators.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link to="/auth?mode=signup" style={primaryButtonStyle}>
                                    <FiZap /> Start Creating Free
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                            >
                                <Link to="/discover" style={secondaryButtonStyle}>
                                    <FiTrendingUp /> Explore Trending
                                </Link>
                            </motion.div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                color: 'var(--color-text-muted)',
                                marginLeft: '2rem',
                            }}>
                                <FiUser style={{ color: '#667eea' }} />
                                <span>Join <strong>1,200+</strong> developers this week</span>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Stats Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{ 
                        padding: '3rem 5vw',
                        maxWidth: '1400px',
                        margin: '0 auto',
                    }}
                >
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(6, 1fr)', 
                        gap: '1.5rem',
                        padding: '2.5rem',
                        borderRadius: '2rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}>
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                style={{ 
                                    textAlign: 'center',
                                    padding: '1.5rem',
                                }}
                            >
                                <stat.icon style={{ 
                                    fontSize: '2rem', 
                                    color: '#667eea',
                                    marginBottom: '1rem',
                                }} />
                                <div style={{ 
                                    fontSize: '2.5rem', 
                                    fontWeight: 'bold', 
                                    marginBottom: '0.5rem',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>{stat.value}</div>
                                <div style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Features Section */}
                <section style={{ padding: '8rem 5vw' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ textAlign: 'center', marginBottom: '4rem' }}
                        >
                            <h2 style={{ 
                                fontSize: '3rem', 
                                fontWeight: 'bold', 
                                marginBottom: '1.5rem' 
                            }}>
                                Why <span className="gradient-text">Choose</span> DevShowcase?
                            </h2>
                            <p style={{ 
                                color: 'var(--color-text-muted)', 
                                fontSize: '1.25rem',
                                maxWidth: '800px',
                                margin: '0 auto',
                            }}>
                                Everything you need to showcase your work and grow as a developer
                            </p>
                        </motion.div>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            gap: '2rem',
                            marginBottom: '4rem',
                        }}>
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Projects Grid Section */}
                <section style={{ padding: '4rem 5vw 8rem' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}
                        >
                            <div>
                                <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    Featured <span className="gradient-text">Projects</span>
                                </h2>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>
                                    Discover the most innovative projects from our community
                                </p>
                            </div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link to="/discover" style={{
                                    ...primaryButtonStyle,
                                    padding: '1rem 2.5rem',
                                }}>
                                    View All <FiArrowRight />
                                </Link>
                            </motion.div>
                        </motion.div>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '2.5rem',
                        }}>
                            {projects.map((project, index) => (
                                <ProjectCard key={index} {...project} delay={index} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ 
                        padding: '8rem 5vw',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ 
                        maxWidth: '800px', 
                        margin: '0 auto',
                        padding: '5rem',
                        borderRadius: '2rem',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                        <h2 style={{ 
                            fontSize: '3.5rem', 
                            fontWeight: 'bold', 
                            marginBottom: '1.5rem' 
                        }}>
                            Ready to <span className="gradient-text">Showcase</span> Your Work?
                        </h2>
                        <p style={{ 
                            color: 'var(--color-text-muted)', 
                            fontSize: '1.25rem',
                            marginBottom: '3rem',
                        }}>
                            Join thousands of developers who are already building their portfolios and getting recognition
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link to="/auth?mode=signup" style={{
                                    ...primaryButtonStyle,
                                    padding: '1.25rem 3rem',
                                    fontSize: '1.25rem',
                                }}>
                                    <FiUserPlus /> Create Free Account
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                            >
                                <Link to="/discover" style={{
                                    ...secondaryButtonStyle,
                                    padding: '1.25rem 3rem',
                                    fontSize: '1.25rem',
                                }}>
                                    <FiTrendingUp /> Browse Projects
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>
                
                {/* Footer */}
                <footer style={{ 
                    padding: '4rem 5vw',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                    <div style={{ 
                        maxWidth: '1400px', 
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '3rem',
                    }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div className="gradient-bg" style={{ 
                                    width: '3rem', 
                                    height: '3rem', 
                                    borderRadius: '1rem', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                }}>
                                    <FiMonitor style={{ color: 'white', fontSize: '1.5rem' }} />
                                </div>
                                <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }} className="gradient-text">DevShowcase</span>
                            </div>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', maxWidth: '400px' }}>
                                The premier platform for developers to showcase their projects, get feedback, and connect with the community.
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
                            {['Product', 'Company', 'Resources', 'Legal'].map((category, index) => (
                                <div key={index}>
                                    <h4 style={{ 
                                        fontSize: '1.1rem', 
                                        fontWeight: 'bold', 
                                        marginBottom: '1.5rem',
                                        color: 'var(--color-text)',
                                    }}>
                                        {category}
                                    </h4>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {['Link 1', 'Link 2', 'Link 3', 'Link 4'].map((link, linkIndex) => (
                                            <li key={linkIndex} style={{ marginBottom: '0.75rem' }}>
                                                <a href="#" style={{
                                                    color: 'var(--color-text-muted)',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.3s ease',
                                                    cursor: 'pointer',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#667eea'}
                                                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}>
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div style={{ 
                        marginTop: '4rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                    }}>
                        <p style={{ fontSize: '0.9rem' }}>
                            © {new Date().getFullYear()} DevShowcase. Built with ❤ for developers worldwide.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}