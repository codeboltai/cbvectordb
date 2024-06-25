import { LocalIndex } from '../lib/index.js';
import path from 'path';
import OpenAI from 'openai';

// Initialize the index
const index = new LocalIndex(path.join(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([a-zA-Z]):\//, '$1:/'), 'index'));

// OpenAI configuration
const api = new OpenAI({
    apiKey: '..',
});

// Function to get vector from text
async function getVector(text) {
    const response = await api.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
    });
    return response.data[0].embedding;
}

// Function to add item to the index
async function addItem(text) {
    await index.insertItem({
        vector: await getVector(text),
        metadata: { text }
    });
}

// Function to query the index
async function query(text) {
    const vector = await getVector(text);
    const results = await index.queryItems(vector, 3);
    if (results.length > 0) {
        for (const result of results) {
            console.log(`Result for ${text} is [${result.score}] ${result.item.metadata.text}`);
        }
    } else {
        console.log('No results found.');
    }
}

// Main function to run the example
(async () => {
    if (!await index.isIndexCreated()) {
        await index.createIndex();
    }

    // Add items
    await addItem('apple');
    await addItem('oranges');
    await addItem('red');
    await addItem('blue');

    // Query items
    await query('green');
    await query('banana');
})();