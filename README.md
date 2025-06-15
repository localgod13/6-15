# MultiRogue

A multiplayer space shooter game built with TypeScript and Electron.

## Asset Loading Solution

The game uses Vite for asset handling, which adds hash names to assets during build (e.g., `ship1-BU2Tnt8z.png`). To properly reference these assets in the code:

1. Import assets at the top of your file:
```typescript
import ship1 from './assets/ship1.png'
import ship2 from './assets/ship2.png'
import ship3 from './assets/ship3.png'
```

2. Use the imported variables in your HTML/JSX:
```typescript
// Instead of hardcoded paths like:
// <img src="./assets/ship1.png">

// Use the imported variables:
<img src="${ship1}" alt="Ship 1">
```

3. For dynamic asset loading (like in player lists), create a mapping:
```typescript
const shipUrls: Record<string, string> = {
    'ship1': ship1,
    'ship2': ship2,
    'ship3': ship3
};
```

This ensures that Vite correctly handles asset paths in both development and production builds.

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production build
npm run start

# Create installer
npm run dist
```

## Building the Installer

The game uses electron-builder to create installers. The configuration is in `package.json` under the "build" section.

To create an installer:
1. Run `npm run dist`
2. Find the installer in the `release` folder
3. The installer will be named `MultiRogue Setup 1.0.0.exe`

## Project Structure

- `src/` - Source code
  - `assets/` - Game assets (images, etc.)
  - `main.ts` - Main game logic
  - `network.ts` - Multiplayer networking
  - `players.ts` - Player class and logic
  - `towers.ts` - Tower management
- `dist/` - Built files
- `release/` - Installer and packaged app

## Dependencies

- Electron - Desktop application framework
- Vite - Build tool and dev server
- PeerJS - WebRTC networking
- TypeScript - Type safety and modern JavaScript features

## Notes

- Always use the imported asset variables instead of hardcoded paths
- The game uses WebRTC for multiplayer, so players need to be able to establish peer-to-peer connections
- The game is configured for Windows 64-bit builds 