import {useContext, useState} from "react";
import {assets} from "../../assets/assets.js";
import {AppContext} from "../../context/AppContext.jsx";
import toast from "react-hot-toast";
import {addItem} from "../../Service/ItemService.js";
import './ItemForm.css';

const ItemForm = () => {
    const {categories, setItemsData, itemsData, setCategories} = useContext(AppContext);
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        categoryId: "",
        price: "",
        description: "",
    });

    const onChangeHandler = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setData((data) => ({...data, [name]: value}));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("item", JSON.stringify(data));
        formData.append("file", image);
        try {
            if (!image) {
                toast.error("Select image");
                return;
            }

            const response = await addItem(formData);
            if (response.status === 201) {
                setItemsData([...itemsData, response.data]);
                setCategories((prevCategories) =>
                prevCategories.map((category) => category.categoryId === data.categoryId ? {...category, items: category.items + 1} : category));
                toast.success("Item added");
                setData({
                    name: "",
                    description: "",
                    price: "",
                    categoryId: "",
                })
                setImage(false);
            } else {
                toast.error("Unable to add item");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to add item");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="item-form-wrapper">
            <div className="item-form-container">
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
                               placeholder="Item Name"
                               onChange={onChangeHandler}
                               value={data.name}
                               required
                        />
                    </div>
                    <div className="form-group-custom">
                        <label htmlFor="category" className="form-label-custom">
                            Category
                        </label>
                        <select name="categoryId" id="category" className="form-control-custom" onChange={onChangeHandler} value={data.categoryId} required>
                            <option value="">--SELECT CATEGORY--</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.categoryId}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group-custom">
                        <label htmlFor="price" className="form-label-custom">Price</label>
                        <input type="number" name="price" id="price" className="form-control-custom" placeholder="₹200.00" onChange={onChangeHandler} value={data.price} required/>
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
                            value={data.description}></textarea>
                    </div>
                    <button type="submit" className="btn-custom-submit" disabled={loading}>{loading ? "Loading..." : "Save"}</button>
                </form>
            </div>
        </div>
    )
}

export default ItemForm;