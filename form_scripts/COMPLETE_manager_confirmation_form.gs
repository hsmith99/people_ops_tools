/**
 * COMPLETE Manager Confirmation Form Script
 * 
 * Copy this ENTIRE file to your Manager Confirmation Form's script editor
 * (Form → Three dots → Script editor)
 * 
 * SETUP:
 * 1. Replace YOUR_SPREADSHEET_ID_HERE with your actual spreadsheet ID
 * 2. Replace 'Confirm or Reselect Peer Reviewers' with your exact question title (if different)
 * 3. Update email settings (FROM_EMAIL, REPLY_TO)
 * 4. Set up trigger: Triggers → Add Trigger → From form → On form submit → onFormSubmit
 * 5. Run updateEmployeeList() manually to populate the employee list
 */

// ==================== CONFIGURATION ====================
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';  // Replace with your spreadsheet ID
const SHEET_NAME = 'Manager Confirmation';
const EMPLOYEES_SHEET_NAME = 'Employees';
const QUESTION_TITLE = 'Confirm or Reselect Peer Reviewers';  // Replace if your question title is different
const STATUS_COLUMN = 6;                             // Column index for Status (0-based)

// Email settings
const FROM_EMAIL = 'noreply@yourcompany.com';
const REPLY_TO = 'hr@yourcompany.com';
const REQUIRED_PEER_REVIEWERS = 5;

// ==================== HELPER FUNCTIONS ====================

/**
 * Extract email from form response value
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
  
  // Fallback
  return value;
}

/**
 * Get employee name by email
 */
function getEmployeeName(email) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const empSheet = ss.getSheetByName(EMPLOYEES_SHEET_NAME);
  if (!empSheet) return email;
  
  const data = empSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) { // Column 0 = Employee Email
      return data[i][1] || email; // Column 1 = Employee Name
    }
  }
  return email;
}

/**
 * Store peer reviewers in separate columns
 */
function storePeerReviewers(sheet, rowIndex, peerEmails) {
  const startCol = 6; // Column F (Confirmed Peer Reviewer 1 Name)
  
  // Clear existing
  for (let i = 0; i < REQUIRED_PEER_REVIEWERS; i++) {
    sheet.getRange(rowIndex, startCol + (i * 2)).setValue(''); // Name
    sheet.getRange(rowIndex, startCol + (i * 2) + 1).setValue(''); // Email
  }
  
  // Store peers
  peerEmails.forEach((email, index) => {
    if (index < REQUIRED_PEER_REVIEWERS) {
      const name = getEmployeeName(email);
      sheet.getRange(rowIndex, startCol + (index * 2)).setValue(name);
      sheet.getRange(rowIndex, startCol + (index * 2) + 1).setValue(email);
    }
  });
}

/**
 * Find row in sheet by email
 */
function findRowInSheet(sheet, email) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) { // Column 0 = Employee Email
      return i + 1; // 1-based
    }
  }
  return -1;
}

// ==================== FORM SUBMISSION HANDLER ====================

/**
 * Handle manager confirmation form submission
 * This runs automatically when the form is submitted (via trigger)
 */
function onFormSubmit(e) {
  try {
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    let employeeEmail = '';
    let confirmedPeers = [];
    
    itemResponses.forEach(response => {
      const itemTitle = response.getItem().getTitle();
      const responseValue = response.getResponse();
      
      if (itemTitle === 'Employee Email' || itemTitle.includes('Email')) {
        employeeEmail = responseValue;
      } else if (itemTitle.includes('Peer') || itemTitle.includes('Reviewer')) {
        if (Array.isArray(responseValue)) {
          confirmedPeers = responseValue.map(v => extractEmailFromResponse(v));
        } else {
          confirmedPeers = [extractEmailFromResponse(responseValue)];
        }
      }
    });
    
    if (!employeeEmail) {
      Logger.log('Error: Employee email not found in confirmation form');
      return;
    }
    
    // Validate exactly 5 peer reviewers
    if (confirmedPeers.length !== REQUIRED_PEER_REVIEWERS) {
      Logger.log(`Warning: Manager confirmed ${confirmedPeers.length} peers for ${employeeEmail}, but exactly ${REQUIRED_PEER_REVIEWERS} are required`);
      // Still update but log warning
    }
    
    // Update Manager Confirmation sheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const rowIndex = findRowInSheet(sheet, employeeEmail);
    
    if (rowIndex === -1) {
      Logger.log(`Error: Employee not found in Manager Confirmation sheet: ${employeeEmail}`);
      return;
    }
    
    // Update status and store confirmed peers
    sheet.getRange(rowIndex, 5).setValue('Completed'); // Column E = Confirmation Status
    storePeerReviewers(sheet, rowIndex, confirmedPeers);
    sheet.getRange(rowIndex, 16).setValue(new Date()); // Column P = Date Confirmed
    
    Logger.log(`Updated manager confirmation for ${employeeEmail}: ${confirmedPeers.length} peers confirmed`);
  } catch (error) {
    Logger.log(`Error in onFormSubmit: ${error.toString()}`);
  }
}

// ==================== EMPLOYEE LIST UPDATE FUNCTION ====================

/**
 * Update the form with current employee list
 * Run this function manually from the script editor when you need to update the employee list
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

