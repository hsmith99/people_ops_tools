# System Testing Guide

Follow these steps to test your Performance Review System end-to-end.

## Prerequisites Checklist

Before testing, make sure:
- [ ] All three form scripts are installed and have correct SPREADSHEET_ID
- [ ] Triggers are set up for all three forms (`onFormSubmit`)
- [ ] Employees sheet has test data with at least 2-3 employees
- [ ] At least one employee has a manager assigned
- [ ] Main Code.gs has correct form IDs in CONFIG

## Step 1: Prepare Test Data

### Add Test Employees

1. Open your Google Sheet
2. Go to **Employees** sheet
3. Add at least 2-3 test employees:

```
Employee Email          | Employee Name | Manager Email        | Manager Name | Is Manager | Status
test.employee1@co.com  | Test Employee 1 | test.manager@co.com | Test Manager | FALSE     | Active
test.employee2@co.com  | Test Employee 2 | test.manager@co.com | Test Manager | FALSE     | Active
test.manager@co.com     | Test Manager    |                     |              | TRUE      | Active
```

**Important**: Use real email addresses you can access, or use your own email for testing.

### Initialize Sheets

1. In your **main Apps Script** (Sheet's script editor)
2. Run `setup()` function
3. Check execution log - should say "Setup complete!"
4. Verify all sheets exist: Employees, Peer Selection, Manager Confirmation, Review Assignments

## Step 2: Populate Forms with Employee Lists

### For Peer Selection Form:

1. Open **Peer Selection Form** → **Script editor**
2. Run `updateEmployeeList()` function
3. Check execution log - should show employees added
4. **Verify**: Open the form and check that employee list is populated

### For Manager Confirmation Form:

1. Open **Manager Confirmation Form** → **Script editor**
2. Run `updateEmployeeList()` function
3. Check execution log - should show employees added
4. **Verify**: Open the form and check that employee list is populated

## Step 3: Test Peer Selection Workflow

### 3.1 Send Peer Selection Invites

1. In your **main Apps Script** (Sheet's script editor)
2. Run `sendPeerSelectionInvites()` function
3. Check execution log - should show emails sent
4. **Check your email** - you should receive a form link

### 3.2 Submit Test Peer Selection

1. Open the email with the form link
2. Click the link - form should open
3. **Verify pre-filled fields** (if entry IDs are configured):
   - Employee Email should be pre-filled
   - Employee Name should be pre-filled
4. **Select exactly 5 peer reviewers** from the checkbox list
5. Submit the form

### 3.3 Verify Sheet Update

1. Open your Google Sheet
2. Go to **Peer Selection** sheet
3. **Verify**:
   - Row exists for the employee
   - Status = "Completed"
   - Peer Reviewer 1-5 Name and Email columns are filled
   - Date Selected is populated

### 3.4 Check Execution Log

1. Open **Peer Selection Form** → **Script editor**
2. Go to **Execution log**
3. Should see: `Updated peer selection for [email]: 5 peers selected`

## Step 4: Test Manager Confirmation Workflow

### 4.1 Send Manager Confirmation Emails

**Prerequisites**: At least one employee must have completed peer selection (Status = "Completed" in Peer Selection sheet)

1. In your **main Apps Script**
2. Run `sendManagerConfirmationEmails()` function
3. Check execution log - should show emails sent to managers
4. **Check manager's email** - should receive email with employee links

### 4.2 Submit Test Manager Confirmation

1. Open the manager's email
2. Click the employee link - form should open
3. **Verify pre-filled fields**:
   - Employee Email should be pre-filled
   - Previously selected peer reviewers should be visible
4. **Confirm or modify** peer selections (must be exactly 5)
5. Submit the form

### 4.3 Verify Sheet Update

1. Open your Google Sheet
2. Go to **Manager Confirmation** sheet
3. **Verify**:
   - Row exists for the employee
   - Confirmation Status = "Completed"
   - Confirmed Peer Reviewer 1-5 Name and Email columns are filled
   - Date Confirmed is populated

### 4.4 Check Execution Log

1. Open **Manager Confirmation Form** → **Script editor**
2. Go to **Execution log**
3. Should see: `Updated manager confirmation for [email]: 5 peers confirmed`

## Step 5: Test Review Assignment Workflow

### 5.1 Send Review Assignments

**Prerequisites**: Manager confirmation must be complete (Status = "Completed" in Manager Confirmation sheet)

1. In your **main Apps Script**
2. Run `sendReviewAssignments()` function
3. Check execution log - should show emails sent
4. **Check employee's email** - should receive email with review links

### 5.2 Submit Test Review

1. Open the employee's email
2. Click one of the review links - form should open
3. **Verify pre-filled fields** (if entry IDs are configured):
   - Reviewer Email should be pre-filled
   - Reviewee Email should be pre-filled
   - Review Type should be pre-filled
4. Complete the review form
5. Submit the form

### 5.3 Verify Sheet Update

1. Open your Google Sheet
2. Go to **Review Assignments** sheet
3. **Verify**:
   - Row exists for the review assignment
   - Assignment Status = "Completed"
   - Date Completed is populated
   - Form Response ID is populated

### 5.4 Check Execution Log

1. Open **Review Form** → **Script editor**
2. Go to **Execution log**
3. Should see: `Updated review status: [reviewer] completed [type] review for [reviewee]`

## Step 6: Test Edge Cases

### 6.1 Invalid Peer Selection (Not Exactly 5)

1. Submit peer selection form with **less than 5** or **more than 5** selections
2. **Verify**:
   - Status in Peer Selection sheet = "Pending - Invalid Selection"
   - Employee receives email notification about invalid selection

### 6.2 Resubmission

1. Submit peer selection form again for the same employee
2. **Verify**: Sheet updates with new selections (doesn't create duplicate row)

### 6.3 Missing Employee in Sheet

1. Try to submit manager confirmation for an employee not in Manager Confirmation sheet
2. **Verify**: Error logged, no crash

## Step 7: Test Reminder Functions (Optional)

### 7.1 Test Reminders

1. In your **main Apps Script**
2. Run `sendReminders()` function
3. Check execution log - should show reminders sent to employees with incomplete reviews

### 7.2 Test Manager Reminders

1. Run `sendManagerReminders()` function
2. Check execution log - should show reminders sent to managers with pending confirmations

### 7.3 Test Completion Status Check

1. Run `checkCompletionStatus()` function
2. Check execution log - should show status updates

## Troubleshooting

### Form Not Updating Sheet

- **Check trigger**: Make sure trigger is set to "From form" → "On form submit" → `onFormSubmit`
- **Check SPREADSHEET_ID**: Verify it's correct in the form script
- **Check execution log**: Look for errors in the form's script editor

### Email Not Sending

- **Check email settings**: Verify FROM_EMAIL and REPLY_TO in main Code.gs
- **Check permissions**: Make sure script has permission to send emails
- **Check execution log**: Look for email errors

### Sheet Not Found Errors

- **Check sheet names**: Must match exactly: "Peer Selection", "Manager Confirmation", "Review Assignments"
- **Check setup()**: Run `setup()` to create all sheets with headers

### Employee List Not Updating in Forms

- **Check question title**: Must match exactly (case-sensitive)
- **Check Employees sheet**: Must have data with Status = "Active"
- **Run updateEmployeeList()**: From the form's script editor

## Quick Test Checklist

Use this to quickly verify everything works:

- [ ] Employees sheet has test data
- [ ] `setup()` ran successfully
- [ ] `updateEmployeeList()` worked for both forms
- [ ] `sendPeerSelectionInvites()` sent email
- [ ] Peer selection form submission updated sheet
- [ ] `sendManagerConfirmationEmails()` sent email
- [ ] Manager confirmation form submission updated sheet
- [ ] `sendReviewAssignments()` sent email
- [ ] Review form submission updated sheet
- [ ] All execution logs show success

## Next Steps After Testing

Once testing is successful:

1. **Add real employee data** to Employees sheet
2. **Update email settings** (FROM_EMAIL, REPLY_TO) in all scripts
3. **Set up time-driven triggers** for reminders (optional)
4. **Test with a small group** (2-3 real employees)
5. **Roll out to full team** once confident

## Summary

**Test Order:**
1. Setup and data preparation
2. Populate forms with employee lists
3. Test peer selection (send → submit → verify)
4. Test manager confirmation (send → submit → verify)
5. Test review assignment (send → submit → verify)
6. Test edge cases and reminders

**Each test should verify:**
- Email sent ✅
- Form opens correctly ✅
- Submission works ✅
- Sheet updates automatically ✅
- Execution log shows success ✅

Good luck! 🚀

