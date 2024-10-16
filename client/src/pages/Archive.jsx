import React, { useEffect, useState } from 'react';

import { useExhibitStore } from '../store/exhibitStore';
import LoadingSpinnerSimple from '../components/shared/LoadingSpinnerSimple';
import { Link } from 'react-router-dom';

const Archive = () => {
  const [archivedExhibits, setArchivedExhibits] = useState([]);
  const { getArchivedExhibits, isLoading, error } = useExhibitStore();

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const res = await getArchivedExhibits();
        setArchivedExhibits(res.exhibits);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArchive();
  }, []);

  return (
    <div className='mt-14 mb-12'>
      <div className='container'>
        <div className='text-center mb-10 max-w-[600px] mx-auto'>
          <p data-aos='fade-up' className='text-sm text-primary font-semibold'>
            Archive
          </p>
          <h1 data-aos='fade-up' className='text-3xl font-bold'>
            Previous Exhibits
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className='my-10 w-full flex items-center justify-center'>
          <LoadingSpinnerSimple />
        </div>
      ) : error ? (
        <div className='my-10 w-full flex items-center justify-center text-red-500 font-semibold text-2xl'>
          {error}
        </div>
      ) : archivedExhibits.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5'>
          {archivedExhibits.map((exhibit) => (
            <Link to={`/exhibits/${exhibit._id}`} key={exhibit._id}>
              <div
                data-aos='fade-up'
                data-aos-delay={200}
                className='space-y-3'
              >
                <img
                  src={exhibit.thumbnail}
                  alt={exhibit.title}
                  className='h-[220px] w-[150px] object-cover rounded-md hover:scale-105 duration-300'
                />
                <div className='w-[150px]'>
                  <h3 className='font-semibold line-clamp-1'>
                    {exhibit.title}
                  </h3>
                  <p className='text-sm text-gray-600'>{exhibit.artist}</p>
                  <div className='flex justify-between text-gray-400'>
                    <p className='text-xs italic'>{exhibit.category?.name}</p>
                    <p className='text-xs'></p>
                  </div>
                  <div className='flex justify-between text-gray-400 text-xs'>
                    <p>{new Date(exhibit.startDate).toLocaleDateString()}</p>
                    <p>-</p>
                    <p>{new Date(exhibit.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className='my-10 w-full flex items-center justify-center font-semibold text-2xl'>
          No Archived Exhibits Yet!
        </div>
      )}
    </div>
  );
};

export default Archive;
