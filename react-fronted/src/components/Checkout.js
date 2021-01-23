import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const Checkout = (props) => {
  const location = useLocation();

  return (
    <div className="container mt-5">
      <div>Total Price: {location.state.data}</div>
    </div>
  );
};

export default Checkout;
