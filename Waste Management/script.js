// ===============================
// SAFE DOM READY + PERFECT GREEN CLICK
// ===============================

const onReady = fn =>
    document.readyState === "loading"
        ? document.addEventListener("DOMContentLoaded", fn)
        : fn();

onReady(() => {

    // Entrance animation (NO vertical shift)
    gsap.from(".portal-card", {
    scale: 0.95,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out"
});

    // Real-time CO₂ counter (SAFE FIX)
    document.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("co2-counter");
    if (!counter) return;

    let value = 420.90; // Current approx global CO2 ppm
    const increasePerSecond = 0.000000079;

    function update() {
        value += increasePerSecond;
        counter.textContent = value.toFixed(5);
    }

    setInterval(update, 1000);
});


    // PERFECT GREEN CLICK + NAVIGATION
    const cards = document.querySelectorAll('.portal-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            this.classList.add('glow-green');
            
           gsap.to(this, {
    scale: 1.05,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut"
});

            
            const portal = this.dataset.portal;

            if (portal) {
                setTimeout(() => {
                    switch(portal) {
                        case 'citizen':
                            location.href = 'citizen.html';
                            break;
                        case 'municipal':
                            location.href = 'municipal-login.html';
                            break;
                        case 'driver':
                            location.href = 'driver-login.html';
                            break;
                    }
                }, 200);
            }

            setTimeout(() => {
                this.classList.remove('glow-green');
            }, 800);
        });
    });

});
