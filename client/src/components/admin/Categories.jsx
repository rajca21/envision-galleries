import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader, Pencil, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

import { useCategoriesStore } from '../../store/categoriesStore';
import LoadingSpinnerSimple from '../shared/LoadingSpinnerSimple';
import Input from '../shared/Input';

const Categories = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [editedCategoryId, setEditedCategoryId] = useState(null);
  const [editedField, setEditedField] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const {
    getCategories,
    updateCategory,
    createCategory,
    deleteCategory,
    error,
    isLoading,
  } = useCategoriesStore();

  const handleUpdateCategory = async () => {
    try {
      if (editedField === '') {
        await deleteCategory(editedCategoryId);
        let newCategories = allCategories.filter((category) => {
          return category._id !== editedCategoryId;
        });
        setAllCategories(newCategories);
        toast.success('Category deleted');
        setEditedCategoryId(null);
        setEditedField('');
        return;
      }

      await updateCategory(editedCategoryId, {
        name: editedField,
      });

      toast.success('Category updated');

      allCategories.map((category) => {
        if (category._id === editedCategoryId) {
          category.name = editedField;
        }
      });

      setEditedCategoryId(null);
      setEditedField('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await createCategory({
        name: newCategory,
      });

      toast.success('Category created');

      allCategories.push(response.category);

      setCreatingCategory(false);
      setNewCategory('');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setAllCategories(res.categories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className='mt-14 mb-12'>
      <div className='container max-w-2xl'>
        <div className='text-center mb-10 max-w-[600px] mx-auto'>
          <p
            data-aos='fade-up'
            className='text-sm text-primary font-semibold'
          ></p>
          <h1 data-aos='fade-up' className='text-3xl font-bold'>
            Categories
          </h1>
        </div>

        <div className='mb-10'>
          <div data-aos='fade-up' className='cursor-pointer flex justify-end'>
            <div
              onClick={() => {
                setCreatingCategory(true);
              }}
              className='flex items-center gap-2 text-primary border-orange-500 border-2 rounded-md p-2 w-32 hover:bg-orange-500 hover:text-white'
            >
              <Plus size={20} />
              <span>Add New</span>
            </div>
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
        ) : (
          allCategories.length > 0 && (
            <div className='flex flex-col'>
              {allCategories.map((category) => (
                <div key={category._id}>
                  <Input
                    icon={Pencil}
                    value={
                      category._id === editedCategoryId
                        ? editedField
                        : category.name
                    }
                    onChange={(e) => {
                      setEditedCategoryId(category._id);
                      setEditedField(e.target.value);
                      setCreatingCategory(false);
                    }}
                  />
                  {category._id === editedCategoryId && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type='button'
                      className='w-full mb-6 py-2 px-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white 
                  font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-amber-700
                   focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                      onClick={handleUpdateCategory}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader className='w-6 h-6 animate-spin  mx-auto' />
                      ) : editedField !== '' ? (
                        'Update'
                      ) : (
                        'Delete'
                      )}
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        <>
          {creatingCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='flex flex-col items-center'
            >
              <Input
                icon={Plus}
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                }}
              />
              {newCategory?.trim() !== '' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type='button'
                  className='w-full -mt-4 py-2 px-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-amber-700
               focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                  onClick={handleCreateCategory}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className='w-6 h-6 animate-spin  mx-auto' />
                  ) : (
                    'Save'
                  )}
                </motion.button>
              )}
            </motion.div>
          )}
        </>
      </div>
    </div>
  );
};

export default Categories;
