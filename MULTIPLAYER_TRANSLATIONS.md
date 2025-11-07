# Multiplayer Translations

This document lists all the multiplayer-related translations that have been added to support online multiplayer functionality across all 5 supported languages.

## Supported Languages
- English (en) 🇬🇧
- Français (fr) 🇫🇷
- Español (es) 🇪🇸
- Русский (ru) 🇷🇺
- العربية (ar) 🇸🇦

## Translation Keys

### Lobby & Room Management
- `multiplayerLobby` - Title for the multiplayer lobby screen
- `createRoom` - Button to create a new room
- `createNewRoom` - Label for creating a new room
- `joinRoom` - Button to join an existing room
- `enterRoomCode` - Placeholder for room code input
- `joinGame` - Button to join a game with a code
- `roomCode` - Label for displaying the room code
- `shareThisCode` - Instructions to share the room code

### Game States
- `waitingForOpponent` - Message while waiting for another player
- `opponentJoined` - Notification when opponent joins
- `yourMove` - Indicator that it's the player's turn
- `opponentMove` - Indicator that it's the opponent's turn
- `opponentLeft` - Message when opponent disconnects

### Actions
- `copyCode` - Button to copy room code to clipboard
- `codeCopied` - Confirmation that code was copied
- `returnToLobby` - Button to return to multiplayer lobby
- `connectionLost` - Error message for connection issues

### UI Elements
- `or` - Separator between create and join options
- `back` - Button to go back to previous screen

## Usage Example

\`\`\`typescript
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/i18n"

function MyComponent() {
  const { language } = useLanguage()
  const t = translations[language]
  
  return (
    <div>
      <h1>{t.multiplayerLobby}</h1>
      <button>{t.createRoom}</button>
      <p>{t.waitingForOpponent}</p>
    </div>
  )
}
\`\`\`

## Implementation Status

✅ **lib/i18n.ts** - All translations added for all 5 languages
✅ **components/multiplayer-lobby.tsx** - Using translations
✅ **app/games/align-four/page.tsx** - Using translations for online multiplayer

## Notes

- All translations follow the existing pattern in the i18n.ts file
- Translations are contextually appropriate for each language
- Arabic translations use proper RTL (right-to-left) text
- Russian translations use appropriate Cyrillic characters
- All translations maintain consistent tone and style
