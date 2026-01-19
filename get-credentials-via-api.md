# Get Stack Auth Credentials via Neon API

## Option 1: Use Neon API to Get Credentials

Since the eye button doesn't work, you can use the Neon API to retrieve the credentials.

### Step 1: Get Your Neon API Key
1. Go to: https://console.neon.tech
2. Click your profile icon (top right)
3. Go to **"Account Settings"** or **"API Keys"**
4. Create a new API key or use an existing one
5. Copy the API key

### Step 2: Get Project ID
Your project ID should be visible in the Neon Console URL or project settings.

### Step 3: Call the API

```bash
# List auth integrations
curl -X GET \
  "https://console.neon.tech/api/v2/projects/{project_id}/auth/integrations" \
  -H "Authorization: Bearer YOUR_NEON_API_KEY"

# Or generate SDK keys
curl -X POST \
  "https://console.neon.tech/api/v2/projects/auth/keys" \
  -H "Authorization: Bearer YOUR_NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "your-project-id",
    "auth_provider": "stack"
  }'
```

## Option 2: Try Browser Workaround

1. Right-click on the masked value
2. Select "Inspect Element"
3. Look in the HTML for the actual value (might be in a `data-value` attribute)
4. Or check the browser console for any errors

## Option 3: Contact Neon Support

If the API doesn't work, contact Neon support - they can help reveal or regenerate the credentials.
