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

// Handle Generate Images Button Click
document.getElementById('generateButton').addEventListener('click', () => {
    const content = quill.root.innerHTML; // Get the formatted content
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = ''; // Clear any previous images

    // Create and render image
    createImage(content);
});

// Function to Create Image from Content
function createImage(content) {
    const container = document.createElement('div');
    container.innerHTML = content;
    container.style.width = '1080px';
    container.style.height = '1080px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.padding = '50px';
    container.style.boxSizing = 'border-box';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '24px';
    container.style.lineHeight = '1.5';
    container.style.textAlign = 'center';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    // Convert the container to an image
    html2canvas(container).then(canvas => {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('imageContainer');

        // Add the canvas
        imageContainer.appendChild(canvas);

        // Add the download button
        const downloadButton = document.createElement('a');
        downloadButton.classList.add('downloadButton');
        downloadButton.textContent = 'Download Image';
        downloadButton.href = canvas.toDataURL('image/png');
        downloadButton.download = `image.png`;
        imageContainer.appendChild(downloadButton);

        // Append to the preview area
        document.getElementById('imagePreview').appendChild(imageContainer);
    });
}

