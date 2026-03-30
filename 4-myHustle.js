const filterOption = document.querySelector('.filterOption');
const filter = document.querySelector('.filter');

filter.addEventListener('click', () => {
    filterOption.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if(filterOption.classList.contains('active')){
        if(!filter.contains(e.target) && !filterOption.contains(e.target)){
            filterOption.classList.remove('active');
        }
    }
});

function generateProjectList(projects){
    const container = document.querySelector('.projectList');
    container.innerHTML = '';

    projects.forEach(project => {
        const projectPanel = document.createElement('a');
        projectPanel.classList.add('project');
        projectPanel.classList.add('panel');
        projectPanel.addEventListener('click', async (e) => {
            e.preventDefault();

            const res = await fetch('set_current_project.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ProjectID: project.ProjectID })
            });

            const data = await res.json();
            if(data.status === 'ok'){
                window.location.href = '5-projectSummary.php';
            } else {
                console.error('❌', data.message);
            }
        });

        const projectAvatar = document.createElement('div');
        projectAvatar.classList.add('projectAvatar');

        const memberAvatar1 = document.createElement('div');
        if(!project.member2 && !project.member3) memberAvatar1.classList.add('memberAvatar');
        else memberAvatar1.classList.add('memberAvatar1');
        
        memberAvatar1.textContent = project.member1;
        memberAvatar1.style.backgroundColor = `var(${project.member1Style})`;
        projectAvatar.appendChild(memberAvatar1);

        if(project.member2){
            const memberAvatar2 = document.createElement('div');
            memberAvatar2.classList.add('memberAvatar2');
            memberAvatar2.textContent = project.member2;
            memberAvatar2.style.backgroundColor = `var(${project.member2Style})`;
            projectAvatar.appendChild(memberAvatar2);
        }

        if(project.member3){
            const memberAvatar3 = document.createElement('div');
            memberAvatar3.classList.add('memberAvatar3');
            memberAvatar3.textContent = project.member3;
            memberAvatar3.style.backgroundColor = `var(${project.member3Style})`;
            projectAvatar.appendChild(memberAvatar3);
        }

        const projectTitle = document.createElement('h3');
        projectTitle.classList.add('projectTitle');
        projectTitle.textContent = project.name;

        projectPanel.appendChild(projectAvatar);
        projectPanel.appendChild(projectTitle);
        container.appendChild(projectPanel);
    });

    const createProjectPanel = document.createElement('div');
    createProjectPanel.classList.add('createProject');
    createProjectPanel.classList.add('panel');
    createProjectPanel.id = 'createProject';
    createProjectPanel.innerHTML = `
        <div id="state1" class="active">
            <div class="createProjectWrapper1">
                <div class="createIcon">
                    <svg class="plus" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_i)">
                            <path d="M320 187.042V132.957C264.39 139.641 213.986 142.19 169.879 142.473C171.037 76.8795 180.378 26.9345 187.039 0H132.955C142.734 51.6498 147.031 99.669 148.045 142.432C85.4663 141.792 37.3113 136.812 7.20135 133.699C4.6738 133.437 2.2711 133.189 0 132.957V187.042C54.2205 179.176 104.131 176.279 148.19 176.038C147.181 242.365 138.708 292.862 132.955 320H187.039C175.987 267.771 171.141 219.255 170.021 176.132C227.596 176.941 273.705 182 304.387 185.365C310.143 185.997 315.356 186.569 320 187.042Z" fill="#F8F8F1"/>
                        </g>
                        <defs>
                            <filter id="filter0_i" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_innerShadow"/>
                            <feOffset/>
                            <feGaussianBlur stdDeviation="8.75"/>
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
                            </filter>
                        </defs>
                    </svg>
                </div>
                <h3 class="projectTitle">Create or Join</h3>
            </div>
        </div>
        <div id="state2">
            <div class="createProjectWrapper2">
                <div>
                    <h4>Crate a Project</h4>
                    <div class="inputWrapper">
                        <input type="text" name="projectName" id="projectName" placeholder="Enter Project Name">
                        <button class="confirmBtn" id="createProjectBtn"></button>
                    </div>
                </div>

                <h4>-or-</h4>
                
                <div>
                    <h4>Join a Project</h4>
                    <div class="inputWrapper">
                        <input type="text" name="projectCode" id="projectCode" placeholder="Enter Invite Code">
                        <button class="confirmBtn" id="joinProjectBtn"></button>
                    </div>
                </div>
                <label for="" class="errorMessage">*Error Message*</label>
                <div class="cancelBtn">Cancel</div>
            </div>
        </div>
    `;

    container.appendChild(createProjectPanel);

    const state1 = createProjectPanel.querySelector('#state1');
    const state2 = createProjectPanel.querySelector('#state2');
    const createProjectBtn = createProjectPanel.querySelector('#createProjectBtn');
    const joinProjectBtn = createProjectPanel.querySelector('#joinProjectBtn');
    const errorMessage = createProjectPanel.querySelector('.errorMessage');

    createProjectPanel.addEventListener('click', () => {
        state1.classList.remove('active');
        state2.classList.add('active');

        const nameInput = createProjectPanel.querySelector('#projectName');
        const codeInput = createProjectPanel.querySelector('#projectCode');
        nameInput.value = '';
        codeInput.value = '';
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    })

    state2.querySelector('.cancelBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        state1.classList.add('active');
        state2.classList.remove('active');

        const nameInput = createProjectPanel.querySelector('#projectName');
        const codeInput = createProjectPanel.querySelector('#projectCode');
        nameInput.value = '';
        codeInput.value = '';
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    })


    createProjectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const nameInput = createProjectPanel.querySelector('#projectName');
        const title = nameInput.value.trim();

        let message = '';
        if(title === '' || !title){
            message = 'Project name field is empty.';
        }
        
        if(message){
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }else{
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';

            const payload = {
                ProjectName: title,
                Description: 'Description. Say Somethin'
            };

            fetch('create_project.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok') {
                    console.log('✅ Project created:', data);
                    fetchProjects();

                    const successfulMessage = document.createElement('div');
                    successfulMessage.classList.add('successfulMessage');
                    successfulMessage.innerHTML = `Successfully created project: "${title}"`
                    messageContainer.appendChild(successfulMessage);
                    successfulMessage.classList.add('active');
                    setTimeout(() => {
                        messageContainer.removeChild(successfulMessage);
                    }, 5000);
                } else {
                    console.error('❌ Error:', data.message);
                }
            });
        }
        
    });

    joinProjectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const codeInput = createProjectPanel.querySelector('#projectCode');
        const code = codeInput.value.trim();

        let message = '';
        if(code === '' || !code){
            message = 'Invite code field is empty.';
        }
        
        if(message){
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }else{
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
            const payload = { InviteCode: code };

            fetch('join_project.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok') {
                    console.log('✅ Joined project:', data);
                    fetchProjects();
                    
                    const successfulMessage = document.createElement('div');
                    successfulMessage.classList.add('successfulMessage');
                    successfulMessage.innerHTML = `Successfully joined project: "${data.ProjectName}"`
                    messageContainer.appendChild(successfulMessage);
                    successfulMessage.classList.add('active');
                    setTimeout(() => {
                        messageContainer.removeChild(successfulMessage);
                    }, 5000);
                } else {
                    errorMessage.textContent = data.message;
                    errorMessage.style.display = 'block';
                    console.error('❌', data.message);
                }
            });
        }
    });

    
}


let projects = [];

async function fetchProjects() {
    const res = await fetch('get_projects.php', { credentials: 'same-origin' });
    const data = await res.json();

    if (data.status === 'ok') {
        projects = data.projects;
        generateProjectList(projects);
    } else {
        console.error('❌ Error:', data.message);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchProjects();

    const message = sessionStorage.getItem('deleteSuccess');
    if (message) {
        console.log(message);
        const messageContainer = document.querySelector('.messageDialog');
        const successfulMessage = document.createElement('div');
        successfulMessage.classList.add('successfulMessage', 'active');
        successfulMessage.textContent = message;
        console.log(successfulMessage);
        messageContainer.appendChild(successfulMessage);
        setTimeout(() => {
            successfulMessage.classList.remove('active');
            messageContainer.removeChild(successfulMessage);
        }, 5000);

        sessionStorage.removeItem('deleteSuccess');
    }
});


const individualCheckbox = document.getElementById('individual');
const groupCheckbox = document.getElementById('group');

function applyFilter(){
    const showIndividual = individualCheckbox.checked;
    const showGroup = groupCheckbox.checked;

    const filteredProjects = projects.filter(project => {
        const isIndividual = !project.member2 && !project.member3;
        const isGroup = project.member2 || project.member3;

        if(isIndividual && showIndividual) return true;
        if(isGroup && showGroup) return true;
        return false;
    });

    generateProjectList(filteredProjects);
}

const searchInput = document.querySelector('.searchBar input');
const searchIcon = document.querySelector('.searchBar .searchIcon');
const clearSearchInput = document.querySelector('.searchBar #closeBtn');

clearSearchInput.addEventListener('click', () => {
    searchInput.value = '';
    generateProjectList(projects);
})

function searchProjects(){
    const keyword = searchInput.value.trim().toLowerCase();

    if(keyword === ''){
        generateProjectList(projects);
        return;
    }

    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(keyword)
    );

    generateProjectList(filteredProjects);
}

searchInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        e.preventDefault();
        searchProjects();
    }
});

searchIcon.addEventListener('click', searchProjects);
individualCheckbox.addEventListener('change', applyFilter);
groupCheckbox.addEventListener('change', applyFilter);