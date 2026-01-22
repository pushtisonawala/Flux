# Flux - Professional API Client IDE

A sleek, high-fidelity API client IDE built with Next.js, Tailwind CSS, and shadcn/ui components. Flux features a professional Zinc dark theme, glassmorphism effects, and a 3-pane layout optimized for API testing and development.

## Features

### 1. **Left Sidebar - The Navigator**
- **Collections & Folders**: Hierarchical tree view for organizing API requests
- **History Tab**: Recent request executions with colored status code badges
  - Green (200-299), Blue (300-399), Yellow (400-499), Red (500+)
- **Environments Dropdown**: Switch between Development, Staging, and Production environments
- **Search Functionality**: Quick-search across collections and history

### 2. **Middle Pane - The Request Builder**
- **Combined Method Selector & URL Input**: Quick method selection (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS) with immediate URL entry
- **Tabbed Interface**:
  - **Params**: Query parameter builder with key-value pairs and visual query string preview
  - **Auth**: Multiple authentication types (None, Bearer Token, Basic Auth, API Key)
  - **Headers**: Custom header management with enable/disable toggles
  - **Body**: Advanced code editor with syntax highlighting for JSON, HTML, and text
- **Active Users Panel**: Real-time collaboration avatars showing who's editing the request
- **Send Button**: Execute requests with loading state feedback

### 3. **Right Pane - The Response Viewer**
- **Status Display**: Color-coded HTTP status codes with visual badges
- **Response Metrics**: Time taken (ms) and response size (KB)
- **Tabbed Response Viewer**:
  - **Pretty**: Formatted JSON viewer with syntax highlighting
  - **Raw**: Raw response body for manual inspection
  - **Headers**: Response headers in organized format
  - **Diff**: Visual comparison with previous response (red/green highlights)
- **Copy to Clipboard**: One-click response copying
- **Empty State**: Clean "Send a request" prompt when no response available

## Advanced Components

### Code Editor
- **AdvancedCodeEditor.tsx**: Professional code editor with:
  - Line numbers and optional minimap
  - Word wrap toggle
  - Font size controls (11-18px)
  - Format button for JSON auto-formatting
  - Copy functionality with feedback

### Diff Viewer
- **DiffViewer.tsx**: Comprehensive response comparison with:
  - Side-by-side or unified diff view
  - Added/removed line highlighting (green/red)
  - Line number tracking
  - Statistics display (+/- counts)
  - Copy diff functionality

### Collaboration Features
- **CollaborationPanel.tsx**: Real-time team presence with:
  - Active user avatars with status indicators
  - Editing/viewing/idle status
  - Cursor position tracking
  - Tooltip previews with user details

### Additional Utilities
- **ParamsBuilder.tsx**: Advanced query parameter builder with visual query string generation
- **EnvironmentManager.tsx**: Environment variable management with import/export
- **KeyboardShortcuts.tsx**: Global keyboard shortcuts (Cmd+K for help, Cmd+Enter to send)
- **RequestDetailsModal.tsx**: Detailed request preview modal
- **CodeHighlighter.tsx**: Syntax highlighting for JSON, HTML, and XML

## Design System

### Color Palette (Zinc Dark Theme)
- **Background**: #0f0f0f
- **Foreground**: #fafafa
- **Card**: #1a1a1a
- **Primary**: #3f3f46 (Gray)
- **Accent**: #18181b
- **Border**: #27272a
- **Destructive**: #ef4444 (Red)
- **Status Colors**: 
  - Success: #10b981 (Green)
  - Info: #0ea5e9 (Blue)
  - Warning: #f59e0b (Amber)
  - Error: #ef4444 (Red)

### Design Elements
- **Glassmorphism**: Backdrop blur and semi-transparent backgrounds
- **No Vertical Scroll**: Main page uses internal pane scrolling
- **Responsive Layout**: Flexible 3-pane system
- **Icons**: lucide-react for consistent iconography

## Usage

### Keyboard Shortcuts
- `Cmd+K` / `Ctrl+K`: Show keyboard shortcuts
- `Cmd+Enter` / `Ctrl+Enter`: Send request
- `Cmd+Shift+E` / `Ctrl+Shift+E`: Switch environment

### Request Building
1. Select HTTP method from dropdown
2. Enter API endpoint URL
3. Add query parameters in Params tab
4. Configure authentication if needed
5. Add custom headers
6. Write request body (JSON/HTML/Text)
7. Click Send to execute

### Response Analysis
- View formatted JSON with syntax highlighting
- Check response headers and status
- Compare with previous response using Diff toggle
- Copy response for use elsewhere

## Components Structure

```
components/
├── flux/
│   ├── Sidebar.tsx                 # Left navigator
│   ├── RequestBuilder.tsx          # Middle request pane
│   ├── ResponseViewer.tsx          # Right response pane
│   ├── AdvancedCodeEditor.tsx      # Monaco-inspired editor
│   ├── DiffViewer.tsx              # Response diff viewer
│   ├── CollaborationPanel.tsx      # Active users display
│   ├── ParamsBuilder.tsx           # Query parameter builder
│   ├── EnvironmentManager.tsx      # Environment manager
│   ├── KeyboardShortcuts.tsx       # Keyboard shortcuts overlay
│   ├── RequestDetailsModal.tsx     # Request details preview
│   └── CodeHighlighter.tsx         # Syntax highlighter

hooks/
└── useRequestHistory.ts            # Request history management
```

## Performance Optimizations

- **useCallback**: Memoized request handler to prevent unnecessary re-renders
- **useMemo**: Computed diff calculations only when content changes
- **Internal Scrolling**: Prevents full-page scroll reflow
- **Efficient Diff Algorithm**: Line-by-line comparison for fast diffs

## Accessibility

- ARIA labels for interactive elements
- Keyboard navigation throughout
- Color-independent status indicators
- Screen reader friendly tooltips
- Semantic HTML structure

## Future Enhancements

- Real WebSocket integration for live collaboration
- MongoDB/PostgreSQL backend for request storage
- Team sharing and access control
- Request testing and automation
- API documentation generation
- OAuth2 flow support
- GraphQL query builder
- WebSocket debugging

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **State Management**: React hooks (useState, useCallback, useMemo)
- **Type Safety**: TypeScript

## License

MIT - Feel free to use and extend!
