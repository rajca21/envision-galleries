import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useTicketStore } from '../../store/ticketStore';
import LoadingSpinnerSimple from '../shared/LoadingSpinnerSimple';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const { getAllTickets, isLoading, error } = useTicketStore();

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const res = await getAllTickets();
        setTickets(res.data.tickets);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllTickets();
  }, []);

  return (
    <div className='my-10'>
      <div className='container max-w-4xl'>
        <div className='text-center mb-10 max-w-[600px] mx-auto'>
          <h1 data-aos='fade-up' className='text-3xl font-bold'>
            All Tickets
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
      ) : tickets.length > 0 ? (
        <>
          <div className='flex w-full justify-center'>
            <div className='flex flex-col gap-2 '>
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className='flex items-center gap-10 justify-between'
                >
                  <Link to={`/exhibits/${ticket?.exhibit?._id}`}>
                    <img
                      src={ticket?.exhibit?.thumbnail}
                      alt={ticket?.exhibit?.title}
                      className='w-20'
                    />
                  </Link>
                  <div className='flex flex-col w-80'>
                    <Link to={`/exhibits/${ticket?.exhibit?._id}`}>
                      <p className='text-xl font-bold line-clamp-1'>
                        {ticket?.exhibit?.title}
                      </p>
                    </Link>
                    <p>
                      Start Date:{' '}
                      <span className='font-semibold'>
                        {' '}
                        {new Date(
                          ticket?.exhibit?.startDate
                        ).toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      End Date:{' '}
                      <span className='font-semibold'>
                        {new Date(
                          ticket?.exhibit?.endDate
                        ).toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      Purchased At:{' '}
                      <span className='font-semibold'>
                        {' '}
                        {new Date(ticket?.purchaseDate).toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      Purchased By:{' '}
                      <span className='font-semibold'>
                        {' '}
                        {ticket?.user?.name} ({ticket?.user?.email})
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className='my-10 w-full flex items-center justify-center font-semibold text-2xl'>
          No Tickets yet!
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
