let keys =
{
	forward: 0,
	right: 0,
	up: 0
};

let direction = 
{
	x: 0,
	y: 0
}
let playerPositionObject;
let delta = 0;
let playerRotation;

function setCurrentDelta(del)
{
	delta = del;
}
let sprinting = false;
let flying = false;

function setupMouseAndKeyboard(renderer)
{
	let lastWPress = 0;
	let lastSpacePress = 0;
	document.onkeydown = function (e) {
		if (e.code === "KeyW") {
			const now = Date.now();
			if (now - lastWPress < 300 && now - lastWPress > 100) {
				console.log(now - lastWPress);
				sprinting = true;
			}
			lastWPress = now;
		}

		if (e.code === "Space") {
			const now = Date.now();
			if (now - lastSpacePress < 300 && now - lastSpacePress > 100) {
				console.log(now - lastSpacePress);
				flying = !flying;
				console.log(flying);
			}
			lastSpacePress = now;
		}
		// console.log(e);
		switch(e.code)
		{
			case "KeyW":
				keys.forward = 1;
				break;
			case "KeyS":
				keys.forward = -1;
				break;
			case "KeyA":
				keys.right = -1;
				break;
			case "KeyD":
				keys.right = 1;
				break;
			case "Space":
				keys.up = 1;
				break;
			case "ShiftLeft":
				keys.up = -1;
				break;
			default:
				break;
		}
	};

	document.onkeyup = function (e) {
		switch(e.code)
		{
			case "KeyW":
			case "KeyS":
				keys.forward = 0;
				if(sprinting) {
					sprinting = false;
					lastWPress = 0;
				}
				break;
			case "KeyA":
			case "KeyD":
				keys.right = 0;
				break;
			case "Space":
			case "ShiftLeft":
				keys.up = 0;
				break;
			default:
				break;
		}
	};

	document.getElementById("overlay").addEventListener("click", async () => {
		requestPointerLockWithUnadjustedMovement();
	  });


function requestPointerLockWithUnadjustedMovement() {
	const promise = renderer.domElement.requestPointerLock({
	  unadjustedMovement: true,
	});
  
	if (!promise) {
	  console.log("disabling mouse acceleration is not supported");
	  return;
	}
  
	return promise
	  .then(() => console.log("pointer is locked"))
	  .catch((error) => {
		if (error.name === "NotSupportedError") {
			console.log("unadjusted")
		  return renderer.domElement.requestPointerLock();
		}
	  });
}

function lockChangeAlert()
{
	if (document.pointerLockElement === renderer.domElement)
		document.addEventListener("mousemove", updatePosition, false);
	else
		document.removeEventListener("mousemove", updatePosition, false);
	}

	document.addEventListener("pointerlockchange", lockChangeAlert, false);
}

	
	  





function updatePosition(e)
{
	direction.x -= e.movementX/8000 * delta;
	direction.y -= e.movementY/8000 * delta;
	direction.y = Math.max(-Math.PI/2, Math.min(direction.y, Math.PI/2));

	playerRotation.set(direction.y, direction.x, 0, 'ZYX');
}


function setPlayerPosition(obj)
{
	playerPositionObject = obj;
}

function setPlayerRotation(obj)
{
	playerRotation = obj;
}

function worldVelocityForward(velocity)
{
	return {x: velocity * Math.sin(direction.x), z: velocity * Math.cos(direction.x)};
}

function worldVelocityRight(velocity)
{
	return {x: velocity * Math.sin(direction.x - Math.PI/2), z: velocity * Math.cos(direction.x - Math.PI/2)};
}

// function moveForward(distance)
// {
// 	playerPositionObject.x -= distance * Math.sin(direction.x);
// 	playerPositionObject.z -= distance * Math.cos(direction.x);
// }

// function moveRight(distance)
// {
// 	playerPositionObject.x -= distance * Math.sin(direction.x - Math.PI/2);
// 	playerPositionObject.z -= distance * Math.cos(direction.x - Math.PI/2);
// }

function moveUp(distance) {
	playerPositionObject.y += distance;
}

export {keys, direction, setCurrentDelta, setupMouseAndKeyboard, setPlayerPosition, setPlayerRotation, worldVelocityForward, worldVelocityRight, moveUp, sprinting, flying};