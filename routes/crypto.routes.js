const express = require("express");

// Router de Crypto
const router = express.Router();

// Modelos
const { Crypto } = require("../models/Crypto.js");

// CRUD: CREATE
router.post("/", async (req, res) => {
  try {
    const crypto = new Crypto(req.body);

    const createdCrypto = await crypto.save();
    return res.status(201).json(createdCrypto);
  } catch (error) {
    res.status(500).json(error);
  }
});
// CRUD: READ
router.get("/", async (req, res) => {
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const cryptos = await Crypto.find()
      .limit(limit)
      .skip((page - 1) * limit);
    // Num total de elementos
    const totalElements = await Crypto.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: cryptos,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});
// No CRUD. Busqueda por nombre
router.get("/name/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const crypto = await Crypto.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (crypto) {
      res.json(crypto);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// CRUD: Read por marketCap ordenado
router.get("/sorted-by-marketcap/", async (req, res) => {
  const order = req.query.order;
  try {
    if (order === "asc") {
      try {
        const cryptos = await Crypto.find().sort({ marketCap: order });
        res.json(cryptos);
      } catch (error) {
        res.status(500).json(error);
      }
    }else if(order === "desc"){
        try {
            const cryptos = await Crypto.find().sort({ marketCap: order });
            res.json(cryptos);
        } catch (error) {
            res.status(500).json(error)
        }
    }
  } catch (error) {
    res.status(500).json(error)
  }
});
// CRUD: Read por fecha ordenado
router.get("/sorted-by-date/", async (req, res) => {
    const order = req.query.order;
    try {
      if (order === "asc") {
        try {
          const cryptos = await Crypto.find().sort({ created_at: order });
          res.json(cryptos);
        } catch (error) {
          res.status(500).json(error);
        }
      }else if(order === "desc"){
          try {
              const cryptos = await Crypto.find().sort({ created_at: order });
              res.json(cryptos);
          } catch (error) {
              res.status(500).json(error)
          }
      }
    } catch (error) {
      res.status(500).json(error)
    }
});
  //CRUD: Read por price range
router.get("/price-range/", async (req, res) => {
    // Lectura de parameters
    const min = parseInt(req.query.min);
    const max = parseInt(req.query.max);
  
    if (max <= min || min >= max) {
      res.status(500).json("Los rangos minimos y maximos son incorrectos.");
    } else {
      try {
        const cryptos = await Crypto.find({ price: { $gt: min, $lt: max } });
        if (cryptos) {
          res.json(cryptos);
        } else {
          res.status(400).json("No hay cryptos en este rango");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    }
});
// CRUD: Read a CSV
router.get("/csv", async (req, res) => {
  try {
    const cryptos = await Crypto.find();
    let csv = "";
    if (cryptos.length === 0) {
      return res.status(404).json({ message: "No hay datos disponibles para exportar en CSV" });
    }
    // Encabezados
    const headers = Object.keys(cryptos[0].toObject());
    csv = csv + headers.join(";") + "\n";

    // Recorremos cada fila
    cryptos.forEach((item) => {
      // Dentro de cada fila recorremos todas las propiedades
      headers.forEach((header) => {
        csv = csv + item[header] + ";";
      });
      csv = csv + "\n";
    });
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
    res.status(200);
  } catch (error) {
    res.status(500).json(error);
  }
});
// CRUD: READ
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cryptos = await Crypto.findById(id);
    if (cryptos) {
      res.json(cryptos);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// CRUD: UPDATE
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const criptoUpdated = await Crypto.findByIdAndUpdate(id, req.body);
    if (criptoUpdated) {
      res.json(criptoUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// CRUD: Delete
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cryptoDeleted = await Crypto.findByIdAndDelete(id);
    if (cryptoDeleted) {
      res.json(cryptoDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json();
  }
});

module.exports = { cryptoRouter: router };
