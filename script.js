// Initialize QuillJS Editor
const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'], // Basic formatting
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
            [{ 'align': [] }], // Alignment
            ['clean'] // Clear formatting
        ]
    }
});

// Handle Generate Page Button Click
document.getElementById('generatePage').addEventListener('click', () => {
    const imageInput = document.getElementById('imageUpload');
    const content = quill.root.innerHTML.trim(); // Get formatted content
    const outputPage = document.getElementById('outputPage');
    outputPage.innerHTML = ''; // Clear previous content

    // Add uploaded image at the top if provided
    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = document.createElement('img');
            img.src = event.target.result; // Use the file's data URL
            img.alt = 'Uploaded Banner';
            outputPage.insertBefore(img, outputPage.firstChild); // Add image at the top
        };

        reader.readAsDataURL(file);
    }

    const sanitizedContent = sanitizeQuillHTML(content); // Sanitize HTML content

    // Add sanitized content
    const textContent = document.createElement('div');
    textContent.innerHTML = sanitizedContent;
    outputPage.appendChild(textContent);
});

// Function to Sanitize Quill HTML Content
function sanitizeQuillHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;

    // Remove unnecessary classes and styles
    const elements = div.querySelectorAll('*');
    elements.forEach(el => {
        el.removeAttribute('class');
        el.removeAttribute('style');
    });

    return div.innerHTML; // Return clean HTML
}

