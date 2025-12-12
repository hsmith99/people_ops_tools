# Form Access Troubleshooting Guide

If you're getting errors like "The given item ID is invalid" or "No item with the given ID could be found" when trying to update forms, this guide will help you fix it.

## Common Causes

### 1. Permission Issues (Most Common)

**Problem**: The script is bound to your Google Sheet, but it needs **edit access** to the Google Forms.

**Solution**:
1. Open each form in your browser
2. Click the **three dots (⋮)** → **Share**
3. Make sure your account (the one running the script) has **Editor** access
4. If the form is in a shared drive, make sure the script has access to that drive

**Verify**:
- Try opening the form's edit URL: `https://docs.google.com/forms/d/FORM_ID/edit`
- If you can't edit it, you need to request access or change permissions

### 2. Form ID Extraction

**Problem**: The form ID might not be extracted correctly from the URL.

**Solution**: Use the diagnostic function:
```javascript
// Test with full URL
testFormAccess('https://docs.google.com/forms/d/e/1FAIpQLSexU8yKfYbgc6-NBfko4DZ_RAyzcdAyOcAx3fqlxqccY7Sw0A/viewform?usp=sharing&ouid=106394200675772599390')

// Or test with just the form ID
testFormAccess('1FAIpQLSexU8yKfYbgc6-NBfko4DZ_RAyzcdAyOcAx3fqlxqccY7Sw0A')
```

### 3. Alternative: Run from Form's Script Editor

If you can't get permissions working from the Sheet's script, you can run the update functions from each form's own script editor:

**For Peer Selection Form**:
1. Open Peer Selection Form
2. Click **three dots (⋮)** → **Script editor**
3. Paste this code:
```javascript
function updatePeerSelectionEmployeeList() {
  const form = FormApp.getActiveForm();
  const spreadsheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
  const employeesSheet = spreadsheet.getSheetByName('Employees');
  
  // Get active employees
  const data = employeesSheet.getDataRange().getValues();
  const employees = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][6] === 'Active') { // Status column
      employees.push({
        name: data[i][1],
        email: data[i][0]
      });
    }
  }
  
  // Find the checkbox question
  const items = form.getItems();
  let checkboxItem = null;
  for (let i = 0; i < items.length; i++) {
    if (items[i].getType() === FormApp.ItemType.CHECKBOX) {
      checkboxItem = items[i].asCheckboxItem();
      break;
    }
  }
  
  if (!checkboxItem) {
    Logger.log('No checkbox question found');
    return;
  }
  
  // Create choices
  const choices = employees.map(emp => {
    return checkboxItem.createChoice(`${emp.name} (${emp.email})`);
  });
  
  // Update choices
  checkboxItem.setChoices(choices);
  Logger.log(`Updated with ${choices.length} employees`);
}
```
4. Replace `YOUR_SPREADSHEET_ID` with your actual spreadsheet ID
5. Run the function

**For Manager Confirmation Form**: Same process, but use the Manager Confirmation Form's script editor.

## Quick Diagnostic Steps

1. **Test form access**:
   ```javascript
   testAllFormAccess()
   ```

2. **List questions** (once access works):
   ```javascript
   listAllFormQuestions()
   ```

3. **Check form permissions**:
   - Open form → Share → Verify you have Editor access

4. **Verify form IDs in CONFIG**:
   - Make sure the form IDs match what's in the form URLs
   - Form ID is the long string between `/d/` or `/d/e/` and `/edit` or `/viewform`

## Form ID Format

Google Forms URLs can have different formats:
- Edit URL: `https://docs.google.com/forms/d/FORM_ID/edit`
- View URL: `https://docs.google.com/forms/d/e/FORM_ID/viewform`
- Shared URL: `https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=sharing&ouid=...`

The form ID is the same in all cases. The diagnostic functions can extract it from any of these formats.

## Still Having Issues?

1. **Check execution logs** for specific error messages
2. **Verify form exists** - try opening the form in your browser
3. **Check sharing settings** - forms must be shared with Editor access
4. **Try running from form's script editor** (see alternative method above)
5. **Check if forms are in a shared drive** - may need additional permissions

## Manual Update (Last Resort)

If automated updates don't work, you can manually update the employee lists in the forms:

1. Open the form
2. Click on the checkbox question
3. Manually add/remove employee options
4. Format: `Employee Name (employee.email@company.com)`

This is tedious but works if you can't get the script access working.

