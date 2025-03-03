# PDF RAG System

A powerful Retrieval-Augmented Generation (RAG) system built with Python/Django and React that allows users to upload PDFs, chat with their documents, and convert web content into mind maps.

![Project Overview](screenshot1.png)

## Features

- **PDF Upload & Processing**: Upload and analyze PDF documents
- **Interactive Chat**: Engage with your documents through an intuitive chat interface
- **Web Content to Mind Maps**: Convert web articles and content into visual mind maps
- **Retrieval-Augmented Generation**: Enhance responses with document-specific knowledge
- **Responsive Design**: Seamless experience across desktop and mobile devices

![Chat Interface](screenshot2.png)

## Technology Stack

### Frontend
- React.js
- Redux for state management
- Tailwind CSS for styling
- Axios for API communication

### Backend (Coming Soon)
- Python/Django
- LangChain for RAG pipeline
- PostgreSQL for data storage
- PDF processing libraries

![PDF Processing](screenshot3.png)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/pdf-rag-system.git
cd pdf-rag-system
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

![Mind Map Feature](screenshot4.png)

## Usage

1. **Upload Documents**: Click the upload button to add your PDFs
2. **Chat with Documents**: Use the chat interface to ask questions about your documents
3. **Generate Mind Maps**: Enter a URL to convert web content into visual mind maps
4. **Export Results**: Save conversations and mind maps for future reference

## Project Structure

```
pdf-rag-system/
├── frontend/            # React frontend code
│   ├── public/          # Static files
│   ├── src/             # Source files
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── store/       # Redux store
│   │   └── utils/       # Utility functions
│   ├── package.json     # Dependencies
│   └── README.md        # Frontend specific instructions
└── README.md            # Main project README
```

![User Dashboard](screenshot5.png)

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

- [React](https://reactjs.org/)
- [Django](https://www.djangoproject.com/)
- [LangChain](https://langchain.readthedocs.io/)
- [PDF.js](https://mozilla.github.io/pdf.js/)
