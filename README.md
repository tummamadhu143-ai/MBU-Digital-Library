# MBU-Digital-Library

## Data Science Digital Library

A standalone student learning library for exploring data science coursework in a browser.

## Public website

After the GitHub Pages workflow completes, open the library at:

<https://tummamadhu143-ai.github.io/MBU-Digital-Library/>

The workflow publishes the static site and its course materials whenever changes are pushed to `main`.

## Open the library

Open `index.html` in a browser. The student dashboard links to five learning modules, lab experiments, projects, study tools, learning resources, and a demo AI assistant.

The Assignments section includes the Module 1, Module 2, and Module 3 assignment PDFs. Open an assignment in the single-page notebook reader to turn through one sheet at a time, or download its PDF.

## Presentation notebooks

Module 1 and Module 2 include two-page, animated notebooks generated from their original PowerPoint presentations. The source presentations are kept in each module's `source-presentations` folder; the notebook page images are alongside them in the module folder.

Module 2 also includes the 54-page **Tools For Data Science** notebook, the original DOCX, and a PDF copy.

## Student project links

GitHub-linked projects are managed under Projects. Experiment files added under Lab Experiments are stored locally in the current browser and are not uploaded to the public website.

## Live Python compiler

The Projects section includes ten Data Science experiments, each divided into A, B, and C sections, with the original DOCX available to download. Choose an experiment and section to load its starter program into the in-browser Python editor, edit it, and choose **Run Python**. The earlier quick examples remain available in the same selector. Python runs locally in a Web Worker through Pyodide; the first run downloads the runtime and required packages from the public CDN, so an internet connection is required. Code and output are not uploaded by the library. Experiment 8 uses local sample HTML and sample reviews; it does not scrape Amazon or contact websites.

The review-analysis example uses sample text and does not scrape Amazon. Use an approved API or licensed dataset for product reviews. The example emotion classifier is rule-based; it is not a trained model.

## AI study assistant

The AI model section sends conversation messages to the OpenAI API through the serverless function in `api/chat.js`. The API key is read only from the backend's `OPENAI_API_KEY` environment variable; never put the key in `index.html`, client-side code, or a public repository.

To enable live answers, deploy this repository to Vercel and add `OPENAI_API_KEY` in the Vercel project's server-side environment variables, then redeploy. The default model is `gpt-4o-mini`; set `OPENAI_MODEL` to another model available to your OpenAI project if desired. Set `ALLOWED_ORIGINS` to a comma-separated list of trusted site origins, including `https://tummamadhu143-ai.github.io` when using GitHub Pages. To keep the current GitHub Pages site, set the `ai-api-url` meta tag in `index.html` to the deployed function URL, for example `https://your-vercel-deployment.vercel.app/api/chat`. If you serve the whole site from Vercel, the chat uses `/api/chat` automatically.

The chat is a public endpoint with no user sign-in. CORS restricts browser access to the configured site origins but does not prevent direct API requests. Configure usage limits and billing alerts in OpenAI, and consider adding a persistent rate limiter or authentication before sharing the endpoint widely. Chat messages are sent to OpenAI to generate responses; do not enter private or sensitive information. The API key is not sent to the browser.
