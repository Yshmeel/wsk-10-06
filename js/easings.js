const easingContentTemplate = `
    <input type="checkbox" name="easing" value="{{name}}" id="easing-{{name}}" data-formula="{{formula}}"/>
    <label for="easing-{{name}}">
        {{name}}
    </label>
`;

const $listBlock = document.querySelector('.easings-list');
const $listItemsBlock = document.querySelector('.easings-list-items');
/** @type {HTMLCanvasElement} */
const $chartCanvas = document.getElementById('chart-canvas');

const progressSlider = document.getElementById('easing-slider')

// holds active timing formula
// by default linear set up
let activeTimings = [];

const DURATION = 3000;

const LEFT_BORDER_SPACING = 1;
const RIGHT_BORDER_SPACING = 1;

const POINT_WIDTH = 3;
const POINT_HEIGHT = 3;

let canvasWidth = 0;
let canvasHeight = 0;

// gets timing result for animation purposes
const timing = (formula, t) => {
    return eval(`
        let t = ${t};
        (${formula})
    `.trim());
};

/** @param {CanvasRenderingContext2D} ctx */
const drawCurve = (ctx, formula) => {
    const width = getCanvasWidth() - 10;
    const height = getCanvasHeight() - 10;

    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(
        width * 0,
        height * timing(formula, 0)
    );
    
    // .001 is point per line. make line look :sparkles: smooth :sparkles:
    for (let x = .001; x < 1; x += .001) {
        const y = timing(formula, x);
        
        ctx.lineTo(
            width * x,
            height * y
        );
    }
    
    ctx.lineTo(
        width * 1,
        height * timing(formula, 1)
    );
};

// Get canvas width from cached variable
const getCanvasWidth = () => {
    return canvasWidth;
};

// Get canvas height from cached variable
const getCanvasHeight = () => {
    return canvasHeight;
};

// Sets canvas size after resize/or page start
const setRealCanvasSize = () => {
    canvasWidth = $chartCanvas.offsetWidth;
    canvasHeight = $chartCanvas.offsetHeight;
};

const draw = () => {
    const ctx = $chartCanvas.getContext('2d');

    const w = getCanvasWidth();
    const h = getCanvasHeight();

    $chartCanvas.width = w;
    $chartCanvas.height = h;

    ctx.width = w;
    ctx.height = h;

    ctx.transform(1, 0, 0, -1, 0, h);

    // Rotate canvas
    ctx.lineWidth = 4;

    activeTimings.forEach((formula) => {
        ctx.beginPath();
        drawCurve(ctx, formula);
        ctx.stroke();
    });
};

const timingProgressToSliderValue = (progress) => {
    return progress * 100;
};

// Set active timing to variable and draw canvas
const toggleActiveTiming = (formula) => {
    if(activeTimings.includes(formula)) {
        activeTimings = activeTimings.filter((v) => v !== formula);
    } else {
        activeTimings.push(formula);
    }

    draw();
};

// Bind all timing radios events
const bindTimingEvent = (element) => {
    element.querySelector('input').addEventListener('change', function(e) {
        toggleActiveTiming(e.target.dataset.formula);
    });
};

const render = (easings) => {
    // rendering easings list
    Object.keys(easings).forEach((e, i) => {
        const item = easings[e];

        const element = document.createElement('div');
        element.classList.add("easings-list__item");
        element.innerHTML = easingContentTemplate
            .replaceAll("{{name}}", item.text)
            .replaceAll("{{formula}}", item.equation);

        $listItemsBlock.append(element);
        bindTimingEvent(element);
    });

    setRealCanvasSize();

    window.addEventListener('resize', () => {
   
        draw();
    });
};

window.easings = {
    render,
    draw
};

