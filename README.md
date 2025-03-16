# FL-ALL Dashboard

FL-ALL Dashboard is a web application for visualizing client/global model performance data. The application is built using React for the frontend and FastAPI for the backend.

## Project Structure

The project is organized into two main directories: Back-End and Front-End.

![](https://github.com/Raiyan-S/GP_Dashboard/blob/main/Structure.png)

### Back-End

- **config/**: Contains configuration file for the database connection.
  - db.py: Handles the connection to the MongoDB database by loading the environment variables.
- **models/**: Contains data models used in the application.
  - TrainingRound.py: Defines the schema for training rounds.
- **routes/**: Contains route definition for the API.
  - route.py: Defines routes related to performance data.
- main.py: The main entry point for the FastAPI backend application.
- requirements.txt: Lists the Python dependencies for the backend.
- .env: MongoDB connection string private

### Front-End

- **components/**: Contains React components used in the application.
  - ClientOverview.jsx: Component for displaying client performance overview.
  - ClientSelector.jsx: Component to select a client and display the values accordingly.
  - DashboardStats.jsx: Component for displaying summary stats.
  - `clients/`: Contains components related to clients page.
- **hooks/**: Contains custom React hooks.
  - useTheme.js: Custom hook for managing theme settings.
  - usePerformanceData.js: Custom hook for fetching performance data for a selected client.
  - useClients.js: Custom hook for fetching unique client IDs.
- **services/**: Contains service module for API calls.
- **utils/**: Contains utility functions.
- App.jsx: The main React component that sets up the application.
- index.css: Compiles Tailwind CSS to build static files.
- main.jsx: The entry point for the React application.
- index.html: The main HTML file for the application.
- package.json: Lists the JavaScript dependencies and scripts for the frontend.
- postcss.config.js: Configuration for PostCSS because Tailwind CSS requires PostCSS to process its styles.
- tailwind.config.js: Configuration for Tailwind CSS.
- vite.config.js: Configuration for Vite, the build tool.
- Procfile: Defines the command to run the backend server.


## Setup Instructions

1. **Clone the repository (or use GitHub Desktop using the URL):**

    ```sh
    git clone https://github.com/Raiyan-S/GP_Dashboard.git
    ```

2. **Create a virtual environment and activate it:**
    Python ver 3.11
    ```sh
    python -m venv venv
    venv\Scripts\activate
    ```
    
    If powershell policy preventing scripts:
    ```sh
    ...\GP_Dashboard\venv\Scripts\Activate.ps1 cannot be        
    loaded because running scripts is disabled on this system.
    ```
    
    Run this code:
    ```sh
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```

3. **Install the required dependencies for backend (if missing):**

    ```sh
    cd Back-End
    pip install -r requirements.txt
    ```

4. **Run the backend server:**

    ```sh
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
5. **Open the Project in Your Browser:** Go to: http://localhost:8000/


#### Railway URL:
https://gpdashboard-production.up.railway.app/dashboard
