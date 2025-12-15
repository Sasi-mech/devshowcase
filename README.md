# 🌟 DevShowcase

<div align="center">
  
![DevShowcase Banner](https://via.placeholder.com/1200x400/0f0f19/667eea?text=DevShowcase+-+Showcase+Your+Development+Projects)
A modern platform for developers to showcase their work, discover inspiring projects, and connect with the tech community.

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Animations-Framer_Motion-0055FF?style=for-the-badge)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

[Live Demo](https://devshowcase.app) · [Report Bug](https://github.com/yourusername/devshowcase/issues) · [Request Feature](https://github.com/yourusername/devshowcase/issues)

</div>


## 🎯 Overview

DevShowcase is a *full-stack web application* built for developers to:
- *Showcase* their personal projects with detailed information
- *Discover* trending and inspiring projects from other developers
- *Engage* with the community through voting, comments, and following
- *Track* their project performance and community impact

### 🤔 Why DevShowcase?
- *For Developers*: Build a professional portfolio that speaks to technical audiences
- *For Recruiters*: Discover talented developers through their actual work
- *For Learners*: Find inspiration and learn from real-world projects
- *For Open Source*: Promote your open-source contributions

## ✨ Key Features

### 🎨 *Core Features*
| Feature | Description | Benefits |
|---------|-------------|----------|
| *Project Showcase* | Upload projects with title, description, tags, images, and live demo links | Create comprehensive project portfolios |
| *Interactive Feed* | Browse trending, recent, and featured projects with infinite scroll | Discover what's trending in dev community |
| *Social Engagement* | Vote (like), comment, bookmark, and follow other developers | Build your developer network |
| *User Profiles* | Customizable profiles with stats, bio, social links, and project gallery | Present yourself professionally |
| *Advanced Search* | Search by tech stack, tags, project type, or developer name | Find exactly what you're looking for |

### 📊 *Analytics & Insights*
- *Project Analytics*: Track views, votes, comments, and engagement over time
- *User Statistics*: Monitor your follower growth and project performance
- *Trending Algorithms*: Projects ranked by engagement, recency, and quality
- *Performance Metrics*: Load times, responsiveness, and user engagement metrics

### 🛠 *Developer Experience*
- *Dark/Light Themes*: Choose your preferred viewing mode
- *Real-time Updates*: Live notifications for comments, votes, and follows
- *Responsive Design*: Works perfectly on desktop, tablet, and mobile
- *Keyboard Navigation*: Full keyboard accessibility support
- *Progressive Web App*: Installable and works offline

## 🏗 Architecture
devshowcase/
├── node_modules/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── ... (assets like logos or manifest)
├── src/
│   ├── components/
│   │   ├── AuthPage.jsx           # Handles user sign-in/sign-up forms
│   │   ├── LandingPage.jsx        # The main public landing page
│   │   └── pages/                 # Full-page components (imported in App.jsx)
│   │       ├── AnalyticsPage.jsx
│   │       ├── BookmarksPage.jsx  # Saved and bookmarked projects 
│   │       ├── CreateProject.jsx  # Multi-step creation form (heavily discussed)
│   │       ├── Dashboard.jsx      # basic user info 
│   │       ├── Discover.jsx       # ProjectFeedPage
│   │       ├── Notifications.jsx
│   │       ├── ProjectDetail.jsx  # Individual project view
│   │       ├── Settings.jsx
│   │       └── UserProfile.jsx    # profile of each user 
│   ├── hooks/
│   │   └── useAuth.js             # Defines AuthContext, AuthProvider, and useAuth hook
│   ├── utils/
│   │   ├── helpers.js             # General utility functions (e.g., date formatting)
│   │   └── constants.js           # API endpoints, config values, etc.
│   ├── styles/
│   │   ├── index.css              # Global styles
│   │   └── variables.css          # CSS variables/theme definitions
│   ├── App.css
│   ├── App.jsx                    #complete website routing
│   ├── index.css                  # css for entire website                    
│   ├── main.jsx                   
│   └── supabaseClient.js          # Supabase client initialization (using environment variables),# Environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
├── .gitignore
├── package.json
└── README.md

### *System Architecture*
```

┌─────────────────────────────────────────────────────────────┐
│Client (React App)                                           │
│┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
││  Pages   │  │Components│  │  Hooks   │  │  Utils   │       │
│└──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│Supabase (Backend-as-a-Service)                              │
│┌──────────────────────────────────────────────────────┐     │
││                    PostgreSQL DB                     │     │
││ • profiles • projects • votes • comments • follows   │     │
│└──────────────────────────────────────────────────────┘     │
│┌──────────────────────────────────────────────────────┐     │
││                 Authentication                       │     │
││  • Email/Password  • OAuth (GitHub, Google)          │     │
│└──────────────────────────────────────────────────────┘     │
│┌──────────────────────────────────────────────────────┐     │
││                  Real-time Engine                    │     │
││  • Live subscriptions  • Presence  • Broadcast       │     │
│└──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘

### *Getting Started*
1. *Sign Up*: Create an account with email or OAuth (GitHub/Google)
2. *Complete Profile*: Add your bio, skills, and social links
3. *Add Projects*: Showcase your best work with details and media
4. *Engage*: Vote, comment, and follow to build your network

### *Dashboard Features*


┌─────────────────────────────────────────────────────────────┐
│USER DASHBOARD                                               │
├─────────────────────────────────────────────────────────────┤
│📈 Quick Stats              ⚡ Quick Actions                │
│• Total Projects           • New Project                     │
│• Votes Received          • Explore Feed                     │
│• Comments                • Notifications                    │
│• Followers               • Analytics                        │
├─────────────────────────────────────────────────────────────┤
│🔥 Trending Projects          📅 Recent Activity            │
│• Featured projects       • Recent comments                  │
│• Most voted             • New followers                     │
│• Newest additions       • Project updates                   │
└─────────────────────────────────────────────────────────────┘



### *Project Submission*
1. *Basic Info*: Title, description, and category
2. *Tech Stack*: Tags for languages, frameworks, and tools
3. *Media*: Screenshots, GIFs, or videos
4. *Links*: Live demo, GitHub repository, documentation
5. *Visibility*: Choose public, private, or unlisted

## 💻 Technical Details

### *Tech Stack*
| Layer | Technology | Purpose |
|-------|------------|---------|
| *Frontend* | React 18 | UI framework with modern features |
| *Routing* | React Router 6 | Client-side navigation |
| *State Management* | React Context + Hooks | Global state management |
| *Animations* | Framer Motion | Smooth UI animations |
| *Icons* | React Icons | Consistent iconography |
| *Styling* | CSS-in-JS | Component-scoped styling |
| *Backend* | Supabase | Database, auth, and real-time |
| *Database* | PostgreSQL | Relational data storage |
| *Auth* | Supabase Auth | User authentication |
| *Storage* | Supabase Storage | File uploads and media |
| *Real-time* | Supabase Realtime | Live updates and notifications |

### *Performance Optimizations*
- *Code Splitting*: Route-based code splitting for faster initial load
- *Image Optimization*: Lazy loading and responsive images
- *Memoization*: React.memo and useMemo for preventing re-renders
- *Debounced Search*: Optimized search with debouncing
- *Pagination*: Infinite scroll for large datasets
- *Caching*: React Query for API response caching

### *Security Features*
- *Row Level Security (RLS)*: Database-level access control
- *Input Sanitization*: Protection against XSS attacks
- *CORS Configuration*: Proper cross-origin resource sharing
- *Environment Variables*: Secure credential management
- *HTTPS Enforcement*: All traffic over secure connections
-
🗄 Database Schema

Tables Overview

sql
-- Users and Profiles
profiles (id, username, full_name, avatar_url, bio, website, created_at)

-- Projects
projects (id, title, description, tags[], user_id, is_featured, 
          demo_url, repo_url, created_at, updated_at)

-- Social Interactions
votes (id, user_id, project_id, created_at)
comments (id, user_id, project_id, content, created_at)
follows (id, follower_id, following_id, created_at)
bookmarks (id, user_id, project_id, created_at)

-- Analytics
views (id, user_id, project_id, ip_address, user_agent, created_at)


Row Level Security Policies

sql
-- Example: Projects table policies
CREATE POLICY "Public projects are viewable by everyone"
  ON projects FOR SELECT USING (true);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE USING (auth.uid() = user_id);

🔌 API Reference

Supabase Client Methods

javascript
// Authentication
supabase.auth.signUp({ email, password })
supabase.auth.signIn({ email, password })
supabase.auth.signOut()

// Projects
supabase.from('projects').select('*')
supabase.from('projects').insert([projectData])
supabase.from('projects').update(data).eq('id', projectId)

// Real-time subscriptions
supabase.from('projects').on('INSERT', handleNewProject).subscribe()


Custom Hooks

javascript
// useAuth - Authentication management
const { session, user, signIn, signOut } = useAuth()

// useProjects - Project data management
const { projects, loading, error, createProject } = useProjects()

// useUser - User data management
const { profile, updateProfile, followers } = useUser(userId)
