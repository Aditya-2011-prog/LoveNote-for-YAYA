const messages = [
    "Your smile is my favorite part of the day, every day.",
    "I love the way your mind works and how you see the world.",
    "You bring a quiet joy to my life that nothing else can match.",
    "I'm so lucky to have your support and incredible kindness.",
    "I love the sound of your laugh—it's the best melody.",
    "The confidence you show inspires me to be a better person.",
    "I love every adventure we share, big or small.",
    "You are the most beautiful, thoughtful soul I know.",
    "Just being next to you is my favorite place to be.",
    "I love how passionate you are about the things you care about.",
    "You are simply my forever person.",
];

// --- DOM Elements ---
const loveButton = document.getElementById('loveButton');
const dislikeButton = document.getElementById('dislikeButton');
const buttonWrapper = document.getElementById('buttonWrapper');
const dynamicMessage = document.getElementById('dynamicMessage');
const iconContainer = document.querySelector('[data-lucide="sparkles"]');

const iconOriginalStroke = iconContainer ? (iconContainer.style.stroke || 'white') : 'white';
const iconOriginalFill = iconContainer ? (iconContainer.style.fill || 'white') : 'white';
let isChasing = false;
let lastMessageIndex = -1;
let chasingButton = null; // <-- new

// --- Helper Functions ---

function getRandomMessage() {
    if (messages.length === 0) return "My love for you is infinite!";

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * messages.length);
    } while (randomIndex === lastMessageIndex && messages.length > 1);

    lastMessageIndex = randomIndex;
    return messages[randomIndex];
}

// --- Chase Mechanic Functions (Updated for Touch and Mouse) ---

// Moves the button away from the touch/mouse input
function chaseButton(event) {
    if (!isChasing) return;

    if (event.type === 'touchmove') {
        event.preventDefault();
    }

    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;

    if (clientX === undefined || clientY === undefined) return;

    // If the moving target uses fixed positioning, allow it to move across whole viewport:
    const targetButton = chasingButton || document.querySelector('#buttonWrapper .moving');
    if (!targetButton) return;

    const isFixed = targetButton.classList.contains('fixed-moving') || targetButton.style.position === 'fixed';
    const wrapperRect = isFixed
        ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
        : buttonWrapper.getBoundingClientRect();

    const buttonRect = targetButton.getBoundingClientRect();

    const inputX = clientX - wrapperRect.left;
    const inputY = clientY - wrapperRect.top;

    const styleLeft = parseFloat(targetButton.style.left);
    const styleTop = parseFloat(targetButton.style.top);

    const buttonCenterX =
        (Number.isFinite(styleLeft) ? styleLeft : (buttonRect.left - wrapperRect.left)) + buttonRect.width / 2;
    const buttonCenterY =
        (Number.isFinite(styleTop) ? styleTop : (buttonRect.top - wrapperRect.top)) + buttonRect.height / 2;

    const distance = Math.hypot(inputX - buttonCenterX, inputY - buttonCenterY);

    const chaseRadius = 200;
    if (distance < chaseRadius) {
        const angle = Math.atan2(buttonCenterY - inputY, buttonCenterX - inputX);
        const step = 120; // step size (increase to make it run faster)

        let newX = buttonCenterX + Math.cos(angle) * step - buttonRect.width / 2;
        let newY = buttonCenterY + Math.sin(angle) * step - buttonRect.height / 2;

        // Bound the movement to wrapperRect (or full viewport for fixed targets)
        newX = Math.max(0, Math.min(newX, wrapperRect.width - buttonRect.width));
        newY = Math.max(0, Math.min(newY, wrapperRect.height - buttonRect.height));

        targetButton.style.left = `${newX}px`;
        targetButton.style.top = `${newY}px`;
    }
}

function startChaseMode() {
    isChasing = true;

    // change the chase target to the dislike ("I don't love") button
    chasingButton = dislikeButton;
    chasingButton.classList.add('moving', 'fixed-moving');

    // move the dislike button out of the wrapper so it can roam the whole screen
    document.body.appendChild(chasingButton);
    chasingButton.style.position = 'fixed';

    // Center the dislike button initially inside viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const buttonRect = chasingButton.getBoundingClientRect();
    chasingButton.style.left = `${(vw - buttonRect.width) / 2}px`;
    chasingButton.style.top = `${(vh - buttonRect.height) / 2}px`;

    // Add listeners on the window (so the button reacts anywhere on screen)
    window.addEventListener('mousemove', chaseButton);
    window.addEventListener('touchmove', chaseButton, { passive: false });
}

function stopChaseMode() {
    isChasing = false;

    window.removeEventListener('mousemove', chaseButton);
    window.removeEventListener('touchmove', chaseButton);

    if (chasingButton) {
        chasingButton.classList.remove('moving', 'fixed-moving');

        // move it back into the wrapper and reset
        buttonWrapper.appendChild(chasingButton);
        chasingButton.style.position = '';
        chasingButton.style.left = 'unset';
        chasingButton.style.top = 'unset';
    }

    chasingButton = null;
}

// --- Event Listeners ---

// Main Love Button Click Handler
loveButton.addEventListener('click', () => {
    // Stop chasing if it's active
    if (isChasing) {
        stopChaseMode();
    }

    // Use local message generator
    dynamicMessage.classList.remove('revealed');

    // Animate heart color briefly
    iconContainer.style.fill = '#fca5a5';
    iconContainer.style.stroke = '#fca5a5';

    setTimeout(() => {
        dynamicMessage.textContent = getRandomMessage();
        dynamicMessage.classList.add('revealed');

        // Reset heart color
        setTimeout(() => {
            iconContainer.style.fill = iconOriginalFill;
            iconContainer.style.stroke = iconOriginalStroke;
        }, 200);

    }, 500);
});

// 'I don't love' Button Click Handler
dislikeButton.addEventListener('click', () => {
    // 1. Display the fixed message
    dynamicMessage.classList.remove('revealed');
    setTimeout(() => {
        dynamicMessage.textContent = "Oh please. Catch the running heart, my dear!";
        dynamicMessage.classList.add('revealed');
    }, 500);

    // 2. Start the main love button movement
    startChaseMode();
});

// Initialize Lucide icons
lucide.createIcons();

// Ensure the initial message is visible immediately on load
document.addEventListener('DOMContentLoaded', () => {
    dynamicMessage.classList.add('revealed');
});