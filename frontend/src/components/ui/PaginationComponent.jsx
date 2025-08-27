import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { useMemo } from "react"

const PaginationComponent = ({
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  limit = 9,
  onPageChange,
  isLoading = false,
  className = "",
  showInfo = true,
  maxVisiblePages = 5
}) => {
  // Calculate pagination logic
  const pagination = useMemo(() => {
    const delta = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - delta)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    const pages = []
    
    // Show first page and ellipsis if needed
    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('ellipsis-start')
      }
    }

    // Show visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Show ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis-end')
      }
      pages.push(totalPages)
    }

    return pages
  }, [currentPage, totalPages, maxVisiblePages])

  // Calculate displayed items range
  const startItem = Math.min((currentPage - 1) * limit + 1, totalCount)
  const endItem = Math.min(currentPage * limit, totalCount)

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages && !isLoading) {
      onPageChange(page)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e, page) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (typeof page === 'number') {
        handlePageClick(page)
      }
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrevious()
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
    }
  }

  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Results Info - Hidden per user request */}
      {false && showInfo && totalCount > 0 && (
        <div className="text-sm text-gray-400">
          Showing <span className="font-medium text-white">{startItem}</span> to{' '}
          <span className="font-medium text-white">{endItem}</span> of{' '}
          <span className="font-medium text-white">{totalCount}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <nav 
        role="navigation" 
        aria-label="Pagination"
        className="flex items-center space-x-1"
      >
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          onKeyDown={(e) => handleKeyDown(e, currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className={`
            relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A95BAB]/50
            ${currentPage <= 1 || isLoading
              ? 'text-gray-500 cursor-not-allowed bg-gray-800/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50 active:bg-gray-600/50'
            }
          `}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pagination.map((page, index) => {
            if (typeof page === 'string' && page.startsWith('ellipsis')) {
              return (
                <div
                  key={page}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              )
            }

            const isCurrentPage = page === currentPage

            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                onKeyDown={(e) => handleKeyDown(e, page)}
                disabled={isLoading}
                className={`
                  relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A95BAB]/50
                  min-w-[2.5rem] justify-center
                  ${isCurrentPage
                    ? 'bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 text-white shadow-lg border border-[#A95BAB]/30'
                    : isLoading
                      ? 'text-gray-500 cursor-not-allowed bg-gray-800/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50 active:bg-gray-600/50 border border-gray-700/50'
                  }
                  ${isCurrentPage ? 'transform scale-105' : 'hover:scale-105'}
                `}
                aria-label={`Go to page ${page}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {isLoading && isCurrentPage ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  page
                )}
              </button>
            )
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          onKeyDown={(e) => handleKeyDown(e, currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className={`
            relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A95BAB]/50
            ${currentPage >= totalPages || isLoading
              ? 'text-gray-500 cursor-not-allowed bg-gray-800/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50 active:bg-gray-600/50'
            }
          `}
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Mobile-specific compact view */}
      <div className="sm:hidden text-xs text-gray-500 text-center">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

export default PaginationComponent
