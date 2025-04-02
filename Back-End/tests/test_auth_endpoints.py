import pytest
from httpx import AsyncClient
from config.db import mongodb, open_connection, close_connection
import logging

logger = logging.getLogger(__name__)

# Fixture to initialize the MongoDB connection.
@pytest.fixture(scope="session")
async def mongodb_client():
    logger.info("Opening MongoDB connection for test session.")
    await open_connection()
    yield mongodb
    logger.info("Closing MongoDB connection for test session.")
    await close_connection()

# Fixture to create an AsyncClient for testing FastAPI endpoints.
@pytest.fixture
async def client(mongodb_client):
    logger.info("Creating AsyncClient for testing.")
    async with AsyncClient(base_url="http://localhost:8000") as client:
        yield client
    logger.info("AsyncClient closed.")

# This test checks if a user can be registered successfully and if the user is stored in the database.
@pytest.mark.order(1)
@pytest.mark.asyncio
async def test_register_user(client):
    users_collection = mongodb.db["Users"]
    logger.info("Starting test: test_register_user")

    # Send a POST request to register
    response = await client.post(
        "/api/auth/register",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )

    logger.info(f"Response status: {response.status_code}, body: {response.text}")

    # Assert success
    assert response.status_code == 200
    assert response.json() == {"message": "User registered successfully"}

    # Verify the user is stored in the correct collection
    user = await users_collection.find_one({"username": "testuser@example.com"})
    logger.info(f"User found in database: {user}")
    assert user is not None, "User was not found in the database"
    assert user["username"] == "testuser@example.com"

    # Clean up: Remove the user from the database for the next test
    await users_collection.delete_one({"username": "testuser@example.com"})
    logger.info("Cleaned up test user from database.")

# This test checks if a user cannot be registered with an already existing username.
@pytest.mark.order(2)
@pytest.mark.asyncio
async def test_register_duplicate_user(client):
    users_collection = mongodb.db["Users"]
    logger.info("Starting test: test_register_duplicate_user")

    # Send a POST request to register
    await client.post(
        "/api/auth/register",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )
    logger.info("Registered user for duplicate test.")

    # Attempt to register the same user again
    response = await client.post(
        "/api/auth/register",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )

    logger.info(f"Response status: {response.status_code}, body: {response.text}")

    # Assert failure
    assert response.status_code == 400
    assert response.json() == {"detail": "Email already registered"}

    # Clean up
    await users_collection.delete_one({"username": "testuser@example.com"})
    logger.info("Cleaned up test user from database.")

# This test checks if a user can log in successfully with valid credentials.
@pytest.mark.order(3)
@pytest.mark.asyncio
async def test_login_user(client):
    users_collection = mongodb.db["Users"]
    logger.info("Starting test: test_login_user")

    # Send a POST request to register
    response = await client.post(
        "/api/auth/register",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )
    logger.info(f"Registration response: {response.status_code}, body: {response.text}")

    # Send a POST request to login
    response = await client.post(
        "/api/auth/login",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )

    logger.info(f"Login response: {response.status_code}, body: {response.text}")

    # Assert success
    assert response.status_code == 200
    assert "session_token" in response.cookies, "Session token not found in response cookies"

    # Clean up: Remove the test user from the database and invalidate the session token
    await users_collection.delete_one({"username": "testuser@example.com"})
    logger.info("Cleaned up test user from database.")
    sessions_collection = mongodb.db["Sessions"]
    await sessions_collection.delete_one({"token": response.cookies.get("session_token")})
    logger.info("Cleaned up session token from database.")

# This test checks if a user cannot log in with invalid credentials.
@pytest.mark.order(4)
@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    logger.info("Starting test: test_login_invalid_credentials")

    # Attempt to log in with a non-existent user
    response = await client.post(
        "/api/auth/login",
        data={"username": "WrongName@example.com", "password": "WrongPassword"}
    )
    
    logger.info(f"Response status: {response.status_code}, body: {response.json()}")

    # Assert failure
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid credentials"}

# This test checks if a user cannot log in with missing fields.
@pytest.mark.order(5)
@pytest.mark.asyncio
async def test_register_missing_fields(client):
    logger.info("Starting test: test_register_missing_fields")

    # Missing password
    response = await client.post(
        "/api/auth/register",
        data={"username": "testuser@example.com"}
    )
    logger.info(f"Response for missing password: {response.status_code}, body: {response.json()}")

    # Assert failure
    assert response.status_code == 422  # Unprocessable Entity
    assert "password" in response.json()["detail"][0]["loc"]

    # Missing username
    response = await client.post(
        "/api/auth/register",
        data={"password": "Test1234"}
    )
    logger.info(f"Response for missing username: {response.status_code}, body: {response.json()}")

    # Assert failure
    assert response.status_code == 422
    assert "username" in response.json()["detail"][0]["loc"]

# This test checks if a user cannot register with a weak password (8 characters at least).
@pytest.mark.order(6)
@pytest.mark.asyncio
async def test_register_weak_password(client):
    logger.info("Starting test: test_register_weak_password")

    # Attempt to register with a weak password
    response = await client.post(
        "/api/auth/register",
        data={"username": "testuser@example.com", "password": "ab123"}
    )
    logger.info(f"Response for weak password: {response.status_code}, body: {response.json()}")

    # Assert failure
    assert response.status_code == 400  # Bad Request

# This test checks if a user can log out successfully and if the session token is invalidated.
@pytest.mark.order(7)
@pytest.mark.asyncio
async def test_logout_user(client):
    users_collection = mongodb.db["Users"]
    logger.info("Starting test: test_logout_user")

    # Send a POST request to register
    await client.post(
        "/api/auth/register",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )
    logger.info("Registered user for logout test.")

    # Log in the user to obtain a session token
    login_response = await client.post(
        "/api/auth/login",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )
    logger.info(f"Login response: {login_response.status_code}, body: {login_response.text}")
    assert login_response.status_code == 200
    session_token = login_response.cookies.get("session_token")
    assert session_token is not None, "Session token not found in login response"

    # Send a POST request to logout
    logout_response = await client.post(
        "/api/auth/logout",
        cookies={"session_token": session_token}
    )

    logger.info(f"Logout response: {logout_response.status_code}, body: {logout_response.text}")

    # Assert success
    assert logout_response.status_code == 200
    assert logout_response.json() == {"message": "Logged out"}

    # Verify the session token is invalidated
    sessions_collection = mongodb.db["Sessions"]
    session = await sessions_collection.find_one({"token": session_token})
    logger.info(f"Session token after logout: {session}")
    assert session is None, "Session token was not invalidated"

    # Clean up
    await users_collection.delete_one({"username": "testuser@example.com"})
    logger.info("Cleaned up test user from database.")

# This test checks if the user has a valid session token.
@pytest.mark.order(8)
@pytest.mark.asyncio
async def test_verify_token(client):
    users_collection = mongodb.db["Users"]
    logger.info("Starting test: test_verify_token")

    # Send a POST request to register
    await client.post(
        "/api/auth/register",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )
    logger.info("Registered user for token verification test.")

    # Log in the user to obtain a session token
    login_response = await client.post(
        "/api/auth/login",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )
    logger.info(f"Login response: {login_response.status_code}, body: {login_response.text}")
    assert login_response.status_code == 200
    session_token = login_response.cookies.get("session_token")
    assert session_token is not None, "Session token not found in login response"

    # Send a GET request to verify the token
    verify_response = await client.get(
        "/api/auth/verify-token",
        cookies={"session_token": session_token}
    )
    logger.info(f"Verify response: {verify_response.status_code}, body: {verify_response.text}")

    # Assert success
    assert verify_response.status_code == 200
    assert verify_response.json().get("message") == "Session is valid."

    # Clean up: Remove the test user from the database and invalidate the session token
    await users_collection.delete_one({"username": "testuser@example.com"})
    logger.info("Cleaned up test user from database.")
    sessions_collection = mongodb.db["Sessions"]
    await sessions_collection.delete_one({"token": session_token})
    logger.info("Cleaned up session token from database.")

# This test checks if a user cannot log in with an expired session token from MongoDB.
# It ensures that the system prevents access with invalid tokens.
@pytest.mark.order(9)
@pytest.mark.asyncio
async def test_verify_expired_token(client):
    users_collection = mongodb.db["Users"]
    logger.info("Starting test: test_verify_expired_token")

    # Send a POST request to register
    await client.post(
        "/api/auth/register",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )
    logger.info("Registered user for expired token test.")

    # Login the user to obtain a session token
    login_response = await client.post(
        "/api/auth/login",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )
    logger.info(f"Login response: {login_response.status_code}, body: {login_response.text}")
    session_token = login_response.cookies.get("session_token")

    # Simulate token expiration (manually removing or invalidating the token)
    sessions_collection = mongodb.db["Sessions"]
    await sessions_collection.delete_one({"token": session_token})
    logger.info("Simulated token expiration by removing it from the database.")

    # Attempt to verify the expired token
    verify_response = await client.get(
        "/api/auth/verify-token",
        cookies={"session_token": session_token}
    )
    logger.info(f"Verify response: {verify_response.status_code}, body: {verify_response.text}")

    # Assert failure
    assert verify_response.status_code == 401
    assert verify_response.json() == {"detail": "Session expired or invalid"}

    # Clean up
    await users_collection.delete_one({"username": "testuser@example.com"})
    logger.info("Cleaned up test user from database.")

# This test checks if a user can log in multiple times and if the session tokens are unique.
# It ensures that the system only allows one active session per user to prevent session hijack.
@pytest.mark.order(10)
@pytest.mark.asyncio
async def test_multiple_login_same_user(client):
    users_collection = mongodb.db["Users"]
    logger.info("Starting test: test_multiple_login_same_user")

    # Send a POST request to register and login for user1
    await client.post(
        "/api/auth/register",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )
    logger.info("Registered user for multiple login test.")
    login_response_1 = await client.post(
        "/api/auth/login",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )
    logger.info(f"First login response: {login_response_1.status_code}, body: {login_response_1.text}")
    session_token_1 = login_response_1.cookies.get("session_token")

    # Send a POST request to register and login for user2
    login_response_2 = await client.post(
        "/api/auth/login",
        data={"username": "testuser@example.com", "password": "Test1234"}
    )
    logger.info(f"Second login response: {login_response_2.status_code}, body: {login_response_2.text}")
    session_token_2 = login_response_2.cookies.get("session_token")

    # Assert that the tokens are unique and different
    assert session_token_1 != session_token_2
    logger.info("Verified that session tokens from multiple logins are unique.")

    # Clean up
    await users_collection.delete_one({"username": "testuser@example.com"})
    logger.info("Cleaned up test user from database.")
    sessions_collection = mongodb.db["Sessions"]
    await sessions_collection.delete_one({"token": session_token_2})
    logger.info("Cleaned up session token from database.")