/**
 * Review Form Handler
 * 
 * Copy this code to your Performance Review Form's script editor
 * (Form → Three dots → Script editor)
 * 
 * Then set up trigger: Triggers → Add Trigger → From form → On form submit
 */

// Update this with your spreadsheet ID (from Sheet URL)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Review Assignments';

/**
 * Handle review form submission
 * This is the main function that runs when the form is submitted
 */
function onFormSubmit(e) {
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
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === reviewerEmail &&      // Column 0 = Reviewer Email
          data[i][2] === revieweeEmail &&      // Column 2 = Reviewee Email
          data[i][4] === reviewType) {         // Column 4 = Review Type
        // Update status
        sheet.getRange(i + 1, 6).setValue('Completed'); // Column F = Assignment Status
        sheet.getRange(i + 1, 8).setValue(new Date()); // Column H = Date Completed
        sheet.getRange(i + 1, 9).setValue(formResponse.getId()); // Column I = Form Response ID
        break;
      }
    }
    
    Logger.log(`Updated review status: ${reviewerEmail} completed ${reviewType} review for ${revieweeEmail}`);
  } catch (error) {
    Logger.log(`Error in onFormSubmit: ${error.toString()}`);
  }
}

