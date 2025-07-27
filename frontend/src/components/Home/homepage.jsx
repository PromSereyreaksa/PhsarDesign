import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to browse-jobs since homepage is redundant
    navigate("/browse-jobs", { replace: true })
  }, [navigate])

  return null
}