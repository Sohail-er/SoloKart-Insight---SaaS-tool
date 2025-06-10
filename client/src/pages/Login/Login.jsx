import './Login.css';
import {useContext, useState} from "react";
import toast from "react-hot-toast";
import {login} from "../../Service/AuthService.js";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../context/AppContext.jsx";

const Login = () => {
    const {setAuthData} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showUserPassword, setShowUserPassword] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });
    const [adminData, setAdminData] = useState({
        email: "",
        password: "",
    });

    const onChangeHandler = (e, isAdmin = false) => {
        const name = e.target.name;
        const value = e.target.value;
        if (isAdmin) {
            setAdminData((data) => ({...data, [name]: value}));
        } else {
            setUserData((data) => ({...data, [name]: value}));
        }
    }

    const onSubmitHandler = async (e, isAdmin = false) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = isAdmin ? adminData : userData;
            const response = await login(data);
            if (response.status === 200) {
                // Check if the user is trying to log in through the correct form
                const isAdminLogin = response.data.role === "ROLE_ADMIN";
                if (isAdminLogin !== isAdmin) {
                    toast.error(isAdmin ? "Please use the User Login form" : "Please use the Admin Login form");
                    setLoading(false);
                    return;
                }

                toast.success("Login successful");
                console.log("Login response data:", response.data);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("name", response.data.name);
                setAuthData(response.data.token, response.data.role, response.data.name);
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
            toast.error("Email/Password Invalid");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-options">
                <div className="login-card user-card">
                    <div className="card-icon">
                        <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="text-center">
                        <h1 className="login-title">User Login</h1>
                        <p className="login-subtitle">
                            Access your personal account
                        </p>
                    </div>
                    <div className="mt-4">
                        <form onSubmit={(e) => onSubmitHandler(e, false)}>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label-custom">
                                    Email address
                                </label>
                                <input 
                                    type="text" 
                                    name="email" 
                                    id="email" 
                                    placeholder="yourname@example.com" 
                                    className="form-control-custom" 
                                    onChange={(e) => onChangeHandler(e, false)} 
                                    value={userData.email} 
                                />
                            </div>
                            <div className="form-group" style={{position: 'relative'}}>
                                <label htmlFor="password" className="form-label-custom">
                                    Password
                                </label>
                                <input
                                    type={showUserPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="**********"
                                    className="form-control-custom"
                                    onChange={(e) => onChangeHandler(e, false)}
                                    value={userData.password}
                                />
                                <span 
                                    onClick={() => setShowUserPassword(!showUserPassword)} 
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(20%)',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)'
                                    }}
                                >
                                    <i className={showUserPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                </span>
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn-custom" disabled={loading}>
                                    {loading ? "Loading..." : "Sign in as User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="login-card admin-card">
                    <div className="card-icon">
                        <i className="bi bi-shield-lock"></i>
                    </div>
                    <div className="text-center">
                        <h1 className="login-title">Admin Login</h1>
                        <p className="login-subtitle">
                            Access administrative controls
                        </p>
                    </div>
                    <div className="mt-4">
                        <form onSubmit={(e) => onSubmitHandler(e, true)}>
                            <div className="form-group">
                                <label htmlFor="admin-email" className="form-label-custom">
                                    Admin Email
                                </label>
                                <input 
                                    type="text" 
                                    name="email" 
                                    id="admin-email" 
                                    placeholder="admin@example.com" 
                                    className="form-control-custom" 
                                    onChange={(e) => onChangeHandler(e, true)} 
                                    value={adminData.email} 
                                />
                            </div>
                            <div className="form-group" style={{position: 'relative'}}>
                                <label htmlFor="admin-password" className="form-label-custom">
                                    Admin Password
                                </label>
                                <input
                                    type={showAdminPassword ? "text" : "password"}
                                    name="password"
                                    id="admin-password"
                                    placeholder="**********"
                                    className="form-control-custom"
                                    onChange={(e) => onChangeHandler(e, true)}
                                    value={adminData.password}
                                />
                                <span 
                                    onClick={() => setShowAdminPassword(!showAdminPassword)} 
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(20%)',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)'
                                    }}
                                >
                                    <i className={showAdminPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                </span>
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn-custom admin-btn" disabled={loading}>
                                    {loading ? "Loading..." : "Sign in as Admin"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;