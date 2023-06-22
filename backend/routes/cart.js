var express = require("express");
var router = express.Router();
const stripe = require("stripe")(
  'sk_test_51NLGtFSClWxc36p951AAEr8J0gn9E96tHk8rcL0NzGuf2Iu7QaZdvtk27hVt7M8yYZZpcBK0FWcjrgleSW161yhc003igZkfbs'
);

const { handleError, verifyAuth, getProduct } = require("../utils");
var { users, products } = require("../db");

// Cart Controller
router.get("/", verifyAuth, (req, res) => {
  console.log(`GET request to "/cart" received`);

  return res.status(200).json(req.user.cart);
});

router.post("/", verifyAuth, async (req, res) => {
  console.log(`POST request to "/cart" received`);

  products.findOne({ _id: req.body.productId }, async (err, product) => {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product doesn't exist" });
    }

    const index = await req.user.cart.findIndex(
      (element) => element.productId === req.body.productId
    );

    if (index === -1) {
      req.user.cart.push({
        productId: req.body.productId,
        qty: req.body.qty,
      });
    } else if (req.body.qty === 0) {
      // delete
      req.user.cart.splice(index, 1);
    } else {
      //modify
      req.user.cart[index].qty = req.body.qty;
    }
    users.update(
      { _id: req.user._id },
      { $set: { cart: req.user.cart } },
      {},
      (err) => {
        if (err) {
          handleError(res, err);
        }

        console.log(
          `User ${req.user.username}'s cart updated to`,
          req.user.cart
        );

        return res.status(200).json(req.user.cart);
      }
    );
  });
});

router.post("/checkout", verifyAuth, async (req, res) => {
  console.log(
    `POST request received to "/cart/checkout": ${req.user.username}`
  );

  let total = 0;
  for (let element of req.user.cart) {
    try {
      const product = await getProduct(element.productId);
      if (product == null) {
        throw new Error("Invalid product in cart. ");
      }
      total = total + element.qty * product.cost;
    } catch (error) {
      handleError(res, error);
    }
  }
  if (total === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }
  if (req.user.balance < total) {
    return res.status(400).json({
      success: false,
      message: "Wallet balance not sufficient to place order",
    });
  }
  if (!req.body.addressId) {
    return res.status(400).json({
      success: false,
      message: "Address not set",
    });
  }
  const addressIndex = await req.user.addresses.findIndex(
    (element) => element._id === req.body.addressId
  );
  if (addressIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Bad address specified" });
  }
  const items = [];

  for (const item of req.user.cart) {
    const product = await getProduct(item.productId);
    console.log(item);
    items.push({
      price_data: {
        currency: "usd",
        product_data: { name: product.name },
        unit_amount: product.cost,
      },
      quantity: item.qty,
    });
  }
  const stripe_object = {
    line_items: items,
    payment_method_types:['card'],
    mode: "payment",
    success_url: 'https://qkart-frontend-harshit.netlify.app/thanks',
    cancel_url: 'https://qkart-frontend-harshit.netlify.app/checkout',
  };

  // console.log("items:", stripe_object);

  const session = await stripe.checkout.sessions.create(stripe_object);

  // console.log("sec:", process.env.STRIPE_KEY);
  // console.log(session.url);
  req.user.balance -= total;
  console.log("Mock order placed");
  console.log("Cart", req.user.cart);
  console.log("Total cost", total);
  console.log("Address", req.user.addresses[addressIndex]);
  // Now clear cart
  // req.user.cart = [];
  users.update({ _id: req.user._id }, req.user, {}, (err) => {
    if (err) {
      handleError(res, err);
    }
    return res.status(200).json({
      url:session.url,
      success: true,
    });
  });
});

router.post("/thanks",verifyAuth,async(req,res)=>{
  try{
    // console.log(req.user.cart)
    req.user.cart=[];
    // console.log(req.user.cart)
    users.update({ _id: req.user._id }, req.user, {}, (err) => {
      if (err) {
        handleError(res, err);
      }
      return res.status(200).json({
        success: true,
      });
    });
  }catch(e){
    res.status(400).json({message:e.message})
  }
})

module.exports = router;
