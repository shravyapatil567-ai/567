// ========================================
// AUDIO
// ========================================

let audioContext = null;

let isPlaying = false;

let currentStep = 0;

let timer = null;

let currentGenre = "rock";


// ========================================
// GENRE PATTERNS
// 1 = sound
// 0 = silence
// ========================================

const patterns = {

    rock: {

        kick: [
            1,0,0,0,
            1,0,0,0,
            1,0,0,0,
            1,0,0,0
        ],

        snare: [
            0,0,1,0,
            0,0,1,0,
            0,0,1,0,
            0,0,1,0
        ],

        hat: [
            1,1,1,1,
            1,1,1,1,
            1,1,1,1,
            1,1,1,1
        ]

    },


    disco: {

        kick: [
            1,0,0,0,
            1,0,0,0,
            1,0,0,0,
            1,0,0,0
        ],

        snare: [
            0,0,1,0,
            0,0,0,0,
            0,0,1,0,
            0,0,0,0
        ],

        hat: [
            0,1,0,1,
            0,1,0,1,
            0,1,0,1,
            0,1,0,1
        ]

    },


    hiphop: {

        kick: [
            1,0,0,0,
            0,0,1,0,
            1,0,0,1,
            0,0,0,0
        ],

        snare: [
            0,0,1,0,
            0,0,0,0,
            0,0,1,0,
            0,0,0,0
        ],

        hat: [
            1,1,1,1,
            1,1,1,1,
            1,1,1,1,
            1,1,1,1
        ]

    },


    reggae: {

        kick: [
            1,0,0,0,
            0,0,0,0,
            1,0,0,0,
            0,0,0,0
        ],

        snare: [
            0,0,0,1,
            0,0,0,1,
            0,0,0,1,
            0,0,0,1
        ],

        hat: [
            0,1,0,1,
            0,1,0,1,
            0,1,0,1,
            0,1,0,1
        ]

    }

};


// ========================================
// CURRENT PATTERN
// ========================================

let currentPattern = copyPattern(
    patterns.rock
);


// ========================================
// COPY PATTERN
// ========================================

function copyPattern(pattern) {

    return {

        kick: [...pattern.kick],

        snare: [...pattern.snare],

        hat: [...pattern.hat]

    };

}


// ========================================
// GENERATE PATTERN
// ========================================

function generatePattern() {

    const base =
        patterns[currentGenre];


    currentPattern =
        copyPattern(base);


    const variation =
        Number(
            document.getElementById("variation").value
        ) / 100;


    const syncopation =
        Number(
            document.getElementById("syncopation").value
        ) / 100;


    // VARIATION

    if (variation > 0) {

        ["kick", "snare", "hat"].forEach(
            instrument => {

                for (let i = 0; i < 16; i++) {

                    if (
                        Math.random() <
                        variation * 0.20
                    ) {

                        currentPattern[instrument][i] =
                            currentPattern[instrument][i]
                            ? 0
                            : 1;

                    }

                }

            }
        );

    }


    // SYNCOPATION

    if (syncopation > 0) {

        ["kick", "snare"].forEach(
            instrument => {

                for (let i = 1; i < 16; i += 2) {

                    if (
                        Math.random() <
                        syncopation * 0.25
                    ) {

                        currentPattern[instrument][i] = 1;

                    }

                }

            }
        );

    }


    updateGrid();

}


// ========================================
// KICK
// ========================================

function playKick() {

    const osc =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    osc.type = "sine";


    osc.frequency.setValueAtTime(
        150,
        audioContext.currentTime
    );


    osc.frequency.exponentialRampToValueAtTime(
        45,
        audioContext.currentTime + 0.15
    );


    gain.gain.setValueAtTime(
        1,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.15
    );


    osc.connect(gain);

    gain.connect(audioContext.destination);


    osc.start();

    osc.stop(
        audioContext.currentTime + 0.15
    );

}


// ========================================
// SNARE
// ========================================

function playSnare() {

    const buffer =
        audioContext.createBuffer(
            1,
            audioContext.sampleRate * 0.15,
            audioContext.sampleRate
        );


    const data =
        buffer.getChannelData(0);


    for (let i = 0; i < data.length; i++) {

        data[i] =
            Math.random() * 2 - 1;

    }


    const noise =
        audioContext.createBufferSource();


    const filter =
        audioContext.createBiquadFilter();


    const gain =
        audioContext.createGain();


    noise.buffer = buffer;


    filter.type = "highpass";

    filter.frequency.value = 1000;


    gain.gain.setValueAtTime(
        0.5,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.15
    );


    noise.connect(filter);

    filter.connect(gain);

    gain.connect(audioContext.destination);


    noise.start();

}


// ========================================
// HI-HAT
// ========================================

function playHat() {

    const buffer =
        audioContext.createBuffer(
            1,
            audioContext.sampleRate * 0.05,
            audioContext.sampleRate
        );


    const data =
        buffer.getChannelData(0);


    for (let i = 0; i < data.length; i++) {

        data[i] =
            Math.random() * 2 - 1;

    }


    const noise =
        audioContext.createBufferSource();


    const filter =
        audioContext.createBiquadFilter();


    const gain =
        audioContext.createGain();


    noise.buffer = buffer;


    filter.type = "highpass";

    filter.frequency.value = 5000;


    gain.gain.setValueAtTime(
        0.25,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.05
    );


    noise.connect(filter);

    filter.connect(gain);

    gain.connect(audioContext.destination);


    noise.start();

}


// ========================================
// PLAY ONE STEP
// ========================================

function playStep() {

    const step = currentStep;


    if (currentPattern.kick[step]) {

        playKick();

    }


    if (currentPattern.snare[step]) {

        playSnare();

    }


    if (currentPattern.hat[step]) {

        playHat();

    }


    highlightStep(step);


    currentStep++;


    if (currentStep >= 16) {

        currentStep = 0;

    }

}


// ========================================
// START
// ========================================

async function start() {

    if (isPlaying) return;


    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }


    if (audioContext.state === "suspended") {

        await audioContext.resume();

    }


    isPlaying = true;

    currentStep = 0;


    document.getElementById("status")
        .textContent =
        "Playing " +
        currentGenre.toUpperCase();


    playStep();


    startTimer();

}


// ========================================
// TIMER
// ========================================

function startTimer() {

    clearInterval(timer);


    const bpm =
        Number(
            document.getElementById("bpm").value
        );


    const interval =
        (60000 / bpm) / 4;


    timer =
        setInterval(
            playStep,
            interval
        );

}


// ========================================
// STOP
// ========================================

function stop() {

    isPlaying = false;


    clearInterval(timer);

    timer = null;


    currentStep = 0;


    removeHighlights();


    document.getElementById("status")
        .textContent = "Stopped";

}


// ========================================
// HIGHLIGHT
// ========================================

function highlightStep(step) {

    removeHighlights();


    document.querySelectorAll(".step")
        .forEach(
            (element, index) => {

                if (
                    index % 16 === step
                ) {

                    element.classList.add(
                        "current"
                    );

                }

            }
        );

}


// ========================================
// REMOVE HIGHLIGHT
// ========================================

function removeHighlights() {

    document.querySelectorAll(".step")
        .forEach(
            element => {

                element.classList.remove(
                    "current"
                );

            }
        );

}


// ========================================
// UPDATE GRID
// ========================================

function updateGrid() {

    createRow(
        "kickRow",
        currentPattern.kick
    );


    createRow(
        "snareRow",
        currentPattern.snare
    );


    createRow(
        "hatRow",
        currentPattern.hat
    );

}


// ========================================
// CREATE ROW
// ========================================

function createRow(rowId, pattern) {

    const row =
        document.getElementById(rowId);


    const instrument =
        row.querySelector(".instrument");


    row.innerHTML = "";


    row.appendChild(instrument);


    for (let i = 0; i < 16; i++) {

        const step =
            document.createElement("div");


        step.className = "step";


        if (pattern[i]) {

            step.classList.add("on");

        }


        step.addEventListener(
            "click",
            () => {

                pattern[i] =
                    pattern[i] ? 0 : 1;


                updateGrid();

            }
        );


        row.appendChild(step);

    }

}


// ========================================
// GENRE BUTTONS
// ========================================

document.querySelectorAll(".genre")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    currentGenre =
                        button.dataset.genre;


                    document
                        .querySelectorAll(".genre")
                        .forEach(
                            btn => {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    generatePattern();


                    document
                        .getElementById("status")
                        .textContent =
                        "Selected " +
                        currentGenre.toUpperCase();

                }
            );

        }
    );


// ========================================
// BPM
// ========================================

const bpmSlider =
    document.getElementById("bpm");


bpmSlider.addEventListener(
    "input",
    () => {

        document
            .getElementById("bpmValue")
            .textContent =
            bpmSlider.value;


        if (isPlaying) {

            startTimer();

        }

    }
);


// ========================================
// VARIATION
// ========================================

const variationSlider =
    document.getElementById("variation");


variationSlider.addEventListener(
    "input",
    () => {

        document
            .getElementById("variationValue")
            .textContent =
            variationSlider.value + "%";


        generatePattern();

    }
);


// ========================================
// SYNCOPATION
// ========================================

const syncSlider =
    document.getElementById("syncopation");


syncSlider.addEventListener(
    "input",
    () => {

        document
            .getElementById("syncValue")
            .textContent =
            syncSlider.value + "%";


        generatePattern();

    }
);


// ========================================
// PLAY
// ========================================

document
    .getElementById("playButton")
    .addEventListener(
        "click",
        start
    );


// ========================================
// STOP
// ========================================

document
    .getElementById("stopButton")
    .addEventListener(
        "click",
        stop
    );


// ========================================
// INITIAL GRID
// ========================================

updateGrid();