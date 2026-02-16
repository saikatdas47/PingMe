import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext.jsx";

const ProfilePage = () => {

  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || 'UserName');
  const [bio, setBio] = useState(authUser?.bio || "Hi everyone.");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate('/')
      return
    }
    const render = new FileReader();
    render.readAsDataURL(selectedImg);

    render.onload = async () => {
      const base64Image = render.result;
      await updateProfile({ fullName: name, bio, profilePic: base64Image });
      navigate('/')
    }

  }



  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center bg-[#12141e]/90">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-200 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile Details</h3>
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input onChange={(e) => { setSelectedImg(e.target.files[0]) }} type="file" name="" id="avatar" accept=".png, .jpg, .jpeg" hidden />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : (authUser?.profilePic || assets.avatar_icon)
              }
              alt="avatar"
              className={`w-20 h-20 ${(selectedImg || authUser?.profilePic) ? "rounded-full" : ""}`}
            />
            Upload Profile Image
          </label>
          <input onChange={(e) => { setName(e.target.value) }} value={name}
            type="text" required placeholder="Your Name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violate-500" />

          <textarea onChange={(e) => { setBio(e.target.value) }} value={bio}
            placeholder="write profile bio" required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violate-500" rows={4}></textarea>

          <button type="submit" className="bg-gradient-to-r from-[#077eff] to-[#a156ff] text-white p-2 rounded-full text-lg cursor-pointer  shadow-lg hover:brightness-110">Save</button>
        </form>

        <img
          src={selectedImg
            ? URL.createObjectURL(selectedImg)
            : (authUser?.profilePic || assets.avatar_icon)}
          alt="logo"
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 rounded-lg"
        />
      </div>
    </div>
  );
};

export default ProfilePage;