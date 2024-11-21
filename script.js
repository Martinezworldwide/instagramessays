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
document.getElementById('generateButton').addEventListener('click', () => {
    const content = quill.root.innerText.trim(); // Get plain text content
    const squarePreview = document.getElementById('squarePreview');
    squarePreview.innerHTML = ''; // Clear previous squares

    if (!content) {
        alert("Please add some content to generate squares.");
        return;
    }

    const maxLinesPerSquare = 15; // Maximum number of lines per square
    const lineHeight = 1.5; // Line height multiplier
    const fontSize = 32; // Font size in pixels

    // Calculate how many characters fit per square
    const maxCharsPerLine = Math.floor(1080 / (fontSize * 0.6)); // Approximate characters per line
    const maxCharsPerSquare = maxCharsPerLine * maxLinesPerSquare;

    const chunks = splitContent(content, maxCharsPerLine, maxLinesPerSquare); // Split text into chunks

    if (chunks.length === 0) {
        alert("No content to generate squares.");
        return;
    }

    chunks.forEach((chunk, index) => {
        createSquare(chunk, index); // Generate squares for each chunk
    });
});

// Function to Split Content into Smaller Chunks
function splitContent(content, maxCharsPerLine, maxLinesPerSquare) {
    const words = content.split(' '); // Split content into words
    const chunks = [];
    let currentChunk = '';
    let currentLine = 0;

    words.forEach(word => {
        const testLine = currentChunk + word + ' ';
        const lineChars = testLine.length;

        if (lineChars / maxCharsPerLine > 1) {
            // If the current line exceeds max characters
            currentLine++;

            if (currentLine >= maxLinesPerSquare) {
                chunks.push(currentChunk.trim()); // Add the chunk to the list
                currentChunk = ''; // Start a new chunk
                currentLine = 0; // Reset line count
            }
        }

        currentChunk += word + ' ';
    });

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim()); // Add any remaining content
    }

    return chunks;
}

// Function to Create an Individual Square
function createSquare(content, index) {
    const squareContainer = document.createElement('div');
    squareContainer.classList.add('squareContainer');

    // Add text container inside the square
    const textContainer = document.createElement('div');
    textContainer.classList.add('squareText');
    textContainer.textContent = content;

    squareContainer.appendChild(textContainer);

    // Append square to the preview section
    const squarePreview = document.getElementById('squarePreview');
    squarePreview.appendChild(squareContainer);

    // Convert squareContainer to canvas
    html2canvas(squareContainer, {
        width: 1080,
        height: 1080,
        scale: 2, // Higher resolution for better quality
    }).then(canvas => {
        squareContainer.innerHTML = ''; // Clear inner content
        squareContainer.appendChild(canvas);

        // Add download button
        const downloadButton = document.createElement('a');
        downloadButton.classList.add('downloadButton');
        downloadButton.textContent = 'Download';
        downloadButton.href = canvas.toDataURL('image/png');
        downloadButton.download = `square_${index + 1}.png`;

        squareContainer.appendChild(downloadButton);
    }).catch(err => {
        console.error("Error generating square:", err);
    });
}
