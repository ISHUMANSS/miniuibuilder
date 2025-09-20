import Groq from "groq-sdk";

//this is needed to be able to get the env from the .env
import "dotenv/config";

//set up the api
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function main() {
//   const chatCompletion = await getGroqChatCompletion();
//   // Print the completion returned by the LLM.
//   console.log(chatCompletion.choices[0]?.message?.content || "");
// }

export async function getGroqChatCompletion(userInput) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        //the query
        content: `Extract app requirements from this description: "${userInput}". Return JSON with App Name, Entities, Roles, Features.`,
      },
    ],
    //what model I want it to use
    model: "openai/gpt-oss-20b",
  });
}


// //runs the query
// main().catch(console.error);
