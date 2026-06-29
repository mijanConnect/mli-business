# Norlan Dashboard (Business API)

This project is the Business Dashboard for the MLITech ecosystem, built using React, Vite, Redux Toolkit, and Tailwind CSS. It includes additional capabilities tailored for business operations such as mapping, Firebase integration, and QR code reading.

## 🚀 Technologies Used
- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **State Management:** Redux Toolkit & React-Redux
- **Styling:** Tailwind CSS, Ant Design (antd)
- **Routing:** React Router DOM
- **Maps & Location:** Leaflet, React-Leaflet, @react-google-maps/api
- **Charts & Data:** Chart.js, Recharts
- **Authentication/Integrations:** Firebase, @react-oauth/google
- **Internationalization:** i18next, react-i18next
- **Utilities:** Socket.io-client, SweetAlert2, html5-qrcode, jsPDF, moment

## 📂 Project Structure

```
miltech-business-dashboard-API/
├── public/                 # Static assets that don't need compilation
├── src/                    # Main source code
│   ├── assets/             # Images, fonts, and global stylesheets
│   ├── components/         # Reusable UI components
│   ├── config/             # Configuration files (e.g., Firebase config, constants)
│   ├── Layout/             # Page layout wrappers (e.g., Sidebar, Navbar)
│   ├── Pages/              # Application views/pages
│   ├── provider/           # Context providers or theme providers
│   ├── redux/              # Redux slices, store setup, and RTK Query APIs
│   ├── routes/             # Route definitions and guarding logic
│   ├── sw/                 # Service workers logic
│   ├── Translation/        # i18n locale files and configuration
│   ├── utils/              # Helper functions (token services, formatting, etc.)
│   ├── vite/               # Vite specific utilities or plugins
│   ├── App.jsx             # Main App component mapping routes
│   ├── index.css           # Global CSS (Tailwind imports)
│   ├── main.jsx            # Application entry point
│   └── NotFound.jsx        # Fallback 404 page
├── .env.example            # Example environment variables
├── package.json            # Project metadata and dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration
```

## 🛠️ Project Setup

Follow these steps to set up the project locally:

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**

### 2. Installation
Navigate into the directory and install dependencies:
```bash
# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```
Fill in the necessary variables inside `.env` (like API base URLs, Firebase keys, Google Maps API key, etc.).

### 4. Running the Development Server
Start the local development server:
```bash
npm run dev
```
The application will typically be available at `http://localhost:5173/`.

### 5. Building for Production
To build the application for production, run:
```bash
npm run build
```
The optimized production build will be generated in the `dist/` directory.

### 6. Linting & Formatting
To run ESLint and check for code issues:
```bash
npm run lint
```
