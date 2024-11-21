document.getElementById('generateButton').addEventListener('click', () => {
    const text = document.getElementById('essayInput').value;
    if (!text.trim()) {
        alert('Please enter some text to generate images.');
        return;
    }

    const maxCharsPerImage = 900; // Adjust this to fit more or fewer characters per image
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = ''; // Clear previous images

    const chunks = splitTextIntoChunks(text, maxCharsPerImage);

    chunks.forEach((chunk, index) => {
        createImage(chunk, index);
    });
});

// Split text into manageable chunks
function splitTextIntoChunks(text, maxChars) {
    const words = text.split(' ');
    const chunks = [];
    let currentChunk = '';

    words.forEach(word => {
        if ((currentChunk + word).length > maxChars) {
            chunks.push(currentChunk.trim());
            currentChunk = word + ' ';
        } else {
            currentChunk += word + ' ';
        }
    });

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

// Create an image from a text chunk
function createImage(text, index) {
    const canvas = document.createElement('canvas');
    const size = 1080; // Instagram square size
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // Background color
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#000000'; // Text color
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Split text into lines
    const lineHeight = 30;
    const maxWidth = size - 100;
    const lines = wrapText(ctx, text, maxWidth);

    // Draw text lines on the canvas
    lines.forEach((line, i) => {
        ctx.fillText(line, size / 2, 50 + i * lineHeight);
    });

    // Add canvas to the page
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('imageContainer');

    imageContainer.appendChild(canvas);

    // Add download button
    const downloadButton = document.createElement('a');
    downloadButton.classList.add('downloadButton');
    downloadButton.textContent = 'Download Image';
    downloadButton.href = canvas.toDataURL('image/png');
    downloadButton.download = `image_${index + 1}.png`;

    imageContainer.appendChild(downloadButton);
    document.getElementById('imagePreview').appendChild(imageContainer);
}

// Wrap text for canvas
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

    if (currentLine.trim()) {
        lines.push(currentLine.trim());
    }

    return lines;
}

