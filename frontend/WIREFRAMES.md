# JobPortal AI - Sign In Page Design

## Implemented Design: Centered Card Layout

### Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [Gradient Background]                    │
│                                                             │
│                   ┌─────────────────┐                       │
│                   │   [Logo Icon]   │                       │
│                   └─────────────────┘                       │
│                                                             │
│                    JobPortal AI                             │
│          Find your dream job with AI-powered                │
│                  recommendations                            │
│                                                             │
│    ┌───────────────────────────────────────────────┐       │
│    │                                               │       │
│    │           Welcome Back                        │       │
│    │    Sign in to continue to your account        │       │
│    │                                               │       │
│    │   ┌─────────────────────────────────────┐    │       │
│    │   │  [G]  Continue with Google          │    │       │
│    │   └─────────────────────────────────────┘    │       │
│    │                                               │       │
│    │   ┌─────────────────────────────────────┐    │       │
│    │   │  [in] Continue with LinkedIn        │    │       │
│    │   └─────────────────────────────────────┘    │       │
│    │                                               │       │
│    │              ─── OR ───                       │       │
│    │                                               │       │
│    │   Email Address *                             │       │
│    │   ┌─────────────────────────────────────┐    │       │
│    │   │ you@example.com                     │    │       │
│    │   └─────────────────────────────────────┘    │       │
│    │                                               │       │
│    │   Password *                                  │       │
│    │   ┌─────────────────────────────────────┐    │       │
│    │   │ ••••••••••••               [eye]   │    │       │
│    │   └─────────────────────────────────────┘    │       │
│    │                                               │       │
│    │   [ ] Remember me      Forgot password?      │       │
│    │                                               │       │
│    │   ┌─────────────────────────────────────┐    │       │
│    │   │          Sign In                    │    │       │
│    │   └─────────────────────────────────────┘    │       │
│    │                                               │       │
│    │   ─────────────────────────────────────────  │       │
│    │   Don't have an account? Sign Up             │       │
│    │                                               │       │
│    └───────────────────────────────────────────────┘       │
│                                                             │
│           © 2025 JobPortal AI. All rights reserved.        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Design Features

### User Experience
- Clean and uncluttered interface
- Reduces cognitive load
- Clear visual hierarchy
- Familiar pattern for users

### Accessibility
- High contrast ratios
- Clear focus indicators
- Screen reader friendly
- Keyboard navigable

### Responsive Design
- Works on all screen sizes
- Mobile-first approach
- Touch-friendly buttons
- Optimal spacing

### Professional Appearance
- Modern gradient design
- Consistent branding
- Premium feel
- Trust-building layout

---

## Responsive Behavior

### Desktop (Above 768px)
- Card width: 440px
- Centered layout
- Full gradient background
- Comfortable spacing

### Tablet (481px to 768px)
- Card width: 90%
- Adjusted padding
- Responsive font sizes
- Touch-optimized buttons

### Mobile (Below 480px)
- Full-width card
- Compact spacing
- Stacked elements
- Larger touch targets (44px minimum)

---

## Component Features

### Social Authentication
- Google OAuth: One-click sign-in
- LinkedIn OAuth: Professional network integration
- Clear provider branding
- Secure OAuth 2.0 flow

### Form Fields
- Email: Validation with error messages
- Password: Toggle visibility, secure input
- Remember Me: Persistent login option
- Forgot Password: Recovery flow link

### Accessibility Features
- ARIA labels on all interactive elements
- Error announcements for screen readers
- Keyboard navigation support
- High contrast mode support
- Focus visible indicators

### Loading States
- Button spinner during authentication
- Disabled state for all inputs
- Clear feedback messages
- Prevents duplicate submissions

### Error Handling
- Field-level validation errors
- General error messages
- Network error handling
- OAuth failure messages

---

## Color Scheme

### Primary Colors
```
Primary Gradient: #667eea → #764ba2
Background:       #f7fafc
Card:             #ffffff
Text:             #2d3748
Muted:            #718096
```

### State Colors
```
Success:  #48bb78 (Green)
Error:    #e53e3e (Red)
Warning:  #ed8936 (Orange)
Info:     #4299e1 (Blue)
```

### Interactive States
```
Hover:    Slight lift with shadow
Focus:    3px blue outline
Active:   Pressed state
Disabled: 60% opacity
```

---

## User Flow

```
Landing Page
    |
    v
Sign In Page
    |
    +---> Choose Auth Method
    |           |
    |           +---> Social OAuth
    |           |         |
    |           |         v
    |           |    Redirect to Provider
    |           |         |
    |           |         v
    |           |    User Authenticates
    |           |         |
    |           |         v
    |           |    Return with Code
    |           |         |
    |           |         v
    |           |    Exchange for Token
    |           |
    +---> Traditional Login
              |
              v
         Enter Credentials
              |
              v
         Client Validation
              |
              v
          API Call
              |
              v
         Store Token
              |
              v
    Redirect to Dashboard
```

---

## Customization Guide

### Changing Colors
Edit CSS variables in `src/styles/global.css`:

```css
:root {
  --color-primary: #667eea;    /* Your brand color */
  --color-secondary: #764ba2;  /* Accent color */
}
```

### Changing Layout
All layout CSS is in `src/pages/SignIn/SignIn.css`:
- `.signin__card`: Adjust card size
- `.signin__container`: Change positioning
- `.signin__social`: Modify button layout

### Adding New OAuth Providers
1. Add config to `src/utils/constants.js`
2. Add service methods to `src/services/authService.js`
3. Add button to `SignIn.jsx`

---

Last Updated: October 29, 2025


---

## Post-Sign In Wireframes

### Dashboard (Overview)
```
┌──────────────────────────────────────────────────────────────┐
│  [Logo] JobPortal AI        [Search box........]  [Profile]  │
│  ─────────────────────────────────────────────────────────   │
│  [Stats: Matches | Applied | Interviews | Saved]              │
│  ─────────────────────────────────────────────────────────   │
│  Recommended For You                                          │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│  │ Company A │ │ Company B │ │ Company C │ │ Company D │ ... │
│  │ Role      │ │ Role      │ │ Role      │ │ Role      │     │
│  │ [Save]    │ │ [Save]    │ │ [Save]    │ │ [Save]    │     │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘     │
│  ─────────────────────────────────────────────────────────   │
│  Recent Applications                                          │
│  [A] Role @ Company   Status: Screening   [View]              │
│  [B] Role @ Company   Status: Interview   [View]              │
└──────────────────────────────────────────────────────────────┘
```

### Job Search / Listing
```
┌──────────────────────────────────────────────────────────────┐
│ [Logo]   [Search roles, skills, location..............][Go]  │
│ [Filters] Location ▾ | Type ▾ | Experience ▾ | Salary ▾      │
│ ─────────────────────────────────────────────────────────   │
│ [List]                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Role @ Company • Location • $ • Full-time               │ │
│ │ [Badges: Remote, Urgent]                                │ │
│ │ Summary text...                                         │ │
│ │ [Save] [Apply]                                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│ (Pagination) « 1 2 3 »                                      │
└──────────────────────────────────────────────────────────────┘
```

### Job Detail
```
┌──────────────────────────────────────────────────────────────┐
│ [Back]  Role Title @ Company               [Save] [Apply Now] │
│ Location • Compensation • Type • Posted Xd                    │
│ ─────────────────────────────────────────────────────────   │
│ Tabs: Description | Requirements | Company | Similar Jobs     │
│ [Description content text…]                                   │
│ Key Skills: [React] [Java] [SQL] [Leadership]                 │
│ ─────────────────────────────────────────────────────────   │
│ Similar Jobs                                                  │
│  • Role @ Company (short line) [View]                         │
└──────────────────────────────────────────────────────────────┘
```

### Applications Tracker
```
┌──────────────────────────────────────────────────────────────┐
│ Applications    [Filter: All ▾]  [Sort: Recent ▾]            │
│ ─────────────────────────────────────────────────────────   │
│ [Pipeline]  Applied → Screening → Interview → Offer → Hired  │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Role @ Company  • Applied: May 10                        │ │
│ │ Notes: ...                                              │ │
│ │ Status: Screening  [Update Status ▾]  [View Job]        │ │
│ └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Resume Upload / Builder
```
┌──────────────────────────────────────────────────────────────┐
│ Resume                                                       │
│ [Upload PDF] or [Build Online]                               │
│ ─────────────────────────────────────────────────────────   │
│ Sections: Summary | Experience | Education | Skills | Links  │
│ ┌───────────────┐  ┌──────────────────────────────────────┐ │
│ │ Field list    │  │ Editable form with live preview      │ │
│ │ + Add Section │  │ [Preview pane (right on desktop)]    │ │
│ └───────────────┘  └──────────────────────────────────────┘ │
│ [Save] [Export PDF]                                          │
└──────────────────────────────────────────────────────────────┘
```

### AI Recommendations (Explainable)
```
┌──────────────────────────────────────────────────────────────┐
│ AI Matches  [Refresh]  [Adjust Preferences]                  │
│ Why these jobs: [Skills fit 85%] [Location match] [History]  │
│ ─────────────────────────────────────────────────────────   │
│ [Card] Role @ Company  Fit: 88%                              │
│ Factors: React(✓), Java(✓), Leadership(△)                    │
│ [Improve fit] → Suggested courses/projects                    │
│ [Save] [Apply]                                               │
└──────────────────────────────────────────────────────────────┘
```

### Profile & Settings
```
┌──────────────────────────────────────────────────────────────┐
│ Profile                                                       │
│ [Avatar] Name        [Edit]                                  │
│ Email • Phone • Location • Role                              │
│ Preferences: Locations ▾ | Roles ▾ | Salary ▾                │
│ Notifications: [Email ▢] [SMS ▢] [In‑app ▣]                  │
│ Privacy: Resume visibility ▾                                 │
│ [Save Changes]                                               │
└──────────────────────────────────────────────────────────────┘
```
