import axios from 'axios';
import { BASE_URL } from '../utils/sharesUtils'; // Replace with your API base URL

export const getUserDetails = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}users/custom-user/`, {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        return response.data; // Return the user data
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw new Error('Failed to fetch user details');
    }
};
