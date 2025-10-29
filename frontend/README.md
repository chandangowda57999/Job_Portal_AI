# JobPortal AI - Frontend

Modern React application with OAuth integration, rich animations, and scalable theme system.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: http://localhost:3000

## Features

- OAuth sign-in (Google, LinkedIn)
- Form validation with error handling
- Responsive design (mobile, tablet, desktop)
- Rich hover effects and animations
- Modular component architecture
- Scalable theme system
- Dark mode support
- WCAG 2.1 Level AA accessibility

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Button/       
│   ├── Input/        
│   └── SocialButton/ 
├── pages/            # Page components
│   └── SignIn/       
├── services/         # API services
├── utils/            # Utilities & validators
└── styles/           # Theme system & global styles
    ├── theme.css     # Design tokens & animations
    ├── global.css    # Base styles
    └── App.css       # App layout
```

## Environment Setup

Create `.env` file:

```env
# Backend API
VITE_API_BASE_URL=http://localhost:8080/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# LinkedIn OAuth
VITE_LINKEDIN_CLIENT_ID=your-client-id
VITE_LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
```

## OAuth Configuration

### Google OAuth
1. Go to: https://console.cloud.google.com/
2. Create OAuth 2.0 credentials
3. Add redirect URI: `http://localhost:3000/auth/google/callback`
4. Copy Client ID to `.env`

### LinkedIn OAuth
1. Go to: https://www.linkedin.com/developers/
2. Create app and get credentials
3. Add redirect URL: `http://localhost:3000/auth/linkedin/callback`
4. Copy Client ID to `.env`

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Theme System

All styling uses centralized theme variables from `src/styles/theme.css`:

**Colors**
```css
var(--primary-500)    /* Main brand color */
var(--secondary-500)  /* Accent color */
var(--gray-700)       /* Text color */
```

**Spacing**
```css
var(--space-4)   /* 16px */
var(--space-8)   /* 32px */
```

**Animations**
```css
animation: slideUp var(--transition-medium) var(--ease-out);
```

**Hover Effects**
```css
.element:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

## Component Usage

### Button
```jsx
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

### Input
```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  error={error}
/>
```

### Social Button
```jsx
<SocialButton provider="google" onClick={handleLogin} />
```

## Adding New Pages

Use the theme system for consistency:

```css
.new-page {
  padding: var(--space-8);
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.new-page:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

## Code Style

- No inline styles
- All components have separate CSS files
- Use BEM naming convention
- All functions have JSDoc comments
- Follow React best practices

## Technology Stack

- React 18.2.0
- Vite 5.0.8 (build tool)
- React Router 6.20.0 (routing)
- Axios 1.6.2 (HTTP client)

## Responsive Breakpoints

- Mobile: < 480px
- Tablet: 481px - 768px
- Desktop: > 768px

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus visible indicators
- Reduced motion support
- High contrast mode support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Documentation

- `WIREFRAMES.md` - Design documentation and user flow
- `src/styles/theme.css` - Complete design system with comments

---

Last Updated: October 29, 2025
