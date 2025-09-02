import { Bell, Globe, HelpCircle, Palette, Shield, User } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
          
          <div className="grid gap-6">
            {/* Profile Settings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-[#A95BAB]" />
                <h2 className="text-xl font-semibold">Profile Settings</h2>
              </div>
              <p className="text-gray-400">Manage your profile information and preferences.</p>
              <button className="mt-4 px-4 py-2 bg-[#A95BAB] hover:bg-[#8A4A8F] text-white rounded-lg transition-colors">
                Edit Profile
              </button>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-[#A95BAB]" />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              <p className="text-gray-400">Configure how you receive notifications.</p>
              <button className="mt-4 px-4 py-2 bg-[#A95BAB] hover:bg-[#8A4A8F] text-white rounded-lg transition-colors">
                Manage Notifications
              </button>
            </div>

            {/* Privacy & Security */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-[#A95BAB]" />
                <h2 className="text-xl font-semibold">Privacy & Security</h2>
              </div>
              <p className="text-gray-400">Control your privacy and security settings.</p>
              <button className="mt-4 px-4 py-2 bg-[#A95BAB] hover:bg-[#8A4A8F] text-white rounded-lg transition-colors">
                Security Settings
              </button>
            </div>

            {/* Appearance */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-5 h-5 text-[#A95BAB]" />
                <h2 className="text-xl font-semibold">Appearance</h2>
              </div>
              <p className="text-gray-400">Customize your interface appearance.</p>
              <button className="mt-4 px-4 py-2 bg-[#A95BAB] hover:bg-[#8A4A8F] text-white rounded-lg transition-colors">
                Theme Settings
              </button>
            </div>

            {/* Language & Region */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-[#A95BAB]" />
                <h2 className="text-xl font-semibold">Language & Region</h2>
              </div>
              <p className="text-gray-400">Set your language and regional preferences.</p>
              <button className="mt-4 px-4 py-2 bg-[#A95BAB] hover:bg-[#8A4A8F] text-white rounded-lg transition-colors">
                Language Settings
              </button>
            </div>

            {/* Help & Support */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="w-5 h-5 text-[#A95BAB]" />
                <h2 className="text-xl font-semibold">Help & Support</h2>
              </div>
              <p className="text-gray-400">Get help and contact support.</p>
              <button className="mt-4 px-4 py-2 bg-[#A95BAB] hover:bg-[#8A4A8F] text-white rounded-lg transition-colors">
                Help Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
