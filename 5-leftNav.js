const leftNavPanel = document.querySelector('.leftNavPanel')
const resizer = document.querySelector('.resizer');
const leftPanelWidth = getComputedStyle(root).getPropertyValue('--leftPanelWidth').trim();

console.log(leftPanelWidth);

let isDragging = false;

let isShow = localStorage.getItem('leftNavBarShow') === 'true';
root.style.setProperty('--leftPanelWidth', isShow ? '18vw' : '5.2vw');

resizer.addEventListener('mousedown', () => {
  isDragging = true;
});

document.addEventListener('mouseup', () =>{
    if (isDragging) {
        root.style.setProperty('--leftPanelWidth', isShow? '5.2vw' : '18vw');
        localStorage.setItem('leftNavBarShow', !isShow);
        isShow = !isShow;
    }

    isDragging = false;
})

function generateProjectAvatar(members){
    const projectAvatar = document.querySelector('.projectAvatar');

    for(let i = 0; i < Math.min(members.length , 3); i++){
        const memberAvatar = document.createElement('div');
        if((members[1] || members[2])) {
            memberAvatar.classList.add(`memberAvatar${i+1}`);
            memberAvatar.style.setProperty(`--member${i+1}-avatar-color`, `var(${members[i].AvatarColor})`);
        } else {
            memberAvatar.classList.add(`memberAvatar0`);
            memberAvatar.style.setProperty(`--member${0}-avatar-color`, `var(${members[i].AvatarColor})`);
        };

        memberAvatar.textContent = members[i].FullName.charAt(0).toUpperCase();
        
        projectAvatar.appendChild(memberAvatar);
    };
}
