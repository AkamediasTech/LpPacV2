let index = 0;
const images = document.querySelectorAll(".carousel-images img");
const totalImages = images.length;
const visibleImages = 3;
const dots = document.querySelectorAll(".dot");

function updateCarousel() {
    const offset = -index * 332;
    document.getElementById("carouselImages").style.transform = `translateX(${offset}px)`;
    updateDots();
}

function nextSlide() {
    if (index < totalImages - visibleImages) {
        index++;
    } else {
        index = 0;
    }
    updateCarousel();
}

function prevSlide() {
    if (index > 0) {
        index--;
    } else {
        index = totalImages - visibleImages;
    }
    updateCarousel();
}

function updateDots() {
    const activeDot = document.querySelector(".dot.focusDot");
    if (activeDot) activeDot.classList.remove("focusDot");
    dots[index % dots.length].classList.add("focusDot");
}