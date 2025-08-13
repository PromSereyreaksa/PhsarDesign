"use client"

import SectionHeader from "../../components/common/SectionHeader"
import HoverOverlay from "../../components/common/HoverOverlay"

export default function PopularServicesSection({ customImages }) {
  const artworks = [
    { color: '#A95BAB', category: 'Web Design' },
    { color: '#3F51B5', category: 'Mobile Apps' },
    { color: '#00BCD4', category: 'UI/UX Design' },
    { color: '#4CAF50', category: 'Digital Marketing' },
  ]

  const buildServiceGrid = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map((artwork, index) => {
          const hasCustomImage = customImages && index < customImages.length && customImages[index]
          
          return (
            <div key={index} className="relative rounded-xl overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-500 ease-out">
              {hasCustomImage ? (
                <div className="relative">
                  <img
                    src={customImages[index]}
                    alt={artwork.category}
                    className="w-full h-48 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to color block if image fails to load
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div 
                    className="w-full h-48 bg-center bg-cover hidden items-center justify-center"
                    style={{ backgroundColor: artwork.color }}
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-full h-48 flex items-center justify-center"
                  style={{ backgroundColor: artwork.color }}
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              <HoverOverlay label={artwork.category} />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Popular Services" />
        <div className="mt-16">
          {buildServiceGrid()}
        </div>
      </div>
    </section>
  )
}
