// A model URL from Teachable Machine
const URL = "YOUR_TEACHABLE_MACHINE_MODEL_URL"; // You must replace this URL

let model, webcam, maxPredictions;
const emojis = ["😀", "😭", "😮", "😡", "😎"];
let currentEmoji = "";

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup webcam
    const flip = true; 
    webcam = new tmImage.Webcam(320, 240, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam").appendChild(webcam.canvas);
    
    // Start game
    newEmoji();
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    const feedbackEl = document.getElementById("feedback");

    // Get the highest probability prediction
    const highestProb = prediction.reduce((max, current) => current.probability > max.probability ? current : max);
    const predictedEmoji = emojis[highestProb.classIndex];

    if (predictedEmoji === currentEmoji) {
        feedbackEl.textContent = "Correct!";
        // Delay a bit before showing the next emoji
        setTimeout(newEmoji, 2000);
    } else {
        feedbackEl.textContent = "Keep trying...";
    }
}

function newEmoji() {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    currentEmoji = emojis[randomIndex];
    document.getElementById("emoji-display").textContent = currentEmoji;
    document.getElementById("feedback").textContent = "";
}

init();
