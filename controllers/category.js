import Category from "../models/category.js";
import slugify from "slugify";

export const create = async(req, res) => {
    try {
        const {name} = req.body;
        if(!name.trim()) {
            return res.json({error: "Name is Reuqired"});
        }
        const exisitngCategory = await Category.findOne({name});
        if (exisitngCategory) {
            return res.json({error: "Category Already exists"});
        }

        const category = await new Category({name, slug: slugify(name)}).save();
        res.json(category);
    } catch (err) {
        console.log(err)
        return res.status(400).json(err);
    }
}


export const update = async(req, res) => {
    try {
        const {name} =  req.body;
        const {categoryId} = req.params;

        const category = await Category.findByIdAndUpdate(categoryId, {
            name, 
            slug: slugify(name),
        },
        {new: true}
        );
        res.json(category);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

export const remove = async(req, res) => {
    try {
        const {categoryId} = req.params;
        const category = await Category.findByIdAndDelete(categoryId);
        res.json(category);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

export const list = async(req, res) => {
    try {
        const category = await Category.find({});
        res.json(category); 
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

export const read = async(req, res) => {
    try {
        const category = await Category.findOne({slug: req.params.slug});
        res.json(category);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}