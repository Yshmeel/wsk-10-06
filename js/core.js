const $backToTop = document.querySelector('.back-to-top');
const $aboutOverlay = document.querySelector('.about-overlay');

// All easings stored at @root/easings.json
// Place your easings in format
/**
{
    "easingFunctions": {
        "linear": {
            "name": "linear",
            "equation": "t"
        }
    }
} 
*/
const fetchEasings = async () => {
    const response = await fetch("/easings.json");
    const json = response.json();
    return (await json)?.easingFunctions;
};


const toggleAbout = () => {
    $aboutOverlay.classList.remove('activing');
    $aboutOverlay.classList.remove('disappearing');

    if(!$aboutOverlay.classList.contains('active')) {
        $aboutOverlay.classList.add('activing');

        setTimeout(() => {
            $aboutOverlay.classList.remove('activing');
            $aboutOverlay.classList.add('active');
        }, 300);
    } else {
        $aboutOverlay.classList.add('disappearing');

        setTimeout(() => {
            $aboutOverlay.classList.remove('active');
        }, 300);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const easings = await fetchEasings();
    console.log(easings);

    window.easings.render(easings);
    window.easings.draw();

    Array.from(document.querySelectorAll('.range')).forEach((e) => {
        const $input = e.querySelector('input');
        const $span = e.querySelector('span');

        $input.addEventListener('input', function(e) {
            $span.innerHTML = e.target.value;
        });
    });

    $backToTop.querySelector('span')
        .addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

    window.addEventListener('scroll', (e) => {
        if(document.querySelector('html').scrollTop > 1) {
            $backToTop.classList.add('active');
        } else {
            $backToTop.classList.remove('active');
        }
    });

    Array.from(document.querySelectorAll('.toggle-about')).forEach((e) => {
        e.addEventListener('click', toggleAbout);
    });
});
