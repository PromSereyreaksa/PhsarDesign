import { useState } from "react"
import { Button } from "../ui/button"
import { MultiStepApplicationModal } from "../ui/multi-step-application-modal"

/**
 * Example/Demo component showing how to use the MultiStepApplicationModal
 * for both job applications and service contacts
 */
export function ApplicationModalDemo() {
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)

  // Example job post data
  const exampleJobPost = {
    id: 1,
    jobId: 1,
    jobPostId: 1,
    title: "Design a Modern Logo for Tech Startup",
    description: "We're looking for a creative designer to create a modern, minimalist logo for our tech startup. The logo should be versatile and work across digital and print media.",
    category: "Logo Design",
    budget: "$500 - $1,000",
    clientId: 123,
    userId: 123
  }

  // Example artist availability post data
  const exampleArtistPost = {
    id: 2,
    postId: 2,
    availabilityPostId: 2,
    title: "Professional Graphic Designer Available",
    description: "Experienced graphic designer specializing in branding, web design, and illustration. Available for new projects.",
    category: "Graphic Design",
    serviceName: "Graphic Design Services",
    artistId: 456,
    userId: 456
  }

  const handleJobApplicationSuccess = () => {
    console.log("Job application submitted successfully!")
    setIsJobModalOpen(false)
  }

  const handleServiceContactSuccess = () => {
    console.log("Service contact submitted successfully!")
    setIsServiceModalOpen(false)
  }

  return (
    <div className="p-8 space-y-8 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Application Modal Demo
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Job Application Demo */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Job Application (Artist → Client)
            </h2>
            <p className="text-gray-300 mb-4">
              This modal is used when an artist wants to apply for a job posted by a client.
            </p>
            
            <div className="mb-4 p-4 bg-white/5 rounded border border-white/10">
              <h3 className="font-medium text-white mb-2">Example Job Post:</h3>
              <p className="text-gray-300 text-sm">{exampleJobPost.title}</p>
              <p className="text-gray-400 text-xs mt-1">{exampleJobPost.category} • {exampleJobPost.budget}</p>
            </div>

            <Button
              onClick={() => setIsJobModalOpen(true)}
              className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
            >
              Open Job Application Modal
            </Button>

            <div className="mt-4 text-sm text-gray-400">
              <p><strong>Required fields:</strong> Subject, Message (50-2000 chars), Budget (0-100k), Deadline</p>
              <p><strong>Optional fields:</strong> Start Date, Experience, Portfolio, Past Projects, Notes</p>
            </div>
          </div>

          {/* Service Contact Demo */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Service Contact (Client → Artist)
            </h2>
            <p className="text-gray-300 mb-4">
              This modal is used when a client wants to contact an artist for a service.
            </p>
            
            <div className="mb-4 p-4 bg-white/5 rounded border border-white/10">
              <h3 className="font-medium text-white mb-2">Example Artist Service:</h3>
              <p className="text-gray-300 text-sm">{exampleArtistPost.title}</p>
              <p className="text-gray-400 text-xs mt-1">{exampleArtistPost.category}</p>
            </div>

            <Button
              onClick={() => setIsServiceModalOpen(true)}
              className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
            >
              Open Service Contact Modal
            </Button>

            <div className="mt-4 text-sm text-gray-400">
              <p><strong>Required fields:</strong> Subject, Message (20-1500 chars), Budget (0-50k)</p>
              <p><strong>Optional fields:</strong> Deadline, Start Date, Priority (urgent/standard/flexible), Notes</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white/5 rounded-lg p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">
            ✨ Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-white mb-2">Form Validation</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Real-time field validation</li>
                <li>• Character count limits</li>
                <li>• Date validation (no past dates)</li>
                <li>• Budget range validation</li>
                <li>• Required field checking</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">User Experience</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Dark theme consistent styling</li>
                <li>• Success toast notifications</li>
                <li>• Auto-close confirmation screen</li>
                <li>• Clean form reset on close</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mt-8 bg-white/5 rounded-lg p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">
            🔌 API Endpoints
          </h2>
          <div className="space-y-2 text-sm font-mono">
            <div className="text-green-400">POST /api/applications/job</div>
            <div className="text-blue-400">POST /api/applications/service</div>
            <div className="text-yellow-400">GET /api/applications/received</div>
            <div className="text-yellow-400">GET /api/applications/sent</div>
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      <MultiStepApplicationModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        post={exampleJobPost}
        applicationType="artist_to_job"
        onSuccess={handleJobApplicationSuccess}
      />

      {/* Service Contact Modal */}
      <MultiStepApplicationModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        post={exampleArtistPost}
        applicationType="client_to_service"
        onSuccess={handleServiceContactSuccess}
      />
    </div>
  )
}
