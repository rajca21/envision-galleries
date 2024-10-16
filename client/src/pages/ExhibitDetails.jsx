import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader, X } from 'lucide-react';

import { useExhibitStore } from '../store/exhibitStore';
import { useAuthStore } from '../store/authStore';
import { useTicketStore } from '../store/ticketStore';
import { generateQRCode } from '../utils/qrCode';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const ExhibitDetails = () => {
  const [exhibit, setExhibit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const { getExhibit, isLoading, error } = useExhibitStore();
  const { user } = useAuthStore();
  const {
    createTicket,
    isLoading: ticketLoading,
    error: ticketError,
  } = useTicketStore();

  useEffect(() => {
    const fetchExhibit = async () => {
      try {
        const res = await getExhibit(id);
        setExhibit(res.exhibit);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchExhibit();
    }
  }, [id]);

  const handleGetTicket = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.isAdmin) {
      toast.error("You can't purchase tickets!");
      return;
    }

    try {
      const qrCode = await generateQRCode(
        JSON.stringify({
          exhibit: exhibit?.title,
          startDate: new Date(exhibit?.startDate).toLocaleDateString(),
          endDate: new Date(exhibit?.endDate).toLocaleDateString(),
          artist: exhibit?.artist,
          purchasedAt: new Date().toLocaleDateString(),
          owner: user?.name,
          ownerMail: user?.email,
        })
      );

      const res = await createTicket({
        user: user,
        exhibit: exhibit,
        qrCode: qrCode,
      });

      if (res.data.success) {
        toast.success('Ticket purchased successfully! Check your email');
      } else {
        toast.error('Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      toast.error(ticketError);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className='w-full text-red-500 font-bold flex items-center justify-center'>
        {error}
      </div>
    );
  }

  return (
    <div className='my-10'>
      <div className='container max-w-4xl'>
        <div className='text-center mb-10 max-w-[600px] mx-auto'>
          <p data-aos='fade-up' className='text-sm text-primary font-semibold'>
            {exhibit?.artist}
          </p>
          <h1 data-aos='fade-up' className='text-3xl font-bold'>
            {exhibit?.title}
          </h1>
          <p data-aos='fade-up' className='text-xs text-gray-400'>
            {exhibit?.category.name}
          </p>
        </div>

        <div className='flex gap-10'>
          <div className='flex-1 flex flex-col gap-2'>
            <img
              data-aos='fade-up'
              src={exhibit?.thumbnail}
              alt={exhibit?.title}
              className='cursor-pointer'
              onClick={() => {
                setModalOpen(true);
                setSelectedImage(exhibit?.thumbnail);
              }}
            />
            <div
              className={`flex gap-2 ${
                exhibit?.paintings?.length > 4 && 'flex-wrap'
              }`}
            >
              {exhibit?.paintings?.map((painting, idx) => (
                <img
                  src={painting}
                  alt={`painting${idx}`}
                  key={idx}
                  className={`w-24 ${idx > 0 ? 'blur-sm' : 'cursor-pointer'}`}
                  onClick={() => {
                    if (idx === 0) {
                      setModalOpen(true);
                      setSelectedImage(painting);
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <div className='flex-1 flex justify-center'>
            <div className='w-full'>
              <p className='text-xl flex justify-between'>
                Start Date:{' '}
                <span className='font-bold'>
                  {new Date(exhibit?.startDate).toLocaleDateString()}
                </span>
              </p>
              <p className='text-xl flex justify-between'>
                End Date:{' '}
                <span className='font-bold'>
                  {new Date(exhibit?.endDate).toLocaleDateString()}
                </span>
              </p>

              <div className='py-4'></div>
              <p className='text-xs text-gray-600'>{exhibit?.description}</p>

              {new Date(exhibit?.endDate) > new Date() && (
                <button
                  className='mt-10 w-full bg-orange-500 text-white rounded-md py-2 font-bold
                    hover:bg-white hover:text-orange-500 hover:border-orange-500 hover:border-2
                '
                  onClick={handleGetTicket}
                  disabled={ticketLoading}
                >
                  {ticketLoading ? (
                    <Loader className='w-6 h-6 animate-spin mx-auto' />
                  ) : (
                    'Get Ticket'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50'>
          <div className='relative'>
            <button
              onClick={() => {
                setModalOpen(false);
                setSelectedImage(null);
              }}
              className='absolute top-0 right-0 mt-2 mr-2 bg-white rounded-full border-orange-500 border-2'
            >
              <X size={30} color='#fb923c' />
            </button>
            <img
              src={selectedImage}
              alt='zoomedin'
              className='max-w-full max-h-screen'
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitDetails;
