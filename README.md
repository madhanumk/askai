# PDF RAG System

A Retrieval-Augmented Generation (RAG) system built with Python/Django and Next.js that allows users to upload PDFs, chat with their documents, and convert web content into mind maps.

## Demo

**Live Demo**: [https://askai-summarizer.vercel.app](https://askai-summarizer.vercel.app)

> **Note**: We use freemium services so the server is sometimes slow. API token limits may be exceeded occasionally, but everything works fine in a local environment. The production version uses DeepSeek model API via NVIDIA for inference.

# AskAI App

This is a simple Next.js app named AskAI that is dockerized for easy development and deployment.

## Requirements

- Docker installed on your system.

## Setup

Follow these steps to run the app using Docker:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/madhanumk/askai.git
    cd askai-app
    ```

2. **Build the Docker image:**

    Run the following command to build the Docker image:

    ```bash
    docker build -t askai-app .
    ```

3. **Run the Docker container:**

    After the image is built, run the Docker container with this command:

    ```bash
    docker run -p 3000:3000 askai-app
    ```

    This will start the app inside the container and bind port `3000` inside the container to port `3000` on your local machine.

4. **Access the app:**

    Open your browser and go to `http://localhost:3000` to see the app running.

## Development

If you want to work on the app locally without Docker, you can install dependencies and run the development server using these commands:

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Run the app:**

    ```bash
    npm run dev
    ```

This will start the Next.js development server on `http://localhost:3000`.

## Notes

- The app is dockerized using Node.js version `22.4.0` with the Alpine Linux base image for a smaller footprint.


## Features

- **PDF Upload & Processing**: Upload and analyze PDF documents
- **Retrieval-Augmented Generation**: Enhance responses with document-specific knowledge
- **Interactive Chat**: Engage with your documents through an intuitive chat interface
- **Web Content to Mind Maps**: Convert web articles and content into visual mind maps
- **YouTube Summarization**: Generate summaries from YouTube videos (Only available in local deployment)
- **Responsive Design**: Seamless experience across desktop and mobile devices

## Technology Stack

### Frontend
- Next.js
- Bootstrap for styling
- Axios for API communication

### Backend (Coming Soon)
- Python/Django
- LangChain for RAG pipeline
- PostgreSQL for data storage
- PDF processing libraries

### LLM Options
- Cloud API: DeepSeek model via NVIDIA (used in demo)
- Local deployment: Connect to Ollama locally to use LLMs without API requirements

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- Ollama (optional, for local LLM deployment)

### Installation

1. Clone the repository
```bash
git clone https://github.com/madhanumk/askai.git
cd askai
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Start the development server
```bash
npm start
```

4. Backend setup (Coming soon)
```
Backend code will be added to this repository soon.
```

## Modules and Screenshots

### Web Content to Mind Map
Convert web articles and content into structured mind maps.
![Mind Map Feature](https://github.com/madhanumk/askai/blob/main/Webpage%20to%20mindmap.png)

### YouTube Video Summarization
Generate summaries from YouTube videos (only available in local deployment).
![YouTube Summarization](https://github.com/madhanumk/askai/blob/main/Youtube%20Video%20Summarizer.png)

### Chat with PDF
Engage with your documents through an interactive chat interface.
![Chat with PDF](https://github.com/madhanumk/askai/blob/main/rag%20chat%20with%20pdf.png)

## Usage

1. **Upload Documents**: Click the upload button to add your PDFs
2. **Chat with Documents**: Use the chat interface to ask questions about your documents
3. **Generate Mind Maps**: Enter a URL to convert web content into visual mind maps
4. **Summarize YouTube Videos**: Enter a YouTube URL to generate a video summary (Only available in local deployment)
5. **Export Results**: Save conversations and mind maps for future reference

## Coming Soon

- Backend code with Django REST framework
- Docker setup for easy deployment
- Enhanced document processing capabilities
- User authentication and document management
- Additional export formats and sharing options

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Django](https://www.djangoproject.com/)
- [LangChain](https://langchain.readthedocs.io/)
- [PDF.js](https://mozilla.github.io/pdf.js/)
- [DeepSeek](https://www.deepseek.com/)
- [Ollama](https://ollama.ai/)

