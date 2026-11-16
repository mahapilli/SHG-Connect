
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  ArrowLeft,
  SlidersHorizontal,
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
} from "lucide-react";

import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/useApp";

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [stockFilter, setStockFilter] = useState("all");

  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "Handicrafts", price: "", stock: "" });
  const { user, cartItems, cartCount, cartTotal, addToCart, updateCartQuantity, removeFromCart } = useApp();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch products");
        }

        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.products)) {
          const formattedProducts = data.products.map((item) => ({
            id: item.Product_ID,
            name: item.Product_Name,
            category: item.Category,
            price: Number(item.Price),
            stock: Number(item.Stock),
            image: item.Image,
            memberId: item.Member_ID,
            makerName: item.Maker_Name,
            material: item.Material,
            description: item.Description,
          }));

          setProducts(formattedProducts);
        } else {
          setProducts([]);
          setError("No products available.");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Categories
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        products.map((product) => product.category).filter(Boolean)
      ),
    ];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (stockFilter === "available") {
      result = result.filter((product) => product.stock > 0);
    }

    if (stockFilter === "out") {
      result = result.filter((product) => product.stock <= 0);
    }

    if (sortOrder === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, searchTerm, selectedCategory, stockFilter, sortOrder]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortOrder("default");
    setStockFilter("all");
  };

  const handleAddProduct = (event) => {
    event.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.stock) return;
    setProducts((current) => [
      {
        id: `LOCAL-${Date.now()}`,
        name: newProduct.name.trim(),
        category: newProduct.category,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        image: "",
        memberId: "YOUR-SHG",
        makerName: user?.name || "SHG Member",
        material: "Handmade",
        description: "A new product from your Self-Help Group.",
      },
      ...current,
    ]);
    setNewProduct({ name: "", category: "Handicrafts", price: "", stock: "" });
    setShowProductForm(false);
  };

  return (
    <div className="marketplace-page">

      {/* MARKETPLACE HEADER */}
      <header className="marketplace-header">
        <div className="marketplace-header-left">
          <Link to="/" className="marketplace-back">
            <ArrowLeft size={20} />
            {user?.role === "SHG Member" ? "Member Dashboard" : "Home"}
          </Link>

          <div>
            <h1>SHG Marketplace</h1>
            <p>
              Discover handmade products from Women Self-Help Groups
            </p>
          </div>
        </div>

        <button
          className="marketplace-cart-btn"
          onClick={() => setShowCart(true)}
        >
          <ShoppingCart size={21} />
          My Cart
          <span className="cart-count">{cartCount}</span>
        </button>
      </header>

      {/* SEARCH */}
      <section className="marketplace-toolbar">
        <div className="marketplace-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search handmade products..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {searchTerm && (
            <button onClick={() => setSearchTerm("")}>
              <X size={18} />
            </button>
          )}
        </div>

        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
        {user?.role === "SHG Member" && (
          <button className="member-add-product-btn" onClick={() => setShowProductForm((open) => !open)}>
            <Plus size={18} /> Add product
          </button>
        )}
      </section>

      {showProductForm && (
        <form className="member-product-form" onSubmit={handleAddProduct}>
          <div>
            <span className="page-eyebrow">MEMBER TOOLS</span>
            <h2>Publish a new product</h2>
            <p>Add an item to your SHG storefront. It will appear immediately in this session.</p>
          </div>
          <input value={newProduct.name} onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} placeholder="Product name" />
          <select value={newProduct.category} onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })}>
            <option>Handicrafts</option><option>Food Products</option><option>Clothing</option><option>Home Products</option>
          </select>
          <input type="number" min="1" value={newProduct.price} onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })} placeholder="Price (₹)" />
          <input type="number" min="1" value={newProduct.stock} onChange={(event) => setNewProduct({ ...newProduct, stock: event.target.value })} placeholder="Stock" />
          <button type="submit" className="checkout-btn">Publish product</button>
        </form>
      )}

      {/* CATEGORIES */}
      <section className="marketplace-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "category-btn active"
                : "category-btn"
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      {/* FILTERS */}
      {showFilters && (
        <section className="marketplace-filter-panel">
          <div>
            <label>Sort By</label>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="default">Default</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="name">Product Name</option>
            </select>
          </div>

          <div>
            <label>Stock Availability</label>
            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
            >
              <option value="all">All Products</option>
              <option value="available">Available</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <button onClick={resetFilters}>Reset Filters</button>
        </section>
      )}

      {/* PRODUCTS */}
      <section className="marketplace-products-section">
        <div className="marketplace-section-heading">
          <div>
            <h2>Explore Products</h2>
            <p>{filteredProducts.length} products found</p>
          </div>
        </div>

        {loading ? (
          <div className="marketplace-message">
            Loading products...
          </div>
        ) : error ? (
          <div className="marketplace-message error">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="marketplace-message">
            <ShoppingBag size={35} />
            <h3>No products found</h3>
            <p>Try changing your search or filters.</p>
            <button onClick={resetFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* SHOPPING CART */}
      {showCart && (
        <div
          className="cart-overlay"
          onClick={() => setShowCart(false)}
        >
          <aside
            className="cart-sidebar"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <h2>My Shopping Cart</h2>
                <p>{cartCount} items</p>
              </div>

              <button onClick={() => setShowCart(false)}>
                <X size={23} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={55} />
                <h3>Your cart is empty</h3>
                <p>Add handmade products to get started.</p>

                <button onClick={() => setShowCart(false)}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <ShoppingBag size={30} />
                        )}
                      </div>

                      <div className="cart-item-info">
                        <h3>{item.name}</h3>

                        <p>
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>

                        <div className="cart-quantity">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                          >
                            <Minus size={15} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-right">
                        <strong>
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </strong>

                        <button
                          className="remove-cart-item"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total Amount</span>
                    <strong>
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <button
                    className="checkout-btn"
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    className="continue-shopping-btn"
                    onClick={() => setShowCart(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* CHECKOUT SUMMARY */}
      {showCheckout && (
        <div className="checkout-overlay">
          <div className="checkout-container">

            <div className="checkout-header">
              <h2>Checkout Summary</h2>

              <button onClick={() => setShowCheckout(false)}>
                <X size={22} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <h3>Your cart is empty</h3>
                <button onClick={() => setShowCheckout(false)}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <h3>Your Order Items</h3>

                <div className="checkout-items">
                  {cartItems.map((item) => (
                    <div className="checkout-item" key={item.id}>
                      <div className="checkout-item-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <ShoppingBag size={30} />
                        )}
                      </div>

                      <div className="checkout-item-details">
                        <h4>{item.name}</h4>
                        <p>
                          Price: ₹{item.price.toLocaleString("en-IN")}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                      </div>

                      <strong>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="checkout-total">
                  <span>Total Items</span>
                  <strong>{cartCount}</strong>
                </div>

                <div className="checkout-total final-total">
                  <span>Total Amount</span>
                  <strong>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </strong>
                </div>

                <button
                  className="checkout-confirm-btn"
                  onClick={() =>
                    alert(
                      "Order placement and payment will be connected to the backend later."
                    )
                  }
                >
                  Confirm Order
                </button>

                <button
                  className="checkout-back-btn"
                  onClick={() => {
                    setShowCheckout(false);
                    setShowCart(true);
                  }}
                >
                  Back to Cart
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Marketplace;
