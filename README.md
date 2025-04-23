# FL-ALL Dashboard

FL-ALL Dashboard is a web application for visualizing client/global model performance data. The application is built using React for the frontend and FastAPI for the backend.

## Project Structure

The project is organized into two main directories: Back-End and Front-End.

### Back-End
The backend is built with FastAPI and interacts with a MongoDB database. It provides API endpoints for user authentication, data management (training rounds), and model predictions, including rate limiting to prevent abuse.

- **Key Files**:
    - `main.py`: Entry point for the FastAPI application; initializes middleware (including rate limiting), routes, database connection, and serves the frontend for deployment.
    - `rateLimiter.py`: Configures rate limiting rules.
    -   `.env`:  Contains environment variables required for local development, such as the MongoDB connection string (`MONGO_PUBLIC_URL`) and database name (`DB_NAME`). This file is not included in the repository for security reasons.
- **Directories**:
    - **`config/`**:
        - `db.py`: Handles MongoDB connection setup, opening, and closing using environment variables.
    - **`models/`**:
        - `TrainingRound.py`: Defines the Pydantic model for validating the structure of training round data stored in MongoDB.
    - **`routes/`**: Defines API endpoints:
        - `route.py`: Endpoints for fetching and posting training round data (admin-only for fetching all/specific rounds, posting requires API key). Includes endpoints for unique client IDs and best global model F1 score.
        - `auth.py`: Endpoints for user registration, login (using secure HTTP-only session cookies), logout, and session verification. Enforces role-based access control.
        - `predict.py`: Endpoint (`/predict`) for handling image uploads, processing them with a model loaded from GridFS, and returning classification results. Protected by rate limiting.
    - **`tests/`**: Contains integration and end-to-end tests using Playwright and Pytest for authentication and core functionalities.

### Front-End
The frontend is built with React and serves as the user interface for the FL-ALL Dashboard. It handles user interaction, data visualization, authentication, and communication with the backend API.

- **Key Files**:
    - `main.jsx`: The application entry point, setting up routing, authentication context, and page metadata providers.
    - `App.jsx`: The main component defining routes, layout (Sidebar, Header), and managing role-based access control.
- **Directories**:
    - **`components/`**: Contains UI components organized by feature:
        - `auth/`: Manages login, registration, session validation, and protected routes. Includes `AuthContext` for global state.
        - `dashboard/`: Components for displaying global and client performance metrics, charts, and summaries.
        - `modeltrial/`: Components for the image upload and classification feature. Includes `PredictionResult` and `PredictionHistory`.
        - `layout/`: Contains reusable layout components like `Sidebar` and `Header`.
        - `common/`: Shared components like `ClientSelector` and `Table`.
    - **`hooks/`**: Custom React hooks for reusable logic like fetching client IDs (`useClients`), fetching performance data (`usePerformanceData`), and managing themes (`useTheme`).
    - **`services/`**: Contains the `api.js` module, which centralizes all backend API call functions (e.g., authentication, data fetching, prediction).

**root**
- Contains configuration files (`tailwind.config.js`, `vite.config.js`, etc.), `package.json` for dependencies, and the main `index.html`.


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
https://gpdashboard-production.up.railway.app/
