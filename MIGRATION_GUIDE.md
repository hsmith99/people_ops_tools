# Migration Guide: Single Sheet to Multi-Sheet Architecture

This guide helps you migrate from the single-sheet architecture to the new multi-sheet architecture.

## Overview of Changes

### Old Architecture (Single Sheet)
- One "Employees" sheet with 16 columns
- All phases tracked in same sheet
- Peer reviewers stored as comma-separated values

### New Architecture (Multi-Sheet)
- **Employees**: Master employee data (7 columns)
- **Peer Selection**: Phase 1 tracking (16 columns)
- **Manager Confirmation**: Phase 2 tracking (18 columns)
- **Review Assignments**: Phase 3 tracking (9 columns, one row per review)
- **Dashboard**: Summary and reporting (optional)

### Key Changes
1. **Separate sheets** for each phase
2. **Individual columns** for each peer reviewer (Name + Email pairs)
3. **Review Assignments** sheet with one row per review (not per employee)
4. **Better organization** and scalability

## Migration Steps

### Step 1: Backup Your Current Sheet

1. Make a copy of your current Google Sheet
2. Name it "Performance Review System - Backup [Date]"
3. Verify all data is intact

### Step 2: Update Apps Script Code

1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. **Replace** the entire contents of `Code.gs` with the new multi-sheet version
4. Update `CONFIG` section with your form IDs
5. Update `FORM_ENTRY_IDS` with your actual entry IDs
6. Save the project

### Step 3: Create New Sheet Structure

The `setup()` function will automatically create the new sheets, but you can also create them manually:

#### Sheet 1: "Employees"
- Import `employees_template.csv` or create manually
- Columns: Employee Email, Employee Name, Manager Email, Manager Name, Is Manager, Department, Status
- Copy your employee data from the old sheet

#### Sheet 2: "Peer Selection"
- Will be created automatically by `setup()`
- Or create manually with headers from `sheet_structure_multi.md`

#### Sheet 3: "Manager Confirmation"
- Will be created automatically by `setup()`

#### Sheet 4: "Review Assignments"
- Will be created automatically by `setup()`

#### Sheet 5: "Dashboard" (Optional)
- Create manually for reporting
- See `sheet_structure_multi.md` for structure

### Step 4: Migrate Employee Data

1. Copy employee data from old sheet to new "Employees" sheet:
   - Employee Email
   - Employee Name
   - Manager Email
   - Manager Name
   - Is Manager
   - Add Department and Status columns (set Status to "Active" for current employees)

### Step 5: Migrate Existing Phase Data (If Applicable)

If you have an ongoing review cycle, you'll need to migrate data:

#### Migrate Peer Selection Data

**Old format**: Comma-separated emails in one column
**New format**: Separate columns for each peer (Name + Email)

```javascript
// Run this migration script once
function migratePeerSelectionData() {
  const oldSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Employees'); // Your old sheet
  const newSheet = getSheet(CONFIG.SHEET_PEER_SELECTION);
  
  const oldData = oldSheet.getDataRange().getValues();
  const employees = getEmployeeData();
  const emailToName = {};
  employees.forEach(emp => {
    emailToName[emp.email] = emp.name;
  });
  
  for (let i = 1; i < oldData.length; i++) {
    const email = oldData[i][CONFIG.COL_EMPLOYEE_EMAIL];
    const status = oldData[i][CONFIG.COL_PEER_SELECTION_STATUS];
    const peersStr = oldData[i][CONFIG.COL_PEER_REVIEWERS_SELECTED];
    
    if (status === 'Completed' && peersStr) {
      const peerEmails = peersStr.split(',').map(e => e.trim());
      const row = [
        email,
        emailToName[email] || email,
        status,
        '', '', '', '', '', '', '', '', '', '', // Will be filled below
        new Date(),
        0,
        ''
      ];
      newSheet.appendRow(row);
      
      const rowIndex = newSheet.getLastRow();
      storePeerReviewers(newSheet, rowIndex, peerEmails, CONFIG.PS_COL_PEER1_NAME);
    }
  }
  
  Logger.log('Peer Selection data migrated');
}
```

#### Migrate Manager Confirmation Data

Similar process for manager confirmation data.

### Step 6: Test the System

1. Run `setup()` to initialize all sheets
2. Test with a small group:
   - Run `sendPeerSelectionInvites()` for 2-3 employees
   - Submit test forms
   - Verify data appears in correct sheets
   - Check that peer reviewers are stored in separate columns

### Step 7: Update Permissions

Set appropriate permissions for each sheet:
- **Employees**: HR only (edit), others (view)
- **Peer Selection**: System (edit), employees (view own)
- **Manager Confirmation**: System (edit), managers (view their team)
- **Review Assignments**: System (edit), employees (view own)
- **Dashboard**: Everyone (view only)

### Step 8: Archive Old Sheet

Once migration is complete and tested:
1. Rename old sheet to "Archived - [Date]"
2. Or move it to a separate spreadsheet
3. Update any external references

## Rollback Plan

If you need to rollback:
1. Use your backup sheet
2. Restore old `Code.gs` from version control (if you have it)
3. Re-run old setup function

## Common Issues

### Issue: "Sheet not found" errors
**Solution**: Run `setup()` function to create all required sheets

### Issue: Peer reviewers not showing in separate columns
**Solution**: Check that `storePeerReviewers()` function is being called correctly

### Issue: Data not migrating correctly
**Solution**: Run migration scripts step by step and verify each step

### Issue: Formulas in Dashboard not working
**Solution**: Update formula references to use new sheet names

## Post-Migration Checklist

- [ ] All employees migrated to Employees sheet
- [ ] All sheets created and initialized
- [ ] Test peer selection workflow works
- [ ] Test manager confirmation workflow works
- [ ] Test review assignment workflow works
- [ ] Verify peer reviewers stored in separate columns
- [ ] Permissions set correctly
- [ ] Dashboard formulas working (if using)
- [ ] Old sheet archived
- [ ] Team notified of new structure

## Need Help?

If you encounter issues during migration:
1. Check the execution log in Apps Script
2. Verify all sheet names match CONFIG
3. Ensure form IDs are correct
4. Test with a small subset first

