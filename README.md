# Performance Review System (Multi-Sheet Architecture)

A comprehensive Google Sheets, Google Forms, and Apps Script-based performance review system that automates the entire review process from peer selection to completion tracking.

## Architecture

This system uses a **multi-sheet architecture** for better organization and scalability:
- **Employees Sheet**: Master employee data
- **Peer Selection Sheet**: Phase 1 - Employee peer reviewer selection
- **Manager Confirmation Sheet**: Phase 2 - Manager confirmation of peer reviewers
- **Review Assignments Sheet**: Phase 3 - All review assignments (one row per review)
- **Dashboard Sheet**: Summary and reporting (optional)

## System Overview

This system automates:
1. **Peer Reviewer Selection**: Employees select exactly 5 peers to review them
2. **Manager Confirmation**: Managers confirm/reselect peer reviewers for their direct reports
3. **Review Assignment**: Employees receive assignments for self-review, manager review, peer reviews, and direct report reviews
4. **Completion Tracking**: System tracks completion status from form responses
5. **Reminder System**: Automated reminders until all reviews are completed

## Key Features

- **Separate columns for each peer reviewer**: Instead of comma-separated values, each peer reviewer has dedicated Name and Email columns (Peer Reviewer 1 Name, Peer Reviewer 1 Email, etc.)
- **Scalable architecture**: Separate sheets for each phase improve performance with large teams
- **Better organization**: Clear separation of concerns makes the system easier to manage
- **Historical tracking**: Each phase's data is preserved separately

## Setup Instructions

### Step 1: Create Google Sheet

1. Create a new Google Sheet
2. Name it "Performance Review System"
3. Run the `setup()` function in Apps Script to automatically create all required sheets
4. Or manually create sheets using the templates:

**Sheet: "Employees"** (Master Data)
- Column A: Employee Email
- Column B: Employee Name
- Column C: Manager Email
- Column D: Manager Name
- Column E: Is Manager (TRUE/FALSE)
- Column F: Department
- Column G: Status (Active/Inactive)

**Sheet: "Peer Selection"** (Phase 1)
- Employee Email, Employee Name, Selection Status
- Peer Reviewer 1 Name, Peer Reviewer 1 Email
- Peer Reviewer 2 Name, Peer Reviewer 2 Email
- Peer Reviewer 3 Name, Peer Reviewer 3 Email
- Peer Reviewer 4 Name, Peer Reviewer 4 Email
- Peer Reviewer 5 Name, Peer Reviewer 5 Email
- Date Selected, Reminder Count, Last Reminder Sent

**Sheet: "Manager Confirmation"** (Phase 2)
- Employee Email, Employee Name, Manager Email, Manager Name, Confirmation Status
- Confirmed Peer Reviewer 1 Name, Confirmed Peer Reviewer 1 Email
- Confirmed Peer Reviewer 2 Name, Confirmed Peer Reviewer 2 Email
- Confirmed Peer Reviewer 3 Name, Confirmed Peer Reviewer 3 Email
- Confirmed Peer Reviewer 4 Name, Confirmed Peer Reviewer 4 Email
- Confirmed Peer Reviewer 5 Name, Confirmed Peer Reviewer 5 Email
- Date Confirmed, Reminder Count, Last Reminder Sent

**Sheet: "Review Assignments"** (Phase 3)
- Reviewer Email, Reviewer Name, Reviewee Email, Reviewee Name
- Review Type, Assignment Status, Date Assigned, Date Completed, Form Response ID

See `sheet_structure_multi.md` for complete structure details.

### Step 2: Create Google Forms

You'll need to create 3 Google Forms:

1. **Peer Reviewer Selection Form** (`peer_selection_form.html`)
   - Employee Name (pre-filled via URL - visible but should not be modified)
   - Employee Email (pre-filled via URL - visible but should not be modified)
   - Select Peer Reviewers (Checkbox grid with all employees - must select exactly 5)

2. **Manager Peer Reviewer Confirmation Form** (`manager_confirmation_form.html`)
   - Employee Name (pre-filled via URL - visible but should not be modified)
   - Employee Email (pre-filled via URL - visible but should not be modified)
   - Selected Peer Reviewers (info display)
   - Confirm/Reselect Peer Reviewers (Checkbox grid)

3. **Performance Review Form** (`review_form.html`)
   - Reviewer Email (pre-filled via URL - visible but should not be modified)
   - Reviewee Email (pre-filled via URL - visible but should not be modified)
   - Review Type (Self/Manager/Peer/Direct Report) (pre-filled via URL - visible but should not be modified)
   - Review Questions (your standard review questions)

**Important Note**: Google Forms does not support truly hidden fields. All pre-filled fields will be visible to users. Add clear descriptions instructing users not to modify these fields. See `URL_PREFILL_GUIDE.md` for detailed setup instructions.

### Step 3: Set Up Apps Script

1. In your Google Sheet, go to Extensions → Apps Script
2. Copy the code from `Code.gs` into the editor
3. Update the configuration section with:
   - Your form IDs
   - Email templates
   - Your organization's email domain
4. Save the project
5. Set up triggers (see Triggers section below)

### Step 4: Configure OAuth and Permissions

1. Run the `setup` function once to authorize permissions
2. Grant necessary permissions:
   - Read/Write Google Sheets
   - Send emails via Gmail
   - Access Google Forms

## Workflow

### Phase 1: Peer Reviewer Selection

1. Run `sendPeerSelectionInvites()` to send emails to all employees
2. Employees complete the peer selection form
3. Form responses are automatically recorded via `onPeerSelectionSubmit()`

### Phase 2: Manager Confirmation

1. Run `sendManagerConfirmationEmails()` after all employees have selected peers
2. Managers receive emails with hyperlinked employee names
3. Managers complete confirmation form
4. Responses update via `onManagerConfirmationSubmit()`

### Phase 3: Review Assignment

1. Run `sendReviewAssignments()` after all managers have confirmed
2. Employees receive emails with all their review assignments
3. Each assignment is a hyperlinked form

### Phase 4: Completion Tracking

1. Form responses are tracked via `onReviewFormSubmit()`
2. Completion status is updated automatically
3. Reminders are sent via `sendReminders()` (run on a schedule)

## Functions Reference

### Main Functions

- `sendPeerSelectionInvites()`: Send initial peer selection invites
- `sendManagerConfirmationEmails()`: Send manager confirmation emails
- `sendReviewAssignments()`: Send review assignment emails
- `sendReminders()`: Send reminder emails to incomplete reviews
- `checkCompletionStatus()`: Check and update completion status

### Event Handlers

- `onPeerSelectionSubmit(e)`: Handle peer selection form submissions
- `onManagerConfirmationSubmit(e)`: Handle manager confirmation submissions
- `onReviewFormSubmit(e)`: Handle review form submissions

## Triggers Setup

Set up the following time-driven triggers in Apps Script:

1. **Daily Reminder Check**: Run `sendReminders()` daily at 9 AM
2. **Completion Status Check**: Run `checkCompletionStatus()` every 6 hours

## Email Templates

Email templates are defined in the `EMAIL_TEMPLATES` object in `Code.gs`. Customize these to match your organization's style.

## Troubleshooting

- **Emails not sending**: Check Gmail API permissions
- **Form responses not recording**: Verify form IDs and response handlers
- **Completion status not updating**: Check form response structure matches expected format

## Support

For issues or questions, check the code comments in `Code.gs` for detailed explanations of each function.

