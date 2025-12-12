# Conditional Logic Setup Guide for Review Form

## Overview

Since your review form has different questions based on the review type, you need to set up conditional logic in Google Forms. This guide walks you through the process.

## Why Conditional Logic?

Different review types need different questions:
- **Self Review**: Questions about your own performance
- **Manager Review**: Questions about your manager's leadership
- **Peer Review**: Questions about a peer's collaboration
- **Direct Report Review**: Questions about a direct report's performance

Conditional logic ensures users only see relevant questions.

## Prerequisites

1. Review Type question must be **Dropdown** or **Multiple choice** (not short answer)
2. Review Type must come **before** conditional sections
3. Review Type values must match exactly: "Self", "Manager", "Peer", "Direct Report"

## Step-by-Step Setup

### Step 1: Add Initial Shared Questions First

1. **Add questions that ALL review types will answer**
   - These appear in the first section
   - Examples:
     - Overall performance rating (Scale 1-5)
     - Key strengths (Paragraph)
     - Areas for improvement (Paragraph)
     - Specific examples (Paragraph)
2. **These questions are answered by everyone** regardless of review type

### Step 2: Create Review Type Question (After Initial Questions)

1. **Position the Review Type question AFTER your initial shared questions**
2. In your Google Form, add a new question
3. **Type**: Dropdown (recommended) or Multiple choice
4. **Title**: "Review Type" or "What's your relationship to the individual you are evaluating?"
5. **Options**:
   - Self
   - Manager (or "My Manager")
   - Peer
   - Direct Report (or "My Direct Report")
6. **Required**: Yes
7. **Description**: "**Please do not modify this field** - It has been pre-filled for you."

**Important**: 
- The option values must match what the script sends: "Self", "Manager", "Peer", "Direct Report"
- This question should come **after** your initial shared questions
- Conditional logic will start from this question

### Step 3: Create Sections for Each Review Type

1. Click the **"Add section"** button (two rectangles icon) in the form toolbar
2. Create 4 sections:
   - **Section 2**: "Self Review Questions"
   - **Section 3**: "Manager Review Questions"
   - **Section 4**: "Peer Review Questions"
   - **Section 5**: "Direct Report Review Questions"

### Step 4: Add Questions to Each Conditional Section

Add your review questions to the appropriate section:

**Self Review Questions Section:**
- Rate your overall performance (Scale 1-5)
- What are your key strengths? (Paragraph)
- What areas would you like to improve? (Paragraph)
- What are your career goals? (Paragraph)
- Overall self-rating (Multiple choice)

**Manager Review Questions Section:**
- Rate your manager's leadership (Scale 1-5)
- What does your manager do well? (Paragraph)
- How can your manager better support you? (Paragraph)
- Manager effectiveness rating (Multiple choice)

**Peer Review Questions Section:**
- Rate this peer's collaboration (Scale 1-5)
- What are their key strengths? (Paragraph)
- What areas need improvement? (Paragraph)
- How well do they work in a team? (Paragraph)
- Overall peer rating (Multiple choice)

**Direct Report Review Questions Section:**
- Rate this direct report's performance (Scale 1-5)
- What are their key strengths? (Paragraph)
- What areas need development? (Paragraph)
- How can they grow in their role? (Paragraph)
- Overall performance rating (Multiple choice)

### Step 5: Set Up Conditional Logic

For each section, set up conditional logic:

1. **Click on the section** (e.g., "Self Review Questions")
2. Click the **three dots menu** (⋮) in the section header
3. Select **"Go to section based on answer"**
4. In the dropdown that appears, select **"Review Type"** question
5. Choose which answer shows this section:
   - **"Self Review Questions"** → Show when **"Self"** is selected
   - **"Manager Review Questions"** → Show when **"Manager"** is selected
   - **"Peer Review Questions"** → Show when **"Peer"** is selected
   - **"Direct Report Review Questions"** → Show when **"Direct Report"** is selected

### Step 6: Set Default Flow

For the main form flow:

1. After the Review Type question, set default to "Continue to next section"
2. Each conditional section should end with "Submit form"
3. This ensures users only see their relevant section and then submit

## Visual Example

```
Form Structure:

[Section 1: Initial Questions - All Review Types]
  Question 1: Reviewer Email (pre-filled)
  Question 2: Reviewee Email (pre-filled)
  Question 3: Reviewee Name
  Question 4: Overall performance rating (shared - all answer)
  Question 5: Key strengths (shared - all answer)
  Question 6: Areas for improvement (shared - all answer)
  Question 7: Review Type (pre-filled dropdown) ← Conditional logic starts here
    ↓
    Conditional Logic:
    ├─ If "Self" → [Section 2: Self Review Questions]
    │                → Submit form
    │
    ├─ If "Manager" → [Section 3: Manager Review Questions]
    │                  → Submit form
    │
    ├─ If "Peer" → [Section 4: Peer Review Questions]
    │               → Submit form
    │
    └─ If "Direct Report" → [Section 5: Direct Report Review Questions]
                              → Submit form
```

**Key Points:**
- All users answer Questions 1-6 (shared questions)
- Review Type question (Question 7) determines which conditional section appears
- Each conditional section has type-specific questions

## How Pre-filling Works with Conditional Logic

When the script creates a review URL with a pre-filled Review Type:

1. **URL includes**: `entry.XXXXX=Self` (or Manager/Peer/Direct Report)
2. **Form opens** with Review Type already selected
3. **Conditional logic triggers** automatically
4. **Correct section appears** based on pre-filled value
5. **User only sees** questions for that review type

**Example URLs:**
```
# Self Review
...viewform?entry.123=reviewer@email.com&entry.456=reviewee@email.com&entry.789=Self

# Peer Review
...viewform?entry.123=reviewer@email.com&entry.456=reviewee@email.com&entry.789=Peer
```

## Testing

### Test Each Review Type

1. **Test Self Review**:
   - Create URL with `Review Type=Self`
   - Open form
   - Verify "Self Review Questions" section appears
   - Verify other sections don't appear

2. **Test Manager Review**:
   - Create URL with `Review Type=Manager`
   - Open form
   - Verify "Manager Review Questions" section appears

3. **Test Peer Review**:
   - Create URL with `Review Type=Peer`
   - Open form
   - Verify "Peer Review Questions" section appears

4. **Test Direct Report Review**:
   - Create URL with `Review Type=Direct Report`
   - Open form
   - Verify "Direct Report Review Questions" section appears

### Common Issues

**Issue**: Wrong section appearing
- **Cause**: Review Type value doesn't match exactly
- **Fix**: Check that option values in form match: "Self", "Manager", "Peer", "Direct Report" (case-sensitive)

**Issue**: No section appearing
- **Cause**: Conditional logic not set up correctly
- **Fix**: Re-check section conditional logic settings

**Issue**: All sections appearing
- **Cause**: Conditional logic not applied
- **Fix**: Ensure "Go to section based on answer" is set for each section

**Issue**: Pre-fill not working
- **Cause**: Entry ID incorrect
- **Fix**: Verify FORM_ENTRY_IDS['Review Form']['Review Type'] has correct entry ID

## Code Compatibility

The script already handles dropdown/multiple choice responses correctly:

```javascript
// In onReviewFormSubmit()
if (itemTitle === 'Review Type' || itemTitle.includes('Review Type')) {
  reviewType = responseValue; // Works for dropdown/multiple choice
}
```

The response value will be the selected option text (e.g., "Self", "Manager", etc.), which matches what the code expects.

## Best Practices

1. **Use Dropdown** instead of Multiple choice for Review Type (cleaner UI)
2. **Keep option values simple**: "Self", "Manager", "Peer", "Direct Report"
3. **Test all four review types** before going live
4. **Add descriptions** to sections explaining what they're for
5. **Use consistent question structure** across sections for easier analysis

## Summary

✅ Review Type must be **Dropdown/Multiple choice** (not short answer)
✅ Create **separate sections** for each review type
✅ Set up **conditional logic** to show sections based on Review Type
✅ **Pre-filling works** with conditional logic automatically
✅ **Test all four types** to ensure correct sections appear

The system will automatically show the right questions based on the pre-filled Review Type!

