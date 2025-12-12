# Combined Form Script Setup Guide

## Overview

Each form needs **TWO types of scripts** in its script editor:
1. **Handler script** - Processes form submissions automatically (via trigger)
2. **Update script** - Updates employee list in the form (run manually)

Both can coexist in the same script editor - they have different function names and don't conflict.

## Setup for Each Form

### Peer Selection Form

**In the form's script editor, you should have BOTH:**

1. **Handler Script** (from `peer_selection_handler.gs`):
   - Function: `onFormSubmit(e)` - runs automatically when form is submitted
   - Purpose: Processes peer selections and updates the sheet
   - **Keep this!** It's essential for the system to work

2. **Update Script** (from `update_employee_list_peer_selection.gs`):
   - Function: `updateEmployeeList()` - run manually when needed
   - Purpose: Updates the checkbox options with current employee list
   - **Add this too!** Use it to keep the form up-to-date

**How to add both:**
1. Open Peer Selection Form → Script editor
2. Copy and paste the **entire contents** of `peer_selection_handler.gs`
3. **Below that**, copy and paste the **entire contents** of `update_employee_list_peer_selection.gs`
4. Update `SPREADSHEET_ID` in both scripts (they should use the same ID)
5. Save
6. Set up trigger for `onFormSubmit` (from the handler script)

**Result:** Your script editor will have both scripts, and they'll work together:
- `onFormSubmit()` runs automatically when someone submits the form
- `updateEmployeeList()` can be run manually to refresh the employee list

### Manager Confirmation Form

**Same approach - add BOTH scripts:**

1. **Handler Script** (from `manager_confirmation_handler.gs`):
   - Function: `onFormSubmit(e)` - processes manager confirmations

2. **Update Script** (from `update_employee_list_manager_confirmation.gs`):
   - Function: `updateEmployeeList()` - updates employee list

**Steps:**
1. Open Manager Confirmation Form → Script editor
2. Paste `manager_confirmation_handler.gs` first
3. Paste `update_employee_list_manager_confirmation.gs` below it
4. Update `SPREADSHEET_ID` in both
5. Save
6. Set up trigger for `onFormSubmit`

### Review Form

**Only needs the handler script:**
- Copy `review_form_handler.gs` to the Review Form's script editor
- No employee list update needed (this form doesn't have employee checkboxes)

## Why Both Scripts?

### Handler Script (`onFormSubmit`)
- **Runs automatically** via trigger
- **Required** for the system to function
- Processes form submissions and updates sheets
- **Don't remove this!**

### Update Script (`updateEmployeeList`)
- **Runs manually** when you need to update the employee list
- **Optional but recommended** - keeps forms current
- Updates checkbox options with latest employees
- Can be run:
  - When new employees join
  - When employees leave (they'll be filtered out)
  - Before each review cycle
  - Monthly for maintenance

## Example: Complete Script for Peer Selection Form

Here's what your script editor should look like (both scripts combined):

```javascript
// ========== HANDLER SCRIPT (from peer_selection_handler.gs) ==========
const SPREADSHEET_ID = '1Utjrr_8w1UkDuL3_ts5O4S1JhRtNdFEArOZPhG_S7z4';
const SHEET_NAME = 'Peer Selection';
// ... rest of handler code ...

function onFormSubmit(e) {
  // Handles form submissions
}

// ========== UPDATE SCRIPT (from update_employee_list_peer_selection.gs) ==========
const SPREADSHEET_ID = '1Utjrr_8w1UkDuL3_ts5O4S1JhRtNdFEArOZPhG_S7z4'; // Same ID
const QUESTION_TITLE = 'Select Peer Reviewers';
// ... rest of update code ...

function updateEmployeeList() {
  // Updates employee list in form
}
```

**Note:** You'll have `SPREADSHEET_ID` defined twice - that's fine! The second definition will override the first, but since they're the same value, it doesn't matter. Or you can define it once at the top and remove the duplicate.

## Quick Reference

| Form | Handler Script | Update Script | Trigger Needed |
|------|---------------|---------------|----------------|
| Peer Selection | ✅ `peer_selection_handler.gs` | ✅ `update_employee_list_peer_selection.gs` | ✅ `onFormSubmit` |
| Manager Confirmation | ✅ `manager_confirmation_handler.gs` | ✅ `update_employee_list_manager_confirmation.gs` | ✅ `onFormSubmit` |
| Review Form | ✅ `review_form_handler.gs` | ❌ Not needed | ✅ `onFormSubmit` |

## When to Run Update Scripts

Run `updateEmployeeList()` in each form's script editor:
- **Initial setup**: After adding employees to the Employees sheet
- **When employees join**: Add them to Employees sheet, then run update
- **When employees leave**: Set Status = "Inactive" in Employees sheet, then run update
- **Before each review cycle**: Ensure lists are current
- **Monthly maintenance**: Keep forms up-to-date

## Troubleshooting

### "Function already exists" error
- This shouldn't happen - the functions have different names
- If it does, make sure you're not duplicating the same script

### "SPREADSHEET_ID not defined"
- Make sure you've updated `SPREADSHEET_ID` in both scripts
- Or define it once at the top of the combined script

### Trigger not working
- Make sure `onFormSubmit` function exists (from handler script)
- Verify trigger is set to "From form" → "On form submit"
- Check that handler script is present

## Summary

✅ **Keep both scripts** in each form's editor  
✅ **Handler script** = automatic processing (required)  
✅ **Update script** = manual maintenance (recommended)  
✅ **No conflicts** - they work together perfectly

