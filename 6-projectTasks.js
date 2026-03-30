const maxLetters = 30;
const calendarToggle = document.querySelector('#calendarToggle');
const calendar = document.querySelector('.calendar'); 
const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const createTask = document.querySelectorAll('.createTask');
const taskArea = document.querySelector('.taskArea');

function generateTasks(tasks, userRole, projectID){
    const containerHTY = document.querySelector('#taskPanelHTY .taskList');
    const containerOTW = document.querySelector('#taskPanelOTW .taskList');
    const containerSTL = document.querySelector('#taskPanelSTL .taskList');
    const panelHTY = document.querySelector('#taskPanelHTY');
    const panelOTW = document.querySelector('#taskPanelOTW');
    const panelSTL = document.querySelector('#taskPanelSTL');

    containerHTY.innerHTML = '';
    containerOTW.innerHTML = '';
    containerSTL.innerHTML = '';

    const HTYtasks = tasks
        .filter(task => task.Status === 'HTY')
        .sort((a, b) => b.Priority - a.Priority);
    const OTWtasks = tasks
        .filter(task => task.Status === 'OTW')
        .sort((a, b) => b.Priority - a.Priority);
    const STLtasks = tasks
        .filter(task => task.Status === 'DONE')
        .sort((a, b) => b.Priority - a.Priority);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const daySuffix = n => {
        if(n >= 11 && n <= 13) return 'th';
        switch(n%10){
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const todayD = new Date();

    function formatDate(date){
        const d = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        return `${d}<sup>${daySuffix(d)}</sup> ${months[month]} ${year}`
    }

    function createTaskEl(task){
        const taskEl = document.createElement('a');
        taskEl.classList.add('task');

        const taskTitle = document.createElement('div');
        taskTitle.classList.add('taskTitle');

        const taskName = document.createElement('h4');
        taskName.innerHTML = `${task.TaskTitle}`;

        const priorityValue = parseInt(task.Priority);
        const priority = document.createElement('div');
        priority.classList.add('priority');

        for(let i = 1; i <= priorityValue; i++){
            const fireIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            fireIcon.setAttribute('class', 'fireIcon');
            fireIcon.setAttribute('viewBox', '0 0 21 26');
            fireIcon.setAttribute('fill', 'none');
            fireIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

            fireIcon.innerHTML = `
                <path d="M4.60735 12.1165C-2.33266 18.7917 3.6548 23.4868 7.51603 25C5.42387 22.5789 6.44435 21.4117 7.82215 20.2011C8.92438 19.2327 9.4721 16.6272 9.60818 15.4455C15.446 19.7342 14.2859 23.6021 12.9761 25C18.6404 23.141 22.0083 17.0883 16.3951 12.6786C11.5983 8.91022 11.2411 5.97744 11.2411 2C5.72994 6.18496 6.12117 12.0445 7.00568 14.4511C5.41356 14.209 4.74341 12.7939 4.60735 12.1165Z"/>
            `;

            priority.appendChild(fireIcon);
        }

        taskTitle.appendChild(taskName);
        taskTitle.appendChild(priority);

        const desc = document.createElement('div');
        desc.classList.add('description');

        const assignee = task.AssignedUserID
            ? members.find(member => member.UserID === task.AssignedUserID)?.FullName || 'No Assignee' 
            : 'No Assignee'
        ;
        
        desc.innerHTML = `
            <p class="projectName">${assignee}</p>
            <p class="dueDate">${formatDate(task.DueDate)}</p>
        `;
        
        taskEl.appendChild(taskTitle);
        taskEl.appendChild(desc);

        

        let startX, startY, initialLeft, initialTop;
        let isDragging = false;

        function mouseDown(e) {
            isDragging = false;
            
            originalParent = taskEl.parentElement;
            originalStyles = {
                position: taskEl.style.position,
                left: taskEl.style.left,
                top: taskEl.style.top,
                zIndex: taskEl.style.zIndex,
                width: taskEl.style.width
            };
            
            const rect = taskEl.getBoundingClientRect();
            
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = rect.left;
            initialTop = rect.top;
            
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        }

        function mouseMove(e){  
            console.log('mouse moving');  
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
                isDragging = true;
            }
            
            if(!isDragging) return;
            const rect = taskEl.getBoundingClientRect();
            taskEl.style.position = 'absolute';
            taskEl.style.left = rect.left + 'px';
            taskEl.style.top = rect.top + 'px';
            taskEl.style.zIndex = '9999';
            taskEl.style.width = rect.width + 'px';
            taskEl.style.cursor = 'grabbing';
            
            document.body.appendChild(taskEl);

            taskEl.style.left = (initialLeft + deltaX) + 'px';
            taskEl.style.top = (initialTop + deltaY) + 'px';

            const rectHTY = panelHTY.getBoundingClientRect();
            const rectOTW = panelOTW.getBoundingClientRect();
            const rectSTL = panelSTL.getBoundingClientRect();

            if(
                e.clientX > rectHTY.left && 
                e.clientX < rectHTY.right && 
                e.clientY > rectHTY.top && 
                e.clientY < rectHTY.bottom 
            ){
                panelHTY.style.transform = 'scale(0.95)';
                panelOTW.style.transform = 'scale(1)';
                panelSTL.style.transform = 'scale(1)';
            }else if(
                e.clientX > rectOTW.left && 
                e.clientX < rectOTW.right && 
                e.clientY > rectOTW.top && 
                e.clientY < rectOTW.bottom 
            ){
                panelHTY.style.transform = 'scale(1)';
                panelOTW.style.transform = 'scale(0.95)';
                panelSTL.style.transform = 'scale(1)';
            }else if(
                e.clientX > rectSTL.left && 
                e.clientX < rectSTL.right && 
                e.clientY > rectSTL.top && 
                e.clientY < rectSTL.bottom 
            ){
                panelHTY.style.transform = 'scale(1)';
                panelOTW.style.transform = 'scale(1)';
                panelSTL.style.transform = 'scale(0.95)';
            }else{
                panelHTY.style.transform = 'scale(1)';
                panelOTW.style.transform = 'scale(1)';
                panelSTL.style.transform = 'scale(1)';
            }
        }

        function mouseUp(e) {

            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);

            if(!isDragging){
                triggerTaskDetail(task, projectID);
                originalParent.appendChild(taskEl);
                isDragging = false;
                return;
            }
            console.log('dragged');
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            
            taskEl.style.position = originalStyles.position;
            taskEl.style.left = originalStyles.left;
            taskEl.style.top = originalStyles.top;
            taskEl.style.zIndex = originalStyles.zIndex;
            taskEl.style.width = originalStyles.width;
            taskEl.style.cursor = 'grab';

            panelHTY.style.transform = 'scale(1)';
            panelOTW.style.transform = 'scale(1)';
            panelSTL.style.transform = 'scale(1)';
            
            const rectHTY = panelHTY.getBoundingClientRect();
            const rectOTW = panelOTW.getBoundingClientRect();
            const rectSTL = panelSTL.getBoundingClientRect();
            
            if(isDragging){
                if(
                    e.clientX > rectHTY.left && 
                    e.clientX < rectHTY.right && 
                    e.clientY > rectHTY.top && 
                    e.clientY < rectHTY.bottom 
                ){
                    containerHTY.appendChild(taskEl);
                    task.Status = 'HTY';

                    const idx = tasks.findIndex(t => t.TaskID === task.TaskID);
                    if (idx !== -1) {
                        tasks[idx].Status = 'HTY';
                    };
                    
                    updateTask(tasks[idx]); 
                    generateTasks(tasks, userRole, projectID);
                }else if(
                    e.clientX > rectOTW.left && 
                    e.clientX < rectOTW.right && 
                    e.clientY > rectOTW.top && 
                    e.clientY < rectOTW.bottom 
                ){
                    containerOTW.appendChild(taskEl);
                    task.Status = 'OTW'; 

                    const idx = tasks.findIndex(t => t.TaskID === task.TaskID);
                    console.log(idx);
                    if (idx !== -1) {
                        tasks[idx].Status = 'OTW';
                    };

                    updateTask(tasks[idx]);
                    generateTasks(tasks, userRole, projectID);
                }else if(
                    e.clientX > rectSTL.left && 
                    e.clientX < rectSTL.right && 
                    e.clientY > rectSTL.top && 
                    e.clientY < rectSTL.bottom 
                ){
                    containerSTL.appendChild(taskEl);
                    task.Status = 'DONE'; 
                    
                    const idx = tasks.findIndex(t => t.TaskID === task.TaskID);
                    if (idx !== -1) {
                        tasks[idx].Status = 'DONE';
                    };

                    updateTask(tasks[idx]);
                    generateTasks(tasks, userRole, projectID);
                }else {
                    originalParent.appendChild(taskEl);
                }
            }

            isDragging = false;
        }

        if(loggedInUserID === task.AssignedUserID){
            taskEl.addEventListener('mouseenter', () => {
                taskEl.style.cursor = 'grab';
            });
            taskEl.addEventListener('mousedown', mouseDown);
        }else{
            taskEl.addEventListener('click', () => triggerTaskDetail(task, projectID));
        }
        return taskEl;
    }

    const createNewTaskBtn = document.createElement('div');
    createNewTaskBtn.classList.add('createTask');
    createNewTaskBtn.innerHTML = `
        <div class="state1">
            <h4>Create</h4>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </div>
        <div class="state2 hide">
            <form action="">
                <div class="inputWrapper">
                    <input type="text" name="taskTitle" id="taskTitle" placeholder="Do what first oh?" maxlength="30">
                    </input>
                    <p class="remainingLetters">30</p>
                </div>
                <div class="errorMessage"></div>
                <div class="inputFooter">
                    <div class="selectDueDate" id="calendarToggle">
                        <svg class="calanderIcon" viewBox="0 0 167 208" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M39.8528 51.9736V13.1089C39.8528 9.46534 45.6668 4 53.661 4C61.6553 4 66.7426 9.46534 66.7426 13.1089V51.9736C66.7426 55.6171 63.1088 60.4752 53.661 60.4752C44.2133 60.4752 39.8528 55.6171 39.8528 51.9736Z"/>
                            <path d="M99.6079 51.9736V13.1089C99.6079 9.46534 105.422 4 113.416 4C121.41 4 126.498 9.46534 126.498 13.1089V51.9736C126.498 55.6171 122.864 60.4752 113.416 60.4752C103.968 60.4752 99.6079 55.6171 99.6079 51.9736Z"/>
                            <path d="M4 61.3864C4 115.172 4 163.253 4 176.292M4 61.3864C4 53.1383 5.48277 45.3526 9.5767 39.8773M4 61.3864L4 101M4 176.292C4 179.959 4.5288 183.377 5.49296 186.475C6.33787 189.189 7.51711 191.656 8.96779 193.826M4 176.292L4 101M27.1408 204C39.831 204 130.155 204 140.606 204M27.1408 204C20.6714 204 14.7839 201.035 10.5665 195.968M27.1408 204H140.606M140.606 204C145.953 204 151.691 201.013 156.02 195.912M163 176.292C163 184.154 160.221 190.878 156.171 195.733C156.121 195.794 156.071 195.853 156.02 195.912M163 176.292C163 184.251 160.152 191.044 156.02 195.912M163 176.292C163 170.354 162.798 126.93 162.604 101M140.606 32.0488C127.169 32.0488 42.0704 32.0488 27.1408 32.0488M140.606 32.0488C147.148 32.0488 152.451 34.367 156.171 39.0032M140.606 32.0488H27.1408M140.606 32.0488C147.198 32.0488 152.533 34.403 156.257 39.1115M27.1408 32.0488C19.3944 32.0488 14.0205 34.6389 10.4157 38.8309M156.171 39.0032C156.2 39.039 156.229 39.0751 156.257 39.1115M156.171 39.0032C155.797 38.5418 155.373 38.1375 154.905 37.7842M10.3734 38.8803C10.0848 39.1929 9.81989 39.5257 9.5767 39.8773M10.3734 38.8803C10.3874 38.8638 10.4016 38.8474 10.4157 38.8309M10.3734 38.8803L10.4157 38.8309M9.5767 39.8773C9.84504 39.5184 10.1246 39.1694 10.4157 38.8309M156.257 39.1115C160.123 43.9994 162.254 51.4244 162.254 61.3864C162.254 70.7654 162.425 77.1093 162.604 101M10.5665 195.968C10.501 195.891 10.4366 195.813 10.3734 195.733C9.88069 195.126 9.41148 194.49 8.96779 193.826M10.5665 195.968C10.0029 195.291 9.46912 194.577 8.96779 193.826M4 101H162.604M114 101V204M56 101V204M4 154.5H162.876"/>
                        </svg>
                        <p class="selectedDueDate">Due Date</p>
                    </div>
                    <button class="confirmBtn"></button>
                </div>
            </form>
        </div>
    `

    const state1 = createNewTaskBtn.querySelector('.state1');
    const state2 = createNewTaskBtn.querySelector('.state2');
    const taskInput = state2.querySelector('input');
    const remainingLabel = createNewTaskBtn.querySelector('.remainingLetters');
    const selectedDate = createNewTaskBtn.querySelector('.selectedDueDate');
    const errorMessage = createNewTaskBtn.querySelector('.errorMessage');
    const confirmBtn = createNewTaskBtn.querySelector('.confirmBtn');

    taskInput.addEventListener('input', () => {
        const lettersOnly = taskInput.value.replace(/[^a-zA-Z0-9]/g, '');
        const remainingLetters = maxLetters - lettersOnly.length;
        remainingLabel.textContent = `${remainingLetters}`;
    });
    
    state1.addEventListener('click', () => {
        state1.classList.toggle('hide');
        state2.classList.toggle('hide');
        createNewTaskBtn.classList.toggle('active');

        taskInput.focus();
    });

    selectedDate.addEventListener('click', (e) => {
        e.stopPropagation();

        const rect = selectedDate.getBoundingClientRect();
        calendar.style.top = `${rect.bottom + window.scrollY}px`;
        calendar.style.left = `${rect.left + window.scrollX}px`;
        updateCalendar();
        calendar.classList.add('show');
    });

    let currentDate = new Date();
    let selected = null;

    const updateCalendar = () =>{
        const todayD = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const totalDays = lastDay.getDate();
        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDay();

        const monthYearString = currentDate.toLocaleString('default', {month: 'long', year: 'numeric'});
        monthYearElement.textContent = monthYearString;

        let datesHTML = '';
        
        for(let i = firstDayIndex; i > 0; i--){
            const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
            datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
        }

        for(let i = 1; i <= totalDays; i++){
            const date = new Date(currentYear, currentMonth, i);
            let activeClass = '';
            if(selected) {
                activeClass = date.toDateString() === selected.toDateString() ? 'active' : '';
            }else activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
            datesHTML += `<div class="date ${activeClass}">${i}</div>`;
        }

        for(let i = 1; i < 7 - lastDayIndex; i++){
            const nextDate = new Date(currentYear, currentMonth + 1, i);
            datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
        }

        datesElement.innerHTML = datesHTML;

        const allDates = document.querySelectorAll('.date');
        allDates.forEach(dateEl => {
            dateEl.addEventListener('click', () => {
                if (!dateEl.classList.contains('inactive')) {
                    allDates.forEach(d => d.classList.remove('active'));
                    dateEl.classList.add('active');

                    const day = parseInt(dateEl.textContent, 10);
                    const month = currentDate.getMonth() + 1;
                    const year = currentDate.getFullYear();
                    const selectedDateInput = new Date(year, currentDate.getMonth(), day)

                    const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

                    selectedDate.textContent = formattedDate;
                    if(selectedDateInput < todayD) selectedDate.style.color = 'var(--overdue-color)';
                    else selectedDate.style.color = 'rgba(var(--secondary-color), 1)'

                    calendar.classList.remove('show');
                    selected = selectedDateInput;
                }
            });
        });
    };

    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    confirmBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        if(taskInput.value.trim() === ''){
            errorMessage.textContent = '*Task name cannot be empty!*';
            errorMessage.style.display = 'block';
        }
        else if (selectedDate.textContent === 'Due Date'){
            errorMessage.textContent = '*Please select a due date*';
            errorMessage.style.display = 'block';
        }
        else{
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';

            let startDate = new Date();
            if(selected - 24 * 60 * 60 * 1000 < new Date()){
                startDate.setDate(selected.getDate() - 1);
            }
            
            const newTask = {
                ParentTaskID: null,
                ProjectID: projectID,
                AssignedUserID: null,
                TaskTitle: `${taskInput.value.trim()}`,
                Description: '',
                Priority: 0,
                Status: 'HTY',
                StartDate: startDate,
                DueDate: selected
            }

            console.log(newTask);
            await fetch('add_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok') {
                    console.log('✅ Task added:', data.message);

                    tasks.push(newTask);
                    const successfulMessage = document.createElement('div');
                    successfulMessage.classList.add('successfulMessage');
                    successfulMessage.innerHTML = `Successfully created Task: "${taskInput.value.trim()}"`;
                    messageContainer.appendChild(successfulMessage);
                    successfulMessage.classList.add('active');
                    setTimeout(() => {
                        messageContainer.removeChild(successfulMessage);
                    }, 5000);

                    generateTasks(tasks, userRole, projectID);

                    state1.classList.toggle('hide');
                    state2.classList.toggle('hide');
                    createNewTaskBtn.classList.toggle('active');

                    errorMessage.textContent = '';
                    errorMessage.style.display = 'none';

                    taskInput.value = '';
                    remainingLabel.textContent = `${maxLetters}`;

                    selectedDate.textContent = 'Due Date';

                    currentDate = new Date();
                    updateCalendar();
                    selected = null;
                } else {
                    console.error('❌ Add task failed:', data.message);
                }
            })
            .catch(err => console.error('❌ Error:', err));
        }
    });

    document.addEventListener('click', (event) => {
        if(!state2.classList.contains('hide') && 
        !state2.contains(event.target) && 
        !state1.contains(event.target) && 
        !calendar.contains(event.target)
        ){
            state1.classList.toggle('hide');
            state2.classList.toggle('hide');
            createNewTaskBtn.classList.toggle('active');

            errorMessage.textContent = '';
            errorMessage.style.display = 'none';

            taskInput.value = '';
            remainingLabel.textContent = `${maxLetters}`;

            selectedDate.textContent = 'Due Date';
            selectedDate.style.color = `rgba(var(--secondary-color), 1)`;

            currentDate = new Date();
            updateCalendar();
            selected = null
        }

        if (!calendar.contains(event.target) && !selectedDate.contains(event.target)) {
            calendar.classList.remove('show');
        }
    });

    if(userRole !== 'Team Member') {
        containerHTY.appendChild(createNewTaskBtn);
    };

    if(HTYtasks.length === 0){
        const nothingHere = document.createElement('div');
        nothingHere.classList.add('nothingHere');
        nothingHere.textContent = 'No tasks waiting to be started. Assign someone to begin!'
        containerHTY.appendChild(nothingHere);
    }else{
        HTYtasks.forEach(task => {
            const taskEl = createTaskEl(task);
            if(task.DueDate < todayD){
                taskEl.style.backgroundColor = `var(--overdue-color)`;
            }else{
                taskEl.style.backgroundColor = `var(--unassigned-color-code)`;
            }
            containerHTY.appendChild(taskEl)
        });
    }

    if(OTWtasks.length === 0){
        containerOTW.innerHTML = `
            <div class="nothingHere">
                Nothing in progress yet. Time to get moving lah!
            </div>
        `;
    }else{
        OTWtasks.forEach(task => {
            const taskEl = createTaskEl(task);
            if(task.DueDate < todayD){
                taskEl.style.backgroundColor = `var(--overdue-color)`;
            }else{
                taskEl.style.backgroundColor = `var(--in-progress-color)`;
            }
            containerOTW.appendChild(taskEl)
        });
    }

    if(STLtasks.length === 0){
        containerSTL.innerHTML = `
            <div class="nothingHere">
                No completed tasks yet — let’s make some progress!
            </div>
        `;
    }else{
        STLtasks.forEach(task => {
            const taskEl = createTaskEl(task);
            taskEl.style.backgroundColor = `var(--done-color)`;
            containerSTL.appendChild(taskEl)
        });
    }
}

let tasks = [];
let members = [];
let users = [];
let comments = [];
let taskAttachments = [];
let commentAttachments = [];
let loggedInUserRole = 'Team Member';
let loggedInUserID = null;

async function fetchProjectData() {
    try {
        const res = await fetch('get_project_data.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ProjectID: project.ProjectID })
        });

        const data = await res.json();

        if (data.status === 'ok') {
            tasks = data.tasks.map(t => ({
                ...t,
                StartDate: t.StartDate ? new Date(t.StartDate) : null,
                DueDate: t.DueDate ? new Date(t.DueDate) : null
            }));

            members = data.members;
            users = data.allUsers;
            comments = data.comments;
            taskAttachments = data.taskAttachments;
            commentAttachments = data.commentAttachments;

            const filteredActiveMember = members.filter(m => m.Status === 'Active');

            loggedInUserRole = members.find(m => m.UserID === currentUserID);
            loggedInUserID = loggedInUserRole.UserID;

            generateTasks(tasks, loggedInUserRole.Role, project.ProjectID);
            generateProjectAvatar(filteredActiveMember);
        } else {
            console.error('❌ Error:', data.message);
        }
    } catch (err) {
        console.error('❌ Failed to fetch project summary:', err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchProjectData();

    if(selectedTaskID){
        console.log(selectedTaskID);
        const selectedTask = tasks.find(t => t.TaskID === selectedTaskID);
        console.log(selectedTask);
        triggerTaskDetail(selectedTask, project.ProjectID);
    }
});