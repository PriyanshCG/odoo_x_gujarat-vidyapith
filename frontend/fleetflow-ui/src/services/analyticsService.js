import API from './api';

const analyticsService = {
    getReports: async () => {
        try {
            const response = await API.get('/analytics');
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response || error);
            throw error.response?.data || { message: 'Failed to fetch analytics' };
        }
    }
};

export default analyticsService;