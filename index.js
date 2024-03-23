const express = require("express");

// Conexion a la BBDD
const { connect } = require("./db.js");
const { cryptoRouter } = require("./routes/crypto.routes.js");
try {
  connect();
} catch (error) {
  console.log(`Ha ocurrido un error al conectar: ${error}`);
}

// Configuracion del servidor
const PORT = 3000;
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Rutas
const router = express.Router();
router.get("/", (req, res) => {
  res.send("Crypto API");
});
router.get("*", (req, res) => {
  res.status(404).send("La pagina solicitada no existe");
})

// Uso del router
server.use("/crypto", cryptoRouter);
server.use("/", router);


// Ejecución del servidor
server.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});