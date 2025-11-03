# AI Development Rules for ProOmo

This document outlines the core technologies and development guidelines for the ProOmo application to ensure consistency, maintainability, and adherence to best practices.

## Tech Stack Overview

1.  **Framework:** React (with TypeScript)
2.  **Styling:** Tailwind CSS for utility-first styling.
3.  **Component Library:** shadcn/ui (built on Radix UI) for pre-styled, accessible components.
4.  **Routing:** React Router for client-side navigation.
5.  **Icons:** `lucide-react` for all iconography.
6.  **State Management:** Standard React hooks (`useState`, `useContext`, etc.) should be prioritized.
7.  **Notifications:** `react-hot-toast` for user feedback (success, error, loading messages).
8.  **File Structure:**
    *   Source code resides in `src/`.
    *   Pages/Routes are in `src/pages/`.
    *   Reusable components are in `src/components/`.
    *   Hooks are in `src/hooks/`.

## Library Usage Rules

| Task | Recommended Library/Tool | Notes |
| :--- | :--- | :--- |
| **UI Components** | shadcn/ui (Radix UI) | Use pre-built components whenever possible. If customization is needed, create a new component that wraps or extends the shadcn/ui base. |
| **Styling** | Tailwind CSS | Use utility classes exclusively. Avoid custom CSS files unless absolutely necessary for complex animations or third-party overrides. |
| **Icons** | `lucide-react` | All icons must be sourced from this library. |
| **Routing** | React Router | Manage all client-side navigation and URL parameters using React Router. Routes should be defined in `src/App.tsx`. |
| **User Feedback** | `react-hot-toast` | Use for all temporary, non-blocking notifications (toasts). |
| **Forms** | Standard React/shadcn/ui | Use standard controlled components and validation (e.g., Zod/React Hook Form if needed, but keep it simple initially). |