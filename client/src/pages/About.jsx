import React from 'react';

import Logo from '../assets/logo.png';

const About = () => {
  return (
    <div className='h-[80vh]'>
      <div className='flex gap-5 justify-center items-center h-full'>
        <img src={Logo} alt='logo' className='w-1/3 flex-1' />
        <div className='px-20 flex-1'>
          <h1 className='text-3xl font-bold'>Envision</h1>
          <p className='pt-4 max-w-[400px]'>
            we make it our mission to help you discover and attend exhibits of
            the best emerging artists around the world.
          </p>
          <div className='flex gap-10 mt-10'>
            <div className='flex flex-col text-center'>
              <p className='text-2xl font-bold'>2300</p>
              <p className='text-xs uppercase'>Exhibits</p>
            </div>
            <div className='flex flex-col text-center'>
              <p className='text-2xl font-bold'>123</p>
              <p className='text-xs uppercase'>Emerging Artists</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
