import pytest
from playwright.sync_api import Page

@pytest.fixture(scope="session")
def base_url():
    return "http://localhost:8000" 

def test_register_user(page: Page, base_url):
    # Navigate to the registration page
    page.goto(f"{base_url}/register")

    # Fill out the registration form
    page.fill('input[placeholder="Enter your email"]', 'testuser@example.com')
    page.fill('input[placeholder="Enter your password"]', 'Test1234')
    page.click('button:has-text("Register")')

    # Wait for redirection to the login page
    page.wait_for_url(f"{base_url}/login")
    assert page.locator('h2').text_content() == "Login"

def test_login_user(page: Page, base_url):
    # Navigate to the login page
    page.goto(f"{base_url}/login")

    # Fill out the login form
    page.fill('input[placeholder="Enter your email"]', 'testuser@example.com')
    page.fill('input[placeholder="Enter your password"]', 'Test1234')
    page.click('button:has-text("Login")')

    # Wait for redirection to the dashboard
    page.wait_for_url(f"{base_url}/model-trial")
    assert page.locator('h1').text_content() == "Model Trial"

    # Log out at the end
    page.click('button:has-text("Logout")')
    page.wait_for_url(f"{base_url}/login")
    assert page.url == f"{base_url}/login"

def test_unauthorized_access(page: Page, base_url):
    # Try to access the dashboard without logging in
    page.goto(f"{base_url}/dashboard")

    # Wait for redirection to the login page
    page.wait_for_url(f"{base_url}/login")
    assert page.locator('h2').text_content() == "Login"