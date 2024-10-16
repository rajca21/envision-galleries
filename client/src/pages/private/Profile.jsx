import React, { useEffect, useState } from 'react';

import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import LoadingSpinnerSimple from '../../components/shared/LoadingSpinnerSimple';
import { Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const [tickets, setTickets] = useState([]);
  const { user } = useAuthStore();
  const { getMyTickets, deleteTicket, isLoading, error } = useTicketStore();

  const fetchUsersTickets = async () => {
    try {
      const res = await getMyTickets();
      setTickets(res.data.tickets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user?.isAdmin) {
      fetchUsersTickets();
    }
  }, [user]);

  const handleDelete = async (id) => {
    try {
      const res = await deleteTicket(id);

      if (res.data.success) {
        toast.success('Ticket cancelled');
        await fetchUsersTickets();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='my-10'>
      <div className='container max-w-4xl'>
        <div className='text-center mb-10 max-w-[600px] mx-auto'>
          <p data-aos='fade-up' className='text-sm text-primary font-semibold'>
            User Profile
          </p>
          <h1 data-aos='fade-up' className='text-3xl font-bold'>
            {user?.name}
          </h1>
          <p data-aos='fade-up' className='text-xs text-gray-400'>
            {user?.email}
          </p>
        </div>
      </div>

      {user?.isAdmin ? (
        <></>
      ) : isLoading ? (
        <div className='my-10 w-full flex items-center justify-center'>
          <LoadingSpinnerSimple />
        </div>
      ) : error ? (
        <div className='my-10 w-full flex items-center justify-center text-red-500 font-semibold text-2xl'>
          {error}
        </div>
      ) : tickets.length > 0 ? (
        <>
          <h2 className='text-center mt-20 mb-5 font-bold text-2xl'>
            My Tickets
          </h2>
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
                  </div>
                  <button
                    className='text-white bg-red-500 p-4 rounded-full border-white border-2 hover:text-red-500 hover:bg-white hover:border-red-500 hover:border-2 cursor-pointer
                  disabled:bg-gray-100 disabled:text-gray-500 disabled:border-none disabled:cursor-not-allowed'
                    type='button'
                    onClick={() => handleDelete(ticket?._id)}
                    disabled={new Date(ticket?.exhibit?.endDate) < new Date()}
                  >
                    <Trash />
                  </button>
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

export default Profile;
