# ReactJS_MERN
My first fullstack project

This repository contains the Task Board application for my course at SoftUni - ReactJS. The app allows logged-in users to create, view, and manage tasks. 


## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Import Data](#import-initial-data)
- [Run The Project](#run-the-project-locally)
- [Usage](#usage)
- [Scripts](#scripts)
- [Contributing](#contributing)

## Project Overview

The Task Board application is designed for companies and organizations to manage their tasks. Managers can create tasks, and when someone has the time to work on a specific task, they complete it and mark it as finished. Once a task is completed, the person who created it can view it in the archive of completed tasks.


## Features

- **User Authentication**: Secure login and registration for user-specific actions.
- **Task Management**: Users can create, view, claim, edit, and delete tasks.
- **Task Categories**: Tasks are categorized into taken, created, completed, and archived.
- **User-Specific Views**: Logged-in users can see and manage their own tasks.
- **Responsive Design**: The application is optimized for use on a variety of devices, including desktops, tablets, and mobile phones.


## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Libraries/Frameworks**: Redux Toolkit, React Router, Axios
- **Styling**: SCSS


## Getting Started

To set up and run the project locally, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/mariaPencheva/ReactJS_MERN.git
   cd ReactJS_MERN
   ```

2. **Install the dependencies for the backend:**

   ```sh
   cd server
   npm install
   ```

3. **Install the dependencies for the frontend:**

   ```sh
   cd ../client
   npm install   
   ```

4. **Install the additional dependencies**

    ```sh
   cd ..
   npm install   
   ```


## Import Initial Data

1. **Connect to MongoDB:**

   - Open MongoDB Compass and connect to your MongoDB server using the connection URI, typically `mongodb://localhost:27017`.

2. **Navigate to the data directory:**

   ```sh
   cd ../data
   ```

3. **Run the script to initialize the database:**

   ```sh
   node initData.js
   ```

## Run the project locally   

1. **Start the development server and client simultaneously using `concurrently`:**

   ```sh
   cd ../
   npm run dev
   ```


## Usage

1. **Register/Login**: Create an account or log in with your existing credentials.
2. **Create Tasks**: Use the interface to add new tasks to your board.
3. **Claim Tasks**: Claim tasks to take ownership and manage them.
4. **Manage Tasks**: Edit, delete, or mark tasks as completed.


## Scripts

- **npm run client**: Starts the client application
- **npm run server**: Starts the server application with nodemon
- **npm run dev**: Starts both the client and server simultaneously using concurrently


## Contributing

Feel free to contribute to this project by submitting a pull request. Please ensure that your changes are well-tested and documented. For larger changes, consider opening an issue to discuss the proposed modifications before making them.

Enjoy using Task Board to organize and collaborate on tasks efficiently!