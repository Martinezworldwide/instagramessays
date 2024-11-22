// Initialize QuillJS Editor
const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // Formatting buttons
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
            [{ 'align': [] }], // Alignment
            ['clean'] // Clear formatting
        ]
    }
});

// Handle Generate Squares Button Click
document.getElementById('generateSquares').addEventListener('click', () => {
    const content = quill.root.innerHTML.trim(); // Get content with formatting
    const squarePreview = document.getElementById('squarePreview');
    squarePreview.innerHTML = ''; // Clear previous squares

    if (!content) {
        alert("Please add some content to generate squares.");
        return;
    }

    const fontSize = 18; // Font size
    const lineHeight = 1.5; // Line height
    const squareHeight = 1080 - 100; // Adjust for padding
    const chunks = splitContent(content, fontSize, lineHeight, squareHeight);

    if (chunks.length === 0) {
        alert("No content to generate squares.");
        return;
    }

    chunks.forEach((chunk, index) => {
        createSquare(chunk, index);
    });
});

// Function to Split Content by Rendered Height
function splitContent(content, fontSize, lineHeight, maxHeight) {
    const div = document.createElement('div');
    div.style.visibility = 'hidden';
    div.style.position = 'absolute';
    div.style.width = '960px';
    div.style.fontSize = `${fontSize}px`;
    div.style.lineHeight = `${lineHeight}`;
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    div.style.textAlign = 'center';
    document.body.appendChild(div);

    const chunks = [];
    let currentChunk = '';
    let remainingContent = content.split(/\s+/); // Split content by words

    while (remainingContent.length > 0) {
        div.innerHTML = currentChunk + ' ' + remainingContent.join(' ');

        if (div.offsetHeight > maxHeight) {
            let lastFitIndex = 0;

            for (let i = 1; i <= remainingContent.length; i++) {
                div.innerHTML = currentChunk + ' ' + remainingContent.slice(0, i).join(' ');
                if (div.offsetHeight > maxHeight) {
                    lastFitIndex = i - 1;
                    break;
                }
            }

            currentChunk = remainingContent.slice(0, lastFitIndex).join(' ').trim();
            chunks.push(currentChunk);

            remainingContent = remainingContent.slice(lastFitIndex);
            currentChunk = '';
        } else {
            chunks.push(remainingContent.join(' ').trim());
            break;
        }
    }

    document.body.removeChild(div);
    return chunks;
}

// Function to Create Squares
function createSquare(content, index) {
    const square = document.createElement('div');
    square.classList.add('square');

    const text = document.createElement('div');
    text.classList.add('squareText');
    text.innerHTML = content;

    square.appendChild(text);
    document.getElementById('squarePreview').appendChild(square);
}
