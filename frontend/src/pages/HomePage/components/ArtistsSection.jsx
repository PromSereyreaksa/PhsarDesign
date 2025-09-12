"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SectionHeader from "../../../components/common/SectionHeader"
import Loader from '../../../components/ui/Loader'
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux"
import { fetchArtists } from "../../../store/slices/artistsSlice"

export default function ArtistsSection({ customImages }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { artists, loading, error } = useAppSelector((state) => state.artists)

  useEffect(() => {
    // Always fetch fresh artist data to ensure we get profile pictures
    dispatch(fetchArtists())
  }, [dispatch])

  const getArtistColor = (index) => {
    const colors = ['#A95BAB', '#3F51B5', '#00BCD4', '#4CAF50', '#FF9800']
    return colors[index % colors.length]
  }

  const getFallbackArtists = () => [
    {
      name: 'Prom Sereyreaksa',
      role: 'UI/UX Designer',
      bio: 'Passionate about creating beautiful digital experiences',
      color: '#A95BAB'
    },
    {
      name: 'Chea Ilong',
      role: '3D Artist',
      bio: 'Bringing imagination to life through 3D modeling',
      color: '#3F51B5'
    },
    {
      name: 'Huy Visa',
      role: 'Illustrator',
      bio: 'Creating vibrant illustrations that tell stories',
      color: '#00BCD4'
    },
    {
      name: 'Sea Huyty',
      role: 'Brand Designer',
      bio: 'Crafting memorable brand identities',
      color: '#4CAF50'
    },
    {
      name: 'Phay Someth',
      role: 'Motion Designer',
      bio: 'Bringing designs to life through animation',
      color: '#FF9800'
    },
  ]

  // Helper function to create URL slug from name (fallback only)
  const createSlug = (firstName, lastName) => {
    return `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').trim('-')
  }

  const transformedArtists = artists.length > 0 ? artists.map((artist, index) => {
    // Use backend slug if available, otherwise fallback to generated slug
    const slug = artist.user.slug || createSlug(artist.user.firstName, artist.user.lastName)
    console.log('Artist data:', artist) // Debug log to see the structure
    
    return {
      id: artist.artistId,
      slug: slug,
      name: `${artist.user.firstName} ${artist.user.lastName}`,
      role: artist.specialties?.split(',')[0]?.trim() || 'Creative Artist',
      bio: artist.user.bio || 'Passionate about creating amazing digital experiences',
      color: getArtistColor(index),
      skills: artist.skills || '',
      availability: artist.availability,
      rating: artist.rating,
      hourlyRate: artist.hourlyRate,
      portfolioUrl: artist.portfolioUrl,
      profilePicture: artist?.user?.avatarURL,
      userId: artist.user.userId
    }
  }).slice(0, 5) : getFallbackArtists()

  if (loading && artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader />
        <p className="text-gray-400 mt-4">Loading artists...</p>
      </div>
    )
  }

  const buildArtistGrid = () => {
    if (error && artists.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400">Showing fallback artists</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
        {transformedArtists.map((artist, index) => (
          <ArtistCard
            key={artist.id || index}
            artist={artist}
            index={index}
            customImages={artist.profilePicture} // Only pass customImages if no profile picture
            navigate={navigate}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Artists You May Like" />
        <div className="mt-16">
          {buildArtistGrid()}
        </div>
      </div>
    </section>
  )
}

function ArtistCard({ artist, index, customImages, navigate }) {
  const hasCustomImage = customImages && index < customImages.length && customImages[index]
  const hasProfilePicture = artist.profilePicture

  // Debug logging
  console.log(`Artist ${artist.name}:`, {
    hasCustomImage,
    hasProfilePicture,
    profilePicture: artist.profilePicture,
    customImage: hasCustomImage ? customImages[index] : null
  })

  const handleArtistClick = () => {
    if (artist.slug) {
      // Navigate to artist public profile using slug (like GitHub style)
      navigate(`/${artist.slug}`)
    } else if (artist.id) {
      // Fallback to ID-based route
      navigate(`/artist/${artist.id}`)
    }
  }

  return (
    <div 
      className="flex flex-col items-center text-center space-y-3 md:space-y-4 cursor-pointer group transition-transform duration-200 hover:scale-105"
      onClick={handleArtistClick}
    >
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex items-center justify-center group-hover:ring-4 group-hover:ring-[#A95BAB]/30 transition-all duration-200">
        {hasCustomImage ? (
          <div className="relative w-full h-full">
            <img
              src={artist.profilePicture}
              alt={artist.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log(`Custom image failed for ${artist.name}:`, customImages[index])
                // Fallback to profile picture or color avatar if custom image fails
                e.target.style.display = 'none'
                if (hasProfilePicture) {
                  e.target.parentNode.nextSibling.style.display = 'block'
                } else {
                  e.target.parentNode.nextSibling.nextSibling.style.display = 'flex'
                }
              }}
            />
          </div>
        ) : null}
        
        {hasProfilePicture ? (
          <div className={`relative w-full h-full ${hasCustomImage ? 'hidden' : 'block'}`}>
            <img
              src={artist.avatarURL}
              alt={artist.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log(`Profile picture failed for ${artist.name}:`, artist.profilePicture)
                // Fallback to color avatar if profile picture fails to load
                e.target.style.display = 'none'
                e.target.parentNode.nextSibling.style.display = 'flex'
              }}
            />
          </div>
        ) : null}
        
        <div 
          className={`w-full h-full ${(hasCustomImage || hasProfilePicture) ? 'hidden' : 'flex'} items-center justify-center`}
          style={{ backgroundColor: artist.color }}
        >
          <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-base md:text-lg font-bold text-white truncate max-w-full group-hover:text-[#A95BAB] transition-colors duration-200">
          {artist.name}
        </h3>
        <p className="text-sm md:text-base font-semibold text-[#6B46C1] truncate max-w-full">
          {artist.role}
        </p>
        {artist.rating && typeof artist.rating === 'number' && artist.rating > 0 && (
          <div className="flex items-center justify-center space-x-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-gray-300">{artist.rating.toFixed(1)}</span>
          </div>
        )}
        {artist.hourlyRate && typeof artist.hourlyRate === 'number' && artist.hourlyRate > 0 && (
          <p className="text-xs text-gray-400">
            ${artist.hourlyRate}/hr
          </p>
        )}
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed line-clamp-2">
          {artist.bio}
        </p>
      </div>
    </div>
  )
}
