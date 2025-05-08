import axios from 'axios';
import networkconfig from '../Dynamics/networkconfig';

export const VerifyToken = async (token) => {
  try {
    const response = await axios.get(`${networkconfig.BASE_URL}/v1/token-verification`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200; // Assuming the backend returns { isValid: true/false }
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};
