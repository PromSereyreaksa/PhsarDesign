"use client"

export default function SectionHeader({ title, onSeeAll, titleRef }) {
  return (
    <div className="flex justify-between items-center">
      <h2 
        ref={titleRef}
        className="text-3xl md:text-4xl font-bold text-white text-left flex-1"
      >
        {title}
      </h2>
      
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="text-[#A95BAB] hover:text-[#A95BAB]/80 transition-colors duration-300 ease-out font-medium"
        >
          See all
        </button>
      )}
    </div>
  )
}
