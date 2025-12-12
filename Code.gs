/**
 * Performance Review System - Main Apps Script Code (Multi-Sheet Architecture)
 * 
 * This script automates the entire performance review process:
 * 1. Peer reviewer selection by employees
 * 2. Manager confirmation of peer reviewers
 * 3. Review assignment to employees
 * 4. Completion tracking and reminders
 * 
 * Architecture: Uses separate sheets for each phase for better organization and scalability
 */

// ==================== CONFIGURATION ====================

const CONFIG = {
  // Sheet names
  SHEET_EMPLOYEES: 'Employees',
  SHEET_PEER_SELECTION: 'Peer Selection',
  SHEET_MANAGER_CONFIRMATION: 'Manager Confirmation',
  SHEET_REVIEW_ASSIGNMENTS: 'Review Assignments',
  SHEET_DASHBOARD: 'Dashboard',
  
  // Form IDs - Replace with your actual form IDs
  PEER_SELECTION_FORM_ID: 'YOUR_PEER_SELECTION_FORM_ID',
  MANAGER_CONFIRMATION_FORM_ID: 'YOUR_MANAGER_CONFIRMATION_FORM_ID',
  REVIEW_FORM_ID: 'YOUR_REVIEW_FORM_ID',
  
  // Employees sheet columns (0-based)
  EMP_COL_EMAIL: 0,
  EMP_COL_NAME: 1,
  EMP_COL_MANAGER_EMAIL: 2,
  EMP_COL_MANAGER_NAME: 3,
  EMP_COL_IS_MANAGER: 4,
  EMP_COL_DEPARTMENT: 5,
  EMP_COL_STATUS: 6,
  
  // Peer Selection sheet columns (0-based)
  PS_COL_EMAIL: 0,
  PS_COL_NAME: 1,
  PS_COL_STATUS: 2,
  PS_COL_PEER1_NAME: 3,
  PS_COL_PEER1_EMAIL: 4,
  PS_COL_PEER2_NAME: 5,
  PS_COL_PEER2_EMAIL: 6,
  PS_COL_PEER3_NAME: 7,
  PS_COL_PEER3_EMAIL: 8,
  PS_COL_PEER4_NAME: 9,
  PS_COL_PEER4_EMAIL: 10,
  PS_COL_PEER5_NAME: 11,
  PS_COL_PEER5_EMAIL: 12,
  PS_COL_DATE_SELECTED: 13,
  PS_COL_REMINDER_COUNT: 14,
  PS_COL_LAST_REMINDER: 15,
  
  // Manager Confirmation sheet columns (0-based)
  MC_COL_EMAIL: 0,
  MC_COL_NAME: 1,
  MC_COL_MANAGER_EMAIL: 2,
  MC_COL_MANAGER_NAME: 3,
  MC_COL_STATUS: 4,
  MC_COL_PEER1_NAME: 5,
  MC_COL_PEER1_EMAIL: 6,
  MC_COL_PEER2_NAME: 7,
  MC_COL_PEER2_EMAIL: 8,
  MC_COL_PEER3_NAME: 9,
  MC_COL_PEER3_EMAIL: 10,
  MC_COL_PEER4_NAME: 11,
  MC_COL_PEER4_EMAIL: 12,
  MC_COL_PEER5_NAME: 13,
  MC_COL_PEER5_EMAIL: 14,
  MC_COL_DATE_CONFIRMED: 15,
  MC_COL_REMINDER_COUNT: 16,
  MC_COL_LAST_REMINDER: 17,
  
  // Review Assignments sheet columns (0-based)
  RA_COL_REVIEWER_EMAIL: 0,
  RA_COL_REVIEWER_NAME: 1,
  RA_COL_REVIEWEE_EMAIL: 2,
  RA_COL_REVIEWEE_NAME: 3,
  RA_COL_REVIEW_TYPE: 4,
  RA_COL_STATUS: 5,
  RA_COL_DATE_ASSIGNED: 6,
  RA_COL_DATE_COMPLETED: 7,
  RA_COL_RESPONSE_ID: 8,
  
  // Email settings
  FROM_EMAIL: 'noreply@yourcompany.com',
  REPLY_TO: 'hr@yourcompany.com',
  
  // Reminder settings
  REMINDER_INTERVAL_DAYS: 3,
  MAX_REMINDERS: 5,
  
  // Peer reviewer settings
  REQUIRED_PEER_REVIEWERS: 5
};

// ==================== EMAIL TEMPLATES ====================

const EMAIL_TEMPLATES = {
  peerSelectionInvite: (employeeName, formUrl) => `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Performance Review: Select Your Peer Reviewers</h2>
        <p>Hi ${employeeName},</p>
        <p>It's time for your performance review! As part of the process, we need you to select exactly 5 peers who will provide feedback on your performance.</p>
        <p>Please click the link below to select your peer reviewers:</p>
        <p><a href="${formUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Select Peer Reviewers</a></p>
        <p>Please complete this by the end of the week.</p>
        <p>Thank you,<br>HR Team</p>
      </body>
    </html>
  `,
  
  managerConfirmation: (managerName, employeesList) => `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Performance Review: Confirm Peer Reviewers</h2>
        <p>Hi ${managerName},</p>
        <p>Your direct reports have selected peer reviewers. Please review and confirm (or modify) the selections for each employee:</p>
        <ul>
          ${employeesList}
        </ul>
        <p>Click on each employee's name to review and confirm their peer reviewers.</p>
        <p>Thank you,<br>HR Team</p>
      </body>
    </html>
  `,
  
  reviewAssignment: (employeeName, reviewsList) => `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Performance Review: Complete Your Reviews</h2>
        <p>Hi ${employeeName},</p>
        <p>It's time to complete your performance reviews. You have the following reviews to complete:</p>
        <ul>
          ${reviewsList}
        </ul>
        <p>Please complete all reviews by the deadline. Click on each name to access the review form.</p>
        <p>Thank you,<br>HR Team</p>
      </body>
    </html>
  `,
  
  reminder: (employeeName, incompleteItems) => `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Performance Review Reminder</h2>
        <p>Hi ${employeeName},</p>
        <p>This is a friendly reminder that you still have incomplete items in your performance review:</p>
        <ul>
          ${incompleteItems}
        </ul>
        <p>Please complete these as soon as possible.</p>
        <p>Thank you,<br>HR Team</p>
      </body>
    </html>
  `
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get the active spreadsheet
 */
function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Get a specific sheet by name
 */
function getSheet(sheetName) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    // Create sheet if it doesn't exist
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

/**
 * Get all employee data from Employees sheet
 */
function getEmployeeData() {
  const sheet = getSheet(CONFIG.SHEET_EMPLOYEES);
  const data = sheet.getDataRange().getValues();
  const employees = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[CONFIG.EMP_COL_EMAIL]) {
      employees.push({
        email: row[CONFIG.EMP_COL_EMAIL],
        name: row[CONFIG.EMP_COL_NAME],
        managerEmail: row[CONFIG.EMP_COL_MANAGER_EMAIL] || '',
        managerName: row[CONFIG.EMP_COL_MANAGER_NAME] || '',
        isManager: row[CONFIG.EMP_COL_IS_MANAGER] === true || row[CONFIG.EMP_COL_IS_MANAGER] === 'TRUE',
        department: row[CONFIG.EMP_COL_DEPARTMENT] || '',
        status: row[CONFIG.EMP_COL_STATUS] || 'Active',
        rowIndex: i + 1 // 1-based for sheet
      });
    }
  }
  
  return employees;
}

/**
 * Find employee by email in Employees sheet
 */
function findEmployee(email) {
  const employees = getEmployeeData();
  return employees.find(emp => emp.email === email) || null;
}

/**
 * Get employee name by email
 */
function getEmployeeName(email) {
  const employee = findEmployee(email);
  return employee ? employee.name : '';
}

/**
 * Send email with HTML content
 */
function sendEmail(to, subject, htmlBody) {
  MailApp.sendEmail({
    to: to,
    subject: subject,
    htmlBody: htmlBody,
    from: CONFIG.FROM_EMAIL,
    replyTo: CONFIG.REPLY_TO
  });
}

/**
 * Mapping of form question titles to entry IDs
 * IMPORTANT: Update these with your actual entry IDs from your forms
 */
const FORM_ENTRY_IDS = {
  'Peer Selection Form': {
    'Employee Email': '',
    'Employee Name': '',
  },
  'Manager Confirmation Form': {
    'Employee Email': '',
    'Employee Name': '',
  },
  'Review Form': {
    'Reviewer Email': '',
    'Reviewee Email': '',
    'Review Type': '',
  }
};

/**
 * Helper function to get entry IDs from a form
 */
function getFormEntryIds(formId) {
  const form = FormApp.openById(formId);
  const items = form.getItems();
  const mapping = {};
  
  Logger.log(`Form: ${form.getTitle()}`);
  Logger.log('---');
  
  items.forEach((item, index) => {
    const title = item.getTitle();
    const itemId = item.getId();
    Logger.log(`Question ${index + 1}: "${title}"`);
    Logger.log(`Item ID: ${itemId}`);
    Logger.log('---');
    
    mapping[title] = {
      itemId: itemId,
      index: index
    };
  });
  
  return mapping;
}

/**
 * Create form URL with pre-filled fields
 */
function createFormUrl(formId, formName, prefillData) {
  const form = FormApp.openById(formId);
  const url = form.getPublishedUrl();
  const entryMap = FORM_ENTRY_IDS[formName] || {};
  
  const params = Object.keys(prefillData)
    .filter(key => entryMap[key] && entryMap[key] !== '')
    .map(key => {
      const entryId = entryMap[key];
      return `entry.${entryId}=${encodeURIComponent(prefillData[key])}`;
    })
    .join('&');
  
  if (!params) {
    Logger.log(`Warning: No entry IDs configured for form "${formName}". URL will not have pre-filled fields.`);
  }
  
  return params ? `${url}?${params}` : url;
}

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

/**
 * Store peer reviewers in separate columns
 * @param {Sheet} sheet - The sheet to update
 * @param {number} rowIndex - Row index (1-based)
 * @param {Array} peerValues - Array of peer values (can be emails, names, or "Name (email)" format)
 */
function storePeerReviewers(sheet, rowIndex, peerValues, startColIndex) {
  const employees = getEmployeeData();
  const emailToName = {};
  employees.forEach(emp => {
    emailToName[emp.email] = emp.name;
  });
  
  // Extract emails from form responses (handles "Name (email)" format)
  const peerEmails = peerValues.map(value => extractEmailFromResponse(value));
  
  // Clear existing peer reviewer columns first
  for (let i = 0; i < CONFIG.REQUIRED_PEER_REVIEWERS; i++) {
    sheet.getRange(rowIndex, startColIndex + (i * 2) + 1).setValue(''); // Name
    sheet.getRange(rowIndex, startColIndex + (i * 2) + 2).setValue(''); // Email
  }
  
  // Store peer reviewers
  peerEmails.forEach((email, index) => {
    if (index < CONFIG.REQUIRED_PEER_REVIEWERS) {
      const name = emailToName[email] || email;
      sheet.getRange(rowIndex, startColIndex + (index * 2) + 1).setValue(name);
      sheet.getRange(rowIndex, startColIndex + (index * 2) + 2).setValue(email);
    }
  });
}

/**
 * Get peer reviewers from separate columns
 * @param {Sheet} sheet - The sheet to read from
 * @param {number} rowIndex - Row index (1-based)
 * @param {number} startColIndex - Starting column index (0-based)
 * @returns {Array} Array of peer email addresses
 */
function getPeerReviewers(sheet, rowIndex, startColIndex) {
  const peers = [];
  for (let i = 0; i < CONFIG.REQUIRED_PEER_REVIEWERS; i++) {
    const email = sheet.getRange(rowIndex, startColIndex + (i * 2) + 2).getValue();
    if (email) {
      peers.push(email);
    }
  }
  return peers;
}

// ==================== PHASE 1: PEER SELECTION ====================

/**
 * Initialize Peer Selection sheet
 */
function initializePeerSelectionSheet() {
  const sheet = getSheet(CONFIG.SHEET_PEER_SELECTION);
  
  // Set headers
  const headers = [
    'Employee Email',
    'Employee Name',
    'Selection Status',
    'Peer Reviewer 1 Name',
    'Peer Reviewer 1 Email',
    'Peer Reviewer 2 Name',
    'Peer Reviewer 2 Email',
    'Peer Reviewer 3 Name',
    'Peer Reviewer 3 Email',
    'Peer Reviewer 4 Name',
    'Peer Reviewer 4 Email',
    'Peer Reviewer 5 Name',
    'Peer Reviewer 5 Email',
    'Date Selected',
    'Reminder Count',
    'Last Reminder Sent'
  ];
  
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}

/**
 * Send peer selection invites to all employees
 */
function sendPeerSelectionInvites() {
  initializePeerSelectionSheet();
  const employees = getEmployeeData();
  const formId = CONFIG.PEER_SELECTION_FORM_ID;
  const psSheet = getSheet(CONFIG.SHEET_PEER_SELECTION);
  
  employees.forEach(employee => {
    // Skip inactive employees
    if (employee.status !== 'Active') {
      return;
    }
    
    // Check if already in Peer Selection sheet
    const existingRow = findRowInSheet(psSheet, CONFIG.PS_COL_EMAIL, employee.email);
    
    if (existingRow === -1) {
      // Add new row
      const newRow = [
        employee.email,
        employee.name,
        'Pending',
        '', '', '', '', '', '', '', '', '', '', // Peer reviewer columns
        '', // Date Selected
        0,  // Reminder Count
        ''  // Last Reminder
      ];
      psSheet.appendRow(newRow);
    } else {
      // Update status to Pending
      psSheet.getRange(existingRow, CONFIG.PS_COL_STATUS + 1).setValue('Pending');
    }
    
    const formUrl = createFormUrl(formId, 'Peer Selection Form', {
      'Employee Email': employee.email,
      'Employee Name': employee.name
    });
    
    const emailBody = EMAIL_TEMPLATES.peerSelectionInvite(employee.name, formUrl);
    sendEmail(
      employee.email,
      'Performance Review: Select Your Peer Reviewers',
      emailBody
    );
  });
  
  Logger.log(`Sent peer selection invites to ${employees.length} employees`);
}

/**
 * Find row in sheet by column value
 */
function findRowInSheet(sheet, colIndex, value) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][colIndex] === value) {
      return i + 1; // 1-based
    }
  }
  return -1;
}

/**
 * Handle peer selection form submission
 */
function onPeerSelectionSubmit(e) {
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
          selectedPeers = responseValue;
        } else {
          selectedPeers = [responseValue];
        }
      }
    });
    
    if (!employeeEmail) {
      Logger.log('Error: Employee email not found in form response');
      return;
    }
    
    // Validate exactly 5 peer reviewers
    if (selectedPeers.length !== CONFIG.REQUIRED_PEER_REVIEWERS) {
      Logger.log(`Warning: ${employeeEmail} selected ${selectedPeers.length} peers, but exactly ${CONFIG.REQUIRED_PEER_REVIEWERS} are required`);
      const notificationEmail = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Peer Reviewer Selection Update Required</h2>
            <p>Hi ${employeeName || 'there'},</p>
            <p>We received your peer reviewer selection, but you selected ${selectedPeers.length} peer reviewer(s). You must select exactly ${CONFIG.REQUIRED_PEER_REVIEWERS} peer reviewers.</p>
            <p>Please resubmit the form with exactly ${CONFIG.REQUIRED_PEER_REVIEWERS} peer reviewers selected.</p>
            <p>Thank you,<br>HR Team</p>
          </body>
        </html>
      `;
      sendEmail(
        employeeEmail,
        'Action Required: Update Your Peer Reviewer Selection',
        notificationEmail
      );
      
      // Update status
      const psSheet = getSheet(CONFIG.SHEET_PEER_SELECTION);
      const rowIndex = findRowInSheet(psSheet, CONFIG.PS_COL_EMAIL, employeeEmail);
      if (rowIndex !== -1) {
        psSheet.getRange(rowIndex, CONFIG.PS_COL_STATUS + 1).setValue('Pending - Invalid Selection');
      }
      return;
    }
    
    // Update Peer Selection sheet
    const psSheet = getSheet(CONFIG.SHEET_PEER_SELECTION);
    let rowIndex = findRowInSheet(psSheet, CONFIG.PS_COL_EMAIL, employeeEmail);
    
    if (rowIndex === -1) {
      // Add new row
      const newRow = [employeeEmail, employeeName, 'Completed'];
      psSheet.appendRow(newRow);
      rowIndex = psSheet.getLastRow();
    } else {
      // Update existing row
      psSheet.getRange(rowIndex, CONFIG.PS_COL_STATUS + 1).setValue('Completed');
    }
    
    // Store peer reviewers in separate columns
    storePeerReviewers(psSheet, rowIndex, selectedPeers, CONFIG.PS_COL_PEER1_NAME);
    
    // Update date
    psSheet.getRange(rowIndex, CONFIG.PS_COL_DATE_SELECTED + 1).setValue(new Date());
    
    Logger.log(`Updated peer selection for ${employeeEmail}: ${selectedPeers.length} peers selected`);
  } catch (error) {
    Logger.log(`Error in onPeerSelectionSubmit: ${error.toString()}`);
  }
}

// ==================== PHASE 2: MANAGER CONFIRMATION ====================

/**
 * Initialize Manager Confirmation sheet
 */
function initializeManagerConfirmationSheet() {
  const sheet = getSheet(CONFIG.SHEET_MANAGER_CONFIRMATION);
  
  const headers = [
    'Employee Email',
    'Employee Name',
    'Manager Email',
    'Manager Name',
    'Confirmation Status',
    'Confirmed Peer Reviewer 1 Name',
    'Confirmed Peer Reviewer 1 Email',
    'Confirmed Peer Reviewer 2 Name',
    'Confirmed Peer Reviewer 2 Email',
    'Confirmed Peer Reviewer 3 Name',
    'Confirmed Peer Reviewer 3 Email',
    'Confirmed Peer Reviewer 4 Name',
    'Confirmed Peer Reviewer 4 Email',
    'Confirmed Peer Reviewer 5 Name',
    'Confirmed Peer Reviewer 5 Email',
    'Date Confirmed',
    'Reminder Count',
    'Last Reminder Sent'
  ];
  
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}

/**
 * Send manager confirmation emails
 */
function sendManagerConfirmationEmails() {
  initializeManagerConfirmationSheet();
  const employees = getEmployeeData();
  const psSheet = getSheet(CONFIG.SHEET_PEER_SELECTION);
  const managersMap = new Map();
  
  // Group employees by manager who have completed peer selection
  employees.forEach(employee => {
    if (employee.managerEmail && employee.status === 'Active') {
      const psRow = findRowInSheet(psSheet, CONFIG.PS_COL_EMAIL, employee.email);
      if (psRow !== -1) {
        const status = psSheet.getRange(psRow, CONFIG.PS_COL_STATUS + 1).getValue();
        if (status === 'Completed') {
          if (!managersMap.has(employee.managerEmail)) {
            managersMap.set(employee.managerEmail, {
              name: employee.managerName,
              employees: []
            });
          }
          managersMap.get(employee.managerEmail).employees.push(employee);
        }
      }
    }
  });
  
  // Create entries in Manager Confirmation sheet and send emails
  const mcSheet = getSheet(CONFIG.SHEET_MANAGER_CONFIRMATION);
  
  managersMap.forEach((managerData, managerEmail) => {
    const employeesList = managerData.employees.map(emp => {
      // Get selected peers from Peer Selection sheet
      const psRow = findRowInSheet(psSheet, CONFIG.PS_COL_EMAIL, emp.email);
      const selectedPeers = psRow !== -1 ? 
        getPeerReviewers(psSheet, psRow, CONFIG.PS_COL_PEER1_NAME) : [];
      
      // Create or update Manager Confirmation entry
      let mcRow = findRowInSheet(mcSheet, CONFIG.MC_COL_EMAIL, emp.email);
      if (mcRow === -1) {
        const newRow = [
          emp.email,
          emp.name,
          managerEmail,
          managerData.name,
          'Pending',
          '', '', '', '', '', '', '', '', '', '', // Peer reviewer columns
          '', // Date Confirmed
          0,  // Reminder Count
          ''  // Last Reminder
        ];
        mcSheet.appendRow(newRow);
        mcRow = mcSheet.getLastRow();
      } else {
        mcSheet.getRange(mcRow, CONFIG.MC_COL_STATUS + 1).setValue('Pending');
      }
      
      // Create form URL with selected peers info
      const peersList = selectedPeers.map(email => getEmployeeName(email)).join(', ');
      const formUrl = createFormUrl(CONFIG.MANAGER_CONFIRMATION_FORM_ID, 'Manager Confirmation Form', {
        'Employee Email': emp.email,
        'Employee Name': emp.name,
        'Selected Peer Reviewers': peersList
      });
      
      return `<li><a href="${formUrl}">${emp.name}</a> (Selected: ${peersList || 'None'})</li>`;
    }).join('');
    
    const emailBody = EMAIL_TEMPLATES.managerConfirmation(managerData.name, employeesList);
    sendEmail(
      managerEmail,
      'Performance Review: Confirm Peer Reviewers for Your Team',
      emailBody
    );
    
    Logger.log(`Sent confirmation email to manager: ${managerEmail}`);
  });
}

/**
 * Handle manager confirmation form submission
 */
function onManagerConfirmationSubmit(e) {
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
          confirmedPeers = responseValue;
        } else {
          confirmedPeers = [responseValue];
        }
      }
    });
    
    if (!employeeEmail) {
      Logger.log('Error: Employee email not found in confirmation form');
      return;
    }
    
    // Validate exactly 5 peer reviewers
    if (confirmedPeers.length !== CONFIG.REQUIRED_PEER_REVIEWERS) {
      Logger.log(`Warning: Manager confirmed ${confirmedPeers.length} peers for ${employeeEmail}, but exactly ${CONFIG.REQUIRED_PEER_REVIEWERS} are required`);
      // Still update but log warning
    }
    
    // Update Manager Confirmation sheet
    const mcSheet = getSheet(CONFIG.SHEET_MANAGER_CONFIRMATION);
    const rowIndex = findRowInSheet(mcSheet, CONFIG.MC_COL_EMAIL, employeeEmail);
    
    if (rowIndex === -1) {
      Logger.log(`Error: Employee not found in Manager Confirmation sheet: ${employeeEmail}`);
      return;
    }
    
    // Update status and store confirmed peers
    mcSheet.getRange(rowIndex, CONFIG.MC_COL_STATUS + 1).setValue('Completed');
    storePeerReviewers(mcSheet, rowIndex, confirmedPeers, CONFIG.MC_COL_PEER1_NAME);
    mcSheet.getRange(rowIndex, CONFIG.MC_COL_DATE_CONFIRMED + 1).setValue(new Date());
    
    Logger.log(`Updated manager confirmation for ${employeeEmail}: ${confirmedPeers.length} peers confirmed`);
  } catch (error) {
    Logger.log(`Error in onManagerConfirmationSubmit: ${error.toString()}`);
  }
}

// ==================== PHASE 3: REVIEW ASSIGNMENT ====================

/**
 * Initialize Review Assignments sheet
 */
function initializeReviewAssignmentsSheet() {
  const sheet = getSheet(CONFIG.SHEET_REVIEW_ASSIGNMENTS);
  
  const headers = [
    'Reviewer Email',
    'Reviewer Name',
    'Reviewee Email',
    'Reviewee Name',
    'Review Type',
    'Assignment Status',
    'Date Assigned',
    'Date Completed',
    'Form Response ID'
  ];
  
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}

/**
 * Send review assignments to all employees
 */
function sendReviewAssignments() {
  initializeReviewAssignmentsSheet();
  const employees = getEmployeeData();
  const mcSheet = getSheet(CONFIG.SHEET_MANAGER_CONFIRMATION);
  const raSheet = getSheet(CONFIG.SHEET_REVIEW_ASSIGNMENTS);
  
  employees.forEach(employee => {
    if (employee.status !== 'Active') {
      return;
    }
    
    // Check if manager confirmation is complete
    const mcRow = findRowInSheet(mcSheet, CONFIG.MC_COL_EMAIL, employee.email);
    if (mcRow === -1) {
      Logger.log(`Skipping ${employee.email}: Not in Manager Confirmation sheet`);
      return;
    }
    
    const mcStatus = mcSheet.getRange(mcRow, CONFIG.MC_COL_STATUS + 1).getValue();
    if (mcStatus !== 'Completed') {
      Logger.log(`Skipping ${employee.email}: Manager confirmation not complete`);
      return;
    }
    
    const reviewsList = [];
    const today = new Date();
    
    // 1. Self review (always required)
    const selfReviewUrl = createFormUrl(CONFIG.REVIEW_FORM_ID, 'Review Form', {
      'Reviewer Email': employee.email,
      'Reviewee Email': employee.email,
      'Review Type': 'Self'
    });
    reviewsList.push(`<li><a href="${selfReviewUrl}">Self Review</a></li>`);
    
    // Create review assignment
    createReviewAssignment(raSheet, employee.email, employee.name, employee.email, employee.name, 'Self', today);
    
    // 2. Manager review (if employee has a manager)
    if (employee.managerEmail) {
      const managerReviewUrl = createFormUrl(CONFIG.REVIEW_FORM_ID, 'Review Form', {
        'Reviewer Email': employee.email,
        'Reviewee Email': employee.managerEmail,
        'Review Type': 'Manager'
      });
      reviewsList.push(`<li><a href="${managerReviewUrl}">Review ${employee.managerName}</a> (Manager)</li>`);
      createReviewAssignment(raSheet, employee.email, employee.name, employee.managerEmail, employee.managerName, 'Manager', today);
    }
    
    // 3. Peer reviews
    const confirmedPeers = getPeerReviewers(mcSheet, mcRow, CONFIG.MC_COL_PEER1_NAME);
    confirmedPeers.forEach(peerEmail => {
      const peerName = getEmployeeName(peerEmail);
      const peerReviewUrl = createFormUrl(CONFIG.REVIEW_FORM_ID, 'Review Form', {
        'Reviewer Email': employee.email,
        'Reviewee Email': peerEmail,
        'Review Type': 'Peer'
      });
      reviewsList.push(`<li><a href="${peerReviewUrl}">Review ${peerName}</a> (Peer)</li>`);
      createReviewAssignment(raSheet, employee.email, employee.name, peerEmail, peerName, 'Peer', today);
    });
    
    // 4. Direct reports reviews (if employee is a manager)
    if (employee.isManager) {
      const directReports = employees.filter(emp => 
        emp.managerEmail === employee.email && emp.status === 'Active'
      );
      directReports.forEach(report => {
        const reportReviewUrl = createFormUrl(CONFIG.REVIEW_FORM_ID, 'Review Form', {
          'Reviewer Email': employee.email,
          'Reviewee Email': report.email,
          'Review Type': 'Direct Report'
        });
        reviewsList.push(`<li><a href="${reportReviewUrl}">Review ${report.name}</a> (Direct Report)</li>`);
        createReviewAssignment(raSheet, employee.email, employee.name, report.email, report.name, 'Direct Report', today);
      });
    }
    
    if (reviewsList.length > 0) {
      const emailBody = EMAIL_TEMPLATES.reviewAssignment(employee.name, reviewsList.join(''));
      sendEmail(
        employee.email,
        'Performance Review: Complete Your Reviews',
        emailBody
      );
      
      Logger.log(`Sent review assignments to ${employee.email}: ${reviewsList.length} reviews`);
    }
  });
}

/**
 * Create a review assignment row
 */
function createReviewAssignment(sheet, reviewerEmail, reviewerName, revieweeEmail, revieweeName, reviewType, dateAssigned) {
  // Check if assignment already exists
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][CONFIG.RA_COL_REVIEWER_EMAIL] === reviewerEmail &&
        data[i][CONFIG.RA_COL_REVIEWEE_EMAIL] === revieweeEmail &&
        data[i][CONFIG.RA_COL_REVIEW_TYPE] === reviewType) {
      // Already exists, don't create duplicate
      return;
    }
  }
  
  const newRow = [
    reviewerEmail,
    reviewerName,
    revieweeEmail,
    revieweeName,
    reviewType,
    'Assigned',
    dateAssigned,
    '', // Date Completed
    ''  // Response ID
  ];
  sheet.appendRow(newRow);
}

/**
 * Handle review form submission
 */
function onReviewFormSubmit(e) {
  try {
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    let reviewerEmail = '';
    let revieweeEmail = '';
    let reviewType = '';
    
    itemResponses.forEach(response => {
      const itemTitle = response.getItem().getTitle();
      const responseValue = response.getResponse();
      
      if (itemTitle === 'Reviewer Email' || itemTitle.includes('Reviewer Email')) {
        reviewerEmail = responseValue;
      } else if (itemTitle === 'Reviewee Email' || itemTitle.includes('Reviewee Email')) {
        revieweeEmail = responseValue;
      } else if (itemTitle === 'Review Type' || itemTitle.includes('Review Type')) {
        reviewType = responseValue;
      }
    });
    
    if (!reviewerEmail || !revieweeEmail || !reviewType) {
      Logger.log('Error: Missing required fields in review form');
      return;
    }
    
    // Update Review Assignments sheet
    const raSheet = getSheet(CONFIG.SHEET_REVIEW_ASSIGNMENTS);
    const data = raSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][CONFIG.RA_COL_REVIEWER_EMAIL] === reviewerEmail &&
          data[i][CONFIG.RA_COL_REVIEWEE_EMAIL] === revieweeEmail &&
          data[i][CONFIG.RA_COL_REVIEW_TYPE] === reviewType) {
        // Update status
        raSheet.getRange(i + 1, CONFIG.RA_COL_STATUS + 1).setValue('Completed');
        raSheet.getRange(i + 1, CONFIG.RA_COL_DATE_COMPLETED + 1).setValue(new Date());
        raSheet.getRange(i + 1, CONFIG.RA_COL_RESPONSE_ID + 1).setValue(formResponse.getId());
        break;
      }
    }
    
    Logger.log(`Updated review status: ${reviewerEmail} completed ${reviewType} review for ${revieweeEmail}`);
  } catch (error) {
    Logger.log(`Error in onReviewFormSubmit: ${error.toString()}`);
  }
}

// ==================== PHASE 4: REMINDERS ====================

/**
 * Send reminder emails to employees with incomplete reviews
 */
function sendReminders() {
  const employees = getEmployeeData();
  const raSheet = getSheet(CONFIG.SHEET_REVIEW_ASSIGNMENTS);
  const today = new Date();
  
  employees.forEach(employee => {
    if (employee.status !== 'Active') {
      return;
    }
    
    // Get all assignments for this employee
    const data = raSheet.getDataRange().getValues();
    const assignments = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][CONFIG.RA_COL_REVIEWER_EMAIL] === employee.email) {
        assignments.push({
          revieweeEmail: data[i][CONFIG.RA_COL_REVIEWEE_EMAIL],
          revieweeName: data[i][CONFIG.RA_COL_REVIEWEE_NAME],
          reviewType: data[i][CONFIG.RA_COL_REVIEW_TYPE],
          status: data[i][CONFIG.RA_COL_STATUS]
        });
      }
    }
    
    if (assignments.length === 0) {
      return; // No assignments
    }
    
    const incompleteItems = assignments
      .filter(a => a.status !== 'Completed')
      .map(a => `<li>${a.reviewType} Review: ${a.revieweeName}</li>`);
    
    if (incompleteItems.length === 0) {
      return; // All completed
    }
    
    // Check reminder settings (using Peer Selection sheet for tracking)
    const psSheet = getSheet(CONFIG.SHEET_PEER_SELECTION);
    const psRow = findRowInSheet(psSheet, CONFIG.PS_COL_EMAIL, employee.email);
    
    let reminderCount = 0;
    let lastReminder = null;
    
    if (psRow !== -1) {
      reminderCount = psSheet.getRange(psRow, CONFIG.PS_COL_REMINDER_COUNT + 1).getValue() || 0;
      lastReminder = psSheet.getRange(psRow, CONFIG.PS_COL_LAST_REMINDER + 1).getValue();
    }
    
    if (reminderCount >= CONFIG.MAX_REMINDERS) {
      Logger.log(`Max reminders reached for ${employee.email}`);
      return;
    }
    
    let shouldSend = false;
    if (!lastReminder) {
      shouldSend = true;
    } else {
      const lastReminderDate = new Date(lastReminder);
      const daysSince = (today - lastReminderDate) / (1000 * 60 * 60 * 24);
      if (daysSince >= CONFIG.REMINDER_INTERVAL_DAYS) {
        shouldSend = true;
      }
    }
    
    if (shouldSend) {
      const emailBody = EMAIL_TEMPLATES.reminder(employee.name, incompleteItems.join(''));
      sendEmail(
        employee.email,
        'Performance Review Reminder',
        emailBody
      );
      
      if (psRow !== -1) {
        psSheet.getRange(psRow, CONFIG.PS_COL_LAST_REMINDER + 1).setValue(today);
        psSheet.getRange(psRow, CONFIG.PS_COL_REMINDER_COUNT + 1).setValue(reminderCount + 1);
      }
      
      Logger.log(`Sent reminder to ${employee.email} (reminder #${reminderCount + 1})`);
    }
  });
}

/**
 * Send reminder emails to managers with incomplete peer reviewer confirmations
 */
function sendManagerReminders() {
  const employees = getEmployeeData();
  const mcSheet = getSheet(CONFIG.SHEET_MANAGER_CONFIRMATION);
  const managersMap = new Map();
  
  // Group employees by manager
  const data = mcSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const status = data[i][CONFIG.MC_COL_STATUS];
    if (status === 'Pending') {
      const managerEmail = data[i][CONFIG.MC_COL_MANAGER_EMAIL];
      const managerName = data[i][CONFIG.MC_COL_MANAGER_NAME];
      const empEmail = data[i][CONFIG.MC_COL_EMAIL];
      const empName = data[i][CONFIG.MC_COL_NAME];
      
      if (!managersMap.has(managerEmail)) {
        managersMap.set(managerEmail, {
          name: managerName,
          employees: []
        });
      }
      managersMap.get(managerEmail).employees.push({
        email: empEmail,
        name: empName
      });
    }
  }
  
  managersMap.forEach((managerData, managerEmail) => {
    const employeesList = managerData.employees.map(emp => {
      const formUrl = createFormUrl(CONFIG.MANAGER_CONFIRMATION_FORM_ID, 'Manager Confirmation Form', {
        'Employee Email': emp.email,
        'Employee Name': emp.name
      });
      
      return `<li><a href="${formUrl}">${emp.name}</a></li>`;
    }).join('');
    
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Performance Review Reminder: Confirm Peer Reviewers</h2>
          <p>Hi ${managerData.name},</p>
          <p>This is a reminder that you still need to confirm peer reviewers for the following employees:</p>
          <ul>
            ${employeesList}
          </ul>
          <p>Please complete this as soon as possible.</p>
          <p>Thank you,<br>HR Team</p>
        </body>
      </html>
    `;
    
    sendEmail(
      managerEmail,
      'Performance Review Reminder: Confirm Peer Reviewers',
      emailBody
    );
    
    Logger.log(`Sent manager reminder to ${managerEmail}`);
  });
}

// ==================== SETUP FUNCTION ====================

/**
 * Initial setup function - run this once to initialize all sheets
 */
function setup() {
  // Initialize Employees sheet
  const empSheet = getSheet(CONFIG.SHEET_EMPLOYEES);
  if (empSheet.getLastRow() === 0) {
    const headers = [
      'Employee Email',
      'Employee Name',
      'Manager Email',
      'Manager Name',
      'Is Manager',
      'Department',
      'Status'
    ];
    empSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    empSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  
  // Initialize other sheets
  initializePeerSelectionSheet();
  initializeManagerConfirmationSheet();
  initializeReviewAssignmentsSheet();
  
  Logger.log('Setup complete! All sheets initialized.');
}
