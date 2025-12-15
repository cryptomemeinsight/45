document.addEventListener('DOMContentLoaded', () => {
    const rainContainer = document.createElement('div');
    rainContainer.id = 'rain-container';
    document.body.appendChild(rainContainer);

    // Number of raindrops per side
    const dropCount = 10; // 10 for each side

    // Left side rain (Binance)
    for (let i = 0; i < dropCount; i++) {
        createRainDrop(rainContainer, 'binance.png', 0, 50);
    }

    // Right side rain (Solana)
    for (let i = 0; i < dropCount; i++) {
        createRainDrop(rainContainer, 'solana.png', 50, 100);
    }

    // Generate Background Patterns
    createPattern('bg-left', '4');
    createPattern('bg-right', '5');

    // Tap Feature Logic
    const czImg = document.getElementById('cz-img');
    const tobyImg = document.getElementById('toby-img');
    const czCounter = document.getElementById('cz-counter');
    const tobyCounter = document.getElementById('toby-counter');
    const czBubble = document.getElementById('cz-bubble');
    const tobyBubble = document.getElementById('toby-bubble');

    let czCount = 0;
    let tobyCount = 0;
    
    // Random phrases for the speech bubble
    const painPhrases = [
        "Stop it!", 
        "It's hurting!", 
        "Ouch!", 
        "Have mercy!", 
        "Too much!", 
        "Pls stop", 
        "Why??",
        "No more!",
        "I'm dizzy!",
        "Bruh..."
    ];

    // Phrases for Shattered Mode
    const shatteredPhrases = [
        "Buy $45 or die poor",
        "Stop beating on me, I'm dead"
    ];

    // Bullying Conversations (Idle state)
    const czBullyPhrases = [
        "BNB is king, B!TCH!",
        "Solana crashes every day LMAO",
        "My chain actually works, SH!Tcoin",
        "Imagine using SOL in 2025 😂",
        "F#$K your congestion",
        "Binance > your trash chain",
        "Toly, 5 months left to bail?"
    ];

    const tobyBullyPhrases = [
        "SOL is faster, old man!",
        "Go to jail again, F#$KER!",
        "BNB is centralized TRASH",
        "Enjoy your prison food B!TCH",
        "Solana will flip BNB soon",
        "Nobody uses BSC anymore SH!T",
        "Why do you keep showing 4?"
    ];

    let idleInterval;
    let isInteracting = false;
    let interactionTimeout;
    let isResumingFromTap = false;
    let lastTappedCharacter = null;
    let hasGreeted = false;

    // Function to start the bullying conversation
    function startBullying() {
        // Clear any existing interval to prevent duplicates
        if (idleInterval) clearInterval(idleInterval);
        
        const triggerConversation = () => {
            if (isInteracting) return; // Don't talk if user is tapping
            
            // Resume logic: Force specific messages if resuming from interaction
            if (isResumingFromTap) {
                // Determine who complains based on who was tapped last
                if (lastTappedCharacter === 'cz') {
                    showBullyBubble(czBubble, "People are beating shit out me, Toly.");
                } else if (lastTappedCharacter === 'toby') {
                    showBullyBubble(tobyBubble, "People are beating shit out me, CZ.");
                } else {
                    // Fallback if random or unknown
                    const talker = Math.random() > 0.5 ? 'cz' : 'toby';
                    if (talker === 'cz') {
                        showBullyBubble(czBubble, "People are beating shit out me, Toly.");
                    } else {
                        showBullyBubble(tobyBubble, "People are beating shit out me, CZ.");
                    }
                }
                isResumingFromTap = false; // Reset flag
                return; // End this cycle
            }

            // Normal logic: Randomly pick who talks first
            const talker = Math.random() > 0.5 ? 'cz' : 'toby';
            
            if (talker === 'cz') {
                if (!hasGreeted) {
                    showBullyBubble(czBubble, "Hey, Toly");
                    hasGreeted = true;
                } else {
                    const phrase = czBullyPhrases[Math.floor(Math.random() * czBullyPhrases.length)];
                    showBullyBubble(czBubble, phrase);
                }
                
                // Toby responds after a delay
                setTimeout(() => {
                    if (isInteracting) return;
                    const response = tobyBullyPhrases[Math.floor(Math.random() * tobyBullyPhrases.length)];
                    showBullyBubble(tobyBubble, response);
                }, 2000);
            } else {
                if (!hasGreeted) {
                    showBullyBubble(tobyBubble, "Hey, CHENPENZAO");
                    hasGreeted = true;
                } else {
                    const phrase = tobyBullyPhrases[Math.floor(Math.random() * tobyBullyPhrases.length)];
                    showBullyBubble(tobyBubble, phrase);
                }
                
                // CZ responds after a delay
                setTimeout(() => {
                    if (isInteracting) return;
                    const response = czBullyPhrases[Math.floor(Math.random() * czBullyPhrases.length)];
                    showBullyBubble(czBubble, response);
                }, 2000);
            }
        };

        // Run immediately
        triggerConversation();
        
        // Then run periodically
        idleInterval = setInterval(triggerConversation, 5000); // New conversation every 5 seconds
    }

    function showBullyBubble(bubble, text) {
        // Clear any existing timeout
        if (bubble.hideTimeout) clearTimeout(bubble.hideTimeout);

        bubble.textContent = text;
        bubble.classList.add('bullying'); // Add yellow style
        bubble.classList.add('show');
        
        bubble.hideTimeout = setTimeout(() => {
            bubble.classList.remove('show');
            // Wait for transition to finish before removing class
            setTimeout(() => {
                // Only remove if it's still hidden (prevent race condition if shown again)
                if (!bubble.classList.contains('show')) {
                    bubble.classList.remove('bullying');
                }
            }, 300); 
        }, 3000);
    }

    // Reset interaction timer on tap
    function resetInteractionTimer() {
        isInteracting = true;
        hasGreeted = true; // Ensure greeting doesn't happen after interaction
        
        // Only hide bubbles if they are bullying bubbles (yellow ones)
        if (czBubble.classList.contains('bullying')) {
            czBubble.classList.remove('show');
            // Do NOT remove 'bullying' class immediately so it fades out as yellow
        }
        if (tobyBubble.classList.contains('bullying')) {
            tobyBubble.classList.remove('show');
            // Do NOT remove 'bullying' class immediately so it fades out as yellow
        }
        
        if (interactionTimeout) clearTimeout(interactionTimeout);
        
        interactionTimeout = setTimeout(() => {
            isInteracting = false;
            // Resume bullying immediately after timeout
            isResumingFromTap = true;
            startBullying();
        }, 2000); // Resume 2 seconds after last tap
    }

    // Start bullying initially
    startBullying();

    function showBubble(bubble, count) {
        // Clear any existing timeout to prevent premature hiding
        if (bubble.hideTimeout) {
            clearTimeout(bubble.hideTimeout);
        }

        // Special case for Shattered Mode (> 250)
        if (count > 250) {
            // Slow down changes: only update every 20 taps
            if (count % 20 === 0) {
                const randomShatteredPhrase = shatteredPhrases[Math.floor(Math.random() * shatteredPhrases.length)];
                bubble.textContent = randomShatteredPhrase;
                bubble.classList.add('show');
                
                // Keep visible for longer
                bubble.hideTimeout = setTimeout(() => {
                    bubble.classList.remove('show');
                }, 3000);
            }
            return;
        }

        // Show bubble every 10 taps starting from 20 (20, 30, 40...)
        if (count >= 20 && count % 10 === 0) {
            const randomPhrase = painPhrases[Math.floor(Math.random() * painPhrases.length)];
            bubble.textContent = randomPhrase;
            bubble.classList.remove('bullying'); // Ensure it's white
            bubble.classList.add('show');
            
            // Hide after 3 seconds
            bubble.hideTimeout = setTimeout(() => {
                bubble.classList.remove('show');
            }, 3000);
        }
    }

    function checkAngryMode(img, count, type) {
        // Phase 0: Annoyed (> 30)
        if (count > 30 && count <= 80) {
            img.classList.add('annoyed');
        }

        // Phase 1: Angry Mode (> 80)
        if (count > 80 && count <= 120) {
            img.classList.remove('annoyed');
            img.classList.add('angry');
        }
        
        // Phase 2: Super Angry (Change Image) (> 120)
        if (count > 120) {
            img.classList.add('angry'); // Keep vibrating/red
            if (type === 'cz' && !img.src.includes('cz%202.png')) {
                img.src = 'cz 2.png';
            } else if (type === 'toby' && !img.src.includes('toby%202.png')) {
                img.src = 'toby 2.png';
            }
        }
        
        // Phase 3: Shattered (> 250)
        if (count > 250) {
            img.classList.remove('angry'); // Remove regular angry to replace with shattered
            img.classList.add('shattered');
        }
    }

    function triggerTapAnimation(img) {
        img.classList.remove('tapped');
        void img.offsetWidth; // Trigger reflow to restart animation
        img.classList.add('tapped');
        setTimeout(() => {
            img.classList.remove('tapped');
        }, 100);
    }

    function handleTap(e, character) {
        // Prevent default behavior on touch to ensure instant response and avoid ghost clicks
        if (e.type === 'touchstart') {
            e.preventDefault();
        }

        resetInteractionTimer();

        if (character === 'cz') {
            lastTappedCharacter = 'cz';
            czCount++;
            czCounter.textContent = czCount;
            czCounter.classList.add('show');
            animateCounter(czCounter);
            if (e.type === 'touchstart') {
                triggerTapAnimation(czImg);
            }
            showBubble(czBubble, czCount);
            checkAngryMode(czImg, czCount, 'cz');
            // Add more drops to left side (increased density)
            for (let i = 0; i < 5; i++) {
                createRainDrop(rainContainer, 'binance.png', 0, 50);
            }
        } else if (character === 'toby') {
            lastTappedCharacter = 'toby';
            tobyCount++;
            tobyCounter.textContent = tobyCount;
            tobyCounter.classList.add('show');
            animateCounter(tobyCounter);
            if (e.type === 'touchstart') {
                triggerTapAnimation(tobyImg);
            }
            showBubble(tobyBubble, tobyCount);
            checkAngryMode(tobyImg, tobyCount, 'toby');
            // Add more drops to right side (increased density)
            for (let i = 0; i < 5; i++) {
                createRainDrop(rainContainer, 'solana.png', 50, 100);
            }
        }
    }

    // Add listeners for both click and touchstart
    czImg.addEventListener('click', (e) => handleTap(e, 'cz'));
    czImg.addEventListener('touchstart', (e) => handleTap(e, 'cz'), { passive: false });

    tobyImg.addEventListener('click', (e) => handleTap(e, 'toby'));
    tobyImg.addEventListener('touchstart', (e) => handleTap(e, 'toby'), { passive: false });

    function animateCounter(counter) {
        counter.classList.add('bump');
        setTimeout(() => {
            counter.classList.remove('bump');
        }, 100);
    }

    // Prevent right-click on images
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    // Loading Timer
    const loaderOverlay = document.getElementById('loader-overlay');
    const loadingText = document.getElementById('loading-text');
    const startTime = performance.now();

    // Update timer every 100ms
    const timerInterval = setInterval(() => {
        const currentTime = performance.now();
        const elapsedTime = ((currentTime - startTime) / 1000).toFixed(1);
        loadingText.textContent = `Loading: ${elapsedTime}s`;
    }, 100);

    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        clearInterval(timerInterval);
        const endTime = performance.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);
        loadingText.textContent = `Loaded in ${totalTime}s`;
        
        // Short delay to show the final time
        setTimeout(() => {
            loaderOverlay.classList.add('fade-out');
        }, 500);
    });
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const tooltip = document.querySelector('.copy-tooltip');
        tooltip.classList.add('show');
        
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function createPattern(containerId, text) {
    const container = document.getElementById(containerId);
    // Estimate number of tiles needed to cover the area
    // Increased count because tiles are smaller (tighter)
    const tileCount = 400; 

    for (let i = 0; i < tileCount; i++) {
        const span = document.createElement('span');
        span.classList.add('bg-tile');
        span.textContent = text;
        container.appendChild(span);
    }
}

function createRainDrop(container, imageSrc, minLeft, maxLeft) {
    const drop = document.createElement('img');
    drop.src = imageSrc;
    drop.classList.add('rain-drop');
    
    // Randomize starting position within range
    const range = maxLeft - minLeft;
    drop.style.left = (Math.random() * range + minLeft) + 'vw';
    
    // Randomize animation duration (speed)
    const duration = Math.random() * 5 + 5; // Between 5 and 10 seconds
    drop.style.animationDuration = duration + 's';
    
    // Randomize delay
    drop.style.animationDelay = Math.random() * 5 + 's';
    
    // Randomize size
    const size = Math.random() * 30 + 20; // Between 20px and 50px
    drop.style.width = size + 'px';
    
    container.appendChild(drop);
}
