# Idae Chroma Client

Idae Chroma Client is a library designed to interact with ChromaDB, providing tools for managing collections, adding, updating, and querying entries, as well as monitoring directories for changes using file watchers.

## Features

- **ChromaDB Integration**: Easily interact with ChromaDB for managing collections and querying data.
- **File Watchers**: Monitor directories for file changes (add, modify, delete) and automatically process them.
- **Customizable Watcher Options**: Configure file watchers with various options like ignored files, polling intervals, and more.
- **Metadata Management**: Add, update, and query entries with metadata support.

## Installation

Install the package via npm:

```bash
npm install @medyll/idae-chroma
```

## Usage

### Basic Example

Below is an example of how to use the Idae Chroma Client to initialize a database, add a watcher, and perform a search query.

```javascript
import { type ChromaQueryParams } from './lib/database/chromaClient.js';
import IdaeChroma, { ChromaDbConfig, WatcherOptions } from './lib/main.js';

// Configuration for ChromaDB
const chromaDbConfig: ChromaDbConfig = {
  path: './chromadb'
};

// Options for the watcher
const watcherOptions: WatcherOptions = {
  ignored: /(^|[\/\\])\../, // Ignore hidden files
  persistent: true
};

// Main function
async function main() {
  try {
    // Initialize IdaeChroma
    const idaeChroma = new IdaeChroma(chromaDbConfig);

    // Add a watcher
    await idaeChroma.addWatcher('./documents', watcherOptions);

    // Load saved watchers
    await idaeChroma.loadSavedWatchers();

    // Example search query
    const searchParams: ChromaQueryParams = {
      queryTexts: 'example query',
      nResults: 5,
      where: { type: 'document' }
    };
    await idaeChroma.chromaClient.initCollection('test_collection');
    const searchResults = await idaeChroma.chromaClient.queryCollection('test_collection', searchParams);
    console.log(searchResults);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```


