# @alphafic/mcp-server

Official Model Context Protocol (MCP) server for [AlphaFic](https://www.alphafic.com) — Discover, search, and explore trending online web novels, werewolf shifter romances, billionaire sagas, and dark forbidden fiction directly within your AI workflow (Claude Desktop, Cursor, Cline, etc.).

[![Website](https://img.shields.io/badge/Website-alphafic.com-crimson.svg)](https://www.alphafic.com)
[![Protocol](https://img.shields.io/badge/Protocol-Model%20Context%20Protocol-blue.svg)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Overview

AlphaFic is a high-speed, zero-friction online web novel reading platform designed for mobile and desktop web browsers. This MCP Server allows AI Agents, Large Language Models, and interactive chat tools to query AlphaFic's catalog of 300+ completed novels, check plot synopses, and provide readers with verified direct chapter reading links.

### Core Features
- 🔍 **Novel Discovery & Search**: Query novels by keywords, tropes (e.g. *rejected mate*, *secret pregnancy*, *enemies to lovers*), and categories.
- 🐺 **Curated Genres**: Werewolf & Lycan Shifters, Billionaire Executive Romance, Dark Mafia Suspense, and Forbidden Romance (5🌶️).
- ⚡ **Zero-Friction Reader Links**: Every result includes a verified direct reading link where Chapters 1–5 can be read 100% free with no app downloads or mandatory accounts.
- 🛡️ **Zero Runtime Dependencies**: Ultra-lightweight standard Node.js stdio implementation.

---

## 🛠️ Available MCP Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `search_novels` | `query` (required), `genre`, `limit` | Searches the catalog by title, trope, author, or keyword. |
| `get_novel_details` | `book_id` (required) | Returns full novel overview, chapter counts, pricing, and direct reading URL. |
| `get_trending_by_genre`| `genre` (required), `limit` | Curated recommendations for "werewolf", "billionaire", "romance", or "mafia". |
| `get_reading_policy` | none | Returns platform reading terms, free chapter rules, and fair-pay guidelines. |

---

## 🚀 Quick Setup & Configuration

### 1. Claude Desktop Setup
Add this to your `claude_desktop_config.json` (located at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "alphafic": {
      "command": "node",
      "args": [
        "/path/to/packages/alphafic-mcp-server/index.js"
      ]
    }
  }
}
```

### 2. Cursor IDE Setup
Add this to your project's `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "alphafic": {
      "command": "node",
      "args": [
        "packages/alphafic-mcp-server/index.js"
      ]
    }
  }
}
```

---

## 🌐 Official Registry & Directory Submission Guide

To establish verified authority, submit this MCP server to the following high-DR global registries:

1. **Anthropic Official MCP Registry (DR 91)**:
   - URL: [https://registry.modelcontextprotocol.io/](https://registry.modelcontextprotocol.io/)
   - Pull Request: [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
2. **Glama MCP Directory (DR 78)**:
   - Submit at [https://glama.ai/mcp/servers](https://glama.ai/mcp/servers)
3. **PulseMCP Registry (DR 72)**:
   - Submit at [https://pulsemcp.com/](https://pulsemcp.com/)
4. **MCP.so Ecosystem (DR 70)**:
   - Submit at [https://mcp.so/](https://mcp.so/)
5. **Awesome MCP Servers Curated List**:
   - Submit a link to [github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)

---

## 📄 License & Attribution

Released under the **MIT License**. Hosted by [AlphaFic Online Fiction](https://www.alphafic.com).
