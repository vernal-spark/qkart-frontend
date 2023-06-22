import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  return cartData.map((item) => ({
    ...item,
    ...productsData.find((product) => item.productId === product._id),
  }));
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let total = 0;
  items.forEach((ele) => {
    total += ele.qty * ele.cost;
  });
  return total;
};
export const getTotalItems = (items = []) => {
  let total = 0;
  items.forEach((ele) => {
    total += ele.qty;
  });
  return total;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const ItemQuantity = ({ isReadOnly, value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      {!isReadOnly ? (
        <>
          <IconButton size="small" color="primary" onClick={handleDelete}>
            <RemoveOutlined />
          </IconButton>
          <Box padding="0.5rem" data-testid="item-qty">
            {value}
          </Box>
          <IconButton size="small" color="primary" onClick={handleAdd}>
            <AddOutlined />
          </IconButton>
        </>
      ) : (
        <Box padding="0.5rem" data-testid="item-qty">
          Qty:{value}
        </Box>
      )}
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const Cart = ({ isReadOnly, products, items = [], handleQuantity }) => {
  let history = useHistory();
  const token = localStorage.getItem("token");
  if (!items.length) {
    return (
      <Box fullWidth className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((ele) => (
          <Box
            key={ele._id}
            display="flex"
            alignItems="flex-start"
            padding="1rem"
          >
            <Box className="image-container">
              <img
                // Add product image
                src={ele.image}
                // Add product name as alt eext
                alt="logo"
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{ele.name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ItemQuantity
                  // Add required props by checking implementation
                  isReadOnly={isReadOnly}
                  handleAdd={async () => {
                    handleQuantity(
                      token,
                      items,
                      products,
                      ele.productId,
                      ele.qty + 1
                    );
                  }}
                  handleDelete={async () => {
                    handleQuantity(
                      token,
                      items,
                      products,
                      ele.productId,
                      ele.qty - 1
                    );
                  }}
                  value={ele.qty}
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${ele.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => {
                history.push("/checkout");
              }}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly && (
        <Box
          className="cart"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Typography variant="h5" alignSelf="center" component="h2">
            Order Details
          </Typography>
          <Box
            p="1rem"
            display="flex"
            direction="row"
            justifyContent="space-between"
            sx={{ p: 2 }}
          >
            <Box>Products</Box>
            <Box>{getTotalItems(items)}</Box>
          </Box>
          <Box
            display="flex"
            direction="row"
            justifyContent="space-between"
            sx={{ p: 2 }}
          >
            <Box>Subtotal</Box>
            <Box>${getTotalCartValue(items)}</Box>
          </Box>
          <Box
            display="flex"
            direction="row"
            justifyContent="space-between"
            sx={{ p: 2 }}
          >
            <Box>Shipping</Box>
            <Box>$0</Box>
          </Box>
          <Box
            display="flex"
            direction="row"
            justifyContent="space-between"
            sx={{ p: 2 }}
          >
            <Box>Total</Box>
            <Box>${getTotalCartValue(items)}</Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default withRouter(Cart);
