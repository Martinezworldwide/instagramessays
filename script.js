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
    const content = quill.root.innerHTML.trim(); // Get full HTML content with formatting
    const squarePreview = document.getElementById('squarePreview');
    squarePreview.innerHTML = ''; // Clear previous squares

    if (!content) {
        alert("Please add some content to generate squares.");
        return;
    }

    const fontSize = 18; // Font size optimized for Instagram
    const lineHeight = 1.5; // Line spacing for readability
    const maxLinesPerSquare = 30; // Adjusted lines to fit more content

    // Approximate maximum characters per line and square
    const maxCharsPerLine = Math.floor(1080 / (fontSize * 0.6));
    const maxCharsPerSquare = maxCharsPerLine * maxLinesPerSquare;

    const chunks = splitContent(content, maxCharsPerSquare); // Split text into chunks

    if (chunks.length === 0) {
        alert("No content to generate squares.");
        return;
    }

    chunks.forEach((chunk, index) => {
        createSquare(chunk, index, fontSize, lineHeight); // Generate squares for each chunk
    });
});

// Function to Split Content into Smaller Chunks
function splitContent(content, maxCharsPerSquare) {
    const div = document.createElement('div');
    div.innerHTML = content;

    const chunks = [];
    let currentChunk = '';
    let currentLength = 0;

    Array.from(div.childNodes).forEach(node => {
        const nodeHtml = node.outerHTML || node.textContent;
        const nodeLength = nodeHtml.length;

        if (currentLength + nodeLength > maxCharsPerSquare) {
            chunks.push(currentChunk.trim());
            currentChunk = nodeHtml;
            currentLength = nodeLength;
        } else {
            currentChunk += nodeHtml;
            currentLength += nodeLength;
        }
    });

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

// Function to Create an Individual Square
function createSquare(content, index, fontSize, lineHeight) {
    const squareContainer = document.createElement('div');
    squareContainer.classList.add('squareContainer');

    // Add customization options
    const textContainer = document.createElement('div');
    textContainer.classList.add('squareText');
    textContainer.innerHTML = content; // Use HTML content with formatting
    textContainer.style.fontSize = `${fontSize}px`;
    textContainer.style.lineHeight = `${lineHeight}`;
    textContainer.style.textAlign = 'center'; // Center-align text
    textContainer.style.color = '#ffffff'; // Default font color (white)
    textContainer.style.margin = 'auto'; // Center vertically

    squareContainer.style.backgroundColor = '#007BFF'; // Default background color
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
