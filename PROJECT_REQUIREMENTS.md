# Quran App - Project Requirements & Implementation Plan

## Project Overview

A beautiful, feature-rich Quran reading application built with modern web technologies, offering users an immersive experience for reading, listening to, and studying the Holy Quran.

## Tech Stack

- **Frontend Framework**: React 19
- **Routing**: TanStack Router (file-based routing)
- **Data Fetching**: TanStack Query
- **State Management**: TanStack Store + localStorage sync
- **Styling**: TailwindCSS 4
- **UI Components**: Shadcn UI
- **Database**: Drizzle ORM + SQLite (for local caching)
- **Deployment**: Cloudflare (via Wrangler)
- **Platform**: Fully responsive (mobile-first approach)

## Requirements Gathered from Interview

### Core Features (Confirmed)

1. **Read Quran Text (Arabic)**
   - Display Arabic text with proper fonts
   - Support for both diacritics and simplified Arabic

2. **Translation Display**
   - English translation
   - Bengali translation
   - Arabic (original + simplified)
   - User-selectable translation languages

3. **Audio Recitation**
   - All audio features (verse-by-verse, continuous, multiple reciters, playback controls)
   - Play/pause, next/previous verse
   - Reciter selection (all available from API)
   - Playback speed control
   - Repeat mode (verse/surah)
   - Auto-scroll to current playing verse

4. **Search Functionality**
   - Search across surah names
   - Search through verse translations

5. **Bookmarks/Favorites**
   - Save favorite verses
   - Quick access to bookmarked verses
   - Persist in localStorage

6. **Tafsir (Commentary)**
   - Display scholarly interpretations
   - 3 sources: Ibn Kathir, Maarif Ul Quran, Tazkirul Quran
   - Rendered as markdown
   - Available from free API provider

7. **Word-by-Word Translation**
   - Tooltip-based word translation
   - Help users learn Arabic

8. **Juz/Hizb/Page Navigation**
   - Multiple ways to navigate the Quran

### Navigation (Confirmed)

- **Primary**: By Surah (Chapter) - List all 114 surahs, click to read
- **Landing Page**: Users see a landing page first with overview, then browse

### Additional Features (Confirmed)

1. **Verse of the Day**
   - Display a random verse on homepage daily
   - Inspirational feature

2. **Reading Progress/Stats**
   - Track verses read
   - Reading streak (consecutive days)
   - Visual progress indicators
   - Reading history

3. **Share Verse Feature**
   - Generate beautiful verse cards
   - Include Arabic + translation
   - Download as image
   - Copy to clipboard

4. **Footnotes/References**
   - Additional context for verses
   - Scholarly references

### API Integration (Confirmed)

**Primary API**: QuranAPI (quranapi.pages.dev)

- Use multiple free sources where appropriate
- Primarily use QuranAPI for most resources

**Available from QuranAPI**:

- Base URL: `https://quranapi.pages.dev/api`
- All 114 surahs metadata
- Full surah data with translations (English, Bengali, Urdu, Arabic)
- 5 reciters: Mishary Rashid Al Afasy, Abu Bakr Al Shatri, Nasser Al Qatami, Yasser Al Dosari, Hani Ar Rifai
- Tafsir (3 sources): Ibn Kathir, Maarif Ul Quran, Tazkirul Quran
- No rate limits
- JSON responses

### Design Preferences (Confirmed)

**Style**: Traditional Islamic with light/dark mode toggle

- Geometric Islamic patterns
- Arabesque designs
- Gold accents (#D4AF37)
- Emerald/Teal primary colors (#059669, #0d9488)
- Smooth gradients
- Beautiful animations fostering Islamic vibes

**Light Mode**:

- White/Cream background (#FFFEF7)
- Dark text
- Gold and emerald accents

**Dark Mode**:

- Deep navy/black background (#0A0E27)
- Off-white text
- Brighter gold accents
- Lighter emerald colors

**Typography**:

- Arabic: Amiri, Scheherazade New, or Uthmanic fonts
- English/UI: Inter, Plus Jakarta Sans
- Large, readable sizes for verses

### State Management Strategy (Confirmed)

Use TanStack Store with localStorage sync:

- No authentication required
- Store everything locally
- Sync to localStorage with 500ms debounce
- Stores needed:
  - Theme store (light/dark)
  - Bookmarks store
  - Progress store (read verses, streaks)
  - Audio player store
  - Settings store (preferences)

### Responsive Design (Confirmed)

- Fully responsive across all devices
- Mobile-first approach
- Touch-friendly controls
- Optimized for both desktop and mobile

## Implementation Progress

### ✅ Completed Tasks

1. **Set up API types and interfaces for QuranAPI**
   - Created comprehensive TypeScript types
   - Interfaces for Surah, Verse, Tafsir, Reciters
   - Helper functions for data transformation

2. **Create TanStack Query hooks for API calls**
   - Query hooks for all API endpoints
   - Proper caching strategies
   - Stale time and cache time configured
   - Query keys organized

3. **Set up TanStack Stores (bookmarks, progress, audio, settings, theme)**
   - Theme store with light/dark mode
   - Bookmarks store with add/remove/check functions
   - Progress store with streak tracking
   - Audio player store with full playback controls
   - Settings store for user preferences
   - All stores persist to localStorage

4. **Implement localStorage sync utility**
   - Load/save/remove functions
   - Debounced writes (500ms)
   - Type-safe helpers
   - Error handling

5. **Install required Shadcn UI components**
   - Button, Card, Dialog, Input, Label
   - Dropdown Menu, Select, Separator
   - Slider, Switch, Tabs
   - Progress, Badge, Skeleton
   - Sheet, Scroll Area, Sonner (toast)

## Remaining Implementation Tasks

### 🔄 In Progress

6. **Create layout components (Header, Footer with theme toggle)**
   - Status: IN PROGRESS
   - ThemeToggle component created
   - Need to create new Header with Islamic design
   - Need to create Footer
   - Update \_\_root.tsx with new layout

### 📋 Pending Tasks

7. **Build VerseCard and SurahCard components**
   - Priority: Medium
   - Beautiful card designs with Islamic patterns
   - Display verse with Arabic + translation
   - Surah card with metadata

8. **Create Landing page with Verse of the Day**
   - Priority: Medium
   - Hero section with Islamic gradients
   - Verse of the Day feature
   - Quick stats (114 Surahs, 6236 Verses)
   - CTA buttons: Start Reading / Continue Reading
   - Recent readings, Popular surahs

9. **Build Surah list page with search/filter**
   - Priority: Medium
   - Route: `/surahs`
   - Grid/List view of all 114 surahs
   - Search and filter functionality
   - Filter by Meccan/Medinan

10. **Create Surah reading page with verses and translations**
    - Priority: Medium
    - Route: `/surah/:id`
    - Display all verses
    - Translation toggle
    - Verse actions (audio, bookmark, share, tafsir)

11. **Implement AudioPlayer component with all controls**
    - Priority: Medium
    - Sticky/floating player
    - Play/pause, next/previous
    - Reciter selection
    - Speed control
    - Repeat modes
    - Auto-scroll to verse

12. **Add Tafsir panel/modal with 3 sources**
    - Priority: Low
    - Modal/panel for commentary
    - Toggle between 3 authors
    - Markdown rendering
    - Footnotes support

13. **Implement bookmark functionality**
    - Priority: Low
    - Bookmark verses
    - View bookmarks page
    - Remove bookmarks
    - Integrate with stores

14. **Build search functionality**
    - Priority: Low
    - Route: `/search`
    - Search surah names and verses
    - Display results with context
    - Navigate to verse from results

15. **Create reading progress tracking and stats page**
    - Priority: Low
    - Route: `/progress`
    - Display statistics
    - Reading streak visualization
    - Progress calendar
    - Favorite surahs

16. **Implement share verse feature with image generation**
    - Priority: Low
    - Generate verse cards
    - Beautiful Islamic design
    - Arabic + translation
    - Download as image
    - Copy to clipboard

17. **Add word-by-word translation tooltips**
    - Priority: Low
    - Hover/tap on Arabic words
    - Show translation tooltip
    - Educational feature

18. **Polish responsive design and add Islamic themed styling**
    - Priority: Low
    - Refine all components
    - Add geometric patterns
    - Implement animations
    - Test on all devices
    - Ensure accessibility

## File Structure Created

```
src/
├── lib/
│   ├── api/
│   │   ├── types.ts          ✅ Created
│   │   ├── quran.ts          ✅ Created
│   │   └── queries.ts        ✅ Created
│   ├── stores/
│   │   ├── theme.ts          ✅ Created
│   │   ├── bookmarks.ts      ✅ Created
│   │   ├── progress.ts       ✅ Created
│   │   ├── audio.ts          ✅ Created
│   │   ├── settings.ts       ✅ Created
│   │   └── index.ts          ✅ Created
│   └── utils/
│       └── localStorage.ts   ✅ Created
├── components/
│   ├── ui/                   ✅ Shadcn components installed
│   ├── common/
│   │   └── ThemeToggle.tsx   ✅ Created
│   ├── layout/               📋 Pending
│   ├── quran/                📋 Pending
│   └── features/             📋 Pending
└── routes/
    ├── __root.tsx            📋 Needs update
    └── index.tsx             📋 Needs replacement
```

## Next Steps

1. **Complete layout components** - Finish Header, create Footer
2. **Update root route** - Apply new Islamic-themed layout
3. **Build core components** - VerseCard, SurahCard
4. **Create main pages** - Landing, Surah List, Reading Page
5. **Implement audio player** - Full featured player component
6. **Add advanced features** - Tafsir, Search, Progress tracking
7. **Polish and test** - Responsive design, animations, accessibility

---

**Total Tasks**: 18
**Completed**: 5
**In Progress**: 1
**Remaining**: 12
