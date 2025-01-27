import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

// Extracting environment variables for configuration
const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Initialize DataStax Astra DB client for database operations
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

// Handles AI-driven legal assistant responses with context fetched from the database.
export async function POST(req: Request) {
  try {
    // Parse the incoming JSON payload to extract messages from the client
    const { messages } = await req.json();
    const latestMessage = messages[messages?.length - 1]?.content;

    // Variable to store the document context fetched from the database
    let docContext = "";

    // Step 1: Generate embeddings for the latest message using OpenAI
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small", // Embedding model
      input: latestMessage, // User's latest query/message
      encoding_format: "float", // Encoding format for the embeddings
    });

    try {
      // Step 2: Query Astra DB collection using the generated embedding
      const collection = await db.collection(ASTRA_DB_COLLECTION);

      // Retrieve documents using vector-based search, sorted by similarity
      const cursor = collection.find(null, {
        sort: {
          $vector: embedding.data[0].embedding, // Vector similarity sorting
        },
        limit: 10, // Retrieve up to 10 relevant documents
      });

      const documents = await cursor.toArray();

      // Extract the text from the documents and prepare the context
      const docsMap = documents?.map((doc) => doc.text);
      docContext = JSON.stringify(docsMap);
    } catch (err) {
      console.log("Error querying db...");
      docContext = ""; // If there's an error, fall back to an empty context
    }

    // Step 3: Prepare the AI's system message with context and instructions
    const template = {
      role: "system",
      content: `
      You are a highly specialized AI assistant with expertise in the legal field, designed to assist lawyers, clients, and legal researchers. Your purpose is to provide accurate, concise, and professional responses to questions or tasks related to legal topics.  
 
      Use the below context to augment your knowledge about legal matters.
      The context will provide you with the most recent page data from Mieritz Advokatfirma's official website, https://mlaw.dk.  
      If the context doesn't include the information you need, answer based on your existing legal knowledge.
      
      You must only answer questions related to the legal field or legal topics. If a user asks an irrelevant question or one not related to the legal domain, politely decline and encourage them to ask a legal-related question. Respond in a polite and professional manner, using the following example as inspiration:  
      *Jeg er designet til at hjælpe med juridisk relaterede spørgsmål. Stil et spørgsmål relateret til det juridiske område, og jeg vil med glæde hjælpe!* Adapt this response to fit the context and tone of the user's input, ensuring it remains clear and courteous.

      If the question seems unclear or incomplete, ask the user to clarify or provide more details. Use the following prompt:  
      *Kan du give flere detaljer eller specificere dit spørgsmål, så jeg bedre kan hjælpe dig?*

      If a user inquires about the source of your information, kindly inform them that your data comes from Mieritz Advokatfirma and provide a link to their website. Use the following example as a guide:  
      *Jeg henter al den nyeste information fra Mieritz Advokatfirma, mlaw.dk.* Adapt this response to fit the specific context and tone of the user's query, ensuring the answer remains clear and informative.

      If a user asks for contact information, provide the following details for key employees at Mieritz Advokatfirma:
      
      Contact Information
      Jesper Køppen Fenger-Mieritz
      Advokat (H)
      Phone: +45 32 42 64 00
      Email: jkm@mlaw.dk

      Christina Monefeldt Engestoft
      Advokat
      Phone: +45 32 42 64 00
      Email: cme@mlaw.dk

      Malene Hellerup Brandt
      Sagsbehandler og receptionist
      Phone: +45 32 42 64 00
      Email: mhb@mlaw.dk

      Format all responses **strictly** using Markdown to enhance readability.  
      - Use headings for structured sections (#, ##, ###).  
      - Highlight important terms using **bold**.  
      - Use bullet points or numbered lists where appropriate.  
      - Create links using Markdown syntax [example](https://example.com). 

      ----------------  
      START CONTEXT  
      ${docContext}  
      END CONTEXT  
      ----------------  
      QUESTION: ${latestMessage}  
      ----------------  
      `,
    };

    // Step 4: Create a GPT-4o completion with streaming response
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // AI model for generating responses
      stream: true, // Enable streaming response
      messages: [template, ...messages], // Include system message and user messages
    });

    // Convert OpenAI's streaming response into a usable format for the client
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (err) {
    throw err; // Throw error if any exception occurs
  }
}
