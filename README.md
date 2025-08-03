# ASCII Art Live Camera

Real-time ASCII art from your webcam feed with adjustable resolution and character styles.

## Features

- Live webcam to ASCII conversion
- 7 different character sets (Classic, Blocks, Binary, Lines, Sketch, etc.)
- Adjustable resolution for detail control
- Optimized for smooth 15fps performance
- Responsive design for desktop and mobile
- Clean, modern interface

## Demo

Open the application in your browser and allow camera access to see your live video feed converted to ASCII art in real-time.

## Character Sets

- **Classic**: Traditional ASCII characters (@%#*+=-:. )
- **Blocks**: Solid Unicode blocks (█▉▊▋▌▍▎▏ )
- **Detailed**: Complex character set for fine detail
- **Simple**: Basic symbols (.:;+=xX$&)
- **Binary**: Just 0s and 1s (01 )
- **Lines**: Box drawing characters (╬╦╩╠╣║═│┌┐└┘ )
- **Sketch**: Textured characters (▓▒░ )

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SahilNalavade/ASCII-art.git
   cd ASCII-art
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Browser Requirements

- Modern browser with camera access support
- WebRTC compatibility
- JavaScript enabled

## Performance

The application is optimized for smooth performance with:
- Frame rate limiting to 15fps
- Efficient ASCII conversion algorithms
- Minimal DOM updates
- Responsive font sizing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details