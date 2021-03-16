"use strict"

var Cart = require("../models/cart.model");
var Product = require("../models/product.model");

function addToCart(req,res){
    var productId = req.params.id;
    var params = req.body;
    var userId = req.user.sub;

    if(params.stock){
        Product.findById(productId,(err,productFind)=>{
            if(err){
                return res.status(500).send({message: "Error al agregar un producto"});
            }else if(productFind){
                if(params.stock > productFind.stock){
                    return res.status(403).send({message: "La cantidad a es mayor a la cantidad del producto"});
                }else{
                    Cart.findOneAndUpdate({owner: userId},{$push:{products:productFind._id,stock:params.stock}},{new:true},(err,cartUpdated)=>{
                        if(err){
                            return res.status(500).send({message: "Error al agregar producto"});
                        }else if(cartUpdated){
                            return res.send({message: "Producto agregado al carrito"});
                        }else{
                            return res.status(404).send({message: "No se ha encontrado su carrito"});
                        }
                    })
                }
            }else{
                return res.status(403).send({message: "Producto inexistente"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingresar cantidad de productos"});
    }
}

module.exports = {
    addToCart
}