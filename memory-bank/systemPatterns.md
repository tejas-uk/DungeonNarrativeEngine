# System Patterns

## Architecture
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL with Drizzle ORM
- AI Services: Claude, Vapi.ai, Rime.ai

## Design Patterns
1. Component-Based Architecture
   - Reusable UI components
   - Shadcn/ui integration
   - Form management patterns

2. State Management
   - React Hook Form for complex forms
   - Context API for global state
   - Custom hooks for AI interactions

3. API Integration
   - RESTful endpoints
   - WebSocket for real-time features
   - AI service orchestration

## System Architecture
- The Memory Bank is a directory of structured Markdown files, each serving a specific documentation purpose.
- Files are organized hierarchically to build context from foundational to active and progress states.

## Key Technical Decisions
- Use of Markdown for human-readable, version-controllable documentation
- Hierarchical file structure for clarity and context layering

## Design Patterns in Use
- Documentation-driven development
- Context layering (from project brief to active context)

## Component Relationships
- Each file builds upon the context of its parent (see flowchart in project brief)

## Critical Implementation Paths
- All project work begins with reading the Memory Bank
- Updates are made after significant changes or upon request