---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success]
inputDocuments: [product-brief-new-project-2026-03-12.md]
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
  projectContext: 0
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - new-project

**Author:** Rahul
**Date:** 2026-03-12

## Executive Summary

new-project is a Next.js todo list application designed as a focused learning exercise for developers building foundational React and Next.js skills. It solves the gap between oversimplified tutorials and overly complex sample projects by providing a clean, idiomatic implementation of all four CRUD operations — add, edit, complete, and delete — with responsive design and local state management via React hooks.

### What Makes This Special

The differentiator is code quality and transferable patterns, not feature novelty. A well-separated component hierarchy (TodoInput, TodoList, TodoItem) demonstrates real composition patterns that apply to production projects. Zero external dependencies for state or backend keeps the learning focused squarely on Next.js and React fundamentals. Responsive design is built in from the start, not bolted on — making it a rare todo tutorial that actually feels good on mobile.

## Project Classification

- **Project Type:** Web Application (Next.js SPA)
- **Domain:** General (learning/education)
- **Complexity:** Low — straightforward CRUD, no auth, no backend, no external integrations
- **Project Context:** Greenfield — new project from scratch

## Success Criteria

### User Success

- Users can create a new todo by entering a title
- Users can edit an existing todo's title
- Users can delete a todo
- Users can mark a todo as complete or incomplete
- All operations are intuitive and require no instructions

### Business Success

- N/A — this is a learning project, not a commercial product
- Success is measured by whether the developer (Rahul) builds a working app that demonstrates clean Next.js patterns

### Technical Success

- All four CRUD operations function correctly
- Responsive layout works on desktop and mobile viewports
- Clean component separation (TodoInput, TodoList, TodoItem)
- No external state management or backend dependencies
- Code demonstrates idiomatic React and Next.js patterns

### Measurable Outcomes

- All CRUD operations work without errors
- UI renders correctly on viewports from 320px (mobile) to 1440px+ (desktop)
- App runs with zero external runtime dependencies beyond Next.js/React

## Product Scope

### MVP - Minimum Viable Product

- Add todos with a title
- Edit existing todo titles inline
- Delete todos
- Toggle todo completion status
- Responsive design for desktop and mobile
- Local state management with useState

### Growth Features (Post-MVP)

- Filter todos by status (all/active/completed)
- Persist todos to localStorage
- Todo count display

### Vision (Future)

- Backend integration with database persistence
- User authentication
- Multiple todo lists/categories
