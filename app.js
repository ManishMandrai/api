const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require("body-parser")
const app = express();

mongoose.connect("mongodb://localhost:27017/Sample")
    .then(() => {
        console.log("connected with mongodb");
    })
    .catch((err) => {
        console.log(err);
    });


app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json())


const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
})

const Product = new mongoose.model("Product", productSchema)
//Create Product
app.post("/api/v1/product/new", async (req, res) => {
    const product = await Product.create(req.body)
    res.status(200).json({
        success: true,
        product
    })
})

//read product 
app.get("/api/v1/products", async (req, res) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
})


//Update Product
app.put("/api/v1/product/:id", async (req, res) => {
    let product = await Product.findById(req.params.id);

    product = await Product.findByIdAndUpdate(
        req.params.id, req.body,
        {
            new: true,
            useFindAndModify: false,
            runValidators: true
        })
    res.status(200).json({
        success: true,
        product
    })
})


//delete Product
app.delete("/api/v1/product/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: "product is deleted "
    })
})


app.listen(4500, () => {
    console.log('Server is working on http://localhost:4500')
})
