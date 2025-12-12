/**
 * Update Employee List in Peer Selection Form
 * 
 * This script should be added to the Peer Selection Form's script editor.
 * It reads employees from your main spreadsheet and updates the form's checkbox options.
 * 
 * SETUP:
 * 1. Open Peer Selection Form
 * 2. Click three dots (⋮) → Script editor
 * 3. Paste this entire file
 * 4. Replace YOUR_SPREADSHEET_ID with your actual spreadsheet ID
 * 5. Replace 'Select Peer Reviewers' with your exact question title (if different)
 * 6. Run updateEmployeeList()
 */

// ⚙️ CONFIGURATION - Update these values
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';  // Replace with your spreadsheet ID
const QUESTION_TITLE = 'Select Peer Reviewers';     // Replace if your question title is different
const EMPLOYEES_SHEET_NAME = 'Employees';            // Name of your Employees sheet
const STATUS_COLUMN = 6;                             // Column index for Status (0-based)

/**
 * Update the form with current employee list
 * Run this function from the script editor
 */
function updateEmployeeList() {
  try {
    // Get the current form (since script is bound to form)
    const form = FormApp.getActiveForm();
    Logger.log(`Updating form: ${form.getTitle()}`);
    
    // Get spreadsheet and employees
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const employeesSheet = spreadsheet.getSheetByName(EMPLOYEES_SHEET_NAME);
    
    if (!employeesSheet) {
      Logger.log(`❌ Sheet "${EMPLOYEES_SHEET_NAME}" not found in spreadsheet`);
      return;
    }
    
    // Get all employee data
    const data = employeesSheet.getDataRange().getValues();
    const employees = [];
    
    // Skip header row (row 0), start from row 1
    for (let i = 1; i < data.length; i++) {
      const email = data[i][0];      // Column 0: Employee Email
      const name = data[i][1];        // Column 1: Employee Name
      const status = data[i][STATUS_COLUMN]; // Column 6: Status
      
      if (status === 'Active' && email && name) {
        employees.push({
          name: name,
          email: email
        });
      }
    }
    
    if (employees.length === 0) {
      Logger.log('⚠️  No active employees found. Make sure Employees sheet has data with Status = "Active"');
      return;
    }
    
    Logger.log(`Found ${employees.length} active employees`);
    
    // Find the checkbox question
    const items = form.getItems();
    let checkboxItem = null;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].getTitle() === QUESTION_TITLE) {
        if (items[i].getType() === FormApp.ItemType.CHECKBOX) {
          checkboxItem = items[i].asCheckboxItem();
          break;
        } else {
          Logger.log(`❌ Question "${QUESTION_TITLE}" exists but is not a checkbox. Type: ${items[i].getType()}`);
          return;
        }
      }
    }
    
    if (!checkboxItem) {
      Logger.log(`❌ Question "${QUESTION_TITLE}" not found. Available questions:`);
      items.forEach((item, idx) => {
        Logger.log(`  ${idx + 1}. "${item.getTitle()}" (Type: ${item.getType()})`);
      });
      return;
    }
    
    // Create choices in "Name (email)" format
    const choices = employees.map(emp => {
      const choiceText = `${emp.name} (${emp.email})`;
      return checkboxItem.createChoice(choiceText);
    });
    
    // Update the question with new choices
    checkboxItem.setChoices(choices);
    
    Logger.log(`✅ Successfully updated form!`);
    Logger.log(`   Question: "${QUESTION_TITLE}"`);
    Logger.log(`   Added ${choices.length} employees`);
    Logger.log(`   Example: "${choices[0].getValue()}"`);
    
  } catch (error) {
    Logger.log(`❌ Error: ${error.toString()}`);
    Logger.log(`   Make sure SPREADSHEET_ID is correct and you have access to the spreadsheet.`);
  }
}

