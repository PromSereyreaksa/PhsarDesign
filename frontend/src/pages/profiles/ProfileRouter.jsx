import { useSelector } from "react-redux"
import ArtistProfile from "./ArtistProfile"
import ClientProfile from "./ClientProfile"

const ProfileRouter = () => {
  const { user } = useSelector((state) => state.auth)

  if (user?.role === "artist" || user?.role === "freelancer") {
    return <ArtistProfile />
  } else if (user?.role === "client") {
    return <ClientProfile />
  }

  // Default fallback to artist profile for backward compatibility
  return <ArtistProfile />
}

export default ProfileRouter
