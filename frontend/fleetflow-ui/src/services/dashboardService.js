import API from './api';

const dashboardService = {
    getStats: async () => {
        try {
            const response = await API.get('/dashboard');
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response || error);
            throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
        }
    }
};

export default dashboardService;