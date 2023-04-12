//identifiant unique universel permet à des systèmes distribués d'identifier de façon unique une information sans coordination centrale importante
const uuid = require('uuid/v1');
const Product = require('../models/Product');

//recup les produits
//exports= utilisée lors de la création de modules JavaScript pour exporter des fonctions, des objets ou des valeurs primitives à partir du module, de sorte qu'ils puissent être utilisés par d'autres programmes grâce à l'instruction import
exports.getAllProducts = (req, res, next) => {
  Product.find().then(
    (products) => {
      const mappedProducts = products.map((product) => {
        // host = le nom de domaine du serveur
        product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
        return product;
      });
      res.status(200).json(mappedProducts);
    }
    //Si la promesse est rejetée 
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  );
};

exports.getOneProduct = (req, res, next) => {
  //retrouver avec l'identifiant du produit
  Product.findById(req.params.id).then(
    (product) => {
      if (!product) {
        //en cas de non récuperation du produit 
        return res.status(404).send(new Error('Product not found!'));
      }
      product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
      res.status(200).json(product);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  )
};

/**
 *
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */

//Les élément que la requete doit contenir 
exports.orderProducts = (req, res, next) => {
  if (!req.body.contact ||
      !req.body.contact.firstName ||
      !req.body.contact.lastName ||
      !req.body.contact.address ||
      !req.body.contact.city ||
      !req.body.contact.email ||
      !req.body.products) {
    return res.status(400).send(new Error('Bad request!'));
  }

  // let = déclarer une variable dont la portée est celle du bloc courant, éventuellement en initialisant sa valeur.
  let queries = [];
  for (let productId of req.body.products) {
    const queryPromise = new Promise((resolve, reject) => {
      Product.findById(productId).then(
        (product) => {
          if (!product) {
            reject('Product not found: ' + productId);
          }
          product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
          resolve(product);
        }
      ).catch(
        () => {
          reject('Database error!');
        }
      )
    });
    queries.push(queryPromise);
  }
  Promise.all(queries).then(
    (products) => {
      const orderId = uuid();
      return res.status(201).json({
        contact: req.body.contact,
        products: products,
        orderId: orderId
      })
    }
  ).catch(
    (error) => {
      return res.status(500).json(new Error(error));
    }
  );
};
