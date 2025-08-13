"use client"

export default function SuggestionChip({ label, onTap, fontSize = "text-base" }) {
  return (
    <button
      onClick={onTap}
      className="h-7 px-3 bg-[#2A2A2A] border border-[#404040]/50 rounded-xl text-white hover:bg-[#404040] transition-all duration-300 ease-out transform hover:scale-105 shadow-sm hover:shadow-md"
    >
      <span className={`${fontSize} font-normal text-center leading-none`}>
        {label}
      </span>
    </button>
  )
}
