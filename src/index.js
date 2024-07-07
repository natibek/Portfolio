const BOUNDARY = 80; // the radius for the eye movement boundary
const ORIGINALCY = 65;
const ORIGINALCX = 105;

document.addEventListener('mousemove', handleMouseMove);
const eyeBalls = document.getElementsByClassName("eye-ball");
let eyeCoords = {
    "leftx": eyeBalls[0].getBoundingClientRect().x,
    "lefty": eyeBalls[0].getBoundingClientRect().y,
    "rightx": eyeBalls[1].getBoundingClientRect().x,
    "righty": eyeBalls[1].getBoundingClientRect().y,
};

window.addEventListener('resize', (event) => {
    eyeCoords = {
        "leftx": eyeBalls[0].getBoundingClientRect().x,
        "lefty": eyeBalls[0].getBoundingClientRect().y,
        "rightx": eyeBalls[1].getBoundingClientRect().x,
        "righty": eyeBalls[1].getBoundingClientRect().y,
    };
});

function chooseEye(cursor_x) {
    left_dist = Math.abs(cursor_x - eyeCoords.leftx);
    right_dist = Math.abs(cursor_x - eyeCoords.rightx)
    if (left_dist <= right_dist) return eyeCoords.leftx;
    else return eyeCoords.rightx;
}

function lerpX(x, povX) {
    const direction = (x - povX)/Math.abs(x -povX);
    const docWidth = document.documentElement.clientWidth;
    const magnitude = x > docWidth/2 ? x - docWidth/2 : docWidth/2 - x;
    return direction * (magnitude * BOUNDARY / docWidth/2);
}

function lerpY(y) {
    // boundary of a 50 rad circle
    // height of document is needed
    const direction = (y - eyeCoords.lefty)/Math.abs(y - eyeCoords.lefty);
    const docHeight = document.documentElement.clientHeight;
    const magnitude = y > docHeight/2 ? y - docHeight/2 : docHeight/2 - y;
    return direction * (magnitude * BOUNDARY / docHeight/2); 
}

function handleMouseMove(event) {
    x = event.clientX;
    y = event.clientY;

    let dy = lerpY(y);
    [0, 1].forEach(idx => eyeBalls[idx].style.cy = ORIGINALCY + dy);
    // console.log("INSIDE", ORIGINALCY + dy)

    if (x >= eyeCoords.rightx || x <= eyeCoords.leftx) {
        // not between the eyes just move up and down   
        povX = chooseEye(x);
        let dx = lerpX(x, povX);
        // console.log("OUTSIDE", ORIGINALCX + dx);
        [0, 1].forEach(idx => eyeBalls[idx].style.cx = ORIGINALCX + dx);
    } else {
        [0, 1].forEach(idx => eyeBalls[idx].style.cx = ORIGINALCX);
    }

}