import axios from 'axios';

const getAuthToken = async () => {
  try {
    const res = await axios.post(
      `https://api.artsy.net/api/tokens/xapp_token?client_id=${
        import.meta.env.VITE_ARTSY_CLIENT_ID
      }&client_secret=${import.meta.env.VITE_ARTSY_CLIENT_SECRET}`,
      {},
      {
        withCredentials: true,
      }
    );

    return res.data.token;
  } catch (error) {
    console.error(error);
  }
};

export const getArtworks = async () => {
  try {
    const token = await getAuthToken();
    const res = await axios.get('https://api.artsy.net/api/artworks', {
      headers: {
        'X-Xapp-Token': token,
      },
      withCredentials: true,
    });
    return res.data._embedded.artworks;
  } catch (error) {
    console.error(error);
    return [];
  }
};
