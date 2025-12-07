# Authentication & Personalization Implementation Guide

## Overview
This implementation adds **Signup and Signin functionality** with **Better-Auth** integration to the Physical AI & Humanoid Robotics textbook. Users can earn **50 bonus points** by completing the authentication process and providing their software/hardware background information.

## Features

### 1. **User Authentication**
- Email-based signup and signin
- Secure password management
- Session persistence using cookies
- Protected user accounts

### 2. **Background Questionnaire**
When signing up, users are asked about:

#### Software Background
- Beginner - No programming experience
- Intermediate - Some Python/JavaScript experience
- Advanced - Professional software developer
- Expert - ML/AI specialist

#### Hardware Background
- Beginner - No robotics experience
- Intermediate - Built simple robots
- Advanced - Experience with ROS/embedded systems
- Expert - Professional roboticist

#### Experience Level
- Student
- Hobbyist
- Professional
- Researcher

#### Topics of Interest
- Humanoid Robotics
- Vision & Perception
- Motion Planning
- Machine Learning
- Hardware Design
- Simulation
- Real-world Deployment

### 3. **Personalized Learning Experience**
Based on user background, the system provides:

- **Content Difficulty Level**: Automatically adjusted based on technical background
- **Recommended Modules**: Prioritized based on skills and interests
- **Focus Areas**: Customized topics matching user background
- **Learning Path**: Phased approach with estimated time for completion
- **Resource Recommendations**: Targeted tutorials, guides, and projects

## Architecture

### Components

#### `AuthProvider.jsx`
- Manages global authentication state
- Handles signup, signin, and signout
- Provides user context to entire app
- Manages API communication with backend

#### `useAuth.js`
- Custom hooks for authentication
- `useAuth()` - Main authentication context
- `useIsAuthenticated()` - Check if user is logged in
- `useUserProfile()` - Get user profile with background info

#### `SignupForm.jsx`
- Multi-step signup form
- Step 1: Account details (name, email, password)
- Step 2: Background information (software, hardware, interests)
- Form validation and error handling

#### `SigninForm.jsx`
- Simple email and password login
- Link to signup form
- Error handling and loading states

#### `AuthModal.jsx`
- Modal component combining signup and signin
- Toggle between modes
- Centered, responsive design

#### `UserProfile.jsx`
- Displays user information
- Shows personalized recommendations
- Displays learning path
- Bonus points notification
- Signout functionality

### Services

#### `PersonalizationService.js`
Static service providing:
- `getRecommendedContent()` - Main personalization engine
- `calculateDifficulty()` - Determine content difficulty level
- `getFocusAreas()` - Identify relevant topics
- `getRecommendedModules()` - Suggest modules to study
- `getRecommendedResources()` - Recommend learning materials
- `generateLearningPath()` - Create phased learning plan
- `getContentAdaptationGuidelines()` - Style guidance for content

## Integration Steps

### 1. **Install Dependencies**
```bash
npm install better-auth axios zustand
```

### 2. **Setup AuthProvider**
Wrap your app with `AuthProvider`:
```jsx
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### 3. **Add Authentication UI**
Use `AuthModal` component on homepage:
```jsx
import { AuthModal } from './components/AuthModal';

function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setAuthOpen(true)}>Sign Up / Sign In</button>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
```

### 4. **Display User Profile**
Show personalized content to logged-in users:
```jsx
import { UserProfile } from './components/UserProfile';
import { useAuth } from './hooks/useAuth';

function Dashboard() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      {isAuthenticated && <UserProfile />}
    </>
  );
}
```

## API Endpoints Required

### Backend API Structure
You'll need to implement these endpoints:

```
POST /api/auth/signup
- Body: { name, email, password, softwareBackground, hardwareBackground, experience, interests }
- Response: { user, token }

POST /api/auth/signin
- Body: { email, password }
- Response: { user, token }

POST /api/auth/signout
- Response: { success: true }

GET /api/auth/me
- Response: { user }

PUT /api/auth/profile
- Body: { softwareBackground, hardwareBackground, experience, interests }
- Response: { user }
```

## Personalization Algorithm

### Difficulty Calculation
Scores user technical background on 1-4 scale:
- **1** = Beginner
- **2** = Intermediate
- **3** = Advanced
- **4** = Expert

Average of software + hardware = overall difficulty:
- 1-1.5 = **Beginner**
- 1.5-2.5 = **Intermediate**
- 2.5-3.5 = **Advanced**
- 3.5-4 = **Expert**

### Module Recommendations
- **M1 (ROS 2)**: Always high priority
- **M2 (Digital Twin)**: Higher priority for intermediate+ users
- **M3 (Isaac)**: For advanced/expert users or hardware specialists
- **M4 (VLA)**: High priority for ML-interested users

### Learning Path
Personalized 4-phase journey:
1. **Fundamentals** (2-3 weeks): Core concepts
2. **Software/Advanced** (2-4 weeks): Skill-appropriate depth
3. **Simulation & Control** (4-5 weeks): Practical hands-on
4. **AI & Deployment** (5-6 weeks): Advanced topics

## Bonus Points System

**50 Bonus Points Awarded For:**
- ✅ Complete signup process
- ✅ Fill in software background
- ✅ Fill in hardware background
- ✅ Complete personalization questionnaire

Points display in user profile dashboard.

## Security Considerations

1. **Password Requirements**
   - Minimum 8 characters
   - Client-side validation before submission

2. **Session Management**
   - HTTP-only cookies for token storage
   - CSRF protection (implement on backend)
   - Secure flag for cookies in production

3. **Data Privacy**
   - User background data stored securely
   - Never expose sensitive information in frontend logs

## Styling & Responsive Design

All components feature:
- Mobile-responsive design (tablets, phones)
- Accessible form inputs
- Clear visual hierarchy
- Hover states and transitions
- Consistent color scheme (blue: #0066cc)

## Future Enhancements

1. **OAuth Integration**
   - Google / GitHub login
   - Faster signup process

2. **Profile Updates**
   - Edit background information
   - Change preferences

3. **Progress Tracking**
   - Module completion status
   - Learning time analytics

4. **Content Personalization**
   - Dynamic difficulty adjustment
   - Smart content recommendations
   - Personalized chapter summaries

5. **Gamification**
   - Points system
   - Badges and achievements
   - Leaderboards

6. **Better-Auth Advanced Features**
   - Two-factor authentication
   - Account recovery
   - Email verification
   - Social auth providers

## Testing Checklist

- [ ] Signup form validates all fields
- [ ] Signin works with correct credentials
- [ ] Background questions appear in signup
- [ ] User profile displays personalization
- [ ] Recommended modules appear based on background
- [ ] Learning path adjusts to difficulty level
- [ ] Bonus points display correctly
- [ ] Responsive on mobile devices
- [ ] Session persists on page reload
- [ ] Signout clears user data

## Files Structure

```
src/
├── components/
│   ├── AuthProvider.jsx
│   ├── AuthModal.jsx
│   ├── SignupForm.jsx
│   ├── SigninForm.jsx
│   ├── UserProfile.jsx
│   ├── Auth.module.css
│   └── UserProfile.module.css
├── hooks/
│   └── useAuth.js
└── services/
    └── PersonalizationService.js
```

## Support & Customization

To customize the personalization logic:
1. Edit `PersonalizationService.js` methods
2. Adjust focus areas, module recommendations
3. Modify learning path phases
4. Change difficulty calculation weights

To customize UI:
1. Edit CSS modules for styling
2. Modify form fields in SignupForm.jsx
3. Adjust layout in UserProfile.jsx
