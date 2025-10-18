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
- STUDENT → /dashboards/student
- TEACHER → /dashboards/teacher  
- ACADEMIC_STAFF → /dashboards/center-head
- MANAGER → /dashboards/manager
- CENTER_HEAD → /dashboards/center-head

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
        - Button[	]: (SUBJECT_LEADER)
        - Button[submit]: "Gửi duyệt" → POST /courses/:id/submit
        - Button[approve]: "Phê duyệt" (MANAGER, CENTER_HEAD)

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
        - Table:
            bind_from: response.clos[]
            columns:
              - code, description
              - mapped_plos, mapped_sessions_count
              - actions: edit, delete, map to PLO
    
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

- List[Students]:
    bind_from: GET /sessions/:id/attendance response.students[]
    render for each student:
      - Avatar
      - student_code, student_name
      - is_makeup badge
      - Radio Group / Button Group[attendance_status]:
          options: present|absent|late|excused
          bind_to: attendances[].attendance_status
      - Textarea[note]: optional
          bind_to: attendances[].note

- Summary Panel (sticky):
    - Present: count
    - Absent: count
    - Late: count
    - Excused: count

- Actions:
    - Button[mark all present]: Quick action
    - Button[save]: POST /sessions/:id/attendance
    - Button[submit & finish]: POST attendance + POST session report
Flow:
Teacher load page → GET attendance list
Mark each student → Auto-save or manual save
Click "Lưu" → POST /sessions/:id/attendance
After attendance → Navigate to session report form

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

Document Version: 1.0
Generated From: API Design Document v1.0
Last Updated: 2025-10-16
Maintained by: EMS Frontend Team

