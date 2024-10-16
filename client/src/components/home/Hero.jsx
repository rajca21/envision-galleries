import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

import Hero1 from '../../assets/hero/hero1.webp';
import Hero2 from '../../assets/hero/hero2.avif';
import Hero3 from '../../assets/hero/hero3.jpg';

const imageList = [
  {
    img: Hero1,
    title: 'Envision',
    description: 'Discover the best in Classical & Modern Art',
  },
  {
    img: Hero2,
    title: 'Envision',
    description: 'Discover the best in Classical & Modern Art',
  },
  {
    img: Hero3,
    title: 'Envision',
    description: 'Discover the best in Classical & Modern Art',
  },
];

const Hero = () => {
  const navigate = useNavigate();

  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'ease-in-out',
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className='realtive overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center'>
      <div className='h-[700px] w-[700px] bg-primary absolute -top-1/2 right-30 rounded-3xl rotate-45 -z-9'></div>
      <div className='container pb-8 sm:pb-0'>
        <Slider {...settings}>
          {imageList.map((image, idx) => (
            <div key={idx}>
              <div className='grid grid-cols-1 sm:grid-cols-2'>
                <div className='flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10'>
                  <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold'>
                    {image.title}
                  </h1>
                  <p className='text-sm'>{image.description}</p>
                  <div>
                    <button
                      type='button'
                      onClick={() => navigate('/exhibits')}
                      className='bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full'
                    >
                      Explore
                    </button>
                  </div>
                </div>

                <div className='order-1 sm:order-2'>
                  <div className='relative z-10'>
                    <img
                      src={image.img}
                      alt={image.title}
                      className='w-[250] h-[300] sm:w-[300px] sm:h-[340px] sm:scale-125 lg:scale-120 object-contain mx-auto'
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
