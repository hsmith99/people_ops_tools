# Google Forms Setup Guide

This document provides detailed instructions for setting up the three Google Forms required for the Performance Review System.

## Form 1: Peer Reviewer Selection Form

### Purpose
Allows employees to select peers who will review them.

### Setup Steps

1. **Create a new Google Form**
   - Go to Google Forms and create a new form
   - Title: "Performance Review: Select Your Peer Reviewers"

2. **Add Questions**

   **Question 1: Employee Email (Pre-filled)**
   - Type: Short answer text
   - Title: "Employee Email"
   - Description: "**Please do not modify this field** - It has been pre-filled for you."
   - Make this a required field
   - **Important**: Google Forms does not support truly hidden fields. This field will be visible but pre-filled via URL parameters. Users should be instructed not to modify it.

   **Question 2: Employee Name (Pre-filled)**
   - Type: Short answer text
   - Title: "Employee Name"
   - Description: "**Please do not modify this field** - It has been pre-filled for you."
   - Make this a required field
   - **Important**: This field will be visible but pre-filled via URL parameters.

   **Question 3: Select Peer Reviewers**
   - Type: Checkbox grid or Multiple choice grid
   - Title: "Select Peer Reviewers"
   - Description: "Please select exactly 5 peers who will provide feedback on your performance"
   - Rows: List all employees (you'll need to update this manually or via script)
   - Columns: Single column with "Select" option
   - Make this a required field
   - **Important**: While Google Forms doesn't have built-in validation for exact count, the system will validate and notify employees if they don't select exactly 5 peers

   **Alternative Approach (Better for dynamic employee lists):**
   - Use a "Multiple choice" question with checkboxes
   - Options: List all employees
   - Allow multiple selections
   - **Note**: The system will automatically validate that exactly 5 peers are selected and notify employees if the count is incorrect

3. **Form Settings**
   - Collect email addresses: OFF (we're using pre-filled fields instead)
   - Limit to 1 response: ON
   - Show progress bar: ON
   
   **Note on Pre-filled Fields**: Google Forms does not support truly hidden fields. Fields will be pre-filled using URL parameters, but they will still be visible to users. Consider:
   - Adding clear descriptions instructing users not to modify pre-filled fields
   - Using form validation to ensure pre-filled values match expected format
   - Using a third-party add-on like Formfacade if you need truly hidden fields

4. **Get Form ID**
   - Click "Send" button
   - Click the link icon
   - Copy the form ID from the URL (the long string between `/d/` and `/viewform`)
   - Update `PEER_SELECTION_FORM_ID` in `Code.gs`

5. **Set up Form Submission Trigger**
   - In Apps Script, go to Triggers
   - Add trigger for `onPeerSelectionSubmit`
   - Event: On form submit
   - Select this form

## Form 2: Manager Peer Reviewer Confirmation Form

### Purpose
Allows managers to confirm or modify peer reviewer selections for their direct reports.

### Setup Steps

1. **Create a new Google Form**
   - Title: "Performance Review: Confirm Peer Reviewers"

2. **Add Questions**

   **Question 1: Employee Email (Pre-filled)**
   - Type: Short answer text
   - Title: "Employee Email"
   - Description: "**Please do not modify this field** - It has been pre-filled for you."
   - Required: Yes
   - **Note**: This field will be visible but pre-filled via URL parameters

   **Question 2: Employee Name (Pre-filled)**
   - Type: Short answer text
   - Title: "Employee Name"
   - Description: "**Please do not modify this field** - It has been pre-filled for you."
   - Required: Yes
   - **Note**: This field will be visible but pre-filled via URL parameters

   **Question 3: Selected Peer Reviewers (Info Only)**
   - Type: Paragraph text (or use description)
   - Title: "Currently Selected Peer Reviewers"
   - Description: "The employee has selected the following peer reviewers. Review and confirm or modify below."
   - Note: This is informational only - you can display the pre-filled selected peers in the description

   **Question 4: Confirm/Reselect Peer Reviewers**
   - Type: Checkbox grid or Multiple choice
   - Title: "Confirm or Reselect Peer Reviewers"
   - Description: "Review the selections below. Check the boxes for the peers you want to confirm for this employee."
   - Options: List all employees
   - Required: Yes

3. **Form Settings**
   - Collect email addresses: OFF
   - Limit to 1 response: OFF (managers may need to submit multiple times for different employees)
   - Show progress bar: ON

4. **Get Form ID and Update Code**
   - Copy form ID and update `MANAGER_CONFIRMATION_FORM_ID` in `Code.gs`

5. **Set up Form Submission Trigger**
   - Go to Apps Script → Triggers (⏰ icon)
   - Click "+ Add Trigger"
   - Function: `onManagerConfirmationSubmit`
   - Event source: From form
   - Event type: On form submit
   - Form: Select your Manager Confirmation Form
   - Save and authorize permissions
   - **See `TRIGGER_SETUP_EXPLAINED.md` for detailed instructions**

## Form 3: Performance Review Form

### Purpose
The actual review form that employees complete for self-review, manager review, peer reviews, and direct report reviews.

### Setup Steps

1. **Create a new Google Form**
   - Title: "Performance Review Form"

2. **Add Questions**

   **Question 1: Reviewer Email (Pre-filled)**
   - Type: Short answer text
   - Title: "Reviewer Email"
   - Description: "**Please do not modify this field** - It has been pre-filled for you."
   - Required: Yes
   - **Note**: This field will be visible but pre-filled via URL parameters

   **Question 2: Reviewee Email (Pre-filled)**
   - Type: Short answer text
   - Title: "Reviewee Email"
   - Description: "**Please do not modify this field** - It has been pre-filled for you."
   - Required: Yes
   - **Note**: This field will be visible but pre-filled via URL parameters

   **Question 3: Reviewee Name (Info)**
   - Type: Short answer text or description
   - Title: "You are reviewing: [Name]"
   - Description: Display the name of the person being reviewed
   - Note: This can be populated from the reviewee email

   **Questions 4-N: Initial Shared Questions (All Review Types)**
   - Add your initial questions that **all review types** will answer
   - Examples:
     - "Overall performance rating" (Scale 1-5)
     - "What are their key strengths?" (Paragraph)
     - "What areas need improvement?" (Paragraph)
     - "Provide specific examples" (Paragraph)
   - These questions appear for **all** review types before conditional logic

   **Question N+1: Review Type (Pre-filled Dropdown) - Positioned After Initial Questions**
   - Type: **Dropdown** or **Multiple choice** (recommended: Dropdown)
   - Title: "Review Type" or "What's your relationship to the individual you are evaluating?"
   - Description: "**Please do not modify this field** - It has been pre-filled for you."
   - Required: Yes
   - Options:
     - "Self"
     - "Manager" (or "My Manager")
     - "Peer"
     - "Direct Report" (or "My Direct Report")
   - **Important**: 
     - This must be a dropdown/multiple choice to enable conditional logic
     - This question should come **after** your initial shared questions
     - Conditional sections will appear **after** this question
   - **Note**: This field will be visible but pre-filled via URL parameters
   - **Conditional Logic**: After this question, set up conditional sections that show different questions based on the selected review type (see Conditional Logic Setup below)

   **After Review Type Question: Conditional Sections**
   
   **Set up conditional sections** that appear after the Review Type question:
   
   - **Section: Self Review Questions** (shown when Review Type = "Self")
     - Additional questions specific to self-reviews
     - Examples:
       - "What are your career goals?" (Paragraph)
       - "What support do you need to achieve your goals?" (Paragraph)
       - "Overall self-rating" (Multiple choice: Exceeds, Meets, Below)
   
   - **Section: Manager Review Questions** (shown when Review Type = "Manager")
     - Additional questions specific to manager reviews
     - Examples:
       - "Rate your manager's leadership" (Scale 1-5)
       - "What does your manager do well?" (Paragraph)
       - "How can your manager better support you?" (Paragraph)
       - "Manager effectiveness rating" (Multiple choice: Excellent, Good, Needs Improvement)
   
   - **Section: Peer Review Questions** (shown when Review Type = "Peer")
     - Additional questions specific to peer reviews
     - Examples:
       - "Rate this peer's collaboration" (Scale 1-5)
       - "How well do they work in a team?" (Paragraph)
       - "Would you want to work with them again?" (Yes/No)
       - "Overall peer rating" (Multiple choice: Exceeds, Meets, Below)
   
   - **Section: Direct Report Review Questions** (shown when Review Type = "Direct Report")
     - Additional questions specific to direct report reviews
     - Examples:
       - "Rate this direct report's performance" (Scale 1-5)
       - "How can they grow in their role?" (Paragraph)
       - "Recommendations for development" (Paragraph)
       - "Overall performance rating" (Multiple choice: Exceeds, Meets, Below)
   
   **Form Structure:**
   ```
   [Section 1: Initial Questions - All Review Types]
     Question 1: Reviewer Email (pre-filled)
     Question 2: Reviewee Email (pre-filled)
     Question 3: Reviewee Name
     Question 4: Overall performance rating (shared)
     Question 5: Key strengths (shared)
     Question 6: Areas for improvement (shared)
     Question 7: Review Type (pre-filled dropdown) ← Conditional logic starts here
       ↓
       ├─ If "Self" → [Section 2: Self Review Questions]
       ├─ If "Manager" → [Section 3: Manager Review Questions]
       ├─ If "Peer" → [Section 4: Peer Review Questions]
       └─ If "Direct Report" → [Section 5: Direct Report Review Questions]
   ```
   
   **See "Conditional Logic Setup" section below for detailed instructions.**

3. **Form Settings**
   - Collect email addresses: OFF
   - Limit to 1 response: ON (each person can only submit one review per reviewee)
   - Show progress bar: ON

4. **Get Form ID and Update Code**
   - Copy form ID and update `REVIEW_FORM_ID` in `Code.gs`

5. **Set up Form Submission Trigger**
   - Go to Apps Script → Triggers (⏰ icon)
   - Click "+ Add Trigger"
   - Function: `onReviewFormSubmit`
   - Event source: From form
   - Event type: On form submit
   - Form: Select your Performance Review Form
   - Save and authorize permissions
   - **See `TRIGGER_SETUP_EXPLAINED.md` for detailed step-by-step instructions with screenshots**

## Conditional Logic Setup

Since you're using different questions based on Review Type, you'll need to set up conditional sections in Google Forms. The Review Type question comes **after** your initial shared questions.

### Step-by-Step: Setting Up Conditional Logic

1. **Add Initial Shared Questions First**
   - Add all questions that **all review types** will answer
   - These appear in the first section
   - Examples: Overall rating, key strengths, areas for improvement

2. **Create the Review Type Question (After Initial Questions)**
   - Add as Dropdown or Multiple choice
   - Position it **after** your initial shared questions
   - Options: "Self", "Manager", "Peer", "Direct Report"
   - Make it required
   - This question triggers the conditional logic

3. **Create Sections for Each Review Type**
   - Click the "Add section" button (two rectangles icon)
   - Create sections **after** the Review Type question:
     - "Self Review Questions"
     - "Manager Review Questions"
     - "Peer Review Questions"
     - "Direct Report Review Questions"

4. **Add Questions to Each Conditional Section**
   - Add questions specific to each review type
   - These are the questions that differ between review types

5. **Set Up Conditional Logic**
   - Click on the section (e.g., "Self Review Questions")
   - Click the three dots menu (⋮) → "Go to section based on answer"
   - Select the "Review Type" question
   - Choose which answer shows this section:
     - "Self Review Questions" → Show when "Self" is selected
     - "Manager Review Questions" → Show when "Manager" is selected
     - "Peer Review Questions" → Show when "Peer" is selected
     - "Direct Report Review Questions" → Show when "Direct Report" is selected

6. **Set Default Section Flow**
   - After the Review Type question, set it to "Continue to next section"
   - Each conditional section should end with "Submit form"
   - The form will automatically route to the correct section based on the pre-filled Review Type

### Important Notes

- **Pre-filled values work with conditional logic**: When Review Type is pre-filled via URL, the form will automatically show the correct section after initial questions
- **Test thoroughly**: Submit test forms with each Review Type to ensure correct sections appear
- **Question order matters**: Initial shared questions → Review Type question → Conditional sections
- **Section navigation**: Users answer shared questions, then see type-specific questions based on Review Type

### Example Structure

```
[Section 1: Initial Questions - All Review Types]
  Question 1: Reviewer Email (pre-filled)
  Question 2: Reviewee Email (pre-filled)
  Question 3: Reviewee Name
  Question 4: Overall performance rating (shared - all types answer)
  Question 5: Key strengths (shared - all types answer)
  Question 6: Areas for improvement (shared - all types answer)
  Question 7: Review Type (pre-filled dropdown) ← Conditional logic starts here
    ↓
    ├─ If "Self" → [Section 2: Self Review Questions]
    ├─ If "Manager" → [Section 3: Manager Review Questions]
    ├─ If "Peer" → [Section 4: Peer Review Questions]
    └─ If "Direct Report" → [Section 5: Direct Report Review Questions]
```

### Troubleshooting Conditional Logic

- **Section not showing**: Check that conditional logic is set correctly
- **Wrong section appearing**: Verify Review Type value matches exactly (case-sensitive)
- **Pre-fill not working**: Ensure entry ID for Review Type is correct in FORM_ENTRY_IDS

## Advanced: Dynamic Employee Lists

If you have many employees and want the forms to automatically update with the current employee list, you can create a helper function in Apps Script:

```javascript
/**
 * Update form with current employee list
 * Run this periodically or when employees change
 */
function updateFormEmployeeLists() {
  const employees = getEmployeeData();
  const employeeNames = employees.map(emp => emp.name);
  
  // Update peer selection form
  const peerForm = FormApp.openById(CONFIG.PEER_SELECTION_FORM_ID);
  const peerQuestion = peerForm.getItems()[2]; // Adjust index as needed
  if (peerQuestion.getType() === FormApp.ItemType.CHECKBOX_GRID) {
    // Update checkbox grid options
    // Note: This requires more complex logic based on your form structure
  }
  
  // Similar updates for other forms...
}
```

## Testing

1. **Test Peer Selection Form**
   - Manually fill out the form
   - Check that `onPeerSelectionSubmit` is triggered
   - Verify data appears in the sheet

2. **Test Manager Confirmation Form**
   - Use a test employee email
   - Submit the form
   - Check that `onManagerConfirmationSubmit` is triggered
   - Verify sheet is updated

3. **Test Review Form**
   - Submit a test review
   - Check that `onReviewFormSubmit` is triggered
   - Verify status columns are updated correctly

## Alternative: Using Formfacade Add-on for Truly Hidden Fields

If you need truly hidden fields that users cannot see or modify, consider using the **Formfacade** add-on for Google Forms:

1. Install Formfacade from the Google Workspace Marketplace
2. Use Formfacade to hide specific fields
3. Fields will still be pre-filled via URL parameters but won't be visible to users

**Note**: This requires a third-party add-on and may have additional setup steps.

## Troubleshooting

- **Form responses not triggering**: Check that triggers are set up correctly in Apps Script
- **Pre-filled fields not working**: Verify URL parameter names match form question titles exactly (case-sensitive, must match exactly)
- **Users modifying pre-filled fields**: Add clear descriptions or use form validation to prevent changes
- **Multiple submissions**: Check form settings for "Limit to 1 response"
- **Email collection**: Make sure "Collect email addresses" is OFF if using pre-filled fields

