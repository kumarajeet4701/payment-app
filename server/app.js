const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
const stripe = require("stripe")("sk_test_51OuFtdSC1O56nLJ9g0E6MP3tfDRjy1KSVa6AAbtknKsULbf0539eYJRmkFarsMW7zHNIxmt0t97GQqe4r7zXb8Ms00fSlIdcSQ");

//Checkout API
app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const { products } = req.body;
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.dish
                },
                unit_amount: product.price * 100,
            },
            quantity: product.qnty,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(7000, () => {
    console.log("Server Start");
});