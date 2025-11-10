import React from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import Button from '../components/common/Button'

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <AlertTriangle className="h-24 w-24 text-red-500" />
      <h1 className="mt-8 text-6xl font-bold text-[var(--color-foreground)]">
        404
      </h1>
      <p className="mt-4 text-2xl text-[var(--color-secondary-foreground)]">
        Page Not Found
      </p>
      <p className="mt-2 text-lg text-[var(--color-secondary-foreground)]">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="mt-8">
        <Button variant="primary">Go Home</Button>
      </Link>
    </div>
  )
}

export default NotFoundPage