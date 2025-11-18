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

    // Prevent scrolling on touch devices during the chase
    if (event.type === 'touchmove') {
        event.preventDefault();
    }

    // Get client coordinates, preferring touch over mouse
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;

    if (clientX === undefined || clientY === undefined) return;

    const wrapperRect = buttonWrapper.getBoundingClientRect();
    const buttonRect = loveButton.getBoundingClientRect();

    // Input coordinates relative to the wrapper
    const inputX = clientX - wrapperRect.left;
    const inputY = clientY - wrapperRect.top;

    // Button center coordinates relative to the wrapper
    const buttonCenterX = parseFloat(loveButton.style.left) + buttonRect.width / 2;
    const buttonCenterY = parseFloat(loveButton.style.top) + buttonRect.height / 2;

    const distance = Math.sqrt(
        Math.pow(inputX - buttonCenterX, 2) + Math.pow(inputY - buttonCenterY, 2)
    );

    const chaseRadius = 150;
    if (distance < chaseRadius) {
        // Calculate the direction vector away from the input
        const angle = Math.atan2(buttonCenterY - inputY, buttonCenterX - inputX);
        const step = 80;

        let newX = buttonCenterX + Math.cos(angle) * step - buttonRect.width / 2;
        let newY = buttonCenterY + Math.sin(angle) * step - buttonRect.height / 2;

        // Clamp the position to keep the button fully inside the wrapper
        newX = Math.max(0, Math.min(newX, wrapperRect.width - buttonRect.width));
        newY = Math.max(0, Math.min(newY, wrapperRect.height - buttonRect.height));

        loveButton.style.left = `${newX}px`;
        loveButton.style.top = `${newY}px`;
    }
}

function startChaseMode() {
    isChasing = true;

    // 1. Position the button absolutely
    loveButton.classList.add('moving');

    // Calculate initial center position based on the wrapper's dimensions
    const wrapperRect = buttonWrapper.getBoundingClientRect();
    const buttonRect = loveButton.getBoundingClientRect();

    // Center the button initially
    loveButton.style.left = `${(wrapperRect.width - buttonRect.width) / 2}px`;
    loveButton.style.top = `${(wrapperRect.height - buttonRect.height) / 2}px`;

    // 2. Hide the dislike button
    dislikeButton.classList.add('hidden');

    // 3. Register the continuous chasing logic for both mouse and touch
    buttonWrapper.addEventListener('mousemove', chaseButton);
    buttonWrapper.addEventListener('touchmove', chaseButton, { passive: false });
}

function stopChaseMode() {
    isChasing = false;

    // 1. Remove listeners
    buttonWrapper.removeEventListener('mousemove', chaseButton);
    buttonWrapper.removeEventListener('touchmove', chaseButton);

    // 2. Reset position and appearance
    loveButton.classList.remove('moving');
    loveButton.style.left = 'unset';
    loveButton.style.top = 'unset';

    // 3. Bring back the 'I don't love' button
    dislikeButton.classList.remove('hidden');
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

