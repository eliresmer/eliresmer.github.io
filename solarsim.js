import { Vector2 } from './ClassLibrary/Vector2.js';
import { Vector3 } from './ClassLibrary/Vector3.js';

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const stars = [];
const planets = [];
const planetNames = [];
const G = 6.67430 / 1000
let turn = null;
let focusNum = -1;
let lastUpdate = Date.now();
let timeSinceFocus = 100;
let currentFocus = 'None';
const origin = new Vector3(canvas.width / 2, canvas.height / 2, 0);

const cameraPosition = new Vector3(0, 100, 500);
const cameraOrientation = new Vector3(-.4, 0, 0);


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
        .setRadius(4000)
        .setMass(332950)
        .setVelocity(new Vector3(0, 0, 0))
        .setColour("yellow")
    );
    planets.push(new Planet("Mercury")
        .setPosition(new Vector3(0, 0, 69.8169))
        .setRadius(1000)
        .setMass(0.0553)
        .setVelocity(new Vector3(4.79, 0, 0))
        .setColour("white")
    );
    planets.push(new Planet("Venus")
        .setPosition(new Vector3(0, 0, 108.94))
        .setRadius(1000)
        .setMass(0.815)
        .setVelocity(new Vector3(3.5, 0, 0))
        .setColour("white")
    );
    
    planets.push(new Planet("Earth")
        .setPosition(new Vector3(0, 0, 152.097))
        .setRadius(1000)
        .setMass(1)
        .setVelocity(new Vector3(2.98, 0, 0))
        .setColour("blue")
    );
    planets.push(new Planet("Mars")
        .setPosition(new Vector3(0, 0, 249.261))
        .setRadius(1000)
        .setMass(0.1075)
        .setVelocity(new Vector3(2.41, 0, 0))
        .setColour("red")
    );
    planets.push(new Planet("Jupiter")
        .setPosition(new Vector3(0, 0, 816.363))
        .setRadius(1000)
        .setMass(317.8)
        .setVelocity(new Vector3(1.31, 0, 0))
        .setColour("orange")
    );
    planets.push(new Planet("Saturn")
        .setPosition(new Vector3(0, 0, 1514.50))
        .setRadius(1000)
        .setMass(95.2)
        .setVelocity(new Vector3(0.97, 0, 0))
        .setColour("orange")
    );
    planets.push(new Planet("Uranus")
        .setPosition(new Vector3(0, 0, 3006.39))
        .setRadius(1000)
        .setMass(14.6)
        .setVelocity(new Vector3(0.68, 0, 0))
        .setColour("blue")
    );
    planets.push(new Planet("Neptune")
        .setPosition(new Vector3(0, 0, 4540))
        .setRadius(1000)
        .setMass(17.2)
        .setVelocity(new Vector3(0.54, 0, 0))
        .setColour("blue")
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

    var now = Date.now();
    var dt = (now - lastUpdate) / 1000;
    console.log(dt);

    for (let attractor of planets) {
        for (let attractee of planets) {
            if (attractor === attractee) {

            }
            else {
                let distance = attractor.position.subtract(attractee.position).magnitude();

                let force = attractor.position.subtract(attractee.position).divide(distance * distance * distance).multiply(attractor.mass * G);
                force.multiply(dt);
                attractee.velocity = attractee.velocity.subtract(force);
            }
        }
    }


    for (let planet of planets) {
        planet.position = planet.position.subtract(planet.velocity);

    }



    draw();
    requestAnimationFrame(main);
    lastUpdate = now;
}

start();
