
## AI UI Mock Up Builder

This Project was created for the Decoded Intern Evaluation Task. 

It is a basic web portal where a user can input a prompt of a site they want. The requirements are pulled out from the prompt by AI and a non-functional basic ui is generated according to the requirements in the user's prompt.

Because this site uses AI the requirements that are generated from a prompt can change each time it is re-run, so if you are unhappy with what is generated from a prompt one time, you can just run the generation again and slightly change the prompt until you get the roles and requirements you want.

This site is also just for testing and is very limited in its deployment so it is being hosted and uses free versions of software, like with Groq so there is a limited number of requests to the API per day so it might not always be available. 
## Project Goals
The goal of this project is to show how natural language can be used be to get the requirements for a site and then how those requirements can be modelled to act as a real site. This kinda project or a more fully developed version can help people who know what they want in a site but aren't able to translate those ideas into technical requiremnts or prototypes.

This project addresses that challenge by:

- Capturing requirements from plain English prompts using an AI model.
- Automatically generating a simple mock user interface (UI) to visualise those requirements.
- Providing a proof of concept portal that shows how AI can accelerate early stages of app design and requirement gathering.
## Tech Stack

**Client:** React

**Server:** Node, Express

**AI:** Groq as the api / hosting service 

**AI Model:** openai/gpt-oss-20b

**Database:** Mongo DB 

## Features

- AI Requirement Capture 
- Convert Plain text into structured JSON
- Saving UI to DB
- Loading UI from DB
- Applying AI Requirement from JSON


## Online Deployment

This project was deployed with Render. When first loading the project, it can take a few minutes to spin up after not being used for some time.

Project Link: https://miniuibuilder-for-internship-project.onrender.com/ 


## Run Locally

Clone the project

```bash
  git clone https://github.com/ISHUMANSS/miniuibuilder
```

Go to the server directory

```bash
  cd server
```

Install server dependencies:

```bash
  npm install
```

```bash
    npm install mongodb dotenv express cors
```

```bash
    npm i groq-sdk
```

Install and Build Front End:

```bash
  cd frontend
```

```bash
  npm install
```

```bash
    npm i react-router-dom
```

```bash
    npm install react-toastify
```

Build the frontend so it can be run by the server:
```bash
    npm run build
```

Start the server: in the server folder
```bash
  node server.js
```


## Usage

1. Start the server (`node server.js`).
2. Open http://localhost:5000 (or online with render).
3. Enter a description of a site you want.
4. The AI extracts requirements and generates a basic UI.
5. Save and reload generated UIs from the database.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the server folder

Mongo DB
- `MONGODB_URI`

- `MONGODB_DB`

- `MONGODB_COLLECTION`

Groq

- `GROQ_API_KEY`


## Future Improvements
Improve Database connectivity
- Allow for updates on saved UIs
- Allow for the Deletion of a saved UI on the page

General Site
- Have an authenticated user to manage saved UIs
- Have user accounts so specific users can have their own saved UIs 
- Support for exporting generated UIs into actual React code and into working features
- Improve Site CSS and overall look
- More custom elements rather than just the same tabs, action buttons, and forms
- Allow for user colour choices in the UI

## Authors

- [@Is_human](https://github.com/ISHUMANSS) (Alister Faid)

