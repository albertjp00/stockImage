# Stock Image Application

A full-stack web application that allows users to upload, manage, and reorder stock images through a simple and interactive interface. The application provides drag-and-drop functionality for image ordering and supports image uploads with a structured backend API.

---

## Features

* Upload stock images
* Display images in a gallery layout
* Drag-and-drop image reordering
* Edit and delete images
* Backend API for image management
* Persistent storage for uploaded images
* Responsive UI

---

## Tech Stack

### Frontend

* React
* TypeScript
* Axios
* Drag & Drop library (`@hello-pangea/dnd`)
* CSS

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Multer (file upload handling)

### Deployment

* Frontend: AWS Amplify
* Backend: AWS EC2
* Process Manager: PM2

---

# Project Structure

```
stock-image-app
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── index.ts
│   │
│   ├── dist
│   └── package.json
```

---

# Local Setup Instructions

## 1. Clone the Repository

```
git clone https://github.com/your-username/stock-image-app.git
cd stock-image-app
```

---

# Backend Setup

### 1. Navigate to backend

```
cd backend
```

### 2. Install dependencies

```
npm install
```

### 3. Create environment file

Create a `.env` file in the backend folder.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 4. Run in development mode

```
npm run dev
```

### 5. Build the project

```
npm run build
```

### 6. Start production server

```
npm start
```

---

# Frontend Setup

### 1. Navigate to frontend

```
cd frontend
```

### 2. Install dependencies

```
npm install
```

### 3. Configure API URL

Update the API base URL in your frontend service file.

Example:

```
http://localhost:5000
```

### 4. Run the application

```
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

# Running with PM2 (Production)

Build backend:

```
npm run build
```

Start server with PM2:

```
pm2 start dist/index.js --name backend
```

Save PM2 configuration:

```
pm2 save
```

---



---

# API Endpoints (Example)

### Get Images

```
GET /images
```

### Upload Image

```
POST /images
```

### Update Image Order

```
PATCH /images/order
```

### Delete Image

```
DELETE /images/:id
```

---



# Author

Albert Paul

---

