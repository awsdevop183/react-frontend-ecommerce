import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'

export default function NotFound() {
  return (
    <EmptyState
      icon="🧭"
      title="Page not found"
      message="The page you were looking for does not exist."
      action={
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      }
    />
  )
}
