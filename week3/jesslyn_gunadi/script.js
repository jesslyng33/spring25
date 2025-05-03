let counter = 0;
let lastClickTimes = [];

function addOneToCounter() {
    counter += 1;
    document.getElementById("counter").innerText = counter;

    const now = Date.now();
    lastClickTimes.push(now);
}

setInterval(() => {
    const now = Date.now();

    lastClickTimes = lastClickTimes.filter(t => now - t <= 1000);

    const cps = lastClickTimes.length;
    document.getElementById("cps").innerText = cps;
}, 500);