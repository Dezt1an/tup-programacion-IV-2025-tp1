import express from "express";

const app = express();

const PORT = 3000;


app.use(express.json());


const rectangulos = [];


const esValido = ({ largo, ancho }) =>
  Number.isFinite(largo) && Number.isFinite(ancho) && largo > 0 && ancho > 0;


const calcularDatos = (largo, ancho) => ({
  largo,
  ancho,
  perimetro: 2 * (largo + ancho),
  superficie: largo * ancho
});


app.get("/", (req, res) => {
  res.send("Hola Mundo")
});


app.post("/rectangulos", (req, res) => {
  const { largo, ancho } = req.body

  if (!esValido({ largo, ancho })) {
    return res.status(400).json({ error: "Valores inválidos" })
  }

  const nuevo = calcularDatos(largo, ancho)
  rectangulos.push(nuevo)

  res.status(201).json(nuevo)
});


app.get("/rectangulos", (req, res) => {

  const lista = rectangulos.map(r => ({
    ...r,
    tipo: r.largo === r.ancho ? "Cuadrado" : "Rectángulo"
  }))

  res.json(lista)
});


app.get("/rectangulos/:id", (req, res) => {

  const id = Number(req.params.id)

  if (!rectangulos[id]) {
    return res.status(404).json({ error: "Cálculo no encontrado" })
  }

  const r = rectangulos[id]
  res.json({ ...r, tipo: r.largo === r.ancho ? "Cuadrado" : "Rectángulo" })
});


app.put("/rectangulos/:id", (req, res) => {

  const id = Number(req.params.id)
  const { largo, ancho } = req.body

  if (!rectangulos[id]) {
    return res.status(404).json({ error: "Cálculo no encontrado" })
  }

  if (!esValido({ largo, ancho })) {
    return res.status(400).json({ error: "Valores inválidos" })
  }

  rectangulos[id] = calcularDatos(largo, ancho)

  res.json(rectangulos[id])
});


app.delete("/rectangulos/:id", (req, res) => {

  const id = Number(req.params.id)

  if (!rectangulos[id]) {
    return res.status(404).json({ error: "Cálculo no encontrado" })
  }

  const eliminado = rectangulos.splice(id, 1)

  res.json({ mensaje: "Cálculo eliminado", eliminado })
});


app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`)
});
