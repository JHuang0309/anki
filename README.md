# (anki) Flashcard Maker

**Flashcard Maker** is a full-stack web application that allows users to create, manage, and review flashcards. It is built using React for the frontend and Express for the backend. The application offers a simple and intuitive interface, supporting responsive design with Tailwind CSS.

## Features
- Create and manage flashcards.
- Review flashcards with a simple interface.
- Responsive design optimized for both desktop and mobile.
- Backend API built with Express and Node.js.
- Data initially stored in a JSON file, with plans to migrate to a hosted database for scalability.

## Technologies Used
- **Frontend**: React, Tailwind CSS
- **Backend**: Express, Node.js
- **Deployment**: Render for hosting (still in progress)
- **State Management**: React hooks

## Running the Project Locally

To run the **Flashcard Maker** project locally on your machine, follow these steps:

### Prerequisites
- **Node.js**: Ensure that you have Node.js installed. You can download it from [here](https://nodejs.org/).

### Steps
1. **Clone the repository**

   First, clone the repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/flashcard-maker.git
   cd flashcard-maker
   ```
   
2. **Install dependencies**

   Navigate to the project directory and install both frontend and backend dependencies:

   For the **frontend** (React app):
   
   ```bash
   cd frontend
   npm install
   ```
   For the **backend** (Express server):
   ```bash
   cd frontend
   npm install
   ```

3. **Set up the backend**

   In the backend folder, you can run the Express server locally by executing:
   ```bash
   npm install
   ```
4. **Set up the frontend**

   In the backend folder, you can run the Express server locally by executing:

   ```bash
   cd ../frontend
   npm start
   ```
5. **Open your browser**

   Go to http://localhost:5173 to view the app in action. The frontend will be connected to the backend server running on   http://localhost:5005.
