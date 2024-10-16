import React from 'react';

import Logo from '../../assets/logo.png';
import { footerLinks, legalLinks } from '../../utils/navbarLinks';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaLocationArrow,
  FaMobileScreen,
  FaTwitter,
} from 'react-icons/fa6';

const Footer = () => {
  return (
    <div className='text-white bg-primary'>
      <div className='container'>
        <div className='grid md:grid-cols-3 pt-5'>
          <div className='py-8 px-4'>
            <h1 className='sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3'>
              <img src={Logo} alt='logo' className='max-w-[50px]' />
              Envision
            </h1>
            <p>Discover the best in Classical & Modern Art</p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10'>
            <div>
              <div className='py-8 px-4'>
                <h1 className='text-xl font-bold sm:text-left text-justify mb-3'>
                  Links
                </h1>
                <ul className='flex flex-col gap-3'>
                  {footerLinks.map((item, idx) => (
                    <li
                      key={idx}
                      className='cursor-pointer hover:text-secondary hover:translate-x-1 duration-300'
                    >
                      <Link to={item.link}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className='py-8 px-4'>
                <h1 className='text-xl font-bold sm:text-left text-justify mb-3'>
                  Legal
                </h1>
                <ul className='flex flex-col gap-3'>
                  {legalLinks.map((item, idx) => (
                    <li
                      key={idx}
                      className='cursor-pointer hover:text-secondary hover:translate-x-1 duration-300'
                    >
                      <Link to={item.link}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className='flex items-center gap-3 mt-8'>
                <a href='#'>
                  <FaInstagram className='text-3xl' />
                </a>
                <a href='#'>
                  <FaFacebook className='text-3xl' />
                </a>
                <a href='#'>
                  <FaTwitter className='text-3xl' />
                </a>
              </div>
              <div className='mt-6'>
                <div className='flex gap-3 items-center'>
                  <FaLocationArrow />
                  <p>Belgrade, Serbia</p>
                </div>
                <div className='flex gap-3 items-center'>
                  <FaMobileScreen />
                  <p>+381 61 234 567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
