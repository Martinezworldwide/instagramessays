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

// Template Selector Logic
const templateSelector = document.getElementById('template');
const container = document.querySelector('.container');

templateSelector.addEventListener('change', (e) => {
    const selectedTemplate = e.target.value;

    // Remove previous templates
    container.classList.remove('gradient', 'solid', 'pattern');

    // Add the selected template
    if (selectedTemplate === 'gradient') {
        container.classList.add('gradient');
    } else if (selectedTemplate === 'solid') {
        container.classList.add('solid');
    } else if (selectedTemplate === 'pattern') {
        container.classList.add('pattern');
    }
});
