# Employee List Format for Google Forms

## Overview

When setting up the checkbox options for peer reviewer selection in Forms 1 and 2, you need to choose a format that the system can process correctly.

## Current Code Behavior

The `storePeerReviewers()` function expects **email addresses** as input. However, Google Forms returns whatever text is displayed in the checkbox option. This creates a mismatch that needs to be handled.

## Recommended Format: "Name (email@company.com)"

**Best Practice**: Use the format **"Employee Name (email@company.com)"** in your checkbox options.

### Example:
```
☐ John Doe (john.doe@company.com)
☐ Jane Smith (jane.smith@company.com)
☐ Bob Jones (bob.jones@company.com)
```

### Why This Format?

1. **User-Friendly**: Employees see names (easier to recognize)
2. **Parseable**: System can extract email from parentheses
3. **Clear**: Email is visible for verification
4. **Flexible**: Works even if names aren't unique

## Alternative Formats

### Option 1: Email Only
```
☐ john.doe@company.com
☐ jane.smith@company.com
☐ bob.jones@company.com
```

**Pros**: Direct match with code expectations
**Cons**: Not user-friendly, harder to select correct person

### Option 2: Name Only
```
☐ John Doe
☐ Jane Smith
☐ Bob Jones
```

**Pros**: Most user-friendly
**Cons**: Requires code update to look up names → emails (names may not be unique)

## Code Update Needed

The current code needs to be updated to handle the "Name (email)" format. Here's what needs to be added:

### Helper Function to Extract Email

```javascript
/**
 * Extract email from form response value
 * Handles formats: "Name (email)", "email", or just "email"
 * @param {string} value - The form response value
 * @returns {string} Email address
 */
function extractEmailFromResponse(value) {
  if (!value) return '';
  
  // Check if format is "Name (email@domain.com)"
  const emailMatch = value.match(/\(([^)]+@[^)]+)\)/);
  if (emailMatch) {
    return emailMatch[1].trim();
  }
  
  // Check if it's already just an email
  if (value.includes('@')) {
    return value.trim();
  }
  
  // If it's just a name, try to look it up
  const employees = getEmployeeData();
  const employee = employees.find(emp => emp.name === value);
  if (employee) {
    return employee.email;
  }
  
  // Fallback: return as-is (may cause issues)
  Logger.log(`Warning: Could not extract email from: ${value}`);
  return value;
}
```

### Updated Form Handlers

The `onPeerSelectionSubmit()` and `onManagerConfirmationSubmit()` functions need to extract emails:

```javascript
// In onPeerSelectionSubmit() and onManagerConfirmationSubmit()
if (itemTitle.includes('Peer') || itemTitle.includes('Reviewer')) {
  if (Array.isArray(responseValue)) {
    selectedPeers = responseValue.map(v => extractEmailFromResponse(v));
  } else {
    selectedPeers = [extractEmailFromResponse(responseValue)];
  }
}
```

## Implementation Steps

### Step 1: Update Code.gs

Add the `extractEmailFromResponse()` function and update the form handlers to use it.

### Step 2: Format Your Form Options

In Google Forms, for the "Select Peer Reviewers" question:

1. Go to the question
2. Add options in format: **"Name (email@company.com)"**
3. Example options:
   - Alice Smith (alice.smith@company.com)
   - Bob Jones (bob.jones@company.com)
   - Charlie Brown (charlie.brown@company.com)
   - etc.

### Step 3: Test

1. Submit a test form
2. Check that emails are correctly extracted and stored
3. Verify in the sheet that both Name and Email columns are populated correctly

## For Form 1: Peer Reviewer Selection

**Question**: "Select Peer Reviewers"
**Type**: Checkbox (multiple selection)
**Options Format**: `Employee Name (employee.email@company.com)`

**Example Options**:
```
☐ Alice Smith (alice.smith@company.com)
☐ Bob Jones (bob.jones@company.com)
☐ Charlie Brown (charlie.brown@company.com)
☐ Diana Prince (diana.prince@company.com)
☐ ... (all employees)
```

## For Form 2: Manager Confirmation

**Question**: "Confirm or Reselect Peer Reviewers"
**Type**: Checkbox (multiple selection)
**Options Format**: `Employee Name (employee.email@company.com)`

**Same format as Form 1** - list all employees so managers can confirm or change selections.

## Dynamic Employee List

If you have many employees, you may want to automatically populate the form options. Here's a helper function:

```javascript
/**
 * Update form with current employee list
 * Run this when employees change
 */
function updateFormEmployeeList(formId, questionTitle) {
  const form = FormApp.openById(formId);
  const employees = getEmployeeData().filter(emp => emp.status === 'Active');
  
  // Find the question
  const items = form.getItems();
  let question = null;
  for (let i = 0; i < items.length; i++) {
    if (items[i].getTitle() === questionTitle) {
      question = items[i];
      break;
    }
  }
  
  if (!question || question.getType() !== FormApp.ItemType.CHECKBOX) {
    Logger.log('Question not found or wrong type');
    return;
  }
  
  // Clear existing choices
  const checkboxItem = question.asCheckboxItem();
  checkboxItem.clearChoices();
  
  // Add new choices in "Name (email)" format
  const choices = employees.map(emp => 
    `${emp.name} (${emp.email})`
  );
  checkboxItem.setChoices(choices.map(choice => 
    checkboxItem.createChoice(choice)
  ));
  
  Logger.log(`Updated form with ${choices.length} employees`);
}
```

**Usage**:
```javascript
// Update Peer Selection Form
updateFormEmployeeList(CONFIG.PEER_SELECTION_FORM_ID, 'Select Peer Reviewers');

// Update Manager Confirmation Form
updateFormEmployeeList(CONFIG.MANAGER_CONFIRMATION_FORM_ID, 'Confirm or Reselect Peer Reviewers');
```

## Summary

**Recommended Format**: `Employee Name (email@company.com)`

**Why**:
- ✅ User-friendly (shows names)
- ✅ System can extract emails
- ✅ Works with current code (with small update)
- ✅ Handles duplicate names

**Next Steps**:
1. Update `Code.gs` with email extraction function
2. Format your form options as "Name (email)"
3. Test with a small group
4. Optionally: Use `updateFormEmployeeList()` to auto-populate

