import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { searchQueriesSchema, validateSchema, deduplicateEntries } from "./utils";
import { tavily } from "@tavily/core";
import { genSchemaPrompt } from "./prompts/gen-schema";
import { searchQueriesPrompt } from "./prompts/search-queries";
import { extractPrompt } from "./prompts/extract";


const agentModel = new ChatOpenAI({model: "gpt-4.1-mini-2025-04-14", temperature: 0.7 });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });


const GraphState = Annotation.Root({
    id: Annotation<string>(),
    user_prompt: Annotation<string>(),
    json_schema: Annotation<{}>(),
    title: Annotation<string>(),
    search_queries: Annotation<string[]>(),
    urls: Annotation<string[]>(),
    search_results: Annotation<string[]>(),
    extracted_results: Annotation<{}[]>(),
})


async function gen_schema(state: typeof GraphState.State) {
    console.log("In node: gen_schema");
    const maxRetries = 3;
    let retries = 0;
    let schema = {};
    let conversation = [
        { role: "system", content: genSchemaPrompt },
        { role: "user", content: state.user_prompt }
    ];

    while (retries < maxRetries) {
        let response;
        try {
            response = await agentModel.invoke(conversation, {
                response_format: { "type": "json_object" }, 
                metadata: {"list_id": state.id}
            });
            console.log("Schema generated")
            const json_schema = response.content.toString();
            validateSchema(json_schema);
            schema = JSON.parse(json_schema);
            console.log("Schema validated")
            break; // If we reach here, the schema is valid

        } catch (e: any) {
            console.error(`Attempt ${retries + 1} failed:`, e);
            
            // Add the failed attempt to conversation
            if (response) {
                conversation.push(
                    { role: "assistant", content: response.content.toString() },
                    { 
                        role: "user", 
                        content: `The previous schema was invalid. Error: ${e.message}. Please fix the schema and ensure it's a valid JSON object.`
                    }
                );
            } else {
                conversation.push({ 
                    role: "user", 
                    content: `An error occurred: ${e.message}. Please provide a valid JSON schema.`
                });
            }

            retries++;
            if (retries >= maxRetries) {
                console.error(`Maximum retries (${maxRetries}) reached. Using empty schema.`);
                break;
            }
        }
    }

    return { json_schema: schema };
}

async function search_queries(state: typeof GraphState.State) {
    console.log("In node: search_queries")
    const response  = await agentModel.withStructuredOutput(searchQueriesSchema).invoke([
        { role: "system", content: searchQueriesPrompt },
        { role: "user", content: state.user_prompt }
    ], { metadata: { "list_id": state.id } });
    return { search_queries: response.queries, title: response.title }
}

async function retrieve_urls(state: typeof GraphState.State) {
    console.log("In node: retrieve_urls")
    const search_results = await Promise.all(state.search_queries.map(async (query) => {
        const response = await tvly.search(query, {
            topic: "general"
        });
        return response;
    }));
    const urls = search_results.flatMap(result => result.results.map(result => result.url));
    // Filter out duplicates
    const uniqueUrls = Array.from(new Set(urls));
    console.log(`Found ${uniqueUrls.length} URLs`);
    console.log("URLs:", uniqueUrls);
    return { urls: uniqueUrls }
}

function chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
        array.slice(i * size, i * size + size)
    );
}

async function retrieve_content(state: typeof GraphState.State) {
    console.log("In node: retrieve_content");
    const BATCH_SIZE = 20;
    const urlBatches = chunkArray(state.urls, BATCH_SIZE);
    
    const batchResults = await Promise.all(
        urlBatches.map(async (urlBatch) => {
            const response = await tvly.extract(urlBatch, {});
            return response.results.map(result => result.rawContent);
        })
    );

    // Flatten all batch results into a single array
    return { search_results: batchResults.flat() };
}

async function extract(state: typeof GraphState.State) {
    console.log("In node: extract")
    const agentModelSO = agentModel.withStructuredOutput(state.json_schema)
    const extractionResults = await Promise.all(state.search_results.map(async (result) => {
        const response = await agentModelSO.invoke([
            { role: "system", content: extractPrompt },
            { role: "user", content: result }
        ], { metadata: { "list_id": state.id } });
        return response.items;
    }));
    // Flatten the array of arrays into a single array
    const flattenedResults = extractionResults.flat();
    console.log("Extraction finished");
    return { extracted_results: flattenedResults }
}

async function deduplicate(state: typeof GraphState.State) {
    console.log("In node: deduplicate");
    const key = Object.keys(state.extracted_results[0])[0];
    const uniqueEntries = await deduplicateEntries(state.extracted_results, key, 0.8);
    return { extracted_results: uniqueEntries };
}

function createAgent() {
    return new StateGraph(GraphState)
        .addNode("gen_schema", gen_schema)
        .addNode("search_queries_node", search_queries)
        .addNode("retrieve_urls", retrieve_urls)
        .addNode("retrieve_content_node", retrieve_content)
        .addNode("extract", extract)
        .addNode("deduplicate", deduplicate)
        .addEdge(START, "gen_schema")
        .addEdge("gen_schema", "search_queries_node")
        .addEdge("search_queries_node", "retrieve_urls")
        .addEdge("retrieve_urls", "retrieve_content_node")
        .addEdge("retrieve_content_node", "extract")
        .addEdge("extract", "deduplicate")
        .addEdge("deduplicate", END)
}


export const agent = createAgent().compile();
