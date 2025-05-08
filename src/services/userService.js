import axios from 'axios';
import { BASE_URL } from '../utils/sharesUtils'; // Replace with your API base URL

export const getUserDetails = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}auth/user/`, {
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
