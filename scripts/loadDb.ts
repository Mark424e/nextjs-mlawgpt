import { DataAPIClient } from "@datastax/astra-db-ts"
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer"
import OpenAI from "openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

// Load environment variables from .env file
const { 
  ASTRA_DB_NAMESPACE, 
  ASTRA_DB_COLLECTION, 
  ASTRA_DB_API_ENDPOINT, 
  ASTRA_DB_APPLICATION_TOKEN, 
  OPENAI_API_KEY 
} = process.env

// Initialize OpenAI client with the provided API key
const openai = new OpenAI ({ apiKey: OPENAI_API_KEY })

// List of URLs to scrape and process from website
const mlawData = [
  'https://mlaw.dk/',
  'https://mlaw.dk/retssager-og-voldgiftssager/',
  'https://mlaw.dk/om-os/',
  'https://mlaw.dk/raadgivningsabonnement/',
  'https://mlaw.dk/ledige-stillinger/',
  'https://mlaw.dk/privatlivspolitik/',
  'https://mlaw.dk/privat/boligkob/',
  'https://mlaw.dk/privat/dodsbobehandling/',
  'https://mlaw.dk/privat/lejeret/',
  'https://mlaw.dk/privat/skilsmisse/',
  'https://mlaw.dk/privat/testamente/',
  'https://mlaw.dk/privat/aegtepagt/',
  'https://mlaw.dk/erhverv/bestyrelsesarbejde/',
  'https://mlaw.dk/erhverv/udlejning-til-erhverv/',
  'https://mlaw.dk/erhverv/inkasso/',
  'https://mlaw.dk/erhverv/konktraksudarbejdelse/',
  'https://mlaw.dk/erhverv/omstrukturering-af-virksomhed/',
  'https://mlaw.dk/erhverv/stiftelse-af-selskab/',
  'https://mlaw.dk/erhverv/virksomhedshandel/',
  'https://mlaw.dk/erhverv/aegtepagt-virksomhed/'
]

// Initialize Astra DB client
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})

// Configure the text splitter for breaking content into smaller chunks
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512, // Maximum size of each text chunk
  chunkOverlap: 100 // Overlap between consecutive chunks
})

// Function to create a new collection in Astra DB with vector search capabilities
const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 1536, // Dimension of OpenAI embeddings
      metric: similarityMetric // Similarity metric for vector search
    }
  });
  console.log(res) // Log the response for debugging purposes
};

// Function to load data into the Astra DB collection
const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION)

  // Loop through each URL in the mlawData array
  for await ( const url of mlawData) {
    // Scrape content from the page
    const content = await scrapePage(url)

    // Split the scraped content into smaller chunks
    const chunks = await splitter.splitText(content)

    // Process each chunk individually
    for await ( const chunk of chunks) {
      // Generate an embedding for the chunk using OpenAI
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small", // OpenAI embedding model
        input: chunk, // Text content
        encoding_format: "float" // Encoding format
      });

      // Extract the vector from the embedding
      const vector = embedding.data[0].embedding

      // Insert the chunk and its vector into the database
      const res = await collection.insertOne({
        $vector: vector, // Vector representation for search
        text: chunk // Original text content
      });
      console.log(res); // Log the response for debugging purposes
    }
  }
};

// Function to scrape the HTML content from a webpage and clean it
const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true // Run Puppeteer in headless mode
    },
    gotoOptions: {
      waitUntil: "domcontentloaded" // Wait for the DOM to fully load
    },
    evaluate: async (page, browser) => {
      // Extract the HTML content of the page's body
      const result = await page.evaluate(() => document.body.innerHTML)
      await browser.close() // Close the browser after scraping
      return result // Return the extracted HTML
    }
  });
  // Scrape the page and remove HTML tags from the content
  return ( await loader.scrape())?.replace(/<[^>]*>?/gm, '')
};

// Start by creating the collection and then loading data into it
createCollection().then(() => loadSampleData())