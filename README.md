# FL-ALL Dashboard

FL-ALL Dashboard is a web application for visualizing client performance data. The application is built using React for the frontend and FastAPI for the backend.

## Project Structure

The project is organized into two main directories: Back-End and Front-End.

### Back-End

- **config/**: Contains configuration file for the backend, such as database connection settings.
  - db.py: Handles the connection to the MongoDB database.
- **models/**: Contains data models used in the application.
  - TrainingRound.py: Defines the schema for training rounds.
- **routes/**: Contains route definition for the API.
  - performance.py: Defines routes related to performance data.
- main.py: The main entry point for the FastAPI backend application.
- Procfile: Defines the command to run the backend server.
- requirements.txt: Lists the Python dependencies for the backend.

### Front-End (no need to read)

- **assets/**: Contains static assets such as images.
- **components/**: Contains React components used in the application.
  - ClientOverview.jsx: Component for displaying client performance overview.
  - `clients/`: Contains components related to client management.
  - `common/`: Contains common reusable components.
- **data/**: Contains static data used in the application.
- **hooks/**: Contains custom React hooks.
  - useTheme.js: Custom hook for managing theme settings.
- **services/**: Contains service modules for API calls.
- **utils/**: Contains utility functions.
- App.jsx: The main React component that sets up the application.
- index.css: Global CSS file.
- main.jsx: The entry point for the React application.
- index.html: The main HTML file for the application.
- package.json: Lists the JavaScript dependencies and scripts for the frontend.
- postcss.config.js: Configuration for PostCSS.
- tailwind.config.js: Configuration for Tailwind CSS.
- vite.config.js: Configuration for Vite, the build tool.


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

4. **Install the required dependencies for backend (if missing):**

    ```sh
    cd Back-End
    pip install -r requirements.txt
    ```

5. **Run the backend server:**

    ```sh
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
6. **Open the Project in Your Browser:** Go to: http://localhost:8000/


#### Railway URL (will try and fix it asap):
https://gpdashboard-production.up.railway.app/

