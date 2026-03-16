---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2026-03-16'
inputDocuments: [prd.md, architecture.md]
---

# new-project - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for new-project, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: User can create a new todo by entering a title
FR2: User can edit an existing todo's title inline
FR3: User can delete a todo
FR4: User can mark a todo as complete or incomplete (toggle)
FR5: All todos are displayed in a list with their completion status
FR6: All operations are intuitive and require no instructions

### NonFunctional Requirements

NFR1: Responsive layout works on viewports from 320px (mobile) to 1440px+ (desktop)
NFR2: Zero external runtime dependencies beyond Next.js/React
NFR3: Clean component separation (TodoInput, TodoList, TodoItem) demonstrating idiomatic React/Next.js patterns
NFR4: All CRUD operations function without errors

### Additional Requirements

- Starter template specified: `npx create-next-app@latest new-project --typescript --eslint --app --turbopack`
- Testing framework: Vitest + React Testing Library (added post-initialization)
- ID generation: `crypto.randomUUID()` for new todos
- Styling: CSS Modules (co-located with components)
- TypeScript with strict mode
- Named exports only, `I` prefix for props interfaces
- Immutable state updates (spread/map/filter)
- Input validation: prevent empty/whitespace-only submissions; revert on edit cancel

### FR Coverage Map

FR1 (Create todo): Epic 2
FR2 (Edit todo): Epic 2
FR3 (Delete todo): Epic 2
FR4 (Toggle complete): Epic 2
FR5 (Display todos): Epic 2
FR6 (Intuitive operations): Epic 2

## Epic List

### Epic 1: Project Foundation
Set up the development environment so that a working Next.js application runs locally with testing infrastructure in place.
**FRs covered:** None directly (enables all FRs). Addresses Architecture additional requirements (starter template, Vitest setup, shared types, project structure).

### Epic 2: Core Todo Management
Users can create, view, edit, complete, and delete todos in a responsive interface — delivering the full MVP experience.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6

## Epic 1: Project Foundation

Set up the development environment so that a working Next.js application runs locally with testing infrastructure in place.

### Story 1.1: Initialize Next.js Project

As a developer,
I want a working Next.js application scaffolded with TypeScript, ESLint, and App Router,
So that I have a clean foundation to build the todo application on.

**Acceptance Criteria:**

**Given** the project directory is empty
**When** the developer runs `npx create-next-app@latest new-project --typescript --eslint --app --turbopack`
**Then** a Next.js 16.1 project is created with TypeScript, ESLint, and App Router configured
**And** `npm run dev` starts the development server without errors
**And** the project structure includes `src/app/` with `layout.tsx` and `page.tsx`

### Story 1.2: Configure Testing and Project Structure

As a developer,
I want Vitest and React Testing Library configured with the project's directory structure in place,
So that I can write and run tests as I build components.

**Acceptance Criteria:**

**Given** the Next.js project from Story 1.1 is initialized
**When** Vitest and React Testing Library are installed and configured
**Then** `vitest.config.ts` exists at the project root with proper Next.js/React configuration
**And** the `src/types/todo.ts` file exists with the `Todo` interface (`id: string`, `title: string`, `completed: boolean`)
**And** the `src/__tests__/` directory exists
**And** the `src/components/` directory exists
**And** a sample test can run successfully via `npx vitest run`

## Epic 2: Core Todo Management

Users can create, view, edit, complete, and delete todos in a responsive interface — delivering the full MVP experience.

### Story 2.1: Display Todo List and Add Todos

As a user,
I want to see my todos in a list and add new ones by entering a title,
So that I can start building and viewing my task list.

**Acceptance Criteria:**

**Given** the application is loaded
**When** the page renders
**Then** an input field and submit button are displayed for adding todos
**And** the todo list area is visible (empty state)

**Given** the user types a title in the input field
**When** the user submits the form
**Then** a new todo appears in the list with the entered title and uncompleted status
**And** the input field is cleared
**And** the todo has a unique ID generated via `crypto.randomUUID()`

**Given** the input field is empty or contains only whitespace
**When** the user attempts to submit
**Then** submission is prevented (submit button disabled)

**Given** the app is viewed on a 320px mobile viewport
**When** the page renders
**Then** the input and todo list are fully visible and usable without horizontal scrolling

### Story 2.2: Toggle Todo Completion

As a user,
I want to mark a todo as complete or incomplete,
So that I can track which tasks are done.

**Acceptance Criteria:**

**Given** a todo exists in the list with `completed: false`
**When** the user clicks the toggle control
**Then** the todo's completed status changes to `true`
**And** the todo visually indicates completion (e.g., strikethrough or styling change)

**Given** a todo exists in the list with `completed: true`
**When** the user clicks the toggle control
**Then** the todo's completed status changes to `false`
**And** the completion visual indicator is removed

### Story 2.3: Delete Todos

As a user,
I want to delete a todo,
So that I can remove tasks I no longer need.

**Acceptance Criteria:**

**Given** a todo exists in the list
**When** the user clicks the delete button
**Then** the todo is immediately removed from the list
**And** the remaining todos are still displayed correctly

**Given** only one todo exists in the list
**When** the user deletes it
**Then** the list displays an empty state

### Story 2.4: Edit Todo Title Inline

As a user,
I want to edit an existing todo's title inline,
So that I can correct or update my task descriptions.

**Acceptance Criteria:**

**Given** a todo exists in the list
**When** the user activates edit mode (e.g., double-click or edit button)
**Then** the todo title becomes an editable input field with the current title pre-filled

**Given** the user is editing a todo title
**When** the user changes the text and confirms (e.g., Enter key or save button)
**Then** the todo title is updated with the new text
**And** the todo returns to display mode

**Given** the user is editing a todo title
**When** the user cancels editing (e.g., Escape key)
**Then** the title reverts to the previous value
**And** the todo returns to display mode

**Given** the user is editing a todo title
**When** the user clears the input to empty or whitespace only
**Then** saving is prevented (save button disabled or submission blocked)
