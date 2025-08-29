import { lazy, Suspense } from 'react'
import Loader from './Loader'

/**
 * LazyComponent - Wrapper for lazy-loaded components with optimized loading
 */
const LazyComponent = ({ 
  importFunction, 
  fallback = <Loader />, 
  errorFallback = <div>Error loading component</div>,
  ...props 
}) => {
  const Component = lazy(importFunction)
  
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  )
}

/**
 * Route-level lazy loading helpers
 */
export const LazyRoute = ({ component: Component, fallback, ...props }) => (
  <Suspense fallback={fallback || <Loader />}>
    <Component {...props} />
  </Suspense>
)

/**
 * Preload function for critical routes
 */
export const preloadComponent = (importFunction) => {
  const component = lazy(importFunction)
  // Trigger the import to preload the component
  importFunction()
  return component
}

export default LazyComponent
