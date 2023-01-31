import products from "../models/product.js";
import slugify from "slugify";
import fs from "fs";

export const create = async (req, res) => {
    try {
        // console.log(req.fields);
        // console.log(req.files);
        const {name, description, price, category, quantity, shipping} = req.fields;
        const {photo} = req.files;

        //Validation
        switch (true) {
            case !name.trim():
                return res.json({error: "Name is Required"});
            case !description.trim():
                return res.json({error: "Description is Required"});
            case !price.trim():
                return res.json({error: "Price is Required"});
            case !category.trim():
                return res.json({error: "Category is Required"});
            case !quantity.trim():
                return res.json({error: "Quantity is Required"});
            case !shipping.trim():
                res.json({error: "Shipping is Required"});
            case photo && photo.size > 1000000:
                return res.json({error: "Image should be less than 1MB in Size"});
        }

    //Create Products
    const product = new products({...req.fields, slug: slugify(name)});

    if(photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);

    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
}

export const list = async (req,res) => {
    try {
        const product = await products.find({})
        .select("-photo")
        .populate("category")
        .limit(12)
        .sort({createdAt: -1});
    
        res.json(product);
    } catch (err) {
        console.log(err);
        return res.status(400).json({error: err.message});
    }
}

export const read = async (req, res) => {
    try {
        const product = await products.findOne({slug: req.params.slug})
        .select("-photo")
        .populate("category")

        res.json(product);
    } catch (err) {
        console.log(err);
        return res.status(400).json({error: err.message});
    }
}

export const photo =  async (req, res) => {
    try {
        const product = await products.findById(req.params.productId)
        .select("photo");
        if(product.photo.data) {
            res.set("content-Type", product.photo.contentType);
            return res.send(product.photo.data);
        }
    } catch (err) {
        console.log(err);
    }
}

export const remove =  async (req, res) => {
    try {
        const product = await products.findByIdAndDelete(req.params.productId)
        .select("-photo");
        res.json(product);
    } catch (err) {
        console.log(err);
    }
}

export const update = async (req, res) => {
    try {
        // console.log(req.fields);
        // console.log(req.files);
        const {name, description, price, category, quantity, shipping} = req.fields;
        const {photo} = req.files;

        //Validation
        switch (true) {
            case !name.trim():
                return res.json({error: "Name is Required"});
            case !description.trim():
                return res.json({error: "Description is Required"});
            case !price.trim():
                return res.json({error: "Price is Required"});
            case !category.trim():
                return res.json({error: "Category is Required"});
            case !quantity.trim():
                return res.json({error: "Quantity is Required"});
            case !shipping.trim():
                return res.json({error: "Shipping is Required"});
            case photo && photo.size > 1000000:
                return res.json({error: "Image should be less than 1MB in Size"});
        }

    //Update Products
    const product = await products.findByIdAndUpdate(req.params.productId, {
        ...req.fields,
        slug: slugify(name)
    }, {new: true}
    );

    if(photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);

    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
}

export const filterProduct = async (req, res) => {
    try {
        const {checked, radio} = req.body;

        let args = {}
        if (checked.length >0) args.category = checked;
        if (radio.length) args.price = {$gte: radio[0], $lte: radio[1]}
        // console.log("args", args);
    
        const Product = await products.find(args);
        // console.log("filtered",Product);
        res.json(Product);
    } catch (err) {
        console.log(err);
    }
} 

export const productCount = async (req, res) => {
    try {
        const total = await products.find({}).estimatedDocumentCount();
        res.json(total);
    } catch (err) {
        return res.status(400).json(err.message);
    }
}

export const listProducts = async (req, res) => {
    try {
        const perPage = 2;
        const page = req.params.page;

        const Product = await products.find({})
        .select("-photo")
        .skip((page-1) * perPage)
        .limit(perPage)
        .sort({createdAt: -1});

        res.json(Product);
    } catch (err) {
        return res.status(400).json(err.message);
    }
}

export const productsSearch = async(req, res) => {
    try {
        const {keyword} = req.params;
        const Product = await products.find({
            $or: [
                {name : {$regex: keyword, $options: "i"}},
                {description : {$regex: keyword, $options: "i"}},
            ],
        }).select("-photo");

        res.json(Product);
    } catch (err) {
        console.log(err);
    }
}