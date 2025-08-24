"use client"

import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthNavbar from "../../components/layout/AuthNavbar"
import CreateJobPostForm from "../../components/marketplace/CreateJobPostForm"

const CreateJobPost = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (postData) => {
    setIsSubmitting(true)
    try {
      // The form handles the actual submission
      console.log("Job post created:", postData)

      // Navigate back to marketplace with jobs tab active
      navigate("/marketplace?type=jobs&section=jobs")
    } catch (error) {
      console.error("Error creating job post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/marketplace?type=jobs&section=jobs")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />

      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/marketplace?type=jobs&section=jobs")}
              className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </button>

            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Post a Job
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Find the perfect artist for your project</p>
            </div>
          </div>

          {/* Form */}
          <CreateJobPostForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  )
}

export default CreateJobPost
