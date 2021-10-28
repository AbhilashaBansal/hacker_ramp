const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');

const {Product, db} = require('../db');


// get all products
router.get('/products', (req, res)=>{
    Product.findAll()
    .then((data)=>{
        return res.json(data);
    })
    .catch((e)=>{
        return res.send(e.message);
    })
})


// get list of brands & categories
router.get('/all_brands', (req, res)=>{
    Product.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('brand')), 'brand']]
    })
    .then((data)=>{
        return res.json(data);
    })
    .catch((e)=>{
        return res.send(e.message);
    })
})
router.get('/all_cats', (req, res)=>{
    Product.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']]
    })
    .then((data)=>{
        return res.json(data);
    })
    .catch((e)=>{
        return res.send(e.message);
    })
})


// get products by brand & category
router.post('/vs/products', (req, res)=>{
    let brands = req.body.brands;
    let categories = req.body.categories;

    Product.findAll({
        where: {
            [Op.and]: [
                {brand: {
                    [Op.or]: brands
                }},
                {category: {
                    [Op.or]: categories
                }}
            ]
        }
    })
    .then((data)=>{
        return res.json(data);
    })
    .catch((e)=>{
        return res.send({error: e.message});
    })
})


// add a product
router.post('/product/add', (req, res)=>{
    if(req.body.name && req.body.brand && req.body.category && req.body.picture1 && req.body.picture2 && req.body.price && req.body.description){
        Product.create({
            name: req.body.name,
            brand: req.body.brand,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            discount: req.body.discount || 0.00,
            picture1: req.body.picture1,
            picture2: req.body.picture2,
            picture3: req.body.picture3
        }).then((item)=>{
            return res.send({val: "success"});
        }).catch((error)=>{
            //throw error;
            return res.send(error.message);
        })
    }
    else{
        console.log(req.body);
        return res.send("Enter all details to add item.");
    }
})


module.exports = router;
