const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = "mongodb+srv://carlos123:carlos123@cluster0.zldjw7s.mongodb.net/smartstep_rn?retryWrites=true&w=majority";
const client = new MongoClient(uri);

client.connect().then(() => {
  const db = client.db("smartstep_rn");
  const usersCollection = db.collection("users");
  const perfilCollection = db.collection("perfil");

  // Endpoint para registrar usuario
  app.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: "Todos los campos son obligatorios." });
      }
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, error: "El correo ya está registrado." });
      }
      const result = await usersCollection.insertOne({ name, email, password });
      res.json({ success: true, id: result.insertedId });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Endpoint para iniciar sesión
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Todos los campos son obligatorios." });
      }
      const user = await usersCollection.findOne({ email, password });
      if (!user) {
        return res.status(400).json({ success: false, error: "Correo o contraseña incorrectos." });
      }
      res.json({ success: true, id: user._id });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Endpoint para guardar/actualizar perfil
  app.post('/perfil', async (req, res) => {
    try {
      const { userId, name, age, weight, height } = req.body;
      if (!userId) {
        return res.status(400).json({ success: false, error: "User ID is required." });
      }
      const result = await perfilCollection.updateOne(
        { userId: userId },
        { $set: { name, age, weight, height } },
        { upsert: true }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Endpoint para obtener el perfil de un usuario
  app.get('/perfil', async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ success: false, error: "User ID is required." });
      }
      const perfil = await perfilCollection.findOne({ userId: userId });
      res.json({ success: true, perfil });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error(err);
});
