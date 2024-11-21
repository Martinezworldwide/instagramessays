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

document.getElementById('generateButton').addEventListener('click', () => {
    const content = quill.root.innerHTML; // Get HTML content
    const maxLength = 900; // Max characters per square
    const chunks = splitText(content, maxLength);
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';

    chunks.forEach((chunk, index) => {
        createSquare(chunk, index);
    });
});

// Split text into chunks while preserving formatting
function splitText(html, maxLength) {
    const div = document.createElement('div');
    div.innerHTML = html;
    const textChunks = [];
    let currentChunk = '';

    Array.from(div.childNodes).forEach(node => {
        const nodeHtml = node.outerHTML || node.textContent;
        if (currentChunk.length + nodeHtml.length > maxLength) {
            textChunks.push(currentChunk);
            currentChunk = nodeHtml;
        } else {
            currentChunk += nodeHtml;
        }
    });

    if (currentChunk) textChunks.push(currentChunk);
    return textChunks;
}

// Create a square with HTML content
function createSquare(content, index) {
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

        // Add canvas to container
        imageContainer.appendChild(canvas);

        // Create download button
        const downloadButton = document.createElement('a');
        downloadButton.classList.add('downloadButton');
        downloadButton.textContent = 'Download';
        downloadButton.href = canvas.toDataURL('image/png');
        downloadButton.download = `square_${index + 1}.png`;

        imageContainer.appendChild(downloadButton);
        document.getElementById('imagePreview').appendChild(imageContainer);
    });
}
