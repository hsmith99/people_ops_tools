# Manual Trigger Setup Guide

If the programmatic trigger setup fails (which it often does), you need to set up triggers manually from each form's script editor.

## Why Manual Setup?

Form submission triggers need to be created from a script that's **bound to the form**, not from a standalone script. Since your main script is bound to the Google Sheet, you have two options:

1. **Manual setup** (recommended): Set up triggers from each form's script
2. **Copy functions to each form**: Copy handler functions to each form's script

## Method 1: Set Up Triggers from Each Form's Script (Recommended)

### For Peer Selection Form

1. **Open your Peer Selection Form**
2. **Click the three dots menu** (⋮) in the top right
3. **Select "Script editor"** or **"Apps Script"**
4. **If no script exists**, create a new one:
   - Delete any default code
   - Copy the `onPeerSelectionSubmit()` function from your main Code.gs
   - Also copy any helper functions it needs:
     - `getEmployeeData()`
     - `findEmployee()`
     - `getSheet()`
     - `storePeerReviewers()`
     - `extractEmailFromResponse()`
     - `sendEmail()`
     - `CONFIG` object (or just the parts you need)
5. **Go to Triggers** (⏰ icon)
6. **Click "+ Add Trigger"**
7. **Configure**:
   - Function: `onPeerSelectionSubmit`
   - Event source: **"From form"** (should now be available!)
   - Event type: **"On form submit"**
   - Form: Should be automatically set to current form
8. **Save** and authorize permissions

### For Manager Confirmation Form

Repeat the same process:
1. Open Manager Confirmation Form
2. Three dots → Script editor
3. Copy `onManagerConfirmationSubmit()` and helper functions
4. Set up trigger

### For Review Form

Repeat the same process:
1. Open Review Form
2. Three dots → Script editor
3. Copy `onReviewFormSubmit()` and helper functions
4. Set up trigger

## Method 2: Shared Library Approach (Advanced)

If you want to keep all code in one place, you can:

1. **Publish your main script as a library**
2. **Reference it from each form's script**
3. **Set up triggers in each form's script**

This is more complex but keeps code centralized.

## Method 3: Minimal Functions in Form Scripts

You can minimize code duplication by having form scripts just call your main script:

### In Each Form's Script:

```javascript
// Peer Selection Form Script
function onFormSubmit(e) {
  // Call the main script function
  // You'll need to set up the main script as a library or use UrlFetchApp
  // This is complex - Method 1 is easier
}
```

**Note**: Method 1 (copying functions) is simpler and more reliable.

## What Functions to Copy

### For Peer Selection Form Script:

Copy these functions from Code.gs:
- `onPeerSelectionSubmit(e)` - Main handler
- `getEmployeeData()` - Get employees
- `findEmployee(email)` - Find employee
- `getSheet(sheetName)` - Get sheet
- `storePeerReviewers()` - Store peers
- `extractEmailFromResponse()` - Extract email
- `sendEmail()` - Send email
- `CONFIG` object (or relevant parts)

### For Manager Confirmation Form Script:

Copy:
- `onManagerConfirmationSubmit(e)`
- Same helper functions as above

### For Review Form Script:

Copy:
- `onReviewFormSubmit(e)`
- Helper functions needed

## Simplified Approach: Copy Minimal Code

Actually, you can simplify by having form scripts just update the sheet directly:

### Example: Peer Selection Form Script

```javascript
// Minimal code for Peer Selection Form
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Get from Sheet URL
const SHEET_NAME = 'Peer Selection';

function onFormSubmit(e) {
  try {
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    let employeeEmail = '';
    let selectedPeers = [];
    
    itemResponses.forEach(response => {
      const itemTitle = response.getItem().getTitle();
      const responseValue = response.getResponse();
      
      if (itemTitle === 'Employee Email' || itemTitle.includes('Email')) {
        employeeEmail = responseValue;
      } else if (itemTitle.includes('Peer') || itemTitle.includes('Reviewer')) {
        if (Array.isArray(responseValue)) {
          selectedPeers = responseValue;
        } else {
          selectedPeers = [responseValue];
        }
      }
    });
    
    if (!employeeEmail || selectedPeers.length !== 5) {
      Logger.log('Invalid submission');
      return;
    }
    
    // Update sheet directly
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    // ... rest of update logic
  } catch (error) {
    Logger.log(`Error: ${error.toString()}`);
  }
}
```

## Recommended: Use Method 1

**Method 1 is the most reliable**: Copy the handler function to each form's script and set up the trigger there. It's straightforward and works consistently.

## Quick Checklist

For each form:
- [ ] Open form → Three dots → Script editor
- [ ] Copy handler function (`onPeerSelectionSubmit`, etc.)
- [ ] Copy necessary helper functions
- [ ] Go to Triggers → Add Trigger
- [ ] Select "From form" → "On form submit"
- [ ] Save and authorize

## Need Help?

If you're having trouble:
1. Check that you have edit access to the forms
2. Verify form IDs are correct
3. Make sure the handler function name matches exactly
4. Check execution logs for specific errors

