# Sheet Templates Guide

This directory contains CSV templates for all sheets in the Performance Review System. Use these templates to set up your Google Sheets.

## Template Files

### 1. `01_employees_template.csv` - Employees Sheet (Master Data)

**Purpose**: Source of truth for all employee information

**Columns**:
- Employee Email (required)
- Employee Name (required)
- Manager Email (optional - leave empty for top-level managers)
- Manager Name (optional)
- Is Manager (TRUE/FALSE)
- Department (optional)
- Status (Active/Inactive)

**Usage**:
1. Import this CSV into a new Google Sheet
2. Name the sheet "Employees"
3. Fill in your actual employee data
4. Ensure all active employees have Status = "Active"

**Example Data**:
```csv
Employee Email,Employee Name,Manager Email,Manager Name,Is Manager,Department,Status
john.doe@company.com,John Doe,jane.manager@company.com,Jane Manager,TRUE,Engineering,Active
```

---

### 2. `02_peer_selection_template.csv` - Peer Selection Sheet (Phase 1)

**Purpose**: Tracks employee peer reviewer selection

**Columns**:
- Employee Email (reference to Employees sheet)
- Employee Name
- Selection Status (Not Started/Pending/Completed/Invalid)
- Peer Reviewer 1 Name, Peer Reviewer 1 Email
- Peer Reviewer 2 Name, Peer Reviewer 2 Email
- Peer Reviewer 3 Name, Peer Reviewer 3 Email
- Peer Reviewer 4 Name, Peer Reviewer 4 Email
- Peer Reviewer 5 Name, Peer Reviewer 5 Email
- Date Selected
- Reminder Count
- Last Reminder Sent

**Usage**:
1. Import this CSV into your Google Sheet
2. Name the sheet "Peer Selection"
3. The `setup()` function will automatically populate this sheet when you run `sendPeerSelectionInvites()`
4. You can also manually add rows if needed

**Note**: Peer reviewer columns will be filled automatically when employees submit the peer selection form.

---

### 3. `03_manager_confirmation_template.csv` - Manager Confirmation Sheet (Phase 2)

**Purpose**: Tracks manager confirmation of peer reviewers

**Columns**:
- Employee Email (reference to Employees sheet)
- Employee Name
- Manager Email
- Manager Name
- Confirmation Status (Not Started/Pending/Completed)
- Confirmed Peer Reviewer 1 Name, Confirmed Peer Reviewer 1 Email
- Confirmed Peer Reviewer 2 Name, Confirmed Peer Reviewer 2 Email
- Confirmed Peer Reviewer 3 Name, Confirmed Peer Reviewer 3 Email
- Confirmed Peer Reviewer 4 Name, Confirmed Peer Reviewer 4 Email
- Confirmed Peer Reviewer 5 Name, Confirmed Peer Reviewer 5 Email
- Date Confirmed
- Reminder Count
- Last Reminder Sent

**Usage**:
1. Import this CSV into your Google Sheet
2. Name the sheet "Manager Confirmation"
3. The `setup()` function will automatically populate this sheet when you run `sendManagerConfirmationEmails()`
4. Managers will fill in the confirmed peer reviewers via the confirmation form

**Note**: Confirmed peer reviewer columns will be filled automatically when managers submit the confirmation form.

---

### 4. `04_review_assignments_template.csv` - Review Assignments Sheet (Phase 3)

**Purpose**: Tracks all review assignments (one row per review)

**Columns**:
- Reviewer Email (who is doing the review)
- Reviewer Name
- Reviewee Email (who is being reviewed)
- Reviewee Name
- Review Type (Self/Manager/Peer/Direct Report)
- Assignment Status (Not Started/Assigned/In Progress/Completed)
- Date Assigned
- Date Completed
- Form Response ID (link to actual review response)

**Usage**:
1. Import this CSV into your Google Sheet
2. Name the sheet "Review Assignments"
3. The `setup()` function will automatically populate this sheet when you run `sendReviewAssignments()`
4. One row is created for each review needed (self-review, manager review, each peer review, each direct report review)

**Example**: For an employee with 5 peer reviewers, you'll have:
- 1 row for self-review
- 1 row for manager review (if they have a manager)
- 5 rows for peer reviews
- N rows for direct report reviews (if they are a manager)

**Total**: ~7-15 rows per employee depending on their role

---

### 5. `05_dashboard_template.csv` - Dashboard Sheet (Optional)

**Purpose**: Summary and reporting view

**Columns**:
- Employee Email
- Employee Name
- Manager Name
- Phase 1 Status (from Peer Selection sheet)
- Phase 2 Status (from Manager Confirmation sheet)
- Phase 3 Self Review Status
- Phase 3 Manager Review Status
- Phase 3 Peer Reviews Status
- Phase 3 Direct Reports Review Status
- Overall Completion % (calculated)
- Days Since Start
- Blockers/Issues

**Usage**:
1. Import this CSV into your Google Sheet
2. Name the sheet "Dashboard"
3. Add formulas to pull data from other sheets (see formulas below)
4. This sheet is optional but recommended for reporting

**Formulas** (add these in the Dashboard sheet):

**Phase 1 Status** (Column D):
```
=IFERROR(INDEX('Peer Selection'!C:C, MATCH(A2, 'Peer Selection'!A:A, 0)), "Not Started")
```

**Phase 2 Status** (Column E):
```
=IFERROR(INDEX('Manager Confirmation'!E:E, MATCH(A2, 'Manager Confirmation'!A:A, 0)), "Not Started")
```

**Overall Completion %** (Column J):
```
=IF(COUNTIF('Review Assignments'!A:A, A2)=0, "0%", 
  TEXT(COUNTIFS('Review Assignments'!A:A, A2, 'Review Assignments'!F:F, "Completed") / 
  COUNTIF('Review Assignments'!A:A, A2), "0%"))
```

---

## Setup Instructions

### Option 1: Manual Import (Recommended for First Time)

1. **Create Google Sheet**: Create a new Google Sheet named "Performance Review System"

2. **Import Each Template**:
   - Go to File → Import
   - Upload each CSV file
   - Choose "Insert new sheet(s)"
   - Name each sheet according to the template name

3. **Verify Sheet Names**:
   - Employees
   - Peer Selection
   - Manager Confirmation
   - Review Assignments
   - Dashboard (optional)

4. **Run Setup Function**: In Apps Script, run `setup()` to verify everything is correct

### Option 2: Use Setup Function (Easier)

1. **Create Google Sheet**: Create a new Google Sheet named "Performance Review System"

2. **Add Employee Data**: Manually add your employees to a sheet named "Employees" (or import `01_employees_template.csv`)

3. **Run Setup Function**: In Apps Script, run `setup()` - it will automatically create all other sheets with proper headers

4. **Verify**: Check that all sheets were created correctly

---

## Important Notes

### Column Order Matters
- The column order in the templates matches the CONFIG in `Code.gs`
- Don't rearrange columns without updating CONFIG

### Data Types
- **Is Manager**: Must be TRUE or FALSE (not Yes/No)
- **Status**: Use "Active" or "Inactive" (case-sensitive)
- **Dates**: Use standard date format (Google Sheets will auto-format)
- **Emails**: Must be valid email addresses

### Required vs Optional Columns

**Employees Sheet**:
- Required: Employee Email, Employee Name
- Optional: Manager Email, Manager Name, Is Manager, Department, Status

**Peer Selection Sheet**:
- All columns are managed by the system
- You typically don't need to manually edit this sheet

**Manager Confirmation Sheet**:
- All columns are managed by the system
- Managers fill this via the confirmation form

**Review Assignments Sheet**:
- All columns are managed by the system
- Created automatically when reviews are assigned

**Dashboard Sheet**:
- Employee Email and Employee Name are required
- Other columns can use formulas to pull from other sheets

---

## Troubleshooting

### "Sheet not found" errors
- Verify sheet names match exactly (case-sensitive): "Employees", "Peer Selection", etc.
- Run `setup()` function to create missing sheets

### Data not appearing
- Check that column order matches templates
- Verify data types (TRUE/FALSE, Active/Inactive)
- Check for extra spaces in email addresses

### Formulas not working
- Ensure sheet names in formulas match your actual sheet names
- Check that referenced columns exist
- Verify employee emails match across sheets

---

## Next Steps

After importing templates:

1. ✅ Verify all sheets exist with correct names
2. ✅ Add your employee data to Employees sheet
3. ✅ Run `setup()` function in Apps Script
4. ✅ Test with a small group before full rollout
5. ✅ Set up Google Forms (see `FORM_SETUP.md`)
6. ✅ Configure triggers (see `TRIGGERS_SETUP.md`)

---

## Support

For questions or issues:
- Check `QUICK_START.md` for setup guide
- Review `CONFIGURATION_CHECKLIST.md` for verification
- See `SYSTEM_OVERVIEW.md` for architecture details

