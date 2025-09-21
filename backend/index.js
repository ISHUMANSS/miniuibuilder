//contains all of the requests and runs the api calls

import express from "express";
import cors from "cors";
import { getGroqChatCompletion } from "./groq.js";

const app = express();
const PORT = process.env.PORT || 5000;

//enable CORS for frontend
app.use(cors());
app.use(express.json());

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


//happy with the requirements submit to mongo db


//check server is running
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
