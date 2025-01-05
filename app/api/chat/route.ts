import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages?.length - 1]?.content;

    let docContext = "";

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float",
    });

    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION);
      const cursor = collection.find(null, {
        sort: {
          $vector: embedding.data[0].embedding,
        },
        limit: 10,
      });

      const documents = await cursor.toArray();

      const docsMap = documents?.map((doc) => doc.text);

      docContext = JSON.stringify(docsMap);
    } catch (err) {
      console.log("Error querying db...");
      docContext = "";
    }

    const template = {
      role: "system",
      content: `
      You are a highly specialized AI assistant with expertise in the legal field, designed to assist lawyers, clients, and legal researchers. Your purpose is to provide accurate, concise, and professional responses to questions or tasks related to legal topics.  
 
      Use the below context to augment your knowledge about legal matters.  
      The context will provide you with the most recent page data from Mieritz Advokatfirma's official website, https://mlaw.dk.  
      If the context doesn't include the information you need, answer based on your existing legal knowledge. Do not mention the source of your information or whether the context does or doesn't include specific details.  
      
      You must only answer questions related to the legal field or legal topics. If a user asks an irrelevant question or one not related to the legal domain, politely decline and encourage them to ask a legal-related question. Use the following response in such cases:  
      *"Jeg er designet til at hjælpe med juridisk relaterede spørgsmål. Stil et spørgsmål relateret til det juridiske område, og jeg vil med glæde hjælpe!"* 

      If the question seems unclear or incomplete, ask the user to clarify or provide more details. Use the following prompt:  
      *"Kan du give flere detaljer eller specificere dit juridiske spørgsmål, så jeg bedre kan hjælpe dig?"*

      If a user inquires about the source of your information, kindly inform them that your data comes from Mieritz Advokatfirma and provide a link to their website. Respond in the following manner:
      "Jeg henter al den nyeste information fra Mieritz Advokatfirma, mlaw.dk."

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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages: [template, ...messages],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (err) {
    throw err;
  }
}
