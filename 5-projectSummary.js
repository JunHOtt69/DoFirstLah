function formatTime(HH, MM){
    HH = Math.floor(HH) % 24;
    if(HH < 0) HH += 24;
    MM = Math.round(MM) % 60;
    if(MM < 0) MM += 60;

    const isAM = HH < 12;
    let displayHour = HH % 12;
    if(displayHour === 0) displayHour = 12;

    return `${String(displayHour).padStart(2, '0')}:${String(MM).padStart(2, '0')} ${isAM ? 'a.m.' : 'p.m.'}`;
}

function formatDuration(start, end){
    let diffMs = end - start;

    const diffSec = Math.floor(diffMs / 1000);
    const days = Math.floor(diffSec / (3600 * 24));
    const hours = Math.floor((diffSec % (3600 * 24)) / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);

    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (parts.length === 0) parts.push('0m');

    return parts.join(' ');
}

const daySuffix = n => {
    if(n >= 11 && n <= 13) return 'th';
    switch(n%10){
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function updatePieChart(tasks){
    const currentTime = new Date();
    const pieChart = document.querySelector('.pieChart');
    const totalTask = document.querySelector('.totalTask h1');
    const doneValue = document.querySelector('.doneLabel #value');
    const unassignedValue = document.querySelector('.unassignedLabel #value');
    const inProgressValue = document.querySelector('.workingLabel #value');
    const overdueValue = document.querySelector('.overdueLabel #value');

    let done = 0;
    let unassigned = 0;
    let inProgress = 0;
    let overdue = 0;
    totalTask.innerHTML = ``;

    tasks.forEach(task => {
        if(task.DueDate < currentTime) overdue += 1;
        else if(task.Status === 'HTY') unassigned += 1;
        else if(task.Status === 'OTW') inProgress += 1;
        else if(task.Status === 'DONE') done += 1;
    })

    const total = done + unassigned + inProgress + overdue;

    if(total === 0){
        totalTask.innerHTML = `${total}`;
        doneValue.innerHTML = `${done}`;
        unassignedValue.innerHTML = `${unassigned}`;
        inProgressValue.innerHTML = `${inProgress}`;
        overdueValue.innerHTML = `${overdue}`;
        return;
    };

    const doneColor = getComputedStyle(root).getPropertyValue('--done-color').trim();
    const unassingedColor = getComputedStyle(root).getPropertyValue('--unassigned-color-code').trim();
    const inProgressColor = getComputedStyle(root).getPropertyValue('--in-progress-color').trim();
    const overdueColor = getComputedStyle(root).getPropertyValue('--overdue-color').trim();
    
    const doneDeg = (done / total ) * 360;
    const unassignedDeg = (unassigned / total ) * 360;
    const inProgressDeg = (inProgress / total ) * 360;
    const overdueDeg = (overdue / total ) * 360;

    const stop1 = doneDeg;
    const stop2 = stop1 + unassignedDeg;
    const stop3 = stop2 + inProgressDeg;

    const gradient = `conic-gradient(
        ${doneColor} 0deg ${stop1}deg,
        ${unassingedColor} ${stop1}deg ${stop2}deg,
        ${inProgressColor} ${stop2}deg ${stop3}deg,
        ${overdueColor} ${stop3}deg 360deg
    )`;

    pieChart.style.setProperty('--pie-gradient', gradient);

    totalTask.innerHTML = `${total}`;

    doneValue.innerHTML = `${done}`;
    unassignedValue.innerHTML = `${unassigned}`;
    inProgressValue.innerHTML = `${inProgress}`;
    overdueValue.innerHTML = `${overdue}`;
}

function generateTaskDue(tasks){
    const currentTime = new Date();
    const container = document.querySelector('.taskDueWrapper');
    container.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if(task.DueDate < currentTime) return true;
        else if(task.Status === 'DONE'|| task.Status === 'CANCELLED') return false;
        else{
            const interval = (task.DueDate - currentTime) / (1000 * 60 * 60 * 24);
            return (interval < 7)? true : false;
        }
    });

    if(filteredTasks.length === 0){
        const emptyMessage = document.createElement('h4');
        emptyMessage.textContent = `You're all caught up! No tasks are due soon.`;
        emptyMessage.classList.add('emptyMessage');
        container.appendChild(emptyMessage);
    }

    filteredTasks.forEach(task => {
        const taskDueSoon = document.createElement('div');
        taskDueSoon.classList.add('taskDueSoon');

        const taskTitleEl = document.createElement('div');
        taskTitleEl.classList.add('taskTitle');
        
        const remainingLabel = document.createElement('h4');
        if(task.DueDate < currentTime){
            const remainingTime = formatDuration(task.DueDate, currentTime);
            remainingLabel.innerHTML = `Overdue ${remainingTime}`;
            taskDueSoon.style.backgroundColor = 'var(--overdue-color)';
        }else{
            const remainingTime = formatDuration(currentTime, task.DueDate);
            remainingLabel.innerHTML = `Remaining ${remainingTime}`;
            if(task.Status === 'OTW') taskDueSoon.style.backgroundColor = 'var(--in-progress-color)';
            else if(task.Status === 'HTY') taskDueSoon.style.backgroundColor = 'var(--unassigned-color-code)';
        }

        const taskTitle = document.createElement('h4');
        taskTitle.innerHTML = `${task.TaskTitle}`;
        
        const involvedMemberEl = document.createElement('div');
        involvedMemberEl.classList.add('invovledMember');
        
        tasks.forEach(childTask => {
            if(childTask.TaskID === task.TaskID){
                if(childTask.AssignedUserID){
                    members.forEach(member => {
                        if(member.UserID === childTask.AssignedUserID){
                            const firstLetter = member.FullName.charAt(0).toUpperCase();
                            const avatar = document.createElement('div');
                            avatar.classList.add('userAvatar');
                            avatar.innerHTML = `${firstLetter}`;
                            avatar.style.backgroundColor = `var(${member.AvatarColor})`;
                            involvedMemberEl.appendChild(avatar);
                        }
                    });
                };
            }
            else if(childTask.ParentTaskID === task.TaskID){
                if(childTask.AssignedUserID){ 
                    members.forEach(member => {
                        if(member.userID === childTask.AssignedUserID){
                            const firstLetter = member.FullName.charAt(0).toUpperCase();
                            const avatar = document.createElement('div');
                            avatar.classList.add('userAvatar');
                            avatar.innerHTML = `${firstLetter}`;
                            avatar.style.backgroundColor = `var(${member.AvatarColor})`;
                            involvedMemberEl.appendChild(avatar);
                        }
                    });
                }
            }
        });

        taskTitleEl.appendChild(remainingLabel);
        taskTitleEl.appendChild(taskTitle);
        taskTitleEl.appendChild(involvedMemberEl);
        taskDueSoon.appendChild(taskTitleEl);

        taskDueSoon.addEventListener('click', async () => {
            redirecToTask(task.TaskID, task.ProjectID);
        });

        container.appendChild(taskDueSoon);
    });
}

function generateWorkLoad(tasks, members){
    const container = document.querySelector('.memberList');
    container.innerHTML = '';
    let totalTask = 0
    tasks.forEach(task => totalTask += 1);

    members.forEach(member => {
        let relatedTask = 0
        tasks.forEach(task => {
            if (task.AssignedUserID === member.UserID) relatedTask += 1;
        });
        
        let distribution = 0;
        if(relatedTask !== 0) distribution = ((relatedTask / totalTask) * 100).toFixed(2);

        const memberEl = document.createElement('div');
        memberEl.classList.add('member');
        
        const avatar = document.createElement('div');
        avatar.classList.add('memberAvatar');
        avatar.innerHTML = `${member.FullName.charAt(0).toUpperCase()}`;
        avatar.style.backgroundColor = `var(${member.AvatarColor})`;

        const memberName = document.createElement('p');
        memberName.classList.add('memberName');
        memberName.innerHTML = `${member.FullName}`;

        const distributeWrapper = document.createElement('div');
        distributeWrapper.classList.add('distributeWrapper');

        const distribute = document.createElement('div');
        distribute.classList.add('distribute');
        if(relatedTask !== 0) distribute.style.width = `${distribution}%`;
        else distribute.style.width = `1%`

        const distributePercentage = document.createElement('p');
        distributePercentage.classList.add('distributePercentage');
        distributePercentage.innerHTML = `${distribution}%`;

        distributeWrapper.appendChild(distribute);
        distributeWrapper.appendChild(distributePercentage);
        memberEl.appendChild(avatar);
        memberEl.appendChild(memberName);
        memberEl.appendChild(distributeWrapper);
        container.appendChild(memberEl);
    })
}

function updateProjectDetails(project, members, role){
    const panel = document.querySelector('.projectDetailsPanel');
    const leader = members.find(m => m.Role === 'Team Leader');
    const nameLabel = panel.querySelector('.leaderName');
    const avatarLabel = panel.querySelector('.leaderAvatar');
    const projectNameLabel = panel.querySelector('.leftWrapper .projectName');
    const projectDescLabel = panel.querySelector('.leftWrapper .projectDesc');
    const activeMemberLabel = panel.querySelector('.rightWrapper .activeMember');
    const startDateLabel = panel.querySelector('.rightWrapper .startDate');
    const endDateLabel = panel.querySelector('.rightWrapper .endDate');
    const rermainingDaysLabel = panel.querySelector('.rightWrapper .remainingDays');
    let activeMember = 0;

    nameLabel.textContent = leader.FullName;
    avatarLabel.textContent = leader.FullName.charAt(0).toUpperCase();
    avatarLabel.style.setProperty('--leader-avatar', `var(${leader.AvatarColor})`);

    projectNameLabel.textContent = `Project Name: ${project.ProjectName}`;
    projectDescLabel.textContent = `${project.Description}`;

    members.forEach(m => {
        if(m.Status === 'Active') activeMember += 1;
    });
    activeMemberLabel.textContent = `Total active members: ${activeMember}`;
    const endDate = new Date(project.EndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeDiff = endDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    let result;
    
    console.log('enddate', project.EndDate);
    const formatDate = (date) => {
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    }
    
    if(!project.EndDate){
        result = '';
    } else if (daysDiff < 0) {
        result = `Overdue ${Math.abs(daysDiff)} days`;
    } else if (daysDiff === 0) {
        result = `Due today`;
    } else {
        result = `Remaining ${daysDiff} days`;
    }

    if(!project.EndDate){
        endDateLabel.textContent = `End Date: Select an end date`;
    }else{
        endDateLabel.textContent = `End Date: ${formatDate(project.EndDate)}`;
    }

    startDateLabel.textContent = `Start Date: ${formatDate(project.StartDate)}`;
    

    rermainingDaysLabel.textContent = `Remaining Days: ${result}`;
    
    const buttonWrapper = panel.querySelector('.buttonWrapper');
    buttonWrapper.innerHTML = '';
    
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit');
    editBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
    `;

    editBtn.addEventListener('click', () => {
        const editProjectDialog = document.querySelector('.editProjectDialog');
        const projectTitleEdit = editProjectDialog.querySelector('.projectTitleEdit');
        const projectDescEdit = editProjectDialog.querySelector('#projectDescEdit');
        const cancelBtn = editProjectDialog.querySelector('.cancel');
        const confirmBtn = editProjectDialog.querySelector('.confirm');

        projectTitleEdit.value = project.ProjectName;
        projectDescEdit.value = project.Description;

        cancelBtn.onclick = () => {
            projectTitleEdit.value = project.ProjectName;
            projectDescEdit.value = project.Description;
            editProjectDialog.close();
        }

        confirmBtn.onclick = () => {
            project.ProjectName = projectTitleEdit.value.trim();
            if(projectDescEdit.value.trim() === ''){
                project.Description = 'Description. Say Somethin';
            }else project.Description = projectDescEdit.value.trim();

            updateProject(project);

            editProjectDialog.close();
            fetchProjectData();
            const successfulMessage = document.createElement('div');
            successfulMessage.classList.add('successfulMessage');
            successfulMessage.innerHTML = `Successfully update project details"`
            messageContainer.appendChild(successfulMessage);
            successfulMessage.classList.add('active');
            setTimeout(() => {
                messageContainer.removeChild(successfulMessage);
            }, 5000);
        }
        
        editProjectDialog.showModal();
    });

    const deleteProjectBtn = document.createElement('button');
    deleteProjectBtn.classList.add('deleteProjectBtn');
    deleteProjectBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    `;

    deleteProjectBtn.addEventListener('click', () => {
        const confirmation = document.querySelector('.confirmationDialog');
        const cancelButton = confirmation.querySelector('.cancel');
        const confirmButton = confirmation.querySelector('.confirm');

        const title = confirmation.querySelector('h3');

        title.textContent = 'Do you confirm to delete this Project?';

        cancelButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            confirmation.close();
        };

        confirmButton.onclick = async () => {
            const projectId = project.ProjectID;
            if (!projectId) return;

            try {
                const response = await fetch('delete_project.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ProjectID: projectId })
                });

                const result = await response.json();
                if (result.status === 'ok') {
                    const projectTitle = result.projectName || 'Untitled Project';
                    sessionStorage.setItem('deleteSuccess', `Successfully deleted project "${projectTitle}"`);
            
                    window.location.href = '4-myHustle.php';
                } else {
                    console.error('❌ Failed to delete:', result.message);
                }
            } catch (err) {
                console.error('❌ Error deleting event:', err);
            }
        };

        confirmation.showModal();
    });

    console.log(role);
    if(role === 'Team Leader'){
        buttonWrapper.appendChild(editBtn);
        buttonWrapper.appendChild(deleteProjectBtn);
    }
}

function updateGoal(project, tasks){
    const goalTitle = document.querySelector('.goalDescription h4');
    const progressBar = document.querySelector('.goal .progressBar');
    const dueDate = document.querySelector('.dueDateWrapper .calenderToggle');
    const container = document.querySelector('.goal .taskDueWrapper');
    container.innerHTML = '';

    let totalTask = 0;
    let doneTask = 0;
    let todayD = new Date();

    goalTitle.innerHTML = `${project.ProjectName}`;

    if(!project.EndDate){
        dueDate.innerHTML = `Select Due Date`;
        dueDate.style.color = `rgba(var(--tertiary-color), 0.8)`;
    }
    else if(project.EndDate){
        new Date(project.EndDate)
        let dueDateY = new Date(project.EndDate).getFullYear();
        let dueDateM = new Date(project.EndDate).getMonth() + 1;
        let dueDateDate = new Date(project.EndDate).getDate();

        dueDate.innerHTML = `${dueDateDate}/${dueDateM}/${dueDateY}`;
        if(new Date(project.EndDate) < todayD) dueDate.style.color = `var(--overdue-color)`;
        else if(new Date(project.EndDate)) dueDate.style.color = `rgba(var(--secondary-color), 1)`;
    }

    tasks.forEach(task => {
        if(task.Status === 'DONE') doneTask += 1;
        totalTask += 1;
    })

    let progression = 0;
    if(doneTask !== 0){
        progression = ((doneTask / totalTask) * 100).toFixed(2);
        progressBar.style.setProperty('--bar-width', `${progression}%`);
    } else{
        progressBar.style.setProperty('--bar-width', `1%`);
    };
    progressBar.style.setProperty('--progression', `"${progression}%"`);
    progressBar.style.setProperty('--popupsPosition', `calc(${progression}% - (1.5vw / 2))`);

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
        
        taskEl.appendChild(taskTitle);

        if(task.DueDate < todayD) taskEl.style.backgroundColor = `var(--overdue-color)`;
        else if(!task.AssignedUserID) taskEl.style.backgroundColor = `var(--unassigned-color-code)`;
        else taskEl.style.backgroundColor = `var(--in-progress-color)`;

        taskEl.addEventListener('click', async () => {
            redirecToTask(task.TaskID, task.ProjectID);
        });

        return taskEl;
    }

    const prioritizeTasks = tasks
        .filter(task => task.Priority > 0)
        .sort((a, b) => b.Priority - a.Priority);
    if(prioritizeTasks.length !== 0) prioritizeTasks.forEach(task => container.appendChild(createTaskEl(task)));
    else{
        const emptyMessage = document.createElement('h4');
        emptyMessage.textContent = `No prioritized tasks at the moment.`;
        emptyMessage.classList.add('emptyMessage');
        container.appendChild(emptyMessage);
    }
}

const calendarToggle = document.querySelector('#calendarToggle');
const calendar = document.querySelector('.calendar'); 
const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');


function updateCalendar(currentDateValue){
    const currentDate = new Date(currentDateValue);
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
        let activeClass = ''
        if(new Date(project.EndDate)){
            activeClass = (
                date.getDate() === new Date(project.EndDate).getDate() &&
                date.getMonth() === new Date(project.EndDate).getMonth() &&
                date.getFullYear() === new Date(project.EndDate).getFullYear()
            ) ? 'active' : '';
        }else{
            activeClass = (
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear()
            ) ? 'active' : '';
        }
        datesHTML += `<div class="date ${activeClass}">${i}</div>`;
    }

    for(let i = 1; i < 7 - lastDayIndex; i++){
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
    }

    datesElement.innerHTML = datesHTML;

    const allDates = document.querySelectorAll('.date');
    allDates.forEach(dateEl => {
        dateEl.addEventListener('click', async () => {
            if (!dateEl.classList.contains('inactive')) {
                const todayD = new Date();
                const day = parseInt(dateEl.textContent, 10);
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                const selectedDate = new Date(year, month - 1, day);
                const errorMessage = calendar.querySelector('.errorMessage');
                
                if(selectedDate < new Date(project.StartDate)){
                    errorMessage.textContent = '*End Date cannot earlier than Start Date*';
                    errorMessage.style.display = 'block';
                    console.log(errorMessage);
                    return;
                } 

                allDates.forEach(d => d.classList.remove('active'));
                dateEl.classList.add('active');
                const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

                const calendarToggle = document.querySelector('#calendarToggle');
                calendarToggle.textContent = formattedDate;


                if(selectedDate < todayD){
                    calendarToggle.style.color = `var(--overdue-color)`;
                }
                else{
                    calendarToggle.style.color = `var(--secondary-color)`;
                }
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
                calendar.classList.toggle('show');
                calendarToggle.classList.toggle('active');
                project.EndDate = formatLocalDateTime(selectedDate);

                await updateProject(project);
                await fetchProjectData();

                const successfulMessage = document.createElement('div');
                successfulMessage.classList.add('successfulMessage');
                successfulMessage.innerHTML = `Successfully update project end date"`
                messageContainer.appendChild(successfulMessage);
                successfulMessage.classList.add('active');
                setTimeout(() => {
                    messageContainer.removeChild(successfulMessage);
                }, 5000);
            }
        });
    });


};

calendarToggle.addEventListener('click', (e) => {
    e.stopPropagation();

    const rect = calendarToggle.getBoundingClientRect();
    calendar.style.top = `${rect.top + window.scrollY}px`;
    calendar.style.left = `${rect.right + window.scrollX}px`;
    calendar.classList.toggle('show');
    calendarToggle.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if(
        !calendar.contains(event.target)
    ){
        calendar.classList.remove('show');
        calendarToggle.classList.remove('active');
    }
})

let tasks = [];
let members = [];
let loggedInUserRole = 'Team Member';
let project = {};

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
            project = {
                ProjectID: data.project.ProjectID,
                ProjectName: data.project.ProjectName,
                InviteCode: data.project.InviteCode,
                Description: data.project.Description,
                StartDate: data.project.StartDate ? new Date(data.project.StartDate) : null,
                EndDate: data.project.EndDate ? new Date(data.project.EndDate) : null
            };
            tasks = data.tasks.map(t => ({
                ...t,
                StartDate: t.StartDate ? new Date(t.StartDate) : null,
                DueDate: t.DueDate ? new Date(t.DueDate) : null
            }));

            members = data.members;
            const filteredActiveMember = members.filter(m => m.Status === 'Active');

            
            loggedInUserRole = members.find(m => m.UserID === currentUserID);
            loggedInUserID = loggedInUserRole.UserID;
            let currentDate = new Date();
            if(project.EndDate) currentDate = new Date(project.EndDate);

            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            prevBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                updateCalendar(currentDate);
            });

            nextBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                updateCalendar(currentDate);
            });

            generateTaskDue(tasks);
            updatePieChart(tasks);
            generateWorkLoad(tasks, filteredActiveMember);
            updateCalendar(currentDate);
            updateGoal(project, tasks);
            generateProjectAvatar(filteredActiveMember);
            updateProjectDetails(project, members, loggedInUserRole.Role);
        } else {
            console.error('❌ Error:', data.message);
        }
    } catch (err) {
        console.error('❌ Failed to fetch project summary:', err);
    }
}

async function updateProject(project) {
    try {
        const response = await fetch('update_project.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ProjectID: project.ProjectID,
                ProjectName: project.ProjectName,
                Description: project.Description,
                EndDate: project.EndDate,
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log("✅ Project updated successfully");
        } else {
            console.error("❌ Update failed:", data.error || data.message);
        }
    } catch (error) {
        console.error("❌ Network error:", error);
    }
}

document.addEventListener('DOMContentLoaded', fetchProjectData);

function formatLocalDateTime(date) {
    if (!date) return null;
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 19).replace('T', ' ');
}