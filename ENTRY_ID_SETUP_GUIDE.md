# Entry ID Setup Guide - Enable Automatic Pre-filling

To enable automatic pre-filling of email and name fields in your forms, you need to find the "entry IDs" for each question and add them to `FORM_ENTRY_IDS` in Code.gs.

## What are Entry IDs?

Entry IDs are numbers used in Google Forms URLs to pre-fill form fields. They look like: `entry.123456789`

**Important**: Entry IDs are different from Item IDs. Item IDs are internal identifiers, but Entry IDs are what you need for URL pre-filling.

## How to Find Entry IDs

### Method 1: From Form HTML Source (Most Reliable)

1. **Open your Google Form** in a browser
2. **Right-click** on the page → **"View Page Source"** (or press Ctrl+U / Cmd+U)
3. **Search** for your question text (e.g., "Employee Email")
4. **Look for** `name="entry.XXXXX"` or `entry.XXXXX` near the question
5. The number after `entry.` is your entry ID

**Example:**
```html
<input name="entry.123456789" ...>
```
Entry ID = `123456789`

### Method 2: Using Browser Developer Tools

1. **Open your Google Form** in a browser
2. **Right-click** on the question field → **"Inspect"** (or press F12)
3. **Look for** the input element
4. **Find** `name="entry.XXXXX"` in the HTML
5. The number is your entry ID

### Method 3: Test with URL Parameters

1. Get your form's published URL
2. Add `?entry.123456789=test` to the end
3. Open the URL - if the field is pre-filled, that's the correct entry ID
4. Try different numbers until you find the right ones

## Step-by-Step Setup

### Step 1: Find Entry IDs for Peer Selection Form

1. Open **Peer Selection Form**
2. Find entry IDs for:
   - "Employee Email" question
   - "Employee Name" question
3. Note them down

### Step 2: Find Entry IDs for Manager Confirmation Form

1. Open **Manager Confirmation Form**
2. Find entry IDs for:
   - "Employee Email" question
   - "Employee Name" question
3. Note them down

### Step 3: Find Entry IDs for Review Form

1. Open **Review Form**
2. Find entry IDs for:
   - "Reviewer Email" question
   - "Reviewee Email" question
   - "Review Type" question
3. Note them down

### Step 4: Update FORM_ENTRY_IDS in Code.gs

Open Code.gs and find the `FORM_ENTRY_IDS` object (around line 243). Update it with your entry IDs:

```javascript
const FORM_ENTRY_IDS = {
  'Peer Selection Form': {
    'Employee Email': '123456789',  // Replace with actual entry ID
    'Employee Name': '987654321',   // Replace with actual entry ID
  },
  'Manager Confirmation Form': {
    'Employee Email': '111222333',  // Replace with actual entry ID
    'Employee Name': '444555666',   // Replace with actual entry ID
  },
  'Review Form': {
    'Reviewer Email': '777888999',  // Replace with actual entry ID
    'Reviewee Email': '000111222',  // Replace with actual entry ID
    'Review Type': '333444555',     // Replace with actual entry ID
  }
};
```

**Important**: 
- Question titles must match exactly (case-sensitive)
- Entry IDs are just numbers (no quotes needed in the URL, but use strings in code)
- If a question doesn't exist or you can't find it, leave it as empty string `''`

### Step 5: Test

1. Run `sendPeerSelectionInvites()` again
2. Open the email and click the form link
3. **Verify**: Email and Name fields should be pre-filled automatically
4. If not, double-check the entry IDs and question titles

## Quick Test Function

After updating FORM_ENTRY_IDS, you can test if they work:

```javascript
// Test Peer Selection Form URL
function testPeerSelectionUrl() {
  const testUrl = createFormUrl(
    CONFIG.PEER_SELECTION_FORM_ID, 
    'Peer Selection Form', 
    {
      'Employee Email': 'test@example.com',
      'Employee Name': 'Test User'
    }
  );
  Logger.log('Test URL: ' + testUrl);
  // Copy this URL and open it in browser to verify pre-filling works
}
```

## Troubleshooting

### Fields Not Pre-filling

1. **Check question titles**: Must match exactly (case-sensitive, including spaces)
2. **Check entry IDs**: Make sure they're correct numbers
3. **Test URL manually**: Copy the generated URL and open it - do fields pre-fill?
4. **Check form type**: Some question types (like checkboxes) can't be pre-filled

### "Invalid entry ID" Error

- Entry IDs must be numbers only (no letters, no special characters)
- Make sure you copied the number correctly from the HTML source

### Question Title Not Found

- Question titles in FORM_ENTRY_IDS must match the exact question text in your form
- Check for typos, extra spaces, or case differences
- Use `getAllFormEntryIds()` to see exact question titles

## Alternative: Manual Entry (Current Setup)

If you can't get entry IDs working, the system still works - users will just need to enter their email/name manually in the forms. This is acceptable for testing and small teams.

## Summary

1. Find entry IDs from form HTML source
2. Update FORM_ENTRY_IDS in Code.gs
3. Test with `sendPeerSelectionInvites()`
4. Verify fields pre-fill when opening form links

Once configured, all form links will automatically pre-fill with the correct email and name! 🎉

