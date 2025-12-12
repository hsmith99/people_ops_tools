# Google Forms URL Pre-filling Guide

## Important: Google Forms Limitations

**Google Forms does NOT support truly hidden fields.** Fields can be pre-filled using URL parameters, but they will still be **visible to users**. Users can see and potentially modify these fields.

## How URL Pre-filling Works

Google Forms uses URL parameters in the format `entry.XXXXX=value` where `XXXXX` is the entry ID of the form item.

### Getting Entry IDs

There are several ways to get entry IDs for your form fields:

#### Method 1: View Form Source (Easiest)

1. Open your Google Form
2. Right-click and select "View Page Source" (or press Ctrl+U / Cmd+U)
3. Search for your question text
4. Look for `entry.` followed by numbers - this is your entry ID
5. Example: `<input name="entry.123456789"` means entry ID is `123456789`

#### Method 2: Use Apps Script

```javascript
function getFormEntryIds() {
  const formId = 'YOUR_FORM_ID';
  const form = FormApp.openById(formId);
  const items = form.getItems();
  
  items.forEach((item, index) => {
    Logger.log(`Question: ${item.getTitle()}`);
    Logger.log(`Entry ID: ${item.getId()}`);
    Logger.log(`Index: ${index}`);
    Logger.log('---');
  });
}
```

**Note**: The `item.getId()` may not directly correspond to the entry ID used in URLs. You may need to test or use Method 1.

#### Method 3: Test with URL Parameters

1. Create a test form with one question
2. Submit the form
3. Check the form response URL or use browser developer tools to see the entry ID used

### Building Pre-filled URLs

Once you have entry IDs, build URLs like this:

```
https://docs.google.com/forms/d/e/FORM_ID/viewform?entry.123456789=value1&entry.987654321=value2
```

### Updating the Code

You'll need to update the `createFormUrl` function in `Code.gs` with your actual entry IDs. Here's a helper function:

```javascript
/**
 * Get entry ID mapping for a form
 * Run this once to get the entry IDs for your form
 */
function getFormEntryMapping(formId) {
  const form = FormApp.openById(formId);
  const items = form.getItems();
  const mapping = {};
  
  items.forEach((item, index) => {
    const title = item.getTitle();
    // Note: You may need to manually map these to actual entry IDs
    // from the form's HTML source
    mapping[title] = {
      itemId: item.getId(),
      index: index,
      type: item.getType().toString()
    };
  });
  
  Logger.log(JSON.stringify(mapping, null, 2));
  return mapping;
}

/**
 * Create form URL with pre-filled fields using known entry IDs
 * Update the ENTRY_ID_MAP with your actual entry IDs
 */
const ENTRY_ID_MAP = {
  'Peer Selection Form': {
    'Employee Email': '123456789',  // Replace with actual entry ID
    'Employee Name': '987654321',   // Replace with actual entry ID
  },
  'Manager Confirmation Form': {
    'Employee Email': '111222333',  // Replace with actual entry ID
    'Employee Name': '444555666',   // Replace with actual entry ID
  },
  'Review Form': {
    'Reviewer Email': '777888999',  // Replace with actual entry ID
    'Reviewee Email': '000111222',  // Replace with actual entry ID
    'Review Type': '333444555',     // Replace with actual entry ID
  }
};

function createFormUrlWithEntryIds(formId, formName, prefillData) {
  const form = FormApp.openById(formId);
  const url = form.getPublishedUrl();
  const entryMap = ENTRY_ID_MAP[formName] || {};
  
  const params = Object.keys(prefillData)
    .filter(key => entryMap[key]) // Only include keys we have entry IDs for
    .map(key => {
      const entryId = entryMap[key];
      return `entry.${entryId}=${encodeURIComponent(prefillData[key])}`;
    })
    .join('&');
  
  return params ? `${url}?${params}` : url;
}
```

## Alternative Solutions

### Option 1: Use Form Descriptions

Since fields can't be hidden, add clear descriptions:

- "**Please do not modify this field** - It has been pre-filled for you."
- Use bold text and clear instructions
- Place these fields at the top of the form

### Option 2: Use Form Validation

Add validation rules to prevent users from changing pre-filled values:

1. In Google Forms, click on the question
2. Click the three dots menu
3. Select "Response validation"
4. Set validation to match the expected pre-filled value

### Option 3: Use Formfacade Add-on

The Formfacade add-on allows you to truly hide fields:

1. Install Formfacade from Google Workspace Marketplace
2. Use it to hide specific fields
3. Fields will still be pre-filled but won't be visible

**Note**: This requires a third-party add-on and may have additional setup.

### Option 4: Use "Collect Email Addresses" Feature

For the reviewer/reviewee email fields, you could:

1. Enable "Collect email addresses" in form settings
2. Use the respondent's email automatically
3. Still use URL parameters for other fields

**Limitation**: This only works for one email field (the respondent's).

## Testing Pre-filled URLs

1. Create a test form with sample questions
2. Generate a pre-filled URL using your method
3. Open the URL in an incognito/private window
4. Verify fields are pre-filled correctly
5. Check that values are submitted correctly

## Troubleshooting

- **Fields not pre-filling**: Verify entry IDs are correct (they're case-sensitive)
- **Wrong values appearing**: Check that entry IDs match the correct questions
- **Users modifying fields**: Add validation or use Formfacade add-on
- **Special characters**: Make sure values are properly URL-encoded

## Recommended Approach

For this performance review system, we recommend:

1. **Use pre-filled fields with clear descriptions** telling users not to modify them
2. **Add form validation** to ensure values match expected format
3. **Place pre-filled fields at the top** of the form with clear instructions
4. **Test thoroughly** to ensure the system works even if users accidentally modify fields
5. **Consider Formfacade** if you need truly hidden fields (adds complexity but better UX)

