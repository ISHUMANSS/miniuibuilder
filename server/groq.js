import Groq from "groq-sdk/index.mjs";

//this is needed to be able to get the env from the .env
import "dotenv/config";


//set up the api
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



//from testing openai/gpt-oss-20b has given the best general results

const MODEL = "openai/gpt-oss-20b";


/**
 * get the requirements from a users input
 * @param {*} userInput 
 * @returns JSON
 */
export async function getGroqChatCompletion(userInput) {
  const chatCompletion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are a strict JSON generator for an app building assistant.
        Always return a single JSON object matching this exact schema.
        For "Features", the key MUST be a role name, and the value is an array of features for that role.
        For "Entities", the key MUST be a role name. The value should be an object where each key is an entity that role can manage, and the value is an array of that entity's fields. An entity can appear under multiple roles.

        {
          "App Name": string | null,
          "Roles": string[] | null,
          "Entities": { 
            [roleName: string]: { 
              [entityName: string]: string[] 
            } 
          } | null,
          "Features": { [roleName: string]: string[] } | null
        }`
      },
      {
        role: "user",
        content: `Extract app requirements from this description: "${userInput}".`
      }
    ],
    response_format: { type: "json_object" },
  });

  const rawContent = chatCompletion.choices[0]?.message?.content || "{}";
  
  //ai should return valid json
  try {
    const parsed = JSON.parse(rawContent);
    //normalization to clean up the data
    return normalizeAppData(parsed);
  } catch (err) {
      console.error("Failed to parse AI JSON response:", err);
      //return a default structure on failure
      return { appName: "Error App", roles: [], features: [], entities: {} };
  }
}

/**
 * turn the data into usable data in the fount end
 * @param {*} parsed 
 * @returns 
 */
function normalizeAppData(parsed) {
  const entities = {};

  //ai sometimes returns an array of strings instead of an object
  //handle both cases
  if (Array.isArray(parsed.Entities)) {
    //when array like ["Student", "Course"] convert it
    parsed.Entities.forEach((entity) => {
      //default structure
      //AI failed to provide fields when placeholders
      entities[entity] = ["Name", "Description"]; 
    });
  } else if (parsed.Entities && typeof parsed.Entities === 'object') {
    //if correct object format use it
    Object.assign(entities, parsed.Entities);
  }

  return {
    appName: parsed["App Name"] || "Unnamed App",
    roles: parsed.Roles || [],
    features: parsed.Features || {}, 
    entities: parsed.Entities || {},
  };
}