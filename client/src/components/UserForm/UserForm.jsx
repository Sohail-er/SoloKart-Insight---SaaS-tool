import {useState} from "react";
import {addUser} from "../../Service/UserService.js";
import toast from "react-hot-toast";
import './UserForm.css'; // Import the new CSS file

const UserForm = ({setUsers}) => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        role: "ROLE_USER"
    });
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [emailError, setEmailError] = useState("");

    const onChangeHandler = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setData((data) => ({ ...data, [name]: value }));
        if (name === "password") {
            validatePassword(value);
        } else if (name === "email") {
            validateEmail(value);
        }
    }

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter.");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one number.");
        }
        if (!/[!@#$%^&*()]/.test(password)) {
            errors.push("Password must contain at least one special character (!@#$%^&*()).");
        }
        setPasswordErrors(errors);
        return errors.length === 0;
    }

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address (e.g., example@domain.com).");
            return false;
        } else {
            setEmailError("");
            return true;
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const isPasswordValid = validatePassword(data.password);
        const isEmailValid = validateEmail(data.email);

        if (!isPasswordValid || !isEmailValid) {
            toast.error("Please fix form errors");
            return;
        }

        setLoading(true);
        try {
            const response = await addUser(data);
            setUsers((prevUsers) => [...prevUsers, response.data]);
            toast.success("User Added");
            setData({
                name: "",
                email: "",
                password: "",
                role: "ROLE_USER",
            })
            setPasswordErrors([]);
            setEmailError("");
        } catch (e) {
            console.error(e);
            toast.error("Error adding user");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-2 mt-2">
            <div className="user-form-container">
                <form onSubmit={onSubmitHandler}>
                    <div className="form-group-custom">
                        <label htmlFor="name" className="form-label-custom">
                            Name <span className="text-danger">*</span>
                        </label>
                        <input type="text"
                               name="name"
                               id="name"
                               className="form-control-custom"
                               placeholder="Jhon Doe"
                               onChange={onChangeHandler}
                               value={data.name}
                               required
                        />
                    </div>
                    <div className="form-group-custom">
                        <label htmlFor="email" className="form-label-custom">
                            Email <span className="text-danger">*</span>
                        </label>
                        <input type="email"
                               name="email"
                               id="email"
                               className="form-control-custom"
                               placeholder="yourname@example.com"
                               onChange={onChangeHandler}
                               value={data.email}
                               required
                        />
                        {emailError && (
                            <p style={{color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'left'}}>{emailError}</p>
                        )}
                    </div>
                    <div className="form-group-custom" style={{position: 'relative'}}>
                        <label htmlFor="password" className="form-label-custom">
                            Password <span className="text-danger">*</span>
                        </label>
                        <input
                               type={showPassword ? "text" : "password"}
                               name="password"
                               id="password"
                               className="form-control-custom"
                               placeholder="**************"
                               onChange={onChangeHandler}
                               value={data.password}
                               required
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
                        {passwordErrors.length > 0 && (
                            <ul style={{color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.5rem', paddingLeft: '1.2rem', textAlign: 'left'}}>
                                {passwordErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button type="submit" className="btn-custom-submit" disabled={loading}>
                        {loading ? "Loading..." : "Save"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UserForm;