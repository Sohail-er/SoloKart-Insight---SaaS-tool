import {useContext, useEffect, useState} from "react";
import {assets} from "../../assets/assets.js";
import toast from "react-hot-toast";
import {addCategory} from "../../Service/CategoryService.js";
import {AppContext} from "../../context/AppContext.jsx";
import './CategoryForm.css';

const CategoryForm = () => {
    const {setCategories, categories} = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(false);

    const [data, setData] = useState({
        name: "",
        description: "",
        bgColor: "#2c2c2c",
    });

    const onChangeHandler = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setData((data) => ({...data, [name]: value}));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!image) {
            toast.error("Select image for category");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("category", JSON.stringify(data));
        formData.append("file", image);
        try {
            const response = await addCategory(formData);
            if (response.status === 201) {
                setCategories([...categories, response.data]);
                toast.success("Category added");
                setData({
                    name: "",
                    description: "",
                    bgColor: "#2c2c2c",
                });
                setImage(false);
            }
        }catch(err) {
            console.error("Error adding category:", err);
            toast.error("Error adding category");
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="category-form-wrapper">
            <div className="category-form-container">
                <form onSubmit={onSubmitHandler}>
                    <div className="form-group-custom">
                        <label htmlFor="image" className="upload-image-label">
                            <img src={image ? URL.createObjectURL(image) : assets.upload} alt="" />
                        </label>
                        <input type="file" name="image" id="image" className='form-control-custom' hidden onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="form-group-custom">
                        <label htmlFor="name" className="form-label-custom">Name</label>
                        <input type="text"
                            name="name"
                            id="name"
                            className="form-control-custom"
                            placeholder="Category Name"
                            onChange={onChangeHandler}
                            value={data.name}
                            required
                        />
                    </div>
                    <div className="form-group-custom">
                        <label htmlFor="description" className="form-label-custom">Description</label>
                        <textarea
                                rows="5"
                               name="description"
                               id="description"
                               className="form-control-custom textarea"
                               placeholder="Write content here.."
                                onChange={onChangeHandler}
                                value={data.description}
                        ></textarea>
                    </div>
                    <div className="form-group-custom">
                        <label htmlFor="bgcolor" className="form-label-custom">Background color</label>
                        <input type="color"
                               name="bgColor"
                               id="bgcolor"
                               onChange={onChangeHandler}
                               value={data.bgColor}
                               placeholder="#ffffff"
                               className="form-control-custom"
                        />
                    </div>
                    <button type="submit"
                            disabled={loading}
                            className="btn-custom-submit">{loading ? "Loading..." : "Submit"}</button>
                </form>
            </div>
        </div>
    )
}

export default CategoryForm;