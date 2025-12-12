# Form Script Handlers

These are simplified handler scripts that you can copy to each form's script editor. This avoids the permission issues with cross-form triggers.

## Setup Instructions

### Step 1: Get Your Spreadsheet ID

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Copy the `SPREADSHEET_ID` part

### Step 2: Update Each Handler Script

For each handler file:
1. Open the file
2. Find `SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'`
3. Replace with your actual spreadsheet ID
4. Update email settings if needed

### Step 3: Copy to Form Scripts

#### For Peer Selection Form:

1. Open your **Peer Selection Form**
2. Click **three dots (⋮)** → **Script editor**
3. Delete any default code
4. Copy contents of `peer_selection_handler.gs`
5. Update `SPREADSHEET_ID` in the script
6. **Save** the script
7. Go to **Triggers** (⏰ icon)
8. **Add Trigger**:
   - Function: `onFormSubmit`
   - Event source: **From form** (should now be available!)
   - Event type: **On form submit**
9. **Save** and authorize

#### For Manager Confirmation Form:

1. Open **Manager Confirmation Form**
2. Three dots → Script editor
3. Copy contents of `manager_confirmation_handler.gs`
4. Update `SPREADSHEET_ID`
5. Set up trigger (same as above)

#### For Review Form:

1. Open **Performance Review Form**
2. Three dots → Script editor
3. Copy contents of `review_form_handler.gs`
4. Update `SPREADSHEET_ID`
5. Set up trigger (same as above)

## Why Separate Scripts?

- **Avoids permission issues**: Each form's script has direct access to that form
- **Simpler setup**: No need for complex cross-form permissions
- **More reliable**: Form-bound scripts work consistently
- **Easier debugging**: Each form's triggers are independent

## Testing

After setting up:

1. **Submit a test form**
2. **Check execution log** in that form's script editor
3. **Verify sheet updates** in your main spreadsheet
4. **Check for errors** in the log

## Troubleshooting

### "Spreadsheet not found"
- Verify SPREADSHEET_ID is correct
- Make sure you have edit access to the sheet

### "Sheet not found"
- Verify sheet names match exactly: "Peer Selection", "Manager Confirmation", "Review Assignments"
- Check for typos or extra spaces

### "Trigger not firing"
- Verify trigger is set to "From form" → "On form submit"
- Check that function name is exactly `onFormSubmit`
- Make sure you authorized permissions

## Alternative: Keep All Code in Main Script

If you prefer to keep everything in your main Code.gs, you can use the manual trigger setup method described in `MANUAL_TRIGGER_SETUP.md`, but you'll need to copy the handler functions to each form's script anyway.

The separate handler scripts are simpler and more reliable!

