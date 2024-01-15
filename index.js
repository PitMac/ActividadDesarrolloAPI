const express = require("express");
const app = express();
const port = 3000;
const { Client } = require("pg");

const connectionData = {
  user: "postgres",
  host: "localhost",
  database: "db_curso_app",
  password: "2003",
  port: 5432,
};
const client = new Client(connectionData);

client.connect();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

app.post("/insert", async (req, res) => {
  const {
    idpersona,
    cedula,
    nombres,
    apellidos,
    fecha_nacimiento,
    telefono,
    direccion,
  } = req.body;

  await client
    .query(
      "INSERT INTO esq_datos_personales.persona(cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion]
    )
    .then((result) => res.json({ data: result.rows }))
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Error al seleccionar datos", message: error.message })
    );
});

app.post("/select", (req, res) => {
  client
    .query("SELECT * FROM esq_datos_personales.persona")
    .then((result) => res.json({ data: result.rows }))
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Error al seleccionar datos", message: error.message })
    );
});

app.post("/delete", (req, res) => {
  const { idpersona } = req.body;
  client
    .query(
      "DELETE FROM esq_datos_personales.persona WHERE idpersona = $1 RETURNING *",
      [idpersona]
    )
    .then((result) =>
      res.json({
        message: "Datos eliminados correctamente",
        data: result.rows[0],
      })
    )
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Error al eliminar datos", message: error.message })
    );
});

app.post("/where", (req, res) => {
  const { idpersona } = req.body;
  pool
    .query("SELECT * FROM esq_datos_personales.persona WHERE idpersona = $1", [
      idpersona,
    ])
    .then((result) => res.json({ data: result.rows }))
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Error al aplicar condición", message: error.message })
    );
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
