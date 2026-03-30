const panes = document.querySelectorAll('.panel')
const rightPanel = document.querySelector('.rightPanel')
panes.forEach(pane =>{
    const resizer = pane.querySelector('.resizer')
    const container = pane.parentElement

    if (!resizer) return;

    resizer.addEventListener('mousedown', (event) => {
        let w = pane.clientWidth
        let rw = rightPanel.clientWidth
        let startX = event.pageX
        const containerWidth = container.clientWidth
        const minPercent = 0.15;
        const hidePercent = 0.05;
        const guideLines = document.querySelector('.guideLines');
        const guideLinesWidth = guideLines.getBoundingClientRect().width;

        const drag = (event) => {
            let delta = event.pageX - startX;
            
            let newLeftWidth = w + delta;
            let newRightWidth = rw - delta;

            const minLeftWidth = containerWidth * minPercent;
            const minRightWidth = containerWidth * minPercent;

            if (newLeftWidth < minLeftWidth){
                return;
            }

            else if (newRightWidth < minRightWidth){
                rightPanel.classList.add('collapsed');
                newRightWidth = containerWidth * hidePercent;

                rightPanel.querySelectorAll('*').forEach(child => {
                    child.classList.add('collapsed');
                })

                newLeftWidth = containerWidth * 0.85;
            }

            else if (newRightWidth > minRightWidth){
                rightPanel.classList.remove('collapsed');
                rightPanel.querySelectorAll('*').forEach(child => {
                    child.classList.remove('collapsed');
                })
            }

            pane.style.width = newLeftWidth + 'px'
            rightPanel.style.width = newRightWidth + 'px'
            
            const calender = document.querySelector('.calender');
            const calenderStyle = getComputedStyle(calender);
            const timeWrapper = document.querySelector('.timeWrapper');
            const timeWidth = timeWrapper.querySelectorAll('h5')[0].offsetWidth; 
            
            guideLines.style.width = (
                calender.offsetWidth + 
                parseFloat(calenderStyle.paddingLeft) -
                timeWidth
            ) + 'px';
        };
        const mouseup = () => {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', mouseup);
        };

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', mouseup);
    });
})

console.log(window.innerWidth);
console.log(window.innerHeight);


const calender = document.querySelector('.calender');
const calenderStyle = getComputedStyle(calender);
const calenderDays = document.querySelector('.calenderDays');
const monthTime = document.querySelector('.monthTime');
const timeWrapper = monthTime.querySelector('.timeWrapper');
const dayEls = calenderDays.querySelectorAll('.day');
const guideLines = document.querySelector('.guideLines');

const timeWidth = timeWrapper.querySelectorAll('h5')[0].offsetWidth;
const timeWrapperHeight = timeWrapper.offsetHeight;

guideLines.style.width = (calender.offsetWidth + parseFloat(calenderStyle.paddingLeft) - timeWidth) + 'px';
guideLines.style.height = timeWrapperHeight + 'px';

let isDownCalender = false;
let startX;
let scrollLeft;

calenderDays.addEventListener('mousedown', (e) => {
    if(e.target.closest('.eventCard')) return;
    
    isDownCalender = true;
    calenderDays.classList.add('dragging');
    startX = e.pageX - calenderDays.offsetLeft;
    scrollLeft = calenderDays.scrollLeft;
});

calenderDays.addEventListener('mouseleave', () => {
    isDownCalender = false;
    calenderDays.classList.remove('dragging');
});

calenderDays.addEventListener('mouseup', () => {
    isDownCalender = false;
    calenderDays.classList.remove('dragging');
});

calenderDays.addEventListener('mousemove', (e) => {
    if(!isDownCalender) return;
    e.preventDefault();
    const x = e.pageX - calenderDays.offsetLeft;
    const walk = (x - startX) * 1.5;
    calenderDays.scrollLeft = scrollLeft - walk;
});

function attachScrollSync(){
    const scrollWrappers = document.querySelectorAll('.scrollWrapper');
    let isSyncingScroll = false;

    scrollWrappers.forEach(scrollWrapper => {
        scrollWrapper.addEventListener('scroll', () => {
            if(isSyncingScroll) return;

            isSyncingScroll = true;
            const scrollTop = scrollWrapper.scrollTop;

            scrollWrappers.forEach(other => {
                if(other !== scrollWrapper){
                    other.scrollTop = scrollTop;
                }
            });

            if(timeWrapper) timeWrapper.scrollTop = scrollTop;
            if(guideLines) guideLines.scrollTop = scrollTop;

            isSyncingScroll = false;
        });
    });

    if(timeWrapper) {
        timeWrapper.addEventListener('scroll', () => {
            isSyncingScroll = true;
            const scrollTop = timeWrapper.scrollTop;

            scrollWrappers.forEach(other => {other.scrollTop = scrollTop});
            if(guideLines) guideLines.scrollTop = timeWrapper.scrollTop;

            isSyncingScroll = false;
        });
    }
}

function scrollToToday(){
    const todayCell = document.querySelector('.dateHeader.today');
    const container = calenderDays;

    const todayOffset = todayCell.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft;
    const containerWidth = container.clientWidth;
    const cellWidth = todayCell.offsetWidth;

    const scrollLeft = todayOffset - (containerWidth / 2) + (cellWidth / 2);

    calenderDays.scrollLeft = scrollLeft;
}

function scrollToNow(){
    const guideLinesWrapper = document.querySelector('.guideLines');
    const scrollWrappers = document.querySelectorAll('.scrollWrapper');
    const guideLines = document.querySelectorAll('.guideLine');
    const firstChildHeight = guideLines[0].offsetHeight;
    const today = new Date();
    const currentHr = today.getHours();

    const guideLinesWrapperHeight = guideLinesWrapper.clientHeight;
    const cellHeight = guideLines[1].offsetHeight;
    const currentOffset = currentHr * cellHeight + firstChildHeight;

    const scrollTop = currentOffset - (guideLinesWrapperHeight / 2) + (cellHeight / 2);

    scrollWrappers.forEach(scrollWrapper => scrollWrapper.scrollTop = scrollTop);
    timeWrapper.scrollTop = scrollTop;
}

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

function triggerEventDetail(ev = {}){
    const eventDetailDialog = document.querySelector('.eventDetail');
    const eventDetailTitle = eventDetailDialog.querySelector('.eventDetailTitle input');
    const editor = eventDetailDialog.querySelector('.editor');
    const descPlaceHolder = eventDetailDialog.querySelector('.placeHolder');
    const remainingLabel = eventDetailDialog.querySelector('.remainingCount');
    const maxLetters = 50
    const pickers = eventDetailDialog.querySelectorAll('.picker');
    const styleOption = eventDetailDialog.querySelector('.selectStyle');
    const deleteBtn = eventDetailDialog.querySelector('.deleteEventBtn');

    const yearPicker = eventDetailDialog.querySelector('.datePickerWrapper #year');
    
    const confirmBtn = document.querySelector('.confirmEvent');
    const cancelBtn = document.querySelector('.cancelEvent');
    const errorMessage = eventDetailDialog.querySelector('.errorMessage');
    const confirmation = document.querySelector('.confirmationDialog');
    
    const style1 = styleOption.querySelector('.style1');
    const style2 = styleOption.querySelector('.style2');
    const style3 = styleOption.querySelector('.style3');
    let selectedStyle = null;
    let todayD = new Date();
    let currentYear = todayD.getFullYear() - 10;

    errorMessage.style.display = 'none';
    eventDetailTitle.value = '';
    editor.textContent = '';
    descPlaceHolder.style.display = 'block';
    remainingLabel.textContent = maxLetters;
    style1.classList.remove('clicked');
    style2.classList.remove('clicked');
    style3.classList.remove('clicked');
    yearPicker.innerHTML = '';

    for(currentYear; currentYear <= todayD.getFullYear() + 10 ; currentYear++){
        const option = document.createElement('div');
        option.classList.add('option');
        if(currentYear === todayD.getFullYear()) option.classList.add('active');
        option.textContent = currentYear;
        yearPicker.appendChild(option);

        currentYear += 1;
    }

    if(ev.EventTitle){
        eventDetailTitle.value = ev.EventTitle;
        const lettersOnly = eventDetailTitle.value.replace(/[^a-zA-Z0-9]/g, '');
        const remainingLetters = maxLetters - lettersOnly.length;
        remainingLabel.textContent = `${remainingLetters}`;
    }
    if(ev.EventDescription){
        editor.textContent = ev.EventDescription;
        descPlaceHolder.style.display = 'none';
    } 

    function checkEmpty() {
        const hasText = editor.innerText.trim().length > 0;
        descPlaceHolder.style.display = hasText ? 'none' : 'block';
    }
    editor.addEventListener('input', checkEmpty);

    eventDetailTitle.addEventListener('input', () => {
        let currentValue = eventDetailTitle.value;
        const lettersOnly = currentValue.replace(/[^a-zA-Z0-9]/g, '');
        const remainingLetters = maxLetters - lettersOnly.length;
        if(remainingLetters >= 0){
            remainingLabel.textContent = `${remainingLetters}`;
        }else{
            return;
        }
    });

    document.querySelectorAll('.picker').forEach(picker => {
        const options = Array.from(picker.querySelectorAll('.option'));
        if (!options.length) return;
        const optionHeight = options[0].offsetHeight;
        let scrollTimeout;

        picker.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                const pickerRect = picker.getBoundingClientRect();
                const pickerCenterTop = pickerRect.top + (pickerRect.height / 5 * 2);
                const pickerCenterBottom = pickerRect.top + (pickerRect.height / 5 * 3);
                let closest = null;

                options.forEach(opt => {
                    const optRect = opt.getBoundingClientRect();
                    const optCenter = optRect.top + (optRect.height / 2);
                    if (optCenter > pickerCenterTop && optCenter < pickerCenterBottom) {
                        closest = opt;
                    }
                });

                if (closest) {
                    const optRect = closest.getBoundingClientRect();
                    const optCenterY = optRect.top;
                    const diff = optCenterY - pickerCenterTop;
                    const targetTop = picker.scrollTop + diff;

                    picker.scrollTo({ top: targetTop, behavior: 'smooth' });
                    options.forEach(opt => opt.classList.remove('active'));
                    if (closest) closest.classList.add('active');
                }
            }, 100);
        });
    });

    function scrollToMinute(minutes, pickerWrapper){
        console.log('scrolling to minute');
        let HH = Math.floor(minutes / 60);
        let MM = minutes % 60;

        HH = Math.floor(HH) % 24;
        if(HH < 0) HH += 24;
        MM = Math.round(MM) % 60;
        if(MM < 0) MM += 60;

        let isAM = HH < 12;
        let displayHour = HH % 12;
        if(displayHour === 0) displayHour = 12;

        const options = eventDetailDialog.querySelectorAll('.option');
        const optionHeight = options[0].getBoundingClientRect().height;
        const scrollTopH = (displayHour - 1) * optionHeight;
        const scrollTopM = (MM / 15) * optionHeight;
        const scrollTopAM = isAM ? 0 : optionHeight;

        const pickerH = pickerWrapper.querySelector('#hours');
        const pickerM = pickerWrapper.querySelector('#minutes');
        const pickerAMPM = pickerWrapper.querySelector('#ampm');

        pickerH.scrollTop = scrollTopH;
        pickerM.scrollTop = scrollTopM;
        pickerAMPM.scrollTop = scrollTopAM;
    }

    function scrollToDate(date, pickerWrapper){
        console.log(date);
        const options = eventDetailDialog.querySelectorAll('.option');
        const optionHeight1 = options[0].getBoundingClientRect().height;
        const optionHeight2 = options[1].getBoundingClientRect().height;
        const scrollTopD = optionHeight1 + (date.getDate() - 2) * optionHeight2;
        const scrollTopM = optionHeight1 + (date.getMonth() - 1) * optionHeight2;
        const scrollTopY = (date.getFullYear() - (todayD.getFullYear() - 10)) / 2 * optionHeight1;

        const pickerD = pickerWrapper.querySelector('#date');
        const pickerM = pickerWrapper.querySelector('#month');
        const pickerY = pickerWrapper.querySelector('#year');

        pickerD.scrollTop = scrollTopD;
        pickerM.scrollTop = scrollTopM;
        pickerY.scrollTop = scrollTopY;
    }

    requestAnimationFrame(() => {
        pickers.forEach(picker => picker.scrollTop = 0);

        if (ev.StartDate && ev.EndDate) {
            const startMinutes = (ev.StartDate.getHours() * 60) + ev.StartDate.getMinutes();
            const endMinutes = (ev.EndDate.getHours() * 60) + ev.EndDate.getMinutes();
            const startPickerWrapper = eventDetailDialog.querySelector('.selectTime .startPickerWrapper');
            const endPickerWrapper = eventDetailDialog.querySelector('.endPickerWrapper');
            const datePickerWrapper = eventDetailDialog.querySelector('.datePickerWrapper .startPickerWrapper');

            scrollToMinute(startMinutes, startPickerWrapper);
            scrollToMinute(endMinutes, endPickerWrapper);
            scrollToDate(ev.StartDate, datePickerWrapper);
        }else{
            const datePickerWrapper = eventDetailDialog.querySelector('.datePickerWrapper .startPickerWrapper');
            scrollToDate(new Date(), datePickerWrapper);
        }
    });

    function getSelectedTime(wrapperClass) {
        const wrapper = eventDetailDialog.querySelector(`.selectTime .${wrapperClass}`);
        const hours = wrapper.querySelector('.picker:nth-child(1) .option.active');
        const minutes = wrapper.querySelector('.picker:nth-child(3) .option.active');
        const ampm = wrapper.querySelector('.picker:nth-child(5) .option.active');

        const hour = parseInt(hours?.textContent || '0');
        const minute = parseInt(minutes?.textContent || '0');
        const ampmValue = ampm?.textContent.trim();

        let hour24 = hour % 12;
        if (ampmValue === 'p.m.') hour24 += 12;

        return hour24 * 60 + minute;
    }

    function getSelectedDate() {
        const wrapper = eventDetailDialog.querySelector('.datePickerWrapper');

        const dayEl = wrapper.querySelector('#date .option.active');
        const monthEl = wrapper.querySelector('#month .option.active');
        const yearEl = wrapper.querySelector('#year .option.active');

        const day = parseInt(dayEl?.textContent || '1');
        const monthName = monthEl?.textContent.trim() || 'Jan';
        const year = parseInt(yearEl?.textContent || new Date().getFullYear());

        const monthMap = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };

        const month = monthMap[monthName];
        if (month === undefined) return null;

        const daysInMonth = [
            31,
            (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28,
            31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ];

        const maxDay = daysInMonth[month];

        if (day > maxDay) {
            console.warn(`Invalid date selected: ${day} ${monthName} ${year}`);
            return null;
        }

        return new Date(year, month, day);
    }

    if(ev.Style){
        const styles = [style1, style2, style3];
        const selected = parseInt(ev.Style);

        styles.forEach(s => s.classList.remove('clicked'));

        if(selected >= 1 && selected <= styles.length){
            styles[selected - 1].classList.add(`clicked`);
            selectedStyle = selected;
        }
    }

    style1.addEventListener('click', () => {
        style1.classList.add('clicked');
        style2.classList.remove('clicked');
        style3.classList.remove('clicked');
        selectedStyle = 1;
    });

    style2.addEventListener('click', () => {
        style2.classList.add('clicked');
        style1.classList.remove('clicked');
        style3.classList.remove('clicked');
        selectedStyle = 2;
    });

    style3.addEventListener('click', () => {
        style3.classList.add('clicked');
        style2.classList.remove('clicked');
        style1.classList.remove('clicked');
        selectedStyle = 3;
    })

    confirmBtn.addEventListener('click', () => {
        const startMinutes = getSelectedTime('startPickerWrapper');
        const endMinutes = getSelectedTime('endPickerWrapper');
        const lettersOnly = eventDetailTitle.value.replace(/[^a-zA-Z0-9]/g, '');
        const selectedDate = getSelectedDate();
        
        let message = '';

        if (!selectedDate) {
            message = 'Please select valid date.';
        } else if (startMinutes >= endMinutes) {
            message = 'End time must be later than start time.';
        } else if (endMinutes - startMinutes < 15) {
            message = 'Duration must be at least 15 minutes.';
        } else if (lettersOnly === 0) {
            message = 'Event title cannot be empty.';
        } else if (!selectedStyle) {
            message = 'Please select a style.';
        }

        if (message) {
            errorMessage.textContent = `*${message}*`;
            errorMessage.style.display = 'block';
            return;
        }

        errorMessage.style.display = 'none';

        const startDate = new Date(selectedDate);
        const endDate = new Date(selectedDate);

        startDate.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
        endDate.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);

        // console.log('✅ Full datetime:', startDate, endDate);

        const formatDateTime = (date) =>
            new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');

        const payload = {
            EventID: ev.EventID || '',
            EventTitle: eventDetailTitle.value.trim(),
            EventDescription: editor.innerText.trim(),
            Style: selectedStyle,
            StartDate: formatDateTime(startDate),
            EndDate: formatDateTime(endDate)
        };

        // console.log('📝 Payload:', payload);

        fetch('save_event.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok') {
                console.log('✅', data.message);
                eventDetailDialog.close();
                fetchAndRenderData();
            } else {
                console.error('❌', data.message);
                errorMessage.textContent = `*${data.message}*`;
                errorMessage.style.display = 'block';
            }
        })
        .catch(err => console.error('❌ Save failed:', err));
    });

    cancelBtn.addEventListener('click', () => {
        eventDetailDialog.close();
    });

    deleteBtn.addEventListener('click', () => {
        const cancelButton = confirmation.querySelector('.cancel');
        const confirmButton = confirmation.querySelector('.confirm');
        const title = confirmation.querySelector('h3');

        title.textContent = 'Do you confirm to delete this event?';

        cancelButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            confirmation.close();
        };

        confirmButton.onclick = async () => {
            const eventId = ev.EventID; // or get it dynamically
            if (!eventId) return;

            try {
                const response = await fetch('delete_event.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ EventID: eventId })
                });

                const result = await response.json();
                if (result.status === 'ok') {
                    confirmation.close();
                    eventDetailDialog.close();
                    fetchAndRenderData();

                    const successfulMessage = document.createElement('div');
                    successfulMessage.classList.add('successfulMessage');
                    successfulMessage.innerHTML = `Successfully deleted event "${ev.EventTitle}"`
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

    eventDetailDialog.showModal();
}

function triggerReminderDetail(rd = {}){
    const reminderDetailDialog = document.querySelector('.reminderDetail');
    const reminderDetailTitle = reminderDetailDialog.querySelector('.reminderDetailTitle input');
    const editor = reminderDetailDialog.querySelector('.editor');
    const descPlaceHolder = reminderDetailDialog.querySelector('.placeHolder');
    const remainingLabel = reminderDetailDialog.querySelector('.remainingCount');
    const confirmBtn = reminderDetailDialog.querySelector('.confirmEvent');
    const cancelBtn = reminderDetailDialog.querySelector('.cancelEvent');
    const errorMessage = reminderDetailDialog.querySelector('.errorMessage');
    const pickers = reminderDetailDialog.querySelectorAll('.picker');
    const maxLetters = 50;
    const yearPicker = reminderDetailDialog.querySelector('.datePickerWrapper #year');
    const deleteBtn = reminderDetailDialog.querySelector('.deleteEventBtn');
    const confirmation = document.querySelector('.confirmationDialog');

    errorMessage.style.display = 'none';
    reminderDetailTitle.value = '';
    editor.textContent = '';
    descPlaceHolder.style.display = 'block';
    remainingLabel.textContent = maxLetters;
    let todayD = new Date();
    let currentYear = todayD.getFullYear() - 10;
    yearPicker.innerHTML = '';
    
    for(currentYear; currentYear <= todayD.getFullYear() + 10 ; currentYear++){
        const option = document.createElement('div');
        option.classList.add('option');
        if(currentYear === todayD.getFullYear()) option.classList.add('active');
        option.textContent = currentYear;
        yearPicker.appendChild(option);

        currentYear += 1;
    }

    if (rd.Title) {
        reminderDetailTitle.value = rd.Title;
        const lettersOnly = rd.Title.replace(/[^a-zA-Z0-9]/g, '');
        remainingLabel.textContent = maxLetters - lettersOnly.length;
    }

    if (rd.Description) {
        editor.textContent = rd.Description;
        descPlaceHolder.style.display = 'none';
    }

    function checkEmpty() {
        const hasText = editor.innerText.trim().length > 0;
        descPlaceHolder.style.display = hasText ? 'none' : 'block';
    }
    editor.addEventListener('input', checkEmpty);

    reminderDetailTitle.addEventListener('input', () => {
        let currentValue = reminderDetailTitle.value;
        const lettersOnly = currentValue.replace(/[^a-zA-Z0-9]/g, '');
        const remainingLetters = maxLetters - lettersOnly.length;
        if (remainingLetters >= 0) {
            remainingLabel.textContent = remainingLetters;
        }
    });

    pickers.forEach(picker => {
        const options = Array.from(picker.querySelectorAll('.option'));
        if (!options.length) return;
        let scrollTimeout;

        picker.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const pickerRect = picker.getBoundingClientRect();
                const pickerCenterTop = pickerRect.top + (pickerRect.height / 5 * 2);
                const pickerCenterBottom = pickerRect.top + (pickerRect.height / 5 * 3);
                let closest = null;

                options.forEach(opt => {
                    const optRect = opt.getBoundingClientRect();
                    const optCenter = optRect.top + (optRect.height / 2);
                    if (optCenter > pickerCenterTop && optCenter < pickerCenterBottom) {
                        closest = opt;
                    }
                });

                if (closest) {
                    const optRect = closest.getBoundingClientRect();
                    const diff = (optRect.top + optRect.height / 2) - (pickerRect.top + pickerRect.height / 2);
                    picker.scrollTo({ top: picker.scrollTop + diff, behavior: 'smooth' });
                    options.forEach(opt => opt.classList.remove('active'));
                    closest.classList.add('active');
                }
            }, 100);
        });
    });

    function scrollToMinute(minutes, pickerWrapper){
        console.log('scrolling to minute');
        let HH = Math.floor(minutes / 60);
        let MM = minutes % 60;

        HH = Math.floor(HH) % 24;
        if(HH < 0) HH += 24;
        MM = Math.round(MM) % 60;
        if(MM < 0) MM += 60;

        let isAM = HH < 12;
        let displayHour = HH % 12;
        if(displayHour === 0) displayHour = 12;

        const options = reminderDetailDialog.querySelectorAll('.option');
        const optionHeight = options[0].getBoundingClientRect().height;
        const scrollTopH = (displayHour - 1) * optionHeight;
        const scrollTopM = (MM / 15) * optionHeight;
        const scrollTopAM = isAM ? 0 : optionHeight;

        const pickerH = pickerWrapper.querySelector('#hours');
        const pickerM = pickerWrapper.querySelector('#minutes');
        const pickerAMPM = pickerWrapper.querySelector('#ampm');

        pickerH.scrollTop = scrollTopH;
        pickerM.scrollTop = scrollTopM;
        pickerAMPM.scrollTop = scrollTopAM;
    }

    function scrollToDate(date, pickerWrapper){
        console.log(date);
        const options = reminderDetailDialog.querySelectorAll('.option');
        const optionHeight1 = options[0].getBoundingClientRect().height;
        const optionHeight2 = options[1].getBoundingClientRect().height;
        const scrollTopD = optionHeight1 + (date.getDate() - 2) * optionHeight2;
        const scrollTopM = optionHeight1 + (date.getMonth() - 1) * optionHeight2;
        const scrollTopY = (date.getFullYear() - (todayD.getFullYear() - 10)) / 2 * optionHeight1;

        const pickerD = pickerWrapper.querySelector('#date');
        const pickerM = pickerWrapper.querySelector('#month');
        const pickerY = pickerWrapper.querySelector('#year');

        pickerD.scrollTop = scrollTopD;
        pickerM.scrollTop = scrollTopM;
        pickerY.scrollTop = scrollTopY;
    }

    requestAnimationFrame(() => {
        pickers.forEach(picker => picker.scrollTop = 0);

        if (rd.RemindAt) {
            const startMinutes = (rd.RemindAt.getHours() * 60) + rd.RemindAt.getMinutes();
            const pickerWrapper = reminderDetailDialog.querySelector('.pickerWrapper');
            const datePickerWrapper = reminderDetailDialog.querySelector('.datePickerWrapper .startPickerWrapper');
            scrollToMinute(startMinutes, pickerWrapper);
            scrollToDate(rd.RemindAt, datePickerWrapper);
        }else{
            const datePickerWrapper = reminderDetailDialog.querySelector('.datePickerWrapper .startPickerWrapper');
            scrollToDate(new Date(), datePickerWrapper);
        }
    });

    function getSelectedTime() {
        const wrapper = reminderDetailDialog.querySelector('.pickerWrapper');

        const hourEl = wrapper.querySelector('#hours .option.active');
        const minuteEl = wrapper.querySelector('#minutes .option.active');
        const ampmEl = wrapper.querySelector('#ampm .option.active');

        const hour = parseInt(hourEl?.textContent || '0', 10);
        const minute = parseInt(minuteEl?.textContent || '0', 10);
        const ampm = ampmEl?.textContent.trim();

        let hour24 = hour % 12;
        if (ampm === 'p.m.') hour24 += 12;

        return hour24 * 60 + minute; // return total minutes
    }

    function getSelectedDate() {
        const wrapper = reminderDetailDialog.querySelector('.datePickerWrapper');

        const dayEl = wrapper.querySelector('#date .option.active');
        const monthEl = wrapper.querySelector('#month .option.active');
        const yearEl = wrapper.querySelector('#year .option.active');

        const day = parseInt(dayEl?.textContent || '1');
        const monthName = monthEl?.textContent.trim() || 'Jan';
        const year = parseInt(yearEl?.textContent || new Date().getFullYear());

        const monthMap = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };

        const month = monthMap[monthName];
        if (month === undefined) return null;

        const daysInMonth = [
            31,
            (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28,
            31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ];

        const maxDay = daysInMonth[month];

        if (day > maxDay) {
            console.warn(`Invalid date selected: ${day} ${monthName} ${year}`);
            return null;
        }

        return new Date(year, month, day);
    }

    confirmBtn.addEventListener('click', () => {
        const time = getSelectedTime();
        const lettersOnly = reminderDetailTitle.value.replace(/[^a-zA-Z0-9]/g, '');
        const selectedDate = getSelectedDate();

        let message = '';
        if (lettersOnly == 0){
            message = 'Title cannot be empty';
        } else if (!selectedDate) {
            message = 'Please select valid date.';
        }

        if (message) {
            errorMessage.textContent = `*${message}*`;
            errorMessage.style.display = 'block';
        }
        errorMessage.style.display = 'none';
        
        const remindAt = new Date(selectedDate);
        remindAt.setHours(Math.floor(time / 60));
        remindAt.setMinutes(time % 60);
        remindAt.setSeconds(0);

        const remindAtUTC = new Date(remindAt.getTime() - remindAt.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

        const payload = {
            ReminderID: rd.ReminderID || '',
            Title: reminderDetailTitle.value.trim(),
            Description: editor.textContent.trim(),
            RemindAt: remindAtUTC,
            Status: rd.Status || 'pending'
        };

        console.log('📝 Payload:', payload);

        fetch('save_reminder.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok') {
                console.log('✅', data.message);
                reminderDetailDialog.close();
                fetchAndRenderData();
            } else {
                console.error('❌', data.message);
                errorMessage.textContent = `*${data.message}*`;
                errorMessage.style.display = 'block';
            }
        })
        .catch(err => {
            console.error('❌ Save failed:', err);
            errorMessage.textContent = '*Failed to save reminder. Please try again.*';
            errorMessage.style.display = 'block';
        });

    });

    cancelBtn.addEventListener('click', () => {
        reminderDetailDialog.close();
    });

    deleteBtn.addEventListener('click', () => {
        const cancelButton = confirmation.querySelector('.cancel');
        const confirmButton = confirmation.querySelector('.confirm');

        const title = confirmation.querySelector('h3');

        title.textContent = 'Do you confirm to delete this reminder?';

        cancelButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            confirmation.close();
        };

        confirmButton.onclick = async () => {
            const reminderId = rd.ReminderID;
            if (!reminderId) return;

            try {
                const response = await fetch('delete_reminder.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ReminderID: reminderId })
                });

                const result = await response.json();
                if (result.status === 'ok') {
                    confirmation.close();
                    reminderDetailDialog.close();
                    fetchAndRenderData();

                    const successfulMessage = document.createElement('div');
                    successfulMessage.classList.add('successfulMessage');
                    successfulMessage.innerHTML = `Successfully deleted reminder "${rd.Title}"`
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

    reminderDetailDialog.showModal();
}

function enableSnapDrag(element, timeStepHeight, dayIndex, dayCellWidth, onChange){
    let ElDragging = false;
    let resizingTop = false;
    let resizingBottom = false;
    let lastSnapMouseY = 0;
    let lastSnappedTopPx = 0;
    let wrapper = null;

    const startTimeLabel = document.querySelector('.startTime');
    const endTimeLabel = document.querySelector('.endTime');

    const pxPerMinute = timeStepHeight / 15;
    const guideLines = document.querySelectorAll('.guideLine');
    const headerOffset = (guideLines && guideLines.length > 0) ? guideLines[0].getBoundingClientRect().height : 0;
    const headerLimit = guideLines[0].getBoundingClientRect().height;

    let startTimeMinute;
    let endTimeMinute;
    let startTimeHH;
    let startTimeMM;
    let endTimeHH;
    let endTimeMM;

    function setLabel(startTimeMinute, endTimeMinute){
        startTimeHH = Math.floor(startTimeMinute / 60);
        startTimeMM = startTimeMinute % 60;
       
        endTimeHH = Math.floor(endTimeMinute / 60);
        endTimeMM = endTimeMinute % 60;

        startTimeLabel.textContent = formatTime(startTimeHH, startTimeMM);
        endTimeLabel.textContent = formatTime(endTimeHH, endTimeMM);
    }

    function minutesFromTopPx(topPx){
        const minutes = Math.round((topPx - headerOffset) / pxPerMinute);
        return Math.max(0, minutes);
    }

    function clamp(v, a, b){
        return Math.max(a, Math.min(b, v));
    }

    function getResizeZone(e){
        const rect = element.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        if (offsetY < 8) return 'top';
        if (rect.height - offsetY < 8) return 'bottom';
        return null;
    }

    function pointerDown(e){
        if(e.pointerType === 'mouse' && e.button !== 0) return;
        if(!element.matches(':focus')) element.focus();

        wrapper = element.closest('.eventCardWrapper');
        if(!wrapper) return;

        lastSnappedTopPx = parseFloat(element.style.top) || 0;
        const cardHeight = parseFloat(element.style.height) || 0;

        startTimeMinute = minutesFromTopPx(lastSnappedTopPx);
        endTimeMinute = minutesFromTopPx(lastSnappedTopPx + cardHeight);

        setLabel(startTimeMinute, endTimeMinute);

        lastSnapMouseY = e.clientY;

        const zone = getResizeZone(e);
        if(zone === 'top'){
            resizingTop = true;
        }else if(zone === 'bottom'){
            resizingBottom = true;
        }else{
            ElDragging = true;
        }

        element.setPointerCapture(e.pointerId);
        document.body.style.userSelect = 'none';
    }

    function pointerMove(e){
        if(!ElDragging && !resizingTop && !resizingBottom) return;
        const diffPx = e.clientY - lastSnapMouseY;
        const stepChange = Math.round(diffPx / timeStepHeight);
        if(stepChange === 0) return;

        const stepPx = stepChange * timeStepHeight;
        let heightPx = parseFloat(element.style.height) || element.offsetHeight;

        if (ElDragging) {
            let newTop = lastSnappedTopPx + stepPx;
            const heightPx = parseFloat(element.style.height) || element.offsetHeight;

            const minTop = headerLimit;
            const lastGuideLine = guideLines[guideLines.length - 1];
            const lastGuideBottom = lastGuideLine.offsetTop + lastGuideLine.getBoundingClientRect().height;
            const maxTop = lastGuideBottom - heightPx;

            const clampedTop = clamp(newTop, minTop, maxTop);

            if (clampedTop !== lastSnappedTopPx) {
                element.style.top = clampedTop + 'px';

                lastSnapMouseY += stepPx;
                lastSnappedTopPx = clampedTop;

                const newStart = startTimeMinute + stepChange * 15;
                const newEnd = endTimeMinute + stepChange * 15;

                if(newStart >=0 && newEnd <= 1440){
                    startTimeMinute += stepChange * 15;
                    endTimeMinute += stepChange * 15;
                }
                
                // console.log(Math.floor(startTimeMinute / 60), startTimeMinute % 60);
                // console.log(Math.floor(endTimeMinute/ 60), endTimeMinute % 60);

                startTimeLabel.style.top = clampedTop + 'px';
                endTimeLabel.style.top = (clampedTop + heightPx) + 'px';
            }else{
                return;
            }

            setLabel(startTimeMinute, endTimeMinute);
        }

        if(resizingTop){

            const minDuration = 15;
            const currentDuration = endTimeMinute - startTimeMinute;

            let newTop = lastSnappedTopPx + stepPx;
            let newHeight = heightPx - stepPx;

            const clampedTop = clamp(newTop, headerLimit, wrapper.clientHeight - timeStepHeight);
            const topChanged = clampedTop !== lastSnappedTopPx;
            
            if(currentDuration <= minDuration && stepChange > 0) return;

            if(topChanged){
                newTop = clampedTop;
                newHeight = clamp(newHeight, timeStepHeight, wrapper.clientHeight - newTop);

                const newStart = startTimeMinute + stepChange * 15

                if(newStart >= 0){
                    startTimeMinute += stepChange * 15;

                    element.style.top = newTop + 'px';
                    element.style.height = newHeight + 'px';
                }

                const durationMinutes = endTimeMinute - startTimeMinute;
                if (durationMinutes === 15) sizeClass = 'size1';
                else if (durationMinutes === 30) sizeClass = 'size2';
                else if (durationMinutes === 45) sizeClass = 'size3';
                else sizeClass = 'size4';

                element.classList.remove('size1','size2','size3','size4');
                element.classList.add(sizeClass);

                const desc = element.querySelector('.eventDescription');
                const timestep = durationMinutes / 15;
                const tresholdClamp = -2;
                if (desc) {
                    if (timestep > 2) {
                        desc.style.display = '-webkit-box';
                        desc.style.webkitBoxOrient = 'vertical';
                        desc.style.webkitLineClamp = timestep + tresholdClamp;
                    } else {
                        desc.style.display = 'none';
                    }
                }

                lastSnapMouseY += stepPx;
                lastSnappedTopPx = newTop;

                startTimeLabel.style.top = clampedTop + 'px';
            }else{
                newTop = lastSnappedTopPx;
                newHeight = heightPx;
            }

            setLabel(startTimeMinute, endTimeMinute);
        }

        if (resizingBottom) {
            let newHeight = heightPx + stepPx;
            const minHeight = timeStepHeight;
            const currentTop = parseFloat(element.style.top) || 0;

            const lastGuideLine = guideLines[guideLines.length - 1];
            const lastGuideBottom = lastGuideLine.offsetTop + lastGuideLine.getBoundingClientRect().height;
            const maxHeight = Math.min(wrapper.clientHeight, lastGuideBottom) - currentTop;

            const clampedHeight = clamp(newHeight, minHeight, maxHeight);

            const heightChanged = Math.abs(clampedHeight - heightPx) > 0.5;
            const directionAllowed =
                (stepPx > 0 && clampedHeight > heightPx) ||
                (stepPx < 0 && clampedHeight < heightPx);

            if (heightChanged && directionAllowed) {
                element.style.height = clampedHeight + 'px';
                endTimeMinute += stepChange * 15;

                const durationMinutes = Math.round((clampedHeight / timeStepHeight) * 15);

                let sizeClass;
                if (durationMinutes === 15) sizeClass = 'size1';
                else if (durationMinutes === 30) sizeClass = 'size2';
                else if (durationMinutes === 45) sizeClass = 'size3';
                else sizeClass = 'size4';

                element.classList.remove('size1','size2','size3','size4');
                element.classList.add(sizeClass);

                const desc = element.querySelector('.eventDescription');
                const timestep = durationMinutes / 15;
                const tresholdClamp = -2;
                if (desc) {
                    if (timestep > 2) {
                        desc.style.display = '-webkit-box';
                        desc.style.webkitBoxOrient = 'vertical';
                        desc.style.webkitLineClamp = timestep + tresholdClamp;
                    } else {
                        desc.style.display = 'none';
                    }
                }

                lastSnapMouseY += stepPx;

                endTimeLabel.style.top = (currentTop + clampedHeight) + 'px';
            } else {
                newHeight = heightPx;
            }

            setLabel(startTimeMinute, endTimeMinute);
        }

    }

    function pointerUp(e){
        if(!ElDragging && !resizingTop && !resizingBottom) return;
        ElDragging = false;
        resizingTop = false;
        resizingBottom = false;
        document.body.style.userSelect = '';

        try{ element.releasePointerCapture(e.pointerId); }catch(_){}
        
        if(typeof onChange === 'function'){
            onChange(startTimeMinute, endTimeMinute);
            // console.log(Math.floor(startTimeMinute / 60), startTimeMinute % 60);
            // console.log(Math.floor(endTimeMinute/ 60), endTimeMinute % 60);
        }
    }

    function updateTimeLabels(){
        const top = parseFloat(element.style.top) || 0;
        const height = parseFloat(element.style.height) || element.offsetHeight || 0;
        const bottom = top + height;

        const elLeft = parseFloat(element.style.left) || element.offsetLeft || 0;
        const width = dayIndex * dayCellWidth + elLeft;

        startTimeLabel.style.top = top + 'px';
        endTimeLabel.style.top = bottom + 'px';
        startTimeLabel.classList.add('show');
        endTimeLabel.classList.add('show');
    }

    element.addEventListener('focus', updateTimeLabels);
    element.addEventListener('blur', () => {
        startTimeLabel.classList.remove('show');
        endTimeLabel.classList.remove('show');
    });

    element.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);

    return () => {
        element.removeEventListener('pointerdown', pointerDown);
        window.removeEventListener('pointermove', pointerMove);
        window.removeEventListener('pointerup', pointerUp);
    };
}

function generateCalender(events, year, month, today) {
    dayIndex = 0;
    const calenderDays = document.querySelector('.calenderDays');
    const monthEl = monthTime.querySelector('.month');
    calenderDays.innerHTML = '';

    const startDate = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const showingTime = monthEl.querySelector('h5');
    showingTime.textContent = startDate.toLocaleString('default', { month: 'long' }) + ' ' + startDate.getFullYear();

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

    for(let day = 1; day <= daysInMonth; day++){
        const d = new Date(year, month, day);
        const weekday = weekdays[d.getDay()];

        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');

        if(dayIndex % 2 === 0) dayDiv.classList.add('alt');

        const dateHeader = document.createElement('div');
        dateHeader.classList.add('dateHeader');
        
        if (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
        ) {
            dateHeader.classList.add('today');
            console.log(d);
        }

        const h5 = document.createElement('h5');
        h5.innerHTML = `${day}<sup>${daySuffix(day)}</sup> ${weekday}`;
        dateHeader.appendChild(h5);

        const scrollWrapper = document.createElement('div');
        scrollWrapper.classList.add('scrollWrapper');

        const eventCardWrapper = document.createElement('div');
        eventCardWrapper.classList.add('eventCardWrapper');

        const guideLinesScrollHeight = guideLines.scrollHeight;
        const timeWrapperOffSetHeight = timeWrapper.offsetHeight;

        eventCardWrapper.style.height = guideLinesScrollHeight + 'px';
        scrollWrapper.style.height = timeWrapperOffSetHeight + 'px';


        const dayEvents = events.filter(ev => 
            ev.StartDate.toDateString() === d.toDateString()
        );

        const guideLinesElements = document.querySelectorAll('.guideLine');
        const timeStepHeight = guideLinesElements[1].getBoundingClientRect().height / 4;
        
        dayEvents.forEach(ev => {
            const startMinutes = (ev.StartDate.getHours() * 60) + ev.StartDate.getMinutes();
            const endMinutes = ev.EndDate.getHours() * 60 + ev.EndDate.getMinutes();
            const durationMinutes = Math.max(15, endMinutes - startMinutes);

            const topPx = (startMinutes / 15) * timeStepHeight + guideLinesElements[0].getBoundingClientRect().height;
            const heightPx = (durationMinutes / 15) * timeStepHeight;

            const card = document.createElement('div');
            card.classList.add('eventCard');
            card.setAttribute('tabindex', '0'); 

            card.dataset.eventId = ev.EventID;
            card.dataset.date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            if(ev.Style){
                card.classList.add(`eventCardStyle${ev.Style}`);
            }

            let sizeClass;
            if(durationMinutes === 15) sizeClass= 'size1';
            else if(durationMinutes === 30) sizeClass = 'size2';
            else if(durationMinutes === 45) sizeClass = 'size3'
            else sizeClass = 'size4';

            card.classList.add(sizeClass);

            card.style.top = `${topPx}px`;
            card.style.height = `${heightPx}px`;

            const title = document.createElement('h4');
            title.classList.add('eventTitle');
            title.textContent = ev.EventTitle;
            card.appendChild(title);

            const desc = document.createElement('p');
            desc.classList.add('eventDescription');
            if(ev.EventDescription) desc.textContent = ev.EventDescription;

            const timestep = durationMinutes / 15;
            const tresholdClamp = -2;

            if(timestep > 2){
                desc.style.display = '-webkit-box';
                desc.style.webkitBoxOrient = 'vertical';
                desc.style.webkitLineClamp = timestep + tresholdClamp;
            }else{
                desc.style.display = 'none';
            }

            card.appendChild(desc);
            eventCardWrapper.appendChild(card);

            card.addEventListener('dblclick', () =>{
                triggerEventDetail(ev);
            });
        });

        scrollWrapper.appendChild(eventCardWrapper);
        dayDiv.appendChild(dateHeader);
        dayDiv.appendChild(scrollWrapper);
        dayDiv.dataset.dayIndex = dayIndex;
        calenderDays.appendChild(dayDiv);

        const dayCellWidth = dayDiv.offsetWidth;

        const cards = eventCardWrapper.querySelectorAll('.eventCard');
        cards.forEach(card => {
            card.dataset.dayIndex = dayIndex;
            enableSnapDrag(card, timeStepHeight, dayIndex, dayCellWidth, (startMinutes, endMinutes) => {
                const evID = card.dataset.eventId;
                const dateStr = card.dataset.date; 
                
                if (!evID || !dateStr) return;

                const startDate = new Date(dateStr);
                console.log(dateStr);
                startDate.setHours(Math.floor(startMinutes / 60));
                startDate.setMinutes(startMinutes % 60);

                const endDate = new Date(dateStr);
                endDate.setHours(Math.floor(endMinutes / 60));
                endDate.setMinutes(endMinutes % 60);

                const formatDateTime = dt =>
                    new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 19)
                        .replace('T', ' ');

                const payload = {
                    EventID: evID,
                    StartDate: formatDateTime(startDate),
                    EndDate: formatDateTime(endDate)
                };
                console.log("⏰ Updating Event Time:", payload);

                fetch('save_event.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'ok') {
                        console.log('✅ Event time updated successfully');
                    } else {
                        console.error('❌ Failed to update:', data.message);
                    }
                })
                .catch(err => console.error('❌ Update failed:', err));
            });

        })

        dayIndex += 1;
    }
    console.log("✅ Calendar generated for last, current, and next month");

    attachScrollSync();
}

function generateTodayEvents(events, todayD){
    const container = document.querySelector('.todayEvent .panelContent');
    container.innerHTML = '';

    const dayEvents = events.filter(ev => 
        ev.StartDate.toDateString() === todayD.toDateString()
    );

    if(dayEvents.length === 0){
        const message = document.createElement('div');
        message.classList.add('eventEmptyMessage');
        message.textContent = 'No events today. Free and easy!';
        container.appendChild(message);
        return;
    }

    dayEvents.forEach(ev => {
        const todayEvent = document.createElement('div');
        todayEvent.classList.add('message');
        if(ev.Style){
            todayEvent.classList.add(`eventCardStyle${ev.Style}`);
        }

        let startHH = ev.StartDate.getHours();
        let startMM = ev.StartDate.getMinutes();
        let endHH = ev.EndDate.getHours();
        let endMM = ev.EndDate.getMinutes();

        const startTime = formatTime(startHH, startMM);
        const endTime = formatTime(endHH, endMM);

        const time = document.createElement('h4');
        time.classList.add('time');
        time.textContent = `${startTime} - ${endTime}`;

        const title = document.createElement('h4');
        title.classList.add('messageTitle');
        title.textContent = `${ev.EventTitle}`;

        todayEvent.appendChild(time);
        todayEvent.appendChild(title);
        container.appendChild(todayEvent);
        
        todayEvent.addEventListener('click', () => {
            triggerEventDetail(ev);
        })
    })
}

function generateTodayReminders(reminders){
    const container = document.querySelector('.reminders .panelContent');
    container.innerHTML = ''; 

    if(reminders.length === 0){
        const message = document.createElement('div');
        message.classList.add('eventEmptyMessage');
        message.textContent = 'No events today. Free and easy!';
        container.appendChild(message);
        return;
    }

    reminders.forEach(rd => {
        const todayReminder = document.createElement('div');
        todayReminder.classList.add('message');

        let timeHH = rd.RemindAt.getHours();
        let timeMM = rd.RemindAt.getMinutes();

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

        const time = formatTime(timeHH, timeMM);
        const day = rd.RemindAt.getDate();
        const weekday = weekdays[rd.RemindAt.getDay()];
        const month = months[rd.RemindAt.getMonth()];
        const year = rd.RemindAt.getFullYear();
        const date = `${year} ${month} ${day}<sup>${daySuffix(day)}</sup> ${time}`;

        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper3');

        const timeEl = document.createElement('h4');
        timeEl.classList.add('time');
        timeEl.innerHTML = `${date}`;
        
        const messageTitle = document.createElement('h4');
        messageTitle.classList.add('messageTitle');
        messageTitle.textContent = rd.Title;

        wrapper.appendChild(timeEl);
        wrapper.appendChild(messageTitle);

        const tickAsDone = document.createElement('div');
        tickAsDone.classList.add('tickAsDone')
        tickAsDone.innerHTML = `
            <svg class="tick" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.8243 11.7348C2.8243 11.6135 2.80097 11.5528 2.7543 11.5528L2.4323 11.7068C2.4323 11.6415 2.39497 11.5948 2.3203 11.5668L2.2083 11.5528C2.13364 11.5528 2.0403 11.5855 1.9283 11.6508C1.90964 11.6042 1.8863 11.5575 1.8583 11.5108C1.8303 11.4642 1.80697 11.4222 1.7883 11.3848C1.66697 11.1515 1.54564 10.8948 1.4243 10.6148C1.3123 10.3255 1.20497 10.0502 1.1023 9.78883C1.00897 9.5275 0.934305 9.32217 0.878305 9.17283C0.840971 9.0515 0.798971 8.8695 0.752305 8.62683C0.705638 8.38417 0.658971 8.07617 0.612305 7.70283C0.714971 7.76817 0.794305 7.80083 0.850305 7.80083C0.915638 7.80083 0.976305 7.70283 1.0323 7.50683C1.0603 7.54417 1.11164 7.56283 1.1863 7.56283C1.2423 7.56283 1.2843 7.54417 1.3123 7.50683L1.5363 7.17083L1.7883 7.25483H1.8023C1.82097 7.25483 1.83964 7.2455 1.8583 7.22683C1.87697 7.20817 1.90497 7.1895 1.9423 7.17083C2.01697 7.12417 2.07297 7.10083 2.1103 7.10083L2.1523 7.11483C2.38564 7.22683 2.53497 7.43217 2.6003 7.73083C2.7683 8.44017 2.9363 8.79483 3.1043 8.79483C3.2723 8.79483 3.4683 8.6175 3.69231 8.26283C3.80431 8.0855 3.9163 7.88017 4.0283 7.64683C4.14964 7.4135 4.27097 7.15217 4.3923 6.86283C4.41097 6.97483 4.42964 7.03083 4.4483 7.03083C4.49497 7.03083 4.5743 6.91417 4.6863 6.68083C4.80764 6.4475 4.99897 6.1255 5.2603 5.71483C5.40964 5.46283 5.5963 5.17817 5.8203 4.86083C6.05364 4.5435 6.30097 4.21683 6.5623 3.88083C6.82364 3.54483 7.07564 3.2275 7.31831 2.92883C7.57031 2.63017 7.79431 2.3735 7.9903 2.15883C8.18631 1.94417 8.33097 1.80417 8.4243 1.73883C8.77897 1.49617 9.05897 1.26283 9.26431 1.03883C9.25497 1.10417 9.24097 1.16483 9.2223 1.22083C9.21297 1.2675 9.20831 1.30017 9.20831 1.31883C9.20831 1.35617 9.22697 1.37483 9.26431 1.37483L9.65631 1.17883V1.23483C9.65631 1.3095 9.67497 1.34683 9.71231 1.34683C9.74031 1.34683 9.79631 1.30483 9.88031 1.22083C9.96431 1.13683 10.011 1.07617 10.0203 1.03883L9.9923 1.23483L10.4683 0.954834L10.3563 1.20683C10.5056 1.10417 10.613 1.05283 10.6783 1.05283C10.7156 1.05283 10.7436 1.07617 10.7623 1.12283C10.781 1.16017 10.7903 1.1975 10.7903 1.23483C10.7903 1.29083 10.767 1.35617 10.7203 1.43083C10.6736 1.5055 10.613 1.59417 10.5383 1.69683C10.4823 1.7715 10.389 1.8835 10.2583 2.03283C10.137 2.17283 9.95031 2.38283 9.69831 2.66283C9.44631 2.9335 9.1103 3.3115 8.6903 3.79683C8.57831 3.91817 8.40564 4.13283 8.17231 4.44083C7.93897 4.7395 7.67297 5.0895 7.37431 5.49083C7.08497 5.88283 6.79564 6.2795 6.50631 6.68083C6.21697 7.08217 5.96031 7.44617 5.73631 7.77283C5.51231 8.09017 5.35364 8.32817 5.2603 8.48683L4.3923 9.95683C4.20564 10.2742 4.05164 10.5355 3.93031 10.7408C3.80897 10.9368 3.71564 11.0722 3.6503 11.1468C3.5103 11.3148 3.3563 11.4642 3.1883 11.5948L3.0623 11.5248L2.9503 11.5948L2.8243 11.7348Z"/>
            </svg>
        `;

        if(rd.Status === 'Completed'){
            const icon = tickAsDone.firstElementChild;
            icon.classList.add('ticked')
            tickAsDone.classList.add('ticked');
        }

        tickAsDone.addEventListener('click', () => {
            const icon = tickAsDone.firstElementChild;
            icon.classList.toggle('ticked')
            tickAsDone.classList.toggle('ticked');
            rd.Status = rd.Status === 'Pending'? 'Completed' : 'Pending';

            fetch('save_reminder.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ReminderID: rd.ReminderID,
                    Status: rd.Status
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok') {
                    console.log(`✅ Reminder ${rd.ReminderID} status updated to ${rd.Status}`);
                } else {
                    console.error('❌ Failed to update status:', data.message);
                }
            })
            .catch(err => console.error('❌ Update failed:', err));
        });

        todayReminder.appendChild(wrapper);
        todayReminder.appendChild(tickAsDone);

        container.appendChild(todayReminder);

        todayReminder.addEventListener('click', (e) => {
            if(tickAsDone.contains(e.target)) return;
           triggerReminderDetail(rd);
        })
    });
}

let events = [];
let reminders = [];

async function fetchAndRenderData() {
    try {
        const res = await fetch('get_user_data.php', { credentials: 'same-origin' });
        const data = await res.json();
        if(!res.ok){
            console.error('❌ Server returned error status', res.status);
            return;
        }

        if (data.status === 'ok'){
            events = data.events.map(ev => ({
                ...ev,
                StartDate: new Date(ev.StartDate),
                EndDate: new Date(ev.EndDate)
            }));

            reminders = data.reminders.map(rd => ({
                ...rd,
                RemindAt: new Date(rd.RemindAt),
                Title: rd.Title,
                Description: rd.Description,
                Status: rd.Status
            }));
            
            const filteredReminders = reminders.filter(rd => rd.Status !== 'Completed');

            const today = new Date();

            generateCalender(events, currentYear, currentMonth, today);
            generateTodayEvents(events, today);
            generateTodayReminders(filteredReminders);
            scrollToToday();
            scrollToNow();

        }else{
            console.error('❌ Server message:', data.message);
        }
    } catch (err) {
        console.error('❌ Failed to fetch events/reminders:', err);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndRenderData);


document.addEventListener('click', (e) => {
    if(e.target !== selectMonthButton &&
        !selectMonth.contains(e.target)
    ) selectMonth.classList.remove('show');
});

const today = new Date();
let dayIndex = 0;
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

function viewPrevMonth(){
    if(currentMonth === 0){
        console.log(currentYear, currentMonth);
        currentMonth = 11;
        currentYear -= 1;
        generateCalender(events, currentYear, currentMonth, today);
        console.log(currentYear, currentMonth);
    }
    else{
        console.log(currentYear, currentMonth);
        currentMonth -= 1;
        generateCalender(events, currentYear, currentMonth, today);
        console.log(currentYear, currentMonth);
    }
}

function viewNextMonth(){
    if(currentMonth === 11){
        console.log(currentYear, currentMonth);
        currentMonth = 0;
        currentYear += 1;
        generateCalender(events, currentYear, currentMonth, today);
        console.log(currentYear, currentMonth);
    }
    else{
        console.log(currentYear, currentMonth);
        currentMonth += 1;
        generateCalender(events, currentYear, currentMonth, today);
        console.log(currentYear, currentMonth);
    }
}

function viewTodayEvent(){
    const today = new Date();
    generateCalender(events, today.getFullYear(), today.getMonth(), today);
    scrollToToday();
    scrollToNow()
}

const selectMonth = document.querySelector('.selectMonth');
const yearTitle = selectMonth.querySelector('.year');
const months = document.querySelectorAll('.monthEl');
const selectMonthButton = document.querySelector('.month h5');
let viewingMonth;
let viewingYear;

yearTitle.innerHTML = '';
yearTitle.textContent = currentYear;

function prevYear(){
    currentYear -= 1;
    yearTitle.textContent = currentYear;
    if(currentYear === viewingYear){
        for(let m = 0; m < months.length; m++){
            if(m === viewingMonth){
                months[m].classList.add('selected');
            }
        }
    }else{
        months.forEach(month => month.classList.remove('selected'));
    }
}

function nextYear(){
    currentYear += 1;
    yearTitle.textContent = currentYear;
    if(currentYear === viewingYear){
        for(let m = 0; m < months.length; m++){
            if(m === viewingMonth){
                months[m].classList.add('selected');
            }
        }
    }else{
        months.forEach(month => month.classList.remove('selected'));
    }
}

months.forEach((m, index) => {
    m.addEventListener('click', () => {
        months.forEach(other => {
            other.classList.remove('selected');
        })
        
        m.classList.add('selected');
        const yearTitle = selectMonth.querySelector('.year');
        generateCalender(events, yearTitle.textContent, index, today);
        selectMonth.classList.remove('show');
    })
});

selectMonthButton.addEventListener('click', (e) => {
    e.stopPropagation();
    selectMonth.classList.add('show');
    const [viewingMonthName, viewingYearStr] = selectMonthButton.textContent.trim().split(/\s+/);
    viewingYear = parseInt(viewingYearStr);

    const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    viewingMonth = monthNames.findIndex(
        m => m.toLowerCase() === viewingMonthName.toLowerCase()
    );
    
    for(let m = 0; m < months.length; m++){
        if(m === viewingMonth){
            months[m].classList.add('selected');
        }
    }
});
