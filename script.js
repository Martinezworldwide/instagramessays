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
    const content = quill.root.innerHTML.trim(); // Get the formatted content
    const squarePreview = document.getElementById('squarePreview');
    squarePreview.innerHTML = ''; // Clear previous squares

    if (!content) {
        alert("Please add some content to generate squares.");
        return;
    }

    const maxCharsPerSquare = 700; // Adjust based on text size
    const chunks = splitContent(content, maxCharsPerSquare); // Split text into chunks

    if (chunks.length === 0) {
        alert("No content to generate squares.");
        return;
    }

    chunks.forEach((chunk, index) => {
        createSquare(chunk, index); // Generate squares for each chunk
    });
});

// Function to Split Content into Smaller Chunks
function splitContent(content, maxChars) {
    const div = document.createElement('div');
    div.innerHTML = content;
    const chunks = [];
    let currentChunk = '';

    Array.from(div.childNodes).forEach(node => {
        const nodeHtml = node.outerHTML || node.textContent;
        if (currentChunk.length + nodeHtml.length > maxChars) {
            chunks.push(currentChunk);
            currentChunk = nodeHtml;
        } else {
            currentChunk += nodeHtml;
        }
    });

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

// Function to Create an Individual Square
function createSquare(content, index) {
    const squareContainer = document.createElement('div');
    squareContainer.classList.add('squareContainer');
    squareContainer.innerHTML = content;

    // Append square to the preview section
    const squarePreview = document.getElementById('squarePreview');
    squarePreview.appendChild(squareContainer);

    // Convert squareContainer to canvas
    html2canvas(squareContainer).then(canvas => {
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
