# Getting Started Checklist

Follow these steps in order to get your Performance Review System up and running.

## ✅ Completed Steps

- [x] Form IDs added to CONFIG
- [x] Form handler scripts copied to each form's script editor
- [x] Triggers set up for all three forms

## 📋 Next Steps

### Step 1: Get Your Spreadsheet ID

1. Open your Google Sheet (Performance Review System)
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Copy the `SPREADSHEET_ID` (the long string between `/d/` and `/edit`)
4. **Save this** - you'll need it for the form handler scripts

### Step 2: Update Form Handler Scripts with Spreadsheet ID

For each form's script editor, update the `SPREADSHEET_ID`:

#### Peer Selection Form Script:
1. Open Peer Selection Form → Script editor
2. Find: `const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';`
3. Replace with your actual spreadsheet ID
4. **Save**

#### Manager Confirmation Form Script:
1. Open Manager Confirmation Form → Script editor
2. Update `SPREADSHEET_ID`
3. **Save**

#### Review Form Script:
1. Open Performance Review Form → Script editor
2. Update `SPREADSHEET_ID`
3. **Save**

### Step 3: Initialize Your Sheets

1. In your **main Apps Script** (Sheet's script editor)
2. Run the `setup()` function
3. This will create all required sheets with proper headers
4. Check execution log - should say "Setup complete!"

### Step 4: Add Employee Data

1. Open your Google Sheet
2. Go to the **"Employees"** sheet
3. Add your employee data:
   - Employee Email
   - Employee Name
   - Manager Email
   - Manager Name
   - Is Manager (TRUE/FALSE)
   - Department (optional)
   - Status (set to "Active" for current employees)

**Example:**
```
Employee Email          | Employee Name | Manager Email        | Manager Name | Is Manager | Status
alice@company.com      | Alice Smith   | jane@company.com    | Jane Manager | FALSE     | Active
jane@company.com       | Jane Manager  |                      |              | TRUE      | Active
```

### Step 5: Get Form Entry IDs (For URL Pre-filling)

To enable URL pre-filling, you need entry IDs from each form:

#### Option A: Use Helper Function (Easier)

In your **main Apps Script**, run:

```javascript
// Get entry IDs for Peer Selection Form
getFormEntryIds('1FAIpQLSexU8yKfYbgc6-NBfko4DZ_RAyzcdAyOcAx3fqlxqccY7Sw0A');

// Get entry IDs for Manager Confirmation Form  
getFormEntryIds('1FAIpQLSdav1RDy1v97w7EwUjkxAQCp2RfunTNNFe8QP1xSy44QS4dBg');

// Get entry IDs for Review Form
getFormEntryIds('1FAIpQLSfI2cf6p6VOO0Cqa46J0RPuFtIm3BzFA2tZmvVGamfjZ74r3w');
```

Check the execution log for question titles and IDs.

#### Option B: Get from Form HTML

1. Open each form in browser
2. Right-click → "View Page Source"
3. Search for question text
4. Find `entry.XXXXX` - that's your entry ID

#### Update FORM_ENTRY_IDS in Code.gs

Once you have entry IDs, update in your main Code.gs:

```javascript
const FORM_ENTRY_IDS = {
  'Peer Selection Form': {
    'Employee Email': '123456789',  // Replace with actual
    'Employee Name': '987654321',   // Replace with actual
  },
  'Manager Confirmation Form': {
    'Employee Email': '111222333',  // Replace with actual
    'Employee Name': '444555666',   // Replace with actual
  },
  'Review Form': {
    'Reviewer Email': '777888999',  // Replace with actual
    'Reviewee Email': '000111222',   // Replace with actual
    'Review Type': '333444555',     // Replace with actual
  }
};
```

**Note**: Question titles must match exactly (case-sensitive)!

### Step 6: Update Employee Lists in Forms

1. In your **main Apps Script**
2. Run `updateAllFormEmployeeLists()`
3. Check execution log - should show employees added to both forms
4. **Verify**: Open your forms and check that employee lists are populated

### Step 7: Test the System

#### Test 1: Peer Selection
1. In main Apps Script, run `sendPeerSelectionInvites()`
2. Check your email - should receive form link
3. Open form link - should be pre-filled with your email/name
4. Select 5 peer reviewers
5. Submit form
6. **Check**: Peer Selection sheet should update automatically
7. **Check**: Status should be "Completed"

#### Test 2: Manager Confirmation
1. After peer selection is complete, run `sendManagerConfirmationEmails()`
2. Manager receives email with employee links
3. Click employee link - form opens with pre-filled data
4. Confirm or modify peer selections
5. Submit form
6. **Check**: Manager Confirmation sheet should update

#### Test 3: Review Assignment
1. After manager confirmation, run `sendReviewAssignments()`
2. Employee receives email with review links
3. Click a review link - form opens
4. Complete the review
5. Submit form
6. **Check**: Review Assignments sheet should update to "Completed"

### Step 8: Set Up Time-Driven Triggers (For Reminders)

1. In your **main Apps Script**, go to **Triggers** (⏰ icon)
2. **Add Trigger** for each:

   **Daily Reminders:**
   - Function: `sendReminders`
   - Event source: Time-driven
   - Type: Day timer
   - Time: 9am-10am
   - Failure notification: Daily

   **Manager Reminders:**
   - Function: `sendManagerReminders`
   - Event source: Time-driven
   - Type: Day timer
   - Time: 9am-10am
   - Failure notification: Daily

   **Completion Status Check:**
   - Function: `checkCompletionStatus`
   - Event source: Time-driven
   - Type: Hour timer
   - Every: 6 hours
   - Failure notification: Daily

## 🎯 Quick Start (Minimum Viable Setup)

If you want to test quickly:

1. ✅ Add employee data to Employees sheet
2. ✅ Update SPREADSHEET_ID in form handler scripts
3. ✅ Run `setup()` to initialize sheets
4. ✅ Run `updateAllFormEmployeeLists()` to populate forms
5. ✅ Test with one employee: Run `sendPeerSelectionInvites()`
6. ✅ Submit test form and verify sheet updates

Entry IDs can be added later - forms will work without pre-filling, users will just need to enter their email manually.

## 📊 Verification Checklist

Before going live, verify:

- [ ] All sheets created (Employees, Peer Selection, Manager Confirmation, Review Assignments)
- [ ] Employee data added to Employees sheet
- [ ] Employee lists populated in forms (run `updateAllFormEmployeeLists()`)
- [ ] Form handlers have correct SPREADSHEET_ID
- [ ] Triggers are active (check Triggers page)
- [ ] Tested peer selection workflow
- [ ] Tested manager confirmation workflow
- [ ] Tested review assignment workflow
- [ ] Time-driven triggers set up (optional but recommended)

## 🚀 Ready to Launch?

Once you've completed the checklist:

1. **Start with a small test group** (2-3 employees)
2. **Run the full cycle**:
   - Week 1: `sendPeerSelectionInvites()`
   - Week 2: `sendManagerConfirmationEmails()`
   - Week 3: `sendReviewAssignments()`
3. **Monitor execution logs** for any errors
4. **Check sheets** to verify data is updating correctly
5. **Expand to full team** once confident

## 🆘 Need Help?

- Check execution logs in Apps Script for errors
- Review `CONFIGURATION_CHECKLIST.md` for detailed verification
- See `TROUBLESHOOTING.md` (if created) for common issues
- Test with one employee first before full rollout

## Summary

**Priority Order:**
1. Update SPREADSHEET_ID in form handlers ⚠️ **Critical**
2. Add employee data to Employees sheet ⚠️ **Critical**
3. Run `setup()` to initialize sheets
4. Run `updateAllFormEmployeeLists()` to populate forms
5. Test with one employee
6. Get entry IDs for pre-filling (can do later)
7. Set up time-driven triggers

You're almost there! The system should be functional after steps 1-5.

