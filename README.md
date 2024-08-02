# ReactJS_MERN
My first fullstack project

This repository will contain the Task Board application for my course at SoftUni - ReactJS.

## Installation and Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/ReactJS_MERN.git
    cd ReactJS_MERN
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Start the development server and client simultaneously using `concurrently`:

    ```sh
    npm run dev
    ```

## Importing Initial Data
### Using MongoDB Compass

1. **Download and Install MongoDB Compass:**
   - If you don't have MongoDB Compass, download it from [here](https://www.mongodb.com/try/download/compass) and install it on your computer.

2. **Connect to MongoDB:**
   - Open MongoDB Compass and connect to your MongoDB server using the connection URI, typically `mongodb://localhost:27017`.

3. **Create or Select Database:**
   - If the `DB-TEST-TaskBoard` database does not exist, create it by clicking on **Create Database**.
   - Enter the database name `DB-TEST-TaskBoard` and the first collection name (e.g., `tasks`), then click **Create Database**.

4. **Import Data:**
   - **Import `tasks`:**
     - Select the `tasks` collection within the `DB-TEST-TaskBoard` database.
     - Click on **Add Data** and then **Import File**.
     - Choose the `tasks.json` file from your local directory and ensure the format is set to JSON Array.
     - Click **Import** to load the data.

   - **Import `users`:**
     - If the `users` collection does not exist, create it by clicking on **Create Collection** and entering the name `users`.
     - Select the `users` collection and click on **Add Data** and then **Import File**.
     - Choose the `users.json` file and ensure the format is set to JSON Array.
     - Click **Import** to load the data.

