# Setting Up Form Submission Triggers - Detailed Guide

## What is a Trigger?

A **trigger** is a way to automatically run a function when something happens. In this case, we want to automatically run a function (`onReviewFormSubmit`) whenever someone submits your review form.

## Why Do We Need Triggers?

When someone submits a Google Form, we need the system to:
1. Automatically detect the submission
2. Extract the data from the form response
3. Update the appropriate sheet (Review Assignments sheet)
4. Mark the review as completed

**Without a trigger**, you'd have to manually check form responses and update sheets - not practical!

## What Does "Add trigger for `onReviewFormSubmit`" Mean?

It means: **"Set up Google Apps Script to automatically run the `onReviewFormSubmit()` function whenever someone submits the review form."**

## Step-by-Step: Setting Up the Trigger

### Step 1: Open Apps Script

1. Go to your Google Sheet (Performance Review System)
2. Click **Extensions** → **Apps Script**
3. You should see your `Code.gs` file with all the functions

### Step 2: Open the Triggers Page

1. In Apps Script, look at the left sidebar
2. Click on the **clock icon** (⏰) labeled **"Triggers"**
3. This opens the Triggers page

### Step 3: Add a New Trigger

1. Click the **"+ Add Trigger"** button (blue button, usually at bottom right)
2. A dialog box will appear

### Step 4: Configure the Trigger

Fill in the trigger settings:

**Function to run:**
- Click the dropdown
- Select: **`onReviewFormSubmit`**

**Event source:**
- Click the dropdown
- Select: **"From form"**

**Event type:**
- Click the dropdown
- Select: **"On form submit"**

**Form:**
- Click the dropdown
- Select: **Your Review Form** (the one you created for performance reviews)

**Failure notification settings:**
- Choose: **"Notify me immediately"** (so you know if something goes wrong)

### Step 5: Save the Trigger

1. Click **"Save"**
2. You may be asked to authorize permissions - click **"Review permissions"** and authorize
3. The trigger is now set up!

## Visual Guide

```
Apps Script → Triggers (⏰ icon) → + Add Trigger
    ↓
Configure:
  Function: onReviewFormSubmit
  Event source: From form
  Event type: On form submit
  Form: [Select your review form]
    ↓
Save → Authorize → Done!
```

## What Happens After Setup?

Once the trigger is set up:

1. **User submits review form** → Google Forms receives the submission
2. **Trigger fires automatically** → Apps Script runs `onReviewFormSubmit()`
3. **Function processes response** → Extracts reviewer email, reviewee email, review type
4. **Sheet updates automatically** → Review Assignments sheet is updated with completion status

**You don't need to do anything** - it all happens automatically!

## Setting Up All Three Triggers

You need to set up **three triggers** (one for each form):

### Trigger 1: Peer Selection Form
- **Function**: `onPeerSelectionSubmit`
- **Event source**: From form
- **Event type**: On form submit
- **Form**: Your Peer Selection Form

### Trigger 2: Manager Confirmation Form
- **Function**: `onManagerConfirmationSubmit`
- **Event source**: From form
- **Event type**: On form submit
- **Form**: Your Manager Confirmation Form

### Trigger 3: Review Form
- **Function**: `onReviewFormSubmit`
- **Event source**: From form
- **Event type**: On form submit
- **Form**: Your Performance Review Form

## Verifying Triggers Are Set Up

After setting up triggers:

1. Go to **Triggers** page in Apps Script
2. You should see all three triggers listed:
   ```
   onPeerSelectionSubmit    From form    On form submit    [Form name]
   onManagerConfirmation... From form    On form submit    [Form name]
   onReviewFormSubmit       From form    On form submit    [Form name]
   ```
3. Each should show **"Active"** status

## Testing Triggers

### Test 1: Peer Selection Form
1. Submit a test response to your Peer Selection Form
2. Check the **Execution** log in Apps Script (clock icon → "Executions" tab)
3. You should see `onPeerSelectionSubmit` ran
4. Check your Peer Selection sheet - data should be updated

### Test 2: Manager Confirmation Form
1. Submit a test response to your Manager Confirmation Form
2. Check execution log
3. Check Manager Confirmation sheet

### Test 3: Review Form
1. Submit a test response to your Review Form
2. Check execution log
3. Check Review Assignments sheet - status should update to "Completed"

## Common Issues

### "Function not found"
**Problem**: The function name doesn't match exactly
**Solution**: 
- Check function name in Code.gs (must be exactly `onReviewFormSubmit`)
- Make sure you saved the Code.gs file
- Function names are case-sensitive

### "Form not found"
**Problem**: Form ID is incorrect or form doesn't exist
**Solution**:
- Verify form ID in CONFIG matches your actual form
- Make sure the form exists and is accessible

### "Trigger not firing"
**Problem**: Trigger is set up but not running
**Solution**:
- Check trigger status is "Active"
- Verify form submissions are actually happening
- Check execution log for errors
- Make sure you authorized all permissions

### "Permission denied"
**Problem**: Apps Script doesn't have permission to access the form
**Solution**:
- Re-authorize permissions
- Run the function manually once to trigger authorization
- Check that you're the owner/editor of the form

## Alternative: Programmatic Trigger Setup

You can also set up triggers programmatically (though manual setup is recommended for first time):

```javascript
/**
 * Set up form submission triggers programmatically
 * Run this once to create all triggers
 */
function setupFormTriggers() {
  // Delete existing triggers (optional)
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction().includes('Submit')) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Note: Form submission triggers must be set up manually
  // or via FormApp API (more complex)
  Logger.log('Form submission triggers must be set up manually in Triggers UI');
  Logger.log('See TRIGGER_SETUP_EXPLAINED.md for instructions');
}
```

**Note**: Form submission triggers are easier to set up manually through the UI.

## Summary

**"Add trigger for `onReviewFormSubmit`"** means:

1. Go to Apps Script → Triggers
2. Click "+ Add Trigger"
3. Select function: `onReviewFormSubmit`
4. Select event: "From form" → "On form submit"
5. Select your review form
6. Save and authorize

Once set up, the function runs automatically every time someone submits the form - no manual work needed!

## Quick Reference

| Form | Function Name | When It Runs |
|------|--------------|--------------|
| Peer Selection | `onPeerSelectionSubmit` | When employee selects peers |
| Manager Confirmation | `onManagerConfirmationSubmit` | When manager confirms peers |
| Review Form | `onReviewFormSubmit` | When employee completes a review |

All three need triggers set up the same way!

