import pytest
import asyncio
from playwright.sync_api import Page
from playwright.async_api import async_playwright
import logging

# 3 registered users in total for testing

logger = logging.getLogger(__name__)

# This test checks if a unauthenticated user can access the dashboard without logging in.
# It should redirect to the login page.
@pytest.mark.order(11)
def test_route_without_login(page: Page):
    logger.debug("Starting test_route_without_login...")
    
    # Try to access the dashboard without logging in
    page.goto("/dashboard") 
    logger.debug("Navigated to /dashboard.")

    # Wait for redirection to the login page
    page.wait_for_url("/login")  
    logger.debug("Redirected to /login.")
    assert page.locator('h2').text_content() == "Login"
    logger.debug("Login page verified.")

# This test checks the registration process for a new user.
# It should successfully register the user and redirect to the login page.
# 1 REGISTERED USER Created
@pytest.mark.order(12)
def test_register_user(page: Page):
    logger.debug("Starting test_register_user...")
    
    # Navigate to the registration page
    page.goto("/register") 
    logger.debug("Navigated to /register.")

    # Fill out the registration form
    page.fill('input[placeholder="Enter your email"]', 'testuser@example.com')
    page.fill('input[placeholder="Enter your password"]', 'Test1234')
    page.click('button:has-text("Register")')
    logger.debug("Registration form submitted.")

    # Wait for redirection to the login page
    page.wait_for_url("/login")  
    logger.debug("Redirected to /login.")
    assert page.locator('h2').text_content() == "Login"
    logger.debug("Login page verified after registration.")

# This test checks if a user cannot register with an already existing email.
# It should display an error message indicating the email is already registered.
@pytest.mark.order(13)
def test_register_user_with_existing_email(page: Page):
    logger.debug("Starting test_register_user_with_existing_email...")
    
    # Navigate to the registration page
    page.goto("/register")
    logger.debug("Navigated to /register.")

    # Fill out the registration form with an already registered email
    page.fill('input[placeholder="Enter your email"]', 'testuser@example.com')
    page.fill('input[placeholder="Enter your password"]', 'Test1234')
    page.click('button:has-text("Register")')
    logger.debug("Registration form submitted with existing email.")

    # Verify error message is displayed
    page.wait_for_selector('p.text-red-500.mb-4:has-text("Email already registered")')
    assert page.locator('p.text-red-500.mb-4:has-text("Email already registered")').is_visible()
    logger.debug("Error message for existing email verified.")

# This test checks if a user can log in successfully with valid credentials and a default role of "clinic".
# It should redirect to the dashboard after logging in and logout at the end.
@pytest.mark.order(14)
def test_login_user(page: Page):
    logger.debug("Starting test_login_user...")
    
    # Navigate to the login page
    page.goto("/login") 
    logger.debug("Navigated to /login.")

    # Fill out the login form
    page.fill('input[placeholder="Enter your email"]', 'testuser@example.com')
    page.fill('input[placeholder="Enter your password"]', 'Test1234')
    page.click('button:has-text("Login")')
    logger.debug("Login form submitted.")

    # Wait for redirection to the dashboard
    page.wait_for_url("/model-trial")  
    logger.debug("Redirected to /model-trial.")
    assert page.locator('h1').text_content() == "Model Trial"
    logger.debug("Dashboard verified.")

    # Log out at the end
    page.click('button:has-text("Logout")')
    page.wait_for_url("/login")  
    assert page.locator('h2').text_content() == "Login"
    logger.debug("Logged out and redirected to login page.")

# This test checks if a user cannot log in with invalid credentials.
# It should display an error indicating invalid credentials.
@pytest.mark.order(15)
def test_login_with_invalid_credentials(page: Page):
    logger.debug("Starting test_login_with_invalid_credentials...")
    
    # Navigate to the login page
    page.goto("/login")
    logger.debug("Navigated to /login.")

    # Fill out the login form with invalid credentials
    page.fill('input[placeholder="Enter your email"]', 'wronguser@example.com')
    page.fill('input[placeholder="Enter your password"]', 'WrongPassword')
    page.click('button:has-text("Login")')
    logger.debug("Login form submitted with invalid credentials.")

    # Verify error message is displayed
    page.wait_for_selector('p.text-red-500.mb-4:has-text("Invalid credentials")')
    assert page.locator('p.text-red-500.mb-4:has-text("Invalid credentials")').is_visible()
    logger.debug("Error message for invalid credentials verified.")

# This test checks if a user redirects to the login page after session expiry.
# It simulates session expiry by clearing cookies and then tries to access a protected route (Model Trial).
@pytest.mark.order(16)
def test_session_expiry(page: Page):
    logger.debug("Starting test_session_expiry...")
    
    # Log in first
    page.goto("/login")
    page.fill('input[placeholder="Enter your email"]', 'testuser@example.com')
    page.fill('input[placeholder="Enter your password"]', 'Test1234')
    page.click('button:has-text("Login")')
    logger.debug("Logged in successfully.")

    # Simulate session expiry (e.g., by clearing cookies of session_token)
    page.context.clear_cookies()
    logger.debug("Session cookies cleared.")

    # Try to access a protected route
    page.goto("/model-trial")
    logger.debug("Attempted to access /model-trial after session expiry.")

    # Verify redirection to the login page
    page.wait_for_url("/login")
    assert page.locator('h2').text_content() == "Login"
    logger.debug("Redirected to login page after session expiry.")

# This test checks if a user with a non-admin role cannot access an admin route.
# It should redirect to an unauthorized page (Blocked).
@pytest.mark.order(17)
def test_inaccessible_route(page: Page):
    logger.debug("Starting test_inaccessible_route...")
    
    # Log in first
    page.goto("/login")
    page.fill('input[placeholder="Enter your email"]', 'testuser@example.com')
    page.fill('input[placeholder="Enter your password"]', 'Test1234')
    page.click('button:has-text("Login")')
    logger.debug("Logged in successfully.")

    # Verify the user is logged in
    page.wait_for_url("/model-trial")
    assert page.locator('h1').text_content() == "Model Trial"
    logger.debug("Dashboard verified.")

    # Navigate to a protected route that requires an admin role
    page.goto("/dashboard")
    page.wait_for_url("/unauthorized") 
    logger.debug("Redirected to /unauthorized for accessing admin route.")

    # Verify the protected route is inaccessible without authorized role
    unauthorized_header = page.locator('h1.text-2xl.font-semibold.text-gray-900.dark\\:text-white.mb-4')
    assert unauthorized_header.text_content() == "Unauthorized"
    logger.debug("Unauthorized access verified.")

# This test simulates two users registering and logging in concurrently.
# It checks if both users can register and log in without any issues.
# This is useful for testing the application's ability to handle multiple users at once.
# 2 REGISTERED USERS
@pytest.mark.order(0)
@pytest.mark.asyncio
async def test_multi_user_login():
    logger.debug("Starting test_multi_user_login...")
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=False) 
        logger.debug("Browser launched.")

        async def first_user_workflow():
            logger.debug("Starting first_user_workflow...")
            # Create context and page for the first user
            context = await browser.new_context()
            page = await context.new_page()
            logger.debug("First user context and page created.")

            try:
                # Register the first user
                await page.goto("http://localhost:8000/register")
                logger.debug("First user navigated to /register.")
                await page.fill('input[placeholder="Enter your email"]', 'user1@example.com')
                await page.fill('input[placeholder="Enter your password"]', 'Password123')
                await page.click('button:has-text("Register")')
                logger.debug("First user registration form submitted.")
                await page.wait_for_url("http://localhost:8000/login")
                logger.debug("First user redirected to /login after registration.")

                # Log in as the first user
                await page.fill('input[placeholder="Enter your email"]', 'user1@example.com')
                await page.fill('input[placeholder="Enter your password"]', 'Password123')
                await page.click('button:has-text("Login")')
                logger.debug("First user login form submitted.")

                # Verify first user is logged in
                assert await page.locator('h1').text_content() == "Model Trial"
                logger.debug("First user successfully logged in and verified.")

                # Log out the first user
                await page.click('button:has-text("Logout")')
                await page.wait_for_url("http://localhost:8000/login")
                assert await page.locator('h2').text_content() == "Login"
                logger.debug("First user logged out and redirected to /login.")
            finally:
                # Close the page
                await page.close()
                await context.close()
                logger.debug("First user context and page closed.")

        async def second_user_workflow():
            logger.debug("Starting second_user_workflow...")
            # Create context and page for the second user
            context = await browser.new_context()
            page = await context.new_page()
            logger.debug("Second user context and page created.")

            try:
                # Register the second user
                await page.goto("http://localhost:8000/register")
                logger.debug("Second user navigated to /register.")
                await page.fill('input[placeholder="Enter your email"]', 'user2@example.com')
                await page.fill('input[placeholder="Enter your password"]', 'Password456')
                await page.click('button:has-text("Register")')
                logger.debug("Second user registration form submitted.")
                await page.wait_for_url("http://localhost:8000/login")
                logger.debug("Second user redirected to /login after registration.")

                # Log in as the second user
                await page.fill('input[placeholder="Enter your email"]', 'user2@example.com')
                await page.fill('input[placeholder="Enter your password"]', 'Password456')
                await page.click('button:has-text("Login")')
                logger.debug("Second user login form submitted.")

                # Verify second user is logged in
                assert await page.locator('h1').text_content() == "Model Trial"
                logger.debug("Second user successfully logged in and verified.")

                # Log out the second user
                await page.click('button:has-text("Logout")')
                await page.wait_for_url("http://localhost:8000/login")
                assert await page.locator('h2').text_content() == "Login"
                logger.debug("Second user logged out and redirected to /login.")
            finally:
                # Close the page
                await page.close()
                await context.close()
                logger.debug("Second user context and page closed.")

        # Run both user workflows concurrently
        logger.debug("Running both user workflows concurrently...")
        await asyncio.gather(first_user_workflow(), second_user_workflow())

        # Close the browser
        await browser.close()
        logger.debug("Browser closed.")

# This test checks the rate limiting feature of the application.
@pytest.mark.order(21)
def test_rate_limiting(page: Page):
    logger.debug("Starting test_rate_limiting...")
    
    # Navigate to the login page
    page.goto("/login")
    logger.debug("Navigated to /login.")

    # Attempt to log in multiple times with invalid credentials
    for _ in range(25):
        page.fill('input[placeholder="Enter your email"]', 'testuser@example.com')
        page.fill('input[placeholder="Enter your password"]', 'WrongPassword')
        page.click('button:has-text("Login")')
        logger.debug("Invalid login attempt submitted.")

    # Verify rate limiting error message is displayed
    assert page.locator('p:has-text("Rate limit exceeded. Please try again later.")').is_visible()
    logger.debug("Rate limiting error message verified.")