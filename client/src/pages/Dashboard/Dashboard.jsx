import './Dashboard.css';
import {useEffect, useState} from "react";
import {fetchDashboardData} from "../../Service/Dashboard.js";
import toast from "react-hot-toast";

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('name');

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchDashboardData();
                setData(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Unable to view the data");
            } finally {
                setLoading(false);
            }
        }
        
        // Initial load
        loadData();
        
        // Set up auto-refresh every 30 seconds
        const refreshInterval = setInterval(loadData, 30000);
        
        // Cleanup interval on component unmount
        return () => clearInterval(refreshInterval);
    }, []);

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

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    if (loading) {
        return <div className="loading">Loading dashboard...</div>
    }

    if (!data) {
        return <div className="error">Failed to load the dashboard data...</div>;
    }

    // Admin: group recent orders by user
    if (userRole === 'ROLE_ADMIN') {
        // Sort salesByUser by totalSales in descending order
        const sortedSalesByUser = data.salesByUser ? [...data.salesByUser].sort((a, b) => b.totalSales - a.totalSales) : [];
        
        // Calculate Average Order Value
        const averageOrderValue = data.todayOrderCount > 0 ? data.todaySales / data.todayOrderCount : 0;
        
        return (
            <div className="dashboard-wrapper">
                <div className="dashboard-container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="bi bi-currency-rupee"></i>
                            </div>
                            <div className="stat-content">
                                <h3>Total Sales</h3>
                                <p>₹{data.todaySales.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="bi bi-cart-check"></i>
                            </div>
                            <div className="stat-content">
                                <h3>Total Orders</h3>
                                <p>{data.todayOrderCount}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="bi bi-graph-up"></i>
                            </div>
                            <div className="stat-content">
                                <h3>Avg Order Value</h3>
                                <p>₹{averageOrderValue.toFixed(2)}</p>
                            </div>
                        </div>
                        {sortedSalesByUser.length > 0 && (
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="bi bi-trophy"></i>
                                </div>
                                <div className="stat-content">
                                    <h3>Best Performer</h3>
                                    <p>{sortedSalesByUser[0].userName}</p>
                                    <small>₹{sortedSalesByUser[0].totalSales.toFixed(2)}</small>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Sales by User Table */}
                    {data.salesByUser && data.salesByUser.length > 0 && (
                        <div className="recent-orders-card">
                            <h3 className="recent-orders-title">
                                <i className="bi bi-people"></i>
                                Sales by User
                            </h3>
                            <div className="orders-table-container">
                                <table className="orders-table">
                                    <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Total Sales</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sortedSalesByUser.map(userSales => (
                                        <tr key={userSales.userName}>
                                            <td>{userSales.userName}</td>
                                            <td>₹{userSales.totalSales.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Regular user view
    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="bi bi-currency-rupee"></i>
                        </div>
                        <div className="stat-content">
                            <h3>My Total Sales</h3>
                            <p>₹{data.todaySales.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="bi bi-currency-rupee"></i>
                        </div>
                        <div className="stat-content">
                            <h3>My Today's Sales</h3>
                            <p>₹{data.todaySales.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="bi bi-cart-check"></i>
                        </div>
                        <div className="stat-content">
                            <h3>My Today's Orders</h3>
                            <p>{data.todayOrderCount}</p>
                        </div>
                    </div>
                </div>
                
                <div className="recent-orders-card">
                    <h3 className="recent-orders-title">
                        <i className="bi bi-clock-history"></i>
                        My Recent Orders
                    </h3>
                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                            <tr>
                                <th>Order Id</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.recentOrders.map((order) => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId.substring(0,8)}...</td>
                                    <td>{order.customerName}</td>
                                    <td>₹{order.grandTotal.toFixed(2)}</td>
                                    <td>
                                        <span className={`payment-method ${order.paymentMethod.toLowerCase()}`}>
                                            {order.paymentMethod}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${order.paymentDetails.status.toLowerCase()}`}>
                                            {order.paymentDetails.status}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(order.createdAt).toLocaleDateString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;