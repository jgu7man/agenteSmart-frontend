# 🖥️ AgenteSmart Frontend — No-Code Dialogflow Dashboard

[![Angular](https://img.shields.io/badge/Angular-PWA%20Dashboard-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase Hosting](https://img.shields.io/badge/Deploy-Firebase%20Hosting-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

An intuitive **Angular Single Page Application & PWA** designed to give non-technical users a visual, No-Code interface to supervise, configure, and train **Google Dialogflow** conversational agents.

Part of the **AgenteSmart Full-Stack Suite**:
- 🖥️ [**`agenteSmart-frontend`**](https://github.com/jgu7man/agenteSmart-frontend) (Visual Angular Dashboard)
- ⚙️ [**`agenteSmart-backend`**](https://github.com/jgu7man/agenteSmart-backend) (Firebase Cloud Functions & Firestore API)
- ⚡ [**`agentesmart-ws`**](https://github.com/jgu7man/agentesmart-ws) (Real-Time WebSockets WhatsApp Bridge)

---

## 🏗️ Full-Stack Suite Topology

```mermaid
flowchart LR
    User["👔 Business User / Operator"] --> Front["🖥️ agenteSmart-frontend<br/>(Visual Angular Dashboard)"]
    Front <--> Back["⚙️ agenteSmart-backend<br/>(Firebase Cloud Functions & Firestore)"]
    Back <--> Dialogflow["🤖 Google Dialogflow v2 API"]
    Back <--> WS["⚡ agentesmart-ws<br/>(Real-Time WebSockets Server)"]
    WS <--> WhatsApp["📱 WhatsApp Messaging Client"]
```

---

## ✨ Key Features

- 🎨 **Visual Intent & Entity Management:** Allows operators to review and edit conversational intents without opening the Google Cloud console.
- 💬 **Live Conversation Inspector:** Real-time visibility into active user chats and intent matching logs.
- 📱 **Progressive Web App (PWA):** Built with `@angular/pwa` and Service Workers for mobile-friendly operational access.
- 🔐 **Role-Based Authentication:** Integrated with Firebase Authentication and Firestore security rules.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run local development server
npm start
# Open http://localhost:4200
```

---

## 📄 License
Distributed under the [MIT License](LICENSE). Created by [Jorge Guzmán (@jgu7man)](https://github.com/jgu7man).
