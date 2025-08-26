"use client"

import { Search } from "lucide-react";

export default function SearchBox({
  value,
  onChange,
  onSubmit,
  placeholder = "What type of service are you looking for?"
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-[875px]">
      <div className="relative">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
         <Search className="w-5 h-5 text-white" />
        </div>

        {/* Search input */}
        <input
          type="text"
          id="search"
          name="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A95BAB] focus:border-transparent transition-all duration-300 ease-out"
        />
      </div>
    </div>
  )
}
