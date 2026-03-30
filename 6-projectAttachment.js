let tasks = [];
let members = [];
let users = [];
let comments = [];
let taskAttachments = [];
let commentAttachments = [];
let loggedInUserRole = 'Team Member';
let loggedInUserID = null;

const supportedTypes = [
    "CSV","PDF","DOCX","DOC","PUB","TXT","XSL","PPT",
    "MDB","ZIP","RAR","ISO","EXE","DLL","PSD","AI",
    "PS","CRD","SVG","EPS","DWG","BMP","JPG","TIFF",
    "RAW","PNG","GIF","FLV","AVI","MPEG","MOV","MP4",
    "WMA","MP3","MID","WAV","JAVA","RSS","XML","HTML",
    "FILE", "WEBP", "GIF", "BMP"
];

const previewType = [
    "JPG", "PNG", "SVG", "WEBP"
];

function timeAgo(pastTime) {
    const now = new Date();
    const past = new Date(pastTime);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffMin < 1) return 'Just now';
    if (diffHr < 1) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffDay < 1)
        return diffMin % 60 === 0
            ? `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`
            : `${diffHr}h ${diffMin % 60}m ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
    if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
    return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
}

function generateAttachmentList(taskAttachments){
    const attachmentWrapper = document.querySelector('.attachmentWrapper');
    attachmentWrapper.innerHTML = '';

    if(taskAttachments.length === 0){
        const empty = document.createElement('div');
        empty.classList.add('empty');
        const message = document.createElement('h4');
        message.textContent = `Your tasks don’t have any submitted files yet.`;

        empty.appendChild(message);
        attachmentWrapper.appendChild(empty);
    }

    for(const task of tasks){
        let works = [];
        works = taskAttachments.filter(a => a.TaskID === task.TaskID);
        if(works.length > 0){
            const taskSection = document.createElement('div');
            taskSection.classList.add('taskSection');

            const sectionHeader = document.createElement('div');
            sectionHeader.classList.add('sectionHeader');

            const taskName = document.createElement('span');
            taskName.innerHTML = `<h4>${task.TaskTitle}</h4>`;

            taskName.addEventListener('click', () => {
                redirecToTask(task.TaskID, project.ProjectID);
            });

            const toggleArrowSpan = document.createElement('span');
            const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            arrowSvg.setAttribute('class', 'sectionToggleArrow');
            arrowSvg.setAttribute('viewBox', '0 0 24 16');
            arrowSvg.setAttribute('fill', 'none');

            const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            arrowPath.setAttribute('d', 'M22 14L11.5455 3L2 14');

            arrowSvg.appendChild(arrowPath);

            arrowSvg.addEventListener('click', ()=>{
                const header = arrowSvg.closest('.sectionHeader');
                const content = header.nextElementSibling;
                content.classList.toggle('hide');
                arrowSvg.classList.toggle('hide');
            });

            toggleArrowSpan.appendChild(arrowSvg);

            const redirectSpan = document.createElement('span');
            const redirectSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            redirectSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            redirectSvg.setAttribute('fill', 'none');
            redirectSvg.setAttribute('viewBox', '0 0 24 24');
            redirectSvg.setAttribute('class', 'redirectToggle');

            const redirectPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            redirectPath.setAttribute('d', 'm4.5 19.5 15-15m0 0H8.25m11.25 0v11.25');

            redirectSvg.appendChild(redirectPath);
            redirectSpan.appendChild(redirectSvg);

            redirectSpan.addEventListener('click', () => {
                redirecToTask(task.TaskID, project.ProjectID);
            });

            sectionHeader.appendChild(taskName);
            sectionHeader.appendChild(redirectSpan);
            sectionHeader.appendChild(toggleArrowSpan);

            const attachments = document.createElement('div');
            attachments.classList.add('attachments');

            for(const a of works){
                const attachmentCard = document.createElement('div');
                attachmentCard.classList.add('attachmentCard');

                const preview = document.createElement('span');
                const img = document.createElement('img');
                if(previewType.includes(a.FileType)){
                    img.src = a.FilePath;
                    img.alt = a.FileName;
                }
                else if(supportedTypes.includes(a.FileType)){
                    preview.classList.add('noPreview');
                    img.src = `./images/file_icon/${a.FileType}.svg`;
                    img.alt = `${a.FileType} icon`;
                }else{
                    preview.classList.add('noPreview');
                    img.src = `./images/file_icon/FILE.svg`;
                    img.alt = `FILE icon`;
                }

                preview.appendChild(img);

                const downloadBtn = document.createElement('button');
                downloadBtn.classList.add('downloadIcon');
                downloadBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                `;

                downloadBtn.addEventListener('click', () => {
                    const link = document.createElement('a');
                    link.href = a.FilePath || '#';
                    link.download = a.FileName;
                    link.click();
                });

                const attachmentCardDetail = document.createElement('div');
                attachmentCardDetail.classList.add('attachmentCardDetail');

                const attachmentName = document.createElement('p');
                attachmentName.classList.add('attachmentName');
                attachmentName.textContent = a.FileName;

                const attachmentTime = document.createElement('p');
                attachmentTime.classList.add('attachmentTime');
                attachmentTime.textContent = timeAgo(new Date(a.UploadTime));

                attachmentCardDetail.appendChild(attachmentName);
                attachmentCardDetail.appendChild(attachmentTime);
                
                attachmentCard.appendChild(preview);
                attachmentCard.appendChild(downloadBtn);
                attachmentCard.appendChild(attachmentCardDetail);


                attachmentCard.addEventListener('click', () => {
                    triggerPreviewDialog(a);
                });

                attachments.appendChild(attachmentCard);
            }

            taskSection.appendChild(sectionHeader);
            taskSection.appendChild(attachments);

            attachmentWrapper.appendChild(taskSection);
        }
    };
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

            generateAttachmentList(taskAttachments);
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
});