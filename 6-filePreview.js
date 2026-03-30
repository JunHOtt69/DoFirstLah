function initPreview(attachment) {
    const attachmentPreview = document.querySelector('.attachmentPreview');

    attachmentPreview.innerHTML = ``;

    const noPreviewEnabled = document.createElement('div');
    noPreviewEnabled.classList.add('noPreviewEnabled');
    noPreviewEnabled.innerHTML = `<h3>No Preview Enabled</h3>`;

    attachmentPreview.appendChild(noPreviewEnabled);
    noPreviewEnabled.classList.remove('hidden');

    const zoomTool = document.querySelector('.attachmentPreviewWrapper .zoomTool');
    const videoControls = document.querySelector('.attachmentPreviewWrapper .videoControls');
    zoomTool.classList.add('hidden');
    videoControls.style.display = 'none';
    videoControls.style.pointerEvents = 'none';

    if (previewType.includes(attachment.FileType)) {
        noPreviewEnabled.classList.add('hidden');

        const img = document.createElement('img');
        img.src = attachment.FilePath;
        img.alt = attachment.FileName;
        zoomTool.classList.remove('hidden');

        attachmentPreview.appendChild(img);

        initImagePreview(img);

    } else if (attachment.FileType === 'MP4') {
        noPreviewEnabled.classList.add('hidden');
        const video = document.createElement('video');
        video.src = attachment.FilePath;
        video.alt = attachment.FileName;

        videoControls.style.display = 'block';
        videoControls.style.pointerEvents = 'auto';
        
       const timeline = document.createElement('input');
        timeline.type = 'range';
        timeline.name = 'timeline';
        timeline.id = 'timeline';
        timeline.value = '0';
        timeline.step = '0.1';
        timeline.className = 'timeline';
        timeline.min = '0';
        timeline.max = '100';

        const videoDetailWrapper = document.createElement('div');
        videoDetailWrapper.classList.add('videoDetailWrapper');
        videoDetailWrapper.innerHTML = `
            <div class="videoDetailWrapper2">
                <span class="time">00:00:00 / 00:00:00</span>
                <span class="volumeControl">
                    <svg class="volumeMax" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                        <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                    </svg>

                    <svg class="volumeMin hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 " />
                        <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                    </svg>
                    <svg class="volumeZero hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
                    </svg>
                    <input type="range" name="volume" id="volume" value="100" step="0.1" class="volume" min="0" max="100">
                </span>
            </div>

            <button class="fullScreenToggle">
                <svg class="fullScreen" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <polyline class="cornerTL" points="7.49 26 7.49 7.5 25.99 7.5"/>
                    <polyline class="cornerTR" points="56.51 26 56.51 7.5 38.01 7.5"/>
                    <polyline class="cornerBL" points="7.53 38 7.53 56.5 26.02 56.5"/>
                    <polyline class="cornerBR" points="56.51 38 56.51 56.5 38.01 56.5"/>
                </svg>

                <svg class="exitFullScreen hidden" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path class="cornerTL"d="M1 6L6 6L6 1L4.2 1L4.2 4.2L1 4.2L1 6Z"/>
                    <path class="cornerTR" d="M10 1L10 6L15 6L15 4.2L11.8 4.2L11.8 1L10 1Z"/>
                    <path class="cornerBL" d="M6 15L6 10L1 10L1 11.8L4.2 11.8L4.2 15L6 15Z"/>
                    <path class="cornerBR" d="M15 10L10 10L10 15L11.8 15L11.8 11.8L15 11.8L15 10Z"/>
                </svg>
            </button>
        `;

        attachmentPreview.appendChild(video);
        attachmentPreview.appendChild(timeline);
        attachmentPreview.appendChild(videoDetailWrapper);
        initVideoPreview(video);
        
    } else {
        noPreviewEnabled.classList.remove('hidden');
    }
}

function initImagePreview(img) {
    console.log("Image preview initialized", img);
    const preview = document.querySelector('.attachmentDetail .attachmentPreview');
    const zoomInBtn = document.querySelector('.zoomIn');
    const zoomOutBtn = document.querySelector('.zoomOut');
    const ratioText = document.querySelector('.viewRatio');
    const zoomTool = document.querySelector('.zoomTool');

    zoomTool.classList.remove('hidden');

    let zoomLevel = 1;
    let zoomInterval = null;
    let zoomTimeout = null;
    let isPreviewDragging = false;
    let startX, startY;
    let currentX = 0, currentY = 0;
    const zoomStep = 0.1;
    const zoomDelay = 50;
    const holdDelay = 500;
    const maxZoom = 5;
    const minZoom = 0.1;

    function updateZoom(){
        const previewRect = preview.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();
        
        if(imgRect.width >= previewRect.width ||
        imgRect.height >= previewRect.height){
            img.style.transform = `translate(${currentX}px, ${currentY}px) scale(${zoomLevel})`;

            if(imgRect.width <= previewRect.width ||
            imgRect.height <= previewRect.height){
                currentX = 0, currentY = 0;
                img.style.transform = `scale(${zoomLevel})`;
            }
            
        }else{
            currentX = 0, currentY = 0;
            img.style.transform = `scale(${zoomLevel})`;
        }

        img.style.transition = 'transform 0.2s ease';
        ratioText.textContent = Math.round(zoomLevel * 100) + '%';
        preview.style.cursor = canDrag() ? 'grab' : 'default';
    }

    const applyZoom = (direction) => {
        if(direction === 'in' && zoomLevel < 5){
            zoomLevel = Math.min(maxZoom, +(zoomLevel + zoomStep).toFixed(2));
            updateZoom();
        }
        if(direction === 'out' && zoomLevel > 0.1){
            zoomLevel = Math.max(minZoom, +(zoomLevel - zoomStep).toFixed(2));
            updateZoom();
        }
    }

    function startZooming(direction){
        stopZooming();

        applyZoom(direction);

        zoomTimeout = setTimeout(() => {
            zoomInterval = setInterval(() => {
                applyZoom(direction);
            }, zoomDelay);
        }, holdDelay);
    }

    function stopZooming(){
        if (zoomTimeout){
            clearTimeout(zoomTimeout);
            zoomTimeout = null;
        }
        if (zoomInterval){
            clearInterval(zoomInterval);
            zoomInterval = null;
        }
    }

    function canDrag(){
        const previewRect = preview.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();

        return(
            imgRect.width > previewRect.width ||
            imgRect.height > previewRect.height
        )
    }

    preview.addEventListener('mousedown', (e) => {
        if(!document.querySelector('.attachmentDetail img')) return;
        if(!canDrag()) return;
        isPreviewDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        preview.style.cursor = 'grabbing';
    });

    preview.addEventListener('wheel', (e) => {
        if(!document.querySelector('.attachmentDetail img')) return;
        e.preventDefault();
        if(e.deltaY < 0){
            applyZoom('in');
        }else{
            applyZoom('out');
        }
    });

    zoomInBtn.addEventListener('mousedown', () => startZooming('in'));
    zoomOutBtn.addEventListener('mousedown', () => startZooming('out'));

    document.addEventListener('mouseup', stopZooming);
    document.addEventListener('mouseleave', stopZooming);
    document.addEventListener('mouseup', () => {
        if(!isPreviewDragging) return;
        isPreviewDragging = false;
        preview.style.cursor = canDrag() ? 'grab' : 'default';
    })

    document.addEventListener('mousemove', (e) => {
        if(!isPreviewDragging) return;
        e.preventDefault();
        
        const previewRect = preview.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();

        let newX = e.clientX - startX;
        let newY = e.clientY - startY;

        const maxOffsetX = Math.max(0, (imgRect.width - previewRect.width) / 2);
        const maxOffsetY = Math.max(0, (imgRect.height - previewRect.height) / 2);

        newX = Math.min(maxOffsetX, Math.max(-maxOffsetX, newX));
        newY = Math.min(maxOffsetY, Math.max(-maxOffsetY, newY));

        currentX = newX;
        currentY = newY;

        img.style.transition = 'transform 0.05s';
        img.style.transform = `translate(${currentX}px, ${currentY}px) scale(${zoomLevel})`;
    });
}

function initVideoPreview(video){
    console.log("Video preview initialized", video);
    const preview = document.querySelector('.attachmentDetail .attachmentPreview');
    const playPauseBtn = document.querySelector('.playPause');
    const play = playPauseBtn.querySelector('.play');
    const pause = playPauseBtn.querySelector('.pause');
    const timeline = document.querySelector('.timeline');
    const time = document.querySelector('.time');
    const videoDetailWrapper = document.querySelector('.videoDetailWrapper');
    const hoverDelay = 750;
    const fullScreenDelay = 1000;
    let hideTimeout;
    let isPause = true;

    playPauseBtn.classList.remove('hide');
    playPauseBtn.classList.add('show');
    videoDetailWrapper.classList.remove('hidden');

    if(videoDetailWrapper.classList.contains('hidden')){
        console.log('videoDetailWrapper contained hidden')
    }else if(!videoDetailWrapper){
        console.warn("videoDetailWrapper not found!");
    }
    else{
        console.log('videoDetailWrapper removed hidden')
    }

    function formatTime(seconds){
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if(hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        else return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateTimeline(){
        const val = (timeline.value / timeline.max) * 100;
        timeline.style.setProperty('--progress', val + '%');
    }

    video.addEventListener('timeupdate', () => {
        if(!isNaN(video.duration)){
            timeline.max = video.duration;
            timeline.value = video.currentTime;
            
            const videoDuration = formatTime(video.duration);
            const videoCurrentTime = formatTime(video.currentTime);
            updateTimeline();

            time.textContent = `${videoCurrentTime} / ${videoDuration}`;
        }
    })

    video.addEventListener('loadedmetadata', () => {
        timeline.max = video.duration;
        updateTimeline();
        const videoDuration = formatTime(video.duration);
        const videoCurrentTime = formatTime(video.currentTime);
        updateTimeline();
        time.textContent = `${videoCurrentTime} / ${videoDuration}`;
        video.volume = 1;
        updateVolumeIcons(1);
        volumeSlider.value = 100;
    })

    timeline.addEventListener('input', () => {
        video.currentTime = timeline.value;
        updateTimeline();
    });

    video.addEventListener('ended', () => {
        isPause = true;
        playPauseBtn.classList.add('show');
        playPauseBtn.classList.remove('hide');
        play.classList.remove('hidden');
        pause.classList.add('hidden');
        timeline.classList.remove('hide');
        timeline.classList.add('show');
        time.classList.remove('hide'); 
        time.classList.add('show'); 
        fullScreenToggle.classList.add('show'); 
        fullScreenToggle.classList.remove('hide');
    })

    updateTimeline();

    playPauseBtn.addEventListener('click', () => {
        if(video.paused){
            isPause = false
            video.play();
            play.classList.add('hidden');
            pause.classList.remove('hidden');
        }else{
            isPause = true;
            video.pause();
            play.classList.remove('hidden');
            pause.classList.add('hidden');
        }
    })

    if(isPause){
        playPauseBtn.classList.add('show');
        playPauseBtn.classList.remove('hide');
        timeline.classList.remove('hide');
        timeline.classList.add('show');
        time.classList.remove('hide'); 
        time.classList.add('show');
    }

    preview.addEventListener('click', (e) => {
        if (e.target.closest('.videoControls, .videoDetailWrapper, .zoomTool, .timeline')){
            return;
        }
        if(video.paused){
            isPause = false
            video.play();
            play.classList.add('hidden');
            pause.classList.remove('hidden');
        }else{
            isPause = true;
            video.pause();
            play.classList.remove('hidden');
            pause.classList.add('hidden');
        } 
    })

    preview.addEventListener('mousemove', (e) => {
        console.log('mousemove on preview');

        clearTimeout(hideTimeout);

        if (e.target.closest('.videoDetailWrapper, .volumeControl, .fullScreenToggle, .zoomTool, .timeline')) {
            console.log("Mouse is on controls → skipping auto-hide logic");
            return;
        }

        playPauseBtn.classList.remove('hide');
        playPauseBtn.classList.add('show');
        timeline.classList.remove('hide');
        timeline.classList.add('show');
        time.classList.remove('hide');
        time.classList.add('show');
        volumeControl.classList.add('show');
        volumeControl.classList.remove('hide');
        fullScreenToggle.classList.add('show');
        fullScreenToggle.classList.remove('hide'); 

        if(document.fullscreenElement) {
            hideTimeout = setTimeout(() => {
                playPauseBtn.classList.remove('show');
                playPauseBtn.classList.add('hide');
                timeline.classList.remove('show');
                timeline.classList.add('hide');
                time.classList.remove('show'); 
                time.classList.add('hide'); 
                volumeControl.classList.add('hide'); 
                volumeSlider.classList.remove('show'); 
                fullScreenToggle.classList.remove('show'); 
                fullScreenToggle.classList.add('hide');
            }, fullScreenDelay);
        }
    });

    preview.addEventListener('mouseout', (e) => {
        if (
            playPauseBtn.contains(e.relatedTarget) ||
            timeline.contains(e.relatedTarget) ||
            time.contains(e.relatedTarget) ||
            volumeControl.contains(e.relatedTarget) ||
            fullScreenToggle.contains(e.relatedTarget) ||
            e.relatedTarget?.closest('.videoDetailWrapper, .volumeControl, .fullScreenToggle, .zoomTool')
        ) {
            console.log("Mouse moved into controls → skip hide");
            return;
        }
        if(!isPause){
            hideTimeout = setTimeout(() => {
                playPauseBtn.classList.remove('show');
                playPauseBtn.classList.add('hide');
                timeline.classList.remove('show');
                timeline.classList.add('hide');
                time.classList.remove('show'); 
                time.classList.add('hide'); 
                volumeControl.classList.remove('show');
                volumeControl.classList.add('hide');
                volumeSlider.classList.remove('show'); 
                fullScreenToggle.classList.remove('show'); 
                fullScreenToggle.classList.add('hide');
            }, hoverDelay);
        }
    });

    const volumeMax = document.querySelector('.volumeMax');
    const volumeMin = document.querySelector('.volumeMin');
    const volumeZero = document.querySelector('.volumeZero');
    const volumeSlider = document.getElementById('volume');
    const volumeControl = document.querySelector('.volumeControl');

    let lastVolume = 1;

    function updateVolumeIcons(volume){
    if(volume === 0 || video.muted){
        volumeMax.classList.add('hidden');
        volumeMin.classList.add('hidden');
        volumeZero.classList.remove('hidden');
    } else if(volume < 0.6){
        volumeMax.classList.add('hidden');
        volumeMin.classList.remove('hidden');
        volumeZero.classList.add('hidden');
    }else{
        volumeMax.classList.remove('hidden');
        volumeMin.classList.add('hidden');
        volumeZero.classList.add('hidden');
    }
    }

    function updateVolumeTrack(){
    const val = (volumeSlider.value / volumeSlider.max) * 100;
    volumeSlider.style.setProperty('--volume', val + '%');
    }

    volumeControl.addEventListener('mouseover', () => {
    volumeSlider.classList.add('show');
    })

    volumeSlider.addEventListener('input', () => {
    const vol = volumeSlider.value / 100;
    video.volume = vol;
    video.muted = vol === 0;

    if(vol > 0) lastVolume = vol;

    updateVolumeIcons(vol);
    updateVolumeTrack();
    })

    volumeMax.addEventListener('click', () => {
    video.muted = true;
    volumeSlider.value = 0;
    updateVolumeIcons(0);
    updateVolumeTrack();
    })

    volumeMin.addEventListener('click', () => {
    video.muted = true;
    volumeSlider.value = 0;
    updateVolumeIcons(0);
    updateVolumeTrack();
    })

    volumeZero.addEventListener('click', () => {
    video.muted = false;
    video.volume = lastVolume;
    volumeSlider.value = lastVolume * 100;
    updateVolumeIcons(lastVolume);
    updateVolumeTrack();
    })

    updateVolumeTrack();


    const fullScreenToggle = document.querySelector('.fullScreenToggle');
    const fullScreenIcon = document.querySelector('.fullScreen');
    const exiitFullScreenIcon = document.querySelector('.exitFullScreen');
    const fullScreenContainer = document.querySelector('.attachmentPreviewWrapper');


    fullScreenToggle.addEventListener('click', () => {
    if(!document.fullscreenElement){
        fullScreenContainer.requestFullscreen()
            .then(() => {
                fullScreenIcon.classList.add('hidden');
                exiitFullScreenIcon.classList.remove('hidden');
            })
            .catch(err => {
                console.error(`Error trying to enable fullscreen: ${err.message}`);
            });
    }else{
        document.exitFullscreen()
            .then(() => {
                fullScreenIcon.classList.remove('hidden');
                exiitFullScreenIcon.classList.add('hidden');
            })
            .catch(err => {
                console.error(`Error trying to enable fullscreen: ${err.message}`);
            });
    }
    });
}

function checkEmpty() {
    const commentSection = document.getElementById('editor');
    const placeHolder = document.querySelector('.placeHolder');

    const hasText = commentSection.innerText.trim().length > 0;
    const hasImage = commentSection.querySelector('.file-preview') !== null;

    if (!hasText && !hasImage) {
        console.log("Editor is empty");
        placeHolder.style.display = "block";
    } else {
        placeHolder.style.display = "none";
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

function formatLocalDateTime(date) {
    if (!date) return null;
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 19).replace('T', ' ');
}

function triggerPreviewDialog(attachment){
    const attachmentDetail = document.querySelector('.attachmentDetail');
    const fileRepository = attachmentDetail.querySelector('.fileRepository');
    const fileSize = attachmentDetail.querySelector('.fileSize');
    const uploadTime = attachmentDetail.querySelector('.uploadTime');
    const memberAvatar = attachmentDetail.querySelector('.memberAvatar');
    const editor =  attachmentDetail.querySelector('.editor');
    const downloadButton =  attachmentDetail.querySelector('.downloadButton');
    const sendCommentBtn =  attachmentDetail.querySelector('.sendIcon');
    const messageWrapper =  attachmentDetail.querySelector('.messageWrapper');
    const closeBtn = attachmentDetail.querySelector('.closeBtn');

    messageWrapper.innerHTML = ``;

    const task = tasks
        .find(t => t.TaskID === attachment.TaskID);
    
    const parentTask = tasks
        .find(t => t.TaskID === task.ParentTaskID);
        
    console.log(task);
    console.log(parentTask);

    fileRepository.innerHTML = ``;

    if(parentTask){
        const parentTaskName = document.createElement('h3');
        parentTaskName.textContent = parentTask.TaskTitle;
        const slash1 = document.createElement('span');
        slash1.textContent = `/`;

        parentTaskName.style.cursor = 'pointer';
        parentTaskName.addEventListener('click', () => {
            redirecToTask(parentTask.TaskID, parentTask.ProjectID);
        });
       
        fileRepository.appendChild(parentTaskName);
        fileRepository.appendChild(slash1);
    }

    const taskName = document.createElement('h3');
    taskName.textContent = task.TaskTitle;
    taskName.style.cursor = 'pointer';
    taskName.addEventListener('click', () => {
        redirecToTask(task.TaskID, task.ProjectID);
    });

    const slash2 = document.createElement('span');
    slash2.textContent = `/`;
    const attachmentName = document.createElement('h3');
    attachmentName.textContent = attachment.FileName;

    fileRepository.appendChild(taskName);
    fileRepository.appendChild(slash2);
    fileRepository.appendChild(attachmentName);
    fileSize.textContent = `${formatFileSize(attachment.FileSize)}`;
    uploadTime.textContent = `${timeAgo(new Date(attachment.UploadTime))}`;

    const uploadBy = members.find(m => m.UserID === attachment.UploadedBy);
    memberAvatar.textContent = uploadBy.FullName.charAt(0).toUpperCase();
    memberAvatar.style.setProperty('--upload-avatar', `var(${uploadBy.AvatarColor})`);

    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = attachment.FilePath || '#';
        link.download = attachment.FileName;
        link.click();

        messageWrapper.innerHTML = ``;
        const message = document.createElement('div');
        message.classList.add('message');
        message.innerHTML = `Attachment Download Started.`
        messageWrapper.appendChild(message);
        message.classList.add('active');
        setTimeout(() => {
            messageWrapper.removeChild(message);
        }, 5000);

    });

    editor.addEventListener('input', checkEmpty);
    editor.addEventListener('paste', function(e) {
        e.preventDefault();
        
        const clipboardData = e.clipboardData || window.clipboardData;
        
        const text = clipboardData.getData('text/plain');
        
        document.execCommand('insertText', false, text);
    });
    checkEmpty();
    
    sendCommentBtn.addEventListener('click', async() =>  {
        const newCommentID = generateCommentID(comments);

        if(editor.innerHTML === '<p><br></p>' || editor.innerHTML === ''){
            console.log('Editor is empty, cannot send');
            return;
        };

        const tempEditor = editor.cloneNode(true);
        
        const desc = tempEditor.innerHTML
            .trim()
            .replace(/(<div><br><\/div>)+$/g, '')
            .replace(/(<p><br><\/p>)+$/i, '');


        try {
            const formData = new FormData();
            formData.append('CommentID', newCommentID);
            formData.append('TaskID', task.TaskID);
            formData.append('UserID', loggedInUserID);
            formData.append('Description', desc);
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
            }else{
                messageWrapper.innerHTML = ``;
                const message = document.createElement('div');
                message.classList.add('message');
                message.innerHTML = `Comment Sent.`
                messageWrapper.appendChild(message);
                message.classList.add('active');
                setTimeout(() => {
                    messageWrapper.removeChild(message);
                }, 5000);
            }
        } catch (err) {
            console.error('Error creating empty comment:', err);
            return;
        }

        editor.innerHTML = '<p><br></p>';
        checkEmpty();
    });


    function closeAttachmentPreview() {
        const video = document.querySelector('.attachmentPreview video');
        if (video) {
            video.pause();
            video.src = '';
            video.load();
        }

        const videoDetailWrapper = document.querySelector('.videoDetailWrapper');
        if (videoDetailWrapper) videoDetailWrapper.remove();

        const timeline = document.querySelector('.timeline');
        if (timeline) timeline.remove();

        const playPauseBtn = document.querySelector('.playPause');
        if (playPauseBtn) playPauseBtn.classList.add('hide');

        const play = playPauseBtn.querySelector('.play');
        const pause = playPauseBtn.querySelector('.pause');
        play.classList.remove('hidden');
        pause.classList.add('hidden');
    }

    closeBtn.addEventListener('click', () => {
        closeAttachmentPreview();
    });

    initPreview(attachment);
    attachmentDetail.showModal();
}