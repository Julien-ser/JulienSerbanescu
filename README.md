# Julien Serbanescu Portfolio

A modern portfolio website with a RAG-powered Q&A system.

## Features

- Modern React frontend with Vite
- Flask backend with RAG (Retrieval-Augmented Generation) system
- Interactive Q&A interface
- Responsive design

## Prerequisites

- Python 3.8+
- Node.js 16+
- Cohere API key
- Deepseek API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Julien-ser/JulienSerbanescu.git
cd JulienSerbanescu
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory with your API keys:
```
COHERE_API_KEY=your_cohere_api_key_here
DEEPKEY=your_deepseek_api_key_here
```

## Running the Application

1. Start the Flask backend server:
```bash
python app.py
```
The server will run on `http://localhost:5000`

2. In a separate terminal, start the Vite development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

## Deployment

The site is deployed on GitHub Pages. To deploy updates:

```bash
npm run deploy
```

## Project Structure

- `/src` - Frontend React components and assets
- `/docs/faiss` - FAISS index files for the RAG system
- `app.py` - Flask backend server
- `queryrun.py` - RAG system implementation
- `vite.config.js` - Vite configuration
- `package.json` - Node.js dependencies and scripts

## License

MIT License 