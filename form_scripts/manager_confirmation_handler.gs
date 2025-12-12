/**
 * Manager Confirmation Form Handler
 * 
 * Copy this code to your Manager Confirmation Form's script editor
 * (Form → Three dots → Script editor)
 * 
 * Then set up trigger: Triggers → Add Trigger → From form → On form submit
 */

// Update this with your spreadsheet ID (from Sheet URL)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Manager Confirmation';

// Update with your email settings
const FROM_EMAIL = 'noreply@yourcompany.com';
const REPLY_TO = 'hr@yourcompany.com';
const REQUIRED_PEER_REVIEWERS = 5;

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
  const empSheet = ss.getSheetByName('Employees');
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

/**
 * Handle manager confirmation form submission
 * This is the main function that runs when the form is submitted
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

