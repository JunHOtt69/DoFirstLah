const root = document.documentElement;

function toggleProfile() {
    const wrapper = document.getElementById('navMenuProfile');
    const navMenu = document.getElementById('navItems');
    const avatar = document.getElementById('toggleBtn');
    const content = document.getElementById('content');
    const container1 = document.querySelector('.container1');
    const container2 = document.querySelector('.container2');

    wrapper.classList.toggle('show-profile');
    navMenu.classList.toggle('show-profile');
    avatar.classList.toggle('show-profile');
    content.classList.toggle('show-profile');
    container1.classList.remove('toggledSetting');
    container2.classList.remove('toggledSetting');
}

function toggleSetting() {
    const settingIcon = document.getElementById('settingIcon');
    const container1 = document.querySelector('.container1');
    const container2 = document.querySelector('.container2');


    settingIcon.classList.toggle('toggledSetting');
    container1.classList.toggle('toggledSetting');
    container2.classList.toggle('toggledSetting');

    container1.scrollTop = 0;
}

const arrow = document.querySelectorAll('.sectionToggleArrow');

arrow.forEach((icon)=>{
    icon.addEventListener('click', ()=>{
        const header = icon.closest('.sectionHeader');
        const content = header.nextElementSibling;
        content.classList.toggle('hide');
        icon.classList.toggle('hide');
    })
})

const dialogFullName = document.getElementById('updateFullName');
const dialogEmail = document.getElementById('updateEmail');
const dialogPassword = document.getElementById('updatePassword');
const dialogSecurityQuestion = document.getElementById('updateSecurityQuestion');
const dialogs = document.querySelectorAll('dialog');
const messageContainer = document.querySelector('.messageDialog');

function resetDialog(dialog) {
    const inputs = dialog.querySelectorAll('input');
    const select = dialog.querySelector('select');
    const errorMessage = dialog.querySelector('.errorMessage');

    inputs.forEach(i => i.value = '');
    if (select) select.value = 'default';
    errorMessage.style.display = 'none';
}

function updateFullName(){
    const confirmBtn = dialogFullName.querySelector('.saveButton');
    const firstNameInput = dialogFullName.querySelector('#first-name');
    const lastNameInput = dialogFullName.querySelector('#last-name');
    const errorMessage = dialogFullName.querySelector('.errorMessage');
    
    resetDialog(dialogFullName);

    confirmBtn.onclick = () => {
        if(!firstNameInput.value.trim() || !lastNameInput.value.trim()){
            errorMessage.textContent = '*Please fill in both first and last name*';
            errorMessage.style.display = 'block';
        }else{
            errorMessage.style.display = 'none';
            const fullName = firstNameInput.value + ' ' + lastNameInput.value;
            
            fetch('update_user_info.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'fullname', fullName })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status === 'success') {
                    document.querySelector('.userInfo h2').textContent = fullName;
                } else {
                    alert(data.message);
                }
            });
            
            dialogFullName.close();

            const successfulMessage = document.createElement('div');
            successfulMessage.classList.add('successfulMessage');
            successfulMessage.innerHTML = `Successfully update Full Name to: ${fullName}`
            messageContainer.appendChild(successfulMessage);
            successfulMessage.classList.add('active');
            setTimeout(() => {
                messageContainer.removeChild(successfulMessage);
            }, 5000);
        }
    };

    dialogFullName.showModal();
}

function updateEmail() {
    const confirmBtn = dialogEmail.querySelector('.saveButton');
    const newEmailInput = dialogEmail.querySelector('#email');
    const errorMessage = dialogEmail.querySelector('.errorMessage');

    resetDialog(dialogEmail);

    confirmBtn.onclick = async () => {
        const newEmail = newEmailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(newEmail)) {
            errorMessage.textContent = '*Please enter a valid email address*';
            errorMessage.style.display = 'block';
            return;
        }

        errorMessage.style.display = 'none';

        try {
            const checkRes = await fetch('check_email_exists.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail })
            });

            const checkData = await checkRes.json();

            if (checkData.exists) {
                errorMessage.textContent = '*This email is already registered*';
                errorMessage.style.display = 'block';
                return;
            }

            const updateRes = await fetch('update_user_info.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'email', email: newEmail })
            });

            const updateData = await updateRes.json();
            console.log(updateData);

            if (updateData.status === 'success') {
                dialogEmail.close();

                document.querySelector('.userInfo p').textContent = newEmail;

                const successfulMessage = document.createElement('div');
                successfulMessage.classList.add('successfulMessage');
                successfulMessage.innerHTML = `Successfully updated Email to: ${newEmail}`;
                messageContainer.appendChild(successfulMessage);
                successfulMessage.classList.add('active');
                setTimeout(() => {
                    messageContainer.removeChild(successfulMessage);
                }, 5000);
            } else {
                errorMessage.textContent = updateData.message || '*Failed to update email*';
                errorMessage.style.display = 'block';
            }

        } catch (err) {
            console.error(err);
            errorMessage.textContent = '*Server error, please try again later*';
            errorMessage.style.display = 'block';
        }
    };

    dialogEmail.showModal();
}

function updatePassword(){
    const confirmBtn = dialogPassword.querySelector('.saveButton');
    const oldPasswordInput = dialogPassword.querySelector('#oldPassword');
    const newPasswordInput = dialogPassword.querySelector('#newPassword');
    const confirmNewPasswordInput = dialogPassword.querySelector('#confirmNewPassword');
    const errorMessage = dialogPassword.querySelector('.errorMessage');

    resetDialog(dialogPassword);

    confirmBtn.onclick = async() =>{
        if (!oldPasswordInput.value.trim() || !newPasswordInput.value.trim() || !confirmNewPasswordInput.value.trim()) {
            errorMessage.textContent = '*Please fill in all password fields*';
            errorMessage.style.display = 'block';
            return;
        }
        
        if (newPasswordInput.value !== confirmNewPasswordInput.value) {
            errorMessage.textContent = '*New passwords do not match*';
            errorMessage.style.display = 'block';
            return;
        }

        errorMessage.style.display = 'none';
            
        try {
            const res = await fetch('update_user_info.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'password',
                    oldPassword: oldPasswordInput.value,
                    newPassword: newPasswordInput.value
                })
            });

            const data = await res.json();
            console.log(data);

            if (data.success === 'success') {
                dialogPassword.close();

                const successfulMessage = document.createElement('div');
                successfulMessage.classList.add('successfulMessage');
                successfulMessage.innerHTML = `Successfully updated password`;
                messageContainer.appendChild(successfulMessage);
                successfulMessage.classList.add('active');
                setTimeout(() => {
                    messageContainer.removeChild(successfulMessage);
                }, 5000);
            } else {
                errorMessage.textContent = data.message || '*Failed to update password*';
                errorMessage.style.display = 'block';
            }

        } catch (err) {
            console.error(err);
            errorMessage.textContent = '*Server error, please try again later*';
            errorMessage.style.display = 'block';
        }
    };
    
    dialogPassword.showModal();
}

function updateSecurityQuestion(){
    const confirmBtn = dialogSecurityQuestion.querySelector('.saveButton');
    const questionSelect = dialogSecurityQuestion.querySelector('#securityQuestion');
    const answerInput = dialogSecurityQuestion.querySelector('#securityAnswer');
    const errorMessage = dialogSecurityQuestion.querySelector('.errorMessage');

    resetDialog(dialogSecurityQuestion);

    confirmBtn.onclick = () =>{
        if (questionSelect.value === 'default') {
            errorMessage.textContent = '*Please select a security question*';
            errorMessage.style.display = 'block';
        } else if (!answerInput.value.trim()) {
            errorMessage.textContent = '*Please provide an answer*';
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
            
            fetch('update_user_info.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'security',
                    question: questionSelect.value,
                    answer: answerInput.value
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                alert(data.message);
            });

            dialogSecurityQuestion.close();

            const successfulMessage = document.createElement('div');
            successfulMessage.classList.add('successfulMessage');
            successfulMessage.innerHTML = `Successfully update Security Q&A`
            messageContainer.appendChild(successfulMessage);
            successfulMessage.classList.add('active');
            setTimeout(() => {
                messageContainer.removeChild(successfulMessage);
            }, 5000);
        }
    };
    
    dialogSecurityQuestion.showModal();
}

async function logoutUser(){
    await fetch('logout.php');
    window.location.href = '2-log_in.php';
}

document.querySelectorAll('.closeBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        const dialog = btn.closest('dialog');
        if(dialog) dialog.close();
    });
});

const eyeicons = document.querySelectorAll(".eyeicon");

eyeicons.forEach((icon)=> {
    icon.addEventListener('click', ()=>{
        const input = icon.previousElementSibling;
        if (input.type === "password"){
            input.type = "text";
            icon.src = './images/password_active.svg';
        } else{
            input.type = "password";
            icon.src = './images/password_inactive.svg';
        }
    })
})

function renderInbox(pendingProjects){
    const container = document.querySelector('.sectionContent-IBX');
    container.innerHTML = ``;

    if(pendingProjects.length === 0){
        container.classList.add('noMessage');
        container.innerHTML = `
            <h4>You have no pending project invitations.</h4>
        `;
    }else{
        for(const project of pendingProjects){
            const notif = document.createElement('div');
            notif.classList.add('notif');
            
            const userAvatar = document.createElement('div');
            userAvatar.classList.add('userAvatar');
            
            const teamLeader = project.TeamLeader;
            userAvatar.textContent = teamLeader.FullName.charAt(0).toUpperCase();

            userAvatar.style.setProperty('--teamleader-avatar', `var(${teamLeader.AvatarColor})`);
            
            const info = document.createElement('h5');
            info.classList.add('info');
            info.textContent = `
                ${teamLeader.FullName} has invited you to join the project '${project.ProjectName}'
            `;

            const buttonWrapper = document.createElement('div');
            buttonWrapper.classList.add('buttonWrapper');
            
            const acceptBtn = document.createElement('button');
            acceptBtn.classList.add('accept');
            acceptBtn.textContent = 'Accept';

            const rejectBtn = document.createElement('button');
            rejectBtn.classList.add('reject');
            rejectBtn.textContent = 'Reject';

            buttonWrapper.appendChild(acceptBtn);
            buttonWrapper.appendChild(rejectBtn);

            notif.appendChild(userAvatar);
            notif.appendChild(info);
            notif.appendChild(buttonWrapper);

            rejectBtn.addEventListener('click', async () => {
                try{
                    const res = await fetch('update_member_status.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userID: currentUserID,
                            status: 'Rejected',
                            projectID: project.ProjectID,
                        })
                    });

                    const data = await res.json();
                    console.log(data);

                    if (data.status === 'ok') {
                        const successfulMessage = document.createElement('div');
                        successfulMessage.classList.add('successfulMessage');
                        successfulMessage.innerHTML = `Rejected joined project: ${project.ProjectName}`;
                        messageContainer.appendChild(successfulMessage);
                        successfulMessage.classList.add('active');

                        setTimeout(() => {
                            successfulMessage.remove();
                        }, 5000);

                        pendingProjects.splice(project);
                        renderInbox(pendingProjects);
                    }
                }
                catch (err) {
                    console.error('Error updating member status:', err);
                }
            });

            acceptBtn.addEventListener('click', async () => {
                try{
                    const res = await fetch('update_member_status.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userID: currentUserID,
                            status: 'Active',
                            projectID: project.ProjectID,
                        })
                    });

                    const data = await res.json();
                    console.log(data);

                    if (data.status === 'ok') {
                        const successfulMessage = document.createElement('div');
                        successfulMessage.classList.add('successfulMessage');
                        successfulMessage.innerHTML = `Successfully joined project: ${project.ProjectName}`;
                        messageContainer.appendChild(successfulMessage);
                        successfulMessage.classList.add('active');

                        setTimeout(() => {
                            successfulMessage.remove();
                        }, 5000);

                        pendingProjects.splice(project);
                        renderInbox(pendingProjects);
                    }
                }
                catch (err) {
                    console.error('Error updating member status:', err);
                }
            });



            container.appendChild(notif);
        }
    }
}

function renderTasks(tasks, todayD) {
    const sortedTasks = tasks.sort((a, b) => new Date(a.DueDate) - new Date(b.DueDate));
    const TOTWcontainer = document.querySelector('.sectionContent-TOTW');
    const THTYcontainer = document.querySelector('.sectionContent-THTY');

    TOTWcontainer.innerHTML = '';
    THTYcontainer.innerHTML = '';

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
        desc.innerHTML = `
            <p class="projectName">${task.ProjectName}</p>
            <p class="dueDate">${formatDate(task.DueDate)}</p>
        `;
        
        taskEl.appendChild(taskTitle);
        taskEl.appendChild(desc);

        taskEl.addEventListener('click', () => {
            redirecToTask(task.TaskID, task.ProjectID);
        })
        return taskEl;
    }

    const tasksOTW = sortedTasks.filter(task => task.Status === 'OTW');
    const tasksHTW = sortedTasks.filter(task => task.Status === 'HTY');

    if(tasksOTW.length === 0){
        TOTWcontainer.classList.add('noMessage');
        TOTWcontainer.innerHTML = `
            <h4>No tasks on the way — steady lah!</h4>
        `;
    }else{
        tasksOTW.forEach(task => {
            const taskEl = createTaskEl(task);
            let backgroundColor = 'transparent';

            if(task.DueDate < todayD){
                backgroundColor = 'var(--overdue-color)'; 
            }
            else{
                backgroundColor = 'var(--in-progress-color)';
            }

            taskEl.style.backgroundColor = backgroundColor;
            TOTWcontainer.appendChild(taskEl);
        });
    }

    if(tasksHTW.length === 0){
        THTYcontainer.classList.add('noMessage');
        THTYcontainer.innerHTML = `
            <h4>Nothing waiting to start — enjoy your free time lah!</h4>
        `;
    }else{
        tasksHTW.forEach(task => {
            const taskEl = createTaskEl(task);
            let backgroundColor = 'transparent';

            if(task.DueDate < todayD){
                backgroundColor = 'var(--overdue-color)'; 
            }
            else{
                backgroundColor = 'var(--unassigned-color-code)';
            }

            taskEl.style.backgroundColor = backgroundColor;
            THTYcontainer.appendChild(taskEl);
        });
    }
}

async function fetchAndRenderTasks() {
    try {
        const res = await fetch('get_user_tasks.php', {
            credentials: 'same-origin'
        });

        if (!res.ok) {
            console.error('Failed to fetch tasks', res.status);
            return;
        }

        const data = await res.json();
        if (data.status !== 'ok') {
            console.error('Server returned error', data);
            return;
        }

        const tasks = data.tasks.map(t => ({
            ...t,
            StartDate: t.StartDate ? new Date(t.StartDate) : null,
            DueDate: t.DueDate ? new Date(t.DueDate) : null
        }));

        renderTasks(tasks, new Date());
    } catch (err) {
        console.error('Error fetching tasks:', err);
    }
}

async function fetchPendingProjects(){
    try {
        const res = await fetch('get_pending_projects.php', {
            credentials: 'same-origin'
        });

        if (!res.ok) {
            console.error('Failed to fetch projects', res.status);
            return;
        }

        const data = await res.json();
        if (data.status !== 'ok') {
            console.error('Server returned error', data);
            return;
        }

        const pendingProjects = data.pendingProjects;
        renderInbox(pendingProjects);
        console.log(pendingProjects);
    } catch (err) {
        console.error('Error fetching tasks:', err);
    }
}

async function redirecToTask(TaskID, ProjectID){
    const taskID = TaskID;
    const projectID = ProjectID;
    
    const res = await fetch('set_current_project.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ProjectID: projectID })
    });

    const data = await res.json();

    if (data.status === 'ok') {
        const res2 = await fetch('store_selected_task.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ TaskID: taskID })
        });

        const data2 = await res2.json();
        if (data2.status === 'ok') {
            window.location.href = '6-projectTasks.php';
        } else {
            console.error('❌ Failed to store task:', data2.message);
        }
    } else {
        console.error('❌ Failed to set project:', data.message);
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    await fetchAndRenderTasks();
    await fetchPendingProjects();
});