import { create } from 'zustand';
import axios from 'axios';

const API_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8000/api/exhibits'
    : '/api/exhibits';
axios.defaults.withCredentials = true;

export const useExhibitStore = create((set) => ({
  // State
  error: null,
  isLoading: false,

  // Create Exhibit
  createExhibit: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}`, data);

      set({
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while creating new exhibit',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Upcoming Exhibits
  getUpcomingExhibits: async (startIndex, limit, order, searchTerm) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}?${startIndex && 'startIndex=' + startIndex + '&'}${
          limit && 'limit=' + limit + '&'
        }${order && 'order=' + order + '&'}${
          searchTerm && 'searchTerm=' + searchTerm
        }`
      );

      set({
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while fetching upcoming exhibits',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Archived Exhibits
  getArchivedExhibits: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/archive`);

      set({
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while fetching archived exhibits',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Single Exhibit
  getExhibit: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${id}`);

      set({
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while fetching single exhibit',
        isLoading: false,
      });
      throw error;
    }
  },
}));
