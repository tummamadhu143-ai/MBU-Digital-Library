# MBU-Digital-Library

## Data Science Digital Library

A standalone student learning library for exploring data science coursework in a browser.

## Public website

After the GitHub Pages workflow completes, open the library at:

<https://tummamadhu143-ai.github.io/MBU-Digital-Library/>

The workflow publishes the static site and its course materials whenever changes are pushed to `main`.

## Open the library

Open `index.html` in a browser. The student dashboard links to five learning modules, lab experiments, projects, study tools, learning resources, and a demo AI assistant.

## Presentation notebooks

Module 1 and Module 2 include two-page, animated notebooks generated from their original PowerPoint presentations. The source presentations are kept in each module's `source-presentations` folder; the notebook page images are alongside them in the module folder.

Module 2 also includes the 54-page **Tools For Data Science** notebook, the original DOCX, and a PDF copy.

## Student project links

GitHub-linked projects are managed under Projects. Experiment files added under Lab Experiments are stored locally in the current browser and are not uploaded to the public website. The demo library does not include a server-side login or AI service.

## Live Python compiler

The Projects section contains an in-browser Python editor with runnable examples for data formats, API-shaped data and SQLite, data cleaning, wrangling, visualization summaries, time series, aggregation, review analysis, and customer/emotion case studies. Select an example, edit the code, and choose **Run Python**. Python runs locally in a Web Worker through Pyodide; the first run downloads the runtime plus NumPy, pandas, and SQLite support from the public CDN, so an internet connection is required. Code and output are not uploaded by the library.

The review-analysis example uses sample text and does not scrape Amazon. Use an approved API or licensed dataset for product reviews. The example emotion classifier is rule-based; it is not a trained model.
