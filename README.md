## FIPU Internship Dashboard :mortar_board: :chart_with_upwards_trend:
### About :memo:
A Vue3-driven dashboard dedicated to streamlining and visualizing the student internship process at the Faculty of Informatics in Pula (FIPU) via an experimental BPMN model-based development and various integrated microservices.

### Table of Contents :book:
- [Introduction](#introduction-seedling)
- Features
- Architecture
- Services
- Setup & Installation
- Usage
- Contributing & Feedback
- License

### Introduction :seedling:
The FIPU Internship Dashboard is crafted to smoothen and illuminate the internship journey for administrators and students by utilizing the BPMN model-based development and various supportive services. Though initially designed for FIPU’s specific use, the exploratory and research-oriented nature of this project allows its principles and architectures to potentially innovate and reshape various processes in the future.

### Features :sparkles:
For Admins (Professors | Internship Managers):
- **Interactive BPMN Graph**: A comprehensive visualization of each student’s internship process.
- **Actionable Insights**: Allocation of student preferences, acceptance/declination of companies and exercises, email management, and more.
- **Communication Hub**: Built-in messaging system for easy communication with students.
- **Event Management**: View and manage events through a unified interface.

For Students:
- **Dynamic UI**: A user interface that adapts based on the current task in the BPMN diagram.
- **Internship Journey**: View available assignments, select preferences, communicate with professors, and manage application forms and diaries.

For Companies:
- **Public Interface**: Submit new assignments and evaluate students’ performance through simple online forms.

### Architecture :construction:
- **Frontend**: Vue3
- **BPMN Display**: Utilizing bpmn.io and developed in Camunda Modeler.
- **Backend Engine**: Custom-built Python BPMN Engine (link placeholder).

### Services :wrench:
1. [**Baserow Connector Service**](https://github.com/lukablaskovic/internship-application-services/tree/main/baserow-connector-service): Manages internship data on Baserow’s no-code database platform.
2. [**Sendgrid Connector Service**](https://github.com/lukablaskovic/internship-application-services/tree/main/sendgrid-connector-service): Handles email communications via the Sendgrid platform.
3. [**PDF Connector Service**](https://github.com/lukablaskovic/internship-application-services/tree/main/pdf-connector-service): Generates internship certificates based on application form data.
These services are located in the Internship Application Services directory (link placeholder).

Additional services like [**fipu-internship-gateway-api**](https://github.com/lukablaskovic/fipu-internship-gateway-api) are utilized for user authentication, messaging system management, and more.

### Usage :rocket:
Detailed guides for administrators, students, and companies on how to navigate and utilize the platform can be found in the Usage Guide.

### Contributing & Feedback :mailbox:
Though this project is specially developed for FIPU and is not aimed for cloning or direct use, we warmly welcome feedback, insights, and perspectives for research and knowledge sharing purposes. Feel free to open an issue or submit a PR!

### License :balance_scale:
The FIPU Internship Dashboard is intended for educational and research purposes and is not meant to be cloned for use. Nonetheless, the concepts and architecture are available publicly to be analyzed, learned from, and possibly inspire future innovations in BPMN model-based development and process management.

For detailed information, refer to the LICENSE file.

Note :bulb:
While the FIPU Internship Dashboard is specific and not intended for cloning, related repositories, particularly the Python BPMN engine and specific connector services, are developed with a more generic approach and might be adaptable for other uses or inspire similar projects.
End Note: Remember to personalize the placeholder links with actual GitHub repository links. Furthermore, if there are additional sections like API documentation, development guide, or a roadmap, they can be added in the respective sections in the Readme. Let this serve as a foundation that can be built upon as the project evolves!
