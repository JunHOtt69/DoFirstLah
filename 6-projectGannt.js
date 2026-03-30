const header = document.querySelector('.taskHeader');
const bodyPanel   = document.querySelector('.ganntBodyPanel');
const panel = document.querySelector('.taskPanel');
const resizers = document.querySelectorAll('.ganntResizer');
const timelineHeader = document.querySelector('.timelineHeader');
const timelineBody = document.querySelector('.timelineBody');
const chartContent = document.querySelector('.chartContent');
const taskPanel = document.querySelector('.taskPanel');

let isResizing = false;
let startX = 0;
let startTaskWidthVW = 0;

function pxToVw(px) {
    return (px / window.innerWidth) * 100;
}

resizers.forEach(resizer => {
    resizer.addEventListener('mousedown', e => {
        isResizing = true;
        startX = e.clientX;
        startTaskWidthVW = pxToVw(header.offsetWidth); 
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    });
});

document.addEventListener('mousemove', e => {
    if(!isResizing) return;

    let dx = pxToVw(e.clientX - startX);
    let newTaskWidthVW = Math.min(Math.max(startTaskWidthVW + dx, 10), 25);

    if(newTaskWidthVW < 10) newTaskWidthVW = 10;
    if(newTaskWidthVW > 25) newTaskWidthVW = 25;
    
    root.style.setProperty('--taskPanelWidth', newTaskWidthVW + 'vw');
    header.style.width  = newTaskWidthVW + 'vw';
    panel.style.width  = newTaskWidthVW + 'vw';
    bodyPanel.style.gridTemplateColumns   = `${newTaskWidthVW}vw 0.15vw 1fr`;
    
    timelineBody.style.transition = 'none';
});


document.addEventListener('mouseup', () => {
    if(isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        timelineBody.style.transition = 'width 0.1s';
    }
});

let isSyncingHeader = false;
let isSyncingBody = false;
let isSyncingTask = false;

timelineHeader.addEventListener('scroll', () => {
    if(!isSyncingHeader){
        isSyncingBody = true;
        timelineBody.scrollLeft = timelineHeader.scrollLeft;
        chartContent.scrollLeft = timelineHeader.scrollLeft;
    }
    isSyncingHeader = false;
});

timelineBody.addEventListener('scroll', () => {
    if(!isSyncingHeader){
        isSyncingBody = true;
        timelineHeader.scrollLeft = timelineBody.scrollLeft;
        chartContent.scrollLeft = timelineBody.scrollLeft;
    }
    isSyncingHeader = false;
});

chartContent.addEventListener('scroll', () => {
    if(!isSyncingBody){
        isSyncingHeader = true;
        timelineBody.scrollLeft = chartContent.scrollLeft;
        timelineHeader.scrollLeft = chartContent.scrollLeft;
    }
    isSyncingBody = false;

    if(!isSyncingTask){
        isSyncingTask = true;
        taskPanel.scrollTop = chartContent.scrollTop;
    }
    isSyncingTask = false; 
});

taskPanel.addEventListener('scroll', () => {
    if(!isSyncingTask){
        isSyncingTask = true;
        chartContent.scrollTop = taskPanel.scrollTop;
    }
    isSyncingTask = false;
});

const ganntRangeButton = document.querySelector('.ganntRangeButton');
const weekButton = document.getElementById('weekButton');
const selectedShadow = ganntRangeButton.querySelector('.selectedShadow');

weekButton.addEventListener('click', () => {
    weekButton.classList.add('active');
    selectedShadow.classList.remove('month');
    selectedShadow.classList.remove('quarter');
});

const statusColors = {
    "DONE": "var(--done-color)",
    "OTW": "var(--in-progress-color)",
    "HTY": "var(--unassigned-color-code)"
};

function daysBetweenUTC(startDate1, endDate1) {
    const startDate = new Date(startDate1);
    const endDate = new Date(endDate1);

    const msPerDay = 1000 * 60 * 60 * 24;
    const utcStart = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const utcEnd = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return Math.floor((utcEnd - utcStart) / msPerDay);
}

let elementDragged = false;

function enableSnapDrag(element, remainingTime, timeCellWidth, timelineStart, onChange){
    let ElDragging = false;
    let chartElResizingL = false;
    let chartElResizingR = false;
    let lastSnapMouseX = 0;
    let lastSnappedLeftPx = 0;
    let wrapperRect = null;
    let wrapper = null;
    let stepPx = 0;
    const guideLine1 = chartContent.querySelector('.guideLine1');
    const guideLine2 = chartContent.querySelector('.guideLine2');

    function pxFromVW(vw){
        return (vw / 100) * window.innerWidth;
    }

    function clamp(v, a, b){
        return Math.max(a, Math.min(b, v));
    }

    function pointerDown(e){
        if(!element.matches(':focus')) return;

        if(e.pointerType === 'mouse' && e.button !== 0) return;

        wrapper = element.closest('.ganntTaskChart');
        if(!wrapper) return;

        wrapperRect = wrapper.getBoundingClientRect();

        const elRect = element.getBoundingClientRect();
        lastSnappedLeftPx = elRect.left - wrapperRect.left;

        lastSnapMouseX = e.clientX;

        stepPx = pxFromVW(timeCellWidth);

        if(e.currentTarget === element){
            ElDragging = true;
            elementDragged= true;
            element.setPointerCapture(e.pointerId);
        } else if (e.currentTarget === guideLine1){
            if(!elementDragged) return;
            chartElResizingL = true;
            console.log('resizing');
            guideLine1.setPointerCapture(e.pointerId);
        } else if (e.currentTarget === guideLine2){
            if(!elementDragged) return;
            chartElResizingR = true;
            console.log('resizing')
            guideLine2.setPointerCapture(e.pointerId);
        }

        document.body.style.userSelect = 'none';
    }

    function pointerMove(e) {
        if(!ElDragging && !chartElResizingL && !chartElResizingR) return;

        const diffPx = e.clientX - lastSnapMouseX;

        const stepChange = Math.round(diffPx / stepPx);
        if(stepChange === 0) return;

        const newLeftPx = lastSnappedLeftPx + stepChange * stepPx;
        

        const maxLeftPx = wrapper.clientWidth - element.offsetWidth;
        const clampedLeft = clamp(newLeftPx, 0, Math.max(0, maxLeftPx));
        

        if(ElDragging){
            element.style.left = clampedLeft + 'px';
        }

        if(chartElResizingL){
            const newLeftPx = lastSnappedLeftPx + stepChange * stepPx;
            const newWidthPx = element.offsetWidth - stepChange * stepPx;

            const clampedLeft = clamp(newLeftPx, 0, wrapper.clientWidth - stepPx);
            const clampedWidth = clamp(newWidthPx, stepPx, wrapper.clientWidth - clampedLeft);

            element.style.left = clampedLeft + 'px';
            element.style.width = clampedWidth + 'px';
        }

        if(chartElResizingR){
            const newWidthPx = element.offsetWidth + stepChange * stepPx;
            const minWidthPx = stepPx;
            const maxWidthPx = wrapper.clientWidth - clampedLeft;

            const clampedWidth = clamp(newWidthPx, minWidthPx, maxWidthPx);

            element.style.width = clampedWidth  + 'px';
        }

        lastSnapMouseX += stepChange * stepPx;
        lastSnappedLeftPx = clampedLeft;

        if(element.matches(':focus')){
            const leftPx = parseFloat(element.style.left) || 0;
            const widthPx = element.offsetWidth;
            const endPx = leftPx + widthPx;

            guideLine1.style.left = leftPx + 'px';
            guideLine2.style.left = endPx + 'px';
        }
    }

    function pointerUp(e){
        if(!ElDragging && !chartElResizingL && !chartElResizingR) return;
        ElDragging = false;
        chartElResizingL = false;
        chartElResizingR = false;

        try{
            element.releasePointerCapture(e.pointerId);
            guideLine1.releasePointerCapture(e.pointerId);
            guideLine2.releasePointerCapture(e.pointerId);
        } catch(_) {}
        document.body.style.userSelect = '';

        const finalLeftPx = parseFloat(element.style.left || 0);
        const finalWidthPx = element.offsetWidth;
        const durationDays = Math.round(finalWidthPx / pxFromVW(timeCellWidth));
        const offsetDays = Math.round(finalLeftPx / pxFromVW(timeCellWidth));
        if(typeof onChange === 'function'){
            const newStart = new Date(Date.UTC(
                timelineStart.getFullYear(),
                timelineStart.getMonth(),
                timelineStart.getDate()
            ));
            newStart.setUTCDate(newStart.getUTCDate() + offsetDays);

            const newEnd = new Date(newStart);
            newEnd.setUTCDate(newEnd.getUTCDate() + durationDays);

            remainingTime.textContent = `${durationDays} days`;
            onChange(newStart, newEnd);
        };
    }

    function triggerFocus() {
        console.log('focused');
        const rect = element.getBoundingClientRect();
        const wrapperRect = element.closest('.ganntTaskChart').getBoundingClientRect();

        const leftPx = rect.left - wrapperRect.left;
        const widthPx = rect.width;
        const endPx = leftPx + widthPx;

        guideLine1.style.left = leftPx + 'px';
        guideLine2.style.left = endPx + 'px';
        console.log(guideLine1.style.left);
        const chartHeight = chartContent.scrollHeight;
        guideLine1.style.height = chartHeight -10 + 'px';
        guideLine2.style.height = chartHeight -10 + 'px';
    }

    element.addEventListener('focus', () => {
        triggerFocus()
    });

    element.addEventListener('blur', (e) => {
        if (e.relatedTarget === guideLine1 || e.relatedTarget === guideLine2) {
            element.focus();
            console.log('blur: ', guideLine1.style.left);
            return;
        }else{
            guideLine1.style.height = 0;
            guideLine2.style.height = 0;
        }
    });

    element.addEventListener('pointerdown', pointerDown);
    guideLine1.addEventListener('pointerdown', pointerDown);
    guideLine2.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);

    return() => {
        element.removeEventListener('pointerdown', pointerDown);
        guideLine1.removeEventListener('pointerdown', pointerDown);
        guideLine2.removeEventListener('pointerdown', pointerDown);
        window.removeEventListener('pointermove', pointerMove);
        window.removeEventListener('pointerup', pointerUp);
    };
}


function renderGanntTasks(tasks, timelineStart, timelineEnd, timeCellWidthVW, role) {
    const chartContent = document.querySelector(".chartContent");
    chartContent.innerHTML = "";
    taskPanel.innerHTML = '';

    const guideLine1 = document.createElement('div');
    const guideLine2 = document.createElement('div');
    guideLine1.classList.add('guideLine1');
    guideLine2.classList.add('guideLine2');

    guideLine1.setAttribute("tabindex", "-1");
    guideLine2.setAttribute("tabindex", "-1");
    guideLine1.style.pointerEvents = "auto";
    guideLine2.style.pointerEvents = "auto";

    chartContent.appendChild(guideLine1);
    chartContent.appendChild(guideLine2);
    const filteredTask = tasks.filter(t => (
        t.Status === 'HTY' 
        || t.Status === 'OTW' 
        || t.Status === 'DONE' 
    ));

    if(filteredTask.length === 0){
        const empty = document.createElement('div');
        empty.classList.add('empty');
        const message = document.createElement('h4');
        message.textContent = 'No tasks waiting to be started. Create some task to begin!';
        empty.appendChild(message);
        taskPanel.appendChild(empty);

        const wrapper = document.createElement("div");
        wrapper.classList.add("ganntTaskChart");
        const totalDays = daysBetweenUTC(timelineStart, timelineEnd) + 1;
        const timelineWidth = totalDays * timeCellWidthVW;
        wrapper.style.width = timelineWidth + 'vw';
        chartContent.appendChild(wrapper);
    }

    filteredTask.forEach(task => {
        const ganntTask = document.createElement("div");
        ganntTask.classList.add("ganntTask");

        ganntTask.addEventListener('click', () => {
            triggerTaskDetail(task, task.ProjectID);
        });

        const taskName = document.createElement("p");
        taskName.textContent = task.TaskTitle;

        ganntTask.appendChild(taskName);
        taskPanel.appendChild(ganntTask);

        const wrapper = document.createElement("div");
        wrapper.classList.add("ganntTaskChart");
        const totalDays = daysBetweenUTC(timelineStart, timelineEnd) + 1;
        const timelineWidth = totalDays * timeCellWidthVW;
        wrapper.style.width = timelineWidth + 'vw';

        const element = document.createElement("div");
        element.classList.add("taskChartElement");
        element.tabIndex = 0;

        const durationDays = Math.ceil(
        (task.DueDate - task.StartDate) / (1000 * 60 * 60 * 24) 
        ) + 1;

        const remainingTime = document.createElement("div");
        remainingTime.classList.add("remainingTime");
        remainingTime.textContent = durationDays + " days";
        element.appendChild(remainingTime);

        const offsetDays = Math.floor(
        (task.StartDate - timelineStart) / (1000*60*60*24)
        );
        const leftVW = offsetDays * timeCellWidthVW;
        const widthVW = durationDays * timeCellWidthVW;

        element.style.left = leftVW + "vw";
        element.style.width = widthVW + "vw";

        
        element.style.backgroundColor = statusColors[task.Status];

        if(new Date() > task.DueDate && task.Status !== 'DONE'){
            element.style.backgroundColor = "var(--overdue-color)";
        };

        wrapper.appendChild(element);
        chartContent.appendChild(wrapper);

        ganntTask.addEventListener('mouseenter', () => {
            wrapper.classList.add('active');
            element.classList.add('active');
        });

        ganntTask.addEventListener('mouseleave', () => {
            wrapper.classList.remove('active');
            element.classList.remove('active');
        });

        if(
            role === 'Team Leader' 
            || role === 'Project Manager' 
        ){
            enableSnapDrag(element, remainingTime, timeCellWidthVW, timelineStart, (startDate, dueDate) => {
                const newStartDate = new Date(startDate);
                const newDueDate = new Date(dueDate);
                newDueDate.setDate(newDueDate.getDate() - 1);

                if(elementDragged){
                    task.StartDate = newStartDate;
                    task.DueDate = newDueDate;

                }else if(!elementDragged){
                    return;
                }

                if(new Date() > task.DueDate){
                    element.style.backgroundColor = `var(--overdue-color)`;
                }else{
                    element.style.backgroundColor = statusColors[task.Status];
                }

                updateTask(task);
            });
        }
    });


    const createTask = document.createElement('div');
    createTask.classList.add('createTask');
    createTask.innerHTML = `
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
                    <button class="confirmBtn"></button>
                </div>

                <div class="inputFooter">
                    <p class="remainingLetters">30</p>
                </div>
                <div class="errorMessage"></div>
            </form>
        </div>
    `;

    taskPanel.appendChild(createTask);

    const state1 = createTask.querySelector('.state1');
    const state2 = createTask.querySelector('.state2');
    const taskInput = state2.querySelector('input');
    const remainingLabel = createTask.querySelector('.remainingLetters');
    const confirmBtn = createTask.querySelector('.confirmBtn');
    const errorMessage = createTask.querySelector('.errorMessage');
    let maxLetters = 30;
    
    errorMessage.style.display = 'none';
    errorMessage.textContent = ``;

    taskInput.addEventListener('input', () => {
        const lettersOnly = taskInput.value.replace(/[^a-zA-Z0-9]/g, '');
        const remainingLetters = maxLetters - lettersOnly.length;
        remainingLabel.textContent = `${remainingLetters}`;
    });

    state1.addEventListener('click', () => {
        state1.classList.toggle('hide');
        state2.classList.toggle('hide');
        createTask.classList.toggle('active');
        chartContent.classList.toggle('createTaskActive');

        taskInput.focus();
    });

    confirmBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log(taskInput.value.trim());
        const taskName = taskInput.value.trim();

        if(taskName === '' || !taskName){
            errorMessage.style.display = 'block';
            errorMessage.textContent = `*Task Name cannot be empty*`;
            return;
        }

        const startDate = new Date();
        const dueDate = new Date(startDate);
        dueDate.setDate(startDate.getDate() + 1);

        const newTask = {
            ParentTaskID: null,
            ProjectID: project.ProjectID,
            AssignedUserID: null,
            TaskTitle: taskName,
            Description: '',
            Priority: 0,
            Status: 'HTY',
            StartDate: startDate,
            DueDate: dueDate
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

                const successfulMessage = document.createElement('div');
                successfulMessage.classList.add('successfulMessage');
                successfulMessage.innerHTML = `Successfully created task: ${taskName}`
                messageContainer.appendChild(successfulMessage);
                successfulMessage.classList.add('active');
                setTimeout(() => {
                    messageContainer.removeChild(successfulMessage);
                }, 5000);

                state1.classList.toggle('hide');
                state2.classList.toggle('hide');
                createTask.classList.toggle('active');
                chartContent.classList.toggle('createTaskActive');
                taskInput.value = '';
                remainingLabel.textContent = `${maxLetters}`;
                errorMessage.style.display = 'none';
                errorMessage.textContent = ``;

                tasks.push(newTask);
                console.log('Render');
                renderGanntTasks(tasks, timelineStart, timelineEnd, timeCellWidthVW, role);
            } else {
                console.error('❌ Add task failed:', data.message);
            }
        })
        .catch(err => console.error('❌ Error:', err));
    });

    document.addEventListener('click', (event) => {
        if(!state2.classList.contains('hide') && 
        !state2.contains(event.target) && 
        !state1.contains(event.target)
        ){
            state1.classList.toggle('hide');
            state2.classList.toggle('hide');
            createTask.classList.toggle('active');
            chartContent.classList.toggle('createTaskActive');
            taskInput.value = '';
            remainingLabel.textContent = `${maxLetters}`;
        }
    });
}

function generateWeekView(today, startDate, endDate){
    const timelineHeader = document.querySelector('.timelineHeader');
    const timelineBody = document.querySelector('.timelineBody');
    timelineHeader.innerHTML = "";
    timelineBody.innerHTML = "";

    let current = new Date(startDate);
    const timeCellWidthVW = 3;

    let weekIndex = 0;
    let daysInThisWeek = 0;
    let bodyWeekDiv = null;
    let headerWeekFragment = null;
    let currentMonthKey = null;
    let subScaleRow = null;

    while (current <= endDate) {
        const monthKey = current.getFullYear() + '-' + current.getMonth();

        if (monthKey !== currentMonthKey) {
            currentMonthKey = monthKey;

            const scaleCell = document.createElement('div');
            scaleCell.classList.add('scaleCell');

            const scaleLabel = document.createElement('div');
            scaleLabel.classList.add('scaleLabel');
            scaleLabel.textContent = current.toLocaleString('default', { month: 'long' }) + ' ' + current.getFullYear();
            scaleCell.appendChild(scaleLabel);

            subScaleRow = document.createElement('div');
            subScaleRow.classList.add('subScaleRow');
            scaleCell.appendChild(subScaleRow);

            timelineHeader.appendChild(scaleCell);

            headerWeekFragment = null;
        }

        if (daysInThisWeek === 0) {
            headerWeekFragment = document.createElement('div');
            headerWeekFragment.classList.add('rangeStyle');
            if (weekIndex % 2 === 0) headerWeekFragment.classList.add('alt');

            subScaleRow.appendChild(headerWeekFragment);

            bodyWeekDiv = document.createElement('div');
            bodyWeekDiv.classList.add('rangeStyle');
            if (weekIndex % 2 === 0) bodyWeekDiv.classList.add('alt');
            
            timelineBody.appendChild(bodyWeekDiv);

        } else if (!headerWeekFragment) {
            headerWeekFragment = document.createElement('div');
            headerWeekFragment.classList.add('rangeStyle');

            if (weekIndex % 2 === 0) headerWeekFragment.classList.add('alt');

            subScaleRow.appendChild(headerWeekFragment);
        }

        const timeCell = document.createElement('div');
        timeCell.classList.add('timeCell');
        timeCell.textContent = current.getDate();

        if (
            current.getFullYear() === today.getFullYear() &&
            current.getMonth() === today.getMonth() &&
            current.getDate() === today.getDate()
        ) {
            timeCell.classList.add('today');
        }

        headerWeekFragment.appendChild(timeCell);

        daysInThisWeek++;

        if (current.getDay() === 6 || current.getTime() === endDate.getTime()) {
            bodyWeekDiv.style.width = (daysInThisWeek * timeCellWidthVW) + 'vw';

            weekIndex++;
            daysInThisWeek = 0;
            bodyWeekDiv = null;
            headerWeekFragment = null;
        }

        current.setDate(current.getDate() + 1);
    }

    
}

function scrollToToday() {
    const todayCell = document.querySelector('.timeCell.today');
    if (!todayCell) return;

    const container = timelineHeader;

    const todayOffset = todayCell.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft;
    const containerWidth = container.clientWidth;
    const cellWidth = todayCell.offsetWidth;

    const scrollLeft = todayOffset - (containerWidth / 2) + (cellWidth / 2);

    isSyncingHeader = true;
    timelineHeader.scrollLeft = scrollLeft;
    isSyncingBody = true;
    timelineBody.scrollLeft = scrollLeft;
    chartContent.scrollLeft = scrollLeft;
}

const scrollTodayButton = document.querySelector('.scrollTodayButton');

scrollTodayButton.addEventListener('click', () => {
    scrollTodayButton.classList.add('clicked');
    setTimeout(() => scrollTodayButton.classList.remove('clicked'), 200)
})

let tasks = [];
let members = [];
let users = [];
let comments = [];
let taskAttachments = [];
let commentAttachments = [];
let loggedInUserRole = 'Team Member';
let loggedInUserID = null;
let timelineStart, timelineEnd, timeCellWidthVW = 3;

document.addEventListener('DOMContentLoaded', async () => {
    await initGantt();
});

async function initGantt() {
    const today = new Date();
    timelineStart = new Date(today.getFullYear() - 1, today.getMonth(), 1);
    timelineEnd = new Date(today.getFullYear() + 1, today.getMonth() + 1, 0);
    
    await fetchProjectData();
    generateWeekView(today, timelineStart, timelineEnd);
    renderGanntTasks(tasks, timelineStart, timelineEnd, timeCellWidthVW, loggedInUserRole.Role);
    scrollToToday();
}

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

            const today = new Date();
    
            const startDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
            const endDate = new Date(today.getFullYear() + 1, today.getMonth() + 1, 0);

            generateProjectAvatar(filteredActiveMember);
        } else {
            console.error('❌ Error:', data.message);
        }
    } catch (err) {
        console.error('❌ Failed to fetch project summary:', err);
    }
}