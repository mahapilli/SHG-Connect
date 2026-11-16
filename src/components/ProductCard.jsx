
import { useState } from "react";
import { ShoppingBag, X, Package, Eye } from "lucide-react";

function ProductCard({ product, onAddToCart }) {
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <>
      <div className="product-card">
        <div
          className="product-card-image"
          onClick={() => setShowDetails(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter") setShowDetails(true);
          }}
        >
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
            />
          ) : (
            <ShoppingBag size={45} />
          )}

          <span className="image-view-label">
            <Eye size={15} /> View Details
          </span>
        </div>

        <div className="product-card-content">
          <span className="product-category">
            {product.category}
          </span>

          <h3>{product.name}</h3>

          <p className="product-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="product-stock">
            <Package size={15} />
            Stock: {product.stock}
          </p>

          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
          >
            <ShoppingBag size={17} />
            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {showDetails && (
        <div
          className="product-modal-overlay"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="product-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="product-modal-close"
              onClick={() => setShowDetails(false)}
            >
              <X size={22} />
            </button>

            <div className="product-modal-image">
              {product.image && !imageError ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <ShoppingBag size={60} />
              )}
            </div>

            <div className="product-modal-content">
              <span className="product-category">
                {product.category}
              </span>

              <h2>{product.name}</h2>

              <h3 className="product-price">
                ₹{product.price.toLocaleString("en-IN")}
              </h3>

              <p><strong>Stock:</strong> {product.stock}</p>
              <p><strong>Member ID:</strong> {product.memberId || "Not available"}</p>
              <p><strong>Maker:</strong> {product.makerName || "SHG Member"}</p>
              <p><strong>Material:</strong> {product.material || "Not specified"}</p>
              <p><strong>Description:</strong> {product.description || "Handmade SHG product."}</p>

              <button
                className="add-to-cart-btn"
                disabled={product.stock <= 0}
                onClick={() => {
                  onAddToCart(product);
                  setShowDetails(false);
                }}
              >
                <ShoppingBag size={17} />
                {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
