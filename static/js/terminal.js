function typeText(text, element, speed = 15) {
    element.innerHTML = "";
    let i = 0;

    const interval = setInterval(() => {
        element.innerHTML += text[i];
        i++;

        if (i >= text.length) {
            clearInterval(interval);
        }
    }, speed);
}
