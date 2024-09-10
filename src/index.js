// Handles the dynamic aspect of the page

// variables for filtering
  // map checkbox id to title
const mapIdTitle = {
  ml: 'MACHINE-LEARNING',
  "c++": "Cpp"
};

const checkBoxes = document.getElementsByClassName('check-input');
for (const checkBox of checkBoxes) {
  checkBox.addEventListener("click", handleCheckBox);
  checkBox.checked = false; // force uncheck when page is reloaded
}

let checkedFilters = [];
const filterableContent = document.getElementsByClassName("filterable");
const matchDisplay = document.getElementById("matchCount");
const filterDiv = document.getElementById("filters");
const clearFiltersBtn = document.getElementById("clear-filters");
clearFiltersBtn.addEventListener("click", handleClearFilters);

// variables for the face
// make this change over the day?
const BoundaryY = 50;
const BoundaryX = 75; // the radius for the eye movement boundary
let Rate = 30;


let OriginalCY = 65;
let OriginalCX = 105;

let midAnimation = false;

const eyeBlurColor = document.getElementById("blurColor")
const eyeBlur = document.getElementById("blur")
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
document.addEventListener('DOMContentLoaded', handleSleepy);
window.addEventListener('resize', resetCoords);

for (const dropDown of document.getElementsByClassName('drop-down')) {
  dropDown.addEventListener('click', handleDropDown);
}

const sideBarIcon = document.getElementById('legend-caret');
const legendDropDown = document.getElementById('legend-drop-down');
document.getElementById('legend-drop-down').addEventListener('mouseover', handleSideBarHover);
document.getElementById('legend-drop-down').addEventListener('mouseout', handleSideBarOut);
document.getElementById('legend-drop-down').addEventListener('click', handleSideBarClick);



let cur_expanded = null;

function handleSideBarOut() {
  // handle mouseout event by hiding
  if (sideBarIcon.className.includes('right')) {
    legendDropDown.style.setProperty('margin-left', '-38px');
  }
}

function handleSideBarHover() {
  // handle hover/mouseover event by revealing button
  if (sideBarIcon.className.includes('right')) {
    legendDropDown.style.setProperty('margin-left', '0px');
  }
}

function handleSideBarClick() {
  // Updates the caret for the side bar

  const className = sideBarIcon.className;
  if (className.includes('right')) {
    sideBarIcon.setAttribute('class', className.replace('right', 'left'));
    legendDropDown.style.setProperty('margin-left', '0px', 'important');
  } else {
    sideBarIcon.setAttribute('class', className.replace('left', 'right'));
    legendDropDown.style.setProperty('margin-left', '-38px', 'important');
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

// start handle eye with time
let eyeColorMap = {}

for (let i = 1; i <= 24; i++) {
  eyeColorMap[i] = `rgb(${0 + i * 10}, 255, 255)`;
}

// reddest night -> 7pm - 7am

function handleSleepy() {
  // according to the hour, update the eye speed, color, and shading.

  const now = new Date();
  let curHour = now.getHours();
  //console.log(curHour);

  for (const key in eyeColorMap) {
    if (curHour < key) {
      //eyeBlurColor.setAttribute('flood-color', eyeColorMap[key]);
   //   console.log(key)
      eyeBlur.setAttribute('stdDeviation', `${key}`);
      
      break;
    }
  }
  setTimeout(handleSleepy, (60 - now.getMinutes())*60*1000)

}
// end handle eye with time

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

  if (!midAnimation && window.innerWidth > 1000) {
    midAnimation = true;
    setTimeout(moveBrows, 70);
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
  return direction * Math.min((magnitude * Rate) / povX, BoundaryX);
}

function lerpY(y) {
  // Linear interpolation in the y direction bounded by the BOUNDARYY (how far in the y direction
  // the eye ball can move)
  // boundary of a 50 rad circle
  const direction = (y - eyeCoords.lefty) / Math.abs(y - eyeCoords.lefty);
  const magnitude = y > eyeCoords.lefty ? y - eyeCoords.lefty : eyeCoords.lefty - y;
  return direction * Math.min((magnitude * Rate) / eyeCoords.lefty, BoundaryY);
}

function handleMouseMove(event) {
  // Handles the mouse movement events. If the cursor is inbetween the eyes, the only movement is
  // in the y direction. Otherwise, the closest eye is chosen and the eye balls are moved to follow
  // the cursor from the POV of the chosen eye.

  // const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;

  const x = event.clientX;
  const y = event.clientY;

  if (window.innerWidth < 1000 && (y + scrollY) > window.innerHeight) return;

  const dy = lerpY(y);
  if (dy) {
    // sometimes the change is too fast and dy is NaN
    [0, 1].forEach((idx) => {
      corneas[idx].setAttribute('cy', OriginalCY+ dy);
      eyeBalls[idx].setAttribute('cy', OriginalCY + dy);
    });
  }

  if (x >= eyeCoords.rightx || x <= eyeCoords.leftx) {
    // not between the eyes just move up and down
    const povX = chooseEye(x);
    const dx = lerpX(x, povX);
    if (dx) {
      [0, 1].forEach((idx) => {
        corneas[idx].setAttribute('cx', OriginalCX+ dx);
        eyeBalls[idx].setAttribute('cx', OriginalCX+ dx);
      });
    }
  } else {
    [0, 1].forEach((idx) => {
      corneas[idx].setAttribute('cx', OriginalCX);
      eyeBalls[idx].setAttribute('cx', OriginalCX);
    });
  }
}
// end eye movement control


// handle filtering
function allUnchecked() {
  // Checks if all the checkboxes are unchecked

  for (let checkBox of document.getElementsByClassName("check-input")) {
    if (checkBox.checked) return false;
  }
  return true;
}

function hasAllTags(filterable, tags) {
  // checks if a filterable element matches with all the filter tags by comparing the titles
  // of the img children it has wit the filter tags

  let matchCount = 0;
  for (const tag of tags){
    for (const img of filterable.querySelectorAll('img')) {
      if (img.title.toUpperCase() === tag) {
        matchCount += 1;
      }
    }
  }
  return matchCount === tags.length;
}

function handleCheckBox(event) {
  // When the checkbox is checked filters to remove filterable elements that don't have the target
  // tag. When unchecked, it adds all the filterable elements which where filtered out. Check if 
  // a filterable element contains the tag by looking at the title of the images they have.

  const target = event.target;
  let boxId = target.id;
  boxId = mapIdTitle.hasOwnProperty(boxId) ? mapIdTitle[boxId]: boxId.toUpperCase();

  if (target.checked) {
    checkedFilters.push(boxId);
    const filterIcon = document.createElement("div")
    filterIcon.setAttribute("id", boxId);
    filterIcon.setAttribute("class", "filter");
    filterIcon.innerHTML = boxId;
    filterDiv.appendChild(filterIcon);
  } 
  else {
    checkedFilters = checkedFilters.filter(el => el !== boxId);
    filterDiv.querySelector(`#${boxId}`).remove();
  }

  if (checkedFilters.length === 0){
    for (const filterable of filterableContent) {
      filterable.classList.remove("hide");
    }
    matchDisplay.classList.add("hide");
    clearFiltersBtn.classList.add("hide");
  } else {
    let matches = 0;
    for (const filterable of filterableContent) {
      if (hasAllTags(filterable, checkedFilters)) {
        filterable.classList.remove("hide");
        matches += 1;
      } else {
        filterable.classList.add("hide");
      }
      matchDisplay.classList.remove("hide");
      matchDisplay.innerHTML = `Matches: ${matches}`;
    }
    clearFiltersBtn.classList.remove("hide");
  }
}

function handleClearFilters() {
  // Clears all the selected filters. Uncheck checkboxes, removes filter icons, and display everything.

  for (const checkBox of checkBoxes) 
    if (checkBox.checked) checkBox.checked = false;

  for (const filterIcon of document.getElementsByClassName("filter"))
    filterIcon.remove();

  for (const filterable of filterableContent) 
    filterable.classList.remove("hide");

  matchDisplay.classList.add("hide");
  clearFiltersBtn.classList.add("hide");
  
}