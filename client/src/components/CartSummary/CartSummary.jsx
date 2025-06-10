import './CartSummary.css';
import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import ReceiptPopup from "../ReceiptPopup/ReceiptPopup.jsx";
import {createOrder, deleteOrder} from "../../Service/OrderService.js";
import toast from "react-hot-toast";
import {createRazorpayOrder, verifyPayment} from "../../Service/PaymentService.js";
import {AppConstants} from "../../util/constants.js";

const CartSummary = ({customerName, mobileNumber, setMobileNumber, setCustomerName}) => {
    const {cartItems, clearCart} = useContext(AppContext);

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = totalAmount * 0.01;
    const grandTotal = totalAmount + tax;

    const clearAll = () => {
        setCustomerName("");
        setMobileNumber("");
        clearCart();
    }

    const placeOrder = () => {
        setShowPopup(true);
        clearAll();
    }

    const handlePrintReceipt = () => {
        window.print();
    }

    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        })
    }

    const deleteOrderOnFailure = async (orderId) => {
        try {
            await deleteOrder(orderId);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    const validateCustomerDetails = () => {
        // Validate customer name
        if (!customerName.trim()) {
            toast.error("Please enter customer name");
            return false;
        }
        if (!/^[a-zA-Z\s]{2,50}$/.test(customerName)) {
            toast.error("Please enter a valid customer name (2-50 letters and spaces only)");
            return false;
        }

        // Validate phone number
        if (!mobileNumber.trim()) {
            toast.error("Please enter phone number");
            return false;
        }
        if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
            toast.error("Please enter a valid phone number");
            return false;
        }

        return true;
    };

    const completePayment = async (paymentMode) => {
        if (!validateCustomerDetails()) {
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        const orderData = {
            customerName,
            phoneNumber: mobileNumber,
            cartItems,
            subtotal: totalAmount,
            tax,
            grandTotal,
            paymentMethod: paymentMode.toUpperCase()
        }

        setIsProcessing(true);
        try {
            console.log('Current user token:', localStorage.getItem('token'));
            console.log('Sending order data:', orderData);
            const response = await createOrder(orderData);
            console.log('Order creation response:', response);
            
            if (!response.data) {
                throw new Error('No data received from server');
            }

            const savedData = response.data;
            console.log('Saved order data:', savedData);

            if (paymentMode === "cash") {
                // For cash payments, just show success and set order details
                toast.success("Cash received");
                setOrderDetails(savedData);
                setIsProcessing(false);
            } else if (paymentMode === "upi") {
                // For UPI payments, proceed with Razorpay
                const razorpayLoaded = await loadRazorpayScript();
                if (!razorpayLoaded) {
                    toast.error('Unable to load razorpay');
                    await deleteOrderOnFailure(savedData.orderId);
                    setIsProcessing(false);
                    return;
                }

                // Create razorpay order
                const razorpayResponse = await createRazorpayOrder({amount: grandTotal, currency: 'INR'});
                const options = {
                    key: AppConstants.RAZORPAY_KEY_ID,
                    amount: razorpayResponse.data.amount,
                    currency: razorpayResponse.data.currency,
                    order_id: razorpayResponse.data.id,
                    name: "My Retail Shop",
                    description: "Order payment",
                    handler: async function (response) {
                        await verifyPaymentHandler(response, savedData);
                    },
                    prefill: {
                        name: customerName,
                        contact: mobileNumber
                    },
                    theme: {
                        color: "#3399cc"
                    },
                    modal: {
                        ondismiss: async () => {
                            await deleteOrderOnFailure(savedData.orderId);
                            toast.error("Payment cancelled");
                            setIsProcessing(false);
                        }
                    },
                };
                const rzp = new window.Razorpay(options);
                rzp.on("payment.failed", async (response) => {
                    await deleteOrderOnFailure(savedData.orderId);
                    toast.error("Payment failed");
                    console.error(response.error.description);
                    setIsProcessing(false);
                });
                rzp.open();
            }
        } catch(error) {
            console.error('Payment processing error:', error);
            toast.error(error.response?.data?.message || "Payment processing failed");
            setIsProcessing(false);
        }
    }

    const verifyPaymentHandler = async (response, savedOrder) => {
        const paymentData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: savedOrder.orderId
        };
        try {
            const paymentResponse = await verifyPayment(paymentData);
            if (paymentResponse.status === 200) {
                toast.success("Payment successful");
                setOrderDetails({
                    ...savedOrder,
                    paymentDetails: {
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature
                    },
                });
                setIsProcessing(false);
            } else {
                toast.error("Payment processing failed");
                setIsProcessing(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Payment failed");
            setIsProcessing(false);
        }
    };

    return (
        <div className="mt-2">
            <div className="cart-summary-details">
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Item: </span>
                    <span className="text-light">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Tax (1%):</span>
                    <span className="text-light">₹{tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                    <span className="text-light">Total:</span>
                    <span className="text-light">₹{grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="d-flex gap-3">
                <button className="btn btn-success flex-grow-1"
                    onClick={() => completePayment("cash")}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "Cash"}
                </button>
                <button className="btn btn-primary flex-grow-1"
                    onClick={() => completePayment("upi")}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "UPI"}
                </button>
            </div>
            <div className="d-flex gap-3 mt-3 pb-3">
                <button className="btn btn-warning flex-grow-1"
                    onClick={placeOrder}
                    disabled={isProcessing || !orderDetails}
                >
                    Place Order
                </button>
            </div>

            {showPopup && orderDetails && (
                <ReceiptPopup
                    orderDetails={orderDetails}
                    onClose={() => setShowPopup(false)}
                    onPrint={handlePrintReceipt}
                />
            )}
        </div>
    );
};

export default CartSummary;