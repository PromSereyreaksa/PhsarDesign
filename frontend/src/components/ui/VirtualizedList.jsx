import { useCallback, useMemo } from 'react'
import { useVirtualScroll } from '../../hooks/usePerformance.jsx'

/**
 * VirtualizedList Component
 * 
 * Renders only visible items for better performance with large datasets
 * Perfect for marketplace listings, search results, and notifications
 */
const VirtualizedList = ({
  items = [],
  itemHeight = 100,
  containerHeight = 400,
  renderItem,
  className = '',
  getItemKey = (item, index) => item.id || index,
  overscan = 5, // Extra items to render outside visible area
  ...props
}) => {
  const {
    visibleItems,
    startIndex,
    offsetY,
    totalHeight,
    handleScroll
  } = useVirtualScroll(items, itemHeight, containerHeight)

  // Memoize visible items with overscan
  const itemsToRender = useMemo(() => {
    const startIdx = Math.max(0, startIndex - overscan)
    const endIdx = Math.min(items.length, startIndex + visibleItems.length + overscan)
    
    return items.slice(startIdx, endIdx).map((item, index) => ({
      item,
      index: startIdx + index,
      key: getItemKey(item, startIdx + index)
    }))
  }, [items, startIndex, visibleItems.length, overscan, getItemKey])

  const handleScrollEvent = useCallback((e) => {
    handleScroll(e)
  }, [handleScroll])

  if (!items.length) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: containerHeight }}>
        <p className="text-gray-500 text-lg">No items to display</p>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScrollEvent}
      {...props}
    >
      {/* Total container to maintain scroll height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items container */}
        <div
          style={{
            position: 'absolute',
            top: offsetY - (overscan * itemHeight),
            width: '100%'
          }}
        >
          {itemsToRender.map(({ item, index, key }) => (
            <div
              key={key}
              style={{ 
                height: itemHeight,
                position: 'relative'
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * VirtualizedGrid Component
 * 
 * Renders items in a grid layout with virtualization
 */
export const VirtualizedGrid = ({
  items = [],
  itemHeight = 200,
  itemsPerRow = 3,
  containerHeight = 600,
  renderItem,
  className = '',
  gap = 16,
  getItemKey = (item, index) => item.id || index,
  ...props
}) => {
  // Calculate row height including gap
  const rowHeight = itemHeight + gap

  // Group items into rows
  const rows = useMemo(() => {
    const rowsArray = []
    for (let i = 0; i < items.length; i += itemsPerRow) {
      rowsArray.push(items.slice(i, i + itemsPerRow))
    }
    return rowsArray
  }, [items, itemsPerRow])

  const {
    visibleItems: visibleRows,
    startIndex: startRowIndex,
    offsetY,
    totalHeight,
    handleScroll
  } = useVirtualScroll(rows, rowHeight, containerHeight)

  const handleScrollEvent = useCallback((e) => {
    handleScroll(e)
  }, [handleScroll])

  if (!items.length) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: containerHeight }}>
        <p className="text-gray-500 text-lg">No items to display</p>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScrollEvent}
      {...props}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            width: '100%'
          }}
        >
          {visibleRows.map((row, rowIndex) => (
            <div
              key={`row-${startRowIndex + rowIndex}`}
              className="flex gap-4 mb-4"
              style={{ height: itemHeight }}
            >
              {row.map((item, itemIndex) => {
                const globalIndex = (startRowIndex + rowIndex) * itemsPerRow + itemIndex
                return (
                  <div
                    key={getItemKey(item, globalIndex)}
                    className="flex-1"
                    style={{ maxWidth: `calc((100% - ${(itemsPerRow - 1) * gap}px) / ${itemsPerRow})` }}
                  >
                    {renderItem(item, globalIndex)}
                  </div>
                )
              })}
              {/* Fill empty cells in the last row */}
              {row.length < itemsPerRow && 
                Array.from({ length: itemsPerRow - row.length }, (_, emptyIndex) => (
                  <div 
                    key={`empty-${rowIndex}-${emptyIndex}`} 
                    className="flex-1"
                    style={{ maxWidth: `calc((100% - ${(itemsPerRow - 1) * gap}px) / ${itemsPerRow})` }}
                  />
                ))
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * InfiniteScroll Component
 * 
 * Combines virtualization with infinite scrolling
 */
export const InfiniteVirtualizedList = ({
  items = [],
  hasMore = false,
  loadMore,
  loading = false,
  itemHeight = 100,
  containerHeight = 400,
  renderItem,
  className = '',
  loadingComponent = <div className="p-4 text-center text-gray-500">Loading...</div>,
  threshold = 200, // Distance from bottom to trigger load more
  ...props
}) => {
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    
    if (hasMore && !loading && scrollHeight - scrollTop - clientHeight < threshold) {
      loadMore?.()
    }
  }, [hasMore, loading, threshold, loadMore])

  return (
    <div className="space-y-4">
      <VirtualizedList
        items={items}
        itemHeight={itemHeight}
        containerHeight={containerHeight}
        renderItem={renderItem}
        className={className}
        onScroll={handleScroll}
        {...props}
      />
      
      {loading && loadingComponent}
    </div>
  )
}

export default VirtualizedList
