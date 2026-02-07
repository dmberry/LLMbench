# LLMbench

**A comparative close reading workbench for Large Language Model outputs**

LLMbench is a web-based research tool that enables scholars and researchers to subject AI-generated text to the kind of sustained hermeneutic scrutiny that has long been applied to literary, philosophical, and computational texts. It sends a single prompt to two LLMs simultaneously, displays their responses in side-by-side annotatable panels, and provides a layered annotation system for building interpretive readings across both outputs.

The tool is designed for humanistic inquiry into LLM behaviour, not engineering evaluation. Where existing comparison tools (Google PAIR's LLM Comparator, Chatbot Arena, LMSYS) measure win rates, safety metrics, and benchmark performance, LLMbench treats the outputs as texts to be read, annotated, and interpreted.

## Scholarly Context

LLMbench emerges from the convergence of three research programmes.

**Critical Code Studies.** Mark Marino's Critical Code Studies (2020) established that source code is a cultural object amenable to hermeneutic, rhetorical, and materialist analysis. The CCS-WB (Critical Code Studies Workbench) provides the annotation infrastructure that LLMbench adapts. Where CCS applies close reading to code, LLMbench extends that practice to the *outputs* of computational systems, treating LLM-generated text as an object of analysis rather than a finished product.

**AI Sprints.** Berry (2025) proposed AI sprints as a research methodology for bounded, intensive human-AI collaboration in humanities and social science research. The method adapts earlier sprint traditions (book sprints, data sprints) while maintaining critical reflexivity about computational systems. AI sprints operate through *productive augmentation*, where researchers maintain strategic control over research questions and interpretive claims while leveraging computational capacity for generation and pattern-finding. LLMbench provides the analytical workspace for the comparative dimension of this methodology, enabling researchers to examine how different models handle the same prompt and to build structured interpretive records of that examination.

**Comparative and variorum analysis.** The variorum principle, articulated in *10 PRINT* (Montfort et al. 2013), treats different variants of the same text as analytically productive rather than as defects to be resolved. LLMbench operationalises this principle for LLM outputs. Two models responding to the same prompt produce textual variants whose differences reveal assumptions, rhetorical strategies, knowledge boundaries, and ideological dispositions that would remain invisible in a single output.

## What It Does

- **Dual-panel comparison.** Send a prompt to two LLM providers simultaneously. Responses appear in side-by-side panels with full provenance metadata (model name, temperature, response time, word count).

- **Six-type annotation system.** Each panel supports independent inline annotations with typed categories: observation, question, metaphor, pattern, context, and critique. Annotations appear as colour-coded inline widgets with gutter markers, adapted from the CCS-WB annotation infrastructure.

- **Display controls.** Configurable prose font (Source Serif 4, Libre Baskerville, Inter, System Default), font size, annotation brightness, line highlighting intensity, and dark mode.

- **Multi-provider support.** Anthropic (Claude), OpenAI (GPT), Google (Gemini), Ollama (local models), and any OpenAI-compatible endpoint. API keys are stored in the browser only, never sent to a server.

- **Visual word diff.** Toggle a word-level diff view that highlights textual differences between the two outputs. Unique words are colour-coded (red for Panel A, green for Panel B) with synchronised scrolling and line numbers. Diff highlighting carries through to PDF export.

- **Export.** Comparisons export as structured JSON (with word counts), formatted plain text, or side-by-side landscape PDF with coloured annotation badges and optional diff highlighting.

- **Dynamic model configuration.** Available models are defined in a [`models.md`](public/models.md) file in the public directory. Add new models by editing the Markdown file and refreshing the browser, with no rebuild required. Every provider includes a "Custom Model" option for entering any model ID directly.

- **Local persistence.** Comparisons save to browser localStorage. Name, load, and manage multiple comparison sessions.

## Design Rationale

**Why CodeMirror for prose?** Displaying LLM prose in a code-style editor is a deliberate choice. It creates productive defamiliarisation, making the text look less like natural language and more like an object of analysis. The line-based annotation system transfers directly from code analysis, and the gutter provides a natural site for annotation markers. The editorial typography (serif fonts, comfortable line height) counterbalances the code-editor affordance with readability appropriate to extended prose.

**Why not engineering metrics?** Existing LLM comparison tools are designed for developers optimising model selection. They answer questions like "which model is better at coding?" or "which is safer?" LLMbench answers different questions: How does this model frame the concept differently from that one? What rhetorical strategies does each deploy? Where do their knowledge representations diverge, and what does that divergence reveal? These are humanistic questions that require close reading, not measurement.

**Why two panels?** Two is the minimum for comparison and sufficient for most analytical work. It follows the variorum principle: you need at least two variants to see what varies. The dual-panel constraint also keeps the interface focused and prevents the tool from becoming a dashboard.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- API keys for at least one LLM provider (Anthropic, OpenAI, Google, or a local Ollama instance)

### Installation

```bash
git clone https://github.com/dmberry/LLMbench.git
cd LLMbench
npm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

API keys are configured in the browser through the Settings panel (gear icon), not in environment variables. The `.env.local` file is used for optional Supabase configuration if cloud persistence is enabled later.

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click the gear icon to configure your LLM providers, then enter a prompt and send.

## Architecture

```
public/
  models.md              # Editable model definitions (no rebuild needed)
src/
  app/
    api/generate/        # Fan-out API route (dispatches to both providers)
    page.tsx             # Main workspace UI
  components/
    annotations/         # CodeMirror annotation system (adapted from CCS-WB)
    settings/            # Provider configuration modal
    workspace/           # ProsePanel, DiffPanel, theme
  context/               # Provider settings (localStorage-persisted)
  hooks/                 # Annotations, local storage, prompt dispatch
  lib/
    ai/                  # Unified AI client, provider configs, model loader
    diff/                # Word-level diff computation
    export/              # JSON, text, PDF export
  types/                 # TypeScript types for annotations, comparisons, settings
```

The fan-out API route receives a prompt and dispatches it simultaneously to both configured providers using `Promise.allSettled`, ensuring that a failure in one provider does not block the other. Each response carries provenance metadata (model identifier, temperature, response time) that is displayed in the panel header and preserved in exports.

## Tech Stack

- **Next.js 16** with React 19 and App Router
- **CodeMirror 6** for prose display and annotation
- **Tailwind CSS v3** with an editorial colour palette (ivory, cream, parchment, burgundy, gold)
- **Vercel AI SDK** with Anthropic, OpenAI, and Google providers
- **jsPDF** for PDF export
- **diff** for word-level text comparison
- **localStorage** for persistence (Supabase preparation layer exists for future cloud sync)

## Roadmap

- [ ] Cross-panel annotation linking (connecting annotations across Panel A and Panel B)
- [ ] Prompt history browser
- [ ] Supabase cloud persistence and sharing
- [ ] Streaming responses
- [ ] Tutorial/cards system for guided analytical exercises

## Related Work

- Berry, D. M. (2025) 'AI Sprints: A Research Methodology for Human-AI Collaboration', *Stunlaw*. Available at: https://stunlaw.blogspot.com/2025/11/ai-sprints.html
- Berry, D. M. (2025) 'Synthetic Media and Computational Capitalism: Towards a Critical Theory of Artificial Intelligence', *AI & Society*. Available at: https://doi.org/10.1007/s00146-025-02265-2
- Berry, D. M. (2026) *Artificial Intelligence and Critical Theory*. MUP.
- Berry, D. M. and Marino, M. C. (2024) 'Reading ELIZA', ebr.
- Marino, M. C. (2020) *Critical Code Studies*. MIT Press.
- Montfort, N. et al. (2013) *10 PRINT CHR$(205.5+RND(1)); : GOTO 10*. MIT Press.

## Acknowledgements

LLMbench adapts the annotation infrastructure from the [Critical Code Studies Workbench](https://github.com/dmberry/CCS-WB) (CCS-WB). The editorial design system, CodeMirror annotation widgets, and display settings are shared between the two projects.

## Licence

MIT
