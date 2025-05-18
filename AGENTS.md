# AGENT Instructions for LLM Circuits Visualizer

This repository contains a Next.js 15 web application that visualizes neuron activations in a large language model. The application resides in `llm-circuits-app/` and is deployed to Cloudflare using the `open-next` stack. The root of the repo also holds a number of markdown documents that outline the design and research behind the project.

## Repository layout

- `README.md` – project overview and feature list.
- `architecture.md` – describes planned architecture and TypeScript interfaces for neurons, tokens and connections.
- `research_notes.md` – collection of mechanistic interpretability notes.
- `todo.md` – task list for the project.
- `wireframes.md` – early design sketches.
- `LICENSE` – MIT license for the project.
- `llm-circuits-app/` – Next.js application source code.

### Inside `llm-circuits-app`

- `package.json` – configures the Next.js project and declares dependencies. Scripts include:
  - `dev` – start the development server.
  - `build` – build the production bundle.
  - `lint` – run `next lint`.
  - `build:worker` – build Cloudflare worker using `@opennextjs/cloudflare`.
  - `preview` – build and run locally using Cloudflare's Wrangler.
- `open-next.config.ts` and `wrangler.toml` – Cloudflare deployment settings.
- `tailwind.config.ts` and `src/app/globals.css` – Tailwind CSS configuration.
- `src/` – application source:
  - `app/` – Next.js entry points and layout. `page.tsx` is the main UI where prompts are submitted and visualizations displayed.
  - `components/visualization/` – React components for rendering neurons, tokens and interactive dialogs using React Three Fiber and Radix UI primitives.
  - `components/ui/` – shared UI components based on Radix UI.
  - `hooks/` – React hooks such as `useOpenAI` which handles prompt processing and neuron selection.
  - `lib/openai.ts` – wrapper around the OpenAI API. Provides `OpenAIClient`, mock data generation utilities and a helper `getOpenAIClient` for environments that already have an API key configured.
  - `migrations/` – example SQL for a Cloudflare D1 database (currently unused).

## Notes for Future Agents

1. **Programming language**: TypeScript/React with Next.js App Router.
2. **Data**: Real neuron activations are not fetched. If no API key is provided, mock data is generated in `openai.ts`.
3. **Build and lint**: Run `npm run lint` in `llm-circuits-app/`. This may fail without dependencies installed. Use `pnpm` if available.
4. **Testing**: There are currently no automated tests.
5. **License**: MIT license in `LICENSE` and `package.json`.
6. **Important file**: `src/app/page.tsx` is the entry point and orchestrates OpenAI interactions and 3D visualizations.

When adding new files or modifying code, please keep the structure organized under `llm-circuits-app/src`. Update documentation when necessary and ensure linting succeeds if dependencies are installed.
