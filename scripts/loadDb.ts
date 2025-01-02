import { DataAPIClient } from "@datastax/astra-db-ts"
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer"
import OpenAI from "openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

const { 
  ASTRA_DB_NAMESPACE, 
  ASTRA_DB_COLLECTION, 
  ASTRA_DB_API_ENDPOINT, 
  ASTRA_DB_APPLICATION_TOKEN, 
  OPENAI_API_KEY 
} = process.env

const openai = new OpenAI ({ apiKey: OPENAI_API_KEY })

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

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100
})

const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 1536,
      metric: similarityMetric
    }
  });
  console.log(res)
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION)
  for await ( const url of mlawData) {
    const content = await scrapePage(url)
    const chunks = await splitter.splitText(content)
    for await ( const chunk of chunks) {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float"
      });

      const vector = embedding.data[0].embedding

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk
      });
      console.log(res);
    }
  }
};

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true
    },
    gotoOptions: {
      waitUntil: "domcontentloaded"
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML)
      await browser.close()
      return result
    }
  });
  return ( await loader.scrape())?.replace(/<[^>]*>?/gm, '')
};

createCollection().then(() => loadSampleData())