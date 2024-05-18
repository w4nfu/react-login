import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Order = ({ username }) => {
    const navigate = useNavigate();
    const [pizzas, setPizzas] = useState([
        { name: "Cheese", price: 8.90, quantity: 0 },
        { name: "Aloha", price: 9.90, quantity: 0 },
        { name: "Tuna", price: 10.90, quantity: 0 },
        { name: "Sate", price: 11.90, quantity: 0 }
    ]);
    const [deliveryAddress, setDeliveryAddress] = useState("");

    const handleQuantityChange = (index, value) => {
        const newPizzas = [...pizzas];
        newPizzas[index].quantity = value;
        setPizzas(newPizzas);
    };

    const handleDeliveryAddressChange = (e) => {
        setDeliveryAddress(e.target.value);
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        pizzas.forEach(pizza => {
            totalPrice += pizza.price * pizza.quantity;
        });
        if (deliveryAddress) {
            totalPrice += 5; // Delivery fee
        }
        return totalPrice;
    };

    const handleOrder = () => {
        // Check if there is at least one pizza with quantity > 0
        const validPizzas = pizzas.filter(pizza => pizza.quantity > 0);
        if (validPizzas.length === 0) {
            alert("Order must contain at least one pizza");
            return;
        }

        // Prepare order data
        const orderData = {
            username: username,
            pizzas: validPizzas,
            deliveryAddress: deliveryAddress,
            total_price: calculateTotalPrice()
        };

        // Send order to backend
        fetch("http://localhost:3080/order", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            if (response.ok) {
                alert("Order placed successfully!");
                // Optionally, you can redirect the user to another page
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data && data.message) {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Order error:", error);
            alert("Failed to place order. Please try again.");
        });
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">
                <div>Place Order</div>
            </div>
            <br />
            {pizzas.map((pizza, index) => (
                <div key={index} className="inputContainer">
                    <span>{pizza.name} - RM{pizza.price.toFixed(2)}</span>
                    <input
                        type="number"
                        min="0"
                        value={pizza.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                        className="inputBox"
                    />
                </div>
            ))}
            <div className="inputContainer">
                <label>
                    Delivery Address:
                </label>
                <input
                    type="text"
                    value={deliveryAddress}
                    onChange={handleDeliveryAddressChange}
                    className="inputBox"
                />
            </div>
            <div className="inputContainer">
                Total Price: RM{calculateTotalPrice().toFixed(2)}
            </div>
            <div className="inputContainer">
                <input
                    className="inputButton"
                    type="button"
                    onClick={handleOrder}
                    value="Place Order"
                />
                <input
                    className="inputButton"
                    type="button"
                    onClick={() => navigate("/")}
                    value="Back"
                />
            </div>
        </div>
    );
};

export default Order;