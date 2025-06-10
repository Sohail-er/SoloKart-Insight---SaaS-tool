import axios from "axios";

export const latestOrders = async () => {
    return await axios.get("http://localhost:8080/api/v1.0/orders/latest", {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const createOrder = async (order) => {
    try {
        console.log('Creating order:', order);
        const response = await axios.post("http://localhost:8080/api/v1.0/orders", order, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Order created successfully:', response.data);
        return response;
    } catch (error) {
        console.error('Error creating order:', error.response?.data || error.message);
        throw error;
    }
}

export const deleteOrder = async (orderId) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/v1.0/orders/${orderId}`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        });
        return response;
    } catch (error) {
        console.error('Error deleting order:', error.response?.data || error.message);
        throw error;
    }
}