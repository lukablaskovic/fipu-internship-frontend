## FIPU Internship Frontend :mortar_board: :chart_with_upwards_trend:

[![GitHub release](https://img.shields.io/github/v/release/lukablaskovic/fipu-internship-frontend)](https://github.com/lukablaskovic/fipu-internship-frontend/releases/latest)

### About :memo:

A Vue3-driven dashboard dedicated to streamlining and visualizing the student internship process at the Faculty of Informatics in Pula (FIPU) via an experimental BPMN model-based development and various integrated microservices.

This app is live and can be accessed [here](https://fipu-praksa.unipu.hr/).

![example workflow](https://github.com/lukablaskovic/fipu-internship-frontend/actions/workflows/build.yml/badge.svg)

### Table of Contents :book:

- [Introduction](#introduction-seedling)
- [Features](#features-sparkles)
- [Architecture](#architecture-construction)
- [Services](#services-wrench)
- [Contributing & Feedback](#contributing--feedback-mailbox)
- [License](#license-balance_scale)

### Introduction :seedling:

The FIPU Internship Frontend is crafted to smoothen and illuminate the internship journey for administrators and students by utilizing the BPMN model-based development and various supportive services. Though initially designed for FIPU’s specific use, the exploratory and research-oriented nature of this project allows its principles and architectures to potentially innovate and reshape various processes in the future.

### Features :sparkles:

For Admins (Professors | Internship Managers):

- **Interactive BPMN Graph**: A comprehensive and interactive visualization of each student’s internship process.
- **Actionable Insights**: Allocation of student preferences, acceptance/declination of companies and exercises, email management, and more.
- **Event Management**: View and manage events through a unified interface.

For Students:

- **Dynamic UI**: A user interface that adapts based on the current task in the BPMN diagram.
- **Internship Journey**: View available assignments, select preferences, communicate with professors, and manage application forms and diaries.
- **Process state**: Students may view the state of their internship process through interactive BPMN graph. 

For Companies:

- **Public Interface**: Submit new assignments and evaluate students’ performance through simple online forms.

### Architecture :construction:

- **Frontend**: Vue3, generated using Pro template from [justboil](https://github.com/justboil/admin-one-vue-tailwind)
- **BPMN Display**: The shared `@fipu/bpmn` XML toolkit and SVG renderer from FIPU BPMN Studio display the authoritative models served by the Python engine.
- **Backend Engine**: Custom-built [Python BPMN Engine](https://github.com/lukablaskovic/fipu-internship-bpmn-engine) (originally developed by [ntankovic](https://github.com/ntankovic/python-bpmn-engine)).

### Development

Use Node.js 22.12+ (22.x) or 24+ and run `npm ci`, then `npm run dev`. The production Docker build uses Node 22.

The UI uses Tailwind CSS 4 with its PostCSS plugin and Vite 8. Tailwind 4 requires Safari 16.4+, Chrome 111+, or Firefox 128+. Component style blocks using `@apply` must reference `src/css/main.css` using a relative `@reference` path.

Run the logic and SSR checks with `for test in tests/*.mjs tests/ui-reuse.cjs tests/icon-text-link.cjs tests/table-cell-text.cjs; do node "$test" || break; done`. Browser checks are `tests/tooltips.cjs`, `tests/ui-styles.cjs`, and (after `npm run build`) `tests/guest-production.cjs`. They use `@playwright/test`; set `PLAYWRIGHT_PACKAGE` to an external installation and `CHROME_PATH` to a Chrome executable if needed. Production smoke tests mock external services and do not verify real Google sign-in or submit data.

### shadcn-vue

shadcn-vue is initialized with the Reka Nova style and neutral light/dark tokens. Add components with `npx shadcn-vue add button` (replace `button` with the component name). Generated components go in `src/components/ui`, and the class-merging utility is `src/lib/utils.ts`. The theme lives in `src/css/_shadcn.css`; existing FIPU fonts, radii, and global styles are retained.

### UI components

[Reka UI](https://reka-ui.com/docs/overview/installation) is installed for accessible, unstyled Vue components. Import the components you need directly in `<script setup>`; no global registration or Vite plugin is required. Style them with the existing Tailwind utilities.

The shared button, select/listbox, combobox, checkbox/radio/switch, date picker, dropdown and dialog components use Reka primitives while retaining FIPU styling and their existing public model values. Date pickers display Croatian dates and emit ISO `YYYY-MM-DD` strings. Search text in comboboxes is committed only when an option is selected.

The Docker development frontend copies package manifests into its image. After dependency changes, rebuild it from the parent directory with `docker compose -p fipu-praksa-dev -f docker-compose.dev.yml up -d --build --no-deps frontend`; restarting alone does not update dependencies.

### Services :wrench:

1. [**Baserow Connector Service**](https://github.com/lukablaskovic/fipu-internship-services/tree/main/baserow-connector-service): Manages internship data on Baserow’s no-code database platform.
2. [**EmailJS Connector Service**](https://github.com/lukablaskovic/fipu-internship-services/tree/main/emailjs-connector-service): Handles email communications via the EmailJS platform.
3. [**PDF Connector Service**](https://github.com/lukablaskovic/fipu-internship-services/tree/main/pdf-connector-service): Generates internship certificates based on application form data.

These services are located in the Internship Application Services directory [(fipu-internship-services)](https://github.com/lukablaskovic/fipu-internship-services).

### Contributing & Feedback :mailbox:

Though this project is specially developed for FIPU and is not aimed for cloning or direct use, we warmly welcome feedback, insights, and perspectives for research and knowledge sharing purposes. Feel free to open an issue!

### License :balance_scale:

The FIPU Internship Frontend is intended for educational and research purposes and is not meant to be cloned for use. Nonetheless, the concepts and architecture are available publicly to be analyzed, learned from, and possibly inspire future innovations in BPMN model-based development and process management.

For detailed information, refer to the LICENSE file.

Note :bulb:
While the FIPU Internship Frontend is specific and not intended for cloning, related repositories, particularly the Python BPMN engine and specific connector services, are developed with a more generic approach and might be adaptable for other uses or inspire similar projects.
End Note: Remember to personalize the placeholder links with actual GitHub repository links. Furthermore, if there are additional sections like API documentation, development guide, or a roadmap, they can be added in the respective sections in the Readme. Let this serve as a foundation that can be built upon as the project evolves!

Made with ❤️ at [FIPUlab](https://web.fipulab.unipu.hr/)
