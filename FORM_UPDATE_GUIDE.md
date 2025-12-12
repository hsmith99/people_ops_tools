# Form Employee List Update Guide

## Overview

The `updateFormEmployeeList()` function automatically populates checkbox options in your Google Forms with all active employees from your Employees sheet. This ensures your forms always have the current employee list without manual updates.

## How It Works

### Step-by-Step Process

1. **Reads Employees Sheet**: Gets all employees with Status = "Active"
2. **Finds the Question**: Locates the checkbox question by its exact title
3. **Formats Options**: Creates choices in "Name (email@company.com)" format
4. **Updates Form**: Replaces all existing choices with the new list

### Example

**Before** (manual entries, may be outdated):
```
☐ Alice Smith (old email)
☐ Bob Jones
☐ [Missing new employees]
```

**After** (automated, always current):
```
☐ Alice Smith (alice.smith@company.com)
☐ Bob Jones (bob.jones@company.com)
☐ Charlie Brown (charlie.brown@company.com)
☐ [All active employees included]
```

## Usage

### Option 1: Update Individual Form

```javascript
// Update Peer Selection Form
updateFormEmployeeList(
  CONFIG.PEER_SELECTION_FORM_ID, 
  'Select Peer Reviewers'
);

// Update Manager Confirmation Form
updateFormEmployeeList(
  CONFIG.MANAGER_CONFIRMATION_FORM_ID, 
  'Confirm or Reselect Peer Reviewers'
);
```

### Option 2: Update Both Forms at Once

```javascript
// Updates both forms automatically
updateAllFormEmployeeLists();
```

## When to Run

### Initial Setup
1. After creating your Google Forms
2. After adding employee data to Employees sheet
3. Before sending first peer selection invites

### Regular Maintenance
- **When employees join**: Run to add new employees
- **When employees leave**: Run to remove inactive employees (they'll be filtered out)
- **Before each review cycle**: Ensure list is current
- **Monthly**: Keep forms up-to-date

### Automated Schedule (Optional)

Set up a time-driven trigger to run monthly:

1. In Apps Script, go to Triggers
2. Add trigger:
   - Function: `updateAllFormEmployeeLists`
   - Event: Time-driven
   - Type: Month timer
   - Day of month: 1 (first of each month)
   - Time: 9am-10am

## Requirements

### Form Setup
- Question must be a **Checkbox** type (not multiple choice, not dropdown)
- Question title must match **exactly** (case-sensitive):
  - "Select Peer Reviewers" (for Form 1)
  - "Confirm or Reselect Peer Reviewers" (for Form 2)

### Data Requirements
- Employees sheet must have data
- Employees must have Status = "Active" to appear in forms
- Employees must have both Name and Email filled in

## Troubleshooting

### "Question not found"
**Problem**: Question title doesn't match exactly

**Solution**: 
1. Check the exact question title in your form
2. Update the function call with the correct title
3. Or check the log output - it will list all available questions

### "No active employees found"
**Problem**: Employees sheet is empty or all employees have Status ≠ "Active"

**Solution**:
1. Verify Employees sheet has data
2. Check that Status column contains "Active" (case-sensitive)
3. Run `getEmployeeData()` to test data retrieval

### "Question is not a checkbox"
**Problem**: Question type is wrong

**Solution**:
1. Change question type to Checkbox in Google Forms
2. Or use a different question title that is a checkbox

### Form ID Not Configured
**Problem**: CONFIG still has placeholder values

**Solution**:
1. Update CONFIG.PEER_SELECTION_FORM_ID with your actual form ID
2. Update CONFIG.MANAGER_CONFIRMATION_FORM_ID with your actual form ID
3. Form IDs are in the form URL: `.../d/FORM_ID/viewform`

## Example: Complete Setup Workflow

```javascript
// 1. Initial setup - create forms first, then update
function setupForms() {
  // Make sure forms are created and form IDs are in CONFIG
  // Then run:
  updateAllFormEmployeeLists();
}

// 2. Before starting a new review cycle
function prepareReviewCycle() {
  // Update employee lists
  updateAllFormEmployeeLists();
  
  // Then send invites
  sendPeerSelectionInvites();
}

// 3. When new employee joins
function addNewEmployee() {
  // Add to Employees sheet first
  // Then update forms
  updateAllFormEmployeeLists();
}
```

## What Gets Updated

### Included
- ✅ All employees with Status = "Active"
- ✅ Format: "Name (email@company.com)"
- ✅ Sorted by order in Employees sheet

### Excluded
- ❌ Employees with Status = "Inactive" (or any other value)
- ❌ Employees without email addresses
- ❌ Employees without names

## Format Details

The function creates options in this exact format:
```
Employee Name (employee.email@company.com)
```

**Why this format?**
- User-friendly (shows names)
- System can extract emails automatically
- Works with `extractEmailFromResponse()` function

## Testing

### Test Individual Form
```javascript
// Test Peer Selection Form
const result = updateFormEmployeeList(
  CONFIG.PEER_SELECTION_FORM_ID, 
  'Select Peer Reviewers'
);

// Check result
Logger.log(result);
// Should show: { success: true, employeeCount: X, ... }
```

### Verify in Form
1. Run the function
2. Open your Google Form
3. Check the checkbox question
4. Verify all active employees appear
5. Verify format is "Name (email)"

## Best Practices

1. **Run before each review cycle** to ensure current employee list
2. **Run after adding/removing employees** to keep forms updated
3. **Set up monthly trigger** for automatic updates
4. **Test with small group first** before full rollout
5. **Check logs** to verify updates were successful

## Advanced: Custom Formatting

If you need a different format, you can modify the function:

```javascript
// Example: Just names (requires code update to handle)
const choices = employees.map(emp => {
  return checkboxItem.createChoice(emp.name);
});

// Example: Just emails (not user-friendly)
const choices = employees.map(emp => {
  return checkboxItem.createChoice(emp.email);
});

// Example: Custom format
const choices = employees.map(emp => {
  return checkboxItem.createChoice(`${emp.name} - ${emp.department} (${emp.email})`);
});
```

## Summary

The `updateFormEmployeeList()` function:
- ✅ Automatically syncs forms with Employees sheet
- ✅ Uses "Name (email)" format for user-friendliness
- ✅ Filters to active employees only
- ✅ Easy to run manually or on schedule
- ✅ Saves time vs. manual updates

Run it whenever your employee list changes, or set up a monthly trigger for automatic updates!

