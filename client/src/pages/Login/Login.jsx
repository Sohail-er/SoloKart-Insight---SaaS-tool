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
    const [showPassword, setShowPassword] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData((data) => ({...data, [name]: value}));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login(formData);
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
            <div className={`login-card ${isAdmin ? 'admin-card' : 'user-card'}`}>
                <div className="card-icon">
                    <i className={`bi ${isAdmin ? "bi-shield-lock" : "bi-person-circle"}`}></i>
                </div>
                <div className="text-center">
                    <h1 className="login-title">{isAdmin ? "Admin Login" : "User Login"}</h1>
                    <p className="login-subtitle">
                        {isAdmin ? "Access administrative controls" : "Access your personal account"}
                    </p>
                </div>
                <div className="mt-4">
                    <form onSubmit={onSubmitHandler}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label-custom">
                                Email address
                            </label>
                            <input 
                                type="text" 
                                name="email" 
                                id="email" 
                                placeholder={isAdmin ? "admin@example.com" : "yourname@example.com"} 
                                className="form-control-custom" 
                                onChange={onChangeHandler} 
                                value={formData.email} 
                            />
                        </div>
                        <div className="form-group" style={{position: 'relative'}}>
                            <label htmlFor="password" className="form-label-custom">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="**********"
                                className="form-control-custom"
                                onChange={onChangeHandler}
                                value={formData.password}
                            />
                            <span 
                                onClick={() => setShowPassword(!showPassword)} 
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(20%)',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)'
                                }}
                            >
                                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </span>
                        </div>
                        <div className="form-group">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isAdmin"
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="isAdmin">
                                    Login as Admin
                                </label>
                            </div>
                        </div>
                        <div className="d-grid">
                            <button type="submit" className={`btn-custom ${isAdmin ? 'admin-btn' : ''}`} disabled={loading}>
                                {loading ? "Loading..." : `Sign in as ${isAdmin ? "Admin" : "User"}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;