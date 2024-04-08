import React, { useContext, useState } from "react";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const cartContext = useContext(CartContext);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitWasSuccess, setSubmitWasSuccess] = useState(false);

  const totalAmount = `$${cartContext.totalAmount.toFixed(2)}`;
  const hasItems = cartContext.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartContext.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartContext.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setShowCheckoutForm(true);
  };

  const submitOrderHandler = async (userData) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://restaurant-landing-page-d7f36-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json",
        {
          method: "POST",
          body: JSON.stringify({
            user: userData,
            orderedItems: cartContext.items,
          }),
        }
      );
      if (!response.ok) {
        setSubmitWasSuccess(false);
        throw Error("Something went wrong!!");
      }
      setSubmitWasSuccess(true);
    } catch (error) {
      setSubmitWasSuccess(false);
    }
    setIsLoading(false);
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartContext.items.map((item) => (
        <CartItem
          id={item.id}
          price={item.price}
          name={item.name}
          amount={item.amount}
          onAdd={cartItemAddHandler.bind(null, item)}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  let modalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {showCheckoutForm && (
        <Checkout onConfirm={submitOrderHandler} onClose={props.onClose} />
      )}
      {!showCheckoutForm && modalActions}
    </React.Fragment>
  );

  if (isLoading) {
    modalContent = <p>Loading...</p>;
  }

  if (cartContext.items.length === 0) {
    modalContent = (
      <div className={classes.control}>
        <p>Your Cart is empty!!</p>
        <button onClick={props.onClose}>Close</button>
      </div>
    );
  }

  if (submitWasSuccess) {
    modalContent = (
      <div className={classes.control}>
        <p>Order Placed!</p>
        <button onClick={props.onClose}>Close</button>
      </div>
    );

    cartContext.clearCart();
  }

  return <Modal onClose={props.onClose}>{modalContent}</Modal>;
};

export default Cart;
