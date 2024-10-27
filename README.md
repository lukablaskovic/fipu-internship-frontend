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
- **BPMN Display**: Utilizing [bpmn.io](https://bpmn.io/) and modeled in [Camunda Modeler](https://camunda.com/).
- **Backend Engine**: Custom-built [Python BPMN Engine](https://github.com/lukablaskovic/python-bpmn-engine) (originally developed by [ntankovic](https://github.com/ntankovic/python-bpmn-engine)).

### Services :wrench:

1. [**Baserow Connector Service**](https://github.com/lukablaskovic/internship-application-services/tree/main/baserow-connector-service): Manages internship data on Baserow’s no-code database platform.
2. [**Sendgrid Connector Service**](https://github.com/lukablaskovic/internship-application-services/tree/main/sendgrid-connector-service): Handles email communications via the Sendgrid platform.
3. [**PDF Connector Service**](https://github.com/lukablaskovic/internship-application-services/tree/main/pdf-connector-service): Generates internship certificates based on application form data.

These services are located in the Internship Application Services directory [(internship-application-services)](https://github.com/lukablaskovic/internship-application-services).

### Contributing & Feedback :mailbox:

Though this project is specially developed for FIPU and is not aimed for cloning or direct use, we warmly welcome feedback, insights, and perspectives for research and knowledge sharing purposes. Feel free to open an issue!

### License :balance_scale:

The FIPU Internship Frontend is intended for educational and research purposes and is not meant to be cloned for use. Nonetheless, the concepts and architecture are available publicly to be analyzed, learned from, and possibly inspire future innovations in BPMN model-based development and process management.

For detailed information, refer to the LICENSE file.

Note :bulb:
While the FIPU Internship Frontend is specific and not intended for cloning, related repositories, particularly the Python BPMN engine and specific connector services, are developed with a more generic approach and might be adaptable for other uses or inspire similar projects.
End Note: Remember to personalize the placeholder links with actual GitHub repository links. Furthermore, if there are additional sections like API documentation, development guide, or a roadmap, they can be added in the respective sections in the Readme. Let this serve as a foundation that can be built upon as the project evolves!

Made with ❤️ at [FIPUlab](https://web.fipulab.unipu.hr/)
