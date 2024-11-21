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

// Event Listener for "Generate Images"
document.getElementById('generateButton').addEventListener('click', () => {
    const content = quill.root.innerHTML; // Get the formatted content
    const maxLength = 1200; // Maximum characters per image
    const chunks = splitContent(content, maxLength); // Split content into manageable chunks
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = ''; // Clear previous images

    chunks.forEach((chunk, index) => {
        createImage(chunk, index); // Generate images for each chunk
    });
});

// Function to Split Content into Chunks
function splitContent(html, maxLength) {
    const div = document.createElement('div');
    div.innerHTML = html;
    const chunks = [];
    let currentChunk = '';

    Array.from(div.childNodes).forEach(node => {
        const nodeHtml = node.outerHTML || node.textContent;
        if (currentChunk.length + nodeHtml.length > maxLength) {
            chunks.push(currentChunk);
            currentChunk = nodeHtml;
        } else {
            currentChunk += nodeHtml;
        }
    });

    if (currentChunk) chunks.push(currentChunk);
    return chunks;
}

// Function to Create an Image for a Chunk
function createImage(content, index) {
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
        downloadButton.download = `image_${index + 1}.png`;
        imageContainer.appendChild(downloadButton);

        // Append to the preview
        document.getElementById('imagePreview').appendChild(imageContainer);
    });
}

