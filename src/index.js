// Handles the dynamic aspect of the page

const BOUNDARYY = 45;
const BOUNDARYX = 65; // the radius for the eye movement boundary
const ORIGINALCY = 65;
const ORIGINALCX = 105;

let midAnimation = false;

const eyeBalls = document.getElementsByClassName('eye-ball');
const eyeLids = document.getElementsByClassName('eye-lid');
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
document.addEventListener('click', handleClick);
document.addEventListener('DOMContentLoaded', handleWink);
window.addEventListener('resize', resetCoords);

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
  x = event.clientX;
  y = event.clientY;
  let dy = lerpY(y);
  [0, 1].forEach((idx) => eyeBalls[idx].setAttribute('cy', ORIGINALCY + dy));
  if (x >= eyeCoords.rightx || x <= eyeCoords.leftx) {
    // not between the eyes just move up and down
    povX = chooseEye(x);
    let dx = lerpX(x, povX);
    [0, 1].forEach((idx) => eyeBalls[idx].setAttribute('cx', ORIGINALCX + dx));
  } else {
    [0, 1].forEach((idx) => eyeBalls[idx].setAttribute('cx', ORIGINALCX));
  }
}
// end eye movement control
