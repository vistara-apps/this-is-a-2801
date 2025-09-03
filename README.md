# Beat Weaver

![Beat Weaver](public/beat-weaver-logo.png)

Craft and share AI-enhanced music remixes effortlessly.

## Overview

Beat Weaver is a web application for musicians to easily separate song stems, generate new beats with AI, and share their remixes with a built-in community.

## Features

### AI Stem Separator

Upload an audio file (e.g., MP3, WAV) and utilize AI to separate it into individual stems (vocals, drums, bass, other instruments). Users can download these stems for further manipulation.

### AI Beat Builder

Generate original drum patterns and basslines based on user-defined genre, tempo, and optionally influenced by an uploaded stem (e.g., to complement the isolated vocals).

### Remix Showcase & Tipping

A community hub where users can upload, share, and discover remixes. Includes a simple tipping mechanism (via crypto on Base) for users to support creators.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Web3**: WagmiJS, RainbowKit, Base blockchain
- **AI Services**: Eleven Labs Music API, OpenAI API
- **Storage**: Pinata (IPFS)
- **Payment**: Base blockchain (USDC)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask or another Web3 wallet

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/beat-weaver.git
   cd beat-weaver
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your API keys:
   ```
   VITE_ELEVEN_LABS_API_KEY=your_eleven_labs_api_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_PINATA_API_KEY=your_pinata_api_key
   VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key
   VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Separating Stems

1. Navigate to the "Create" section
2. Upload an audio file
3. Wait for the AI to process and separate the stems
4. Download individual stems or use them directly in the app

### Generating Beats

1. Navigate to the "Create" section
2. Configure beat parameters (genre, tempo, key, etc.)
3. Generate a beat
4. Download the beat or use it in your remix

### Sharing Remixes

1. Create your remix using the separated stems and generated beats
2. Add title, description, and other metadata
3. Upload your remix to the community hub
4. Share the link with others

### Tipping Creators

1. Browse remixes in the community hub
2. Connect your wallet
3. Send a tip to creators whose work you enjoy

## Documentation

For more detailed documentation, see the following:

- [API Documentation](docs/api/)
- [Component Documentation](docs/components/)
- [User Flows](docs/user-flows/)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Eleven Labs](https://elevenlabs.io/) for the Music API
- [OpenAI](https://openai.com/) for the Audio API
- [Pinata](https://pinata.cloud/) for IPFS storage
- [Base](https://base.org/) for blockchain infrastructure
- [RainbowKit](https://www.rainbowkit.com/) for wallet connection

