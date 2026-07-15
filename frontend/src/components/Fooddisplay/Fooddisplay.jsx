import React, { useContext } from "react";
import "./Fooddisplay.css";
import Fooditem from "../Fooditem/Fooditem";
import { StoreContext } from "../../context/StoreContext";

const Fooddisplay = ({ category }) => {
  const { foodList } = useContext(StoreContext); 
  console.log("Food list in Fooddisplay:", foodList);

  return (
    <div className="food-display-container">
      <div className="food-display-header">
        <h2 className="food-display-title">Popular Dishes</h2>
      </div>

      <div className="Food-list-items">
        {foodList.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <Fooditem
                key={item._id}
                food={item}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Fooddisplay;