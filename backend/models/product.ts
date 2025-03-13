import { Schema, model, Document } from "mongoose";
 //interface for product
 interface ProductI {
    name:string,
    description:string,
    image:string,
    price:{
        original:number,
        current:string
    }
    stock:number,
    category?:string,

 };
 //creating the schema for Products
 export const ProductSchema = new Schema (
    {
        name:{type:String, required:true, trim:true},
        description:{type:String, default:""},
        image:{type: String, default:"logo.png"},
        price:{type:Number,required:true},
        stock:{type:Number, default:0},
        category: {type:String}
 },
{timestamps: true},
)


// create the model
const ProductModel = model("product", ProductSchema);

export default ProductModel;
