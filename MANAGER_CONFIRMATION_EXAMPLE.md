# Manager Confirmation System - Detailed Example

This document explains how the manager confirmation system works with a concrete example.

## Scenario Setup

Let's say we have a small team:

**Employees Sheet:**
- **Jane Manager** (jane@company.com) - Manager, no manager
- **Alice Smith** (alice@company.com) - Reports to Jane
- **Bob Jones** (bob@company.com) - Reports to Jane
- **Charlie Brown** (charlie@company.com) - Reports to Jane

---

## Phase 1: Peer Selection (Before Manager Confirmation)

### Step 1: Employees Select Their Peers

After `sendPeerSelectionInvites()` runs, employees select their 5 peer reviewers.

**Peer Selection Sheet** after employees submit:

| Employee Email | Employee Name | Status | Peer 1 Name | Peer 1 Email | Peer 2 Name | Peer 2 Email | ... |
|---------------|--------------|--------|-------------|--------------|------------|--------------|-----|
| alice@company.com | Alice Smith | Completed | Bob Jones | bob@company.com | Charlie Brown | charlie@company.com | ... |
| bob@company.com | Bob Jones | Completed | Alice Smith | alice@company.com | Charlie Brown | charlie@company.com | ... |
| charlie@company.com | Charlie Brown | Completed | Alice Smith | alice@company.com | Bob Jones | bob@company.com | ... |

**Key Point**: At this stage, managers haven't seen or confirmed these selections yet.

---

## Phase 2: Manager Confirmation Process

### Step 2: System Prepares Manager Confirmation

When HR runs `sendManagerConfirmationEmails()`, the system:

1. **Reads Peer Selection Sheet**: Finds all employees with status = "Completed"
2. **Groups by Manager**: Groups employees by their manager email
3. **Creates Manager Confirmation Entries**: Creates rows in Manager Confirmation sheet
4. **Sends Emails**: Sends one email per manager with all their direct reports

### Step 3: Manager Confirmation Sheet Created

**Manager Confirmation Sheet** (initial state):

| Employee Email | Employee Name | Manager Email | Manager Name | Status | Confirmed Peer 1 Name | Confirmed Peer 1 Email | ... |
|---------------|--------------|---------------|--------------|--------|----------------------|----------------------|-----|
| alice@company.com | Alice Smith | jane@company.com | Jane Manager | Pending | (empty) | (empty) | ... |
| bob@company.com | Bob Jones | jane@company.com | Jane Manager | Pending | (empty) | (empty) | ... |
| charlie@company.com | Charlie Brown | jane@company.com | Jane Manager | Pending | (empty) | (empty) | ... |

**Note**: The confirmed peer reviewer columns are empty at this point - waiting for manager input.

### Step 4: Manager Receives Email

**Jane Manager** receives an email like this:

```
Subject: Performance Review: Confirm Peer Reviewers for Your Team

Hi Jane Manager,

Your direct reports have selected peer reviewers. Please review and confirm 
(or modify) the selections for each employee:

• Alice Smith (Selected: Bob Jones, Charlie Brown, ...)
• Bob Jones (Selected: Alice Smith, Charlie Brown, ...)
• Charlie Brown (Selected: Alice Smith, Bob Jones, ...)

Click on each employee's name to review and confirm their peer reviewers.
```

Each employee name is a **hyperlink** to a pre-filled form.

### Step 5: Manager Clicks on Employee Link

When Jane clicks "Alice Smith", she opens a form URL like:

```
https://docs.google.com/forms/d/e/FORM_ID/viewform?
  entry.123=alice@company.com&
  entry.456=Alice%20Smith&
  entry.789=Bob%20Jones,%20Charlie%20Brown,...
```

**What Jane Sees in the Form:**

```
Employee Email: [alice@company.com]  ← Pre-filled, visible
Employee Name: [Alice Smith]          ← Pre-filled, visible

Currently Selected Peer Reviewers:
Bob Jones, Charlie Brown, [3 more names]

Confirm or Reselect Peer Reviewers:
☐ Alice Smith
☑ Bob Jones          ← Already checked (from employee selection)
☑ Charlie Brown      ← Already checked
☐ [Other employees...]
☐ [Other employees...]
```

**Key Point**: The form shows Alice's selections, but Jane can:
- **Confirm** by leaving them checked
- **Modify** by unchecking some and checking others
- **Reselect** completely different peers

### Step 6: Manager Submits Confirmation

Jane reviews Alice's selections and decides:
- Keep: Bob Jones, Charlie Brown, [3 others]
- The form shows all 5 are selected

Jane clicks "Submit"

### Step 7: System Processes Confirmation

When `onManagerConfirmationSubmit()` is triggered:

1. **Extracts Data** from form response:
   - Employee Email: `alice@company.com`
   - Confirmed Peers: `['bob@company.com', 'charlie@company.com', 'peer3@company.com', 'peer4@company.com', 'peer5@company.com']`

2. **Finds Row** in Manager Confirmation sheet for `alice@company.com`

3. **Updates Manager Confirmation Sheet**:

| Employee Email | Employee Name | Manager Email | Manager Name | Status | Confirmed Peer 1 Name | Confirmed Peer 1 Email | Confirmed Peer 2 Name | Confirmed Peer 2 Email | ... |
|---------------|--------------|---------------|--------------|--------|----------------------|----------------------|----------------------|----------------------|-----|
| alice@company.com | Alice Smith | jane@company.com | Jane Manager | **Completed** | Bob Jones | bob@company.com | Charlie Brown | charlie@company.com | ... |

4. **Stores Each Peer in Separate Columns**:
   - Confirmed Peer Reviewer 1 Name: "Bob Jones"
   - Confirmed Peer Reviewer 1 Email: "bob@company.com"
   - Confirmed Peer Reviewer 2 Name: "Charlie Brown"
   - Confirmed Peer Reviewer 2 Email: "charlie@company.com"
   - (and so on for all 5 peers)

5. **Updates Date Confirmed**: Sets current date/time

### Step 8: Manager Confirms Remaining Employees

Jane repeats the process for Bob and Charlie. After all three:

**Manager Confirmation Sheet** (final state):

| Employee Email | Employee Name | Status | Confirmed Peer 1 Name | Confirmed Peer 1 Email | ... |
|---------------|--------------|--------|----------------------|----------------------|-----|
| alice@company.com | Alice Smith | **Completed** | Bob Jones | bob@company.com | ... |
| bob@company.com | Bob Jones | **Completed** | Alice Smith | alice@company.com | ... |
| charlie@company.com | Charlie Brown | **Completed** | Alice Smith | alice@company.com | ... |

---

## Phase 3: How Manager Confirmation Feeds Into Review Assignments

### Step 9: System Uses Confirmed Peers for Review Assignments

When HR runs `sendReviewAssignments()`, the system:

1. **Reads Manager Confirmation Sheet**: Finds employees with status = "Completed"
2. **Gets Confirmed Peers**: Reads the confirmed peer reviewer columns
3. **Creates Review Assignments**: Creates one row per review needed

### Example: Review Assignments for Alice

**Review Assignments Sheet** (after `sendReviewAssignments()` runs):

| Reviewer Email | Reviewer Name | Reviewee Email | Reviewee Name | Review Type | Status |
|---------------|--------------|---------------|--------------|-------------|--------|
| alice@company.com | Alice Smith | alice@company.com | Alice Smith | Self | Assigned |
| alice@company.com | Alice Smith | jane@company.com | Jane Manager | Manager | Assigned |
| alice@company.com | Alice Smith | bob@company.com | Bob Jones | Peer | Assigned |
| alice@company.com | Alice Smith | charlie@company.com | Charlie Brown | Peer | Assigned |
| alice@company.com | Alice Smith | peer3@company.com | Peer 3 Name | Peer | Assigned |
| alice@company.com | Alice Smith | peer4@company.com | Peer 4 Name | Peer | Assigned |
| alice@company.com | Alice Smith | peer5@company.com | Peer 5 Name | Peer | Assigned |

**Key Point**: The peer reviews come from the **Manager Confirmation sheet**, not the Peer Selection sheet. This ensures Alice only reviews the peers her manager confirmed.

---

## Data Flow Diagram

```
┌─────────────────────┐
│  Employees Sheet    │
│  (Master Data)      │
│                     │
│  Alice → Jane       │
│  Bob → Jane         │
│  Charlie → Jane     │
└──────────┬──────────┘
           │
           │ Phase 1: Peer Selection
           ▼
┌─────────────────────┐
│ Peer Selection      │
│ Sheet               │
│                     │
│ Alice selected:     │
│ Bob, Charlie, ...   │
│ Status: Completed   │
└──────────┬──────────┘
           │
           │ sendManagerConfirmationEmails()
           ▼
┌─────────────────────┐
│ Manager Confirmation│
│ Sheet               │
│                     │
│ Alice: Pending      │
│ (empty peer cols)   │
└──────────┬──────────┘
           │
           │ Manager clicks link
           │ Manager submits form
           ▼
┌─────────────────────┐
│ Manager Confirmation│
│ Sheet (Updated)     │
│                     │
│ Alice: Completed    │
│ Confirmed: Bob,     │
│ Charlie, ...        │
└──────────┬──────────┘
           │
           │ sendReviewAssignments()
           ▼
┌─────────────────────┐
│ Review Assignments  │
│ Sheet               │
│                     │
│ Alice → Bob (Peer)  │
│ Alice → Charlie     │
│ (Peer)              │
└─────────────────────┘
```

---

## Key Interactions

### 1. Manager Can Modify Selections

**Scenario**: Alice selected 5 peers, but Jane thinks one isn't appropriate.

**What Happens**:
- Jane unchecks the inappropriate peer
- Jane checks a different peer
- System stores Jane's final selection (not Alice's original)
- Review assignments use Jane's confirmed list

**Result**: The Manager Confirmation sheet has the **final authority** - it's what gets used for review assignments.

### 2. Manager Confirmation is Required

**Scenario**: Alice completed peer selection, but Jane hasn't confirmed yet.

**What Happens**:
- `sendReviewAssignments()` checks Manager Confirmation sheet
- Finds Alice's status = "Pending"
- **Skips** Alice - no review assignments sent
- Alice must wait until Jane confirms

**Result**: Employees can't proceed to reviews until their manager confirms.

### 3. Reminder System

**Scenario**: Jane hasn't confirmed Alice's peers after 3 days.

**What Happens**:
- `sendManagerReminders()` runs daily
- Finds Alice in Manager Confirmation sheet with status = "Pending"
- Groups all pending employees by manager (Jane)
- Sends Jane a reminder email with list of employees needing confirmation

**Result**: Managers get automated reminders until all confirmations are complete.

---

## Example: Complete Workflow

### Day 1: Peer Selection
1. HR runs `sendPeerSelectionInvites()`
2. Alice, Bob, Charlie all select their 5 peers
3. **Peer Selection Sheet**: All marked "Completed"

### Day 2: Manager Confirmation Initiated
1. HR runs `sendManagerConfirmationEmails()`
2. **Manager Confirmation Sheet**: Created with 3 rows (Alice, Bob, Charlie), all "Pending"
3. Jane receives email with 3 hyperlinked names

### Day 2: Manager Confirms
1. Jane clicks "Alice Smith" → Opens form
2. Jane reviews Alice's selections
3. Jane confirms (keeps all 5) → Submits form
4. **Manager Confirmation Sheet**: Alice's row updated to "Completed", peers stored
5. Jane repeats for Bob and Charlie

### Day 3: Review Assignments
1. HR runs `sendReviewAssignments()`
2. System reads Manager Confirmation sheet
3. Finds all 3 employees with status = "Completed"
4. Gets confirmed peers from separate columns
5. Creates review assignments in Review Assignments sheet
6. Sends emails to Alice, Bob, Charlie with their review links

---

## Technical Details

### How Data is Retrieved

When creating review assignments, the system:

```javascript
// 1. Find employee in Manager Confirmation sheet
const mcRow = findRowInSheet(mcSheet, CONFIG.MC_COL_EMAIL, employee.email);

// 2. Get confirmed peers from separate columns
const confirmedPeers = getPeerReviewers(mcSheet, mcRow, CONFIG.MC_COL_PEER1_NAME);
// Returns: ['bob@company.com', 'charlie@company.com', ...]

// 3. Create review assignments for each peer
confirmedPeers.forEach(peerEmail => {
  createReviewAssignment(raSheet, employee.email, employee.name, 
                         peerEmail, getEmployeeName(peerEmail), 'Peer', today);
});
```

### How Manager Sees Employee's Original Selection

When building the manager confirmation email:

```javascript
// Get selected peers from Peer Selection sheet
const psRow = findRowInSheet(psSheet, CONFIG.PS_COL_EMAIL, emp.email);
const selectedPeers = getPeerReviewers(psSheet, psRow, CONFIG.PS_COL_PEER1_NAME);

// Convert to names for display
const peersList = selectedPeers.map(email => getEmployeeName(email)).join(', ');

// Include in email: "Alice Smith (Selected: Bob Jones, Charlie Brown, ...)"
```

This shows managers what their employees originally selected, but the **final decision** is stored in Manager Confirmation sheet.

---

## Summary

The Manager Confirmation system:

1. **Bridges** Phase 1 (Peer Selection) and Phase 3 (Review Assignments)
2. **Gives managers control** over who reviews their direct reports
3. **Stores final decisions** in separate columns for each peer reviewer
4. **Feeds into review assignments** - only confirmed peers get review assignments
5. **Tracks status** - system knows who's confirmed and who's pending
6. **Sends reminders** - automated follow-up for incomplete confirmations

The key insight: **Manager Confirmation sheet is the source of truth** for who will actually review each employee. The Peer Selection sheet is just the starting point - managers have the final say.

