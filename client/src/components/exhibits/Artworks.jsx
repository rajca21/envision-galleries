import React, { useEffect, useState } from 'react';

import { getArtworks } from '../../utils/artsyApi';
import LoadingSpinnerSimple from '../shared/LoadingSpinnerSimple';

const Artworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArtworskFromAPI = async () => {
      try {
        setError(false);
        setIsLoading(true);

        const res = await getArtworks();
        setArtworks(res);

        setIsLoading(false);
      } catch (error) {
        setError(true);
        console.error(error);
      }
    };

    fetchArtworskFromAPI();
  }, []);

  return (
    <div className='mt-14 mb-12' data-aos='fade-up'>
      <div className='container'>
        <div className='text-center mb-28'>
          <p data-aos='fade-up' className='text-sm text-primary font-semibold'>
            Artworks from ArtSy
          </p>
          <h1 data-aos='fade-up' className='text-3xl font-bold'>
            Trending Artworks
          </h1>
          <p data-aos='fade-up' className='text-xs text-gray-400'>
            Explore some of the popular artworks from ArtSy
          </p>
        </div>

        {error ? (
          <div className='w-full flex items-center justify-center py-2 text-red-500 font-semibold'>
            Something went wrong with fetching artworks from API!
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5'>
            {isLoading ? (
              <LoadingSpinnerSimple />
            ) : (
              <>
                {artworks?.map((artwork, idx) => (
                  <div
                    data-aos='fade-up'
                    data-aos-delay={200}
                    key={idx}
                    className='space-y-3'
                  >
                    <img
                      src={artwork?._links?.thumbnail?.href}
                      alt={artwork?.title}
                      className='h-[220px] w-[150px] object-cover rounded-md'
                    />

                    <div className='w-[150px]'>
                      <h3 className='font-semibold line-clamp-1'>
                        {artwork?.title}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {artwork?.collecting_institution}
                      </p>
                      <div className='flex justify-between text-gray-400'>
                        <p className='text-xs italic'>{artwork?.medium}</p>
                        <p className='text-xs'></p>
                      </div>
                      <div className='flex justify-between text-gray-400 text-xs'>
                        <p>{artwork?.category}</p>
                        <p>{artwork?.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artworks;
