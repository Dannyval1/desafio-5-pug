const express = require("express");
const handlebars = require("express-handlebars");
//import express from "express";
const { Router } = express;
const app = express();
const router = Router();
const PORT = 8080;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let productos = [];

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
  })
);
app.set("views", "./views"); //Directorio de las vistas
app.set("view engine", "pug"); //Directorio de las vistas

router.get("/productos", async (req, res) => {
  (productos.length > 0)
    ? res.render("main", { productList: productos, productExist: true })
    : res.render("main", { productList: productos, productExist: false });
});

router.post("/productos", async (req, res) => {
  if (req.body.producto) {
    productos.push(req.body.producto);
    productos.forEach((producto, index) => {
      producto.id = index + 1;
    });
  }
  if (!req.body.producto) {
    const priceNew = Number(req.body.productPrice);
    const newProduct = {
      title: req.body.productName,
      price: priceNew,
      thumbnail: req.body.productUrl,
    };
    productos.push(newProduct);
    productos.forEach((producto, index) => {
      producto.id = index + 1;
    });
    res.render("main", { productList: productos, productExist: true })
  }
  
});

app.use("/", router);

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${PORT}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
