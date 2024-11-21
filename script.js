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

// Generate Squares Button
document.getElementById('generateButton').addEventListener('click', () => {
    const delta = quill.getContents(); // Get content and formatting
    const plainText = quill.getText(); // Get plain text for splitting
    const maxCharsPerSquare = 300; // Adjust for text size
    const words = plainText.split(' ');
    const imagePreview = document.getElementById('imagePreview');
    const downloadButton = document.getElementById('downloadAllButton');
    imagePreview.innerHTML = '';

    let currentText = '';
    let squareCount = 0;

    words.forEach((word, index) => {
        if ((currentText + word).length > maxCharsPerSquare || index === words.length - 1) {
            if (index === words.length - 1) currentText += ' ' + word;
            squareCount++;
            createSquare(currentText, delta, squareCount);
            currentText = '';
        }
        currentText += (currentText ? ' ' : '') + word;
    });

    downloadButton.style.display = squareCount > 0 ? 'block' : 'none';
});

// Create a Square with Text and Formatting
function createSquare(text, delta, count) {
    const canvas = document.createElement('canvas');
    const size = 1080; // Instagram square size
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Apply text formatting
    ctx.font = '24px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';

    const lines = wrapText(ctx, text, size - 40);
    lines.forEach((line, i) => {
        ctx.fillText(line, size / 2, 100 + i * 30);
    });

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('imageContainer');
    imageContainer.appendChild(canvas);

    const imagePreview = document.getElementById('imagePreview');
    imagePreview.appendChild(imageContainer);
}

// Text Wrapping Function
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });

    lines.push(currentLine.trim());
    return lines;
}

// Download All Images Button
document.getElementById('downloadAllButton').addEventListener('click', () => {
    const canvases = document.querySelectorAll('#imagePreview canvas');
    const zip = new JSZip();

    canvases.forEach((canvas, i) => {
        const imgData = canvas.toDataURL('image/png').split(',')[1];
        zip.file(`square_${i + 1}.png`, imgData, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
        saveAs(content, 'squares.zip');
    });
});

