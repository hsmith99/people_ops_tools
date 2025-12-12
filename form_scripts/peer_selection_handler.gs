/**
 * Peer Selection Form Handler
 * 
 * Copy this code to your Peer Selection Form's script editor
 * (Form → Three dots → Script editor)
 * 
 * Then set up trigger: Triggers → Add Trigger → From form → On form submit
 */

// Update this with your spreadsheet ID (from Sheet URL)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Peer Selection';

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
  const startCol = 4; // Column D (0-based = 3, but we use 1-based for getRange)
  
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
 * Handle peer selection form submission
 * This is the main function that runs when the form is submitted
 */
function onFormSubmit(e) {
  try {
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    let employeeEmail = '';
    let employeeName = '';
    let selectedPeers = [];
    
    itemResponses.forEach(response => {
      const itemTitle = response.getItem().getTitle();
      const responseValue = response.getResponse();
      
      if (itemTitle === 'Employee Email' || itemTitle.includes('Email')) {
        employeeEmail = responseValue;
      } else if (itemTitle === 'Employee Name' || itemTitle.includes('Name')) {
        employeeName = responseValue;
      } else if (itemTitle.includes('Peer') || itemTitle.includes('Reviewer')) {
        if (Array.isArray(responseValue)) {
          selectedPeers = responseValue.map(v => extractEmailFromResponse(v));
        } else {
          selectedPeers = [extractEmailFromResponse(responseValue)];
        }
      }
    });
    
    if (!employeeEmail) {
      Logger.log('Error: Employee email not found in form response');
      return;
    }
    
    // Validate exactly 5 peer reviewers
    if (selectedPeers.length !== REQUIRED_PEER_REVIEWERS) {
      Logger.log(`Warning: ${employeeEmail} selected ${selectedPeers.length} peers, but exactly ${REQUIRED_PEER_REVIEWERS} are required`);
      
      // Send notification email
      const notificationEmail = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Peer Reviewer Selection Update Required</h2>
            <p>Hi ${employeeName || 'there'},</p>
            <p>We received your peer reviewer selection, but you selected ${selectedPeers.length} peer reviewer(s). You must select exactly ${REQUIRED_PEER_REVIEWERS} peer reviewers.</p>
            <p>Please resubmit the form with exactly ${REQUIRED_PEER_REVIEWERS} peer reviewers selected.</p>
            <p>Thank you,<br>HR Team</p>
          </body>
        </html>
      `;
      
      MailApp.sendEmail({
        to: employeeEmail,
        subject: 'Action Required: Update Your Peer Reviewer Selection',
        htmlBody: notificationEmail,
        from: FROM_EMAIL,
        replyTo: REPLY_TO
      });
      
      // Update status
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      const rowIndex = findRowInSheet(sheet, employeeEmail);
      if (rowIndex !== -1) {
        sheet.getRange(rowIndex, 3).setValue('Pending - Invalid Selection'); // Column C = Status
      }
      return;
    }
    
    // Update Peer Selection sheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    let rowIndex = findRowInSheet(sheet, employeeEmail);
    
    if (rowIndex === -1) {
      // Add new row
      const newRow = [employeeEmail, employeeName || getEmployeeName(employeeEmail), 'Completed'];
      sheet.appendRow(newRow);
      rowIndex = sheet.getLastRow();
    } else {
      // Update existing row
      sheet.getRange(rowIndex, 3).setValue('Completed'); // Column C = Status
    }
    
    // Store peer reviewers in separate columns
    storePeerReviewers(sheet, rowIndex, selectedPeers);
    
    // Update date
    sheet.getRange(rowIndex, 14).setValue(new Date()); // Column N = Date Selected
    
    Logger.log(`Updated peer selection for ${employeeEmail}: ${selectedPeers.length} peers selected`);
  } catch (error) {
    Logger.log(`Error in onFormSubmit: ${error.toString()}`);
  }
}

