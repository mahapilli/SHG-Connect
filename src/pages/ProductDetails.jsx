import {
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";


function ProductDetails() {

  const { productId } = useParams();


  /*
   * Real product data will be fetched from
   * the backend/database using productId.
   *
   * No fake product information is added here.
   */


  const product = null;


  return (

    <div className="product-details-page">

      {/* ================= HEADER ================= */}

      <div className="product-details-header">

        <Link
          to="/marketplace"
          className="back-button"
        >

          <ArrowLeft size={17} />

          Back to Marketplace

        </Link>

      </div>


      {/* ================= PRODUCT ================= */}

      {product ? (

        <div className="product-details-container">

          {/* IMAGE */}

          <div className="product-details-image">

            {product.image ? (

              <img
                src={product.image}
                alt={product.name}
              />

            ) : (

              <ShoppingBag size={55} />

            )}

          </div>


          {/* INFORMATION */}

          <div className="product-details-info">

            <span className="product-category">

              {product.category}

            </span>


            <h1>
              {product.name}
            </h1>


            <p>
              {product.description}
            </p>


            <div className="product-details-shg">

              <span>
                Sold by
              </span>

              <strong>
                {product.shgName}
              </strong>

            </div>


            <div className="product-details-price">

              {product.price}

            </div>


            <button
              className="primary-btn"
              type="button"
            >

              Add to Cart

            </button>

          </div>

        </div>

      ) : (

        /* ================= EMPTY STATE ================= */

        <div className="product-details-empty">

          <div className="product-empty-icon">

            <ShoppingBag size={45} />

          </div>


          <h1>
            Product details unavailable
          </h1>


          <p>
            The selected product could not be loaded
            because real product data is not connected yet.
          </p>


          <p className="data-message">

            Product ID:
            {" "}
            {productId}

          </p>


          <Link
            to="/marketplace"
            className="primary-btn"
          >

            Browse Marketplace

          </Link>

        </div>

      )}

    </div>

  );
}


export default ProductDetails;