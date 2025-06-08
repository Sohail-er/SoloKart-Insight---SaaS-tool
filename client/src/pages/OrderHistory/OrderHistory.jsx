import './OrderHistory.css';
import {useEffect, useState} from "react";
import {latestOrders} from "../../Service/OrderService.js";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('name');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await latestOrders();
                setOrders(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    const formatItems = (items) => {
        return items.map((item) => `${item.name} x ${item.quantity}`).join(', ');
    }

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    const groupOrdersByUser = (orders) => {
        return orders.reduce((groups, order) => {
            const user = order.userName || "Unknown User";
            if (!groups[user]) {
                groups[user] = [];
            }
            groups[user].push(order);
            return groups;
        }, {});
    }

    if (loading) {
        return <div className="orders-history-container text-light text-center py-4">Loading orders...</div>
    }

    if (orders.length === 0) {
        return <div className="orders-history-container text-light text-center py-4">No orders found</div>
    }

    if (userRole === 'ROLE_ADMIN') {
        const groupedOrders = groupOrdersByUser(orders);
        return (
            <div className="orders-history-container">
                <h2 className="mb-2 text-light">All Orders (Grouped by User)</h2>
                {Object.keys(groupedOrders).map(user => (
                    <div key={user} style={{marginBottom: "2rem"}}>
                        <h4 className="text-primary">{user}</h4>
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                <tr>
                                    <th>Order Id</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Created By</th>
                                </tr>
                                </thead>
                                <tbody>
                                {groupedOrders[user].map(order => (
                                    <tr key={order.orderId}>
                                        <td>{order.orderId}</td>
                                        <td>{order.customerName} <br/>
                                            <small className="text-muted">{order.phoneNumber}</small>
                                        </td>
                                        <td>{formatItems(order.items)}</td>
                                        <td>₹{order.grandTotal}</td>
                                        <td>{order.paymentMethod}</td>
                                        <td>
                                            <span className={`badge ${order.paymentDetails?.status === "COMPLETED"? "bg-success" : "bg-warning text-dark"}`}>{order.paymentDetails?.status || "PENDING"}</span>
                                        </td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>{order.userName}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="orders-history-container">
            <h2 className="mb-2 text-light">My Orders</h2>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                    <tr>
                        <th>Order Id</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.orderId}>
                            <td>{order.orderId}</td>
                            <td>{order.customerName} <br/>
                                <small className="text-muted">{order.phoneNumber}</small>
                            </td>
                            <td>{formatItems(order.items)}</td>
                            <td>₹{order.grandTotal}</td>
                            <td>{order.paymentMethod}</td>
                            <td>
                                <span className={`badge ${order.paymentDetails?.status === "COMPLETED"? "bg-success" : "bg-warning text-dark"}`}>{order.paymentDetails?.status || "PENDING"}</span>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderHistory;