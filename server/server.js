//server.js
//contains all of the requests and runs the api calls
import "dotenv/config";

//allow for hosting
import path, { dirname } from 'path';
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import { getGroqChatCompletion } from "./groq.js";
import { insertUI, listUIs, getUIById, updateUI, deleteUI, connectToDB } from "./mongo.js";

//resolve dirname for es module
const __filename = fileURLToPath(import.meta.url);
const __direname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 5000;

//enable CORS for frontend
app.use(cors());
app.use(express.json());

//use the client app
app.use(express.static(path.join(__direname, '/frontend/build')));

//render client for any path
app.get(/^\/(?!api).*/, (req, res) => 
  res.sendFile(path.join(__direname, '/frontend/build/index.html'))
);


//requiremnts getter
app.post("/api/requirements", async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description is required." });
    }

    //returns clean JSON object after normilazation
    const requirements = await getGroqChatCompletion(description);
    
    console.log("Sending structured requirements to frontend:", requirements);

    //send the entire object directly
    res.json(requirements);

  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Something went wrong processing your request." });
  }
});


//mongo db

//save a generated UI (frontend should send the normalized requirements JSON)
app.post("/api/ui", async (req, res) => {
  try {
    const ui = req.body;
    if (!ui) return res.status(400).json({ error: "UI JSON body required" });

    const insertedId = await insertUI(ui);
    res.status(201).json({ id: insertedId });
  } catch (err) {
    console.error("Failed to save UI:", err);
    res.status(500).json({ error: "Failed to save UI" });
  }
});

//list saved uis
app.get("/api/ui", async (req, res) => {
  try {
    const items = await listUIs();
    res.json(items);
  } catch (err) {
    console.error("Failed to list UIs:", err);
    res.status(500).json({ error: "Failed to list UIs" });
  }
});


//get single ui
app.get("/api/ui/:id", async (req, res) => {
  try {
    const ui = await getUIById(req.params.id);
    if (!ui) return res.status(404).json({ error: "UI not found" });
    res.json(ui);
  } catch (err) {
    console.error("Failed to get UI:", err);
    res.status(500).json({ error: "Failed to get UI" });
  }
});

//update ui
app.put("/api/ui/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const updated = await updateUI(id, update);
    if (!updated) return res.status(404).json({ error: "UI not found or failed to update" });
    res.json(updated);
  } catch (err) {
    console.error("Failed to update UI:", err);
    res.status(500).json({ error: "Failed to update UI" });
  }
});

//delete a UI
app.delete("/api/ui/:id", async (req, res) => {
  try {
    const ok = await deleteUI(req.params.id);
    if (!ok) return res.status(404).json({ error: "UI not found or failed to delete" });
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete UI:", err);
    res.status(500).json({ error: "Failed to delete UI" });
  }
});

//check server is running and if connected
app.listen(PORT, async () => {
  try {
    await connectToDB();
    console.log(`Server running on port ${PORT} and connected to MongoDB`);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);// crash if no DB
  }
});