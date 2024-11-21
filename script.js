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
    const downloadButton = document.getElementById('downloadAllButton');
    imagePreview.innerHTML = '';

    chunks.forEach((chunk, index) => {
        createSquare(chunk, index);
    });

    downloadButton.style.display = chunks.length > 0 ? 'block' : 'none';
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
        imageContainer.appendChild(canvas);

        document.getElementById('imagePreview').appendChild(imageContainer);
    });
}

// Download all images as a ZIP file
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

