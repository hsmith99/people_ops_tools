# Next Steps After Adding Form IDs

Great! You've added your form IDs to Code.gs. Here's what to do next:

## Step 1: Set Up Form Submission Triggers

Now that your form IDs are configured, set up the triggers automatically:

1. **In Apps Script**, find the function `setupFormSubmissionTriggers()` (it's at the bottom of Code.gs)
2. **Click the Run button** (▶) in the toolbar
3. **Select** `setupFormSubmissionTriggers` from the dropdown
4. **Click Run**
5. **Authorize permissions** when prompted (you'll need to grant access to Forms)
6. **Check the execution log** - you should see:
   ```
   ✅ Created trigger for Peer Selection Form
   ✅ Created trigger for Manager Confirmation Form
   ✅ Created trigger for Review Form
   ```

7. **Verify triggers were created**:
   - Go to **Triggers** page (⏰ icon)
   - You should see all three triggers listed with status "Active"

## Step 2: Get Form Entry IDs for URL Pre-filling

To enable URL pre-filling, you need to get the entry IDs from each form:

### Option A: Use the Helper Function (Easiest)

1. **In Apps Script**, find the function `getFormEntryIds()`
2. **Run it for each form**:

```javascript
// Get entry IDs for Peer Selection Form
getFormEntryIds('1FAIpQLSexU8yKfYbgc6-NBfko4DZ_RAyzcdAyOcAx3fqlxqccY7Sw0A');

// Get entry IDs for Manager Confirmation Form
getFormEntryIds('1FAIpQLSdav1RDy1v97w7EwUjkxAQCp2RfunTNNFe8QP1xSy44QS4dBg');

// Get entry IDs for Review Form
getFormEntryIds('1FAIpQLSfI2cf6p6VOO0Cqa46J0RPuFtIm3BzFA2tZmvVGamfjZ74r3w');
```

3. **Check the execution log** - it will show you the question titles and item IDs
4. **Note**: The item IDs shown may not be the entry IDs used in URLs - you may need to check the form's HTML source (see Option B)

### Option B: Get Entry IDs from Form HTML

1. **Open your Google Form** in a browser
2. **Right-click** on the page → **"View Page Source"** (or press Ctrl+U / Cmd+U)
3. **Search** for your question text (e.g., "Employee Email")
4. **Look for** `entry.XXXXX` in the HTML - the XXXXX is your entry ID
5. **Example**: `<input name="entry.123456789"` means entry ID is `123456789`

### Update FORM_ENTRY_IDS in Code.gs

Once you have the entry IDs, update the `FORM_ENTRY_IDS` object in Code.gs:

```javascript
const FORM_ENTRY_IDS = {
  'Peer Selection Form': {
    'Employee Email': '123456789',  // Replace with actual entry ID
    'Employee Name': '987654321',   // Replace with actual entry ID
  },
  'Manager Confirmation Form': {
    'Employee Email': '111222333',  // Replace with actual entry ID
    'Employee Name': '444555666',   // Replace with actual entry ID
  },
  'Review Form': {
    'Reviewer Email': '777888999',  // Replace with actual entry ID
    'Reviewee Email': '000111222',  // Replace with actual entry ID
    'Review Type': '333444555',     // Replace with actual entry ID
  }
};
```

**Important**: Question titles must match exactly (case-sensitive)!

## Step 3: Update Employee Lists in Forms

Populate your forms with the current employee list:

1. **Make sure your Employees sheet has data** (with Status = "Active")
2. **Run** `updateAllFormEmployeeLists()` function
3. **Check the log** - should show employees added to both forms
4. **Verify in forms** - open your forms and check that employee lists are populated

## Step 4: Test the System

### Test 1: Peer Selection
1. Run `sendPeerSelectionInvites()` (or test with one employee)
2. Check email - should receive form link
3. Submit test form
4. Check Peer Selection sheet - should update automatically

### Test 2: Manager Confirmation
1. After peer selection is complete, run `sendManagerConfirmationEmails()`
2. Manager receives email with links
3. Submit test confirmation
4. Check Manager Confirmation sheet - should update automatically

### Test 3: Review Assignment
1. After manager confirmation, run `sendReviewAssignments()`
2. Employee receives email with review links
3. Submit test review
4. Check Review Assignments sheet - should update automatically

## Step 5: Set Up Time-Driven Triggers (Optional but Recommended)

Set up automated reminders:

1. **Go to Triggers** page (⏰ icon)
2. **Add Trigger** for each:
   - `sendReminders` - Daily at 9am
   - `sendManagerReminders` - Daily at 9am
   - `checkCompletionStatus` - Every 6 hours

## Checklist

- [ ] Form IDs added to CONFIG ✅ (You've done this!)
- [ ] Form submission triggers created (run `setupFormSubmissionTriggers()`)
- [ ] Entry IDs obtained and added to FORM_ENTRY_IDS
- [ ] Employee lists updated in forms (run `updateAllFormEmployeeLists()`)
- [ ] Tested peer selection workflow
- [ ] Tested manager confirmation workflow
- [ ] Tested review assignment workflow
- [ ] Time-driven triggers set up (optional)

## Troubleshooting

### Triggers Not Creating
- Check that form IDs are correct
- Verify you have edit access to the forms
- Check execution log for errors

### Entry IDs Not Working
- Verify question titles match exactly (case-sensitive)
- Check that entry IDs are correct (from HTML source)
- Test URL manually to see if pre-filling works

### Forms Not Updating
- Make sure Employees sheet has data
- Check that employees have Status = "Active"
- Verify form question titles match exactly

## Ready to Go!

Once you've completed these steps, your system is ready for production use. Start with a small test group before rolling out to everyone!

