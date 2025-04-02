import pytest
from playwright.sync_api import Page
import logging
import os

logger = logging.getLogger(__name__)

# This test checks if an admin can access the dashboard and view the data.
# It verifies the title of the page and checks if the data is fetched correctly.
@pytest.mark.order(18)
def test_admin_access_dashboard(page: Page):
    logger.debug("Starting test_admin_access_dashboard...")

    # Step 1: Log in as admin
    page.goto("/login")
    logger.debug("Navigated to /login.")

    page.fill('input[placeholder="Enter your email"]', 'admin123@gmail.com')
    page.fill('input[placeholder="Enter your password"]', 'admin123')
    page.click('button:has-text("Login")')
    logger.debug("Admin login form submitted.")

    # Verify successful login and redirection to the dashboard
    page.wait_for_url("/dashboard")
    assert page.locator('h1').first.text_content() == "Dashboard"
    logger.debug("Admin successfully logged in and redirected to the dashboard.")

    # Verify title
    page_title = page.title()
    assert page_title == "Dashboard - FL-ALL"
    logger.debug(f"Page title verified: {page_title}")
    
    # Wait until data is fetched (e.g., table rows or specific data elements)
    page.wait_for_selector('table tbody tr')
    assert page.locator('table tbody tr').count() > 0, "No data found in the Clients table"
    logger.debug("Clients data fetched successfully.")
    
    # Wait until the chart container is visible
    page.wait_for_selector('.recharts-responsive-container')
    assert page.locator('.recharts-responsive-container').is_visible(), "Chart container is not visible"
    logger.debug("Dashboard data fetched successfully.")

# This test checks if an admin can access the Clients page and view the data.
# It verifies the title of the page and checks if the data is fetched correctly.
@pytest.mark.order(19)
def test_admin_access_clients(page: Page):
    logger.debug("Starting test_admin_access_clients...")

    # Step 1: Log in as admin
    page.goto("/login")
    logger.debug("Navigated to /login.")

    page.fill('input[placeholder="Enter your email"]', 'admin123@gmail.com')
    page.fill('input[placeholder="Enter your password"]', 'admin123')
    page.click('button:has-text("Login")')
    logger.debug("Admin login form submitted.")

    # Verify successful login and redirection to the dashboard
    page.wait_for_url("/dashboard")
    assert page.locator('h1').first.text_content() == "Dashboard"
    logger.debug("Admin successfully logged in and redirected to the dashboard.")
    
    # Navigate to the Clients page
    page.click('a:has-text("Clients")')
    page.wait_for_url("/clients")
    logger.debug("Navigated to /clients.")

    # Verify the Clients page content
    assert page.locator('h1').first.text_content() == "Clients"
    logger.debug("Clients page verified successfully.")
    
    # Verify title
    page_title = page.title()
    assert page_title == "Clients - FL-ALL"
    logger.debug(f"Page title verified: {page_title}")

    # Wait until data is fetched (e.g., table rows or specific data elements)
    page.wait_for_selector('table tbody tr')
    assert page.locator('table tbody tr').count() > 0, "No data found in the Clients table"
    logger.debug("Clients data fetched successfully.")

# This test checks if an admin can access the Model Trial page and view the classification results.
# It verifies the title of the page and checks if the classification result is displayed correctly.
@pytest.mark.order(20)
def test_admin_access_model_trial(page: Page):
    logger.debug("Starting test_admin_access_model_trial...")

    # Step 1: Log in as admin
    page.goto("/login")
    logger.debug("Navigated to /login.")

    page.fill('input[placeholder="Enter your email"]', 'admin123@gmail.com')
    page.fill('input[placeholder="Enter your password"]', 'admin123')
    page.click('button:has-text("Login")')
    logger.debug("Admin login form submitted.")

    # Verify successful login and redirection to the dashboard
    page.wait_for_url("/dashboard")
    assert page.locator('h1').first.text_content() == "Dashboard"
    logger.debug("Admin successfully logged in and redirected to the dashboard.")
    
    # Navigate to the Model Trial page
    page.click('a:has-text("Model Trial")')
    page.wait_for_url("/model-trial")
    logger.debug("Navigated to /model-trial.")

    # Verify the Model Trial page content
    assert page.locator('h1').first.text_content() == "Model Trial"
    logger.debug("Model Trial page verified successfully.")

    # Verify title
    page_title = page.title()
    assert page_title == "Model Trial - FL-ALL"
    logger.debug(f"Page title verified: {page_title}")
    
    # Upload an image file
    image_path = os.path.abspath("tests/WBC-Benign-001_test.jpg")
    file_input = page.locator('input[type="file"]')
    file_input.wait_for(state="attached")
    # Set the input files
    file_input.set_input_files(image_path)
    logger.debug(f"Uploaded image file: {image_path}")

    # Wait for the classification header to appear
    classification_header = page.locator('h4:has-text("Classification")')
    classification_header.wait_for(state="visible")
    assert classification_header.is_visible(), "Classification header is not visible"
    logger.debug("Classification header is visible.")

    # Locate the classification result
    classification_result = page.locator('p.text-2xl.font-semibold.text-blue-600.dark\\:text-blue-400')
    classification_result.wait_for(state="visible")
    assert classification_result.is_visible(), "Classification result is not visible"

    # Extract and validate the classification text
    classification_text = classification_result.text_content()
    assert classification_text is not None
    logger.debug(f"Classification result: {classification_text}")

    # Upload non-image file
    non_image_path = os.path.abspath("tests/note_test.txt")
    page.set_input_files('input[type="file"]', non_image_path)
    logger.debug(f"Uploaded non-image file: {non_image_path}")

    # Wait for the error message to appear
    error_message = page.locator('p.text-red-600.dark\\:text-red-400')
    error_message.wait_for(state="visible") 
    assert error_message.is_visible(), "Error message is not visible"
    
    # Step 2: Log out
    page.click('button:has-text("Logout")')
    page.wait_for_url("/login")
    assert page.locator('h2').text_content() == "Login"
    logger.debug("Admin logged out and redirected to the login page.")