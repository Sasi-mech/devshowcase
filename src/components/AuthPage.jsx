// src/components/AuthPage.jsx (Enhanced with Stunning Theme - Fixed Icons)
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiMail, FiLock, FiUser, FiCheck, FiAlertCircle,
    FiGithub, FiArrowLeft, FiEye, FiEyeOff,
    FiMessageCircle, FiZap, FiTrendingUp, FiCode,
    FiHeart, FiUsers, FiAward, FiStar
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

// --- Custom CSS for Auth Page ---
const authStyles = `
    @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .auth-gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #f093fb 100%);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 8s ease infinite;
    }
    
    .auth-glass-effect {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .auth-card-hover {
        transition: all 0.3s ease;
    }
    
    .auth-card-hover:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .password-requirements {
        transition: all 0.3s ease;
    }
    
    .social-btn-hover:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
`;

// --- Enhanced Input Styles ---
const InputField = ({ 
    id, label, type, placeholder, value, onChange, 
    required, icon: Icon, error, showPasswordToggle, onTogglePassword 
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '1.5rem' }}
        >
            <label 
                htmlFor={id} 
                style={{ 
                    color: 'var(--color-text)', 
                    fontSize: '0.95rem', 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                }}
            >
                {label}
            </label>
            <div style={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
            }}>
                {Icon && (
                    <div style={{
                        position: 'absolute',
                        left: '1rem',
                        zIndex: 2,
                        color: isFocused ? '#667eea' : 'var(--color-text-muted)',
                        transition: 'color 0.3s ease',
                    }}>
                        <Icon />
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{
                        width: '100%',
                        padding: Icon ? '1rem 1rem 1rem 3rem' : '1rem 1.5rem',
                        borderRadius: '0.75rem',
                        border: error ? '2px solid #ef4444' : isFocused ? '2px solid #667eea' : '1px solid rgba(102, 126, 234, 0.2)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        color: 'var(--color-text)',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                    }}
                />
                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        style={{
                            position: 'absolute',
                            right: '1rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            transition: 'color 0.3s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#667eea'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                    >
                        {type === 'password' ? <FiEyeOff /> : <FiEye />}
                    </button>
                )}
            </div>
            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#ef4444',
                        fontSize: '0.85rem',
                        marginTop: '0.5rem',
                    }}
                >
                    <FiAlertCircle /> {error}
                </motion.div>
            )}
        </motion.div>
    );
};

// --- Enhanced Social Button ---
const SocialButton = ({ service, icon: Icon, color, onClick, iconColor }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            borderRadius: '0.75rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${color}20`,
            color: 'var(--color-text)',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            flex: 1,
            gap: '0.75rem',
        }}
        className="social-btn-hover"
    >
        <Icon style={{ color: iconColor, fontSize: '1.25rem' }} />
        <span>{service}</span>
    </motion.button>
);

// --- Password Strength Indicator ---
const PasswordStrength = ({ password }) => {
    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return strength;
    };

    const strength = getStrength(password);
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

    return (
        <div style={{ marginTop: '0.5rem' }}>
            <div style={{ 
                display: 'flex', 
                gap: '0.25rem', 
                marginBottom: '0.5rem',
                height: '4px',
            }}>
                {[1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        style={{
                            flex: 1,
                            height: '100%',
                            borderRadius: '2px',
                            background: index <= strength ? strengthColors[strength] : 'rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)',
            }}>
                <span>Password Strength:</span>
                <span style={{ color: strengthColors[strength], fontWeight: '600' }}>
                    {strengthLabels[strength]}
                </span>
            </div>
        </div>
    );
};

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    
    // --- MODE & INPUT STATE ---
    const [isSignUp, setIsSignUp] = useState(queryParams.get('mode') === 'signup');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setIsSignUp(queryParams.get('mode') === 'signup');
    }, [location.search]);

    const resetFormState = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setSuccessMessage('');
    };

    const toggleMode = (e) => {
        if (e) e.preventDefault();
        setIsSignUp(!isSignUp);
        resetFormState();
    };

    const validateForm = () => {
        if (!email || !password) {
            setError('Email and Password are required.');
            return false;
        }
        if (isSignUp) {
            if (!username) {
                setError('Username is required.');
                return false;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return false;
            }
            if (password.length < 8) {
                setError('Password must be at least 8 characters.');
                return false;
            }
        }
        return true;
    };

    const handleSocialLogin = async (provider) => {
        setIsLoading(true);
        setError('');
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
                scopes: provider === 'github' ? 'repo user' : undefined,
            },
        });

        if (error) {
            setError(`Social login failed: ${error.message}`);
        }
        setIsLoading(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        if (!validateForm()) return;
        
        setIsLoading(true);

        try {
            if (isSignUp) {
                const { data, error: signupError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { 
                        data: { 
                            username: username,
                            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                        } 
                    }
                });
                
                if (signupError) throw signupError;

                setSuccessMessage(`Account created successfully! Please check ${email} for a confirmation link.`);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
                
            } else {
                const { data, error: signinError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signinError) throw signinError;

                setSuccessMessage('Welcome back! Redirecting to dashboard...');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            }
        } catch (authError) {
            setError(`Authentication failed: ${authError.message || 'Check your credentials.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const buttonText = isSignUp ? "Create Account" : "Sign In";
    const title = isSignUp ? "Join DevShowcase" : "Welcome Back";
    const subtitle = isSignUp ? "Create your account and start showcasing your projects" : "Sign in to your account to continue";

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '1rem',
            background: 'var(--color-background-dark)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Add CSS styles */}
            <style>{authStyles}</style>
            
            {/* Animated background elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                animation: 'float 20s ease-in-out infinite',
            }} />
            
            <div style={{
                position: 'absolute',
                bottom: '30%',
                right: '10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)',
                animation: 'float 25s ease-in-out infinite',
                animationDelay: '2s',
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="auth-glass-effect auth-card-hover"
                style={{ 
                    maxWidth: '500px', 
                    width: '100%', 
                    padding: '3rem', 
                    borderRadius: '1.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    zIndex: 10,
                    position: 'relative',
                }}
            >
                {/* Back to Home */}
                <motion.div
                    whileHover={{ x: -5 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <Link 
                        to="/" 
                        style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--color-text-muted)',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                        }}
                    >
                        <FiArrowLeft /> Back to Home
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', marginBottom: '2.5rem' }}
                >
                    <h1 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 'bold', 
                        marginBottom: '0.5rem',
                    }}>
                        <span className="auth-gradient-text">{title}</span>
                    </h1>
                    <p style={{ 
                        color: 'var(--color-text-muted)', 
                        fontSize: '1rem',
                    }}>{subtitle}</p>
                </motion.div>

                {/* Social Login Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}
                >
                    <SocialButton 
                        service="GitHub" 
                        icon={FiGithub} 
                        color="#333"
                        iconColor="#ffffff"
                        onClick={() => handleSocialLogin('github')}
                    />
                    <SocialButton 
                        service="Google" 
                        icon={FcGoogle} 
                        color="#DB4437"
                        iconColor="#DB4437"
                        onClick={() => handleSocialLogin('google')}
                    />
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        margin: '2rem 0',
                        position: 'relative',
                    }}
                >
                    <div style={{ 
                        flexGrow: 1, 
                        height: '1px', 
                        background: 'linear-gradient(to right, transparent, rgba(102, 126, 234, 0.3), transparent)' 
                    }}></div>
                    <span style={{ 
                        margin: '0 1rem', 
                        color: 'var(--color-text-muted)', 
                        fontSize: '0.9rem',
                        background: 'var(--color-background-dark)',
                        padding: '0 1rem',
                    }}>or continue with email</span>
                    <div style={{ 
                        flexGrow: 1, 
                        height: '1px', 
                        background: 'linear-gradient(to right, transparent, rgba(102, 126, 234, 0.3), transparent)' 
                    }}></div>
                </motion.div>

                {/* Messages */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                color: '#ef4444',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                marginBottom: '1.5rem',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                            }}
                        >
                            <FiAlertCircle style={{ fontSize: '1.25rem' }} />
                            <span style={{ fontSize: '0.95rem' }}>{error}</span>
                        </motion.div>
                    )}

                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                color: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                marginBottom: '1.5rem',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                        >
                            <FiCheck style={{ fontSize: '1.25rem' }} />
                            <span style={{ fontSize: '0.95rem' }}>{successMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Authentication Form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    onSubmit={handleFormSubmit}
                    style={{ display: 'flex', flexDirection: 'column' }}
                >
                    {isSignUp && (
                        <InputField
                            id="username"
                            label="Username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required={isSignUp}
                            icon={FiUser}
                        />
                    )}

                    <InputField
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        icon={FiMail}
                    />

                    <InputField
                        id="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        icon={FiLock}
                        showPasswordToggle
                        onTogglePassword={() => setShowPassword(!showPassword)}
                    />

                    {isSignUp && (
                        <>
                            <PasswordStrength password={password} />
                            
                            <InputField
                                id="confirmPassword"
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required={isSignUp}
                                icon={FiLock}
                                showPasswordToggle
                                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </>
                    )}

                    {!isSignUp && (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            margin: '1rem 0 1.5rem',
                            fontSize: '0.95rem',
                        }}>
                            <label style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                cursor: 'pointer',
                                color: 'var(--color-text-muted)',
                            }}>
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe} 
                                    onChange={(e) => setRememberMe(e.target.checked)} 
                                    style={{ 
                                        width: '1.1rem',
                                        height: '1.1rem',
                                        borderRadius: '0.25rem',
                                        accentColor: '#667eea',
                                        cursor: 'pointer',
                                    }} 
                                />
                                <span>Remember me</span>
                            </label>
                            <Link 
                                to="/forgot-password" 
                                style={{ 
                                    color: '#667eea', 
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        style={{
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            marginTop: '0.5rem',
                            opacity: isLoading ? 0.7 : 1,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {isLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        width: '1.25rem',
                                        height: '1.25rem',
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        borderTopColor: 'white',
                                        borderRadius: '50%',
                                    }}
                                />
                                Processing...
                            </div>
                        ) : (
                            buttonText
                        )}
                    </motion.button>
                </motion.form>

                {/* Form Switch */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    style={{ 
                        marginTop: '2rem', 
                        textAlign: 'center',
                        fontSize: '0.95rem', 
                        color: 'var(--color-text-muted)',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {isSignUp ? (
                        <p>
                            Already have an account?{' '}
                            <a 
                                href="#" 
                                onClick={toggleMode}
                                style={{ 
                                    color: '#667eea', 
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    marginLeft: '0.5rem',
                                }}
                            >
                                Sign In
                            </a>
                        </p>
                    ) : (
                        <p>
                            Don't have an account?{' '}
                            <a 
                                href="#" 
                                onClick={toggleMode}
                                style={{ 
                                    color: '#667eea', 
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    marginLeft: '0.5rem',
                                }}
                            >
                                Create Account
                            </a>
                        </p>
                    )}
                    
                    {/* Terms & Privacy */}
                    {isSignUp && (
                        <p style={{ fontSize: '0.85rem', marginTop: '1rem', opacity: 0.7 }}>
                            By creating an account, you agree to our{' '}
                            <Link to="/terms" style={{ color: '#667eea', textDecoration: 'none' }}>Terms</Link>{' '}
                            and{' '}
                            <Link to="/privacy" style={{ color: '#667eea', textDecoration: 'none' }}>Privacy Policy</Link>
                        </p>
                    )}
                </motion.div>
            </motion.div>

            {/* Decorative floating elements */}
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    bottom: '5%',
                    left: '5%',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    opacity: 0.5,
                }}
            >
                <FiCode /> Built for developers
            </motion.div>
            
            <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{
                    position: 'absolute',
                    top: '10%',
                    right: '5%',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    opacity: 0.5,
                }}
            >
                <FiUsers /> Join 10k+ developers
            </motion.div>
        </div>
    );
};

export default AuthPage;