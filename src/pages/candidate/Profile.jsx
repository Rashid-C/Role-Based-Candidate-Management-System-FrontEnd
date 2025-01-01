import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { candidateAPI } from "../../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await candidateAPI.getProfile();
      setProfile(response.data.data);
      if (response.data.data.profilePicture) {
        setPreviewImage(response.data.data.profilePicture);
      }
    } catch (error) {
      toast.error("Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (type === "profilePicture") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }

    const formData = new FormData();
    formData.append(
      type === "profilePicture" ? "profilePicture" : "resume",
      file
    );

    setUploading(true);
    try {
      const response = await (type === "profilePicture"
        ? candidateAPI.uploadProfilePicture(formData)
        : candidateAPI.uploadResume(formData));

      setProfile((prev) => ({
        ...prev,
        [type]: response.data.data[type],
      }));
      toast.success(
        `${
          type === "profilePicture" ? "Profile picture" : "Resume"
        } uploaded successfully`
      );
    } catch (error) {
      toast.error("Error uploading file");
      if (type === "profilePicture") {
        setPreviewImage(profile?.profilePicture || null);
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8 border-b">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative w-32 h-32 mb-4 sm:mb-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewImage(null)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl text-gray-400">
                        {profile?.fullName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "profilePicture")}
                    disabled={uploading}
                  />
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </label>
              </div>
              <div className="ml-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.fullName}
                </h1>
                <p className="text-gray-500">{profile?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Mobile:</span>{" "}
                    {profile?.mobile}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span>{" "}
                    {profile?.address}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Resume
                </h3>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, "resume")}
                      disabled={uploading}
                    />
                    {uploading ? "Uploading..." : "Upload Resume"}
                  </label>
                  {profile?.resume && (
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Resume
                    </a>
                  )}
                </div>
              </div>
            </div>

            {profile?.skills?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
