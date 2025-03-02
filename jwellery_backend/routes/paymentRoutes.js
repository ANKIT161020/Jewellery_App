const express = require("express");
const razorpayInstance = require("../config/razorpay");
const Order = require("../models/Order");
const crypto = require("crypto");

const router = express.Router();

// CREATE PAYMENT ORDER
router.post("/create-order", async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if (!userId || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Calculate total amount in paise (smallest currency unit)
    const totalAmount =
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0) *
      100;

    // Create Razorpay order
    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    // Save order in database
    const newOrder = new Order({
      userId,
      items: cartItems,
      totalAmount: totalAmount / 100, // Store in rupees
      razorpayOrderId: order.id,
      status: "Pending",
    });
    await newOrder.save();

    res.json({ orderId: order.id, amount: totalAmount, currency: "INR" });
  } catch (error) {
    res.status(500).json({ message: "Payment order creation failed" });
  }
});

// VERIFY PAYMENT
router.post("/verify-payment", async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      // Update order status to 'Paid'
      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { status: "Paid", razorpayPaymentId: paymentId },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({
        message: "Payment verified successfully",
        order: updatedOrder,
      });
    } else {
      res
        .status(400)
        .json({ message: "Invalid signature, payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Payment verification failed" });
  }
});

module.exports = router;
