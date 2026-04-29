import { Navigate } from 'react-router-dom'
import { isLoggedIn, getRole } from '../api/auth'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }

  // If roles are specified, check if user has the role
  if (allowedRoles.length > 0) {
    const userRole = getRole()
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />
    }
  }

  return children
}