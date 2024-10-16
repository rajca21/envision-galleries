import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  LetterText,
  Loader,
  Palette,
  Plus,
  Text,
} from 'lucide-react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import toast from 'react-hot-toast';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { app } from '../../utils/firebaseConfig';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useExhibitStore } from '../../store/exhibitStore';
import LoadingSpinnerSimple from '../../components/shared/LoadingSpinnerSimple';
import Input from '../../components/shared/Input';

const CreateExhibit = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('');
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const [paintings, setPaintings] = useState([]);
  const [paintingsError, setPaintingsError] = useState(null);
  const [paintingsLoading, setPaintingsLoading] = useState(false);

  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const { getCategories, isLoading: categoryLoading } = useCategoriesStore();

  const { createExhibit, isLoading: exhibitLoading } = useExhibitStore();
  const navigate = useNavigate();

  const handleCreateExhibit = async (e) => {
    e.preventDefault();

    try {
      if (title.trim() === '') {
        toast.error('Title is required!');
        return;
      }
      if (description.trim() === '') {
        toast.error('Description is required!');
        return;
      }
      if (artist.trim() === '') {
        toast.error('Artist is required!');
        return;
      }
      if (dates[0].startDate === dates[0].endDate) {
        toast.error('Select a valid date range!');
        return;
      }

      await createExhibit({
        thumbnail: fileUrl,
        title,
        description,
        artist,
        startDate: new Date(dates[0].startDate),
        endDate: new Date(dates[0].endDate),
        paintings,
        category,
      });

      toast.success('Exhibit created successfully');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // uploading file (thumbnail)
    const uploadImage = async () => {
      try {
        setFileLoading(true);

        const storage = getStorage(app);
        const fileName = new Date().getTime() + '-' + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            setFileError(
              'Could not upload image (File must be an image of the size less than 2MB)'
            );
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFileUrl(downloadURL);
              setFileLoading(false);
            });
          }
        );
      } catch (error) {
        setFileError('Something went wrong while uploading the image!');
        setFileLoading(false);
        console.error(error);
      }
    };

    if (file) {
      uploadImage();
    }
  }, [file]);

  const insertIntoGallery = async (galleryFile) => {
    try {
      setPaintingsLoading(true);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + galleryFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, galleryFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          setPaintingsError(
            'Could not upload image (File must be an image of the size less than 2MB)'
          );
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setPaintings((prev) => [...prev, downloadURL]);
            setPaintingsLoading(false);
          });
        }
      );
    } catch (error) {
      setPaintingsError('Something went wrong while uploading the image!');
      setPaintingsLoading(false);
      console.error(error);
    }
  };

  const handleRemoveImage = (idx) => {
    let newPaintings = paintings.splice(idx, 1);
    setPaintings(newPaintings);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();
      setAllCategories(response.categories);
      setCategory(response.categories[0]?._id);
    };

    fetchCategories();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className='max-w-xl w-full mx-auto my-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
    >
      <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-amber-600 text-transparent bg-clip-text'>
        Add new Exhibit
      </h2>

      <div className='space-y-6'>
        <motion.div
          className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleCreateExhibit}>
            {/* THUMBNAIL START */}
            <div className='w-full cursor-pointer flex flex-col gap-2 justify-center items-center'>
              <h2 className='text-white font-bold cursor-default'>Thumbnail</h2>
              {fileLoading ? (
                <LoadingSpinnerSimple />
              ) : (
                <>
                  <label htmlFor='thumbnail'>
                    <img
                      src={
                        fileUrl ||
                        'https://firebasestorage.googleapis.com/v0/b/envision-gallery.appspot.com/o/file.jpg?alt=media&token=a575f16a-8023-4be5-9ecf-acccc5712e2d'
                      }
                      alt='thumbnail'
                      className='border-4 border-gray-100 w-full rounded-md shadow-lg cursor-pointer hover:border-orange-400'
                    />
                  </label>
                  <input
                    type='file'
                    id='thumbnail'
                    name='thumbnail'
                    accept='image/*'
                    disabled={fileLoading}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  {fileError && (
                    <span className='text-red-500'>{fileError}</span>
                  )}
                </>
              )}
            </div>
            {/* THUMBNAIL END */}
            <div className='py-4'></div>
            {/* TEXT FIELDS (title, description, artist) START */}
            <Input
              icon={LetterText}
              type='text'
              placeholder='Exhibit Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              icon={Text}
              type='text'
              placeholder='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              icon={Palette}
              type='text'
              placeholder='Artist'
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
            {/* TEXT FIELDS END */}

            {/* DATES START */}
            <div className='flex flex-col gap-2 justify-center'>
              <h2 className='text-white text-center font-bold cursor-default'>
                Pick Dates
              </h2>
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDates([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dates}
                className='date'
                rangeColors={['#f97316', '#f59e0b', '#eab308']}
                minDate={new Date()}
              />
            </div>
            {/* DATES END */}
            <div className='py-4'></div>
            {/* PAINTINGS GALLERY START */}
            <div className='flex flex-col gap-2 justify-center'>
              <h2 className='text-white text-center font-bold cursor-default'>
                Paintings Gallery
              </h2>

              {paintingsLoading ? (
                <LoadingSpinnerSimple />
              ) : (
                <div className='flex flex-wrap gap-2'>
                  <div>
                    <label htmlFor='gallery'>
                      <div className='flex justify-center items-center bg-gray-600 rounded-md w-28 h-28 text-orange-500 border-orange-500 border-2 cursor-pointer'>
                        <Plus size={50} />
                      </div>
                    </label>
                    <input
                      type='file'
                      id='gallery'
                      name='gallery'
                      accept='image/*'
                      disabled={fileLoading}
                      onChange={(e) => {
                        insertIntoGallery(e.target.files[0]);
                      }}
                    />
                  </div>

                  {paintings.map((painting, idx) => (
                    <div
                      key={idx}
                      className='w-28 h-28 rounded-md border-orange-500 border-2'
                    >
                      <img
                        src={painting}
                        className='w-full h-full rounded-sm cursor-pointer'
                        alt={`painting-${idx + 1}`}
                        onClick={() => handleRemoveImage(idx)}
                      />
                    </div>
                  ))}

                  {paintingsError && (
                    <span className='text-red-500'>{paintingsError}</span>
                  )}
                </div>
              )}
            </div>
            {/* PAINTINGS GALLERY END */}
            <div className='py-4'></div>
            {/* CATEGORY START */}
            <div className='flex flex-col gap-2 justify-center'>
              <h2 className='text-white text-center font-bold cursor-default'>
                Category
              </h2>
              {categoryLoading ? (
                <LoadingSpinnerSimple />
              ) : (
                <>
                  {allCategories && (
                    <select
                      className='w-full bg-gray-800 text-white rounded-lg border-gray-200 p-2'
                      value={category || allCategories[0]?._id}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {allCategories.map((cat) => (
                        <option
                          key={cat._id}
                          className='text-white'
                          value={cat._id}
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </>
              )}
            </div>
            {/* CATEGORY END */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='mt-4'
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type='submit'
                className='w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-amber-700
				 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                disabled={
                  fileLoading ||
                  paintingsLoading ||
                  categoryLoading ||
                  exhibitLoading
                }
              >
                {fileLoading ||
                paintingsLoading ||
                categoryLoading ||
                exhibitLoading ? (
                  <Loader className='w-6 h-6 animate-spin mx-auto' />
                ) : (
                  'Submit'
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      <div
        onClick={() => navigate('/')}
        className='flex w-full justify-center items-center gap-2 cursor-pointer text-gray-200 mt-8'
      >
        <ArrowLeft />
        Back
      </div>
    </motion.div>
  );
};

export default CreateExhibit;
