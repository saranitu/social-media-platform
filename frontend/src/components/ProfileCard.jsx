import { useState } from 'react';
import useAuthStore from '../store/authStore';

const ProfileCard = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    profilePhoto: profile?.profilePhoto || '',
  });
  const { updateProfile } = useAuthStore();

  const handleSave = async () => {
    await updateProfile(editData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <div className="flex gap-8">
        {/* Profile Photo */}
        <div>
          <img
            src={profile?.profilePhoto || 'https://via.placeholder.com/150'}
            alt={profile?.username}
            className="w-40 h-40 rounded-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) =>
                    setEditData({ ...editData, bio: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">{profile?.username}</h1>
              <p className="text-gray-600 mb-4">{profile?.bio}</p>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Unique ID Code</p>
                <p className="text-2xl font-bold text-blue-600">#{profile?.uniqueCode}</p>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{profile?.postsCount || 0}</p>
                  <p className="text-gray-600">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile?.followers?.length || 0}</p>
                  <p className="text-gray-600">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile?.following?.length || 0}</p>
                  <p className="text-gray-600">Following</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
