# Tech Stack Overview: GrandPilatus

## 1. Frontend (Client)
The user interface is built as a Single Page Application (SPA), emphasizing luxury design and responsiveness.

*   **Framework:** **Angular 19**
    *   One of the most modern and robust web frameworks available.
    *   Used for: Structure (Components), Logic (Services), Routing, and State Management.
*   **UI Library:** **Angular Material 19**
    *   Google's official Material Design component library.
    *   Used for: Pre-built, accessible components like Cards, Tables (`MatTable`), Dialogs (`MatDialog`), Inputs, and Buttons.
*   **Visualization:** **Chart.js** & **ng2-charts**
    *   Used for: The Dashboard charts (Pie Chart for Status, Bar Chart for KPIs).
*   **Security (Frontend):** **jwt-decode**
    *   Used for: Decoding the JSON Web Token (JWT) received from the backend to read user details (like expiration or user ID) without making a request.
*   **Styles:** **SCSS** (Sass)
    *   Used for: Advanced CSS features like variables, nesting, and mixins to create the "Luxury Gold" theme.

## 2. Backend (Server)
The backend is a RESTful API that handles data, logic, and security.

*   **Runtime Environment:** **Node.js** with **Typescript**
    *   Allows using the same language (TypeScript) on both client and server for type safety.
*   **Web Framework:** **Express 5**
    *   The latest version of the most popular Node.js web server.
    *   Used for: Handling HTTP requests (GET, POST, DELETE), Routing, and Middleware.
*   **Database:** **MongoDB** with **Mongoose**
    *   A NoSQL database that is flexible and scalable.
    *   **Mongoose**: An Object Data Modeling (ODM) library that provides a schema-based solution to model application data (e.g., ensuring a Campaign always has a name).
*   **Validation:** **Zod**
    *   A TypeScript-first schema declaration and validation library.
    *   Used for: Checking data *before* it reaches the database. If you send "age: 'hello'", Zod will throw an error because it expects a number.
*   **Encryption & Auth:**
    *   **bcrypt**: Used to securely hash passwords. We never save plain text passwords.
    *   **jsonwebtoken (JWT)**: Used to generate "access tokens". When you login, you get a token. This token acts as your "passport" for future requests.
*   **Documentation:** **Swagger (OpenAPI)**
    *   Used for: Automatically generating API documentation so developers can see available endpoints (e.g., `/api-docs`).

## 3. Testing & Quality
*   **Jest & Supertest**: Used for backend testing (checking if the API returns the correct data).
*   **Karma & Jasmine**: Used for frontend unit testing.
*   **ESLint & Prettier**: Ensures code quality and consistent formatting.

## Summary: How it works together
1.  **User** fills out a form (Angular).
2.  **Angular** sends data to **Express** (Backend).
3.  **Express** uses **Zod** to validate the data.
4.  If valid, **Mongoose** saves it to **MongoDB**.
5.  **Express** sends a response back to **Angular**.
6.  **Angular** updates the UI (e.g., adding a row to the **Angular Material** table).
