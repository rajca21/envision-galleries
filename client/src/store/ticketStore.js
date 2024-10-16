import { create } from 'zustand';
import axios from 'axios';

const API_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8000/api/tickets'
    : '/api/tickets';
axios.defaults.withCredentials = true;

export const useTicketStore = create((set) => ({
  // State
  error: null,
  isLoading: false,

  // Create Ticket
  createTicket: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}`, data);

      set({
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while creating new ticket',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get All Tickets
  getAllTickets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}`);

      set({
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while fetching all tickets',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get My Tickets
  getMyTickets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/mine`);

      set({
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while fetching users tickets',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete Ticket
  deleteTicket: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}/${id}`);

      set({
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while deleting ticket',
        isLoading: false,
      });
      throw error;
    }
  },
}));
