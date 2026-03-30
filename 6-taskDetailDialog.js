const showDescription = document.querySelector('.showDescription');
const hideDescription = document.querySelector('.hideDescription');
const descriptionEdit = document.getElementById('taskDescription');
const descriptionView = document.getElementById('taskDescriptionView');
const saveDescription = document.getElementById('saveDescription');
const cancelDescription = document.getElementById('cancelDescription');
let isEdited = false;
const attachmentIcon = document.getElementById('attachmentIcon');

const attachedFiles = document.querySelectorAll('.attachedFile');

showDescription.addEventListener('click', () => {
    hideDescription.classList.remove('hide');
    showDescription.classList.add('hide');
    descriptionView.classList.remove('collapsed');
})

hideDescription.addEventListener('click', () => {
    hideDescription.classList.add('hide');
    showDescription.classList.remove('hide');
    descriptionEdit.classList.add('hide');
    descriptionView.classList.remove('hide');
    descriptionView.classList.add('collapsed');
})

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

autoResize(descriptionEdit);

descriptionView.addEventListener('click', () => {
    descriptionEdit.classList.remove('hide');
    descriptionEdit.focus();
    autoResize(descriptionEdit);
    descriptionView.classList.add('hide');
    hideDescription.classList.remove('hide');
    showDescription.classList.add('hide');
    isEdited = false;
});

descriptionEdit.addEventListener('input', () => {
    isEdited = true;
    saveDescription.classList.remove('hide');
    cancelDescription.classList.remove('hide');
    hideDescription.classList.add('hide');
    showDescription.classList.add('hide');
    autoResize(descriptionEdit);

    const parent = descriptionEdit.closest('.taskDescription');
    const maxHeight = parent.clientHeight;

    if(descriptionEdit.scrollHeight > maxHeight){
        descriptionEdit.style.height = maxHeight + 'px';
        descriptionEdit.style.overflowY = 'auto';
    }else{
        descriptionEdit.style.overflowY = 'hidden';
    }
})

attachedFiles.forEach((el) => {
    const fileName = el.querySelector('.fileName');

    el.addEventListener('click', () => {
        fileName.classList.add('expanded');
    })

    document.addEventListener('click', e => {
        if(!el.contains(e.target)){
            fileName.classList.remove('expanded');
        }
    })
})

const supportedTypes = [
    "CSV","PDF","DOCX","DOC","PUB","TXT","XSL","PPT",
    "MDB","ZIP","RAR","ISO","EXE","DLL","PSD","AI",
    "PS","CRD","SVG","EPS","DWG","BMP","JPG","TIFF",
    "RAW","PNG","GIF","FLV","AVI","MPEG","MOV","MP4",
    "WMA","MP3","MID","WAV","JAVA","RSS","XML","HTML",
    "FILE", "WEBP"
];

const previewType = [
    "JPG", "PNG", "GIF", "SVG", "BMP", "WEBP"
];

function checkEmpty() {
    const commentSection = document.getElementById('editor');
    const placeHolder = document.querySelector('.placeHolder');

    const hasText = commentSection.innerText.trim().length > 0;
    const hasImage = commentSection.querySelector('.file-preview') !== null;

    if (!hasText && !hasImage) {
        placeHolder.style.display = "block";
    } else {
        placeHolder.style.display = "none";
    }
}

function formatFileSize(bytes) {
    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;
    const TB = GB * 1024;
    
    if (bytes < KB) return `${bytes} B`;
    if (bytes < MB) return `${(bytes / KB).toFixed(1)} KB`;
    if (bytes < GB) return `${(bytes / MB).toFixed(1)} MB`;
    if (bytes < TB) return `${(bytes / GB).toFixed(1)} GB`;
    return `${(bytes / TB).toFixed(1)} TB`;
}

function getFileIcon(fileName) {
    let ext = fileName.split('.').pop().toUpperCase();
    if(ext === 'JPEG') return `JPG.svg`;
    return supportedTypes.includes(ext) ? `${ext}.svg` : 'FILE.svg';
}

function handleFiles(files, isEditing){
    const fileDropzone = document.querySelector('.uploadBox');
    const fileListContainer = fileDropzone.querySelector('.fileList');
    [...files].forEach(file => {
        const fileEl = document.createElement("div");
        fileEl.classList.add("file");

        if (file instanceof File) {
            fileEl.file = file;
        }
        if (file.AttachmentID) {
            fileEl.dataset.AttachmentID = file.AttachmentID;
        } else {
            fileEl.dataset.AttachmentID = null; 
        }
        const iconSrc = `./images/file_icon/${getFileIcon(file.name || file.FileName)}`;

        fileEl.innerHTML = `
            <img src="${iconSrc}" alt="${file.type|| file.Type || 'File'} Icon" class="fileIcon">
            <p class="fileName">${file.name || file.FileName}</p>
            <p class="fileSize" data-size="${file.size || file.FileSize || 0}">
            ${formatFileSize(file.size || file.FileSize || 0)}
            </p>
        `;

        if(isEditing){
            const deleteFileIcon = document.createElement('label');
            deleteFileIcon.classList.add('deleteFile');
            deleteFileIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            ` 
            fileEl.appendChild(deleteFileIcon);

            fileEl.querySelector(".deleteFile").addEventListener("click", () => {
                fileEl.remove();
            });
        }
        else if(!isEditing){
            const fileName = fileEl.querySelector('.fileName');
            fileName.style.flex = '0 0 9vw';
        }

        fileListContainer.appendChild(fileEl);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const fileDropzone = document.querySelector('.uploadBox');

    const commentFileInput = document.getElementById('commentFileInput');
    const commentSection = document.getElementById('editor');
    const fileDropzone2 = document.querySelector('.commentInput');
    const fileCardList = document.querySelector('.fileCardList');
    const placeHolder = document.querySelector('.placeHolder');

    function insertFilePreviewAtCaret(span){
        const sel = window.getSelection();
        if(!sel.rangeCount){
            commentSection.appendChild(span);
            return;
        }
        
        const range = sel.getRangeAt(0);
        let container = range.startContainer;
        if(container.nodeType === 3) container = container.parentNode;

        if(container && container.tagName === 'P' && container.innerHTML === '<br>'){
            container.replaceWith(span);
        }else{
            range.deleteContents();
            range.insertNode(span);
        }
        
        if(!span.nextSibling || span.nextSibling.nodeName !== 'P'){
            const newP = document.createElement('p');
            newP.innerHTML = '<br>';
            span.after(newP);
        }

        const newRange = document.createRange();
        if(span.nextSibling){
            newRange.setStart(span.nextSibling, 0);
        }else{
            newRange.setStartAfter(span);
        }
        newRange.collapse(true);

        sel.removeAllRanges();
        sel.addRange(newRange);
    }

    function handleCommentFiles(files){
        [...files].forEach(file => {
            let ext = file.name.split('.').pop().toUpperCase();
    
            if(!previewType.includes(ext)){
                fileCardList.classList.remove('hide');

                const fileEl = document.createElement('div');
                fileEl.classList.add('fileCard');

                if (file instanceof File) {
                    fileEl.file = file;
                }

                const iconSrc = `./images/file_icon/${getFileIcon(file.name)}`;

                fileEl.innerHTML = `
                    <img src="${iconSrc}" alt="${file.type} Icon" class="fileIcon">
                    <div class="fileDetailWrapper">
                        <p class="fileName">${file.name}</p>
                        <p class="fileSize">${formatFileSize(file.size)}</p>
                    </div>
                    <label class="deleteFile">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </label>
                `;

                fileEl.querySelector('.deleteFile').addEventListener('click', () => {
                    fileEl.remove();
                    if(fileCardList.children.length === 0){
                        fileCardList.classList.add('hide');
                        checkEmpty();
                    }
                })

                fileCardList.appendChild(fileEl);
            }
            else{
                const span = document.createElement('span');
                span.classList.add('file-preview');
                span.setAttribute('contenteditable', 'false');
                span.setAttribute('draggable', 'true');
                span.dataset.type = file.type;
                span.style.display = 'block';

                span.file = file;
                
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.alt = file.name;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('deleteFile');
                deleteBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                `;

                deleteBtn.addEventListener('click', () => {
                    span.remove();
                    commentSection.focus();
                    checkEmpty();
                });

                span.appendChild(img);
                span.appendChild(deleteBtn);

                insertFilePreviewAtCaret(span);
            }
        });
    }

    let savedRange = null;

    function saveSelection(){
        const sel = window.getSelection();
        if(sel.rangeCount > 0){
            savedRange = sel.getRangeAt(0);
        }
    }

    function restoreSelection(){
        if(savedRange){
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedRange);
        }
    }

    commentSection.addEventListener('paste', (event) => {
        event.preventDefault();

        const text = (event.clipboardData || window.clipboardData).getData('text');

        const paragraphs = text
            .split(/\r?\n/)
            .map(line => `<p>${line === '' ? '<br>' : line}</p>`)
            .join('');

        document.execCommand('insertHTML', false, paragraphs);
    });

    if(window.FileList && window.File) {
        fileDropzone2.addEventListener('drop', event => {
            event.preventDefault();
            const hasText = commentSection.innerText.trim().length > 0;
            if(!hasText){placeHolder.style.display = "none";}
            handleCommentFiles(event.dataTransfer.files);
        })

        fileDropzone2.addEventListener('paste', event => {
            const hasText = commentSection.innerText.trim().length > 0;
            if(!hasText){placeHolder.style.display = "none";}

            if(!event.clipboardData) return;

            const files = [];

            if(event.clipboardData.files.length > 0){
                event.preventDefault(); 
                for(let f of event.clipboardData.files){
                    files.push(f);
                }
            } else if(event.clipboardData.items.length > 0){
                [...event.clipboardData.items].forEach(item => {
                    if(item.kind === 'file'){
                        const file = item.getAsFile();
                        if(file){
                            event.preventDefault(); 
                            if(file) files.push(file);
                        }
                    }
                });
                if(files.length > 0) event.preventDefault();
            }

            if(files.length > 0) {
                handleCommentFiles(files);
            }
        });

        attachmentIcon.addEventListener('mousedown', saveSelection);

        attachmentIcon.addEventListener('click', () => commentFileInput.click());

        commentFileInput.addEventListener('change', () => {
            restoreSelection();
            const hasText = commentSection.innerText.trim().length > 0;
            if(!hasText){placeHolder.style.display = "none";}
            handleCommentFiles(commentFileInput.files);
            commentFileInput.value = '';
            commentSection.focus();
        });
    }

    commentSection.addEventListener('input', checkEmpty);
    checkEmpty();
});

function formatDate(date, type){
    if(type === 'numeric'){
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const d = date.getDate();

        return `${d}/${month}/${year}`;
    }
    else if(type === 'long'){
        const d = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const daySuffix = n => {
            if(n >= 11 && n <= 13) return 'th';
            switch(n%10){
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${d}<sup>${daySuffix(d)}</sup> ${month} ${year}`;
    }
}

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

function generateCommentID(comments) {
    if (!comments || comments.length === 0) return 'CD001';

    const maxNum = Math.max(
        ...comments.map(c => parseInt(c.CommentID.replace('CD', ''), 10))
    );

    const nextNum = maxNum + 1;
    const formattedNum = nextNum < 1000
        ? String(nextNum).padStart(3, '0')
        : String(nextNum);

    return 'CD' + formattedNum;
}

function generateAttahmentID(attachments) {
    if (!attachments || attachments.length === 0) return 'A001';

    const maxNum = Math.max(
        ...attachments.map(a => parseInt(a.attachmentID.replace('A', ''), 10))
    );

    const nextNum = maxNum + 1;

    const formattedNum = nextNum < 1000
        ? String(nextNum).padStart(3, '0')
        : String(nextNum);

    return 'A' + formattedNum;
}

function triggerTaskDetail(task, projectID){
    const taskDetailDialog = document.querySelector('.taskDetail');
    const title = taskDetailDialog.querySelector('#taskTitle');
    const taskDescriptionView = taskDetailDialog.querySelector('.descriptionView p');
    const taskDescriptionEdit = taskDetailDialog.querySelector('.descriptionEdit');
    const activityList = taskDetailDialog.querySelector('.activityList');
    const detailWrapper2 = taskDetailDialog.querySelector('.detailWrapper2');
    const assigneeLabel = document.getElementById('assignee');
    const priorityLabel = document.getElementById('priority');
    const startDateLabel = document.getElementById('startDate');
    const dueDateLabel = document.getElementById('dueDate');
    const errorMessage = taskDetailDialog.querySelector('.errorMesssage');
    const calendarInDialog = taskDetailDialog.querySelector('.calendar');
    const memberOption = taskDetailDialog.querySelector('.members');
    const noMessage = taskDetailDialog.querySelector('.noMessage');
    const state1 = document.querySelector('.uploadBox .state1');
    const state2 = document.querySelector('.uploadBox .state2');
    const saveButton = document.querySelector('.saveFile');
    const editButton = document.querySelector('.editFiles');
    const cancelButton = document.querySelector('.cancelFileChanges');
    const fileListContainer = document.querySelector('.fileList');
    const fileDropzone = document.querySelector('.uploadBox');
    const dropZoneBorder = fileDropzone.querySelector('.dashed-rect');
    const fileInput = document.getElementById("fileInput");
    const closeBtn = taskDetailDialog.querySelector('#closeBtn');
    const uploadErrorMessage = taskDetailDialog.querySelector('.fileEditSave .errorMessage');
    const subtaskSection = taskDetailDialog.querySelector('.subtaskSection');
    const parentTaskSection = taskDetailDialog.querySelector('.parentTask');

    if(!(task.Status === 'HTY'   
        || task.Status === 'OTW'
        || task.Status === 'DONE')) return;

    title.value = task.TaskTitle;
    if(task.Description === '' || !task.Description){
        taskDescriptionView.innerHTML = `Description. Say somethin`;
    } else taskDescriptionView.innerHTML = task.Description;
    taskDescriptionEdit.innerHTML = task.Description;
    activityList.innerHTML = '';
    fileListContainer.innerHTML = '';
    state1.classList.remove('hide');
    state2.classList.add('hide');
    saveButton.classList.add('hide');
    cancelButton.classList.add('hide');
    editButton.classList.add('hide');
    uploadErrorMessage.textContent = '';
    uploadErrorMessage.style.display = 'none';
    subtaskSection.style.display = 'flex';
    subtaskSection.style.pointerEvents = 'auto';
    parentTaskSection.style.display = 'none';
    parentTaskSection.style.pointerEvents = 'none';

    if (loggedInUserRole.Role === 'Team Leader' || 
        loggedInUserRole.Role === 'Project Manager'
    ) 
    {
        fileInput.disabled = false;
    } else {
        fileInput.disabled = true;
    }
    
    function renderComment(comment){
        const activity = document.createElement('div');
        activity.classList.add('activity');

        const member = document.createElement('div');
        member.classList.add('member');

        const memberAvatar = document.createElement('div');
        memberAvatar.classList.add('memberAvatar');

        const memberDetailWrapper = document.createElement('div');
        memberDetailWrapper.classList.add('memberDetailWrapper');

        const name = document.createElement('h4');
        name.classList.add('name');

        const postTime = document.createElement('p');
        postTime.classList.add('postTime');

        const avatar = comment.FullName.charAt(0).toUpperCase();
        memberAvatar.textContent = avatar;
        memberAvatar.style.setProperty('--avatar-color', `var(${comment.AvatarColor})`);

        name.textContent = comment.FullName;
        postTime.textContent = timeAgo(new Date(comment.CreatedAt));
        
        memberDetailWrapper.appendChild(name);
        memberDetailWrapper.appendChild(postTime);
        member.appendChild(memberAvatar);
        member.appendChild(memberDetailWrapper);

        const content = document.createElement('div');
        content.classList.add('content');
        content.innerHTML = comment.Description;

        content.querySelectorAll('span img').forEach(img => {
            img.addEventListener('click', () => {
                const dialog = document.createElement('dialog');
                dialog.classList.add('inlinePreview');

                const closeWrapper = document.createElement('div');
                closeWrapper.classList.add('closeWrapper');

                const closeBtn = document.createElement('div');
                closeBtn.classList.add('closeBtn');
                closeBtn.innerHTML = `&times`;
                closeWrapper.appendChild(closeBtn);

                const span = document.createElement('span');
                const previewImg = document.createElement('img');
                previewImg.src = img.src;
                previewImg.alt = img.alt || '';
                span.appendChild(previewImg);

                dialog.appendChild(closeWrapper);
                dialog.appendChild(span);
                document.body.appendChild(dialog);

                dialog.showModal();

                closeBtn.addEventListener('click', () => dialog.close());
                dialog.addEventListener('click', e => {
                    if (e.target === dialog) dialog.close();
                });

                dialog.addEventListener('close', () => dialog.remove());
            });
        });

        const attachedFilesWrapper = document.createElement('div');
        attachedFilesWrapper.classList.add('attachedFiles');
        const attachedFiles = commentAttachments
            .filter(item => item.CommentID === comment.CommentID);
        
        attachedFiles.forEach(a => {
            const attachedFileEl = document.createElement('div');
            attachedFileEl.classList.add('attachedFile');

            const fileIcon = document.createElement('img');
            fileIcon.classList.add('fileIcon');
            fileIcon.src = `./images/file_icon/${getFileIcon(a.FileName)}`;
            fileIcon.alt = `${a.FileType} icon`;

            const fileDetailWrapper = document.createElement('div');
            fileDetailWrapper.classList.add('fileDetailWrapper');

            const fileName = document.createElement('p');
            fileName.classList.add('fileName');
            fileName.textContent = a.FileName;

            const fileSize = document.createElement('p');
            fileSize.classList.add('fileSize');
            fileSize.textContent = formatFileSize(a.FileSize || 0);

            fileDetailWrapper.appendChild(fileName);
            fileDetailWrapper.appendChild(fileSize);

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

            attachedFileEl.appendChild(fileIcon);
            attachedFileEl.appendChild(fileDetailWrapper);
            attachedFileEl.appendChild(downloadBtn);
            attachedFilesWrapper.appendChild(attachedFileEl);

            attachedFileEl.addEventListener('click', () => {
                fileName.classList.add('expanded');
            });

            document.addEventListener('click', e => {
                if(!attachedFileEl.contains(e.target)){
                    fileName.classList.remove('expanded');
                }
            });
        });

        activity.appendChild(member);
        activity.appendChild(content);
        activity.appendChild(attachedFilesWrapper);

        activityList.appendChild(activity);
    }

    const commentsInTask = comments
        .filter(c => c.TaskID === task.TaskID)
        .filter(Boolean);  
    
    if(commentsInTask.length !== 0){
        noMessage.classList.add('hide');
        commentsInTask.forEach(c => {
            renderComment(c);
        });
    }
    
    function mergeFileLists(task, newFiles) {
        const fileListContainer = document.querySelector('.uploadBox .fileList');

        const existingAttachments = taskAttachments
        .filter(a => a.TaskID === task.taskID)
        .map(a => ({
            AttachmentID: a.AttachmentID,
            name: a.FileName,
            size: a.FileSize,
            type: a.FileType,
        }));

        const currentDisplayed = Array.from(fileListContainer.children).map(el => {
            return el.file
                ? el.file
                : {
                    AttachmentID: el.dataset.AttachmentID || null,
                    name: el.querySelector('.fileName').textContent,
                    size: parseFloat(el.querySelector('.fileSize').dataset.size) || 0,
                    type: el.querySelector('.fileName').textContent.split('.').pop().toUpperCase(),
                };
        });

        const allFiles = [
            ...existingAttachments,
            ...currentDisplayed,
            ...newFiles
        ];

        const uniqueFiles = [];
        const seen = new Set();

        allFiles.forEach(file => {
            const fileName = file.name || file.FileName;
            if (!seen.has(fileName)) {
                seen.add(fileName);
                uniqueFiles.push(file);
            }
        });

        return uniqueFiles;
    }

    state1.addEventListener("dragover", event => {
        event.preventDefault();
        event.stopPropagation();
        
        if (task.AssignedUserID !== loggedInUserID) return;

        event.dataTransfer.dropEffect = 'copy';
        state1.classList.add("dragover");
        dropZoneBorder.classList.add("dragover");
    });

    state1.addEventListener("dragleave", () => {
        state1.classList.remove("dragover");
        dropZoneBorder.classList.remove("dragover");
    });

    state2.addEventListener("dragover", event => {
        event.preventDefault();
        event.stopPropagation();

        if (task.AssignedUserID !== loggedInUserID) return;

        event.dataTransfer.dropEffect = 'copy';
        state2.classList.add("dragover");
        dropZoneBorder.classList.add("dragover");
    });

    state2.addEventListener("dragleave", () => {
        state2.classList.remove("dragover");
        dropZoneBorder.classList.remove("dragover");
    });
    

    fileInput.addEventListener("change", () => {
        const selectedFiles = Array.from(fileInput.files);
        const mergedFiles = mergeFileLists(task, selectedFiles);
        fileListContainer.innerHTML = '';
        handleFiles(mergedFiles, true);

        state1.classList.add("hide");
        state2.classList.remove("hide");
        saveButton.classList.remove('hide');
        cancelButton.classList.remove('hide');
        editButton.classList.add('hide');

        fileInput.value = '';
    });

    cancelButton.addEventListener('click', () => {
        checkFinalWork(task);
        fileListContainer.innerHTML = '';

        const finalWorkID = taskAttachments.filter(a => a.TaskID === task.TaskID);
        handleFiles(finalWorkID, false);

        if (fileListContainer.children.length === 0) {
            state2.classList.add("hide");
            state1.classList.remove("hide");
            saveButton.classList.add('hide');
            cancelButton.classList.add('hide');
            editButton.classList.add('hide');
            return;
        }

        saveButton.classList.add('hide');
        cancelButton.classList.add('hide');
        editButton.classList.remove('hide');
        checkFinalWork(task);
    });

    function setSaveButtonHandler(task) {
        if (saveButton._clickHandler) {
            saveButton.removeEventListener('click', saveButton._clickHandler);
        }

        const handler = async () => {
            const fileListContainer = document.querySelector('.uploadBox .fileList');
            const uploadedFiles = Array.from(fileListContainer.children).map(el => {
                return {
                    AttachmentID: el.dataset.AttachmentID !== 'null' ? el.dataset.AttachmentID : null,
                    file: el.file || null,
                    name: el.querySelector('.fileName').textContent,
                    size: parseFloat(el.querySelector('.fileSize').dataset.size) || 0,
                    type: el.querySelector('.fileName').textContent.split('.').pop().toUpperCase(),
                };
            });

            const oldFiles = taskAttachments.filter(a => a.TaskID === task.TaskID);
            const keptAttachmentIDs = uploadedFiles
                .filter(f => f.AttachmentID)
                .map(f => f.AttachmentID);

            const removedFilesIDs = oldFiles
                .filter(f => !keptAttachmentIDs.includes(f.AttachmentID))
                .map(f => f.AttachmentID);

            if (removedFilesIDs.length > 0) {
                await fetch('delete_attachments.php', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ removedFilesIDs }),
                });
            }

            const newAttachments = uploadedFiles.filter(f => !f.AttachmentID && f.file);

            console.log('Old Files', oldFiles);
            console.log('Kept Attachment', keptAttachmentIDs);
            console.log('RemovedFilesIDs', removedFilesIDs);
            console.log('New Attachments', newAttachments);

            for(const fileEl of newAttachments){
                const MAX_UPLOAD_MB = 40; 
                const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

                if (fileEl.size > MAX_UPLOAD_BYTES) {
                    console.error(`*${fileEl.name} exceeds the upload limit of ${MAX_UPLOAD_MB}MB*`);
                    uploadErrorMessage.style.display = 'block';
                    uploadErrorMessage.textContent = `❌ ${fileEl.name} exceeds the upload limit: ${MAX_UPLOAD_MB}MB`;
                    return;
                }

                const formData = new FormData();
                formData.append('file', fileEl.file);
                formData.append('UploadedBy', loggedInUserID);
                formData.append('FileName', fileEl.name);
                formData.append('FileType', fileEl.type);
                formData.append('FileSize', fileEl.size);
                formData.append('TaskID', task.TaskID);
                try{
                    const res = await fetch('upload_attachment.php', {
                        method: 'POST',
                        credentials: 'same-origin',
                        body: formData,
                    });

                    const data = await res.json();
                    if(data.status !== 'ok'){
                        console.error('❌ Upload failed for', fileEl.name, data.message);
                    } else {
                        console.log('✅ Uploaded:', fileEl.name, '-> ID:', data.AttachmentID);
                    }
                } catch (err) {
                    console.error('❌ Upload error for', fileEl.name, err);
                }
            }

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
                    taskAttachments = data.taskAttachments;

                    if (fileListContainer.children.length === 0) {
                        state2.classList.add("hide");
                        state1.classList.remove("hide");
                        saveButton.classList.add('hide');
                        cancelButton.classList.add('hide');
                        checkFinalWork(task);
                        return;
                    };

                    state1.classList.add('hide');
                    state2.classList.remove('hide');
                    editButton.classList.remove('hide');
                    saveButton.classList.add('hide');
                    cancelButton.classList.add('hide');
                    fileListContainer.innerHTML = '';

                    const relatedAttachments = taskAttachments.filter(a => a.TaskID === task.TaskID);

                    handleFiles(relatedAttachments, false);
                    checkFinalWork(task);
                }
            }catch (err) {
                console.error('❌ Failed to fetch project summary:', err);
            }

            checkFinalWork(task);
        };

        saveButton.addEventListener('click', handler);
        saveButton._clickHandler = handler;
    }


    editButton.addEventListener('click', () => {
        checkFinalWork(task);
        fileListContainer.innerHTML = '';

        const attachedFiles = taskAttachments.filter(a => 
            a.TaskID === task.TaskID
        );
        handleFiles(attachedFiles, true);

        saveButton.classList.remove('hide');
        cancelButton.classList.remove('hide');
        editButton.classList.add('hide');
    });

    function resetUploadListeners() {
        if (state1._clickHandler) state1.removeEventListener("click", state1._clickHandler);
        if (state1._dropHandler) state1.removeEventListener("drop", state1._dropHandler);
        if (state2._dropHandler) state2.removeEventListener("drop", state2._dropHandler);
    }

    function checkFinalWork(task) {
        resetUploadListeners();

        console.log('checkFinalWork -> task:', task);
        const attachedFiles = taskAttachments.filter(a => a.TaskID === task.TaskID);

        console.log('Attached Files', attachedFiles);

        const isAssignee = task.AssignedUserID === loggedInUserID;

        uploadErrorMessage.style.display = isAssignee ? 'none' : 'block';
        uploadErrorMessage.textContent = isAssignee ? '' : '*Non assignee cannot upload works*';
        if (!isAssignee) return;

        fileListContainer.innerHTML = '';

        if (attachedFiles.length > 0) {
            state1.classList.add('hide');
            state2.classList.remove('hide');
            editButton.classList.remove('hide');
            handleFiles(attachedFiles, false);
        } else {
            state2.classList.add('hide');
            state1.classList.remove('hide');
            editButton.classList.add('hide');
        }

        const onClick = () => {
            if (task.AssignedUserID !== loggedInUserID) return;
            fileInput.click();
        };

        const onDrop1 = (event) => {
            event.preventDefault();
            if (task.AssignedUserID !== loggedInUserID) return;
            const files = Array.from(event.dataTransfer.files);
            fileListContainer.innerHTML = '';
            handleFiles(files, true);
            state1.classList.add('hide');
            state2.classList.remove('hide');
            saveButton.classList.remove('hide');
            cancelButton.classList.remove('hide');
            state1.classList.remove("dragover");
            dropZoneBorder.classList.remove("dragover");
        };

        const onDrop2 = (event) => {
            event.preventDefault();
            if (task.AssignedUserID !== loggedInUserID) return;
            const files = Array.from(event.dataTransfer.files);
            const mergedFiles = mergeFileLists(task, files);
            fileListContainer.innerHTML = '';
            handleFiles(mergedFiles, true);
            saveButton.classList.remove('hide');
            cancelButton.classList.remove('hide');
            editButton.classList.add('hide');
            state2.classList.remove("dragover");
            dropZoneBorder.classList.remove("dragover");
        };

        state1.addEventListener("click", onClick);
        state1.addEventListener("drop", onDrop1);
        state2.addEventListener("drop", onDrop2);

        state1._clickHandler = onClick;
        state1._dropHandler = onDrop1;
        state2._dropHandler = onDrop2;
    }

    setSaveButtonHandler(task);
    checkFinalWork(task);

    assigneeLabel.innerText = `Assignee: `;

    const assignee = document.createElement('div');
    assignee.classList.add('assigneeEl');
    assignee.style.cursor = 'default';
    const assigneeName = document.createElement('h4');
    assigneeName.classList.add('assigneeName');
    
    const assignedMember = members.find(member => member.UserID === task.AssignedUserID);
    assigneeName.textContent = assignedMember?  assignedMember.FullName: 'No Assignee';

    assignee.appendChild(assigneeName);
    if(assignedMember){
        const avatar = assignedMember.FullName.charAt(0).toUpperCase();
        assignee.style.setProperty('--avatar', `'${avatar}'`);
        assignee.style.setProperty('--avatar-color', `var(${assignedMember.AvatarColor})`);
    }

    assigneeLabel.appendChild(assignee);
    
    function generateMemberOption(task, toggle, callback, subtask){
        memberOption.innerHTML = '';
        
        const dialog = taskDetailDialog.getBoundingClientRect();
        const rect = toggle.getBoundingClientRect();
        memberOption.style.top = `${rect.bottom - dialog.top}px`;
        memberOption.style.left = `${rect.left - dialog.left}px`;
        memberOption.classList.add('show');
        if(memberOption.classList.contains('show'))console.log('showing');

        let filteredMember;
        if(subtask){
            filteredMember = members.filter(m => m.Status === 'Active');
        }else{
            filteredMember = members.filter(m => m.UserID !== task.AssignedUserID && m.Status === 'Active');
        }

        filteredMember.forEach(member => {
            const memberEl = document.createElement('div');
            memberEl.classList.add('member');

            const p = document.createElement('p')
            const name = member?.FullName || 'No Assignee'
            p.textContent = name;
            
            const avatar = name.charAt(0).toUpperCase();
            memberEl.style.setProperty('--avatar', `'${avatar}'`);
            memberEl.style.setProperty('--avatar-color', `var(${member.AvatarColor})`);
            memberEl.appendChild(p);
            memberOption.appendChild(memberEl);

            memberEl.addEventListener('click', () => {
                memberOption.classList.remove('show');
                callback(member.UserID);
            });
        });
    }

    if(loggedInUserRole.Role === 'Team Leader' || 
        loggedInUserRole.Role === 'Project Manager'){
        assignee.style.cursor = 'pointer';
        assignee.addEventListener('click', () => {
            generateMemberOption(task, assignee, (assigneeID) => {
                const assignedMember = members.find(m => m.UserID === assigneeID);
                task.AssignedUserID = assignedMember.UserID;
                updateTask(task);
                assigneeName.textContent = assignedMember.FullName;
                assignee.style.setProperty('--avatar', `'${assignedMember.FullName.charAt(0).toUpperCase()}'`);
                assignee.style.setProperty('--avatar-color', `var(${assignedMember.AvatarColor})`);

                if(task.AssignedUserID !== loggedInUserID) {
                    uploadErrorMessage.textContent = '*Non assignee cannot upload works*';
                    uploadErrorMessage.style.display = 'block';
                }else{
                    uploadErrorMessage.textContent = '';
                    uploadErrorMessage.style.display = 'none';
                };
            }, false);
        });
    }

    function generatePriority(priority, task, priorityLabel, showLabel = true){
        priorityLabel.innerHTML = showLabel ? 'Priority: ' : '';
        for(let i = 1; i <= 5; i++){
            const fireIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            fireIcon.setAttribute('class', 'fireIcon');
            fireIcon.setAttribute('viewBox', '0 0 21 26');
            fireIcon.setAttribute('fill', 'none');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M4.60735 12.1165C-2.33266 18.7917 3.6548 23.4868 7.51603 25C5.42387 22.5789 6.44435 21.4117 7.82215 20.2011C8.92438 19.2327 9.4721 16.6272 9.60818 15.4455C15.446 19.7342 14.2859 23.6021 12.9761 25C18.6404 23.141 22.0083 17.0883 16.3951 12.6786C11.5983 8.91022 11.2411 5.97744 11.2411 2C5.72994 6.18496 6.12117 12.0445 7.00568 14.4511C5.41356 14.209 4.74341 12.7939 4.60735 12.1165Z');

            if(i <= priority){
                path.style.fill = `#FF6723`;
                path.style.stroke = `#FF1414`;
            } else{
                path.style.fill = `#c0bab7`;
                path.style.stroke = `#676262`;
            }

            fireIcon.style.cursor = 'default';
            fireIcon.appendChild(path);
            priorityLabel.appendChild(fireIcon);

            if(loggedInUserRole.Role === 'Team Leader' || 
                loggedInUserRole.Role === 'Project Manager'){
                fireIcon.style.cursor = 'pointer';
                fireIcon.addEventListener('click', () => {
                    if(task.Priority === 1 && i == 1){
                        task.Priority = 0;
                        const fireIcons = priorityLabel.querySelectorAll('.fireIcon');
                        for(let i = 0; i < 5; i++){
                            const path = fireIcons[i].querySelector('path');
                            path.style.fill = `#c0bab7`;
                            path.style.stroke = `#676262`;
                        }
                        return;
                    }
                    task.Priority = i;
                    const fireIcons = priorityLabel.querySelectorAll('.fireIcon');
                        for(let y = 0; y < 5; y++){
                            const path = fireIcons[y].querySelector('path');
                            if(y < i){
                                path.style.fill = `#FF6723`;
                                path.style.stroke = `#FF1414`;
                            }else{
                                path.style.fill = `#c0bab7`;
                                path.style.stroke = `#676262`;
                            }
                            
                        }
                    updateTask(task);
                });
            }     
        };
    }

    generatePriority(task.Priority, task, priorityLabel);
    priorityLabel.style.display = 'flex';
    priorityLabel.style.justifyContent = 'flex-start';
    priorityLabel.style.alignItems = 'flex-start';
    priorityLabel.style.gap = '0.2vw';
    
    startDateLabel.innerHTML = `Start Date: `;
    const selectedStartDate = document.createElement('div');
    selectedStartDate.classList.add('selectedDate');
    selectedStartDate.textContent = `${formatDate(task.StartDate, 'numeric')}`;
    startDateLabel.appendChild(selectedStartDate);

    dueDateLabel.innerHTML = `Due Date: `;
    const selectedDueDate = document.createElement('div');
    selectedDueDate.classList.add('selectedDate');
    selectedDueDate.textContent = `${formatDate(task.DueDate, 'numeric')}`;
    dueDateLabel.appendChild(selectedDueDate);

    selectedStartDate.style.cursor = 'default';
    selectedDueDate.style.cursor = 'default';

    const header = taskDetailDialog.querySelector('.subtaskSection .header');
    const addOnIcon = document.createElement('div');
    addOnIcon.id = 'addSubtask';
    addOnIcon.classList.add('addIcon');
    addOnIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    `;
    
    const createSubtask = document.querySelector('.createSubtask');
    const subtaskName = createSubtask.querySelector('#subtaskName');
    const subtaskErrorMessage = createSubtask.querySelector('#errorMessage');
    const assignSubtask = createSubtask.querySelector('.assignee');
    const cancelSubtask = createSubtask.querySelector('.cancelIcon');
    const confirmSubtask = createSubtask.querySelector('.confirmIcon');

    subtaskErrorMessage.textContent = '';
    createSubtask.classList.add('hide');
    subtaskErrorMessage.style.display = 'none';

    function handleAddOnIconClick(passTask){
        console.log('Task:', passTask.TaskID);
        createSubtask.classList.remove('hide');

        const noAssigneeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        noAssigneeIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        noAssigneeIcon.setAttribute('viewBox', '0 0 24 24');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z');

        noAssigneeIcon.appendChild(path);
        
        const assigneeName = document.createElement('h4');
        assigneeName.classList.add('assigneeName');

        let assignedMember;

        assignSubtask.addEventListener('click', () => {
            generateMemberOption(passTask, assignSubtask, (assigneeID) => {
                console.log(assigneeID);
                assignedMember = members.find(m => m.UserID === assigneeID);
                showSubtaskAssignee();
            }, true);
        });

        function showSubtaskAssignee(){
            assignSubtask.innerHTML = ``;
            assigneeName.textContent = assignedMember?  assignedMember.FullName: 'No Assignee';
            
            if(!assignedMember){
                assignSubtask.appendChild(noAssigneeIcon);
            }else{
                assigneeName.style.setProperty('--assignee-name', `'${assignedMember.FullName.charAt(0).toUpperCase()}'`);
                assigneeName.style.setProperty('--assignee-avatar', `var(${assignedMember.AvatarColor})`);
                assigneeName.style.paddingLeft = '1.5vw';
            }
            assignSubtask.appendChild(assigneeName);
        }

        confirmSubtask.onclick = async () => {
            const subtaskTitle = subtaskName.value.trim();
            let message; 
            if(subtaskTitle === '' || !subtaskTitle){
                message = '*Subtask name cannot be empty*'
            }else if(!assignedMember){
                message = '*Assignee cannot be empty*'
            }

            if(message){
                subtaskErrorMessage.textContent = message;
                subtaskErrorMessage.style.color = `var(--overdue-color)`;
                subtaskErrorMessage.style.display = 'block';
            }else{
                subtaskErrorMessage.textContent = '';
                subtaskErrorMessage.style.display = 'none';

                const newTaskID = generateTaskID(tasks);

                let startDate = new Date();
                let dueDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
                const newTask = {
                    TaskID: newTaskID,
                    ParentTaskID: passTask.TaskID,
                    ProjectID: projectID,
                    AssignedUserID: assignedMember.UserID,
                    TaskTitle: subtaskTitle,
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

                        tasks.push(newTask);
                        const successfulMessage = document.createElement('div');
                        successfulMessage.classList.add('successfulMessage');
                        successfulMessage.innerHTML = `Successfully created Subtask: "${subtaskTitle}"`;
                        messageContainer.appendChild(successfulMessage);
                        successfulMessage.classList.add('active');
                        setTimeout(() => {
                            messageContainer.removeChild(successfulMessage);
                        }, 5000);

                        generateTasks(tasks, loggedInUserRole.Role, projectID);
                        triggerTaskDetail(passTask, projectID);
                    } else {
                        console.error('❌ Add task failed:', data.message);
                    }
                })
            }
        }

        showSubtaskAssignee();
        subtaskName.focus();
    }

    addOnIcon.addEventListener('click', () => {
        handleAddOnIconClick(task);
    });

    cancelSubtask.addEventListener('click', () => {
        createSubtask.classList.add('hide');
    });

    if(loggedInUserRole.Role === 'Team Leader' || 
        loggedInUserRole.Role === 'Project Manager'){
        const existedAddOnIcon = header.querySelector('#addSubtask');
        if(existedAddOnIcon) {
            header.removeChild(existedAddOnIcon);
        };
        header.appendChild(addOnIcon);
    }
    
    if(task.ParentTaskID){
        subtaskSection.style.display = 'none';
        subtaskSection.style.pointerEvents = 'none';
        parentTaskSection.style.display = 'flex';
        parentTaskSection.style.pointerEvents = 'auto';
        const parentTaskTitle = parentTaskSection.querySelector('#parentTaskTitle');
        const label = parentTaskSection.querySelector('label');

        const parentTask = tasks.find(t => t.TaskID === task.ParentTaskID);

        parentTaskTitle.textContent = parentTask.TaskTitle;

        parentTaskTitle.onclick = () => {
            triggerTaskDetail(parentTask, projectID);
        };

        label.onclick = () => {
            triggerTaskDetail(parentTask, projectID);
        };
    }else{
        const subtasks = tasks.filter(t => t.ParentTaskID === task.TaskID 
            && (t.Status === 'HTY'
            || t.Status === 'OTW'
            || t.Status === 'DONE'));
        const progressBar = taskDetailDialog.querySelector('.progressBar');
        const progress = taskDetailDialog.querySelector('.progress');
        let doneSubtasks = 0;
        let doneProgression = 0;

        subtasks.forEach(t => t.Status === 'DONE'? doneSubtasks += 1 : doneSubtasks);
        doneProgression = (doneSubtasks / subtasks.length) * 100;
        if(subtasks.length === 0) doneProgression = 0;

        progressBar.style.setProperty('--bar-width', `${doneProgression + 1}%`);
        progress.textContent = `${doneProgression}% Done`;
        
        const subtaskList = taskDetailDialog.querySelector('.subtaskList');
        subtaskList.innerHTML = '';

        subtasks.forEach(task => {
            const subtask = document.createElement('div');
            subtask.classList.add('subtask');

            const work = document.createElement('h4');
            work.classList.add('work');
            work.textContent = task.TaskTitle;

            const priorityLabel = document.createElement('div');
            generatePriority(task.Priority, task, priorityLabel, false);
            priorityLabel.style.display = 'flex';
            priorityLabel.style.gap = '0.2vw';
            priorityLabel.style.justifyContent = 'flex-start';
            priorityLabel.classList.add('priorityLabel');

            const assignee = document.createElement('div');
            assignee.classList.add('assigneeEl');

            const assigneeName = document.createElement('h4');
            assigneeName.classList.add('assigneeName');

            let assignedMember = members.find(m => m.UserID === task.AssignedUserID);
            assignee.addEventListener('click', () => {
                generateMemberOption(task, assignee, (assigneeID) => {
                    assignedMember = members.find(m => m.UserID === assigneeID);
                    task.AssignedUserID = assignedMember.UserID;
                    updateTask(task);
                    showSubtaskAssignee();
                }, true);
            });
            
            function showSubtaskAssignee(){
                assignee.innerHTML = ``;
                assigneeName.textContent = assignedMember?  assignedMember.FullName: 'No Assignee';
                
                const avatar = assignedMember.FullName.charAt(0).toUpperCase();
                assignee.style.setProperty('--avatar', `'${avatar}'`);
                assignee.style.setProperty('--avatar-color', `var(${assignedMember.AvatarColor})`);
                assignee.appendChild(assigneeName);
            }

            showSubtaskAssignee();
            const status = document.createElement('h4');
            status.classList.add('status');
            const statusType = {
                'HTY': 'To Do',
                'OTW': 'In Progress',
                'DONE': 'Done'
            }
            status.textContent = statusType[task.Status];
            subtask.appendChild(work);
            subtask.appendChild(priorityLabel);
            subtask.appendChild(assignee);
            subtask.appendChild(status);

            subtask.addEventListener('click', (e) => {
                if(e.target.closest('.priorityLabel') || assignee.contains(e.target))return;

                triggerTaskDetail(task, projectID);
            });

            subtaskList.appendChild(subtask);
        });
    }

    //Actions
    const saveDescription = taskDetailDialog.querySelector('#saveDescription');
    const cancelDescription = taskDetailDialog.querySelector('#cancelDescription');

    title.addEventListener('input', () => {
        saveDescription.classList.remove('hide');
        cancelDescription.classList.remove('hide');
    });

    cancelDescription.addEventListener('click', () => {
        descriptionEdit.classList.add('hide');
        descriptionView.classList.remove('hide');
        descriptionView.classList.remove('collapsed');
        saveDescription.classList.add('hide');
        cancelDescription.classList.add('hide');
        hideDescription.classList.remove('hide');
        title.blur();
        title.value = task.TaskTitle;
        taskDescriptionEdit.value = task.Description;
    });
    
    saveDescription.addEventListener('click', () => {
        descriptionEdit.classList.add('hide');
        descriptionView.classList.remove('hide');
        descriptionView.classList.remove('collapsed');
        saveDescription.classList.add('hide');
        cancelDescription.classList.add('hide');
        hideDescription.classList.remove('hide');
        task.TaskTitle = title.value.trim();
        task.Description = taskDescriptionEdit.value;
        taskDescriptionView.textContent = task.Description;
        updateTask(task);
    });

    function toggleCalenderPopup(toggle, d, type){
        const rect = toggle.getBoundingClientRect();
        const dialog = taskDetailDialog.getBoundingClientRect();
        calendarInDialog.style.top = `${rect.bottom - dialog.top}px`;
        calendarInDialog.style.left = `${rect.left - dialog.left}px`;
        calendarInDialog.classList.add('show');
        
        let selected = new Date(d);
        let currentDate = new Date(d);
        const monthYearElement = calendarInDialog.querySelector('.monthYear');
        const datesElement = calendarInDialog.querySelector('.dates');
        const prevBtn = calendarInDialog.querySelector('.prevBtn');
        const nextBtn = calendarInDialog.querySelector('.nextBtn');
        const errorMessage = taskDetailDialog.querySelector('.errorMesssage');

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
                const activeClass =
                    date.getDate() === selected.getDate() &&
                    date.getMonth() === selected.getMonth() &&
                    date.getFullYear() === selected.getFullYear()
                        ? 'active'
                        : '';
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
                        const day = parseInt(dateEl.textContent, 10);
                        const month = currentDate.getMonth() + 1;
                        const year = currentDate.getFullYear();
                        const selectedDate = new Date(year, currentDate.getMonth(), day)

                        const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

                        if(type === 'start'){
                            if(selectedDate > task.DueDate){
                                errorMessage.textContent = '*Start date must be earlier than the due date!*';
                                errorMessage.style.display = 'block';
                                errorMessage.style.color = 'var(--overdue-color)';
                                return;
                            }
                            toggle.textContent = formattedDate;
                            console.log(formattedDate);
                            allDates.forEach(d => d.classList.remove('active'));
                            dateEl.classList.add('active');
                            task.StartDate = selectedDate;
                            updateTask(task);
                        }
                        else if(type === 'end'){
                            if(selectedDate < task.StartDate){
                                errorMessage.textContent = '*Due date cannot be earlier than the start date!*';
                                errorMessage.style.display = 'block';
                                errorMessage.style.color = 'var(--overdue-color)';
                                return;
                            }
                            toggle.textContent = formattedDate;
                            console.log(formattedDate);
                            if(selectedDate < todayD) toggle.style.color = 'var(--overdue-color)';
                            else toggle.style.color = 'rgba(var(--secondary-color), 1)';
                            allDates.forEach(d => d.classList.remove('active'));
                            dateEl.classList.add('active');
                            task.DueDate = selectedDate;
                            updateTask(task);
                        }
                        calendarInDialog.classList.remove('show');
                        selected = selectedDate;
                        console.log(selected);
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

        updateCalendar();
    }
    
    if (loggedInUserRole.Role === 'Team Leader' || loggedInUserRole.Role === 'Project Manager') {
        selectedStartDate.style.cursor = 'pointer';
        selectedDueDate.style.cursor = 'pointer';

        if (!selectedStartDate.dataset.listenerAdded) {
            selectedStartDate.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('StartDate clicked');
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
                toggleCalenderPopup(selectedStartDate, task.StartDate, 'start');
            });
            selectedStartDate.dataset.listenerAdded = 'true';
        }

        if (!selectedDueDate.dataset.listenerAdded) {
            selectedDueDate.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('DueDate clicked');
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
                toggleCalenderPopup(selectedDueDate, task.DueDate, 'end');
            });
            selectedDueDate.dataset.listenerAdded = 'true';
        }
    } else{
        console.log(loggedInUserRole.Role, 'do not have permission')
    }
    
    const editor = taskDetailDialog.querySelector('.editor');
    const sendCommentBtn = taskDetailDialog.querySelector('.sendIcon');

    sendCommentBtn.addEventListener('click', async() =>  {
        const newCommentID = generateCommentID(comments);
        const fileCardList = taskDetailDialog.querySelector('.fileCardList');
        let inlineImages = [];
        let otherAttachments = [];
        editor.querySelectorAll('.file-preview img').forEach(img => {
            const parent = img.closest('.file-preview');
            
            if(parent && parent.file){
                inlineImages.push({img, file: parent.file});
            };
        });
        
        taskDetailDialog.querySelectorAll('.fileCardList .fileCard').forEach(file => {
            const parent = file.closest('.fileCard');
            if(parent && parent.file){
                otherAttachments.push(parent.file);
            };
        });

        if((editor.innerHTML === '<p><br></p>' || editor.innerHTML === '' )
            && otherAttachments.length === 0
        ){
            console.log('Editor is empty, cannot send');
            return;
        };

        try {
            const formData = new FormData();
            formData.append('CommentID', newCommentID);
            formData.append('TaskID', task.TaskID);
            formData.append('UserID', loggedInUserID);
            formData.append('Description', '');
            formData.append('CreatedAt', formatLocalDateTime(new Date()));

            const res = await fetch('submit_comment.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            });
            const data = await res.json();
            if (data.status !== 'ok') {
                console.error('Failed to create comment:', data.message);
                return;
            }
        } catch (err) {
            console.error('Error creating empty comment:', err);
            return;
        }
        
        for(const {img, file} of inlineImages){
            const formData = new FormData();
            formData.append('file', file);
            formData.append('CommentID', newCommentID);
            formData.append('UploadedBy', loggedInUserID);
            formData.append('UploadTime', formatLocalDateTime(new Date()));

            try{
                const res = await fetch('upload_comment_attachment.php', {
                    method: 'POST',
                    credentials: 'same-origin',
                    body: formData
                });

                const data = await res.json();
                if (data.status === 'ok') {
                    img.src = data.FilePath;
                }else {
                    console.error('Upload failed for inline image:', file.name);
                }
            }catch (err) {
                console.error('❌ Error storing comment inline image:', err);
            }
        }

        for(file of otherAttachments){
            const formData = new FormData();
            formData.append('file', file);
            formData.append('CommentID', newCommentID);
            formData.append('UploadedBy', loggedInUserID);
            formData.append('UploadTime', formatLocalDateTime(new Date()));

            try{
                const res = await fetch('upload_comment_attachment.php', {
                    method: 'POST',
                    credentials: 'same-origin',
                    body: formData
                });

                const data = await res.json();
                if (data.status === 'ok') {
                    console.log('successful store file');
                }else {
                    console.error('Upload failed for comment file:', file.name);
                }
            }catch (err) {
                console.error('❌ Error storing comment file:', err);
            }
        }

        const tempEditor = editor.cloneNode(true);
        tempEditor.querySelectorAll('.file-preview .deleteFile').forEach(btn => btn.remove());
        
        const desc = tempEditor.innerHTML
            .trim()
            .replace(/(<div><br><\/div>)+$/g, '')
            .replace(/(<p><br><\/p>)+$/i, '');

        try {
            const updateData = new FormData();
            updateData.append('CommentID', newCommentID);
            updateData.append('Description', desc);

            const res = await fetch('update_comment_desc.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: updateData
            });
            const data = await res.json();
            if (data.status === 'ok') {
                console.log('✅ Comment finalized:', newCommentID);
            } else {
                console.error('Failed to update comment:', data.message);
            }
        } catch (err) {
            console.error('Error updating comment description:', err);
        }

        editor.innerHTML = '<p><br></p>';
        checkEmpty();
        fileCardList.innerHTML = '';
        fileCardList.classList.add('hide');

        if(Array.from(activityList.children).length > 0){
            noMessage.classList.add('hide');
        }
        
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
                commentAttachments = data.commentAttachments;
                comments = data.comments;
                triggerTaskDetail(task, projectID);
            } else {
                console.error('❌ Error:', data.message);
            }
        } catch (err) {
            console.error('❌ Failed to fetch project summary:', err);
        }
    });

    document.addEventListener('click', (e) => {
        const isClickInsideCalendar =
            calendarInDialog.contains(e.target) ||
            selectedStartDate.contains(e.target) ||
            selectedDueDate.contains(e.target);

        const isClickInsideMemberOption = memberOption.contains(e.target);

        const isClickInsideAssignee =
            e.target.closest('.assignee, .assigneeEl') !== null;

        if (!isClickInsideCalendar && calendarInDialog.classList.contains('show')) {
            calendarInDialog.classList.remove('show');
        }
        else if (
            !isClickInsideMemberOption &&
            !isClickInsideAssignee &&
            memberOption.classList.contains('show')
        ) {
            memberOption.classList.remove('show');
            console.log('hide');
        }
    });

    const deleteTaskBtn = document.createElement('div');
    deleteTaskBtn.classList.add('deleteTaskBtn');
    deleteTaskBtn.innerHTML =  `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    `
    deleteTaskBtn.addEventListener('click', () => {
        const confirmation = document.querySelector('.confirmationDialog');
        const cancelButton = confirmation.querySelector('.cancel');
        const confirmButton = confirmation.querySelector('.confirm');
        const title = confirmation.querySelector('h3');

        title.textContent = 'Do you confirm to delete this Task?';

        cancelButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            confirmation.close();
        };

        confirmButton.onclick = async () => {
            const taskId = task.TaskID;
            if (!taskId) return;

            try {
                const response = await fetch('delete_task.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ TaskID: taskId })
                });

                const result = await response.json();
                if (result.status === 'ok') {
                    confirmation.close();
                    taskDetailDialog.close();
                    fetchProjectData();

                    const successfulMessage = document.createElement('div');
                    successfulMessage.classList.add('successfulMessage');
                    successfulMessage.innerHTML = `Successfully deleted Task "${task.TaskTitle}"`
                    messageContainer.appendChild(successfulMessage);
                    successfulMessage.classList.add('active');
                    setTimeout(() => {
                        messageContainer.removeChild(successfulMessage);
                    }, 5000);
                } else {
                    console.error('❌ Failed to delete:', result.message);
                }
            } catch (err) {
                console.error('❌ Error deleting event:', err);
            }
        };

        confirmation.showModal();
    });

    if(loggedInUserRole.Role === 'Team Leader' || loggedInUserRole.Role === 'Project Manager' ){
        taskDetailDialog.appendChild(deleteTaskBtn);
    }

    closeBtn.onclick = () => generateTasks(tasks, loggedInUserRole.Role, projectID);

    taskDetailDialog.showModal();
}

function formatLocalDateTime(date) {
    if (!date) return null;
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 19).replace('T', ' ');
}

async function updateTask(task) {
    try {
        const response = await fetch('update_task.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                TaskID: task.TaskID,
                TaskTitle: task.TaskTitle,
                Description: task.Description,
                AssignedUserID: task.AssignedUserID,
                StartDate: formatLocalDateTime(task.StartDate),
                DueDate: formatLocalDateTime(task.DueDate),
                Priority: task.Priority,
                Status: task.Status,
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log("✅ Task updated successfully");
        } else {
            console.error("❌ Update failed:", data.error);
        }
    } catch (error) {
        console.error("❌ Network error:", error);
    }
}

