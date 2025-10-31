import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../services/authService'
import { validateSignUpForm, sanitizeInput } from '../../utils/validators'
import './SignUp.css'

/**
 * SignUp Page Component
 * Themed to match SignIn with social auth and strong validation
 */
function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [hovered, setHovered] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: sanitizeInput(value) }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
    if (generalError) setGeneralError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')
    const validation = validateSignUpForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    setIsLoading(true)
    try {
      const res = await register({ name: formData.name, email: formData.email, password: formData.password })
      console.log('Registered:', res.user)
      navigate('/dashboard')
    } catch (err) {
      setGeneralError(err.message || 'Failed to sign up. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup">
      <div className="signup__background" aria-hidden="true">
        <div className="signup__bg signup__bg--1"></div>
        <div className="signup__bg signup__bg--2"></div>
        <div className="signup__bg signup__bg--3"></div>
      </div>

      <div className="signup__container">
        <div className="signup__header">
          <h1 className="signup__title"><span className="signup__title-text">Create your account</span></h1>
          <p className="signup__subtitle">Join JobPortal AI to get personalized recommendations</p>
        </div>

        <div className={`signup__card ${isLoading ? 'signup__card--loading' : ''}`} onMouseEnter={() => setHovered('card')} onMouseLeave={() => setHovered(null)}>
          {generalError && (
            <div className="signup__error" role="alert">
              <span>{generalError}</span>
            </div>
          )}


          <form className="signup__form" onSubmit={onSubmit} noValidate>
            <div className="input input--floating">
              <div className="input__container">
                <input id="name" name="name" value={formData.name} onChange={onChange} placeholder=" " disabled={isLoading} className={`input__field ${errors.name ? 'input__field--error' : ''}`} />
                <label htmlFor="name" className="input__label">Full Name<span className="input__required">*</span></label>
                <div className="input__focus-line"></div>
              </div>
              {errors.name && <p className="input__error" role="alert">{errors.name}</p>}
            </div>

            <div className="input input--floating">
              <div className="input__container">
                <input id="email" type="email" name="email" value={formData.email} onChange={onChange} placeholder=" " disabled={isLoading} className={`input__field ${errors.email ? 'input__field--error' : ''}`} autoComplete="email" />
                <label htmlFor="email" className="input__label">Email Address<span className="input__required">*</span></label>
                <div className="input__focus-line"></div>
              </div>
              {errors.email && <p className="input__error" role="alert">{errors.email}</p>}
            </div>

            <div className="input input--floating">
              <div className="input__container">
                <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={onChange} placeholder=" " disabled={isLoading} className={`input__field ${errors.password ? 'input__field--error' : ''}`} autoComplete="new-password" />
                <label htmlFor="password" className="input__label">Password<span className="input__required">*</span></label>
                <button type="button" className="input__toggle-password" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} tabIndex={-1}>
                  {showPassword ? '🔒' : '👁️‍🗨️'}
                </button>
                <div className="input__focus-line"></div>
              </div>
              {errors.password && <p className="input__error" role="alert">{errors.password}</p>}
            </div>

            <div className="input input--floating">
              <div className="input__container">
                <input id="confirmPassword" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={onChange} placeholder=" " disabled={isLoading} className={`input__field ${errors.confirmPassword ? 'input__field--error' : ''}`} autoComplete="new-password" />
                <label htmlFor="confirmPassword" className="input__label">Confirm Password<span className="input__required">*</span></label>
                <div className="input__focus-line"></div>
              </div>
              {errors.confirmPassword && <p className="input__error" role="alert">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className={`button button--primary button--medium button--full-width ${isLoading ? 'button--loading' : ''}`} disabled={isLoading} aria-busy={isLoading}>
              <span className={isLoading ? 'button__text--loading' : 'button__text'}>{isLoading ? 'Creating account...' : 'Create Account'}</span>
              <div className="button__ripple"></div>
            </button>
          </form>

          <div className="signup__footer">
            <p>Already have an account? <button type="button" className="signin__link signin__link--primary" onClick={() => navigate('/signin')}>Sign In</button></p>
          </div>
        </div>
        <div className="signup__page-footer"><p>&copy; 2025 JobPortal AI. All rights reserved.</p></div>
      </div>
    </div>
  )
}

export default SignUp


