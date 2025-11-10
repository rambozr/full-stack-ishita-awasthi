import React from 'react'

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'button-primary'
      case 'secondary':
        return 'button-secondary'
      case 'ghost':
        return 'button-ghost'
      case 'danger':
        return 'button-danger'
      default:
        return 'button-primary'
    }
  }

  const classes = [
    'button',
    getVariantClasses(),
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}

export default Button