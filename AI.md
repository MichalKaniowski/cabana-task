# AI-Assisted Workflow Documentation

## 1. Tools Used

- **IDE / Coding Agent:** Codex
- **LLM Model:** gpt5.4
- **Code Autocompletion:** Supermaven
- **Context Management:** Custom `agents.md`

## 2. Workflow & Steps

1. **New Conversation:** Creating a fresh conversation for every new feature. This prevents context contamination from previous tasks.
2. **Context Injection:** Injecting the specific requirements and context for the current feature.
3. **Scaffolding & Design (AI-Assisted):** Generate the initial boilerplate code and lay out design.
4. **Core Implementation (Manual):** Writing the actual business logic, state management, and algorithmic work manually. Afterward, I ask the AI to review the implemented code to identify potential edge cases and areas for improvement.
5. **Documentation (AI-Assisted):** If needed, update the `README.md` or `AGENTS.md` to reflect new feature capabilities or architectural decisions.

## 3. Key Prompts Used

Below are a couple of prompts that I used:

> I have written the core algorithm to determine the correct arrow image for the path tiles and calculate its rotation based on the surrounding grid elements. Please review this logic. Can you identify any edge cases, or is there a cleaner way to implement this algorithm?

> Based on the json payload from @route, please write a React component to render the resort map grid. Keep the component code and visual styling simple and focus strictly on functionality."

> I need to satisfy the requirement of being able to pass --map and --bookings flags when starting the application. Since Next.js doesn't natively support custom CLI flags on startup, write a custom Node.js server in a server.mjs file. The script should parse these command-line arguments, inject them into process.env so they are accessible to my backend API routes, and then initialize the Next.js app.
