from playwright.sync_api import Page, expect, sync_playwright
import time
import sys

def verify_focusquest_ui(page: Page):
    print("Navigating to home...")
    try:
        page.goto("http://localhost:5000")
    except Exception as e:
        print(f"Navigation failed: {e}")
        raise

    print("Waiting for heading...")
    try:
        expect(page.get_by_role("heading", name="FocusQuest")).to_be_visible(timeout=10000)
    except Exception as e:
        print(f"Heading check failed: {e}")
        # Take error screenshot
        page.screenshot(path="/home/jules/verification/error.png")
        raise

    print("Adding quest...")
    try:
        page.get_by_label("Quest Title").fill("Visual Verification Quest")
        page.get_by_label("Details").fill("Testing the dark fantasy UI")
        page.get_by_role("button", name="Embark").click()
    except Exception as e:
        print(f"Add quest failed: {e}")
        page.screenshot(path="/home/jules/verification/error_add.png")
        raise

    print("Moving to Doing...")
    try:
        page.locator("article").filter(has_text="Quest Board").get_by_role("button", name="Accept").click()
    except Exception as e:
        print(f"Move quest failed: {e}")
        page.screenshot(path="/home/jules/verification/error_move.png")
        raise

    print("Taking screenshot...")
    time.sleep(1)
    page.screenshot(path="/home/jules/verification/focusquest_ui.png", full_page=True)
    print("Screenshot taken.")

if __name__ == "__main__":
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_focusquest_ui(page)
        except Exception as e:
            print(f"Script failed: {e}")
            sys.exit(1)
        finally:
            browser.close()
