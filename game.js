import { Vector2 } from './ClassLibrary/Vector2.js';
import { Vector3 } from './ClassLibrary/Vector3.js';

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const stars = [];
const planets = [];
const planetNames = [];
const power = 9;
let turn = null;
let focusNum = -1;

let timeSinceFocus = 100;
let currentFocus = 'None';
const origin = new Vector3(canvas.width / 2, canvas.height / 2, 0);

const cameraPosition = new Vector3(0, 0, 500);
const cameraOrientation = new Vector3(0, 0, 0);


function screenPosition(objectPosition, cameraPosition, cameraOrientation) {
    let x = objectPosition.x - cameraPosition.x;
    let y = objectPosition.y - cameraPosition.y;
    let z = objectPosition.z - cameraPosition.z;
    let cosx = Math.cos(cameraOrientation.x);
    let cosy = Math.cos(cameraOrientation.y);
    let cosz = Math.cos(cameraOrientation.z);
    let sinx = Math.sin(cameraOrientation.x);
    let siny = Math.sin(cameraOrientation.y);
    let sinz = Math.sin(cameraOrientation.z);
    let dx = cosy * (sinz * y + cosz * x) - siny * z;
    let dy = sinx * (cosy * z + siny * (sinz * y + cosz * x)) + cosx * (cosz * y - sinz * x);
    let dz = cosx * (cosy * z + siny * (sinz * y + cosz * x)) - sinx * (cosz * y - sinz * x);
    let e = origin.subtract(cameraPosition);
    //let e = cameraPosition;
    let bx = (e.z / dz) * dx + e.x;
    let by = (e.z / dz) * dy + e.y;
    return new Vector2(bx, by);

}

class Planet {

    constructor(name) {
        this.name = name;
        planetNames.push(name);
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setPosition(position) {
        this.position = position;
        return this;
    }
    setRadius(radius) {
        this.radius = radius;
        return this;
    }
    setMass(mass) {
        this.mass = mass;
        return this;
    }
    setVelocity(velocity) {
        this.velocity = velocity;
        return this;
    }
    setColour(colour) {
        this.colour = colour;
        return this;
    }
}

function findIndexInArray(array, prop, value) {
    return array
        .map(object => object[prop])
        .indexOf(value);
}

function start() {
    planets.push(new Planet("Sun")
        .setPosition(new Vector3(0, 0, 0))
        .setRadius(10000)
        .setMass(2000)
        .setVelocity(new Vector3(0, 0, 0))
        .setColour("yellow")
    );
    planets.push(new Planet("Venus")
        .setPosition(new Vector3(-10, 0, 100))
        .setRadius(1800)
        .setMass(2)
        .setVelocity(new Vector3(5, 0, 0))
        .setColour("white")
    );
    planets.push(new Planet("Earth")
        .setPosition(new Vector3(-15, 0, 200))
        .setRadius(3000)
        .setMass(2)
        .setVelocity(new Vector3(3, 0, 0))
        .setColour("blue")
    );
    planets.push(new Planet("Mars")
        .setPosition(new Vector3(-20, 0, 300))
        .setRadius(2000)
        .setMass(2)
        .setVelocity(new Vector3(2, 0, 0))
        .setColour("red")
    );
    planets.push(new Planet("Jupiter")
        .setPosition(new Vector3(-25, 0, 500))
        .setRadius(6000)
        .setMass(2)
        .setVelocity(new Vector3(1.5, 0, 0))
        .setColour("orange")
    );

    document.addEventListener('keydown', function (event) {
        console.log(event.key);
        
        if (event.key == "d") {
            cameraPosition.x += 5
        }
        if (event.key == "a") {
            cameraPosition.x -= 5
        }
        if (event.key == "w") {
            cameraPosition.z -= 5
        }
        if (event.key == "s") {
            cameraPosition.z += 5
        }

        if (event.key == "c") {
            cameraPosition.y += 5
        }
        if (event.key == " ") {
            event.preventDefault();
            cameraPosition.y -= 5
        }


        if (event.key == "r") {
            nextFocus()
            timeSinceFocus = 0;
        }
        if (event.key == "t") {
            focusNum = -1;
            currentFocus = 'None';
            timeSinceFocus = 0;
        }
        if (event.key == "q") {
            cameraOrientation.y += 0.02;
        }
        if (event.key == "e") {
            cameraOrientation.y -= 0.02;
        }
        if (event.key == "z") {
            cameraOrientation.x += 0.02;
        }
        if (event.key == "x") {
            cameraOrientation.x -= 0.02;
        }

    });


    main();
}

function sizeFromViewerPosition(planet) {
    let distance = getViewerDistance(planet).magnitude();
    return Math.max(planet.radius / (distance), 0);
}
function getViewerDistance(planet) {
    let distance = cameraPosition.subtract(planet.position);
    return distance;
}

function nextFocus() {
    focusNum += 1;
    if (focusNum > planetNames.length - 1) {
        focusNum = -1
    }
    if (focusNum >= 0) {
        currentFocus = planetNames[focusNum]

    }
    else {
        currentFocus = 'None';

    }
    console.log(currentFocus);

}

function draw() {
    timeSinceFocus++;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    planets.sort((a, b) => parseFloat(a.position.z) - parseFloat(b.position.z));
    if (timeSinceFocus < 100) {
        ctx.fillStyle = 'white';
        ctx.fillText(`Focus: ${currentFocus}`, origin.x - 50, origin.y - 300);
    }

    for (let planet of planets) {
        let screenPos = screenPosition(planet.position, cameraPosition, cameraOrientation);
        ctx.fillStyle = planet.colour;
        ctx.font = "20px Arial";
        ctx.fillText(`${planet.name}`, screenPos.x - 20, screenPos.y - 10 - sizeFromViewerPosition(planet));
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, sizeFromViewerPosition(planet), 0, 2 * Math.PI);

        ctx.fill();



    }

}

function main() {
    if (currentFocus != 'None') {
        cameraPosition.x = planets[findIndexInArray(planets, 'name', currentFocus)].position.x
        cameraPosition.y = planets[findIndexInArray(planets, 'name', currentFocus)].position.y
        cameraPosition.z = planets[findIndexInArray(planets, 'name', currentFocus)].position.z + 200
    }

    for (let attractor of planets) {
        for (let attractee of planets) {
            if (attractor === attractee) {

            }
            else {
                let distance = attractor.position.subtract(attractee.position).magnitude();

                let force = attractor.position.subtract(attractee.position).divide(distance * distance * distance).multiply(attractor.mass);
                attractee.velocity = attractee.velocity.subtract(force);
            }
        }
    }


    for (let planet of planets) {
        planet.position = planet.position.subtract(planet.velocity);

    }



    draw();
    requestAnimationFrame(main);
}

start();
