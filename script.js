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

    // Log content for debugging
    console.log("Content to process:", content);

    createSquare(content, 0); // Generate a single square for now
});

// Function to Create an Individual Square
function createSquare(content, index) {
    const squareContainer = document.createElement('div');
    squareContainer.classList.add('squareContainer');
    squareContainer.innerHTML = content;

    // Convert to canvas
    html2canvas(squareContainer).then(canvas => {
        // Clear the container and replace it with the canvas
        squareContainer.innerHTML = '';
        squareContainer.appendChild(canvas);

        // Add a download button
        const downloadButton = document.createElement('a');
        downloadButton.classList.add('downloadButton');
        downloadButton.textContent = 'Download';
        downloadButton.href = canvas.toDataURL('image/png');
        downloadButton.download = `square_${index + 1}.png`;

        squareContainer.appendChild(downloadButton);
        document.getElementById('squarePreview').appendChild(squareContainer);
    }).catch(err => {
        console.error("Error generating square:", err);
    });
}