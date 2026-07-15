import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [signin, setSignin] = useState(false);
  const [user, setUser] = useState(null);
  const [foodList, setFoodList] = useState([]);

  const url = "http://localhost:5000";

  // ---------------- FETCH FOOD FROM DB ----------------
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      console.log(res);
      if (res.data.success) {
        setFoodList(res.data.data|| []);
      }
    } catch (err) {
      console.error("Error fetching food list:", err);
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  // ---------------- ADD TO CART ----------------
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId });
      } catch (err) {
        console.error("Error adding to cart:", err);
      }
    }
  };

  // ---------------- REMOVE FROM CART ----------------
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId });
      } catch (err) {
        console.error("Error removing from cart:", err);
      }
    }
  };

  // ---------------- RESTORE LOGIN ----------------
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
      setSignin(true);
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ---------------- AUTO AUTH HEADER ----------------
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ---------------- FETCH CART ----------------
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${url}/api/cart/get`);
        if (res.data.success) {
          setCartItems(res.data.cartData || {});
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [token]);

  // ---------------- TOTAL AMOUNT ----------------
  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const qty = cartItems[itemId];

      if (qty > 0) {
        const food = foodList.find((item) => item._id === itemId);

        if (food) {
          totalAmount += food.price * qty;
        }
      }
    }

    return totalAmount;
  };

  // ---------------- TOTAL ITEMS ----------------
  const getTotalCartItems = () => {
    let total = 0;

    for (const itemId in cartItems) {
      total += cartItems[itemId];
    }

    return total;
  };

  // ---------------- CONTEXT VALUE ----------------
  const contextValue = {
    foodList,
    cartItems,
    addToCart,
    removeFromCart,
    setCartItems,
    getTotalCartAmount,
    getTotalCartItems,
    token,
    setToken,
    signin,
    setSignin,
    user,
    setUser,
    url,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;