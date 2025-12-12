# Setting Up Triggers

This guide explains how to set up automated triggers for the Performance Review System.

## Manual Trigger Setup

### In Google Apps Script:

1. Open your Apps Script project (Extensions → Apps Script in your Google Sheet)

2. Click on the clock icon (Triggers) in the left sidebar

3. Click "+ Add Trigger" button

4. Configure each trigger as follows:

## Required Triggers

### 1. Form Submission Triggers

**Peer Selection Form Submission**
- Function: `onPeerSelectionSubmit`
- Event source: From form
- Event type: On form submit
- Form: Select your Peer Reviewer Selection Form
- Failure notification settings: Notify me immediately

**Manager Confirmation Form Submission**
- Function: `onManagerConfirmationSubmit`
- Event source: From form
- Event type: On form submit
- Form: Select your Manager Confirmation Form
- Failure notification settings: Notify me immediately

**Review Form Submission**
- Function: `onReviewFormSubmit`
- Event source: From form
- Event type: On form submit
- Form: Select your Performance Review Form
- Failure notification settings: Notify me immediately

### 2. Time-Driven Triggers

**Daily Reminder Check**
- Function: `sendReminders`
- Event source: Time-driven
- Type of time based trigger: Day timer
- Time of day: 9am to 10am (or your preferred time)
- Failure notification settings: Daily

**Manager Reminder Check**
- Function: `sendManagerReminders`
- Event source: Time-driven
- Type of time based trigger: Day timer
- Time of day: 9am to 10am
- Failure notification settings: Daily

**Completion Status Check**
- Function: `checkCompletionStatus`
- Event source: Time-driven
- Type of time based trigger: Hour timer
- Every: 6 hours
- Failure notification settings: Daily

## Programmatic Trigger Setup

Alternatively, you can set up triggers programmatically by running this function once:

```javascript
/**
 * Set up all required triggers
 * Run this function once to automatically create all triggers
 */
function setupTriggers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Delete existing triggers (optional - comment out if you want to keep existing)
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction().indexOf('onPeerSelectionSubmit') !== -1 ||
        trigger.getHandlerFunction().indexOf('onManagerConfirmationSubmit') !== -1 ||
        trigger.getHandlerFunction().indexOf('onReviewFormSubmit') !== -1 ||
        trigger.getHandlerFunction().indexOf('sendReminders') !== -1 ||
        trigger.getHandlerFunction().indexOf('sendManagerReminders') !== -1 ||
        trigger.getHandlerFunction().indexOf('checkCompletionStatus') !== -1) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Form submission triggers need to be set up manually or via form-specific methods
  // For now, we'll set up time-driven triggers
  
  // Daily reminder at 9 AM
  ScriptApp.newTrigger('sendReminders')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
  
  // Daily manager reminder at 9 AM
  ScriptApp.newTrigger('sendManagerReminders')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
  
  // Completion status check every 6 hours
  ScriptApp.newTrigger('checkCompletionStatus')
    .timeBased()
    .everyHours(6)
    .create();
  
  Logger.log('Triggers set up successfully!');
  Logger.log('Note: Form submission triggers must be set up manually in the Triggers UI');
}
```

## Verifying Triggers

After setting up triggers:

1. Go to Triggers page in Apps Script
2. Verify all triggers are listed
3. Check that they show "Active" status
4. Review the execution history to see if triggers are firing

## Testing Triggers

### Test Form Submission Triggers:
1. Submit a test form response
2. Check the Apps Script execution log
3. Verify the sheet was updated correctly

### Test Time-Driven Triggers:
1. Manually run the function (e.g., `sendReminders`)
2. Check execution log for any errors
3. Verify emails were sent (check your email)
4. Verify sheet was updated

## Troubleshooting

### Trigger Not Firing
- Check that the trigger is set to "Active" status
- Verify the function name matches exactly (case-sensitive)
- Check execution log for errors
- Ensure you have necessary permissions

### Permission Errors
- Run the function manually once to authorize permissions
- Check that the script has access to:
  - Google Sheets (read/write)
  - Gmail (send emails)
  - Google Forms (read responses)

### Form Submission Not Working
- Verify the form ID in CONFIG matches your actual form
- Check that the form question titles match what the code expects
- Review the execution log for parsing errors

### Time-Driven Triggers Not Running
- Verify the trigger is set to the correct time zone
- Check that the function doesn't have errors (test manually first)
- Review execution history for failed runs

## Best Practices

1. **Test First**: Always test functions manually before setting up automated triggers
2. **Monitor Logs**: Regularly check execution logs for errors
3. **Set Notifications**: Configure failure notifications to catch issues early
4. **Document Changes**: Keep track of when triggers are modified
5. **Backup**: Export your Apps Script project before making major changes

