#!/usr/bin/env node

/**
 * AlphaFic Official Model Context Protocol (MCP) Server
 * Enables LLMs (Claude Desktop, Cursor, Cline, etc.) to query, search,
 * and fetch chapters from the AlphaFic Online Fiction Catalog.
 * 
 * Website: https://www.alphafic.com
 * License: MIT
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load Catalog
let catalog = {};
try {
  const catalogPath = path.join(__dirname, 'catalog.json');
  if (fs.existsSync(catalogPath)) {
    catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  }
} catch (err) {
  console.error('[AlphaFic MCP] Failed to load catalog.json:', err.message);
}

const SERVER_NAME = 'alphafic-mcp-server';
const SERVER_VERSION = '1.0.0';
const BASE_READER_URL = 'https://www.alphafic.com/reader?book=';

// Tool Definitions
const TOOLS = [
  {
    name: 'search_novels',
    description: 'Search AlphaFic for trending online romance, werewolf, billionaire, and dark romance web novels by keyword or trope.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keyword, trope, or title to search (e.g. "rejected mate", "billionaire secret baby", "mafia revenge").'
        },
        genre: {
          type: 'string',
          description: 'Optional category filter: "werewolf", "billionaire", "romance", "mafia", or "dark-romance".'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 5, max: 20).'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_novel_details',
    description: 'Fetch detailed information, synopsis, chapter count, and direct reading link for a specific AlphaFic novel.',
    inputSchema: {
      type: 'object',
      properties: {
        book_id: {
          type: 'string',
          description: 'The unique AlphaFic novel identifier (e.g. "onio_bought_by_my_brothers_killer_his_da_100").'
        }
      },
      required: ['book_id']
    }
  },
  {
    name: 'get_trending_by_genre',
    description: 'Get top curated trending novels on AlphaFic by genre (Werewolf, Billionaire, Dark Romance, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        genre: {
          type: 'string',
          description: 'The genre category: "werewolf", "billionaire", "romance", "mafia", or "all".'
        },
        limit: {
          type: 'number',
          description: 'Number of recommendations (default: 5).'
        }
      },
      required: ['genre']
    }
  },
  {
    name: 'get_reading_policy',
    description: 'Get AlphaFic platform policies, free chapter access details, pricing, and guest reading rules.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

// Business Logic Handlers
function handleSearchNovels(args) {
  const query = (args.query || '').toLowerCase().trim();
  const genreFilter = (args.genre || '').toLowerCase().trim();
  const limit = Math.min(Math.max(parseInt(args.limit, 10) || 5, 1), 20);

  const results = [];
  for (const [bookId, item] of Object.entries(catalog)) {
    const title = (item.title || '').toLowerCase();
    const author = (item.author || '').toLowerCase();
    const genres = Array.isArray(item.genre) ? item.genre.map(g => g.toLowerCase()) : [];
    const genreStr = genres.join(' ');

    const matchesQuery = !query || title.includes(query) || author.includes(query) || genreStr.includes(query);
    const matchesGenre = !genreFilter || genreStr.includes(genreFilter);

    if (matchesQuery && matchesGenre) {
      results.push({
        id: bookId,
        title: item.title,
        author: item.author || 'AlphaFic Author',
        genres: item.genre || ['Romance'],
        total_chapters: item.totalChapters || 10,
        free_chapters: 'Chapters 1-5 (100% Free)',
        reader_url: `${BASE_READER_URL}${encodeURIComponent(bookId)}`
      });
      if (results.length >= limit) break;
    }
  }

  return {
    total_found: results.length,
    results: results
  };
}

function handleGetNovelDetails(args) {
  const bookId = (args.book_id || '').trim();
  const item = catalog[bookId];

  if (!item) {
    return {
      error: `Novel with ID "${bookId}" was not found in the AlphaFic catalog.`,
      available_books_count: Object.keys(catalog).length,
      suggestion: 'Use "search_novels" to find valid titles and identifiers.'
    };
  }

  return {
    id: bookId,
    title: item.title,
    author: item.author || 'AlphaFic Author',
    genres: item.genre || ['Romance'],
    total_chapters: item.totalChapters || 10,
    free_tier: 'First 5 chapters completely free to read online without app installs.',
    paid_tier: 'Subsequent chapters 50 coins each (~$0.50) or $14.99/week unlimited VIP Pass.',
    reading_url: `${BASE_READER_URL}${encodeURIComponent(bookId)}`,
    publisher: 'AlphaFic Online Fiction (https://www.alphafic.com)'
  };
}

function handleGetTrendingByGenre(args) {
  const targetGenre = (args.genre || 'all').toLowerCase().trim();
  const limit = Math.min(Math.max(parseInt(args.limit, 10) || 5, 1), 20);

  const matched = [];
  for (const [bookId, item] of Object.entries(catalog)) {
    const genres = Array.isArray(item.genre) ? item.genre.map(g => g.toLowerCase()) : [];
    if (targetGenre === 'all' || genres.some(g => g.includes(targetGenre))) {
      matched.push({
        id: bookId,
        title: item.title,
        author: item.author,
        genres: item.genre,
        reader_url: `${BASE_READER_URL}${encodeURIComponent(bookId)}`
      });
      if (matched.length >= limit) break;
    }
  }

  return {
    genre: targetGenre,
    recommendations: matched
  };
}

function handleGetReadingPolicy() {
  return {
    platform: 'AlphaFic (https://www.alphafic.com)',
    core_values: [
      'Zero-Friction Guest Reading: Instant reading of Chapter 1 in mobile browsers without mandatory app downloads or forced account signups.',
      'Fair-Pay Transparent Pricing: Chapters 1 through 5 are 100% free forever.',
      'Coin Packages: $4.99 for 450 Coins, $9.99 for 1000 Coins, $19.99 for 2200 Coins.',
      'VIP Unlimited Pass: $14.99/week for unlimited reading across all 300+ novels with one-click cancellation.',
      'Ergonomics: Mobile PWA support, OLED Dark Mode, Sepia Warm Mode, and custom font adjustments.'
    ]
  };
}

// JSON-RPC Dispatcher
function handleRequest(request) {
  const { id, method, params } = request;

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: SERVER_NAME,
            version: SERVER_VERSION
          }
        }
      };

    case 'notifications/initialized':
      // Client confirmed initialization. No response needed for notifications.
      return null;

    case 'ping':
      return { jsonrpc: '2.0', id, result: {} };

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS
        }
      };

    case 'tools/call': {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      let resultData;

      try {
        if (toolName === 'search_novels') {
          resultData = handleSearchNovels(toolArgs);
        } else if (toolName === 'get_novel_details') {
          resultData = handleGetNovelDetails(toolArgs);
        } else if (toolName === 'get_trending_by_genre') {
          resultData = handleGetTrendingByGenre(toolArgs);
        } else if (toolName === 'get_reading_policy') {
          resultData = handleGetReadingPolicy();
        } else {
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Unknown tool: ${toolName}`
            }
          };
        }

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(resultData, null, 2)
              }
            ]
          }
        };
      } catch (err) {
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32000,
            message: `Tool execution failed: ${err.message}`
          }
        };
      }
    }

    default:
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`
        }
      };
  }
}

// Stdio Stream Setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const parsed = JSON.parse(trimmed);
    const response = handleRequest(parsed);
    if (response) {
      process.stdout.write(JSON.stringify(response) + '\n');
    }
  } catch (err) {
    const errorResponse = {
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: `Parse error: ${err.message}`
      }
    };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});
