import API from './api';

const maintenanceService = {
    getAll: async () => {
        try {
            const response = await API.get('/maintenance');
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response || error);
            throw error.response?.data || { message: 'Failed to fetch maintenance records' };
        }
    },

    create: async (data) => {
        try {
            const response = await API.post('/maintenance', data);
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response || error);
            throw error.response?.data || { message: 'Failed to create maintenance record' };
        }
    },

    complete: async (maintenanceId) => {
        try {
            const response = await API.put(`/maintenance/${maintenanceId}/complete`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response || error);
            throw error.response?.data || { message: 'Failed to complete maintenance' };
        }
    }
};

export default maintenanceService;