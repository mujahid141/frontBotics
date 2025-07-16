import axios from 'axios';
import { getBaseUrl } from '../utils/sharesUtils'; // Replace with your API base URL

export const getUserDetails = async (token) => {
  try {
    const baseurl = await getBaseUrl();

    if (!baseurl || baseurl.trim() === '') {
      throw new Error('❌ Base URL is not set. Please initialize it before making API calls.');
    }

    const endpoint = `${baseurl.replace(/\/+$/, '')}/auth/user/`; // Ensure clean URL

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    console.log('[✔️ User API] Fetched successfully');
    return response.data;

  } catch (error) {
    console.error('[❌ User API Error]:', error?.message || error);
    throw new Error('Failed to fetch user details');
  }
};
