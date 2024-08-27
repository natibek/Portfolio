// Handles the dynamic aspect of the page

// make this change over the day
const BOUNDARYY = 50;
const BOUNDARYX = 70; // the radius for the eye movement boundary
const ORIGINALCY = 65;
const ORIGINALCX = 105;

let midAnimation = false;

const eyeBalls = document.getElementsByClassName('eye-ball');
const eyeLids = document.getElementsByClassName('eye-lid');
const corneas = document.getElementsByClassName('cornea');
let eyeCoords = {
  leftx: eyeBalls[0].getBoundingClientRect().x,
  lefty: eyeBalls[0].getBoundingClientRect().y,
  rightx: eyeBalls[1].getBoundingClientRect().x,
  righty: eyeBalls[1].getBoundingClientRect().y,
};

const eyeBrows = document.getElementsByClassName('brow');
const leftBrow = document.getElementById('left-brow');
const rightBrow = document.getElementById('right-brow');

// registering event listeners
document.addEventListener('mousemove', handleMouseMove);
window.addEventListener('touchstart', handleMouseMove);
window.addEventListener('touchend', handleMouseMove);
window.addEventListener('touchmove', handleMouseMove);
// window.addEventListener('scroll', handleMouseMove);

document.addEventListener('click', handleClick);
document.addEventListener('DOMContentLoaded', handleWink);
window.addEventListener('resize', resetCoords);

for (let dropDown of document.getElementsByClassName('drop-down')) {
  dropDown.addEventListener('click', handleDropDown);
}
document.getElementById('legend-drop-down').addEventListener('mouseover', handleSideBarHover);
document.getElementById('legend-drop-down').addEventListener('mouseout', handleSideBarOut);
document.getElementById('legend-drop-down').addEventListener('click', handleSideBarClick);
let cur_expanded = null;

function handleSideBarOut() {
  const sideBarIcon = document.getElementById('legend-caret');
  if (sideBarIcon.className.includes('right')) {
    document.getElementById('legend-drop-down').style.setProperty('margin-left', '-38px');
  }
}

function handleSideBarHover() {
  const sideBarIcon = document.getElementById('legend-caret');
  if (sideBarIcon.className.includes('right')) {
    document.getElementById('legend-drop-down').style.setProperty('margin-left', '0px');
  }
}

function handleSideBarClick() {
  // Updates the caret for the side bar

  const sideBarIcon = document.getElementById('legend-caret');
  const className = sideBarIcon.className;
  if (className.includes('right')) {
    sideBarIcon.setAttribute('class', className.replace('right', 'left'));
    document
      .getElementById('legend-drop-down')
      .style.setProperty('margin-left', '0x', 'important');
  } else {
    sideBarIcon.setAttribute('class', className.replace('left', 'right'));
    document
      .getElementById('legend-drop-down')
      .style.setProperty('margin-left', '-38px', 'important');
  }
}
//start drop-down-handling
function handleDropDown(event) {
  // Updates the drop down icon to point in the correct direction

  let target = event.target;
  if (!target.classList.contains('drop-down')) {
    target = target.parentNode;
  }
  const dropDownIcon = target.querySelector('i:last-of-type');
  const className = dropDownIcon.className;

  const newClassName = className.includes('down')
    ? className.replace('down', 'up')
    : className.replace('up', 'down');
  dropDownIcon.setAttribute('class', newClassName);

  if (cur_expanded && target.id !== cur_expanded.id) {
    const dropDownIcon = cur_expanded.querySelector('i:last-of-type');
    dropDownIcon.setAttribute('class', dropDownIcon.className.replace('up', 'down'));
  }

  cur_expanded = target;
}

// start wink handling
async function handleWink() {
  // Adds winking movement to the eyes. Randomly chooses and eye and also waits a random amount
  // of time before the next wink
  setTimeout(
    () => {
      if (midAnimation) {
        // make sure another animation is not in prograss
        handleWink();
        return;
      }
      midAnimation = true;
      if (Math.random < 0.5) {
        leftBrow.classList.add('raise');
        leftBrow.addEventListener('animationend', () => leftBrow.classList.remove('raise'));
        rightBrow.classList.add('lower');
        rightBrow.addEventListener('animationend', () => rightBrow.classList.remove('lower'));

        eyeLids[0].classList.add('dialate');
        eyeLids[0].addEventListener('animationend', () => eyeLids[0].classList.remove('dialate'));
        eyeLids[1].classList.add('squint');
        eyeLids[1].addEventListener('animationend', () => eyeLids[1].classList.remove('squint'));
      } else {
        leftBrow.classList.add('lower');
        leftBrow.addEventListener('animationend', () => leftBrow.classList.remove('lower'));
        rightBrow.classList.add('raise');
        rightBrow.addEventListener('animationend', () => rightBrow.classList.remove('raise'));

        eyeLids[1].classList.add('dialate');
        eyeLids[1].addEventListener('animationend', () => eyeLids[1].classList.remove('dialate'));
        eyeLids[0].classList.add('squint');
        eyeLids[0].addEventListener('animationend', () => eyeLids[0].classList.remove('squint'));
      }
      setTimeout(() => (midAnimation = false), 1000);
      handleWink();
    },
    Math.round(Math.random() * 50000) // wait a random amount of time in the 50000 seconds
  );
}
// end wink handling

// start click handling
function handleClick(event) {
  // Adds the ripple effect and if there are not other animations happening the eye brow
  // movement

  const x = event.clientX + window.scrollX;
  const y = event.clientY + window.scrollY;
  createRipple(x, y);
  if (!midAnimation) {
    midAnimation = true;
    setTimeout(moveBrows, 80);
  }
}

function createRipple(x, y) {
  // Creates the ripple effect where a mouse press happens
  const ripple = document.createElement('div');
  ripple.classList.add('circle');
  ripple.style.left = `${x - 5}px`; // Adjusting position based on circle size
  ripple.style.top = `${y - 5}px`; // Adjusting position based on circle size
  document.body.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

function moveBrows() {
  // Adds brow movements by adding and removing the appropriate css animations
  [0, 1].forEach((idx) => {
    eyeBrows[idx].classList.add('raise-brow');
    eyeBrows[idx].addEventListener('animationend', () =>
      eyeBrows[idx].classList.remove('raise-brow')
    );
    eyeLids[idx].classList.add('shock');
    eyeLids[idx].addEventListener('animationend', () => {
      eyeLids[idx].classList.remove('shock');
      midAnimation = false;
    });
  });
}
// end click handling

// start updates when resizing the window
function resetCoords() {
  // Updates the positions of the eyeballs when the window is resized.
  eyeCoords = {
    leftx: eyeBalls[0].getBoundingClientRect().x,
    lefty: eyeBalls[0].getBoundingClientRect().y,
    rightx: eyeBalls[1].getBoundingClientRect().x,
    righty: eyeBalls[1].getBoundingClientRect().y,
  };
}
// end handling window resize

// start eye movement control
function chooseEye(cursor_x) {
  // Chooses the closest eyeball to the cursor. This eye will be used to calculate how much each
  // eye should move rather than handling each as separate.
  left_dist = Math.abs(cursor_x - eyeCoords.leftx);
  right_dist = Math.abs(cursor_x - eyeCoords.rightx);
  if (left_dist <= right_dist) return eyeCoords.leftx;
  else return eyeCoords.rightx;
}

function lerpX(x, povX) {
  // Linear interpolation in the x direction bounded by the BOUNDARYX (how far in the x direction
  // the eye ball can move)
  const direction = (x - povX) / Math.abs(x - povX);
  const magnitude = x > povX ? x - povX : povX - x;
  return direction * Math.min((magnitude * BOUNDARYX) / povX, 35);
}

function lerpY(y) {
  // Linear interpolation in the y direction bounded by the BOUNDARYY (how far in the y direction
  // the eye ball can move)
  // boundary of a 50 rad circle
  const direction = (y - eyeCoords.lefty) / Math.abs(y - eyeCoords.lefty);
  const magnitude = y > eyeCoords.lefty ? y - eyeCoords.lefty : eyeCoords.lefty - y;
  return direction * Math.min((magnitude * BOUNDARYY) / eyeCoords.lefty, 50);
}

function handleMouseMove(event) {
  // Handles the mouse movement events. If the cursor is inbetween the eyes, the only movement is
  // in the y direction. Otherwise, the closest eye is chosen and the eye balls are moved to follow
  // the cursor from the POV of the chosen eye.
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;

  let x = event.clientX + scrollX;
  let y = event.clientY + scrollY;
  let dy = lerpY(y);
  if (dy) {
    // sometimes the change is too fast and dy is NaN
    [0, 1].forEach((idx) => {
      corneas[idx].setAttribute('cy', ORIGINALCY + dy);
      eyeBalls[idx].setAttribute('cy', ORIGINALCY + dy);
    });
  }

  if (x >= eyeCoords.rightx || x <= eyeCoords.leftx) {
    // not between the eyes just move up and down
    povX = chooseEye(x);
    let dx = lerpX(x, povX);
    if (dx) {
      [0, 1].forEach((idx) => {
        corneas[idx].setAttribute('cx', ORIGINALCX + dx);
        eyeBalls[idx].setAttribute('cx', ORIGINALCX + dx);
      });
    }
  } else {
    [0, 1].forEach((idx) => {
      corneas[idx].setAttribute('cx', ORIGINALCX);
      eyeBalls[idx].setAttribute('cx', ORIGINALCX);
    });
  }
}
// end eye movement control
