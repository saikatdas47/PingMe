import React from 'react'
import assets, { imagesDummyData } from '../assets/assets'

const RightSidebar = ({ selectedUser }) => {

  return selectedUser ? (
    <div className='bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden'>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="ProfilePic"
          className='w-20 aspect-square rounded-full object-cover'
        />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto text-center'>
          {selectedUser.bio}
        </p>
      </div>

      <hr className='mt-5 border-[#ffffff33] mb-5' />

      <div className='px-5 text-xs'>
        <p className='font-medium mb-2'>Media</p>
        {/* Fixed grid-cols-3 (changed from grid-col-2) and added implicit return */}
        <div className='max-h-[200px] overflow-y-scroll grid grid-cols-3 gap-2 opacity-80'>
          {imagesDummyData.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url)}
              className='cursor-pointer rounded overflow-hidden'
            >
              <img src={url} alt="media" className='w-full aspect-square object-cover' />
            </div>
          ))}
        </div>
      </div>


      <button className='absolute bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#077eff] to-[#a156ff] text-white border-none text-sm font-medium py-2.5 px-12 rounded-full cursor-pointer shadow-lg hover:brightness-110 hover:scale-105 transition-all duration-300 active:scale-95 whitespace-nowrap'>
        Logout
      </button>

    </div>

  ) : null
}

export default RightSidebar