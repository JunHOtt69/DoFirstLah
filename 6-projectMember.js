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


function generateMemberTable(loggedInUserRole, members, tasks){
    const container = document.querySelector('.tableContent');
    container.innerHTML = '';

    const activeMember = members.filter(member => {
        if(member.Status === 'Pending' || member.Status === 'Removed' || member.Status === 'Rejected') return false;
        else return true;
    })

    activeMember.forEach((member, index) => {
        const memberEl = document.createElement('div');
        memberEl.classList.add('member');

        const firstLetter = member.FullName.charAt(0).toUpperCase();
        memberEl.style.setProperty('--avatar-name', `"${firstLetter}"`);
        memberEl.style.setProperty('--avatar-color', `var(${member.AvatarColor})`);

        const memberName = document.createElement('p');
        memberName.classList.add('memberName');
        memberName.textContent = member.FullName;

        const role = document.createElement('div');
        role.classList.add('role');

        const memberRole = document.createElement('p');
        memberRole.textContent = member.Role;

        
        const btn = document.createElement('button');
        btn.classList.add('toggleRoleBtn');
        btn.innerHTML = `
            <svg viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 14L11.5455 3L2 14"/>
            </svg>
        `;

        const rolePopups = document.querySelector('.rolePopups')

        role.appendChild(memberRole);

        if(loggedInUserRole.Role === 'Team Leader' || loggedInUserRole.Role === 'Project Manager'){
            if(member.Role !== 'Team Leader' && member.UserID !== loggedInUserRole.UserID){
                role.appendChild(btn);
                role.addEventListener('click', (e) => {
                    e.stopPropagation();

                    const rect = role.getBoundingClientRect();
                    const topVW = (rect.bottom + window.scrollY) / window.innerWidth * 100;
                    const leftVW = (rect.left + window.scrollX) / window.innerWidth * 100;
                    rolePopups.style.top = `${topVW}vw`;
                    rolePopups.style.left = `${leftVW}vw`;
                    rolePopups.classList.add('show');

                    rolePopups.dataset.activeMember = index;
                });
            }
        } 

        const currentTaskWrapper = document.createElement('div');
        currentTaskWrapper.classList.add('currentTask');

        const taskDueDateWrapper = document.createElement('div');
        taskDueDateWrapper.classList.add('taskDueDate');

        const relatedTask = tasks.filter(task => task.AssignedUserID === member.UserID)

        const status = document.createElement('p');
        status.classList.add('status');
        if(relatedTask.length !== 0){
            status.textContent = 'In Progress';
        }else{
            status.textContent = member.Status;
        }

        relatedTask.forEach(task => {
            const taskLink = document.createElement('p');
            taskLink.textContent = task.TaskTitle;

            taskLink.addEventListener('click', async () => {
                const taskID = task.TaskID;
                const projectID = task.ProjectID;
                
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
            })

            const taskDueDate = document.createElement('p');
            let dueDateY = task.DueDate.getFullYear();
            let dueDateM = task.DueDate.getMonth() + 1;
            let dueDateDate = task.DueDate.getDate();
            taskDueDate.innerHTML = `${dueDateDate}<sup>${daySuffix(dueDateDate)}</sup> ${months[dueDateM]} ${dueDateY}`;

            currentTaskWrapper.appendChild(taskLink);
            taskDueDateWrapper.appendChild(taskDueDate);
        })

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
        `

        if(loggedInUserRole.Role === 'Team Leader' || loggedInUserRole.Role === 'Project Manager'){
            if(member.Role !== 'Team Leader' && member.UserID !== loggedInUserRole.UserID){
                deleteBtn.style.visibility = 'visible';
                deleteBtn.style.pointerEvents = 'auto';
                deleteBtn.addEventListener('click', (e) => {
                    const confirmation = document.querySelector('.confirmationDialog');
                    const cancelButton = confirmation.querySelector('.cancel');
                    const confirmButton = confirmation.querySelector('.confirm');

                    const title = confirmation.querySelector('h3');

                    title.textContent = `Do you confirm to delete this member: ${member.FullName}? `;

                    cancelButton.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        confirmation.close();
                    };

                    confirmButton.onclick = async () => {
                        try {
                            const response = await fetch('remove_member.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                    ProjectID: project.ProjectID,
                                    UserID: member.UserID 
                                })
                            });

                            const result = await response.json();

                            if (result.status === 'ok') {
                                confirmation.close();

                                const index = members.findIndex(m => m.UserID === member.UserID);
                                if (index !== -1) members[index].Status = 'Removed';

                                generateMemberTable(loggedInUserRole, members, tasks);

                                const successfulMessage = document.createElement('div');
                                successfulMessage.classList.add('successfulMessage');
                                successfulMessage.innerHTML = `Successfully removed member "${member.FullName}"`;
                                messageContainer.appendChild(successfulMessage);
                                successfulMessage.classList.add('active');
                                setTimeout(() => {
                                    messageContainer.removeChild(successfulMessage);
                                }, 5000);

                            } else {
                                console.error('❌ Failed to remove member:', result.message);
                            }

                        } catch (err) {
                            console.error('❌ Error removing member:', err);
                        }
                    };

                    confirmation.showModal();
                });
            }
        } 

        memberEl.appendChild(memberName);
        memberEl.appendChild(role);
        memberEl.appendChild(status);
        memberEl.appendChild(currentTaskWrapper);
        memberEl.appendChild(taskDueDateWrapper);
        memberEl.appendChild(deleteBtn);

        container.appendChild(memberEl);
    })
}

function generatePendingMember(members){
    const container = document.querySelector('.pendingWrapper');
    container.innerHTML = '';
    
    const pendingMember = members.filter(member => member.Status === 'Pending');

    pendingMember.forEach(member => {
        console.log(member.UserID);
        const memberEl = document.createElement('div');
        memberEl.classList.add('member');

        const firstLetter = member.FullName.charAt(0).toUpperCase();
        memberEl.style.setProperty('--avatar-name', `"${firstLetter}"`);
        memberEl.style.setProperty('--avatar-color', `var(${member.AvatarColor})`);

        const memberName = document.createElement('p');
        memberName.classList.add('memberName');
        memberName.textContent = member.FullName;

        const btn = document.createElement('button');
        btn.classList.add('removeBtn');
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        `;

        btn.addEventListener('click', async () =>{
            const index = members.findIndex(m => m.userID === member.UserID);
            if(index !== 1){
                members.splice(index, 1);
            }
            
            container.removeChild(memberEl);
            try {
                const res = await fetch('remove_pending_member.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userID: member.UserID })
                });
                const data = await res.json();
                if(data.status === 'ok'){
                    console.log(`Pending member ${member.FullName} removed`);
                } else {
                    console.error('❌ Failed to remove pending member:', data.message);
                }
            } catch(err) {
                console.error('❌ Error removing pending member:', err);
            }
        })

        memberEl.appendChild(memberName);
        memberEl.appendChild(btn);
        container.appendChild(memberEl);
    })
}

const toggleRoleBtn = document.querySelectorAll('.toggleRoleBtn');
const rolePopups = document.querySelector('.rolePopups');
const searchInput = document.querySelector('.searchBar input');
const searchIcon = document.querySelector('.searchBar .searchIcon');
const clearSearchInput = document.querySelector('.searchBar #closeBtn');
const projectCodeLabel = document.querySelector('#inviteCode h4');
const copyICBtn = document.querySelector('#copyICBtn');
const targetEmail = document.querySelector('#targetEmail');
const sendBtn = document.querySelector('.inputWrapper .sendBtn');
const suggestionPopUps = document.querySelector('.suggestionPopUps');

projectCodeLabel.innerHTML = `<h4>Project Code: ${project.InviteCode}</h4>`;
copyICBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(project.InviteCode)
        .then(() => {
            const successfulMessage = document.createElement('div');
            successfulMessage.classList.add('successfulMessage');
            successfulMessage.innerHTML = `Invite code copied to clipboard!`
            messageContainer.appendChild(successfulMessage);
            successfulMessage.classList.add('active');
            setTimeout(() => {
                messageContainer.removeChild(successfulMessage);
            }, 5000);
        })
        .catch(err => {
            console.error('Failed to copy invite code: ', err);
        });
});

clearSearchInput.addEventListener('click', () => {
    searchInput.value = '';
    generateMemberTable(loggedInUserRole, members, tasks);
})

function searchMembers(){
    const keyword = searchInput.value.trim().toLowerCase();

    if(keyword === ''){
        generateMemberTable(loggedInUserRole, members, tasks);
        return;
    }

    const filteredMembers = members.filter(member => 
        member.FullName.toLowerCase().includes(keyword)
    );

    generateMemberTable(loggedInUserRole, filteredMembers, tasks);
}

searchInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        e.preventDefault();
        searchMembers();
    }
});

document.addEventListener('click', (e) =>{
    if(
        !(toggleRoleBtn.forEach(btn => btn.contains(e.target))) &&
        !rolePopups.contains(e.target)
    ){
        rolePopups.classList.remove('show');
    }
    if(
        !targetEmail.contains(e.target) &&
        !sendBtn.contains(e.target) &&
        !suggestionPopUps.contains(e.target)
    ){
        suggestionPopUps.classList.remove('show');
    }
});

document.querySelectorAll('.rolePopups .option').forEach(opt => {
    opt.addEventListener('click', async () => {
        const activeIndex = rolePopups.dataset.activeMember;
        if (activeIndex === undefined) return;

        const member = members[activeIndex];
        member.Role = opt.textContent;
        generateMemberTable(loggedInUserRole, members, tasks);

        await fetch('update_member_role.php', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ userID: member.UserID, role: member.Role })
        }).then(res => res.json()).then(data => console.log(data));
    });
});

targetEmail.addEventListener('input', () => {
    const keyword = targetEmail.value.trim().toLowerCase();
    const container = document.querySelector('.suggestionPopUps');
    const sendBtn = document.querySelector('.inputWrapper .sendBtn');
    container.innerHTML = '';


    if(keyword === ''){
        suggestionPopUps.classList.remove('show');
        return;
    }

    let userNotInProject = [];
    users.forEach(user => {
        if(!members.some(member => member.UserID === user.UserID)){
            userNotInProject.push(user);
        }
    });
    console.log(userNotInProject);
    members.forEach(m => {
        if(m.Status !== 'Active'){
            userNotInProject.push(users.find(u => u.UserID === m.UserID));
        }
    });
    console.log(userNotInProject);

    const filteredUsers = userNotInProject.filter(user => 
        user.Email.toLowerCase().includes(keyword)
    );
        
    filteredUsers.forEach(user => {
        const userEl = document.createElement('div');
        userEl.classList.add('member');
        userEl.innerHTML = `
            <h5 class="name">${user.FullName}</h5>
            <p class="email">${user.Email}</p>
        `;

        const firstLetter = user.FullName.charAt(0).toUpperCase();
        userEl.style.setProperty('--avatar-name', `"${firstLetter}"`);
        userEl.style.setProperty('--avatar-color', `var(${user.AvatarColor})`);

        userEl.addEventListener('click', () => {
            inviteUser(user);
        });

        container.appendChild(userEl);
    });
    
    if(filteredUsers.length > 0){
        suggestionPopUps.classList.add('show');

        sendBtn.onclick = () => {
            const firstUser = filteredUsers[0];
            inviteUser(firstUser);
        }
    }else{
        suggestionPopUps.classList.remove('show');
        sendBtn.onclick = null;
    }

    async function inviteUser(user){
        members.push({
            UserID: user.UserID,
            FullName: user.FullName,
            AvatarColor: user.AvatarColor,
            Role: '',
            Status: 'Pending'
        });

        generatePendingMember(members);

        suggestionPopUps.classList.remove('show');

        targetEmail.value = '';

        const successfulMessage = document.createElement('div');
        successfulMessage.classList.add('successfulMessage');
        successfulMessage.innerHTML = `Invitation sent!`
        messageContainer.appendChild(successfulMessage);
        successfulMessage.classList.add('active');
        setTimeout(() => {
            messageContainer.removeChild(successfulMessage);
        }, 5000);

        await fetch('invite_member.php', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ userID: user.UserID })
        }).then(res => res.json()).then(data => console.log(data));
    }
});

let tasks = [];
let members = [];
let users = [];
let loggedInUserRole = 'Team Member';

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
            const filteredActiveMember = members.filter(m => m.Status === 'Active');

            loggedInUserRole = members.find(m => m.UserID === currentUserID);

            generateMemberTable(loggedInUserRole, members, tasks);
            generatePendingMember(members);
            generateProjectAvatar(filteredActiveMember);
        } else {
            console.error('❌ Error:', data.message);
        }
    } catch (err) {
        console.error('❌ Failed to fetch project summary:', err);
    }
}

document.addEventListener('DOMContentLoaded', fetchProjectData);