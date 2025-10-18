UI/UX Design Specification - Hệ Thống EMS
Auto-generated from API Design Document v1.0

I. AUTHENTICATION & USER MANAGEMENT
1.1 Login Page
Route: /login
 Purpose: Đăng nhập vào hệ thống
 Mapped API: POST /auth/login
Components:
yaml
- Form:
    - Input[email]: text/email
      bind_to: request.email
    - Input[phone]: text/phone (optional)
      bind_to: request.phone
    - Input[password]: password
      bind_to: request.password
    - Button[submit]: "Đăng nhập"
    - Link: "Quên mật khẩu?"

- Response Handler:
    - On Success:
        bind_from: response.access_token, response.user
        action: Save token → Redirect to dashboard
    - On Error:
        action: Show error toast
Flow:
User nhập email/phone + password
Click "Đăng nhập" → POST /auth/login
Success → Lưu token vào localStorage → Navigate theo role
Error → Hiển thị lỗi

1.2 User Dashboard Landing
Route: /dashboard
 Purpose: Điều hướng user đến dashboard phù hợp với role
 Logic: Check user.roles → Redirect
yaml
- ADMIN → /dashboards/admin
- MANAGER → /dashboards/manager
- CENTER_HEAD → /dashboards/center-head
- SUBJECT_LEADER → /dashboards/subject-leader
- ACADEMIC_STAFF → /dashboards/academic-staff (⚠️ FIXED: Was incorrectly pointing to center-head)
- TEACHER → /dashboards/teacher
- STUDENT → /dashboards/student
- QA → /dashboards/qa

II. ORGANIZATION & RESOURCES
2.1 Branches List Page
Route: /branches
 Purpose: Hiển thị danh sách chi nhánh
 Mapped API: GET /branches
Components:
yaml
- Header:
    - Title: "Danh sách Chi nhánh"
    - Button[create]: "Tạo chi nhánh mới" (MANAGER, ADMIN only)
      action: Navigate to /branches/new

- Filters:
    - Select[center_id]: "Chọn center"
      bind_to: query.center_id
    - Select[status]: active|inactive|closed|planned
      bind_to: query.status
    - Button[apply]: "Áp dụng"

- Table:
    columns:
      - code: "Mã chi nhánh"
        bind_from: response.data[].code
      - name: "Tên chi nhánh"
        bind_from: response.data[].name
      - address: "Địa chỉ"
        bind_from: response.data[].address
      - capacity: "Sức chứa"
        bind_from: response.data[].capacity
      - status: "Trạng thái"
        bind_from: response.data[].status
        render: Badge component
      - actions: "Thao tác"
        render: 
          - Button[view]: Navigate to /branches/:id
          - Button[edit]: Navigate to /branches/:id/edit

- Pagination:
    bind_from: response.pagination
    actions: Update query.page
Flow:
Component mount → GET /branches?page=1&limit=20
User filter → Update query params → Re-fetch
Click row/view → Navigate to detail page

2.2 Branch Detail Page
Route: /branches/:id
 Purpose: Xem chi tiết chi nhánh
 Mapped API: GET /branches/:id
Components:
yaml
- Header:
    - Breadcrumb: Home > Branches > {branch_name}
    - Button[edit]: "Chỉnh sửa" (MANAGER, ADMIN)
      action: Navigate to /branches/:id/edit

- Info Section:
    - Card[Basic Info]:
        - Field[code]: bind_from: response.code
        - Field[name]: bind_from: response.name
        - Field[address]: bind_from: response.address
        - Field[phone]: bind_from: response.phone
        - Field[capacity]: bind_from: response.capacity
        - Field[status]: bind_from: response.status
    
    - Card[Time Slots]:
        - List:
            bind_from: response.time_slots[]
            render: 
              - name, start_time, end_time, duration_min
        - Button[add]: "Thêm khung giờ"
    
    - Card[Resources]:
        - Tabs:
            - Tab[ROOM]: Filter resource_type=ROOM
            - Tab[VIRTUAL]: Filter resource_type=VIRTUAL
        - List:
            bind_from: response.resources[]
            render: name, capacity, equipment/meeting_url
        - Button[add]: "Thêm tài nguyên"

2.3 Create/Edit Branch Page
Route: /branches/new hoặc /branches/:id/edit
 Purpose: Tạo mới hoặc chỉnh sửa chi nhánh
 Mapped API: POST /branches hoặc PUT /branches/:id
Components:
yaml
- Form:
    - Select[center_id]: "Center"
      bind_to: request.center_id
    - Input[code]: "Mã chi nhánh"
      bind_to: request.code
    - Input[name]: "Tên chi nhánh"
      bind_to: request.name
    - Textarea[address]: "Địa chỉ"
      bind_to: request.address
    - Input[location]: "Tọa độ (lat,long)"
      bind_to: request.location
    - Input[phone]: "Số điện thoại"
      bind_to: request.phone
    - Input[capacity]: number
      bind_to: request.capacity
    - Select[status]: active|inactive|closed|planned
      bind_to: request.status
    - DatePicker[opening_date]: "Ngày khai trương"
      bind_to: request.opening_date
    
    - ButtonGroup:
        - Button[cancel]: "Hủy"
        - Button[submit]: "Lưu"
Flow:
Mode=new: Hiển thị form trống
Mode=edit: GET /branches/:id → Fill form
User submit → POST/PUT → Success toast → Navigate to /branches/:id

2.4 Time Slots Management (Modal/Drawer)
Purpose: Quản lý khung giờ cho chi nhánh
 Mapped API: GET/POST /branches/:id/time-slots
Components:
yaml
- List[time_slots]:
    bind_from: GET /branches/:id/time-slots response.data[]
    render:
      - name, start_time, end_time, duration_min
      - Button[delete]

- Form[Add Time Slot]:
    - Input[name]: "Tên slot"
    - TimePicker[start_time]
    - TimePicker[end_time]
    - Input[duration_min]: auto-calculated
    - Button[submit]: POST /branches/:id/time-slots

2.5 Resources Management
Route: /branches/:id/resources
 Purpose: Quản lý phòng học và tài nguyên ảo
 Mapped API: GET/POST /branches/:id/resources
Components:
yaml
- Tabs:
    - Tab[ROOM]: Phòng học vật lý
    - Tab[VIRTUAL]: Tài nguyên ảo

- Table[ROOM]:
    columns:
      - name, location, capacity, equipment
      - actions: edit, delete
    bind_from: GET /branches/:id/resources?resource_type=ROOM

- Table[VIRTUAL]:
    columns:
      - name, meeting_url, license_type, expiry_date
      - actions: edit, delete
    bind_from: GET /branches/:id/resources?resource_type=VIRTUAL

- Button[add]: "Thêm tài nguyên"
    action: Open modal/drawer with form
Modal Form:
yaml
- Select[resource_type]: ROOM|VIRTUAL
    conditional_fields:
      - If ROOM:
          - Input[name]
          - Input[location]
          - Input[capacity]
          - Textarea[equipment]
      - If VIRTUAL:
          - Input[name]
          - Input[meeting_url]
          - Input[account_email]
          - Select[license_type]
          - DatePicker[expiry_date]

III. ACADEMIC STRUCTURE
3.1 Subjects List Page
Route: /subjects
 Purpose: Quản lý các môn học
 Mapped API: GET /subjects
Components:
yaml
- Header:
    - Button[create]: "Tạo môn học mới" (SUBJECT_LEADER)

- Table:
    columns:
      - code, name, description, status
      - levels_count, courses_count
      - actions: view, edit
    bind_from: response.data[]

- Pagination

3.2 Subject Detail Page
Route: /subjects/:id
 Purpose: Xem chi tiết môn học và các levels
 Mapped API: GET /subjects/:id, GET /subjects/:id/levels
Components:
yaml
- Card[Subject Info]:
    - code, name, description, status
    bind_from: GET /subjects/:id

- Section[Levels]:
    - Button[add]: "Thêm level"
    - Table:
        columns:
          - code, name, standard_type
          - expected_duration_hours, sort_order
          - actions: edit, view courses
        bind_from: GET /subjects/:id/levels

- Section[PLOs - Program Learning Outcomes]:
    - Button[add]: "Thêm PLO"
    - List:
        bind_from: GET /subjects/:id/plos

3.3 Courses List Page
Route: /courses
 Purpose: Danh sách các khóa học
 Mapped API: GET /courses
Components:
yaml
- Filters:
    - Select[subject_id]
    - Select[level_id]
    - Select[status]
    - Checkbox[approved]: "Chỉ hiển thị đã duyệt"

- Table:
    columns:
      - code, name, version
      - subject, level
      - total_hours, duration_weeks
      - status, approved_by
      - actions: view, edit, submit, approve
    bind_from: response.data[]

3.4 Course Detail Page
Route: /courses/:id
 Purpose: Xem chi tiết khóa học
 Mapped API: GET /courses/:id
Components:
yaml
- Header:
    - Breadcrumb
    - Status Badge: bind_from: response.status
    - ButtonGroup:
        - Button[edit]: "Chỉnh sửa" (SUBJECT_LEADER)
        - Button[submit]: "Gửi duyệt" → POST /courses/:id/submit (SUBJECT_LEADER)
        - Button[approve]: "Phê duyệt" (MANAGER only - strategic approval)
        - Button[reject]: "Từ chối" (MANAGER only)

- Tabs:
    - Tab[Overview]:
        - Basic info: code, name, version, description
        - total_hours, duration_weeks, session_per_week
        - prerequisites, target_audience, teaching_methods

    - Tab[Phases]:
        - Accordion/List:
            bind_from: response.phases[]
            render:
              - phase_number, name, duration_weeks
              - learning_focus, sessions_count
              - Button[view sessions]: Navigate to phase detail

    - Tab[CLOs]:
        - Button[add]: "Thêm CLO"
        - Button[map to PLO]: "Map với PLO" → Open mapping modal
        - Table:
            bind_from: response.clos[]
            columns:
              - code, description
              - mapped_plos: Display PLO badges
              - mapped_sessions_count
              - actions: edit, delete, map to sessions

    - Tab[PLO ↔ CLO ↔ Session Mapping]: ⭐ NEW
        - Purpose: Curriculum integrity mapping for accreditation
        - Interactive Mapping Editor:
            - Tree view showing PLO → CLO → Sessions hierarchy
            - Drag-and-drop interface to map CLOs to Sessions
            - Visual indicators for coverage (which sessions cover which CLOs)
            - Export mapping report for accreditation

    - Tab[Materials]:
        - Upload area
        - List:
            bind_from: response.materials[]
            render: title, url, phase_id, uploaded_by

3.5 Course Phase Detail
Route: /courses/:id/phases/:phase_id
 Purpose: Xem chi tiết phase và danh sách sessions (template)
 Mapped API: GET /phases/:phase_id/sessions
Components:
yaml
- Header:
    - phase_number, name, duration_weeks
    - Button[add session]: "Thêm buổi học"

- Table[Sessions Template]:
    columns:
      - sequence_no, topic
      - student_task, skill_set
      - clos (mapped), materials
      - actions: edit, delete, view details
    bind_from: response.data[]

IV. CLASS MANAGEMENT
4.1 Classes List Page
Route: /classes
 Purpose: Danh sách các lớp học
 Mapped API: GET /classes
Components:
yaml
- Header:
    - Button[create]: "Tạo lớp mới" (MANAGER, ACADEMIC_STAFF)

- Filters:
    - Select[branch_id]
    - Select[course_id]
    - Select[status]: draft|scheduled|ongoing|completed|cancelled
    - Select[modality]: OFFLINE|ONLINE|HYBRID
    - DateRange[start_date]: from/to

- Table:
    columns:
      - code, name
      - branch, course
      - modality, start_date, status
      - current_enrollment / max_capacity
      - actions:
          - view: /classes/:id
          - edit: /classes/:id/edit
          - submit: POST /classes/:id/submit
          - approve: POST /classes/:id/approve
          - validate: POST /classes/:id/validate
    bind_from: response.data[]
    
    row_style:
      - If status=draft: yellow
      - If conflicts detected: red
      - If status=ongoing: green

- Pagination

4.2 Create Class Page
Route: /classes/new
 Purpose: Tạo lớp học mới
 Mapped API: POST /classes
Components:
yaml
- Step 1: Basic Info
    - Select[branch_id]: "Chi nhánh"
    - Select[course_id]: "Khóa học"
      on_change: Fetch course details
    - Input[code]: "Mã lớp" (auto-generate option)
    - Input[name]: "Tên lớp"
    - Select[modality]: OFFLINE|ONLINE|HYBRID
    - DatePicker[start_date]: "Ngày khai giảng"
    - Input[max_capacity]: "Sức chứa tối đa"

- Step 2: Schedule Setup
    - Checkbox Group[schedule_days]: "Chọn ngày học"
      options: [1:T2, 2:T3, 3:T4, 4:T5, 5:T6, 6:T7, 0:CN]
      bind_to: request.schedule_days[]
    
    - For each selected day:
        - Select[slot_id]: "Khung giờ"
          bind_to: request.schedule_mapping[day].slot_id
          options: GET /branches/:id/time-slots

- Step 3: Preview & Validate
    - Display:
        - Total sessions will be generated
        - Schedule summary (T2T4T6 08:00-10:30)
    - Button[validate]: POST /classes/:id/validate
      action: Show conflicts if any
    - Button[submit]: POST /classes

- Conflict Display:
    - Alert Box:
        bind_from: validate response.conflicts[]
        render:
          - type, session_id, date, time
          - conflicting resource/teacher
          - suggested alternatives
Flow:
Fill basic info
Set schedule → System auto-calculate sessions_count
Click validate → Show conflicts (if any)
Click submit → POST /classes → Success → Navigate to /classes/:id
Class status = draft → Academic Staff submit → Center Head approve

4.3 Class Detail Page
Route: /classes/:id
 Purpose: Xem chi tiết lớp học
 Mapped API: GET /classes/:id
Components:
yaml
- Header:
    - Title: bind_from: response.code + response.name
    - Status Badge: bind_from: response.status
    - ButtonGroup:
        - Button[edit]: (MANAGER, ACADEMIC_STAFF if draft)
        - Button[submit]: "Gửi duyệt" → POST /classes/:id/submit
        - Button[approve/reject]: (MANAGER, CENTER_HEAD)
        - Button[validate]: "Kiểm tra xung đột"

- Tabs:
    - Tab[Overview]:
        - Card[Basic Info]:
            - branch, course, modality
            - start_date, planned_end_date
            - schedule_days + time mapping
            - max_capacity, current_enrollment
            - created_by, approved_by
        
        - Card[Statistics]:
            - sessions_count, sessions_completed
            - current_enrollment, fill_rate
            - attendance_rate (link to report)
    
    - Tab[Sessions]:
        - Link to: /classes/:id/sessions
    
    - Tab[Students]:
        - Link to: /classes/:id/students
    
    - Tab[Assessments]:
        - Link to: /classes/:id/assessments
    
    - Tab[Feedback]:
        - Link to: /classes/:id/feedback

4.4 Class Sessions Page
Route: /classes/:id/sessions
 Purpose: Quản lý các buổi học của lớp
 Mapped API: GET /classes/:id/sessions
Components:
yaml
- Filters:
    - DateRange[date_from, date_to]
    - Select[status]: planned|cancelled|done
    - Select[type]: CLASS|MAKEUP|EXAM|OTHER

- Calendar View / Table View Toggle

- Table:
    columns:
      - date, start_time - end_time
      - course_session.topic
      - teachers (with skill)
      - resources
      - attendance_summary: present/total
      - status
      - actions:
          - view: /sessions/:id
          - edit: PUT /sessions/:id (MANAGER, ACADEMIC_STAFF)
          - cancel: POST /sessions/:id/cancel
          - assign teacher: Modal
          - assign resource: Modal
    bind_from: response.data[]

- Bulk Actions:
    - Checkbox select multiple sessions
    - Button[bulk cancel]
    - Button[bulk assign teacher]
Flow:
Load sessions → Display in table/calendar
Click session → Navigate to /sessions/:id (detail)
Click assign teacher → Open modal → Select teacher + skill → POST /sessions/:id/teachers
Click cancel → Confirm modal → POST /sessions/:id/cancel

4.5 Class Students Page (Enrollments)
Route: /classes/:id/students
 Purpose: Quản lý học viên trong lớp
 Mapped API: GET /classes/:id/enrollments
Components:
yaml
- Header:
    - Button[enroll]: "Ghi danh học viên"
      action: Open modal
        - Search student
        - Or bulk import CSV
        - POST /classes/:id/enrollments

- Table:
    columns:
      - student_code, student_name
      - enrolled_at
      - attendance_summary: present/total/rate
      - status: enrolled|transferred|dropped
      - actions:
          - view: /students/:id
          - transfer: Open transfer modal
          - drop: Confirm modal
    bind_from: GET /classes/:id/enrollments or inferred from enrollment endpoint

- Statistics Card:
    - Total enrolled
    - Average attendance rate
    - Students at risk (low attendance)

V. SESSION MANAGEMENT
5.1 Session Detail Page
Route: /sessions/:id
 Purpose: Chi tiết một buổi học
 Mapped API: GET /sessions/:id
Components:
yaml
- Header:
    - Breadcrumb: Class > Sessions > Session Detail
    - Status Badge
    - ButtonGroup:
        - Button[edit]: (MANAGER, ACADEMIC_STAFF)
        - Button[cancel]: POST /sessions/:id/cancel
        - Button[take attendance]: Navigate to attendance page (TEACHER)

- Card[Session Info]:
    - date, start_time, end_time, type, status
    - course_session: sequence_no, topic, student_task, skill_set
    - materials: links

- Card[Teachers]:
    - List:
        bind_from: response.teachers[]
        render: name, skill, role
    - Button[assign]: (MANAGER)

- Card[Resources]:
    - List:
        bind_from: response.resources[]
        render: type, name, capacity
    - Button[assign]: (MANAGER)

- Card[Students]:
    - Table:
        bind_from: response.students[]
        columns:
          - student_code, student_name
          - is_makeup
          - attendance_status
          - note
    - Summary: total, present, absent, late, excused

- Card[Teacher Report]:
    - If status=done:
        bind_from: GET /sessions/:id/report
        display:
          - content_covered
          - homework_assigned
          - notes
          - next_session_preparation

5.2 Attendance Recording Page
Route: /sessions/:id/attendance
 Purpose: Giáo viên điểm danh
 Mapped API: GET/POST /sessions/:id/attendance
Components:
yaml
- Header:
    - Session info: date, time, class_code, topic
    - Auto-save indicator
    - ⭐ NEW: Attendance Lock Status:
        - If not locked: Display countdown "Khóa sau: 3h 45m" (based on config)
        - If locked: Display "🔒 Đã khóa" badge + locked_at timestamp
        - Only ADMIN/MANAGER can unlock: Button[unlock] → POST /sessions/:id/attendance/unlock

- ⭐ Lock Warning Banner:
    - If session.end_time + lock_hours is approaching:
        - Alert: "Điểm danh sẽ tự động khóa sau {countdown}. Vui lòng hoàn tất trước thời gian khóa."
        - Color: Warning (yellow/orange)

- List[Students]:
    bind_from: GET /sessions/:id/attendance response.students[]
    disabled_if: is_locked = true (unless user is ADMIN/MANAGER)
    render for each student:
      - Avatar
      - student_code, student_name
      - is_makeup badge
      - Radio Group / Button Group[attendance_status]:
          options: present|absent|late|excused
          bind_to: attendances[].attendance_status
          disabled: is_locked = true
      - Textarea[note]: optional
          bind_to: attendances[].note
          disabled: is_locked = true

- Summary Panel (sticky):
    - Present: count
    - Absent: count
    - Late: count
    - Excused: count

- Actions:
    - Button[mark all present]: Quick action (disabled if locked)
    - Button[save]: POST /sessions/:id/attendance (disabled if locked)
    - Button[submit & finish]: POST attendance + POST session report (disabled if locked)
Flow:
Teacher load page → GET attendance list → Check is_locked status
If locked: Show locked state, disable all inputs
If not locked: Mark each student → Auto-save or manual save
Click "Lưu" → POST /sessions/:id/attendance
After attendance → Navigate to session report form
System auto-locks after T hours (configured in /admin/settings)

5.3 Session Report Form
Route: /sessions/:id/report
 Purpose: Giáo viên báo cáo buổi học
 Mapped API: POST /sessions/:id/report
Components:
yaml
- Form:
    - Select[status]: done|cancelled
      bind_to: request.status
    - TimePicker[actual_start_time]
      bind_to: request.actual_start_time
    - TimePicker[actual_end_time]
      bind_to: request.actual_end_time
    - Textarea[content_covered]: "Nội dung đã giảng"
      bind_to: request.content_covered
    - Textarea[homework_assigned]: "Bài tập về nhà"
      bind_to: request.homework_assigned
    - Textarea[notes]: "Ghi chú"
      bind_to: request.notes
    - Textarea[next_session_preparation]: "Chuẩn bị buổi sau"
      bind_to: request.next_session_preparation
    
    - Button[submit]: POST /sessions/:id/report

VI. TEACHER OPERATIONS
6.1 Teacher Profile Page
Route: /teachers/:id
 Purpose: Hồ sơ giáo viên
 Mapped API: GET /teachers/:id
Components:
yaml
- Header:
    - Avatar, name, employee_code
    - Button[edit]: (MANAGER, ADMIN)

- Tabs:
    - Tab[Profile]:
        - email, phone, note
        - Card[Skills]:
            bind_from: response.skills[]
            render: Skill badges with level
            Button[edit skills]: (MANAGER)
        - Card[Branches]:
            bind_from: response.branches[]
    
    - Tab[Availability]:
        - Card[Regular Availability]:
            bind_from: GET /teachers/:id/availability
            render: day_of_week, start_time, end_time
            Button[add/edit]
        - Card[Overrides]:
            List: date, time, is_available, reason
            Button[add override]: (TEACHER)
    
    - Tab[Schedule]:
        - Link to: GET /teachers/:id/schedule
        - Calendar view
    
    - Tab[Workload]:
        - Link to: GET /teachers/:id/workload
        - Charts: hours by class, by skill
    
    - Tab[Requests]:
        - Link to: GET /teachers/:id/requests

6.2 Teacher Schedule Page
Route: /teachers/:id/schedule
 Purpose: Lịch giảng dạy của GV
 Mapped API: GET /teachers/:id/schedule
Components:
yaml
- DateRange Picker:
    bind_to: query.date_from, date_to

- Calendar View:
    bind_from: response.sessions[]
    render each session:
      - time, class_code, skill, role
      - resource, status

- Summary Panel:
    bind_from: response.summary
    - total_sessions, total_hours
    - by_status breakdown

- List View (alternative):
    - Grouped by date
    - Show session details

6.3 Teacher Requests Page
Route: /teachers/:id/requests
 Purpose: Quản lý yêu cầu của giáo viên
 Mapped API: GET/POST /teachers/:id/requests
Components:
yaml
- Header:
    - Button[new request]: "Tạo yêu cầu mới" (TEACHER)
      action: Open modal

- Filters:
    - Select[request_type]: leave|swap|ot|reschedule
    - Select[status]: pending|approved|rejected

- Table:
    columns:
      - request_type, session (date, time, class)
      - note, status
      - submitted_at, decided_at
      - resolution
      - actions:
          - view details
          - approve/reject (ACADEMIC_STAFF, MANAGER)
          - cancel (TEACHER if pending)
    bind_from: response.data[]

- Request Detail Modal:
    - Display full request info
    - If type=leave and user is approver:
        - Button[find substitute]: 
            → GET /teacher-requests/:id/substitute-teachers
            → Show available teachers
            → Select → POST /teacher-requests/:id/approve
Create Request Modal:
yaml
- Select[request_type]: leave|swap|ot|reschedule
- Conditional fields based on type:
    - If leave/reschedule:
        - Select[session_id]: From teacher's upcoming sessions
    - Textarea[note]
- Button[submit]: POST /teachers/:id/requests

VI-B. STUDENT REQUEST MANAGEMENT ⭐ NEW MODULE
**Purpose**: Handle student requests for absence, make-up sessions, and class transfers
**Roles**: STUDENT (submit), ACADEMIC_STAFF (approve), CENTER_HEAD (approve transfers)

6B.1 Student Request List Page (Academic Staff View)
Route: /requests/students
 Purpose: Academic Staff xem và xử lý yêu cầu của học viên
 Mapped API: GET /student-requests (⚠️ MISSING in API - needs to be added)
Components:
yaml
- Header:
    - Title: "Yêu cầu từ Học viên"
    - Button[export]: "Xuất báo cáo"

- Filters:
    - Select[branch_id]: Filter by branch
    - Select[request_type]: absence|makeup|transfer|all
    - Select[status]: pending|approved|rejected|all
    - DateRange[submitted_date]
    - Input[student_search]: Search by student name/code

- Table:
    columns:
      - student_code, student_name
      - request_type: Badge colored by type
      - current_class, target_session/target_class
      - submitted_at, priority
      - status: Badge
      - actions:
          - view: Open detail modal
          - approve: (if pending)
          - reject: (if pending)
    bind_from: response.data[]
    row_color:
      - pending + urgent: orange
      - pending: yellow
      - approved: green
      - rejected: gray

- Pagination

6B.2 Student Request Detail Modal
Components:
yaml
- Header:
    - Request type badge
    - Status badge
    - Student info: code, name, current class

- Content (varies by type):

    If type = ABSENCE:
      - Target session: date, time, topic, class_code
      - Reason: student note
      - Submitted at
      - Actions:
          - Button[approve]: POST /student-requests/:id/approve
            → Updates student_session.attendance_status to 'excused'
          - Button[reject]: POST /student-requests/:id/reject

    If type = MAKEUP:
      - Original missed session: date, topic, class_code
      - Proposed makeup session: date, time, topic, different class
      - Capacity check: "Available slots: 3/25"
      - Validation warning (if any): "Cảnh báo: Nội dung không khớp"
      - Actions:
          - Button[approve]: POST /student-requests/:id/approve
            → Creates new student_session with is_makeup=true
            → Marks original session as 'excused'
          - Button[reject with reason]

    If type = TRANSFER:
      - Current class: code, schedule, modality, progress
      - Target class: code, schedule, modality
      - Effective date
      - Content mapping validation:
          - Display gap analysis (if any)
          - Example: "Session 15, 17 không có trong lớp mới"
      - Capacity check: "Lớp mới: 20/25 slots"
      - Actions:
          - Button[validate]: POST /student-requests/:id/validate-transfer
            → Shows detailed validation result
          - Button[approve]: POST /student-requests/:id/approve
            → Execute transfer transaction (see business flow 3.5.3)
          - Button[reject with reason]

- Audit Trail:
    - Submitted by, submitted at
    - Decided by, decided at (if processed)
    - Resolution note

6B.3 Student Request Creation (Student View)
Route: /students/:id/requests/new or modal from student dashboard
Components:
yaml
- Select[request_type]: "Loại yêu cầu"
    options:
      - absence: "Báo nghỉ có phép"
      - makeup: "Học bù"
      - transfer: "Chuyển lớp"

- Conditional Form Fields:

    If ABSENCE selected:
      - Select[target_session_id]: "Buổi học sẽ nghỉ"
        options: GET /students/:id/sessions?status=planned&date_from=today
        display: date, time, topic, class_code
      - Textarea[reason]: "Lý do" (required)
      - DatePicker: auto-filled from session
      - Note: "Vui lòng gửi trước {X} ngày (cấu hình từ system settings)"

    If MAKEUP selected:
      Step 1: Select missed session
        - Select[target_session_id]: "Buổi học đã nghỉ"
          options: GET /students/:id/sessions?attendance_status=absent
          display: date, topic, class_code

      Step 2: System finds available makeup sessions
        - on_select_session:
            → GET /student-requests/makeup/available-sessions?student_id=X&session_id=Y
            → API returns: sessions with same course_session_id, capacity available

        - Display available makeup sessions:
            List/Cards showing:
              - class_code, date, time
              - branch, modality (OFFLINE/ONLINE)
              - teacher
              - available_slots: "3/25"
              - capacity_warning if almost full
            - Select[makeup_session_id]

      - Textarea[note]: Optional reason
      - Submit: POST /students/:id/requests

    If TRANSFER selected:
      Step 1: Display current class
        - Show current class details (read-only)

      Step 2: Select target class
        - Filter compatible classes:
            → GET /classes?course_id={same_course}&status=scheduled|ongoing&branch_id={optional}
        - Display compatible classes:
            - class_code, schedule, modality, branch
            - start_date, current_enrollment/max_capacity
            - Select[target_class_id]

      Step 3: Validation & effective date
        - DatePicker[effective_date]: "Ngày bắt đầu học lớp mới"
        - Button[validate]: POST /student-requests/validate-transfer
            → Shows validation result:
              - Capacity OK/Full
              - Content gap analysis (if any)
              - Schedule conflict (if any)
        - Textarea[reason]

      - Submit: POST /students/:id/requests

- Actions:
    - Button[cancel]
    - Button[submit]: Creates request with status='pending'

6B.4 Student Request Status Page (Student View)
Route: /students/:id/requests or /dashboards/student (section)
Components:
yaml
- My Requests List:
    bind_from: GET /students/:id/requests
    - Card for each request:
        - type badge, status badge
        - Submitted date
        - Summary: "Yêu cầu học bù cho Session 15 - Listening Practice"
        - If pending: "Đang chờ xử lý"
        - If approved: "Đã duyệt bởi {staff_name} ngày {date}"
        - If rejected: "Từ chối: {reason}"
        - Button[view details]
        - Button[cancel]: if status=pending

VI-C. TEACHER REQUEST MANAGEMENT ⭐ NEW MODULE
**Purpose**: Handle teacher leave, OT registration, reschedule, and swap requests
**Roles**: TEACHER (submit), ACADEMIC_STAFF (approve/handle), MANAGER (escalated)

6C.1 Teacher Request List Page (Academic Staff View)
Route: /requests/teachers
 Purpose: Academic Staff xem và xử lý yêu cầu của giáo viên
 Mapped API: GET /teacher-requests (⚠️ MISSING in API - needs to be added)
Components:
yaml
- Header:
    - Title: "Yêu cầu từ Giáo viên"
    - Tabs:
        - Tab[Pending]: Chỉ hiện pending (urgent)
        - Tab[All]: Tất cả requests

- Filters:
    - Select[request_type]: leave|ot|reschedule|swap|all
    - Select[status]: pending|approved|rejected
    - DateRange[session_date]

- Table:
    columns:
      - teacher_name, employee_code
      - request_type: Badge
      - session: date, time, class_code, topic
      - submitted_at
      - status
      - resolution: Summary of solution (if approved)
      - actions:
          - view: Detail modal
          - handle: (if type=leave and pending) → Open solution modal
          - approve: (if type=ot)
          - reject
    bind_from: response.data[]
    row_color:
      - leave + pending: red (urgent - needs immediate solution)
      - pending: yellow
      - approved: green

6C.2 Teacher Leave Request Handling (Critical Flow)
Purpose: Academic Staff must find solution before approving
Modal Components:
yaml
- Header:
    - "Xử lý yêu cầu nghỉ phép"
    - Teacher: name, employee_code
    - Session: date, time, class_code, topic
    - Reason: teacher's note
    - Urgency indicator

- Solution Options (Radio Group):
    - Option A: Find Substitute Teacher ⭐ MOST COMMON
    - Option B: Reschedule Session
    - Option C: Cancel Session (last resort)

- If Option A selected: FIND SUBSTITUTE
    - System auto-searches:
        → GET /teacher-requests/:id/substitute-teachers
        → API returns available teachers ranked by:
          - Priority 1: Teachers with OT registration for that exact slot
          - Priority 2: Teachers with regular availability + skill match

    - Display Available Substitutes:
        List/Cards:
          - teacher_name, employee_code
          - skills: badges (match with session.skill_set)
          - availability_type: "OT đăng ký" (badge) or "Lịch thường xuyên"
          - current_workload: "12h tuần này"
          - rating: if available
          - Button[select]

    - If no substitutes found:
        - Alert: "Không tìm thấy giáo viên thay thế. Vui lòng chọn Option B hoặc C"

    - Selected substitute confirmation:
        - Display: "GV {name} sẽ thay thế"
        - Auto-create OT request if applicable
        - Button[approve & assign]:
            → POST /teacher-requests/:id/approve
            → body: { resolution: 'substitute', substitute_teacher_id: X }
            → Backend executes:
              - Update teaching_slot (change teacher)
              - Create OT request for substitute
              - Notify students of teacher change

- If Option B selected: RESCHEDULE SESSION
    - DatePicker[new_date]: Select new date
    - System finds available slots on new date:
        → GET /sessions/available-slots?date={new_date}&teacher_id={original_teacher}&resource_id={current_resource}
    - Display available slots:
        - time_slot, resource availability, no conflicts
        - Select[new_slot]
    - Button[approve & reschedule]:
        → POST /teacher-requests/:id/approve
        → body: { resolution: 'reschedule', new_date: X, new_time: Y }
        → Backend creates new session, marks old as cancelled, transfers students

- If Option C selected: CANCEL SESSION
    - Warning: "Tất cả học viên sẽ được đánh dấu 'excused'. Chỉ dùng khi không có giải pháp khác."
    - Textarea[cancellation_reason]: Required
    - Button[approve & cancel]:
        → POST /teacher-requests/:id/approve
        → body: { resolution: 'cancel', reason: X }
        → Backend: cancel session, mark all students 'excused', notify students

6C.3 Teacher OT Registration
Route: /teachers/:id/availability/overrides
Components:
yaml
- Purpose: Teacher registers extra availability for OT opportunities
- Calendar View: Show teacher's regular schedule + existing overrides
- Button[add OT availability]: "Đăng ký khung giờ OT"
- Modal Form:
    - DatePicker[date]
    - TimePicker[start_time, end_time]
    - Textarea[note]: Optional
    - Toggle[recurring]: If weekly recurring OT
    - Submit: POST /teachers/:id/availability/overrides
        → Creates teacher_availability_override with is_available=true

- OT History:
    - Table: sessions taught as OT
      columns: date, class, hours, status
      bind_from: GET /teacher-requests?teacher_id=X&request_type=ot&status=approved

6C.4 Teacher Request Creation (Teacher View)
Route: /teachers/:id/requests/new
Components:
yaml
- Select[request_type]:
    - leave: "Xin nghỉ phép"
    - reschedule: "Đổi lịch dạy"
    - swap: "Hoán đổi buổi với GV khác" (future feature)

- If LEAVE:
    - Select[session_id]: "Buổi học cần nghỉ"
      options: GET /teachers/:id/sessions?status=planned&date_from=today
      display: date, time, class_code, topic
    - Textarea[reason]: Required
    - Note: "Academic Staff sẽ tìm giáo viên thay thế"
    - Submit: POST /teachers/:id/requests

- If RESCHEDULE:
    - Select[session_id]: "Buổi học cần đổi"
    - DatePicker[preferred_new_date]
    - Textarea[reason]
    - Submit: POST /teachers/:id/requests

VII. STUDENT OPERATIONS
7.1 Student Profile Page
Route: /students/:id
 Purpose: Hồ sơ học viên
 Mapped API: GET /students/:id
Components:
yaml
- Header:
    - Avatar, student_code, full_name
    - Button[edit]: (ACADEMIC_STAFF)

- Tabs:
    - Tab[Overview]:
        - email, phone, branch
        - Card[Current Classes]:
            bind_from: response.current_classes[]
            render:
              - class_code, class_name, teacher
              - progress: completion_percent, attendance_rate
              - next_session
        - Card[Statistics]:
            - Total classes enrolled
            - Overall attendance rate
            - Average score
    
    - Tab[Enrollments]:
        - GET /students/:id/enrollments
        - Table: class, status, enrolled_at, attendance_rate
    
    - Tab[Schedule]:
        - GET /students/:id/schedule
        - Calendar view
    
    - Tab[Attendance]:
        - GET /students/:id/attendance
        - Report + Chart
    
    - Tab[Scores]:
        - GET /students/:id/scores (inferred)
        - List assessments + scores
    
    - Tab[Requests]:
        - GET /students/:id/requests

7.2 Student Schedule Page
Route: /students/:id/schedule
 Purpose: Lịch học của học viên
 Mapped API: GET /students/:id/schedule
Components:
yaml
- DateRange Picker:
    bind_to: query.date_from, date_to

- Calendar View:
    bind_from: response.sessions[]
    render:
      - date, time
      - class_code, topic
      - teachers, resource
      - is_makeup badge
      - attendance_status colored

- Summary:
    bind_from: response.summary
    - total_sessions, by_status

7.3 Student Requests Page
Route: /students/:id/requests
 Purpose: Quản lý yêu cầu của học viên
 Mapped API: GET /students/:id/requests
Components:
yaml
- Header:
    - Button[new request]: "Tạo yêu cầu" (STUDENT, ACADEMIC_STAFF)

- Filters:
    - Select[request_type]: absence|makeup|transfer|reschedule
    - Select[status]: pending|approved|rejected

- Table:
    columns:
      - request_type
      - current_class, target_session
      - note, status
      - submitted_at, decided_at
      - actions: view, approve/reject, cancel
    bind_from: response.data[]
Create Request Modal - Absence:
yaml
- Select[target_session_id]: From upcoming sessions
- Textarea[note]
- Button[submit]: POST /students/:id/requests/absence
Create Request Modal - Makeup:
yaml
- Select[target_session_id]: "Buổi học đã nghỉ"
  on_change: GET /students/:id/requests/makeup/available-sessions
    → Display available makeup sessions
- Select[makeup_session_id]: From available list
- Textarea[note]
- Button[submit]: POST /students/:id/requests/makeup
Create Request Modal - Transfer:
yaml
- Display current_class
- Select[target_class_id]: From compatible classes
  on_select: POST /student-requests/:id/validate-transfer
    → Show validation result
- DatePicker[effective_date]
- Textarea[note]
- Button[submit]: POST /students/:id/requests/transfer

VIII. ASSESSMENTS & SCORES
8.1 Class Assessments Page
Route: /classes/:id/assessments
 Purpose: Quản lý đánh giá trong lớp
 Mapped API: GET /classes/:id/assessments
Components:
yaml
- Header:
    - Button[create]: "Tạo đánh giá" (ACADEMIC_STAFF, TEACHER)

- Table:
    columns:
      - name, kind
      - max_score, weight
      - session_date
      - scores_submitted / total_students
      - actions:
          - view scores: /assessments/:id/scores
          - submit scores: Modal or navigate
          - edit, delete
    bind_from: response.data[]

- Statistics Card:
    - Total assessments
    - Completion rate
Create Assessment Modal:
yaml
- Input[name]: "Tên đánh giá"
  bind_to: request.name
- Select[kind]: quiz|midterm|final|assignment|project|oral|practice|other
  bind_to: request.kind
- Input[max_score]: number
  bind_to: request.max_score
- Input[weight]: "Trọng số (%)"
  bind_to: request.weight
- Select[session_id]: "Buổi học liên quan"
  bind_to: request.session_id
  options: From GET /classes/:id/sessions
- Button[submit]: POST /classes/:id/assessments
8.2 Assessment Scores Page
Route: /assessments/:id/scores
 Purpose: Quản lý điểm đánh giá
 Mapped API: GET/POST /assessments/:id/scores
Components:
yaml
- Header:
    - Assessment info: name, kind, max_score, weight
    - Button[import CSV]: Upload scores
    - Button[export]: Download template

- Statistics Panel:
    bind_from: response.statistics
    - total_students, submitted
    - average, highest, lowest, pass_rate

- Table (Editable):
    columns:
      - student_code, student_name
      - score: Input field (inline edit)
        bind_to: scores[].score
        validation: 0 to max_score
      - percentage: auto-calculated
      - feedback: Textarea (inline edit)
        bind_to: scores[].feedback
      - graded_at
    bind_from: response.scores[]

- Actions:
    - Button[save]: POST /assessments/:id/scores
    - Auto-save indicator (save on blur)

- Import Modal:
    - Upload CSV
    - Preview data
    - Button[confirm]: POST /assessments/:id/scores/import
Flow:
Load page → GET /assessments/:id/scores
Teacher enter scores inline
Click save or auto-save → POST /assessments/:id/scores
Or import CSV → Preview → Confirm → POST import

8.3 Student Feedback Page
Route: /classes/:id/feedback
 Purpose: Xem phản hồi của học viên
 Mapped API: GET /classes/:id/feedback
Components:
yaml
- Filters:
    - Select[phase_id]: Filter by phase
    - Select[rating_min]: 1-5 stars

- Statistics Panel:
    bind_from: response.statistics
    - total_feedbacks, average_rating
    - rating_distribution: Star chart

- List/Cards:
    bind_from: response.data[]
    render:
      - Student info (code, name)
      - Phase name
      - Rating: Star display
      - Comment
      - submitted_at

- Pagination

IX. REPORTS & ANALYTICS
9.1 Enrollment Report Page
Route: /reports/enrollments
 Purpose: Báo cáo ghi danh
 Mapped API: GET /reports/enrollments
Components:
yaml
- Filters:
    - Select[branch_id]
    - DateRange[start_date, end_date]
    - Select[level_id]
    - Button[apply]
    - Button[export]: Download report

- Summary Cards:
    bind_from: response.summary
    - Total active enrollments
    - New enrollments
    - Transfers, Dropped, Completed

- Chart[Enrollment Trend]:
    - Line/bar chart over time

- Table[By Branch]:
    bind_from: response.by_branch[]
    columns:
      - branch_name
      - total_active_enrollments
      - new_enrollments
      - fill_rate

- Table[By Level]:
    bind_from: response.by_level[]
    columns:
      - level_name
      - total_active_enrollments
      - new_enrollments

9.2 Attendance Report Page
Route: /reports/attendance
 Purpose: Báo cáo chuyên cần
 Mapped API: GET /reports/attendance
Components:
yaml
- Filters:
    - Select[branch_id]
    - Select[class_id]
    - DateRange[start_date, end_date]

- Summary Panel:
    bind_from: response.overall
    - total_sessions
    - attendance_rate (with trend indicator)
    - Chart: Attendance over time

- Table[By Class]:
    bind_from: response.by_class[]
    columns:
      - class_code, branch_name
      - total_done_sessions
      - attendance_rate
      - status: Color coded
    sort: by attendance_rate

- Section[Lowest Attendance]:
    bind_from: response.lowest_attendance[]
    - Alert list of classes needing attention

9.3 Class Utilization Report Page
Route: /reports/class-utilization
 Purpose: Báo cáo sử dụng lớp học
 Mapped API: GET /reports/class-utilization
Components:
yaml
- Filters:
    - Select[branch_id]
    - DateRange

- Summary:
    bind_from: response.summary
    - total_classes
    - average_utilization
    - over_capacity count
    - under_utilized count

- Chart:
    - Bar chart: Utilization by class

- Table[By Class]:
    bind_from: response.by_class[]
    columns:
      - class_code, branch_name
      - max_capacity, actual_students
      - utilization_percent
      - status: Color coded
        - Green: 80-100%
        - Yellow: 60-80%
        - Red: <60%

- Section[Under-utilized Classes]:
    bind_from: response.under_utilized_classes[]
    - Alert list with available_slots

9.4 Teacher Workload Report Page
Route: /reports/teacher-workload
 Purpose: Báo cáo khối lượng công việc GV
 Mapped API: GET /reports/teacher-workload
Components:
yaml
- Filters:
    - Select[branch_id]
    - Select[teacher_id]
    - DateRange

- Summary:
    bind_from: response.summary
    - total_teachers
    - total_hours
    - average_hours_per_teacher

- Chart:
    - Bar chart: Hours by teacher

- Table[By Teacher]:
    bind_from: response.by_teacher[]
    columns:
      - teacher_name, employee_code
      - total_sessions_taught, total_hours
      - classes_count
      - ot_sessions, ot_hours
      - leave_requests, substitutions

- Section[Top Workload]:
    bind_from: response.top_workload[]

9.5 Resource Utilization Report Page
Route: /reports/resource-utilization
 Purpose: Báo cáo sử dụng tài nguyên
 Mapped API: GET /reports/resource-utilization
Components:
yaml
- Filters:
    - Select[branch_id]: required
    - Select[resource_type]: ROOM|VIRTUAL
    - DateRange

- Summary:
    bind_from: response.summary
    - total_resources
    - average_utilization
    - total_hours_used / total_hours_available

- Chart:
    - Donut chart: Utilization by resource

- Table[By Resource]:
    bind_from: response.by_resource[]
    columns:
      - resource_name, resource_type
      - capacity (if ROOM)
      - hours_used / hours_available
      - utilization_percent
      - sessions_count

- Section[Peak Hours]:
    bind_from: response.peak_hours[]
    - Heatmap or bar chart
    - time_slot, utilization_percent

9.6 CLO Attainment Report Page
Route: /reports/clo-attainment
 Purpose: Báo cáo đạt chuẩn đầu ra
 Mapped API: GET /reports/clo-attainment
Components:
yaml
- Filters:
    - Select[course_id]
    - Select[class_id]

- Header:
    - Course/Class info

- Summary:
    bind_from: response.summary
    - total_clos
    - achieved_clos, in_progress_clos, not_started_clos
    - Chart: Progress donut

- Table[By CLO]:
    bind_from: response.by_clo[]
    columns:
      - clo_code, description
      - total_scores_recorded
      - average_score_attainment
      - attainment_percent
      - is_achieved: Badge
      - mapped_sessions: completed/total

- Section[Low Attainment CLOs]:
    bind_from: response.low_attainment_clos[]
    - Alert list for intervention

9.7 Feedback Rating Report Page
Route: /reports/feedback-rating
 Purpose: Báo cáo đánh giá phản hồi
 Mapped API: GET /reports/feedback-rating
Components:
yaml
- Filters:
    - Select[branch_id]
    - Select[class_id]
    - DateRange

- Summary:
    bind_from: response.summary
    - total_feedbacks, average_rating
    - rating_distribution: Star visualization

- Chart:
    - Bar chart: Rating distribution

- Table[By Class and Phase]:
    bind_from: response.by_class_and_phase[]
    columns:
      - class_code, class_name, branch_name
      - phase_name
      - avg_rating, count_feedback
      - star breakdown (5,4,3,2,1)

- Section[Top Rated Classes]:
    bind_from: response.top_rated_classes[]

- Section[Low Rated Classes]:
    bind_from: response.low_rated_classes[]
    - Alert list for improvement

9.8 Daily Operations Report Page
Route: /reports/daily-runsheet
 Purpose: Báo cáo vận hành hàng ngày
 Mapped API: GET /reports/daily-runsheet
Components:
yaml
- Filters:
    - DatePicker[date]: default today
    - Select[branch_id]

- Summary Dashboard:
    bind_from: response.summary
    - total_sessions, completed, ongoing, planned, cancelled
    - missing_attendance, missing_report

- Table[Sessions]:
    bind_from: response.sessions[]
    columns:
      - time, class_code
      - teacher, resource
      - students_count
      - status
      - attendance_recorded: Icon (✓/✗)
      - report_submitted: Icon (✓/✗)
    row_color:
      - completed + all done: green
      - missing attendance/report: yellow
      - cancelled: gray

- Section[Alerts]:
    bind_from: response.alerts[]
    - Alert cards:
        - type, session_id, class_code
        - teacher, message
        - severity color coding

X. DASHBOARDS
10.0 Admin Dashboard ⭐ NEW
Route: /dashboards/admin
 Purpose: Dashboard cho System Administrator
 Mapped API: GET /dashboards/admin (⚠️ MISSING - needs to be added)
Components:
yaml
- Header:
    - Title: "Admin Dashboard - Toàn hệ thống"
    - DateRange selector: week|month|quarter

- Overview Cards:
    - Card[Total Users]: All system users
    - Card[Total Centers]: active/inactive
    - Card[Total Branches]: active/inactive
    - Card[System Health]: healthy|degraded|down → Link to /admin/health

- Section[System Activity (Last 24h)]:
    - Logins: count, by role breakdown
    - API calls: total, errors
    - Failed login attempts: security monitoring
    - Link to /admin/audit-logs

- Section[User Management]:
    - New users this week
    - Inactive users (last login > 30 days)
    - Pending user activations
    - Link to /admin/users

- Section[Data Statistics]:
    - Total classes: by status
    - Total enrollments: active/completed
    - Total sessions: planned/done
    - Total attendance records

- Section[System Settings]:
    - Quick access cards:
        - Attendance lock config → /admin/settings
        - Request policies → /admin/settings
        - Notification settings → /admin/settings

- Section[Critical Alerts]:
    - System errors (if any)
    - Failed jobs/tasks
    - Database/storage warnings
    - Security alerts

10.0B Academic Staff Dashboard ⭐ NEW (⚠️ FIXED: Was missing, incorrectly mapped to center-head)
Route: /dashboards/academic-staff
 Purpose: Dashboard cho Academic Staff (Giáo vụ) - Day-to-day operations
 Mapped API: GET /dashboards/academic-staff (⚠️ MISSING - needs to be added)
Components:
yaml
- Header:
    - Title: "Academic Staff Dashboard"
    - Select[branch_id]: Filter by assigned branch (if multi-branch)
    - DatePicker[date]: default today

- KPI Cards Row:
    - Card[My Active Classes]: Classes I'm managing
    - Card[Pending Student Requests]: Urgent count
    - Card[Pending Teacher Requests]: Urgent count (especially leave)
    - Card[Today's Sessions]: Total sessions happening today

- Section[Urgent Actions] ⭐ KEY FEATURE:
    bind_from: response.urgent_tasks
    - Alert cards with priority sorting:
        - Teacher leave requests (RED - requires immediate solution)
        - Student transfer requests (YELLOW - capacity sensitive)
        - Classes pending submission/approval
        - Conflict warnings (resource/teacher)
        - Missing attendance records
    - Each alert:
        - type, severity badge
        - message: "GV Nguyễn Văn A xin nghỉ Session 15 - cần tìm GV thay"
        - action button: "Xử lý ngay"

- Section[My Classes]:
    bind_from: response.my_classes[]
    - Table/Cards:
        - class_code, name, status
        - enrollment: current/max
        - next_session: date, time
        - conflicts: if any (red badge)
        - actions:
            - view: /classes/:id
            - assign teacher: Modal
            - enroll students: Modal

- Section[Today's Schedule]:
    bind_from: response.today_sessions[]
    - Timeline view or Table:
        - time, class_code
        - teacher (green if assigned, red if missing)
        - resource (green if assigned, red if conflict)
        - students_count
        - status: planned|ongoing|done

- Section[Request Queue]:
    - Tabs:
        - Tab[Student Requests]: Count + link to /requests/students
        - Tab[Teacher Requests]: Count + link to /requests/teachers
    - Show recent 5 pending requests per tab
    - Link to full pages

- Section[Pending Approvals]:
    - Classes I created → waiting for Center Head/Manager approval
    - Table: class_code, course, submitted_at, status

10.0C Subject Leader Dashboard ⭐ NEW
Route: /dashboards/subject-leader
 Purpose: Dashboard cho Subject Leader - Curriculum design
 Mapped API: GET /dashboards/subject-leader (⚠️ MISSING - needs to be added)
Components:
yaml
- Header:
    - Title: "Subject Leader Dashboard"
    - Select[subject_id]: Filter by my subjects

- KPI Cards:
    - Card[My Subjects]: Total subjects I manage
    - Card[Courses]: draft/submitted/approved
    - Card[Pending Approvals]: Courses waiting for Manager approval
    - Card[Active Classes]: Classes using my courses

- Section[Curriculum Development]:
    bind_from: response.my_courses[]
    - Status tabs:
        - Tab[Draft]: Courses in progress
        - Tab[Submitted]: Awaiting Manager approval
        - Tab[Approved]: Ready for use
        - Tab[In Use]: Currently being taught
    - Table:
        - code, name, version, level
        - phases_count, sessions_count
        - clo_mapping_complete: Yes/No badge
        - status, approved_by
        - actions:
            - edit: /courses/:id/edit
            - submit for approval: POST /courses/:id/submit
            - view usage: Classes using this course

- Section[PLO/CLO Management]:
    bind_from: response.plos_clos_summary
    - By subject breakdown:
        - subject_name
        - total_plos, total_clos
        - mapping_coverage: "85% sessions mapped"
    - Link to mapping editor

- Section[Course Usage Analytics]:
    bind_from: response.course_usage[]
    - Table:
        - course_name
        - classes_using: count
        - total_students: across all classes
        - avg_completion_rate
        - avg_clo_attainment

- Section[Feedback on My Courses]:
    bind_from: response.course_feedback
    - Average rating by course
    - Recent feedback comments
    - Link to full feedback report

10.0D QA Dashboard ⭐ NEW
Route: /dashboards/qa
 Purpose: Dashboard cho QA staff - Quality monitoring
 Mapped API: GET /dashboards/qa (⚠️ MISSING - needs to be added)
Components:
yaml
- Header:
    - Title: "QA Dashboard"
    - Select[branch_id]: Filter by branch
    - DateRange: default this month

- KPI Cards:
    - Card[QA Reports]: open/closed
    - Card[Classes Monitored]: This month
    - Card[Avg Student Satisfaction]: Overall rating
    - Card[Low-Rated Sessions]: Count (rating < 3)

- Section[Quality Alerts]:
    bind_from: response.quality_alerts[]
    - Alert cards:
        - Low attendance class: "Lớp A1-Mon: 65% attendance"
        - Low feedback rating: "Session 15 - GV X: 2.5 stars"
        - Syllabus deviation: "Lớp B1-Tue: Behind schedule"
        - CLO non-attainment: "CLO-03: Only 60% students achieved"
    - Each alert:
        - severity, class/session info
        - metric value vs. threshold
        - action button: "Create QA Report"

- Section[My QA Reports]:
    bind_from: response.my_reports[]
    - Table:
        - report_type, date_observed
        - scope: class/session/phase
        - findings: summary
        - action_items
        - status: open|in_progress|resolved
        - actions:
            - view, edit, close

- Section[Student Feedback Analysis]:
    bind_from: response.feedback_analysis
    - Chart: Rating distribution over time
    - Table: Low-rated classes (avg < 3.5)
    - Word cloud: Common feedback themes

- Section[Attendance Monitoring]:
    bind_from: response.attendance_monitoring
    - Classes with attendance < threshold
    - Students with high absence rate (alert)
    - Link to /reports/attendance

- Section[CLO Attainment Monitoring]:
    bind_from: response.clo_monitoring
    - By course: CLO achievement rate
    - Low-attainment CLOs (need intervention)
    - Link to /reports/clo-attainment

10.1 Center Head Dashboard
Route: /dashboards/center-head
 Purpose: Dashboard cho Center Head
 Mapped API: GET /dashboards/center-head
Components:
yaml
- Header:
    - Select[branch_id]: Filter by branch
    - DatePicker[date]: default today

- KPI Cards Row:
    bind_from: response.overview
    - Card[Active Classes]: active_classes
    - Card[Total Students]: total_students
    - Card[Total Teachers]: total_teachers
    - Card[Sessions Today]: sessions_today

- Section[Today's Schedule]:
    bind_from: response.today_schedule
    - Summary: total, completed, ongoing, upcoming
    - List: Upcoming sessions with details

- Section[Resource Utilization]:
    bind_from: response.resource_utilization
    - Gauge charts:
        - Rooms: in_use / total
        - Virtual: in_use / total

- Section[Attendance This Week]:
    bind_from: response.attendance_this_week
    - Average rate with trend indicator
    - Mini chart

- Section[Pending Requests]:
    bind_from: response.pending_requests
    - teacher_requests count → Link to requests page
    - student_requests count → Link to requests page

- Section[Alerts]:
    bind_from: response.alerts[]
    - Alert cards:
        - type, severity, message
        - link to relevant page

- Section[Conflicts]:
    bind_from: response.conflicts[]
    - Conflict cards:
        - type, date, teacher/resource
        - sessions involved

10.2 Manager Dashboard
Route: /dashboards/manager
 Purpose: Dashboard cho Manager
 Mapped API: GET /dashboards/manager
Components:
yaml
- Header:
    - Select[center_id]: Filter by center
    - Select[period]: week|month|quarter

- Overview Cards:
    bind_from: response.overview
    - total_branches, total_classes
    - total_students, total_teachers
    - new_enrollments

- Section[By Branch]:
    - Table:
        bind_from: response.by_branch[]
        columns:
          - branch_name
          - active_classes, students, teachers
          - attendance_rate, fill_rate
          - feedback_rating
        row_action: Click → Navigate to branch detail

- Section[KPIs]:
    bind_from: response.kpis
    - Gauge charts:
        - overall_attendance_rate
        - overall_fill_rate
        - average_feedback_rating
        - completion_rate

- Section[Trends]:
    bind_from: response.trends
    - Charts:
        - enrollment: current vs previous
        - attendance: trend over time

- Section[Top Teachers]:
    bind_from: response.top_teachers[]
    - List cards:
        - teacher_name, feedback_rating
        - classes_taught, total_hours

- Section[Pending Approvals]:
    bind_from: response.pending_approvals
    - courses count → Link
    - classes count → Link

10.3 Teacher Dashboard
Route: /dashboards/teacher
 Purpose: Dashboard cho Teacher
 Mapped API: GET /dashboards/teacher
Components:
yaml
- Header:
    - teacher_name, employee_code
    - DatePicker[date]: default today

- Section[Today's Schedule]:
    bind_from: response.today_schedule[]
    - Card for each session:
        - time, class_code, topic
        - resource, students_count
        - status
        - Quick actions:
            - If status=planned: "Điểm danh"
            - If done but not reported: "Báo cáo"

- Section[This Week Summary]:
    bind_from: response.this_week_summary
    - total_sessions, completed, upcoming
    - total_hours, classes

- Section[Pending Tasks]:
    bind_from: response.pending_tasks[]
    - Alert list:
        - type, session/assessment
        - message
        - action button

- Section[My Classes]:
    bind_from: response.my_classes[]
    - Card for each class:
        - class_code, students_count
        - attendance_rate
        - next_session info

- Section[My Requests]:
    bind_from: response.requests
    - pending, approved, rejected counts
    - Link to requests page

10.4 Student Dashboard
Route: /dashboards/student
 Purpose: Dashboard cho Student
 Mapped API: GET /dashboards/student
Components:
yaml
- Header:
    - student_code, name

- Section[Current Classes]:
    bind_from: response.current_classes[]
    - Card for each class:
        - class_code, class_name, teacher
        - Progress bar: completion_percent
        - Attendance stats: rate, present/absent/late
        - Next session info:
            - date, time, topic, resource

- Section[Upcoming Sessions]:
    bind_from: response.upcoming_sessions[]
    - List cards:
        - date, time, class_code
        - topic, teacher, resource

- Section[Recent Scores]:
    bind_from: response.recent_scores[]
    - Card for each assessment:
        - assessment_name, class_code
        - score / max_score, percentage
        - feedback
        - graded_at

- Section[Alerts]:
    bind_from: response.alerts[]
    - Alert cards:
        - type (low_attendance, etc.)
        - message, severity

- Section[My Requests]:
    - pending_requests count
    - Link to requests page

XI. ADVANCED FEATURES
11.1 Global Search Page
Route: /search
 Purpose: Tìm kiếm toàn hệ thống
 Mapped API: GET /search
Components:
yaml
- Search Bar:
    - Input[q]: Search query
      bind_to: query.q
    - Checkbox Group[type]: Filter types
      options: student|teacher|class|course
      bind_to: query.type
    - Button[search]: Trigger search

- Results Panel:
    bind_from: response.results
    - Tabs or Sections:
        - Classes:
            bind_from: results.classes[]
            render: code, name, branch, status
            relevance_score display
        - Courses:
            bind_from: results.courses[]
        - Students:
            bind_from: results.students[]
        - Teachers:
            bind_from: results.teachers[]

- Result item:
    - Click → Navigate to detail page
Flow:
User type query → Debounce → GET /search?q=xxx
Display results grouped by type
Click result → Navigate

11.2 Conflict Detection Tool
Route: /tools/conflict-check
 Purpose: Kiểm tra xung đột lịch
 Mapped API: POST /conflicts/check
Components:
yaml
- Form:
    - Select[type]: session (future: teacher, student)
    - DatePicker[date]
    - TimePicker[start_time, end_time]
    - Multi-select[teacher_ids]: Select teachers
    - Multi-select[resource_ids]: Select resources
    - Input[exclude_session_id]: optional
    - Button[check]: POST /conflicts/check

- Results Panel:
    bind_from: response
    - If has_conflicts:
        - Alert: "Xung đột phát hiện"
        - List[Conflicts]:
            bind_from: response.conflicts[]
            render:
              - type, teacher/resource info
              - conflicting_session_id, class_code
              - time_overlap
        
        - Section[Available Alternatives]:
            - Available teachers
            - Available resources
    - Else:
        - Success message: "Không có xung đột"

11.3 Audit Logs Page
Route: /admin/audit-logs
 Purpose: Xem nhật ký hệ thống
 Mapped API: GET /audit-logs
Components:
yaml
- Filters:
    - Select[entity_type]: class|session|enrollment|user
    - Input[entity_id]
    - Select[action]: create|update|delete|approve|reject
    - Select[user_id]: Who performed
    - DateRange[date_from, date_to]

- Table:
    columns:
      - timestamp
      - entity_type, entity_id
      - action
      - performed_by: user name + role
      - changes: JSON diff display
      - ip_address
    bind_from: response.data[]

- Detail Modal:
    - Click row → Show full changes JSON
    - Before/After comparison

11.4 Notifications Center
Route: /notifications
 Purpose: Trung tâm thông báo
 Mapped API: GET /notifications
Components:
yaml
- Header:
    - Button[mark all read]: POST /notifications/mark-all-read

- Filters:
    - Select[status]: unread|read|all
    - Select[type]: class|session|request|assessment
    - Select[priority]: high|normal|low

- Summary:
    bind_from: response.summary
    - total_unread
    - by_priority breakdown

- List:
    bind_from: response.data[]
    render:
      - Icon based on type
      - title, message
      - priority badge
      - status (unread: bold)
      - created_at
      - Click → Navigate to related page
          data field contains IDs
      - Button[mark read]: PUT /notifications/:id/read

- Pagination

XII. SYSTEM ADMINISTRATION
12.1 User Management Page
Route: /admin/users
 Purpose: Quản lý người dùng
 Mapped API: GET /users
Components:
yaml
- Header:
    - Button[create user]: "Tạo người dùng mới"

- Filters:
    - Select[role]: Filter by role
    - Select[branch_id]
    - Select[status]: active|inactive|pending

- Table:
    columns:
      - email, phone, full_name
      - roles: Badge list
      - branches: Badge list
      - status
      - last_login_at
      - actions:
          - edit: Modal
          - reset password: Confirm → POST /users/:id/reset-password
          - assign role: Modal
          - deactivate: Confirm
    bind_from: response.data[]

- Create/Edit User Modal:
    - Input[email, phone, full_name]
    - Multi-select[role_ids]
    - Multi-select[branch_ids]
    - Select[status]
    - Button[submit]: POST /users or PUT /users/:id

12.2 Role Management Page
Route: /admin/roles
 Purpose: Quản lý vai trò
 Mapped API: GET /roles
Components:
yaml
- Table:
    columns:
      - code, name, description
      - users_count (calculated)
      - actions: view permissions
    bind_from: response.data[]

- Role Detail Modal:
    - Display role info
    - List permissions (if implemented)

12.3 System Settings Page
Route: /admin/settings
 Purpose: Cấu hình hệ thống
 Mapped API: GET/PUT /system/settings
Components:
yaml
- Tabs:
    - Tab[General]:
        - Input[system_name]
        - Select[timezone]
        - Select[date_format]
        - Select[time_format]
    
    - Tab[Attendance]:
        - Input[max_absences_per_course]: number
        - Input[late_arrival_threshold_minutes]: number
        - Input[attendance_lock_hours_after_session]: number
    
    - Tab[Enrollment]:
        - Input[allow_late_join_sessions]: number
        - Toggle[waitlist_enabled]
        - Toggle[auto_enroll_from_waitlist]
    
    - Tab[Requests]:
        - Toggle[student_request_approval_required]
        - Toggle[teacher_request_approval_required]
        - Input[makeup_request_advance_days]: number
    
    - Tab[Notifications]:
        - Toggle[email_enabled]
        - Toggle[sms_enabled]
        - Toggle[push_enabled]

- Actions:
    - Button[save]: PUT /system/settings
    - Button[reset]: Reload from API

bind_from: GET /system/settings
bind_to: PUT /system/settings (changed fields only)

12.4 System Health Page
Route: /admin/health
 Purpose: Giám sát sức khỏe hệ thống
 Mapped API: GET /health
Components:
yaml
- Auto-refresh: every 30 seconds

- Overall Status:
    bind_from: response.status
    - Display: healthy (green) | degraded (yellow) | down (red)
    - version, uptime_seconds

- Services Grid:
    bind_from: response.services
    - For each service (database, storage, cache, email):
        - Card:
            - Service name
            - status: up (green) | down (red)
            - response_time_ms
            - Last checked timestamp

- Chart:
    - Response time trend over time (if historical data available)

XIII. COMMON UI PATTERNS
13.1 Reusable Components
TableWithPagination:
yaml
props:
  - columns: Array of column definitions
  - data: Array from API response.data
  - pagination: From API response.pagination
  - onPageChange: Callback to update query.page
  - rowActions: Array of action buttons per row
  - loading: boolean
FilterPanel:
yaml
props:
  - filters: Array of filter definitions
    - type: select|input|daterange|checkbox
    - name, label, options
  - values: Current filter values
  - onChange: Callback when filter changes
  - onApply: Callback to trigger API call
  - onReset: Clear all filters
Modal/Drawer:
yaml
props:
  - open: boolean
  - onClose: Callback
  - title: string
  - content: React component
  - actions: Array of buttons (cancel, submit, etc.)
StatusBadge:
yaml
props:
  - status: string (draft, active, completed, etc.)
  - colorMap: Object mapping status to colors
render:
  - Badge with appropriate color
ConfirmDialog:
yaml
props:
  - open: boolean
  - title, message
  - onConfirm, onCancel
  - confirmText, cancelText
  - severity: info|warning|danger
ToastNotification:
yaml
props:
  - type: success|error|warning|info
  - message: string
  - duration: auto-dismiss time

13.2 Error Handling Pattern
Global Error Handler:
yaml
- Intercept all API errors
- Check status code:
    - 401: Redirect to login
    - 403: Show permission denied toast
    - 404: Show not found message
    - 400/422: Display validation errors
    - 500: Show generic error toast
Form Validation:
yaml
- Client-side validation before API call
- Display inline errors
- If API returns 400:
    - Parse response.details
    - Map to form fields
    - Display field-specific errors

13.3 Loading States
Page-level Loading:
yaml
- Show skeleton screens or spinner
- While fetching: GET request in progress
Button Loading:
yaml
- Disable button
- Show spinner icon
- While submitting: POST/PUT in progress
Infinite Scroll / Load More:
yaml
- Detect scroll to bottom
- Fetch next page
- Append to existing data

13.4 Empty States
No Data:
yaml
- Display friendly message
- Icon illustration
- Call-to-action button (e.g., "Create first class")
No Search Results:
yaml
- "No results found for '{query}'"
- Suggestions: Clear filters, try different keywords

XIV. MOBILE RESPONSIVENESS
14.1 Responsive Layouts
Desktop (>1024px):
yaml
- Full sidebar navigation
- Multi-column layouts
- Tables with all columns visible
Tablet (768px - 1024px):
yaml
- Collapsible sidebar
- 2-column layouts
- Tables: Hide less important columns
Mobile (<768px):
yaml
- Bottom tab navigation or hamburger menu
- Single column layouts
- Tables → Card list view
- Filters → Drawer/Modal

14.2 Mobile-Specific Components
Bottom Sheet:
yaml
- For filters, actions on mobile
- Swipe to close
Card View Alternative:
yaml
- Replace table with cards on mobile
- Each card shows key info
- Tap to expand or navigate

XV. ACCESSIBILITY
15.1 ARIA Labels
yaml
- All buttons: aria-label
- Form inputs: proper labels + aria-describedby for errors
- Tables: aria-label for actions
- Modals: aria-modal="true"
15.2 Keyboard Navigation
yaml
- Tab order: logical flow
- Enter: Submit forms
- Esc: Close modals
- Arrow keys: Navigate lists
15.3 Color Contrast
yaml
- WCAG AA compliance
- Status colors: Clear differentiation
- Focus indicators: Visible outlines

XVI. INTERNATIONALIZATION (i18n)
16.1 Language Support
yaml
- Current: Vietnamese
- Future: English, Japanese
- All UI strings: Use i18n keys
- Date/time formatting: Locale-aware

XVII. PERFORMANCE OPTIMIZATION
17.1 Data Fetching
yaml
- Use React Query or SWR:
    - Caching
    - Auto-refetch
    - Optimistic updates
- Lazy load components
- Debounce search inputs
17.2 Code Splitting
yaml
- Route-based code splitting
- Lazy load modals/drawers
- Dynamic imports for heavy components

XVIII. NOTES FOR DEVELOPERS
18.1 API Integration
yaml
- Base URL: https://api.ems.example.com/v1
- Auth: Bearer token in Authorization header
- All dates: YYYYMMDD format
- All times: HHMMSS format
- All datetimes: ISO 8601 with UTC
18.2 State Management
yaml
- Global state: User auth, current branch/center
- Component state: Form values, UI toggles
- Server state: API responses (use React Query)
18.3 Routing
yaml
- Use React Router
- Protected routes: Check user role
- Breadcrumb: Auto-generate from route

---

## XIX. CHANGELOG & CRITICAL FIXES ⭐

**Document Version: 2.0 - COMPREHENSIVE ALIGNMENT UPDATE**
**Previous Version**: 1.0 (Generated from API Design v1.0)
**Updated**: 2025-10-19
**Updated By**: Based on Business Context v1.0 alignment analysis
**Maintained by**: EMS Frontend Team

### 19.1 Critical Mismatches Fixed

#### ❌ FIXED: Incorrect Dashboard Role Mapping (Section 1.2)
**Previous (WRONG)**:
```yaml
ACADEMIC_STAFF → /dashboards/center-head  # ❌ Nhầm lẫn nghiêm trọng!
CENTER_HEAD → /dashboards/center-head
```

**Updated (CORRECT)**:
```yaml
ADMIN → /dashboards/admin                    # ✅ Thêm mới
MANAGER → /dashboards/manager
CENTER_HEAD → /dashboards/center-head
SUBJECT_LEADER → /dashboards/subject-leader # ✅ Thêm mới
ACADEMIC_STAFF → /dashboards/academic-staff # ✅ SỬA: Tách riêng dashboard
TEACHER → /dashboards/teacher
STUDENT → /dashboards/student
QA → /dashboards/qa                          # ✅ Thêm mới
```

**Impact**: Academic Staff (Giáo vụ) và Center Head (Trưởng chi nhánh) là hai vai trò HOÀN TOÀN KHÁC BIỆT với trách nhiệm khác nhau:
- **Academic Staff**: Day-to-day operations (tạo lớp, enroll, xử lý requests, assign teachers)
- **Center Head**: Strategic branch management (approve classes, monitor KPIs)

---

### 19.2 NEW MODULES ADDED (⚠️ Previously Missing)

#### ✅ VI-B: STUDENT REQUEST MANAGEMENT (Section 6B.1 - 6B.4)
**Routes**:
- `/requests/students` - Academic Staff xử lý requests
- `/students/:id/requests/new` - Student tạo request
- `/students/:id/requests` - Student xem status

**Request Types** (theo Business Context 3.5):
1. **Absence Request**: Báo nghỉ có phép
2. **Make-up Request**: Học bù (complex flow - same `course_session_id`)
3. **Transfer Request**: Chuyển lớp (most complex - content mapping validation)

**Missing APIs** (⚠️ Backend cần implement):
- `GET /student-requests`
- `POST /student-requests/:id/approve`
- `POST /student-requests/:id/reject`
- `GET /student-requests/makeup/available-sessions`
- `POST /student-requests/:id/validate-transfer`

---

#### ✅ VI-C: TEACHER REQUEST MANAGEMENT (Section 6C.1 - 6C.4)
**Routes**:
- `/requests/teachers` - Academic Staff xử lý requests
- `/teachers/:id/requests/new` - Teacher tạo request
- `/teachers/:id/availability/overrides` - OT registration

**Request Types** (theo Business Context 3.6):
1. **Leave Request**: Nghỉ phép (⭐ CRITICAL - requires immediate solution)
2. **OT Registration**: Đăng ký giờ tăng ca
3. **Reschedule Request**: Đổi lịch dạy
4. **Swap Request**: Hoán đổi buổi (future feature)

**Key Business Rule**: Leave request chỉ được approve KHI ĐÃ CÓ giải pháp:
- Option A: Find substitute teacher (ưu tiên OT registered)
- Option B: Reschedule session
- Option C: Cancel session (last resort)

**Missing APIs** (⚠️ Backend cần implement):
- `GET /teacher-requests`
- `GET /teacher-requests/:id/substitute-teachers` (⭐ CRITICAL)
- `POST /teacher-requests/:id/approve` (with resolution)
- `POST /teachers/:id/availability/overrides` (OT registration)

---

#### ✅ ATTENDANCE LOCK FUNCTIONALITY (Section 5.2 - Updated)
**Business Rule** (từ Business Context 4.7):
- Attendance tự động lock sau **T hours** (configurable) kể từ session.end_time
- Chỉ ADMIN/MANAGER có thể unlock (with audit trail)

**UI Updates**:
- ⏱️ Countdown timer: "Khóa sau: 3h 45m"
- 🔒 Lock badge và timestamp khi đã lock
- Disable tất cả inputs khi locked
- Warning banner khi sắp lock

**Missing API Fields**:
- `is_locked`: boolean (in session response)
- `locked_at`: timestamp
- `POST /sessions/:id/attendance/unlock` (ADMIN/MANAGER only)

---

#### ✅ PLO ↔ CLO ↔ SESSION MAPPING (Section 3.4 - New Tab)
**Purpose**: Curriculum integrity for accreditation (theo Business Context 3.1)

**Features**:
- Interactive tree view: PLO → CLO → Sessions
- Drag-and-drop mapping interface
- Visual coverage indicators
- Export mapping report

**Existing API Support**:
- `GET /subjects/:id/plos`
- `GET /courses/:id/clos`
- `GET /plos/:id/clos` (mapping PLO-CLO)
- `GET /course-sessions/:id/clos` (mapping CLO-Session)

---

### 19.3 NEW DASHBOARDS ADDED

#### ✅ 10.0: Admin Dashboard (`/dashboards/admin`)
**Purpose**: System-wide monitoring and administration
**Key Sections**:
- System health & activity monitoring
- User management overview
- Data statistics
- Critical alerts

**Missing API**: `GET /dashboards/admin`

---

#### ✅ 10.0B: Academic Staff Dashboard (`/dashboards/academic-staff`)
**Purpose**: Day-to-day operational dashboard
**Key Sections**:
- ⭐ **Urgent Actions**: Teacher leave requests, student transfers, conflicts
- My Classes management
- Today's Schedule
- Request Queue (student + teacher)
- Pending Approvals

**Missing API**: `GET /dashboards/academic-staff`

**Impact**: Đây là dashboard QUAN TRỌNG NHẤT cho vai trò Academic Staff (Giáo vụ) - người xử lý hàng ngày!

---

#### ✅ 10.0C: Subject Leader Dashboard (`/dashboards/subject-leader`)
**Purpose**: Curriculum design and management
**Key Sections**:
- My Courses (draft/submitted/approved/in-use)
- PLO/CLO Management
- Course Usage Analytics
- Feedback on My Courses

**Missing API**: `GET /dashboards/subject-leader`

---

#### ✅ 10.0D: QA Dashboard (`/dashboards/qa`)
**Purpose**: Quality monitoring and reporting
**Key Sections**:
- Quality Alerts (low attendance, low ratings, CLO non-attainment)
- My QA Reports
- Student Feedback Analysis
- Attendance & CLO Monitoring

**Missing API**: `GET /dashboards/qa`

---

### 19.4 Course Approval Flow Corrections (Section 3.4)

**Previous (AMBIGUOUS)**:
```yaml
- Button[approve]: "Phê duyệt" (MANAGER, CENTER_HEAD)  # ❌ SAI!
```

**Updated (CORRECT - per Business Context 2.2)**:
```yaml
- Button[submit]: "Gửi duyệt" (SUBJECT_LEADER only)
- Button[approve]: "Phê duyệt" (MANAGER only - strategic approval)
- Button[reject]: "Từ chối" (MANAGER only)
```

**Rationale**: Theo Business Context:
- **Course Approval = STRATEGIC DECISION** → Only MANAGER approves (system-wide standardization)
- **Class Approval = OPERATIONAL DECISION** → CENTER_HEAD (branch) OR MANAGER (cross-branch)

---

### 19.5 Missing API Endpoints Summary

**⚠️ Backend Team: These endpoints MUST be implemented**

#### Student Request APIs:
```
GET    /student-requests
POST   /student-requests/:id/approve
POST   /student-requests/:id/reject
GET    /student-requests/makeup/available-sessions
POST   /student-requests/:id/validate-transfer
```

#### Teacher Request APIs:
```
GET    /teacher-requests
GET    /teacher-requests/:id/substitute-teachers  ⭐ CRITICAL
POST   /teacher-requests/:id/approve
POST   /teachers/:id/availability/overrides
```

#### Dashboard APIs:
```
GET    /dashboards/admin
GET    /dashboards/academic-staff  ⭐ CRITICAL
GET    /dashboards/subject-leader
GET    /dashboards/qa
```

#### Attendance Lock APIs:
```
POST   /sessions/:id/attendance/unlock
```
(Plus add `is_locked`, `locked_at` fields to session response)

---

### 19.6 Data Model Additions Needed

**student_requests table** (missing):
```sql
- id, student_id, request_type (absence|makeup|transfer)
- target_session_id, makeup_session_id, target_class_id
- effective_date, status, submitted_at, decided_at
- decided_by, resolution, note
```

**teacher_requests table** (missing):
```sql
- id, teacher_id, session_id, request_type (leave|ot|reschedule|swap)
- status, submitted_at, decided_at, decided_by
- resolution (substitute|reschedule|cancel)
- substitute_teacher_id, new_date, new_time, note
```

**teacher_availability_override** (for OT - may exist):
```sql
- id, teacher_id, date, start_time, end_time
- is_available (true for OT registration)
- reason, created_at
```

---

### 19.7 UI/UX Consistency Rules (Updated)

1. **Role-based rendering**:
   - Always check `user.roles[]` before showing action buttons
   - Hide/disable features not available to user's role

2. **Request workflows**:
   - All requests follow: submit → pending → approve/reject flow
   - Show status badges: pending (yellow), approved (green), rejected (red)
   - Urgent requests (leave): red badge

3. **Conflict detection**:
   - Show conflicts prominently (red badges, alerts)
   - Provide suggested alternatives
   - Block submission if critical conflicts exist

4. **Attendance lock**:
   - Always show lock status and countdown
   - Disable inputs when locked (unless ADMIN/MANAGER)
   - Audit trail for unlocks

5. **Dashboard cards**:
   - Use consistent KPI card format
   - Color-code alerts: red (critical), yellow (warning), green (OK)
   - Link to detail pages

---

### 19.8 Testing Checklist for Frontend Team

**Role-based Access**:
- [ ] ADMIN can access `/dashboards/admin`
- [ ] ACADEMIC_STAFF navigates to `/dashboards/academic-staff` (NOT center-head)
- [ ] SUBJECT_LEADER can submit courses, but only MANAGER can approve
- [ ] CENTER_HEAD can approve classes (branch), MANAGER can approve (cross-branch)

**Student Requests**:
- [ ] Student can create absence/makeup/transfer requests
- [ ] Academic Staff sees pending requests in dashboard
- [ ] Makeup flow shows only sessions with same `course_session_id`
- [ ] Transfer validation shows content gaps

**Teacher Requests**:
- [ ] Teacher can create leave/reschedule requests
- [ ] Academic Staff must choose solution (substitute/reschedule/cancel) before approving leave
- [ ] Substitute search prioritizes OT-registered teachers
- [ ] OT registration creates availability override

**Attendance Lock**:
- [ ] Countdown shows correct time remaining
- [ ] Inputs disabled after lock time
- [ ] Only ADMIN/MANAGER can unlock
- [ ] Unlock creates audit log

**PLO/CLO Mapping**:
- [ ] Mapping editor shows tree view PLO → CLO → Sessions
- [ ] Can export mapping report
- [ ] Course shows mapping completion %

---

### 19.9 Notes for Claude Code

When implementing features from this document:

1. **Always check Business Context first** (`docs/business-context.md`) for:
   - User role definitions and authority
   - Business rules and workflows
   - Approval flows
   - Data relationships

2. **Role-based UI rendering**:
   ```tsx
   const userRoles = user.roles; // ['ACADEMIC_STAFF']

   // ✅ CORRECT
   {userRoles.includes('ACADEMIC_STAFF') && <Link to="/dashboards/academic-staff">Dashboard</Link>}

   // ❌ WRONG (previous version)
   {userRoles.includes('ACADEMIC_STAFF') && <Link to="/dashboards/center-head">Dashboard</Link>}
   ```

3. **Request handling patterns**:
   - Student/Teacher request lists: Always filter by `status=pending` in urgent tab
   - Request approval: Validate before approve (capacity, conflicts, content gaps)
   - Leave requests: Must have resolution before approval

4. **Attendance lock logic**:
   ```tsx
   const lockTime = session.end_time + system_config.attendance_lock_hours;
   const isLocked = now() > lockTime;
   const countdown = lockTime - now(); // Show in UI
   ```

5. **API integration**:
   - Check `⚠️ MISSING in API` comments - may need mock data for development
   - Coordinate with backend team for new endpoints
   - Follow API response format from `api-design.md`

---

**Document Version: 2.0**
**Generated From**: API Design Document v1.0 + Business Context v1.0
**Last Updated**: 2025-10-19
**Major Updates**:
- Fixed dashboard role mappings (Academic Staff ≠ Center Head)
- Added Student Request Management module
- Added Teacher Request Management module
- Added Attendance Lock functionality
- Added PLO↔CLO↔Session mapping
- Added 4 new dashboards (Admin, Academic Staff, Subject Leader, QA)
- Corrected course approval flow (MANAGER only)
- Documented 15+ missing API endpoints

**Maintained by**: EMS Frontend Team

