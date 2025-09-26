// References
const slides = document.querySelectorAll('.myswiper2 .swiper-slide');
const editPanel = document.querySelector('.edit-panel-right');

let currentSlide = null;

// Build panel
editPanel.innerHTML = `
  <button id="addTextBtn">Add Text</button>
  <button id="addImageBtn">Add Image</button>
  <select id="fontSelect">
    <option value="Arial">Arial</option>
    <option value="Times New Roman">Times New Roman</option>
    <option value="Roboto">Roboto</option>
    <option value="Courier New">Courier New</option>
  </select>
`;

// Show panel on slide click
slides.forEach(slide => {
  slide.addEventListener('click', (e) => {
    currentSlide = slide;
    editPanel.style.display = 'flex';
    e.stopPropagation();
  });
});

// Add Text
document.getElementById('addTextBtn').addEventListener('click', () => {
  if (!currentSlide) return;

  const div = document.createElement('div');
  div.contentEditable = true;
  div.classList.add('editable');
  div.style.top = '20px';
  div.style.left = '20px';
  div.style.fontFamily = document.getElementById('fontSelect').value; // initial font
  div.innerText = 'Editable Text';

  currentSlide.appendChild(div);
  makeDraggable(div);
});

// Add Image
document.getElementById('addImageBtn').addEventListener('click', () => {
  if (!currentSlide) return;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.click();

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(ev) {
      const div = document.createElement('div');
      div.classList.add('editable');
      div.style.top = '20px';
      div.style.left = '20px';
      div.style.width = '100px';
      div.style.height = '100px';

      const img = document.createElement('img');
      img.src = ev.target.result;
      div.appendChild(img);
      currentSlide.appendChild(div);

      makeDraggable(div);
    };
    reader.readAsDataURL(file);
  };
});

// Font change dropdown
const fontSelect = document.getElementById('fontSelect');
fontSelect.addEventListener('change', () => {
  const selected = document.querySlector('.editable.selected');
  if (selected) {
    selected.style.fontFamily = fontSelect.value;

    // Force browser to re-render typed text
    const text = selected.innerText;
    selected.innerText = '';
    selected.innerText = text;
    selected.focus();
  }
});

// Draggable, deletable, selectable elements
function makeDraggable(el) {
  // Select element
  el.addEventListener('click', (e) => {
    document.querySelectorAll('.editable').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    e.stopPropagation();
  });

  // Drag functionality
  el.addEventListener('mousedown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    el.classList.add('selected');
    let offsetX = e.clientX - el.getBoundingClientRect().left;
    let offsetY = e.clientY - el.getBoundingClientRect().top;

    function mouseMoveHandler(e) {
      el.style.left = `${e.clientX - offsetX - currentSlide.getBoundingClientRect().left}px`;
      el.style.top = `${e.clientY - offsetY - currentSlide.getBoundingClientRect().top}px`;
    }

    function mouseUpHandler() {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  // Delete if empty and backspace/delete pressed
  el.addEventListener('keydown', (e) => {
    if ((e.key === "Backspace" || e.key === "Delete") && el.innerText.trim() === '') {
      el.remove();
    }
  });

  // Make div focusable for keyboard
  el.setAttribute('tabindex', 0);
}

// Click outside hides panel & deselect elements
document.body.addEventListener('click', (e) => {
  if (!e.target.closest('.swiper-slide')) {
    editPanel.style.display = 'none';
    currentSlide = null;
    document.querySelectorAll('.editable').forEach(d => d.classList.remove('selected'));
  }
});
