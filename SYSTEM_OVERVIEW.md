# Performance Review System - Complete Overview

## System Architecture

This performance review system is built on three core Google Workspace components:

1. **Google Sheets**: Central data repository tracking all employees, statuses, and relationships
2. **Google Forms**: Three forms for data collection (peer selection, manager confirmation, reviews)
3. **Google Apps Script**: Automation engine handling emails, form processing, and status updates

## Workflow Phases

### Phase 1: Peer Reviewer Selection
**Goal**: Employees select peers who will review them

**Process**:
1. HR runs `sendPeerSelectionInvites()`
2. System sends email to each employee with link to peer selection form
3. Employee completes form selecting exactly 5 peers
4. Form submission triggers `onPeerSelectionSubmit()`
5. Sheet updates: Peer Selection Status = "Completed", Peer Reviewers Selected = [emails]

**Key Functions**:
- `sendPeerSelectionInvites()`: Initiates the process
- `onPeerSelectionSubmit(e)`: Processes form responses

**Status Tracking**:
- `Peer Selection Status`: Not Started → Pending → Completed
- `Peer Reviewers Selected`: Comma-separated list of emails

---

### Phase 2: Manager Confirmation
**Goal**: Managers review and confirm (or modify) peer reviewer selections

**Process**:
1. HR runs `sendManagerConfirmationEmails()` after all employees have selected peers
2. System groups employees by manager
3. System sends email to each manager with hyperlinked employee names
4. Each link opens form with pre-filled employee info and selected peers
5. Manager confirms or modifies peer selections
6. Form submission triggers `onManagerConfirmationSubmit()`
7. Sheet updates: Manager Confirmation Status = "Completed", Confirmed Peer Reviewers = [emails]

**Key Functions**:
- `sendManagerConfirmationEmails()`: Initiates the process
- `onManagerConfirmationSubmit(e)`: Processes form responses
- `sendManagerReminders()`: Sends reminders to managers with incomplete confirmations

**Status Tracking**:
- `Manager Confirmation Status`: Pending → Completed
- `Confirmed Peer Reviewers`: Final list of peer reviewer emails

---

### Phase 3: Review Assignment
**Goal**: Assign all reviews to each employee

**Process**:
1. HR runs `sendReviewAssignments()` after all managers have confirmed
2. System calculates review assignments for each employee:
   - **Self Review**: Always required
   - **Manager Review**: Required if employee has a manager
   - **Peer Reviews**: Required for each confirmed peer reviewer
   - **Direct Report Reviews**: Required if employee is a manager
3. System sends email to each employee with hyperlinked review assignments
4. Each link opens review form with pre-filled reviewer/reviewee info
5. Employee completes reviews over time
6. Form submissions trigger `onReviewFormSubmit()`
7. Sheet updates: Individual review status columns = "Completed"

**Key Functions**:
- `sendReviewAssignments()`: Initiates the process
- `onReviewFormSubmit(e)`: Processes each review submission
- `checkCompletionStatus()`: Updates overall completion status

**Status Tracking**:
- `Review Assignment Status`: Not Started → Assigned → Completed
- `Self Review Status`: Not Started → In Progress → Completed
- `Manager Review Status`: Not Started → In Progress → Completed
- `Peer Reviews Status`: Not Started → In Progress → Completed
- `Direct Reports Review Status`: Not Started → In Progress → Completed

---

### Phase 4: Completion & Reminders
**Goal**: Ensure all reviews are completed

**Process**:
1. Automated triggers run `sendReminders()` daily
2. System checks each employee's completion status
3. System identifies incomplete reviews
4. System sends reminder emails to employees with incomplete reviews
5. System tracks reminder count and last reminder date
6. System stops sending after MAX_REMINDERS reached
7. When all reviews complete, Review Assignment Status = "Completed"

**Key Functions**:
- `sendReminders()`: Sends reminders to employees
- `sendManagerReminders()`: Sends reminders to managers
- `checkCompletionStatus()`: Updates completion status

**Status Tracking**:
- `Last Reminder Sent`: Date of last reminder
- `Reminder Count`: Number of reminders sent

---

## Data Flow

```
Employee Data (Sheet)
    ↓
sendPeerSelectionInvites()
    ↓
Email → Employee → Form Submission
    ↓
onPeerSelectionSubmit() → Sheet Update
    ↓
sendManagerConfirmationEmails()
    ↓
Email → Manager → Form Submission
    ↓
onManagerConfirmationSubmit() → Sheet Update
    ↓
sendReviewAssignments()
    ↓
Email → Employee → Multiple Form Submissions
    ↓
onReviewFormSubmit() → Sheet Update (per review)
    ↓
checkCompletionStatus() → Final Status Update
```

## Key Design Decisions

### 1. Single Sheet Design
- All employee data and status tracking in one sheet
- Easy to view and manage
- Simple relationships (manager-employee)

### 2. Form-Based Data Collection
- Uses Google Forms for structured input
- Pre-filled hidden fields for context
- URL parameters for form pre-population

### 3. Event-Driven Updates
- Form submissions trigger automatic updates
- No manual data entry required
- Real-time status tracking

### 4. Email-Based Workflow
- All actions initiated via email
- Hyperlinked forms for easy access
- Reminder system for follow-up

### 5. Status-Based Tracking
- Multiple status columns for granular tracking
- Clear workflow states (Not Started → Pending → Completed)
- Easy to identify bottlenecks

## File Structure

```
people_ops_tools/
├── README.md                    # Main documentation
├── QUICK_START.md              # Step-by-step setup guide
├── Code.gs                     # Main Apps Script code
├── sheet_template.csv          # Sheet structure template
├── FORM_SETUP.md               # Detailed form setup instructions
├── TRIGGERS_SETUP.md           # Trigger configuration guide
├── CONFIGURATION_CHECKLIST.md  # Pre-production checklist
└── SYSTEM_OVERVIEW.md          # This file
```

## Customization Points

### 1. Email Templates
Location: `EMAIL_TEMPLATES` object in `Code.gs`
- Customize HTML styling
- Add company branding
- Modify messaging tone

### 2. Review Questions
Location: Form 3 (Performance Review Form)
- Add/remove questions
- Change question types
- Add conditional logic

### 3. Reminder Settings
Location: `CONFIG` object in `Code.gs`
- `REMINDER_INTERVAL_DAYS`: How often to send reminders
- `MAX_REMINDERS`: Maximum reminders per person

### 4. Form Structure
- Modify form questions
- Add validation rules
- Change question types

### 5. Status Values
- Customize status text (e.g., "In Progress" → "Started")
- Add additional status columns if needed

## Scalability Considerations

### Current Limitations
- Manual employee list updates in forms
- Single sheet for all data (may slow with 1000+ employees)
- No built-in reporting/analytics

### Potential Enhancements
1. **Dynamic Form Updates**: Script to automatically update employee lists in forms
2. **Multi-Sheet Architecture**: Separate sheets for different phases
3. **Reporting Dashboard**: Automated reports on completion rates
4. **Integration**: Connect to HRIS systems for employee data
5. **Notifications**: Slack/Teams integration for reminders
6. **Analytics**: Track time-to-completion, response rates

## Security Considerations

1. **Email Access**: Only authorized users should have access to the sheet
2. **Form Access**: Forms should be accessible only to intended recipients
3. **Data Privacy**: Review responses contain sensitive information
4. **Access Control**: Limit sheet editing permissions
5. **Audit Trail**: Consider logging all status changes

## Maintenance

### Regular Tasks
- Update employee list when people join/leave
- Review and update form questions annually
- Monitor execution logs for errors
- Backup sheet and Apps Script project monthly
- Review reminder effectiveness

### Troubleshooting
- Check execution logs first
- Verify form IDs are correct
- Test functions manually before relying on triggers
- Verify email permissions
- Check sheet name matches CONFIG

## Support & Resources

- **Google Apps Script Documentation**: https://developers.google.com/apps-script
- **Google Forms API**: https://developers.google.com/apps-script/reference/forms
- **Google Sheets API**: https://developers.google.com/apps-script/reference/spreadsheet
- **Gmail API**: https://developers.google.com/apps-script/reference/gmail

## Version History

- **v1.0**: Initial release with core functionality
  - Peer selection workflow
  - Manager confirmation workflow
  - Review assignment workflow
  - Reminder system
  - Completion tracking

---

**Last Updated**: [Date]
**Maintained By**: [Your Team]

