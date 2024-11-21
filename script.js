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

    const maxHeight = 1080; // Instagram square height in pixels
    const fontSize = 18; // Font size optimized for Instagram
    const lineHeight = 1.5; // Line spacing for readability

    // Split content into chunks based on rendered height
    const chunks = splitContentByHeight(content, fontSize, lineHeight, maxHeight);

    if (chunks.length === 0) {
        alert("No content to generate squares.");
        return;
    }

    chunks.forEach((chunk, index) => {
        createSquare(chunk, index, fontSize, lineHeight); // Generate squares for each chunk
    });
});

// Function to Split Content by Rendered Height
function splitContentByHeight(content, fontSize, lineHeight, maxHeight) {
    const div = document.createElement('div');
    div.style.visibility = 'hidden';
    div.style.position = 'absolute';
    div.style.width = '1080px';
    div.style.fontSize = `${fontSize}px`;
    div.style.lineHeight = `${lineHeight}`;
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    document.body.appendChild(div);

    const chunks = [];
    let currentChunk = '';
    let remainingContent = content;

    while (remainingContent) {
        div.innerHTML = currentChunk + remainingContent;

        if (div.offsetHeight > maxHeight) {
            // Find the point where the content fits
            let lastFit = currentChunk.length;

            for (let i = currentChunk.length; i < div.innerHTML.length; i++) {
                div.innerHTML = remainingContent.slice(0, i);
                if (div.offsetHeight > maxHeight) {
                    break;
                }
                lastFit = i;
            }

            // Add the current fitting chunk
            currentChunk = remainingContent.slice(0, lastFit).trim();
            chunks.push(currentChunk);

            // Update remaining content
            remainingContent = remainingContent.slice(lastFit).trim();
            currentChunk = '';
        } else {
            // Add all remaining content as the last chunk
            chunks.push(remainingContent.trim());
            break;
        }
    }

    document.body.removeChild(div); // Clean up the measurement div
    return chunks;
}

// Function to Create an Individual Square
function createSquare(content, index, fontSize, lineHeight) {
    const squareContainer = document.createElement('div');
    squareContainer.classList.add('squareContainer');

    // Add text container inside the square
    const textContainer = document.createElement('div');
    textContainer.classList.add('squareText');
    textContainer.innerHTML = content; // Use HTML content with formatting
    textContainer.style.fontSize = `${fontSize}px`;
    textContainer.style.lineHeight = `${lineHeight}`;

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
