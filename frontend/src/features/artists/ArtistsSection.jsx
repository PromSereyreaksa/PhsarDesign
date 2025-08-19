"use client"

import React from 'react'
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hook/useRedux"
import { useNavigate } from 'react-router-dom'
import SectionHeader from "../../components/common/SectionHeader"
import HoverOverlay from '../../components/common/HoverOverlay'
import Loader from '../../components/ui/Loader'
import { fetchArtists } from "../../store/slices/artistsSlice"

export default function ArtistsSection({ customImages }) {
  const dispatch = useAppDispatch()
  const { artists, loading, error } = useAppSelector((state) => state.artists)

  useEffect(() => {
    if (artists.length === 0) {
      dispatch(fetchArtists())
    }
  }, [dispatch, artists.length])

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

  const transformedArtists = artists.length > 0 ? artists.map((artist, index) => ({
    name: `${artist.user.firstName} ${artist.user.lastName}`,
    role: artist.specialties?.split(',')[0]?.trim() || 'Creative Artist',
    bio: artist.user.bio || 'Passionate about creating amazing digital experiences',
    color: getArtistColor(index),
    skills: artist.skills || '',
    availability: artist.availability,
    rating: artist.rating,
    hourlyRate: artist.hourlyRate,
    portfolioUrl: artist.portfolioUrl
  })).slice(0, 5) : getFallbackArtists()

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
            key={index}
            artist={artist}
            index={index}
            customImages={customImages}
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

function ArtistCard({ artist, index, customImages }) {
  const hasCustomImage = customImages && index < customImages.length && customImages[index]

  return (
    <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex items-center justify-center">
        {hasCustomImage ? (
          <img
            src={customImages[index]}
            alt={artist.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to color avatar if image fails to load
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        
        <div 
          className={`w-full h-full ${hasCustomImage ? 'hidden' : 'flex'} items-center justify-center`}
          style={{ backgroundColor: artist.color }}
        >
          <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-base md:text-lg font-bold text-white truncate max-w-full">
          {artist.name}
        </h3>
        <p className="text-sm md:text-base font-semibold text-[#6B46C1] truncate max-w-full">
          {artist.role}
        </p>
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed line-clamp-2">
          {artist.bio}
        </p>
      </div>
    </div>
  )
}
