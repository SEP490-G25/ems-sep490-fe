# EMS Student Portal - Comprehensive Screen Analysis

**Document Version:** 1.0
**Created:** 2025-10-21
**Purpose:** Define all screens needed for the STUDENT role in the EMS system
**Based on:** business-context.md, uiux-design.md, navigation-config.ts

---

## Executive Summary

### Student Role Overview

**Role Definition** (from business-context.md Section 2.1):
- **Scope:** Personal learning journey
- **Responsibilities:**
  - Attend scheduled sessions
  - Submit requests (absence notification, make-up session, class transfer)
  - Provide feedback on sessions/teachers
  - View personal schedule, grades, and attendance records

**Key Characteristics:**
- **VIEW-ONLY** for most data (own classes, grades, attendance)
- **SUBMIT** requests (absence, make-up, transfer)
- **PROVIDE** feedback on sessions and teachers
- **CANNOT** modify schedules, approve requests, or view other students' data
- **MOBILE-FIRST** design critical (students primarily use phones)

---

## Screen Categories & Priority

### High Priority (MVP Phase 1)
1. Dashboard - Central hub for student experience
2. My Classes - View enrolled classes and progress
3. Schedule - Upcoming sessions and calendar
4. Attendance - View attendance history
5. Grades - View scores and assessments
6. Request Submission - Submit absence/make-up/transfer requests

### Medium Priority (MVP Phase 2)
7. Request Status - Track request approval status
8. Feedback - Rate sessions and teachers
9. Class Details - Detailed view of individual class

### Low Priority (Post-MVP)
10. Profile - Personal information management
11. Notifications - System notifications center
12. Course Materials - Download study materials

---

## Detailed Screen Specifications

---

## 1. STUDENT DASHBOARD

### 1.1 Dashboard Overview

**Route:** `/student/dashboard` or `/dashboards/student`
**Vietnamese:** Trang chủ học viên
**API:** `GET /dashboards/student`

**Purpose:**
Central hub showing student's current learning status, upcoming sessions, recent grades, and pending actions.

**Key Features:**
- Current classes overview with progress bars
- Next 3-5 upcoming sessions
- Recent scores/assessments
- Pending requests status
- Low attendance alerts (if applicable)
- Quick action buttons

**User Actions:**
- View all current classes
- Navigate to upcoming session details
- Quick access to submit requests
- View recent grades
- Check pending request status

**Data Displayed:**

```yaml
Current Classes Section:
  - For each enrolled class:
    - class_code, class_name
    - teacher_name, teacher_avatar
    - Progress: completion_percent (e.g., "15/36 sessions completed")
    - Attendance: "Present: 14, Absent: 1, Late: 0, Rate: 93%"
    - Next session: date, time, topic
    - Quick actions: View Class, View Schedule

Upcoming Sessions (Next 3-5):
  - date, day_of_week, time
  - class_code, topic
  - teacher, resource (room/Zoom link)
  - is_makeup badge (if make-up session)
  - countdown: "Tomorrow at 2:00 PM" or "In 3 hours"

Recent Scores (Last 5):
  - assessment_name, class_code
  - score / max_score, percentage
  - graded_date
  - feedback (if any)

Alerts Section:
  - Low attendance warning: "You have missed 3 sessions in English A1. Your attendance rate is 75%."
  - Upcoming deadline: "Session starts in 1 hour"
  - Request status: "Your make-up request for Session 15 has been approved"

My Requests Summary:
  - pending_count: badge showing count
  - Link to "My Requests" page
```

**Related Business Rules:**
- Students only see their own data (never other students)
- Attendance alerts trigger if rate < 80% (configurable)
- Progress calculated as: completed_sessions / total_sessions

**UI/UX Considerations:**
- Mobile-first card layout (stack vertically on mobile, 2-column on tablet, 3-column on desktop)
- Large, tappable action buttons
- Clear visual hierarchy: current classes most prominent
- Color-coded attendance status (green: good, yellow: warning, red: critical)
- Countdown timers for upcoming sessions

**DONE**

---

## 2. MY CLASSES

### 2.1 Classes List

**Route:** `/student/classes`
**Vietnamese:** Lớp học của tôi
**API:** `GET /students/:id/enrollments`

**Purpose:**
Display all classes the student is currently enrolled in or has completed.

**Key Features:**
- Current/active classes prominently displayed
- Completed/transferred classes in separate section
- Progress tracking for each class
- Quick navigation to class details

**User Actions:**
- View class details
- View class schedule
- View class grades
- Submit class transfer request

**Data Displayed:**

```yaml
Active Classes:
  - class_code, class_name
  - course: code, level (e.g., "English A1")
  - teacher: name, avatar
  - schedule: "Mon/Wed/Fri 08:00-10:30"
  - modality: OFFLINE/ONLINE/HYBRID (with icon)
  - progress:
    - completion_percent: "15/36 sessions (42%)"
    - sessions_completed, sessions_remaining
  - attendance:
    - attendance_rate: "93%"
    - present_count, absent_count, late_count
  - next_session: date, time, topic
  - actions:
    - View Details
    - View Schedule
    - View Grades
    - Request Transfer

Completed Classes:
  - class_code, class_name
  - course
  - completed_date
  - final_attendance_rate
  - final_grade (if available)
  - actions: View Details, View Certificate

Transferred Classes:
  - class_code, class_name
  - transfer_date, transferred_to (new class)
  - reason
```

**Related Business Rules:**
- Student can have multiple active enrollments (different courses)
- Transfer only allowed between same course_id classes
- Completion status: `enrolled` (active) → `completed` or `transferred`

**UI/UX Considerations:**
- Card-based layout for each class
- Clear distinction between active and completed classes
- Visual progress bars
- Modality icons (classroom for OFFLINE, video for ONLINE, both for HYBRID)
- Mobile: stack cards vertically, desktop: grid layout

**DONE**

---

### 2.2 Class Detail Page

**Route:** `/student/classes/:id`
**Vietnamese:** Chi tiết lớp học
**API:** `GET /classes/:id` (filtered for student view)

**Purpose:**
Detailed view of a specific class including schedule, attendance, grades, and teacher info.

**Key Features:**
- Class information overview
- Session list with attendance status
- Assessment list with grades
- Teacher information
- Materials download (if available)

**User Actions:**
- View all sessions
- View all assessments
- Download materials
- Submit feedback
- Request transfer

**Data Displayed:**

```yaml
Class Overview:
  - class_code, class_name
  - course: name, level, description
  - modality, schedule_days, time_slots
  - start_date, planned_end_date
  - max_capacity (for context)
  - teacher: name, email, photo

Progress Card:
  - completion_percent: progress bar
  - sessions: completed/total
  - attendance_rate: with color coding
  - current_phase: name, description

Sessions Tab:
  - List all sessions with:
    - date, time, sequence_no
    - topic, skill_set
    - attendance_status: present/absent/late/excused/planned
    - is_makeup: badge if make-up session
    - teacher_note: what was covered (if session done)
  - Filter: All/Completed/Upcoming/Missed

Grades Tab:
  - List all assessments:
    - assessment_name, kind (quiz/midterm/final)
    - max_score, weight
    - my_score, percentage
    - feedback
    - graded_date
  - Overall grade (if calculated)

Materials Tab:
  - List course materials:
    - title, type (slide/worksheet/video)
    - phase/session (if specific)
    - download link
    - uploaded_date

Teacher Info:
  - teacher_name, photo
  - email (for contact)
  - office_hours (if applicable)
```

**Related Business Rules:**
- Student only sees own attendance/grades (not other students)
- Materials visibility controlled by teacher/admin
- Session details show actual content covered (from teacher report)

**UI/UX Considerations:**
- Tabbed interface for different sections
- Prominent progress visualization
- Color-coded attendance status
- Downloadable materials with file type icons
- Mobile: full-width tabs, desktop: side navigation

**DONE**

---

## 3. SCHEDULE

### 3.1 My Schedule (Calendar View)

**Route:** `/student/schedule`
**Vietnamese:** Lịch học của tôi
**API:** `GET /students/:id/schedule`

**Purpose:**
Visual calendar showing all upcoming and past sessions across all enrolled classes.

**Key Features:**
- Calendar view (week/month)
- List view alternative
- Filter by class
- Attendance status color coding
- Quick access to session details

**User Actions:**
- Switch calendar view (week/month/list)
- Filter by class
- Click session for details
- Submit absence request for upcoming session
- Request make-up for missed session

**Data Displayed:**

```yaml
Calendar View:
  - For each session:
    - time, duration
    - class_code, topic
    - teacher_name
    - resource: room/Zoom
    - attendance_status: color-coded
    - is_makeup: badge

List View (Alternative):
  - Grouped by date
  - Same fields as calendar
  - Filter options:
    - date_from, date_to
    - class_id
    - attendance_status

Summary Panel:
  - This week: total_sessions, by_status breakdown
  - This month: total_sessions, attendance_rate
```

**Related Business Rules:**
- Show sessions from all enrolled classes
- Include make-up sessions (marked with is_makeup=true)
- Past sessions: show actual attendance status
- Future sessions: show "planned"

**UI/UX Considerations:**
- Mobile: default to list view (easier navigation)
- Desktop: calendar view with day/week/month toggle
- Color coding: green (present), red (absent), yellow (late), gray (excused), blue (planned)
- Tappable session blocks open detail modal
- Swipe gestures for date navigation on mobile

**Priority:** **HIGH (MVP Phase 1)**

---

### 3.2 Upcoming Sessions

**Route:** `/student/schedule/upcoming`
**Vietnamese:** Buổi học sắp tới
**API:** `GET /students/:id/schedule?date_from=today&limit=10`

**Purpose:**
Quick view of next sessions with countdown and quick actions.

**Key Features:**
- Next 5-10 sessions
- Countdown timer for next session
- Quick access to Zoom link (for online sessions)
- Quick actions (submit absence, view materials)

**User Actions:**
- View session details
- Join online session (Zoom link)
- Submit absence request
- View materials

**Data Displayed:**

```yaml
For each upcoming session:
  - countdown: "Tomorrow at 2:00 PM" or "In 3 hours"
  - date, day_of_week, time
  - class_code, class_name, topic
  - teacher_name, teacher_photo
  - resource:
    - If OFFLINE: room_name, location
    - If ONLINE: Zoom link (button "Join Session")
  - materials: link to download (if available)
  - actions:
    - Submit Absence
    - View Materials
    - View Class Details
```

**Related Business Rules:**
- Only show planned sessions (date >= today)
- Zoom link only visible 30 min before session start (configurable)
- Countdown shows urgency (red if < 1 hour)

**UI/UX Considerations:**
- Card-based layout, chronologically ordered
- Large "Join Session" button for online classes
- Visual countdown timer
- Mobile: large tap targets for buttons
- Auto-refresh countdown every minute

**Priority:** **HIGH (MVP Phase 1)**

---

## 4. ATTENDANCE

### 4.1 Attendance History

**Route:** `/student/attendance`
**Vietnamese:** Chuyên cần
**API:** `GET /students/:id/attendance`

**Purpose:**
View complete attendance history across all classes with statistics.

**Key Features:**
- Overall attendance statistics
- Per-class breakdown
- Detailed session list with status
- Attendance trend chart

**User Actions:**
- Filter by class
- Filter by date range
- View session details
- Submit make-up request for absences

**Data Displayed:**

```yaml
Overall Statistics:
  - total_sessions_attended
  - overall_attendance_rate
  - present_count, absent_count, late_count, excused_count
  - trend: "↑ Improving" or "↓ Declining"

By Class Breakdown:
  - For each class:
    - class_code, class_name
    - attendance_rate
    - present/absent/late/excused counts
    - actions: View Details, Request Make-up

Attendance Chart:
  - Line/bar chart showing attendance over time
  - X-axis: weeks/months
  - Y-axis: attendance rate

Session History Table:
  - Columns:
    - date, class_code, topic
    - attendance_status: badge with color
    - is_makeup: badge
    - note: reason (if absent/late/excused)
  - Sortable by date (default: newest first)
  - Filterable by class, status, date range

Alerts:
  - If attendance < 80%: "Warning: Your attendance is below 80%. Please improve to avoid academic issues."
  - If consecutive absences: "You have missed 3 consecutive sessions in English A1."
```

**Related Business Rules:**
- Attendance data locked after T hours (student cannot change)
- Excused absences (from approved absence requests) count separately
- Make-up sessions show with is_makeup=true badge

**UI/UX Considerations:**
- Visual progress bar for overall attendance rate
- Color-coded status badges
- Chart for visual trend analysis
- Mobile: stack cards vertically, desktop: side-by-side statistics
- Clear distinction between absent (unexcused) and excused

**Priority:** **HIGH (MVP Phase 1)**

---

## 5. GRADES

### 5.1 All Grades Overview

**Route:** `/student/grades`
**Vietnamese:** Điểm số
**API:** `GET /students/:id/scores`

**Purpose:**
View all grades and assessments across all classes.

**Key Features:**
- Overall grade summary
- Per-class grade breakdown
- Assessment details with feedback
- Grade trend analysis

**User Actions:**
- Filter by class
- Filter by assessment type
- View assessment details
- View teacher feedback

**Data Displayed:**

```yaml
Overall Summary:
  - total_assessments
  - average_score_percent
  - highest_score, lowest_score
  - recent_grade: "Last graded: Midterm Exam - 85%"

By Class Breakdown:
  - For each class:
    - class_code, class_name
    - average_score: calculated from all assessments
    - assessments_count
    - grade_distribution: A/B/C/D/F (if grading scale used)
    - actions: View Assessments

Assessment List:
  - Grouped by class
  - For each assessment:
    - assessment_name, kind (quiz/midterm/final/project)
    - date_graded
    - score / max_score
    - percentage: with color coding
    - weight: contribution to final grade
    - teacher_feedback: text
    - graded_by: teacher_name

Grade Chart:
  - Line chart showing score trend over time
  - X-axis: assessments chronologically
  - Y-axis: percentage score
```

**Related Business Rules:**
- Student only sees own scores (never other students)
- Locked assessments: scores cannot be changed after lock
- Final grade calculated using weighted average (if configured)

**UI/UX Considerations:**
- Color-coded scores: green (≥80%), yellow (60-79%), red (<60%)
- Visual progress bars for each assessment
- Teacher feedback displayed prominently
- Mobile: card-based layout, desktop: table with sortable columns
- Chart for visual grade trend

**Priority:** **HIGH (MVP Phase 1)**

---

### 5.2 Assessment Details

**Route:** `/student/grades/assessments/:id`
**Vietnamese:** Chi tiết bài kiểm tra
**API:** `GET /assessments/:id/scores?student_id=:student_id`

**Purpose:**
Detailed view of a specific assessment including score, feedback, and context.

**Key Features:**
- Assessment information
- Student's score and feedback
- Class average (optional - if policy allows)
- Related materials

**User Actions:**
- View teacher feedback
- Download assessment materials (if available)
- Contact teacher (email link)

**Data Displayed:**

```yaml
Assessment Info:
  - assessment_name, kind
  - class_code, class_name
  - max_score, weight
  - date_graded
  - related_session: topic (if session-specific)

My Score:
  - score / max_score
  - percentage: with color coding
  - grade: letter grade (if applicable)
  - rank: "Top 20%" (if class ranking enabled)

Teacher Feedback:
  - graded_by: teacher_name, photo
  - feedback: detailed text
  - graded_date

Class Statistics (optional):
  - class_average: percentage
  - highest_score, lowest_score
  - score_distribution: chart

Materials:
  - Assessment file (if available for download)
  - Related session materials
```

**Related Business Rules:**
- Class statistics visibility controlled by system settings
- Some systems hide other students' performance for privacy
- Feedback is optional (teacher may not provide for all assessments)

**UI/UX Considerations:**
- Large, clear display of student's score
- Teacher feedback in prominent card
- Optional class statistics (can be hidden if policy dictates)
- Mobile: full-width content, desktop: two-column layout

**Priority:** **MEDIUM (MVP Phase 2)**

---

## 6. REQUESTS

### 6.1 Submit Request - Absence

**Route:** `/student/requests/absence` or modal from dashboard
**Vietnamese:** Báo nghỉ có phép
**API:** `POST /students/:id/requests`

**Purpose:**
Submit an absence notification for an upcoming session.

**Key Features:**
- Select upcoming session
- Provide reason
- See approval status after submission

**User Actions:**
- Select session to miss
- Enter reason
- Submit request

**Data Displayed:**

```yaml
Form Fields:
  - Select[target_session_id]: "Buổi học sẽ nghỉ"
    options: GET /students/:id/sessions?status=planned&date_from=today
    display: date, time, class_code, topic
  - Textarea[reason]: "Lý do nghỉ" (required)
  - DatePicker: auto-filled from selected session
  - Note: "Vui lòng gửi trước {X} ngày" (based on system config)

Validation:
  - Must select future session (date >= today)
  - Reason required (min 10 characters)
  - Warning if within lead time: "This is less than 3 days notice. Approval may be delayed."
```

**Related Business Rules:**
- Request lead time: X days before session (configurable, default 3 days)
- Emergency requests (same-day) allowed but flagged for stricter approval
- Upon approval: student_session.attendance_status → `excused`

**UI/UX Considerations:**
- Simple, single-step form
- Clear session selection with date/time preview
- Character counter for reason (min 10, max 500)
- Mobile: full-screen form, desktop: modal
- Confirmation message after submission

**Priority:** **HIGH (MVP Phase 1)**

---

### 6.2 Submit Request - Make-up

**Route:** `/student/requests/makeup`
**Vietnamese:** Yêu cầu học bù
**API:** `POST /students/:id/requests`, `GET /student-requests/makeup/available-sessions`

**Purpose:**
Request to attend a make-up session for a missed class.

**Key Features:**
- Two-step process: select missed session, then select make-up session
- System finds available make-up sessions with same content
- Capacity check before submission

**User Actions:**
- Select missed session
- View available make-up sessions
- Select preferred make-up session
- Submit request

**Data Displayed:**

```yaml
Step 1: Select Missed Session
  - Select[target_session_id]: "Buổi học đã nghỉ"
    options: GET /students/:id/sessions?attendance_status=absent
    display: date, topic, class_code
    note: "Only sessions marked 'absent' can be made up"

Step 2: Select Make-up Session
  - on_select_session:
    → GET /student-requests/makeup/available-sessions?student_id=X&session_id=Y
    → API returns: sessions with same course_session_id, capacity available

  - Display available make-up sessions (cards/list):
    - class_code, teacher_name
    - date, time
    - branch, modality (OFFLINE/ONLINE)
    - available_slots: "3/25 slots available"
    - capacity_warning: if almost full (< 3 slots)
    - Select button

  - If no sessions available:
    - Message: "No make-up sessions available for this topic. Please contact Academic Staff."

Step 3: Confirmation
  - Original session: date, topic, class
  - Selected make-up session: date, time, class, teacher
  - Textarea[note]: Optional additional information
  - Submit button
```

**Related Business Rules (from business-context.md 3.5.2):**
- Make-up sessions must have same `course_session_id` (same topic/content)
- Capacity check: target session must have available slots
- Upon approval:
  - Original student_session: attendance_status → `excused`
  - New student_session created: (student_id, makeup_session_id, is_makeup=TRUE, attendance_status=`planned`)

**UI/UX Considerations:**
- Multi-step wizard with progress indicator
- Clear visual distinction between missed and make-up sessions
- Capacity warnings in orange/red if low availability
- Mobile: full-screen wizard, desktop: centered modal
- Preview panel showing session details before submission

**Priority:** **HIGH (MVP Phase 1)**

---

### 6.3 Submit Request - Transfer Class

**Route:** `/student/requests/transfer`
**Vietnamese:** Chuyển lớp
**API:** `POST /students/:id/requests`, `POST /student-requests/:id/validate-transfer`

**Purpose:**
Request to transfer from current class to another class (same course).

**Key Features:**
- Multi-step wizard
- Validation for compatible classes (same course_id)
- Content gap analysis
- Capacity check

**User Actions:**
- View current class
- Select target class
- Choose effective date
- View validation results
- Submit request

**Data Displayed:**

```yaml
Step 1: Current Class (Read-only)
  - Display current class details:
    - class_code, class_name
    - schedule, modality
    - progress: sessions completed, remaining
    - teacher

Step 2: Select Target Class
  - Filter compatible classes:
    → GET /classes?course_id={same_course}&status=scheduled|ongoing&branch_id={optional}

  - Display compatible classes (cards):
    - class_code, class_name
    - schedule: "Tue/Thu/Sat 18:00-20:30"
    - modality, branch
    - teacher_name
    - current_enrollment / max_capacity
    - available_slots: color-coded
    - Select button

  - If no compatible classes:
    - Message: "No other classes available for this course. Contact Academic Staff."

Step 3: Validation & Effective Date
  - DatePicker[effective_date]: "Ngày bắt đầu học lớp mới"
    default: next Monday
    min: today

  - Button[Validate]: POST /student-requests/validate-transfer

  - Validation Results:
    - ✅ Capacity: "Available" (green) or "Full" (red)
    - ⚠️ Content Gap Analysis:
      - If gaps detected:
        - List sessions missing: "Session 15, 17 sẽ không có trong lớp mới"
        - Recommendation: "Bạn cần tự học hoặc chọn ngày chuyển khác"
      - If no gaps: "No content gaps - smooth transition"
    - ✅ Schedule Conflict: "No conflicts" or list conflicts

  - Textarea[reason]: Why transferring (required)
    examples: "Schedule conflict with work", "Prefer online class"

Step 4: Confirmation & Submit
  - Summary:
    - From: current class details
    - To: target class details
    - Effective date
    - Validation summary
  - Submit button (enabled only if validation passed)
```

**Related Business Rules (from business-context.md 3.5.3):**
- Transfer only allowed if both classes have **same course_id**
- System maps remaining sessions by `course_session_id`
- Content gap: if target class already finished some sessions
- Original class: enrollment status → `transferred` (preserves audit trail)
- Upon approval:
  - Original class future sessions: marked `excused`
  - New class: enrollment created, student_sessions generated from effective_date

**UI/UX Considerations:**
- Multi-step wizard (4 steps) with clear progress bar
- Validation step REQUIRED before submit (cannot skip)
- Content gap warnings in orange with recommendations
- Capacity warnings in red if target class nearly full
- Mobile: full-screen wizard, desktop: large centered modal
- Clear before/after comparison

**Priority:** **HIGH (MVP Phase 1)** - Complex but critical feature

---

### 6.4 My Requests Status

**Route:** `/student/requests/my-requests` or `/student/requests`
**Vietnamese:** Yêu cầu của tôi
**API:** `GET /students/:id/requests`

**Purpose:**
View all submitted requests and their approval status.

**Key Features:**
- List all requests (absence, make-up, transfer)
- Status tracking
- Approval/rejection reasons
- Cancel pending requests

**User Actions:**
- View request details
- Cancel pending request
- Resubmit rejected request

**Data Displayed:**

```yaml
Request List:
  - For each request (card):
    - request_type: badge (absence/makeup/transfer)
    - status: badge (pending/approved/rejected)
    - submitted_date
    - summary:
      - Absence: "Absence request for Session 15 - Listening Practice on Feb 20"
      - Make-up: "Make-up request for Session 10 → Class B Session 10 on Feb 25"
      - Transfer: "Transfer from Class A1-Mon to Class A1-Tue starting Mar 1"

    - If pending:
      - Message: "Đang chờ Academic Staff xử lý"
      - Button[Cancel]: Cancel this request

    - If approved:
      - Message: "Approved by {staff_name} on {date}"
      - decision_note: Additional info from approver

    - If rejected:
      - Message: "Rejected by {staff_name} on {date}"
      - rejection_reason: Detailed explanation
      - Button[Resubmit]: Create new request

Filters:
  - Select[request_type]: all/absence/makeup/transfer
  - Select[status]: all/pending/approved/rejected
  - DateRange: submitted date

Statistics:
  - Total requests: count
  - Pending: count
  - Approved: count
  - Rejected: count
```

**Related Business Rules:**
- Student can cancel request only if status=pending
- Cannot modify request after submission (must cancel and create new)
- Rejection reasons help student understand and resubmit correctly

**UI/UX Considerations:**
- Card-based layout for each request
- Color-coded status badges (yellow: pending, green: approved, red: rejected)
- Clear visual timeline showing submission → decision
- Mobile: vertical stack, desktop: grid layout
- Filter panel for easy navigation

**Priority:** **HIGH (MVP Phase 1)**

---

## 7. FEEDBACK

### 7.1 Rate Sessions

**Route:** `/student/feedback/sessions`
**Vietnamese:** Đánh giá buổi học
**API:** `POST /students/:id/feedback`

**Purpose:**
Provide feedback and ratings for completed sessions.

**Key Features:**
- List sessions awaiting feedback
- Star rating system
- Comment box
- Submit feedback

**User Actions:**
- Rate session (1-5 stars)
- Write comment
- Submit feedback

**Data Displayed:**

```yaml
Sessions Awaiting Feedback:
  - List sessions where:
    - status = done
    - date < 7 days ago (feedback window)
    - no feedback submitted yet

  - For each session (card):
    - date, class_code, topic
    - teacher_name, teacher_photo
    - "How was this session?" prompt

    - Star Rating: 1-5 stars (tappable)
    - Comment: textarea (optional)
      placeholder: "What went well? What could be improved?"
      max: 500 characters

    - Button[Submit Feedback]

My Submitted Feedback (history):
  - List past feedback:
    - date, class_code, topic
    - my_rating: stars
    - my_comment
    - submitted_date
```

**Related Business Rules:**
- Feedback window: 7 days after session ends (configurable)
- Feedback is optional but encouraged
- Anonymous to teacher (or visible with name - configurable)
- Used for QA monitoring and teacher performance evaluation

**UI/UX Considerations:**
- Large, tappable star icons for mobile
- Clear visual feedback when rating selected
- Character counter for comment
- Mobile: full-width cards, desktop: grid layout
- Encouragement message: "Your feedback helps improve teaching quality"

**Priority:** **MEDIUM (MVP Phase 2)**

---

### 7.2 My Feedback History

**Route:** `/student/feedback/history`
**Vietnamese:** Phản hồi của tôi
**API:** `GET /students/:id/feedback`

**Purpose:**
View all submitted feedback.

**Key Features:**
- List all submitted feedback
- Filter by class
- Edit recent feedback (if within edit window)

**User Actions:**
- View feedback details
- Edit feedback (if < 24 hours old)

**Data Displayed:**

```yaml
Feedback List:
  - For each feedback:
    - date, class_code, topic, teacher_name
    - my_rating: star display
    - my_comment
    - submitted_date
    - If < 24 hours old: Button[Edit]

Filters:
  - Select[class_id]
  - DateRange
```

**Related Business Rules:**
- Edit window: 24 hours after submission (configurable)
- After edit window: feedback locked (data integrity for reports)

**UI/UX Considerations:**
- Read-only display with edit button if eligible
- Clear indication of edit window remaining
- Mobile: card layout, desktop: table

**Priority:** **LOW (Post-MVP)**

---

## 8. PROFILE & SETTINGS

### 8.1 Student Profile

**Route:** `/student/profile`
**Vietnamese:** Hồ sơ cá nhân
**API:** `GET /students/:id`, `PUT /students/:id`

**Purpose:**
View and update personal information.

**Key Features:**
- View personal details
- Update contact information
- Change password
- Manage notification preferences

**User Actions:**
- Edit email, phone
- Upload profile photo
- Change password
- Toggle notifications

**Data Displayed:**

```yaml
Personal Information:
  - student_code (read-only)
  - full_name
  - email (editable)
  - phone (editable)
  - branch (assigned - read-only)
  - profile_photo: upload/change

Account Settings:
  - Change password button
  - Notification preferences:
    - Email notifications: toggle
    - SMS notifications: toggle
    - Push notifications: toggle
  - Language preference (if i18n supported)

Learning Summary (read-only):
  - Total classes: count
  - Total sessions attended: count
  - Overall attendance rate
  - Member since: enrollment_date
```

**Related Business Rules:**
- Student cannot change student_code, branch assignment
- Email/phone changes may require verification
- Password change requires old password confirmation

**UI/UX Considerations:**
- Two-column layout: info on left, photo on right (desktop)
- Mobile: single column, photo at top
- Inline editing for contact fields
- Confirmation modal for password change

**Priority:** **LOW (Post-MVP)**

---

## 9. ADDITIONAL FEATURES

### 9.1 Notifications Center

**Route:** `/student/notifications`
**Vietnamese:** Thông báo
**API:** `GET /notifications?user_id=:student_id`

**Purpose:**
Central hub for all system notifications.

**Key Features:**
- Unread/read notifications
- Filter by type
- Mark as read
- Delete notifications

**User Actions:**
- View notification details
- Mark as read/unread
- Mark all as read
- Delete notification

**Data Displayed:**

```yaml
Notification List:
  - For each notification:
    - type: icon (class/session/request/grade/system)
    - title, message
    - created_date
    - read_status: unread (bold), read (normal)
    - priority: high/normal (color coding)
    - action_link: navigate to related page

Filters:
  - Unread only toggle
  - Select[type]: all/class/session/request/grade

Summary:
  - total_unread count in header badge
```

**Notification Types:**
- Session reminder: "Class starts in 1 hour"
- Request status: "Your make-up request has been approved"
- Grade posted: "New grade available for Midterm Exam"
- Schedule change: "Session 20 has been rescheduled to Feb 25"
- Attendance alert: "Your attendance is below 80%"
- Class announcement: "New materials uploaded for English A1"

**UI/UX Considerations:**
- Unread notifications highlighted/bolded
- Color-coded by priority (red: urgent, blue: info)
- Swipe to delete on mobile
- Desktop: side panel or full page

**Priority:** **MEDIUM (MVP Phase 2)**

---

### 9.2 Course Materials

**Route:** `/student/materials` or within class detail
**Vietnamese:** Tài liệu học tập
**API:** `GET /classes/:id/materials` or `GET /students/:id/materials`

**Purpose:**
Access and download course materials.

**Key Features:**
- Browse materials by class
- Download files
- Filter by type
- Search materials

**User Actions:**
- Download material
- Preview material (if supported)
- Search by keyword

**Data Displayed:**

```yaml
Materials List:
  - Grouped by class
  - For each material:
    - title, type (slide/worksheet/video/audio)
    - file_type: icon (PDF/PPT/MP4 etc.)
    - file_size
    - phase/session: context
    - uploaded_date
    - download button

Filters:
  - Select[class_id]
  - Select[type]: all/slide/worksheet/video/audio
  - Search: by title/keyword
```

**Related Business Rules:**
- Materials visibility controlled by teacher/course settings
- Some materials may be session-specific (only visible after attending)
- File size limits for mobile download warning

**UI/UX Considerations:**
- File type icons for quick recognition
- Download progress indicator
- Warning for large files on mobile data
- Preview option for PDFs/images
- Mobile: list view, desktop: grid with thumbnails

**Priority:** **LOW (Post-MVP)**

---

## Navigation Structure

### Sidebar Navigation for STUDENT Role

Based on existing `navigation-config.ts`:

```yaml
Dashboard:
  - url: /student/dashboard
  - icon: LayoutDashboard

My Classes:
  - url: /student/classes
  - icon: School

Schedule:
  - url: /student/schedule
  - icon: Calendar
  - items:
    - My Schedule: /student/schedule
    - Upcoming Sessions: /student/schedule/upcoming

Attendance:
  - url: /student/attendance
  - icon: CheckSquare

Grades:
  - url: /student/grades
  - icon: Award
  - items:
    - All Grades: /student/grades
    - Assessments: /student/grades/assessments

Requests:
  - url: /student/requests
  - icon: ClipboardList
  - items:
    - Submit Absence: /student/requests/absence
    - Request Make-up: /student/requests/makeup
    - Transfer Class: /student/requests/transfer
    - My Requests: /student/requests/my-requests (badge: pending count)

Feedback:
  - url: /student/feedback
  - icon: MessageSquare
  - items:
    - Rate Sessions: /student/feedback/sessions
    - My Feedback: /student/feedback/history
```

**Mobile Navigation:**
- Bottom tab bar (5 main items):
  1. Dashboard
  2. Classes
  3. Schedule
  4. Grades
  5. More (overflow menu with Attendance, Requests, Feedback)

---

## Screen Priority Summary

### MVP Phase 1 (High Priority)
1. **Dashboard** - Central hub
2. **My Classes** - View enrolled classes
3. **Schedule** - Calendar and upcoming sessions
4. **Attendance** - View attendance history
5. **Grades** - View all grades
6. **Submit Requests** - Absence, Make-up, Transfer forms
7. **My Requests Status** - Track request approval

### MVP Phase 2 (Medium Priority)
8. **Class Detail** - Detailed class view
9. **Assessment Detail** - Detailed grade view
10. **Rate Sessions** - Submit feedback
11. **Notifications** - Notification center

### Post-MVP (Low Priority)
12. **Profile** - Personal information
13. **Feedback History** - View submitted feedback
14. **Course Materials** - Download materials

---

## Key Design Principles for Student Portal

### 1. Simplicity
- Students have limited technical expertise
- Minimize clicks to common actions
- Clear, straightforward language (avoid jargon)

### 2. Mobile-First
- Students primarily use phones
- Large tap targets (min 44x44px)
- Thumb-friendly navigation (bottom tabs)
- Optimize for 375px width

### 3. Visual Clarity
- Color-coded status (attendance, grades, requests)
- Progress bars for completion tracking
- Icons for quick recognition
- Clear hierarchy: most important info first

### 4. Proactive Guidance
- Empty states with helpful messages
- Tooltips for complex features (transfer request)
- Validation messages before submission
- Countdown timers for urgency

### 5. Transparency
- Clear request status at all times
- Show why request rejected (helpful feedback)
- Display approval timeline
- Real-time updates (notification when approved)

---

## Missing API Endpoints

**Required for Student Portal:**

```yaml
Dashboards:
  - GET /dashboards/student

Schedule:
  - GET /students/:id/schedule?date_from=X&date_to=Y
  - GET /students/:id/sessions?status=planned&limit=10

Attendance:
  - GET /students/:id/attendance?class_id=X&date_from=Y

Grades:
  - GET /students/:id/scores?class_id=X
  - GET /students/:id/scores/:assessment_id

Requests:
  - GET /students/:id/requests
  - POST /students/:id/requests
  - GET /student-requests/makeup/available-sessions?student_id=X&session_id=Y
  - POST /student-requests/:id/validate-transfer
  - DELETE /students/:id/requests/:request_id (cancel)

Feedback:
  - GET /students/:id/feedback
  - POST /students/:id/feedback
  - PUT /students/:id/feedback/:id (edit within 24h)

Materials:
  - GET /students/:id/materials?class_id=X

Notifications:
  - GET /notifications?user_id=:student_id
  - PUT /notifications/:id/read
  - POST /notifications/mark-all-read
```

---

## Business Rules Cross-Reference

**From business-context.md:**

### Student Role (Section 2.1)
- Attend scheduled sessions ✅ (Schedule screens)
- Submit requests (absence/make-up/transfer) ✅ (Request screens)
- Provide feedback ✅ (Feedback screens)
- View schedule, grades, attendance ✅ (All respective screens)

### Absence Request (Section 3.5.1)
- Student submits with target_session_id, reason ✅
- Academic Staff approves ✅
- attendance_status → excused ✅

### Make-up Request (Section 3.5.2)
- Student selects missed session ✅
- System finds same course_session_id sessions ✅
- Capacity check ✅
- Creates new student_session with is_makeup=TRUE ✅

### Transfer Request (Section 3.5.3)
- Only same course_id classes ✅
- Content mapping validation ✅
- Capacity check ✅
- Content gap detection ✅
- Effective date selection ✅

### Attendance Lock (Section 4.7)
- Student sees locked status (read-only) ✅
- Cannot modify after lock ✅

---

## Implementation Recommendations

### Phase 1: Core Student Experience (Weeks 1-4)
1. Dashboard with current classes + upcoming sessions
2. Class list and basic class detail
3. Schedule (calendar + list views)
4. Attendance history
5. Grades overview

### Phase 2: Request Management (Weeks 5-6)
6. Absence request form
7. Make-up request flow (with available session search)
8. Transfer request flow (with validation)
9. My Requests status page

### Phase 3: Engagement Features (Weeks 7-8)
10. Session feedback submission
11. Notifications center
12. Profile management

### Phase 4: Enhancement (Post-MVP)
13. Course materials download
14. Feedback history
15. Advanced filtering/search

---

## Testing Checklist

### Functional Testing
- [ ] Student can view only own data (not other students)
- [ ] Dashboard shows accurate data from all classes
- [ ] Schedule displays all enrolled classes' sessions
- [ ] Attendance history matches actual records
- [ ] Grades display with correct calculations
- [ ] Absence request creates pending request
- [ ] Make-up request shows only same-topic sessions
- [ ] Transfer request validates course_id match
- [ ] Transfer request shows content gaps
- [ ] Request status updates in real-time
- [ ] Feedback submission creates record
- [ ] Mobile navigation works on small screens

### UX Testing
- [ ] Mobile tap targets are large enough (44x44px)
- [ ] Forms are easy to complete on mobile
- [ ] Color coding is consistent across screens
- [ ] Progress bars are accurate
- [ ] Empty states provide helpful guidance
- [ ] Error messages are clear and actionable
- [ ] Confirmation messages appear after actions
- [ ] Loading states prevent confusion

### Business Rules Testing
- [ ] Only future sessions available for absence requests
- [ ] Make-up sessions match course_session_id
- [ ] Transfer only allows same course_id classes
- [ ] Content gap detection works correctly
- [ ] Attendance data is read-only after lock
- [ ] Request lead time validation works
- [ ] Capacity warnings show correctly

---

## Conclusion

This comprehensive screen analysis provides:

1. **14 distinct screens** organized by priority
2. **Clear navigation structure** optimized for mobile
3. **Detailed specifications** for each screen (purpose, features, data, actions, business rules, UI/UX)
4. **Implementation roadmap** with 4 phases
5. **Missing API endpoints** required for development
6. **Testing checklist** for quality assurance

**Next Steps:**
1. Review with product owner for approval
2. Create wireframes/mockups for Phase 1 screens
3. Coordinate with backend team for missing APIs
4. Begin implementation with Dashboard as starting point
5. Conduct user testing with actual students for feedback

**Key Success Factors:**
- Mobile-first design is non-negotiable
- Simple, clear UI (students are not tech experts)
- Real-time request status updates
- Clear visual feedback for all actions
- Proactive guidance and helpful error messages
