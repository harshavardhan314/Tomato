import React, { useContext } from "react";
import "./Fooditem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import toast from "react-hot-toast";

const Fooditem = ({ food }) => {
  const { addToCart, removeFromCart, cartItems } = useContext(StoreContext);

  const itemId = food?._id;

  return (
    <div className="food-item">
      <div className="food-img-container">
        <img
          src={food?.image}
          alt={food?.name}
          className="food-img"
        />

        {!cartItems[itemId] ? (
          <img
            src={assets.add_icon_white}
            className="add-icon"
            alt="add"
            onClick={() => {
              addToCart(itemId);
              toast.success("Item added successfully");
            }}
          />
        ) : (
          <div className="increase-count">
            <img
              src={assets.remove_icon_red}
              alt="remove"
              onClick={() => {
                removeFromCart(itemId);
                toast.error("Item removed");
              }}
            />

            <p>{cartItems[itemId]}</p>

            <img
              src={assets.add_icon_green}
              alt="add"
              onClick={() => {
                addToCart(itemId);
                toast.success("Item added successfully");
              }}
            />
          </div>
        )}
      </div>

      <div className="food-details">
        <div className="food-item-name-rating">
          <p className="food-item-name">{food?.name}</p>

          <img
            src={assets.rating_starts}
            alt="rating"
            className="food-item-rating"
          />
        </div>

        <p className="food-item-description">
          {food?.description}
        </p>

        <p className="food-item-price">₹ {food?.price}</p>
      </div>
    </div>
  );
};

export default Fooditem;