import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoveUp, MoveDown, Plus } from 'lucide-react';

import { useSearchTerm } from '../../hooks/useSearchTerm.hook';
import { useExhibitStore } from '../../store/exhibitStore';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinnerSimple from '../shared/LoadingSpinnerSimple';

const ExhibitsList = ({
  overhead,
  heading,
  paragraph,
  limit,
  paginate = false,
  search = false,
  ordering = false,
}) => {
  const pageSize = limit ? limit : 10;
  const [filteredExhibits, setFilteredExhibits] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const searchTerm = useSearchTerm();
  const [orderDirection, setOrderDirection] = useState('asc');
  const { getUpcomingExhibits, isLoading, error } = useExhibitStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleChangeOrder = async () => {
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleShowMore = async () => {
    try {
      let searchT = search ? searchTerm : '';
      const response = await getUpcomingExhibits(
        `${filteredExhibits.length}`,
        `${pageSize}`,
        orderDirection,
        searchT
      );
      let moreExhibits = response.exhibits;
      setFilteredExhibits((prev) => [...prev, ...moreExhibits]);

      if (filteredExhibits?.length + moreExhibits.length < response.filtred) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        let searchT = search ? searchTerm : '';
        const response = await getUpcomingExhibits(
          '0',
          `${pageSize}`,
          orderDirection,
          searchT
        );
        setFilteredExhibits(response.exhibits);

        if (response.exhibits?.length < response.filtred) {
          setShowMore(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchExhibits();
  }, [orderDirection, pageSize, searchTerm]);

  if (error) {
    return (
      <div className='w-full text-red-500 font-bold flex items-center justify-center'>
        {error}
      </div>
    );
  }

  return (
    <div className='mt-14 mb-12'>
      <div className='container'>
        <div className='text-center mb-10 max-w-[600px] mx-auto'>
          <p data-aos='fade-up' className='text-sm text-primary font-semibold'>
            {overhead}
          </p>
          <h1 data-aos='fade-up' className='text-3xl font-bold'>
            {heading}
          </h1>
          <p data-aos='fade-up' className='text-xs text-gray-400'>
            {paragraph}
          </p>
        </div>

        <div className='mb-10'>
          <div
            data-aos='fade-up'
            className='cursor-pointer flex justify-between'
          >
            {ordering && (
              <>
                {orderDirection === 'asc' ? (
                  <div
                    onClick={handleChangeOrder}
                    className='flex items-center gap-2 text-primary border-orange-500 border-2 rounded-md p-2 w-36 hover:bg-orange-500 hover:text-white'
                  >
                    <MoveUp size={20} />
                    <span>Most Recent</span>
                  </div>
                ) : (
                  <div
                    onClick={handleChangeOrder}
                    className='flex items-center gap-2 text-primary border-orange-500 border-2 rounded-md p-2 w-32 hover:bg-orange-500 hover:text-white'
                  >
                    <MoveDown size={20} />
                    <span>Furthest</span>
                  </div>
                )}
              </>
            )}

            {user?.isAdmin && (
              <>
                <div
                  onClick={() => {
                    navigate('/admin/create-exhibit');
                  }}
                  className='flex items-center gap-2 text-primary border-orange-500 border-2 rounded-md p-2 w-32 hover:bg-orange-500 hover:text-white'
                >
                  <Plus size={20} />
                  <span>Add New</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5'>
            {isLoading ? (
              <LoadingSpinnerSimple />
            ) : filteredExhibits.length > 0 ? (
              <>
                {filteredExhibits.map((exhibit) => (
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
                        <p className='text-sm text-gray-600'>
                          {exhibit.artist}
                        </p>
                        <div className='flex justify-between text-gray-400'>
                          <p className='text-xs italic'>
                            {exhibit.category?.name}
                          </p>
                          <p className='text-xs'></p>
                        </div>
                        <div className='flex justify-between text-gray-400 text-xs'>
                          <p>
                            {new Date(exhibit.startDate).toLocaleDateString()}
                          </p>
                          <p>-</p>
                          <p>
                            {new Date(exhibit.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <div>No results</div>
            )}
          </div>
        </div>

        {paginate && showMore && (
          <div className='flex items-center justify-center gap-4 mt-10'>
            <button
              className='bg-orange-500 text-white rounded-md px-2 py-1 hover:bg-amber-500'
              type='button'
              onClick={handleShowMore}
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExhibitsList;
