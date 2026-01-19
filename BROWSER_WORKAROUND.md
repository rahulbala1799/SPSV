# Browser Workarounds to Get Masked Credentials

## Method 1: Inspect Element (Most Reliable)

1. **Right-click** on one of the masked values (the asterisks: `****************************`)
2. Select **"Inspect"** or **"Inspect Element"**
3. In the HTML, look for:
   - `data-value="actual_value_here"`
   - `value="actual_value_here"`
   - Or check the element's `textContent` or `innerHTML`
4. The actual value might be stored in a data attribute even if hidden

## Method 2: Select All and Copy

1. Click in the Quickstart section
2. **Select All** (Cmd+A on Mac, Ctrl+A on Windows)
3. **Copy** (Cmd+C or Ctrl+C)
4. **Paste** into a text editor
5. Sometimes the actual values are copied even if they appear masked on screen!

## Method 3: Browser Console

1. Open **Developer Tools** (F12 or Cmd+Option+I)
2. Go to **Console** tab
3. Try running:
   ```javascript
   // Find all elements with masked values
   document.querySelectorAll('[data-value]')
   
   // Or look for input/textarea elements
   document.querySelectorAll('input[type="password"], input[value*="*"]')
   ```

## Method 4: Check for Copy Button

Look for a **"Copy"** button or icon next to each masked value. Sometimes clicking "Copy" copies the actual value to clipboard even if it's masked on screen.

## Method 5: Network Tab

1. Open **Developer Tools** → **Network** tab
2. Refresh the page
3. Look for API calls that return the credentials
4. Check the response - credentials might be in the API response

## What to Look For

The actual values should look like:
- `NEXT_PUBLIC_STACK_PROJECT_ID`: `proj_xxxxxxxxxxxxx` or similar UUID
- `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`: `pk_xxxxxxxxxxxxx` or `pck_xxxxxxxxxxxxx`
- `STACK_SECRET_SERVER_KEY`: `sk_xxxxxxxxxxxxx` or `ssk_xxxxxxxxxxxxx`
