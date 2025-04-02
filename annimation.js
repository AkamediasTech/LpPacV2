document.addEventListener("DOMContentLoaded", function () {
    const stats = document.querySelectorAll(".stats h3");
    let animationQueue = [];  // File pour gérer les animations dans l'ordre
    let isAnimating = false;  // Pour vérifier si une animation est déjà en cours

    // Stocker la valeur originale et initialiser à 0
    stats.forEach(stat => {
        stat.setAttribute("data-value", stat.innerText); // Stocke la valeur originale
        stat.innerText = "0"; // Initialise à 0
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.boundingClientRect.top <= window.innerHeight && entry.isIntersecting) {
                // Ajouter l'élément à la file d'attente si il devient visible
                animationQueue.push(entry.target);
                observer.unobserve(entry.target);  // Arrêter d'observer l'élément une fois qu'il est animé

                // Si aucune animation n'est en cours, commencer la première animation
                if (!isAnimating) {
                    startNextAnimation();
                }
            }
        });
    }, { threshold: 0 });

    stats.forEach(stat => observer.observe(stat));

    // Fonction pour traiter les éléments dans l'ordre avec un délai entre chaque animation
    function startNextAnimation() {
        if (animationQueue.length > 0) {
            isAnimating = true;  // Indiquer qu'une animation est en cours
            const currentElement = animationQueue.shift();  // Prendre le premier élément de la file d'attente
            let targetValue = currentElement.getAttribute("data-value");
            if (targetValue) {
                animateNumbers(currentElement, targetValue, () => {
                    // Quand l'animation est terminée, traiter l'élément suivant après 500ms
                    setTimeout(() => {
                        isAnimating = false;  // Réinitialiser l'indicateur d'animation
                        startNextAnimation();  // Démarrer l'animation suivante
                    }, 200); // Attendre 500ms avant de traiter l'élément suivant
                });
            }
        }
    }

    // Fonction pour animer le nombre
    function animateNumbers(element, targetValue, callback) {
        let target = parseInt(targetValue.replace('%', ''));
        let isPercentage = targetValue.includes('%');
        let count = 0;
        let steps = 50; // Augmenter le nombre d'étapes pour ralentir l'animation
        let increment = Math.ceil(target / steps);
        let speed = 20; // Augmenter l'intervalle de temps pour ralentir l'animation

        function updateNumber() {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(interval);
                if (callback) callback();
            }
            element.innerText = count + (isPercentage ? '%' : '');
        }

        let interval = setInterval(updateNumber, speed);
    }
});
