import { useRef, useState } from "react";
import classes from "./Checkout.module.css";

const validateInput = (input) => input && input.trim() !== "";
const validatePostalCode = (code) => code && code.trim().length === 6;

const Checkout = (props) => {
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    locality: true,
    city: true,
    postalCode: true,
  });

  const nameInputRef = useRef();
  const localityInputRef = useRef();
  const postalInputRef = useRef();
  const cityInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredLocality = localityInputRef.current.value;
    const enteredPostalCode = postalInputRef.current.value;
    const enteredCity = cityInputRef.current.value;

    const enteredNameIsValid = validateInput(enteredName);
    const enteredCityIsValid = validateInput(enteredCity);
    const enteredLocalityIsValid = validateInput(enteredLocality);
    const enteredPostalIsValid = validatePostalCode(enteredPostalCode);

    setFormInputsValidity({
      name: enteredNameIsValid,
      city: enteredCityIsValid,
      locality: enteredLocalityIsValid,
      postalCode: enteredPostalIsValid,
    });

    const formIsValid =
      enteredNameIsValid &&
      enteredCityIsValid &&
      enteredLocalityIsValid &&
      enteredPostalIsValid;

    if (!formIsValid) {
      return;
    }
    props.onConfirm({
      name: enteredName,
      locality: enteredLocality,
      city: enteredCity,
      postalCode: enteredPostalCode,
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="name">Your name</label>
        <input ref={nameInputRef} type="text" id="name" />
        {!formInputsValidity.name && (
          <p className={classes.error}> Please enter a valid name</p>
        )}
      </div>
      <div className={classes.control}>
        <label ref={localityInputRef} htmlFor="locality">
          Your Locality
        </label>
        <input type="text" id="locality" ref={localityInputRef} />
        {!formInputsValidity.locality && (
          <p className={classes.error}> Please enter a valid locality</p>
        )}
      </div>
      <div className={classes.control}>
        <label htmlFor="city">Your City</label>
        <input ref={cityInputRef} type="text" id="city" />
        {!formInputsValidity.city && (
          <p className={classes.error}> Please enter a valid city</p>
        )}
      </div>
      <div className={classes.control}>
        <label htmlFor="postal">Your Zipcode</label>
        <input ref={postalInputRef} type="text" id="postal" />
        {!formInputsValidity.postalCode && (
          <p className={classes.error}>
            {" "}
            Please enter a valid zipcode (6 digit)
          </p>
        )}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={props.onClose}>
          Cancel
        </button>
        <button type="submit">Order</button>
      </div>
    </form>
  );
};

export default Checkout;
