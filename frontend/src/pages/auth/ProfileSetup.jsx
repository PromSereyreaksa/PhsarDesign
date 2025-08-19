import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Eye, EyeOff, Upload, ArrowLeft } from "lucide-react"
import Loader from "../../components/ui/Loader"
import { createClientProfile, createFreelancerProfile } from '../../store/actions/authActions';

export default function ProfileSetup() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    location: '',
    avatarUrl: '',
    
    // Client specific
    companyName: '',
    industry: '',
    
    // Freelancer specific
    skills: '',
    availability: 'Available',
    portfolio_images_text: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (user.role === 'client') {
        await dispatch(createClientProfile({
          name: formData.companyName, // Backend expects 'name' field
          organization: formData.industry,
          avatarUrl: formData.avatarUrl
        }));
      } else if (user.role === 'freelancer') {
        await dispatch(createFreelancerProfile({
          name: formData.name,
          skills: formData.skills,
          availability: formData.availability,
          portfolio_images_text: formData.portfolio_images_text,
          avatarUrl: formData.avatarUrl
        }));
      }
      
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              Complete Your Profile
            </CardTitle>
            <p className="text-gray-300">
              {user.role === 'client' ? 'Set up your company profile' : 'Set up your freelancer profile'}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {user.role === 'client' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white">
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-white">
                      Industry *
                    </Label>
                    <Input
                      id="industry"
                      type="text"
                      placeholder="e.g., Technology, Marketing, etc."
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">
                      Location
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter your location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-white">
                      Skills *
                    </Label>
                    <Input
                      id="skills"
                      type="text"
                      placeholder="e.g., React, Node.js, UI/UX Design"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio_images_text" className="text-white">
                      Portfolio Description
                    </Label>
                    <Textarea
                      id="portfolio_images_text"
                      placeholder="Describe your work and experience"
                      value={formData.portfolio_images_text}
                      onChange={(e) => handleInputChange('portfolio_images_text', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                      rows={4}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="avatarUrl" className="text-white">
                  Profile Picture URL (Optional)
                </Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  placeholder="https://example.com/your-photo.jpg"
                  value={formData.avatarUrl}
                  onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl py-3 font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader />
                    <span className="ml-2">Creating Profile...</span>
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}