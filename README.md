# TaskSprint - Project Management System

TaskSprint is a production-ready, Trello-like project management system designed with scalability and performance in mind. Featuring real-time collaboration, drag-and-drop boards, and full RESTful backend, it's accessible via both Web and Mobile interfaces.

## 🚀 Features

- **Real-time Synchronization**: Powered by Socket.io, see your team's changes instantly.
- **Drag-and-Drop Kanban**: Intuitive list and card movement powered by `@dnd-kit`.
- **Comprehensive Structure**: Workspaces > Boards > Lists > Cards format.
- **Card Modals**: Add descriptions, due dates, labels, check-lists and real-time comments.
- **Authentication**: Secure JWT-based auth via bcrypt and Express.
- **File Uploads**: Cloudinary integration via Multer for document attachments.
- **Multi-Platform**:
  - React (Vite) Frontend with Tailwind V4 styling.
  - React Native (Expo) Mobile application for Android/iOS.
  - Node.js (Express) robust Backend with MongoDB Atlas.

## 📁 Architecture / Folder Structure

```
├── server/               # Node.js/Express Backend
│   ├── src/models/      # Mongoose Schemas
│   ├── src/controllers/ # Business Logic
│   ├── src/routes/      # API Endpoints
│   └── src/socket/      # WebSockets config
├── client/               # React (Vite) Web App
│   ├── src/components/  # Reusable UI & Layouts
│   ├── src/pages/       # App views
│   ├── src/services/    # Axios API integration
│   └── src/context/     # Auth & Socket Context
└── mobile/               # React Native (Expo) App
    ├── src/screens/     # Mobile device views
    ├── src/navigation/  # React Navigation
    └── src/api/         # Mobile Axios integrations
```

## 🛠️ Local Development Setup

### Dependencies
Ensure you have Node.js (v18+) and npm installed.

```bash
# Clone the repository
git clone <your-repo-url>
cd project_management_system

# Install dependencies concurrently for server & web client
npm run install-all

# NOTE: For the mobile app, you must install dependencies separately
cd mobile && npm install
```

### Environment Variables
1. Navigate to the `server/` directory.
2. Duplicate `.env.example` and rename to `.env`.
3. Fill in your MongoDB URI, JWT Secret, and Cloudinary keys:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongo_database_url
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```
(Be sure to update `mobile/api/client.js` with your active backend IP address if deploying locally to physical devices).

### Running the App Locally

To start the Web full-stack (Backend + Frontend Client) simultaneously:
```bash
npm run dev
```

To run the Mobile Application (in a separate terminal):
```bash
cd mobile
npx expo start
```
*Follow the terminal instructions to run on Android Emulator, iOS Simulator, or via Expo Go on physical device.*

---

## 🌍 Deployment

### 1. Backend (Render / Railway)
A `render.yaml` configuration is provided in the root directory. Follow Render's Blueprint deployment process, point it to your repostiory, and add your Environment Variables directly via the Render Dashboard.

### 2. Frontend Web App (Vercel)
The web client can easily be deployed utilizing the platform's automatic defaults:
- Link the repository on Vercel.
- Select the `client` directory as the deployment root.
- The root `vercel.json` provides standard fallback routing configuration.
- Set the `VITE_API_URL` to your production backend URL.

### 3. Mobile Native App (Expo / EAS)
To build Standalone apps for App Store / Play Store utilizing Expo Application Services (EAS):
```bash
cd mobile
npm install -g eas-cli
eas login
eas build:configure
eas build --profile production --platform all
```
*Further details: [Expo EAS Build Documentation](https://docs.expo.dev/build/setup/)*
