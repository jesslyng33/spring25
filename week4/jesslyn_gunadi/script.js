let counter = 0;
let lastClickTimes = [];

const cookieImages = [
    "https://www.gfifoods.com/media/catalog/product/cache/608c797bf41e8874bcf75172f32fd01b/1/_/1.520oz20cookie_20220613-094305_rqhft3tmv23k13bn.jpg",
    "cookie2.jpg",
    "cookie3.jpg",
];

function addOneToCounter() {
    counter += 1;
    document.getElementById("counter").innerText = counter;

    const now = Date.now();
    lastClickTimes.push(now);

    if (counter % 30 === 0) {
        const index = (counter / 30) % cookieImages.length;
        document.getElementById("cookie").src = cookieImages[index];
    }

    maybeShowBonusCookie();
}

setInterval(() => {
    const now = Date.now();

    lastClickTimes = lastClickTimes.filter(t => now - t <= 1000);

    const cps = lastClickTimes.length;
    document.getElementById("cps").innerText = cps;
}, 500);

function maybeShowBonusCookie() {
    if (Math.random() < 0.2) {
        const img = document.createElement("img");
        img.src = "cookie2.jpg";
        img.classList.add("bonus-cookie");

        const randomTop = Math.random() * 220;
        const showLeft = Math.random() < 0.5;
        const leftPosition = showLeft
            ? -80 - Math.random() * 70
            : 300 + Math.random() * 70;

        img.style.top = `${randomTop}px`;
        img.style.left = `${leftPosition}px`;

        img.onclick = () => {
            counter += 10;
            document.getElementById("counter").innerText = counter;
            img.remove();
        };

        document.getElementById("bonus-cookie-container").appendChild(img);

        setTimeout(() => {
            if (document.body.contains(img)) {
                img.remove();
            }
        }, 1000);
    }
}
