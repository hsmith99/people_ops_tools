# Multi-Sheet Architecture - Sheet Structure

## Sheet 1: "Employees" (Master Data)

**Purpose**: Source of truth for employee information

**Columns**:
- A: Employee Email
- B: Employee Name
- C: Manager Email
- D: Manager Name
- E: Is Manager (TRUE/FALSE)
- F: Department (optional)
- G: Status (Active/Inactive)

**Access**: Read-only for most users; only HR can edit

---

## Sheet 2: "Peer Selection" (Phase 1)

**Purpose**: Track peer reviewer selection phase

**Columns**:
- A: Employee Email (reference to Employees sheet)
- B: Employee Name
- C: Selection Status (Not Started/Pending/Completed/Invalid)
- D: Peer Reviewer 1 Name
- E: Peer Reviewer 1 Email
- F: Peer Reviewer 2 Name
- G: Peer Reviewer 2 Email
- H: Peer Reviewer 3 Name
- I: Peer Reviewer 3 Email
- J: Peer Reviewer 4 Name
- K: Peer Reviewer 4 Email
- L: Peer Reviewer 5 Name
- M: Peer Reviewer 5 Email
- N: Date Selected
- O: Reminder Count
- P: Last Reminder Sent

**Access**: System writes; HR can view

---

## Sheet 3: "Manager Confirmation" (Phase 2)

**Purpose**: Track manager confirmation phase

**Columns**:
- A: Employee Email (reference)
- B: Employee Name
- C: Manager Email
- D: Manager Name
- E: Confirmation Status (Pending/Completed)
- F: Confirmed Peer Reviewer 1 Name
- G: Confirmed Peer Reviewer 1 Email
- H: Confirmed Peer Reviewer 2 Name
- I: Confirmed Peer Reviewer 2 Email
- J: Confirmed Peer Reviewer 3 Name
- K: Confirmed Peer Reviewer 3 Email
- L: Confirmed Peer Reviewer 4 Name
- M: Confirmed Peer Reviewer 4 Email
- N: Confirmed Peer Reviewer 5 Name
- O: Confirmed Peer Reviewer 5 Email
- P: Date Confirmed
- Q: Manager Reminder Count
- R: Last Manager Reminder

**Access**: System writes; managers can view their direct reports

---

## Sheet 4: "Review Assignments" (Phase 3)

**Purpose**: Track all review assignments and completions

**Columns**:
- A: Reviewer Email
- B: Reviewer Name
- C: Reviewee Email
- D: Reviewee Name
- E: Review Type (Self/Manager/Peer/Direct Report)
- F: Assignment Status (Assigned/In Progress/Completed)
- G: Date Assigned
- H: Date Completed
- I: Form Response ID (link to actual review)

**Access**: System writes; employees see only their assignments

**Note**: One row per review assignment. For 100 employees:
- 100 self reviews
- ~80 manager reviews (assuming some don't have managers)
- ~500 peer reviews (100 employees × 5 peers)
- ~50 direct report reviews (assuming 10 managers)
- Total: ~730 rows

---

## Sheet 5: "Review Responses" (Optional)

**Purpose**: Store or link to actual review form responses

**Columns**:
- A: Response ID
- B: Reviewer Email
- C: Reviewee Email
- D: Review Type
- E: Submission Date
- F: Response Data (JSON or link to Forms response sheet)

**Access**: Restricted to HR and senior management

---

## Sheet 6: "Dashboard" (Summary/Reporting)

**Purpose**: Real-time status overview

**Columns**:
- A: Employee Email
- B: Employee Name
- C: Manager Name
- D: Phase 1 Status (from Peer Selection sheet)
- E: Phase 2 Status (from Manager Confirmation sheet)
- F: Phase 3 Self Review Status
- G: Phase 3 Manager Review Status
- H: Phase 3 Peer Reviews Status
- I: Phase 3 Direct Reports Review Status
- J: Overall Completion %
- K: Days Since Start
- L: Blockers/Issues

**Access**: Read-only for managers/HR

**Formulas** (examples):
- Phase 1 Completion: `=COUNTIF('Peer Selection'!C:C, "Completed") / COUNT('Peer Selection'!C:C)`
- Phase 2 Pending: `=COUNTIF('Manager Confirmation'!E:E, "Pending")`
- Overall Completion: Calculated from Review Assignments sheet

