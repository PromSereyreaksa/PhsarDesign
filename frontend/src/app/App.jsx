import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import Loader from "../components/ui/Loader"
import PerformanceMonitor from "../components/ui/PerformanceMonitor"
import ProtectedRoute from "../guards/ProtectedRoute.jsx"
import "./App.css"

// Lazy load components for better performance
// Critical pages (loaded immediately)
import LoginPage from "../pages/auth/LoginPage/index.jsx"
import RegisterPage from "../pages/auth/RegisterPage"
import LandingPage from "../pages/public/LandingPage/index.jsx"

// Non-critical pages (lazy loaded)
const AboutPage = lazy(() => import("../pages/public/AboutPage/index.jsx"))
const CommunityPage = lazy(() => import("../pages/Community"))
const PostDetailPage = lazy(() => import("../pages/Marketplace/PostDetailPage"))
const JobDetailPage = lazy(() => import("../pages/Marketplace/JobDetailPage.jsx"))
const ContactArtistPage = lazy(() => import("../pages/Marketplace/ContactArtistPage"))
const HomePage = lazy(() => import("../pages/HomePage/index.jsx"))
const CreatePostPage = lazy(() => import("../pages/Marketplace/CreatePost"))
const EditPostPage = lazy(() => import("../pages/Marketplace/EditPostPage"))
const ArtistDashboard = lazy(() => import("../pages/Dashboard/ArtistDashboard.jsx"))
const MyPostsPage = lazy(() => import("../pages/Dashboard/MyPostsPage"))
const ApplicationsPage = lazy(() => import("../pages/dashboard/ApplicationsPage.jsx"))
const ApplicationDetailPage = lazy(() => import("../pages/dashboard/ApplicationDetailPage.jsx"))
const NotificationsPage = lazy(() => import("../pages/dashboard/NotificationsPage"))
const ArtistProfile = lazy(() => import("../pages/profiles/ArtistProfile.jsx"))
const ClientProfile = lazy(() => import("../pages/profiles/ClientProfile.jsx"))
const EditProfile = lazy(() => import("../pages/profiles/EditProfile.jsx"))
const ProfileRouter = lazy(() => import("../pages/profiles/ProfileRouter.jsx"))
const PublicArtistProfile = lazy(() => import("../pages/public/PublicArtistProfile.jsx"))
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"))
const RegisterVerificationPage = lazy(() => import("../pages/auth/RegisterVerificationPage"))
const ForgotPasswordVerificationPage = lazy(() => import("../pages/auth/ForgotPasswordVerificationPage"))
const ChangePasswordPage = lazy(() => import("../pages/auth/ChangePasswordPage"))
const OTPVerificationPage = lazy(() => import("../pages/auth/OTPVerificationPage"))
const CheckEmailPage = lazy(() => import("../pages/auth/CheckEmailPage"))
const MagicLinkVerificationPage = lazy(() => import("../pages/auth/MagicLinkVerificationPage"))
const Settings = lazy(() => import("../pages/Settings"))
const Projects = lazy(() => import("../pages/Projects"))
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"))

// Pages with pagination - load directly for better performance
import CategoryPage from "../pages/Marketplace/CategoryPage"
import MarketplacePage from "../pages/Marketplace/MarketplacePage"

// Enhanced loading component with better UX
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
    <div className="text-center">
      <Loader />
      <p className="text-gray-400 mt-4 text-lg">Loading...</p>
    </div>
  </div>
)

// Lazy route wrapper with error boundary
const LazyRoute = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
)

function App() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <Routes>
        {/* Critical routes (no lazy loading) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public routes (lazy loaded) */}
        <Route path="/about" element={
          <LazyRoute>
            <AboutPage />
          </LazyRoute>
        } />

        <Route path="/community" element={
          <LazyRoute>
            <CommunityPage />
          </LazyRoute>
        } />

        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/category/:categoryName" element={<CategoryPage />} />
        <Route path="/marketplace/service/:slug" element={
          <LazyRoute>
            <PostDetailPage />
          </LazyRoute>
        } />
        <Route path="/marketplace/job/:slug" element={
          <LazyRoute>
            <JobDetailPage />
          </LazyRoute>
        } />
        <Route 
          path="/marketplace/:slug/contact" 
          element={
            <ProtectedRoute>
              <LazyRoute>
                <ContactArtistPage />
              </LazyRoute>
            </ProtectedRoute>
          } 
        />

        {/* Protected authenticated routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <HomePage />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace/create"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <CreatePostPage />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace/edit/:postId"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <EditPostPage />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <ArtistDashboard />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/my-posts"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <MyPostsPage />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/applications"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <ApplicationsPage />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/applications/:applicationId"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <ApplicationDetailPage />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/notifications"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <NotificationsPage />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        {/* Projects routes */}
        <Route
          path="/projects/*"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <Projects />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        {/* Settings route */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <Settings />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        {/* Profile routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <ProfileRouter />
              </LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/artist/:userId"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <ArtistProfile />
              </LazyRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/client/:userId"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <ClientProfile />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        {/* Profile Edit route */}
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <LazyRoute>
                <EditProfile />
              </LazyRoute>
            </ProtectedRoute>
          }
        />

        {/* Public profile routes */}
        <Route path="/artist/:slug" element={
          <LazyRoute>
            <PublicArtistProfile />
          </LazyRoute>
        } />

        {/* Auth routes */}
        <Route path="/forgot-password" element={
          <LazyRoute>
            <ForgotPasswordPage />
          </LazyRoute>
        } />
        <Route path="/auth/forgot-password" element={
          <LazyRoute>
            <ForgotPasswordPage />
          </LazyRoute>
        } />
        
        {/* Registration verification route */}
        <Route path="/auth/verify-registration" element={
          <LazyRoute>
            <RegisterVerificationPage />
          </LazyRoute>
        } />
        
        {/* Password reset verification route */}
        <Route path="/auth/verify-forgot-password" element={
          <LazyRoute>
            <ForgotPasswordVerificationPage />
          </LazyRoute>
        } />
        
        {/* Legacy magic link routes (keep for backward compatibility) */}
        <Route path="/verify-magic-link" element={
          <LazyRoute>
            <MagicLinkVerificationPage />
          </LazyRoute>
        } />
        <Route path="/auth/verify-magic-link" element={
          <LazyRoute>
            <MagicLinkVerificationPage />
          </LazyRoute>
        } />
        
        <Route path="/verify-otp" element={
          <LazyRoute>
            <OTPVerificationPage />
          </LazyRoute>
        } />
        <Route path="/check-email" element={
          <LazyRoute>
            <CheckEmailPage />
          </LazyRoute>
        } />
        <Route path="/change-password" element={
          <LazyRoute>
            <ChangePasswordPage />
          </LazyRoute>
        } />

        {/* Public Artist Profile Routes (GitHub-style) - Must be last due to catch-all nature */}
        <Route path="/:slug" element={
          <LazyRoute>
            <PublicArtistProfile />
          </LazyRoute>
        } />

        {/* Catch-all route for 404 errors */}
        <Route path="*" element={
          <LazyRoute>
            <NotFoundPage />
          </LazyRoute>
        } />
      </Routes>
      
      {/* Performance Monitor - Only shows in development */}
      <PerformanceMonitor />
    </div>
  )
}

export default App
