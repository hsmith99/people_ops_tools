# Configuration Checklist

Use this checklist to verify your Performance Review System is properly configured before running your first review cycle.

## Pre-Setup Checklist

- [ ] Google Workspace account with Sheets, Forms, and Apps Script access
- [ ] Gmail API enabled (usually enabled by default)
- [ ] List of all employees with their emails and manager relationships
- [ ] Decision on review questions and form structure

## Google Sheet Setup

- [ ] Sheet created and named "Performance Review System" (or update CONFIG.SHEET_NAME)
- [ ] All required columns present (16 columns total)
- [ ] Headers match exactly (case-sensitive):
  - Employee Email
  - Employee Name
  - Manager Email
  - Manager Name
  - Is Manager
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
- [ ] Employee data populated (at minimum: email, name, manager email, manager name, is manager)
- [ ] Tested that `setup()` function initializes status columns correctly

## Google Forms Setup

### Form 1: Peer Reviewer Selection
- [ ] Form created
- [ ] Form ID copied (from URL: between `/d/` and `/viewform`)
- [ ] Employee Email question added (Short answer, required)
- [ ] Employee Name question added (Short answer, required)
- [ ] Peer Reviewer selection question added (Checkbox, required)
- [ ] Employee list populated in checkbox options (Format: "Name (email@company.com)" - see FORM_EMPLOYEE_LIST_FORMAT.md)
- [ ] Form published and accessible
- [ ] Test submission works

### Form 2: Manager Confirmation
- [ ] Form created
- [ ] Form ID copied
- [ ] Employee Email question added (Short answer, required, hidden)
- [ ] Employee Name question added (Short answer, required, hidden)
- [ ] Selected Peer Reviewers info/question added
- [ ] Confirm/Reselect question added (Checkbox, required)
- [ ] Employee list populated in checkbox options (Format: "Name (email@company.com)" - see FORM_EMPLOYEE_LIST_FORMAT.md)
- [ ] Form published and accessible
- [ ] Test submission works

### Form 3: Performance Review
- [ ] Form created
- [ ] Form ID copied
- [ ] Reviewer Email question added (Short answer, required, hidden)
- [ ] Reviewee Email question added (Short answer, required, hidden)
- [ ] Review Type question added (Short answer, required, hidden)
- [ ] Review questions added (5-10 standard questions)
- [ ] Form published and accessible
- [ ] Test submission works

## Apps Script Configuration

- [ ] Apps Script project created and saved
- [ ] `Code.gs` file copied into Apps Script editor
- [ ] CONFIG section updated with:
  - [ ] `SHEET_NAME` matches your sheet name
  - [ ] `PEER_SELECTION_FORM_ID` matches Form 1 ID
  - [ ] `MANAGER_CONFIRMATION_FORM_ID` matches Form 2 ID
  - [ ] `REVIEW_FORM_ID` matches Form 3 ID
  - [ ] `FROM_EMAIL` set to valid email address
  - [ ] `REPLY_TO` set to HR/contact email
- [ ] Column indices verified (if you modified the sheet structure)
- [ ] Email templates reviewed and customized (if needed)
- [ ] Reminder settings configured:
  - [ ] `REMINDER_INTERVAL_DAYS` set (default: 3)
  - [ ] `MAX_REMINDERS` set (default: 5)

## Permissions & Authorization

- [ ] `setup()` function run successfully
- [ ] All permissions granted:
  - [ ] Google Sheets (read/write)
  - [ ] Gmail (send emails)
  - [ ] Google Forms (read responses)
- [ ] No authorization errors in execution log

## Triggers Setup

- [ ] **Form Submission Triggers:**
  - [ ] `onPeerSelectionSubmit` trigger created for Form 1
  - [ ] `onManagerConfirmationSubmit` trigger created for Form 2
  - [ ] `onReviewFormSubmit` trigger created for Form 3
  - [ ] All triggers show "Active" status

- [ ] **Time-Driven Triggers:**
  - [ ] `sendReminders` trigger created (daily, 9am)
  - [ ] `sendManagerReminders` trigger created (daily, 9am)
  - [ ] `checkCompletionStatus` trigger created (every 6 hours)
  - [ ] All triggers show "Active" status

## Testing Checklist

### Test 1: Peer Selection Workflow
- [ ] Run `sendPeerSelectionInvites()` manually
- [ ] Receive test email with form link
- [ ] Form link works and pre-fills employee info
- [ ] Submit form with test peer selections
- [ ] Sheet updates: "Peer Selection Status" = "Completed"
- [ ] Sheet updates: "Peer Reviewers Selected" contains selected emails
- [ ] Execution log shows no errors

### Test 2: Manager Confirmation Workflow
- [ ] Run `sendManagerConfirmationEmails()` manually
- [ ] Manager receives email with employee links
- [ ] Click employee link - form opens with pre-filled data
- [ ] Submit confirmation form
- [ ] Sheet updates: "Manager Confirmation Status" = "Completed"
- [ ] Sheet updates: "Confirmed Peer Reviewers" contains confirmed emails
- [ ] Execution log shows no errors

### Test 3: Review Assignment Workflow
- [ ] Run `sendReviewAssignments()` manually
- [ ] Employee receives email with review links
- [ ] All review types present (self, manager, peers, direct reports if applicable)
- [ ] Click review link - form opens with pre-filled data
- [ ] Submit test review
- [ ] Sheet updates: Appropriate status column = "Completed"
- [ ] Execution log shows no errors

### Test 4: Reminder System
- [ ] Run `sendReminders()` manually
- [ ] Employees with incomplete reviews receive reminder emails
- [ ] Reminder count increments in sheet
- [ ] Last reminder date updates
- [ ] No reminders sent to completed employees
- [ ] Execution log shows no errors

### Test 5: Completion Tracking
- [ ] Run `checkCompletionStatus()` manually
- [ ] Sheet updates correctly when all reviews are complete
- [ ] "Review Assignment Status" changes to "Completed" when done
- [ ] Execution log shows no errors

## Data Validation

- [ ] All employee emails are valid and accessible
- [ ] All manager emails are valid and accessible
- [ ] Manager-employee relationships are correct
- [ ] "Is Manager" column accurately reflects manager status
- [ ] No duplicate employee emails
- [ ] No circular manager relationships

## Email Configuration

- [ ] `FROM_EMAIL` is a valid email in your domain
- [ ] Email templates are customized with your branding
- [ ] Test emails are being received (check spam folder)
- [ ] Email links are working correctly
- [ ] Reply-to address is monitored

## Production Readiness

- [ ] All tests pass
- [ ] Backup of Apps Script project created
- [ ] Backup of Google Sheet created
- [ ] Documentation reviewed by team
- [ ] HR team trained on system
- [ ] Support contact identified for issues
- [ ] Rollout plan created (if applicable)

## Post-Setup Monitoring

After first run, monitor:
- [ ] Execution logs for errors
- [ ] Email delivery rates
- [ ] Form submission rates
- [ ] Sheet update accuracy
- [ ] Trigger execution frequency
- [ ] User feedback and issues

## Common Issues to Verify

- [ ] Form question titles match exactly (case-sensitive) what code expects
- [ ] Form IDs are correct (no extra spaces or characters)
- [ ] Sheet name matches CONFIG exactly
- [ ] Employee emails in sheet match actual email addresses
- [ ] No special characters breaking email addresses
- [ ] Time zone settings correct for triggers
- [ ] Gmail API quotas not exceeded

## Sign-Off

- [ ] All items checked
- [ ] System tested end-to-end
- [ ] Ready for production use
- [ ] Date: _______________
- [ ] Verified by: _______________

---

**Note**: Keep this checklist updated as you make changes to the system. It's a living document that should reflect your current configuration.

