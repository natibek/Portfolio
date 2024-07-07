const BOUNDARYY = 40;
const BOUNDARYX = 50; // the radius for the eye movement boundary
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

window.addEventListener('resize', () => {
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
    const magnitude = x > povX ? x - povX : povX - x;
    return direction * (magnitude * BOUNDARYX / povX);
}

function lerpY(y) {
    // boundary of a 50 rad circle
    const direction = (y - eyeCoords.lefty)/Math.abs(y - eyeCoords.lefty);
    const magnitude = y > eyeCoords.lefty ? y -eyeCoords.lefty: eyeCoords.lefty - y;
    return direction * (magnitude * BOUNDARYY / eyeCoords.lefty); 
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