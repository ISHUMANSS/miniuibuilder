import express from "express";
import cors from "cors";
import { getGroqChatCompletion } from "./groq.js";

const app = express();
const PORT = process.env.PORT || 5000;

//enable CORS for frontend
app.use(cors());
app.use(express.json());

//aPI endpoint to get requirements
app.post("/api/requirements", async (req, res) => {
  try {
    const { description } = req.body;

    // Call Groq AI
    const response = await getGroqChatCompletion(description);
    console.log("AI response:", response);

    // Send back the AI content
   const content = response.choices[0]?.message?.content || "";
  console.log("AI raw content:", content); 
  res.json({ aiContent: content });
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
