import { Contenedor } from "../managers/contenedorProductos.js";
import { faker } from "@faker-js/faker"

//const Contenedor = require("../managers/contenedorProductos")
//const faker = require("@faker-js/faker")
//const { faker } = require('@faker-js/faker');

const { datatype, commerce, image } = faker

class ProductMock extends Contenedor{
    constructor(){
        super()
    }

    populate(cant){
        let newProducts = []
        for (let i=0; i<cant; i++){
            newProducts.push(
                {
                    id: datatype.uuid(),
                    title: commerce.productName(),
                    price: commerce.price(),
                    thumbnail: image.image()
                }
            )
        }
        //this.products = [...this.products, ...newProducts]
        this.products = [...newProducts]
        return newProducts
    }
}

//module.exports = ProductMock;

export {ProductMock}
