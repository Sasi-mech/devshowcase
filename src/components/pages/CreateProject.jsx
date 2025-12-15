// src/components/pages/CreateProject.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; 
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion'; // Added motion import

import { 
    FiChevronLeft, FiChevronRight, FiUpload, FiFileText, 
    FiLink, FiTag, FiImage, FiCode, FiCheckCircle,
    FiHome, FiArrowLeft, FiAlertCircle, FiCloud
} from 'react-icons/fi';

// --- CSS Styles ---
const styles = {
    // Layout
    container: {
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#f1f5f9',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    
    // Header
    header: {
        position: 'sticky',
        top: 0,
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '1rem 2rem',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    backButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        border: '1px solid #475569',
        borderRadius: '0.5rem',
        color: '#f1f5f9',
        textDecoration: 'none',
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#334155',
            borderColor: '#3b82f6',
        },
    },
    pageTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#f1f5f9',
        margin: 0,
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    homeButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        border: '1px solid #475569',
        borderRadius: '0.5rem',
        color: '#f1f5f9',
        textDecoration: 'none',
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#334155',
            borderColor: '#3b82f6',
        },
    },
    
    // Main Content
    mainContent: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem',
    },
    
    // Progress/Step Indicator
    stepProgress: {
        marginBottom: '3rem',
    },
    stepIndicators: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        marginBottom: '2rem',
    },
    stepIndicator: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: 2,
    },
    stepNumber: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '1rem',
        border: '2px solid',
        transition: 'all 0.3s ease',
    },
    stepNumberActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        color: 'white',
    },
    stepNumberCompleted: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        color: 'white',
    },
    stepNumberInactive: {
        backgroundColor: '#334155',
        borderColor: '#475569',
        color: '#94a3b8',
    },
    stepLabel: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#e2e8f0',
        textAlign: 'center',
    },
    stepLabelInactive: {
        color: '#94a3b8',
    },
    progressLine: {
        position: 'absolute',
        top: '20px',
        left: '50px',
        right: '50px',
        height: '2px',
        backgroundColor: '#475569',
        zIndex: 1,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3b82f6',
        transition: 'width 0.3s ease',
        borderRadius: '4px',
    },
    
    // Form Container
    formContainer: {
        backgroundColor: '#1e293b',
        padding: '2.5rem',
        borderRadius: '1rem',
        border: '1px solid #334155',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    
    // Form Elements
    formGrid: {
        display: 'grid',
        gap: '1.5rem',
    },
    fullWidth: {
        gridColumn: '1 / -1',
    },
    label: {
        display: 'block',
        fontWeight: '600',
        marginBottom: '0.75rem',
        fontSize: '1rem',
        color: '#e2e8f0',
    },
    required: {
        color: '#ef4444',
        marginLeft: '0.25rem',
    },
    input: {
        width: '100%',
        padding: '0.875rem',
        borderRadius: '0.5rem',
        backgroundColor: '#0f172a',
        border: '1px solid #475569',
        color: '#f1f5f9',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
        '&:focus': {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        },
        '&::placeholder': {
            color: '#64748b',
        },
    },
    textarea: {
        width: '100%',
        padding: '0.875rem',
        borderRadius: '0.5rem',
        backgroundColor: '#0f172a',
        border: '1px solid #475569',
        color: '#f1f5f9',
        fontSize: '1rem',
        minHeight: '120px',
        resize: 'vertical',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
        '&:focus': {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        },
        '&::placeholder': {
            color: '#64748b',
        },
    },
    slugPreview: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        marginTop: '0.5rem',
        fontFamily: 'monospace',
        backgroundColor: '#0f172a',
        padding: '0.75rem',
        borderRadius: '0.375rem',
        border: '1px solid #334155',
    },
    
    // File Upload
    uploadSection: {
        border: '1px solid #475569',
        padding: '1.75rem',
        borderRadius: '0.75rem',
        backgroundColor: '#0f172a',
        marginBottom: '1.5rem',
    },
    uploadHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontWeight: '600',
        marginBottom: '1rem',
        fontSize: '1.1rem',
        color: '#e2e8f0',
    },
    fileInput: {
        width: '100%',
        padding: '1.25rem',
        borderRadius: '0.5rem',
        backgroundColor: '#1e293b',
        border: '2px dashed #475569',
        color: '#f1f5f9',
        cursor: 'pointer',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
        '&:hover': {
            borderColor: '#3b82f6',
            backgroundColor: '#1a2536',
        },
    },
    fileInfo: {
        color: '#3b82f6',
        marginTop: '1rem',
        fontSize: '0.95rem',
    },
    helpText: {
        color: '#94a3b8',
        fontSize: '0.9rem',
        marginTop: '0.75rem',
        lineHeight: '1.5',
    },
    
    // Tags
    tagsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginTop: '0.75rem',
        marginBottom: '0.5rem',
    },
    tagChip: {
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '1rem',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    tagRemoveButton: {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: 0,
        fontSize: '1.1rem',
        lineHeight: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
    },
    
    // Review Section
    reviewSection: {
        padding: '2rem',
        backgroundColor: '#0f172a',
        borderRadius: '1rem',
        border: '1px solid #334155',
    },
    reviewHeader: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#f1f5f9',
    },
    reviewCard: {
        border: '1px solid #475569',
        padding: '1.75rem',
        borderRadius: '0.75rem',
        marginBottom: '1.5rem',
        backgroundColor: '#1e293b',
    },
    projectTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#f1f5f9',
    },
    projectDescription: {
        color: '#cbd5e1',
        marginBottom: '1.5rem',
        lineHeight: '1.6',
        fontSize: '1.05rem',
    },
    projectLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
        fontSize: '1rem',
        color: '#cbd5e1',
    },
    link: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: '500',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    
    // Buttons
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '2.5rem',
        gap: '1rem',
    },
    primaryButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '0.5rem',
        border: 'none',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        transition: 'all 0.2s ease',
        minWidth: '160px',
        justifyContent: 'center',
        '&:hover:not(:disabled)': {
            backgroundColor: '#2563eb',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            transform: 'none',
        },
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        color: '#f1f5f9',
        padding: '1rem 2rem',
        borderRadius: '0.5rem',
        border: '1px solid #475569',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        transition: 'all 0.2s ease',
        minWidth: '160px',
        justifyContent: 'center',
        '&:hover:not(:disabled)': {
            backgroundColor: '#334155',
            borderColor: '#3b82f6',
            transform: 'translateY(-2px)',
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
        },
    },
    
    // Alerts & Notifications
    errorAlert: {
        color: '#ef4444',
        padding: '1.25rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
    },
    errorIcon: {
        fontSize: '1.25rem',
        flexShrink: 0,
        marginTop: '0.125rem',
    },
    errorText: {
        flex: 1,
    },
    warningAlert: {
        color: '#f59e0b',
        padding: '1.25rem',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
    },
    infoAlert: {
        color: '#3b82f6',
        padding: '1.25rem',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: '1.5rem',
        color: '#94a3b8',
        fontSize: '1rem',
    },
    progressBar: {
        width: '100%',
        height: '8px',
        backgroundColor: '#334155',
        borderRadius: '4px',
        marginTop: '1.5rem',
        overflow: 'hidden',
        marginBottom: '0.5rem',
    },
    // The progressFill object is kept here for reference, but spread operator usage 
    // will be replaced in JSX to avoid object literal warning.
    progressFill: {
        height: '100%',
        backgroundColor: '#3b82f6',
        transition: 'width 0.3s ease',
        borderRadius: '4px',
    },
    progressPercentage: {
        textAlign: 'right',
        fontSize: '0.85rem',
        color: '#94a3b8',
        marginTop: '0.25rem',
    },
    
    // Footer
    footer: {
        textAlign: 'center',
        padding: '2rem 1rem',
        color: '#94a3b8',
        fontSize: '0.9rem',
        borderTop: '1px solid #334155',
        marginTop: '3rem',
    },
};

// Helper function to create a URL-friendly slug
const createSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Step Indicator Component
const StepIndicator = ({ step, label, isActive, isCompleted }) => {
    return (
        <div style={styles.stepIndicator}>
            <div style={{
                ...styles.stepNumber,
                ...(isCompleted ? styles.stepNumberCompleted : 
                     isActive ? styles.stepNumberActive : 
                     styles.stepNumberInactive)
            }}>
                {isCompleted ? <FiCheckCircle size={20} /> : step}
            </div>
            <span style={{
                ...styles.stepLabel,
                ...(!isActive && !isCompleted ? styles.stepLabelInactive : {})
            }}>
                {label}
            </span>
        </div>
    );
};

// Main Create Project Component
export default function CreateProject() {
    const { session } = useAuth();
    const navigate = useNavigate();
    
    // State Management
    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState({
        title: '',
        slug: '',
        description: '',
        github_url: '',
        live_url: '',
        tags: [],
        status: 'draft',
        image_files: [],
        zip_file: null,
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [tagInput, setTagInput] = useState('');
    // --- FIX 1: ADD isSubmitting FLAG ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    // ------------------------------------
    const [bucketsStatus, setBucketsStatus] = useState({
        'project-assets': 'checking',
        'project-code': 'checking'
    });

    // Check if buckets exist on mount
    useEffect(() => {
        const checkBuckets = async () => {
            console.log('🔍 Checking Supabase buckets...');
            
            const bucketsToCheck = ['project-assets', 'project-code'];
            
            for (const bucketName of bucketsToCheck) {
                try {
                    const { data, error } = await supabase.storage
                        .from(bucketName)
                        .list();
                    
                    if (error) {
                        console.error(`❌ ${bucketName} bucket error:`, error);
                        setBucketsStatus(prev => ({
                            ...prev,
                            [bucketName]: 'missing'
                        }));
                    } else {
                        console.log(`✅ ${bucketName} bucket exists`);
                        setBucketsStatus(prev => ({
                            ...prev,
                            [bucketName]: 'exists'
                        }));
                    }
                } catch (err) {
                    console.error(`💥 Error checking ${bucketName}:`, err);
                    setBucketsStatus(prev => ({
                        ...prev,
                        [bucketName]: 'error'
                    }));
                }
            }
        };
        
        if (session) {
            checkBuckets();
        }
    }, [session]);

    // Auto-generate slug whenever title changes
    useEffect(() => {
        if (form.title) {
            setForm(prev => ({ ...prev, slug: createSlug(prev.title) }));
        }
    }, [form.title]);

    // --- FIX 1: MODIFIED AUTH REDIRECTION useEffect ---
    useEffect(() => {
        // Prevent redirection if the user is currently submitting the form
        if (isSubmitting) return;

        if (!session) {
            navigate('/login', { 
                state: { 
                    from: '/create-project',
                    message: 'Please sign in to create a project'
                } 
            });
        }
    }, [session, navigate, isSubmitting]); // Added isSubmitting to dependencies
    // --------------------------------------------------

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.trim();
            if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
                setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                setTagInput('');
            }
        }
    };

    const removeTag = (index) => {
        setForm(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'image_files') {
            const validFiles = Array.from(files).slice(0, 5);
            setForm(prev => ({ ...prev, image_files: validFiles }));
        } else if (name === 'zip_file') {
            setForm(prev => ({ ...prev, zip_file: files[0] }));
        }
    };

    const nextStep = () => {
        setError(null);
        
        if (currentStep === 1) {
            if (!form.title.trim()) {
                setError("Please enter a project title.");
                return;
            }
            if (form.title.length < 3) {
                setError("Title must be at least 3 characters long.");
                return;
            }
            if (!form.description.trim()) {
                setError("Please enter a project description.");
                return;
            }
            if (!form.github_url.trim()) {
                setError("Please enter a GitHub URL.");
                return;
            }
            if (!form.github_url.startsWith('https://github.com/')) {
                setError("Please enter a valid GitHub URL (https://github.com/...).");
                return;
            }
        }
        
        if (currentStep === 2) {
            if (form.image_files.length === 0) {
                const proceed = window.confirm(
                    "You haven't uploaded any screenshots. Would you like to continue anyway?\n\n" +
                    "You can add screenshots later by editing your project."
                );
                if (!proceed) {
                    return;
                }
            }
        }
        
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        setError(null);
    };

    // Handle file upload with bucket verification
    const uploadFileToBucket = async (bucketName, file, filePath) => {
        try {
            console.log(`📤 Uploading to ${bucketName}:`, file.name);
            
            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error(`❌ Upload failed to ${bucketName}:`, error);
                throw error;
            }

            console.log(`✅ Upload successful to ${bucketName}`);
            return data;
        } catch (uploadError) {
            console.error(`💥 Upload error for ${bucketName}:`, uploadError);
            throw uploadError;
        }
    };

    // Main submit function
    const handleSubmit = async (publish = false) => {
        console.log('🚀 Starting project creation...');
        
        if (!session) {
            setError("You must be logged in to create a project.");
            return;
        }
        
        setLoading(true);
        setError(null);
        setUploadProgress(0);
        // --- FIX 1: SET FLAG ---
        setIsSubmitting(true);
        // -----------------------
        
        try {
            const user_id = session.user.id;
            const project_slug = form.slug || createSlug(form.title);
            
            if (!project_slug) {
                throw new Error("Please provide a valid project title.");
            }

            let imageUrls = [];
            let zipUrl = null;

            // 1. Upload images if bucket exists
            if (form.image_files.length > 0) {
                if (bucketsStatus['project-assets'] === 'exists') {
                    const totalImages = form.image_files.length;
                    
                    for (let i = 0; i < form.image_files.length; i++) {
                        const file = form.image_files[i];
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${project_slug}_${i}_${Date.now()}.${fileExt}`;
                        const filePath = `${user_id}/${fileName}`;
                        
                        try {
                            const { data } = await uploadFileToBucket('project-assets', file, filePath);
                            
                            // Get public URL
                            const { data: { publicUrl } } = supabase.storage
                                .from('project-assets')
                                .getPublicUrl(filePath);
                            
                            imageUrls.push(publicUrl);
                            console.log(`✅ Image ${i+1} uploaded:`, publicUrl);
                            
                        } catch (uploadErr) {
                            console.warn(`⚠ Image upload failed ${i+1}, using placeholder`);
                            imageUrls.push(`https://via.placeholder.com/600x400/3b82f6/ffffff?text=${encodeURIComponent(form.title)}+${i+1}`);
                        }
                        
                        // Update progress
                        const progress = Math.round(((i + 1) / totalImages) * 50);
                        setUploadProgress(progress);
                    }
                } else {
                    console.warn('⚠ project-assets bucket not available, using placeholders');
                    for (let i = 0; i < form.image_files.length; i++) {
                        imageUrls.push(`https://via.placeholder.com/600x400/3b82f6/ffffff?text=${encodeURIComponent(form.title)}+${i+1}`);
                    }
                }
            }
            
            // 2. Upload ZIP if bucket exists
            if (form.zip_file && bucketsStatus['project-code'] === 'exists') {
                try {
                    const fileExt = 'zip';
                    const fileName = `${project_slug}_code_${Date.now()}.${fileExt}`;
                    const filePath = `${user_id}/${fileName}`;
                    
                    const { data } = await uploadFileToBucket('project-code', form.zip_file, filePath);
                    
                    const { data: { publicUrl } } = supabase.storage
                        .from('project-code')
                        .getPublicUrl(filePath);
                    
                    zipUrl = publicUrl;
                    console.log('✅ ZIP uploaded:', publicUrl);
                    
                } catch (zipErr) {
                    console.warn('⚠ ZIP upload failed:', zipErr);
                    // Continue without ZIP URL
                }
            }
            
            setUploadProgress(75);

            // 3. Insert project data
            const projectData = {
                user_id: user_id,
                title: form.title,
                slug: project_slug,
                description: form.description,
                github_url: form.github_url,
                live_url: form.live_url || null,
                tags: form.tags,
                status: publish ? 'published' : 'draft',
                image_urls: imageUrls.length > 0 ? imageUrls : [
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'
                ],
                zip_url: zipUrl,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            console.log('💾 Saving project to database:', projectData);

            const { data, error: insertError } = await supabase
                .from('projects')
                .insert([projectData])
                .select();

            if (insertError) {
                console.error('❌ Database error:', insertError);
                
                // Try simplified insert
                const simplifiedData = {
                    user_id: user_id,
                    title: form.title,
                    slug: project_slug,
                    description: form.description,
                    github_url: form.github_url,
                    tags: form.tags,
                    status: publish ? 'published' : 'draft',
                    created_at: new Date().toISOString(),
                };
                
                const { data: simpleData, error: simpleError } = await supabase
                    .from('projects')
                    .insert([simplifiedData])
                    .select();
                    
                if (simpleError) {
                    throw new Error(`Database error: ${simpleError.message}`);
                }
            }

            setUploadProgress(100);
            
            // --- FIX 1 & 2: REMOVED SETTIMEOUT AND NAVIGATE DIRECTLY ---
            // Success
            const targetPath = publish 
                ? `/project/${project_slug}`
                : '/dashboard';
                
            alert(`✅ Project ${publish ? 'published' : 'saved as draft'} successfully!`);
            navigate(targetPath);
            // -----------------------------------------------------------

        } catch (err) {
            console.error('💥 Submission error:', err);
            setError(`Failed to create project: ${err.message}`);
        } finally {
            setLoading(false);
            // --- FIX 1: CLEAR FLAG LAST ---
            setIsSubmitting(false); 
            // ------------------------------
        }
    };

    // Render bucket status indicator
    const renderBucketStatus = () => {
        if (currentStep === 2 || currentStep === 3) {
            const missingBuckets = Object.entries(bucketsStatus)
                .filter(([_, status]) => status === 'missing')
                .map(([name]) => name);
            
            if (missingBuckets.length > 0) {
                return (
                    <div style={styles.warningAlert}>
                        <FiAlertCircle size={20} />
                        <div>
                            <strong>Storage Notice:</strong> The following buckets are missing: {missingBuckets.join(', ')}
                            <br />
                            <small>Files will be saved as placeholders. Create buckets in Supabase Storage for full functionality.</small>
                        </div>
                    </div>
                );
            } else if (Object.values(bucketsStatus).every(status => status === 'exists')) {
                return (
                    <div style={styles.infoAlert}>
                        <FiCloud size={20} />
                        <div>
                            <strong>Storage Ready:</strong> All buckets are available for file uploads.
                        </div>
                    </div>
                );
            }
        }
        return null;
    };

    // Step 1: Project Details
    const renderStepOne = () => (
        <div style={styles.formGrid}>
            <div style={styles.fullWidth}>
                <label style={styles.label}>
                    Project Title<span style={styles.required}>*</span>
                </label>
                <input 
                    type="text" 
                    name="title" 
                    value={form.title} 
                    onChange={handleChange} 
                    placeholder="e.g., CodeCollab: Real-time Code Editor" 
                    style={styles.input}
                    required
                />
                {form.title && (
                    <div style={styles.slugPreview}>
                        Your project URL will be: /project/{form.slug}
                    </div>
                )}
            </div>
            
            <div style={styles.fullWidth}>
                <label style={styles.label}>
                    Description<span style={styles.required}>*</span>
                </label>
                <textarea 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange} 
                    placeholder="Describe your project. What does it do? What technologies did you use?" 
                    rows="4"
                    style={styles.textarea}
                    required
                />
                {/* --- FIX 2: Replaced <p> with <div> --- */}
                <div style={styles.helpText}>
                    A good description helps others understand your project quickly.
                </div>
                {/* -------------------------------------- */}
            </div>

            <div>
                <label style={styles.label}>
                    GitHub Repository<span style={styles.required}>*</span>
                </label>
                <input 
                    type="url" 
                    name="github_url" 
                    value={form.github_url} 
                    onChange={handleChange} 
                    placeholder="https://github.com/username/project" 
                    style={styles.input}
                    required
                />
            </div>
            
            <div>
                <label style={styles.label}>Live Demo URL (Optional)</label>
                <input 
                    type="url" 
                    name="live_url" 
                    value={form.live_url} 
                    onChange={handleChange} 
                    placeholder="https://demo.example.com" 
                    style={styles.input}
                />
            </div>

            <div style={styles.fullWidth}>
                <label style={styles.label}>
                    <FiTag style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Technologies & Tags
                </label>
                
                {form.tags.length > 0 && (
                    <div style={styles.tagsContainer}>
                        {form.tags.map((tag, index) => (
                            <div key={index} style={styles.tagChip}>
                                {tag}
                                <button 
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    style={styles.tagRemoveButton}
                                    title="Remove tag"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="React, Node.js, TypeScript... (press Enter or comma to add)"
                    style={styles.input}
                />
                {/* --- FIX 2: Replaced <p> with <div> --- */}
                <div style={styles.helpText}>
                    Add up to 10 tags describing your project's technologies and features.
                </div>
                {/* -------------------------------------- */}
            </div>
        </div>
    );

    // Step 2: Upload Assets
    const renderStepTwo = () => (
        <div>
            {/* Screenshots */}
            <div style={styles.uploadSection}>
                <div style={styles.uploadHeader}>
                    <FiImage size={22} />
                    Screenshots
                </div>
                {/* --- FIX 2: Replaced <p> with <div> --- */}
                <div style={styles.helpText}>
                    Upload up to 5 screenshots showcasing your project (max 5MB each).
                    Supported formats: JPG, PNG, GIF, WebP.
                </div>
                {/* -------------------------------------- */}
                <input 
                    type="file" 
                    name="image_files" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={styles.fileInput}
                />
                
                {form.image_files.length > 0 && (
                    <div style={styles.fileInfo}>
                        {/* --- FIX 2: Replaced <p> with <div> inside fileInfo --- */}
                        <div><strong>{form.image_files.length} screenshot(s) selected:</strong></div>
                        {/* ---------------------------------------------------- */}
                        <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0 }}>
                            {form.image_files.map((file, index) => (
                                <li key={index} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    📷 {file.name} <span style={{ color: '#94a3b8' }}>({Math.round(file.size / 1024)} KB)</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Source Code */}
            <div style={styles.uploadSection}>
                <div style={styles.uploadHeader}>
                    <FiCode size={22} />
                    Source Code (Optional)
                </div>
                {/* --- FIX 2: Replaced <p> with <div> --- */}
                <div style={styles.helpText}>
                    Upload a ZIP file of your source code (max 50MB) for others to explore or contribute.
                </div>
                {/* -------------------------------------- */}
                <input 
                    type="file" 
                    name="zip_file" 
                    accept=".zip" 
                    onChange={handleFileChange}
                    style={styles.fileInput}
                />
                
                {form.zip_file && (
                    <div style={styles.fileInfo}>
                        {/* --- FIX 2: Replaced <p> with <div> inside fileInfo --- */}
                        <div><strong>File selected:</strong> {form.zip_file.name}</div>
                        {/* ---------------------------------------------------- */}
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            Size: {(form.zip_file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
    
    // Step 3: Review & Publish
    const renderStepThree = () => (
        <div style={styles.reviewSection}>
            <h3 style={styles.reviewHeader}>Review Your Project</h3>
            
            <div style={styles.reviewCard}>
                <h4 style={styles.projectTitle}>{form.title}</h4>
                <p style={styles.projectDescription}>{form.description}</p>
                
                <div style={styles.projectLink}>
                    <FiLink size={18} />
                    <span>GitHub:</span>
                    <a 
                        href={form.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={styles.link}
                    >
                        {form.github_url}
                    </a>
                </div>
                
                {form.live_url && (
                    <div style={styles.projectLink}>
                        <FiLink size={18} />
                        <span>Live Demo:</span>
                        <a 
                            href={form.live_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={styles.link}
                        >
                            {form.live_url}
                        </a>
                    </div>
                )}
                
                {form.tags.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '1.05rem' }}>Technologies:</div>
                        <div style={styles.tagsContainer}>
                            {form.tags.map((tag, index) => (
                                <span key={index} style={styles.tagChip}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #475569' }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '1.05rem' }}>Uploaded Assets:</div>
                    <div style={{ color: '#94a3b8', lineHeight: '1.8' }}>
                        <div>📸 <strong>{form.image_files.length}</strong> screenshot(s)</div>
                        <div>💾 <strong>{form.zip_file ? 'Source code included' : 'No source code'}</strong></div>
                    </div>
                </div>
            </div>
            
            <div style={{ 
                backgroundColor: '#1e293b', 
                padding: '1.5rem', 
                borderRadius: '0.75rem',
                border: '1px solid #334155',
                marginTop: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        backgroundColor: '#3b82f6', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '0.9rem'
                    }}>
                        i
                    </div>
                    <div>
                        <p style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>
                            <strong>Choose how to save your project:</strong>
                        </p>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            • <strong>Save as Draft:</strong> Keep it private for now. Only you can see it.<br />
                            • <strong>Publish:</strong> Make it public on the Explore page for everyone to see.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Calculate progress line width
    const progressWidth = ((currentStep - 1) / 2) * 100;

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <button 
                        onClick={() => navigate(-1)}
                        style={styles.backButton}
                    >
                        <FiArrowLeft />
                        Back
                    </button>
                    <h1 style={styles.pageTitle}>Create New Project</h1>
                </div>
                
                <div style={styles.headerActions}>
                    <Link to="/" style={styles.homeButton}>
                        <FiHome />
                        Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main style={styles.mainContent}>
                {/* Progress Indicator */}
                <div style={styles.stepProgress}>
                    <div style={styles.stepIndicators}>
                        <div style={styles.progressLine}>
                            {/* --- FIX 3: Progress fill style made explicit to avoid object literal warning --- */}
                            <div style={{ 
                                height: styles.progressFill.height,
                                backgroundColor: styles.progressFill.backgroundColor,
                                transition: styles.progressFill.transition,
                                borderRadius: styles.progressFill.borderRadius,
                                width: `${progressWidth}%` 
                            }} />
                            {/* --------------------------------------------------------------------------------- */}
                        </div>
                        
                        <StepIndicator 
                            step={1} 
                            label="Project Details" 
                            isActive={currentStep === 1}
                            isCompleted={currentStep > 1}
                        />
                        <StepIndicator 
                            step={2} 
                            label="Upload Assets" 
                            isActive={currentStep === 2}
                            isCompleted={currentStep > 2}
                        />
                        <StepIndicator 
                            step={3} 
                            label="Review & Publish" 
                            isActive={currentStep === 3}
                            isCompleted={false}
                        />
                    </div>
                </div>

                {/* Bucket Status */}
                {renderBucketStatus()}

                {/* Error Display */}
                {error && (
                    <div style={styles.errorAlert}>
                        <div style={styles.errorIcon}>⚠</div>
                        <div style={styles.errorText}>{error}</div>
                    </div>
                )}
                
                {/* Progress Bar for Uploads */}
                {loading && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={styles.progressBar}>
                            {/* Using explicit styles again for consistency */}
                            <div style={{ 
                                height: styles.progressFill.height,
                                backgroundColor: styles.progressFill.backgroundColor,
                                transition: styles.progressFill.transition,
                                borderRadius: styles.progressFill.borderRadius,
                                width: `${uploadProgress}%` 
                            }} />
                        </div>
                        <div style={styles.progressPercentage}>{uploadProgress}%</div>
                    </div>
                )}
                
                {/* Form Content by Step */}
                <div style={styles.formContainer}>
                    {currentStep === 1 && renderStepOne()}
                    {currentStep === 2 && renderStepTwo()}
                    {currentStep === 3 && renderStepThree()}
                </div>
                
                {/* Navigation Buttons */}
                <div style={styles.buttonGroup}>
                    {currentStep > 1 ? (
                        <>
                            <button 
                                onClick={prevStep} 
                                style={styles.secondaryButton}
                                disabled={loading}
                            >
                                <FiChevronLeft />
                                Previous Step
                            </button>
                            
                            {currentStep < 3 ? (
                                <button 
                                    onClick={nextStep} 
                                    style={styles.primaryButton}
                                    disabled={loading}
                                >
                                    Continue
                                    <FiChevronRight />
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                                    <button 
                                        onClick={() => handleSubmit(false)} 
                                        style={styles.secondaryButton}
                                        disabled={loading}
                                    >
                                        <FiFileText />
                                        Save as Draft
                                    </button>
                                    <button 
                                        onClick={() => handleSubmit(true)} 
                                        style={styles.primaryButton}
                                        disabled={loading}
                                    >
                                        <FiUpload />
                                        {loading ? 'Publishing...' : 'Publish Project'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <button 
                            onClick={nextStep} 
                            style={{ ...styles.primaryButton, marginLeft: 'auto' }}
                            disabled={loading}
                        >
                            Continue to Assets
                            <FiChevronRight />
                        </button>
                    )}
                </div>
                
                {loading && (
                    <p style={styles.loadingText}>
                        {uploadProgress < 100 ? 'Uploading your project files...' : 'Finalizing your project...'}
                    </p>
                )}
            </main>

            {/* Footer */}
            <footer style={styles.footer}>
                <div>© {new Date().getFullYear()} DevPort. All rights reserved.</div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#64748b' }}>
                    Creating amazing projects, one step at a time.
                </div>
            </footer>
        </div>
    );
}