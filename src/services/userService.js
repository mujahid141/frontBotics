import axios from 'axios';
import { getBaseUrl } from '../utils/sharesUtils';// Replace with your API base URL

export const getUserDetails = async (token) => {
    const baseurl = getBaseUrl();
    console.log('Base URL:', baseurl); // Log the base URL for debugging
    if (baseurl === '' || baseurl === undefined) {
        throw new Error('Base URL is not set. Please initialize it before making API calls.');
    }
    try {
        const response = await axios.get(`${baseurl}auth/user/`, {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        console.log('User details:', response.data); // Log the user details for debugging
        return response.data; // Return the user data
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw new Error('Failed to fetch user details');
    }
};
