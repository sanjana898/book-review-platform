"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { usersAPI } from "../services/api"
import toast from "react-hot-toast"
import { User, Mail, FileText, Save } from "lucide-react"

const Profile = () => {
  const { user, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  })
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await usersAPI.update(user._id, formData)
      toast.success("Profile updated successfully!")
      setEditing(false)
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Please login to view your profile</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!editing}
                rows={4}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {editing && (
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    bio: user.bio || "",
                  })
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Profile
