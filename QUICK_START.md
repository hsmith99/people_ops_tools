# Quick Start Guide

Follow these steps to set up your Performance Review System in about 30 minutes.

## Step 1: Create Google Sheet (5 minutes)

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Performance Review System"
4. Import `sheet_template.csv` or manually create the columns:
   - Employee Email
   - Employee Name
   - Manager Email
   - Manager Name
   - Is Manager (TRUE/FALSE)
   - Peer Selection Status
   - Peer Reviewers Selected
   - Manager Confirmation Status
   - Confirmed Peer Reviewers
   - Review Assignment Status
   - Self Review Status
   - Manager Review Status
   - Peer Reviews Status
   - Direct Reports Review Status
   - Last Reminder Sent
   - Reminder Count

5. Add your employee data (at minimum: email, name, manager email, manager name, is manager)

## Step 2: Create Google Forms (15 minutes)

### Form 1: Peer Reviewer Selection

1. Create new Google Form
2. Add these questions:
   - **Employee Email** (Short answer, required) - Will be pre-filled (visible but should not be modified)
   - **Employee Name** (Short answer, required) - Will be pre-filled (visible but should not be modified)
   - **Select Peer Reviewers** (Checkbox, required) - List all employees (must select exactly 5)
3. Copy the Form ID from the URL (between `/d/` and `/viewform`)
4. Save the Form ID - you'll need it in Step 3

### Form 2: Manager Confirmation

1. Create new Google Form
2. Add these questions:
   - **Employee Email** (Short answer, required) - Pre-filled (visible but should not be modified)
   - **Employee Name** (Short answer, required) - Pre-filled (visible but should not be modified)
   - **Selected Peer Reviewers** (Paragraph, optional) - Info only
   - **Confirm/Reselect Peer Reviewers** (Checkbox, required) - List all employees
3. Copy the Form ID

### Form 3: Performance Review

1. Create new Google Form
2. Add these questions:
   - **Reviewer Email** (Short answer, required) - Pre-filled (visible but should not be modified)
   - **Reviewee Email** (Short answer, required) - Pre-filled (visible but should not be modified)
   - **Review Type** (Short answer, required) - Pre-filled (visible but should not be modified) (values: Self, Manager, Peer, Direct Report)
   - **Your standard review questions** (add 5-10 questions as needed)
3. Copy the Form ID

See `FORM_SETUP.md` for detailed form setup instructions.

## Step 3: Set Up Apps Script (5 minutes)

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any default code
3. Copy the entire contents of `Code.gs` into the editor
4. Update the `CONFIG` section at the top:
   ```javascript
   PEER_SELECTION_FORM_ID: 'PASTE_YOUR_FORM_ID_HERE',
   MANAGER_CONFIRMATION_FORM_ID: 'PASTE_YOUR_FORM_ID_HERE',
   REVIEW_FORM_ID: 'PASTE_YOUR_FORM_ID_HERE',
   FROM_EMAIL: 'your-email@company.com',
   REPLY_TO: 'hr@company.com',
   ```
5. Save the project (Ctrl+S or Cmd+S)
6. Name your project: "Performance Review System"

## Step 4: Authorize Permissions (2 minutes)

1. Click the **Run** button (▶) in the toolbar
2. Select the `setup` function from the dropdown
3. Click **Run**
4. Review and accept the permissions:
   - Access to Google Sheets
   - Send emails via Gmail
   - Access to Google Forms
5. The `setup` function will initialize your sheet

## Step 5: Set Up Triggers (3 minutes)

### Option A: Manual Setup (Recommended for first time)

1. Click the **Triggers** icon (clock) in the left sidebar
2. Click **+ Add Trigger**
3. Set up these triggers:

   **Trigger 1: Peer Selection Form**
   - Function: `onPeerSelectionSubmit`
   - Event: On form submit
   - Form: Your Peer Selection Form

   **Trigger 2: Manager Confirmation Form**
   - Function: `onManagerConfirmationSubmit`
   - Event: On form submit
   - Form: Your Manager Confirmation Form

   **Trigger 3: Review Form**
   - Function: `onReviewFormSubmit`
   - Event: On form submit
   - Form: Your Review Form

   **Trigger 4: Daily Reminders**
   - Function: `sendReminders`
   - Event: Time-driven
   - Type: Day timer
   - Time: 9am-10am

   **Trigger 5: Manager Reminders**
   - Function: `sendManagerReminders`
   - Event: Time-driven
   - Type: Day timer
   - Time: 9am-10am

   **Trigger 6: Status Check**
   - Function: `checkCompletionStatus`
   - Event: Time-driven
   - Type: Hour timer
   - Every: 6 hours

See `TRIGGERS_SETUP.md` for detailed instructions.

## Step 6: Test the System (5 minutes)

### Test 1: Peer Selection

1. Run `sendPeerSelectionInvites()` manually
2. Check your email - you should receive a test email
3. Click the link and submit the form
4. Check your sheet - the "Peer Selection Status" should update to "Completed"

### Test 2: Manager Confirmation

1. Run `sendManagerConfirmationEmails()` manually
2. Check manager email
3. Submit the confirmation form
4. Check sheet - "Manager Confirmation Status" should update

### Test 3: Review Assignment

1. Run `sendReviewAssignments()` manually
2. Check employee email
3. Submit a test review
4. Check sheet - review status should update

## Step 7: Customize (Optional)

1. **Email Templates**: Edit the `EMAIL_TEMPLATES` object in `Code.gs`
2. **Reminder Settings**: Adjust `REMINDER_INTERVAL_DAYS` and `MAX_REMINDERS` in CONFIG
3. **Form Questions**: Add your specific review questions to Form 3

## Running Your First Review Cycle

1. **Week 1: Peer Selection**
   - Run `sendPeerSelectionInvites()`
   - Wait for all employees to complete (or send reminders)

2. **Week 2: Manager Confirmation**
   - Run `sendManagerConfirmationEmails()`
   - Wait for all managers to complete (or send reminders)

3. **Week 3: Reviews**
   - Run `sendReviewAssignments()`
   - Reminders will be sent automatically via triggers

4. **Ongoing: Monitoring**
   - Check the sheet regularly for completion status
   - Reminders are sent automatically

## Troubleshooting

### Emails Not Sending
- Check that `FROM_EMAIL` is a valid email in your Google Workspace
- Verify Gmail API permissions are granted
- Check execution log for errors

### Form Responses Not Recording
- Verify Form IDs are correct in CONFIG
- Check that form question titles match exactly (case-sensitive)
- Review execution log for parsing errors

### Sheet Not Updating
- Verify sheet name matches `CONFIG.SHEET_NAME`
- Check that employee emails in sheet match form responses
- Review execution log for errors

## Next Steps

- Read `README.md` for full system documentation
- Review `FORM_SETUP.md` for advanced form configuration
- Check `TRIGGERS_SETUP.md` for trigger management

## Support

If you encounter issues:
1. Check the execution log in Apps Script
2. Review error messages in the log
3. Verify all configuration values are correct
4. Test each function manually before relying on triggers

