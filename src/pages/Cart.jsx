import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/useApp";


function Cart() {
  const { cartItems, cartTotal, updateCartQuantity, removeFromCart } = useApp();

  return (
    <div className="cart-page">

      {/* HEADER */}

      <div className="cart-header">

        <div>
          <span className="page-eyebrow">
            SHG CONNECT
          </span>

          <h1>
            Your Cart
          </h1>

          <p>
            Review the products you are planning to purchase.
          </p>
        </div>


        <Link
          to="/marketplace"
          className="back-button"
        >
          <ArrowLeft size={17} />
          Continue Shopping
        </Link>

      </div>


      {/* CART CONTENT */}

      <div className="cart-container">

        {cartItems.length === 0 ? (

          <div className="cart-empty">

            <div className="cart-empty-icon">
              <ShoppingBag size={40} />
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Products that you add from the SHG Connect
              marketplace will appear here.
            </p>

            <Link
              to="/marketplace"
              className="primary-btn"
            >
              Browse Marketplace
            </Link>

          </div>

        ) : (

          <div className="cart-layout">

            <div className="cart-items">

              {cartItems.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  <div className="cart-item-image">

                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    )}

                  </div>


                  <div className="cart-item-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {item.shgName}
                    </p>

                    <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                    <div className="cart-quantity">
                      <button type="button" onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateCartQuantity(item.id, 1)} disabled={item.quantity >= item.stock}>+</button>
                    </div>

                  </div>


                  <button
                    className="remove-cart-item"
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              ))}

            </div>


            <div className="cart-summary">

              <h2>
                Order Summary
              </h2>

              <div className="summary-row">
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Delivery
                </span>

                <strong>
                  Free
                </strong>
              </div>

              <div className="summary-total">
                <span>
                  Total
                </span>

                <strong>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <button
                className="checkout-button"
                type="button"
              >
                Proceed to Checkout
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}


export default Cart;