# MieritzAI - AI-Powered Legal Chatbot

*Developed as part of my final bachelor's project in web development.*

MieritzAI is an AI-powered chatbot developed for Mieritz Advokatfirma. The project leverages technologies like **LangChain.js**, **OpenAI API**, and **Datastax Astra DB** to deliver accurate and relevant legal information based on the firm's website [Mlaw.dk](https://mlaw.dk) and general legal knowledge. This project represents the culmination of my bachelor's degree in web development, showcasing the integration of modern technologies to solve a company's challenge.

## Introduction

This project was created as part of my final bachelor's project in web development at Zealand Institute of Business & Technology. The aim was to design and develop an AI-driven chatbot to improve the accessibility of legal information for clients and staff at Mieritz Advokatfirma.

MieritzAI uses a **Retrieval-Augmented Generation (RAG)** architecture to combine generative AI models with precise context retrieved from the firm’s website. By delivering an intuitive and functional solution, the project bridges the gap between advanced technology and the practical needs of the legal field. This work highlights my ability to research, design, implement, and deploy a scalable application that addresses specific user needs.

## Features

- **Semantic Search:** Implements vector-based search to retrieve precise information.
- **Markdown Formatting:** Generates readable and structured responses using headings, bullet points, and highlights.
- **Real-time Chat:** Streams responses dynamically for a smooth conversational experience.
- **User-Friendly Interface:** Intuitive UI with prompt suggestions for easy interaction.
- **Scalable Hosting:** Deployed on Vercel for fast and reliable performance.

## Technologies

This project utilizes the following technologies:

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** LangChain.js, OpenAI API
- **Database:** Datastax Astra DB
- **Hosting:** Vercel
- **Additional Libraries:** `lucide-react`, `marked`

## Installation

### Requirements

- Node.js v16 or later
- An OpenAI API key
- A Datastax account

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Mark424e/nextjs-mlawgpt.git
cd mlawgpt
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add the following variables:

```bash
ASTRA_DB_NAMESPACE=<your-namespace>
ASTRA_DB_COLLECTION=<your-collection>
ASTRA_DB_API_ENDPOINT=<your-db-endpoint>
ASTRA_DB_APPLICATION_TOKEN=<your-app-token>
OPENAI_API_KEY=<your-api-key>
```

4. Seed the database with legal data:

```bash
npm run seed
```

5. Start the development server:

```bash
npm run dev
```

## Usage

1. Open the application in your browser at http://localhost:3000 or the hosted URL.
2. Interact with the chatbot by typing questions or selecting one of the suggested prompts.
3. Receive accurate responses with context from Mlaw Advokatfirma's website.

## Deployment

The project is deployed on Vercel to ensure scalability and performance.

### Manual Deployment

1. Log in to [Vercel](https://vercel.com).
2. Import the project from GitHub.
3. Ensure the `.env` file is correctly configured.
4. Click Deploy.