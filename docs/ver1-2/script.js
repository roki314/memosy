// 

let activeMemo = null;
let offsetX, offsetY;
let memoCount = 6; // początkowa liczba

// Drag and drop
document.addEventListener('mousedown', e => {
  const memo = e.target.closest('.memo');
  if (memo && !e.target.isContentEditable && !e.target.classList.contains('color-swatch')) {
    activeMemo = memo;
    offsetX = e.clientX - memo.offsetLeft;
    offsetY = e.clientY - memo.offsetTop;
    memo.style.zIndex = 1000;
  }
});

document.addEventListener('mousemove', e => {
  if (activeMemo) {
    activeMemo.style.left = `${e.clientX - offsetX}px`;
    activeMemo.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener('mouseup', () => {
  if (activeMemo) {
    activeMemo.style.zIndex = '';
    activeMemo = null;
  }
});

// Save all memos
document.getElementById('saveBtn').addEventListener('click', () => {
  const memosData = {};
  document.querySelectorAll('.memo').forEach(memo => {
    memosData[memo.id] = {
      left: memo.style.left,
      top: memo.style.top,
      title: memo.querySelector('.memo-title').innerText,
      body: memo.querySelector('.memo-body').innerText,
      color: memo.style.backgroundColor
    };
  });
  localStorage.setItem('memoData', JSON.stringify(memosData));
  alert('Zapisano!');
});

// Load memos
window.addEventListener('load', () => {
  const saved = localStorage.getItem('memoData');
  if (saved) {
    const memos = JSON.parse(saved);
    for (const id in memos) {
      const data = memos[id];
      let memo = document.getElementById(id);
      if (!memo) {
        memo = createMemo(id);
        document.querySelector('main').appendChild(memo);
      }
      memo.style.left = data.left;
      memo.style.top = data.top;
      memo.querySelector('.memo-title').innerText = data.title;
      memo.querySelector('.memo-body').innerText = data.body;
      memo.style.backgroundColor = data.color;
    }
    memoCount = Object.keys(memos).length;
  }
});

// Reset
document.getElementById('resetBtn').addEventListener('click', () => {
  localStorage.removeItem('memoData');
  location.reload();
});

// Add memo
document.getElementById('addBtn').addEventListener('click', () => {
  memoCount++;
  const id = `memo${memoCount}`;
  const memo = createMemo(id);
  memo.style.top = `${50 + 20 * memoCount}px`;
  memo.style.left = `${50 + 20 * memoCount}px`;
  document.querySelector('main').appendChild(memo);
});

// Export
document.getElementById('exportBtn').addEventListener('click', () => {
  const data = localStorage.getItem('memoData') || '{}';
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'memo_export.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Create memo
function createMemo(id) {
  const memo = document.createElement('div');
  memo.className = 'memo';
  memo.id = id;
  memo.style.position = 'absolute';
  memo.style.backgroundColor = getRandomColor();
  memo.innerHTML = `
    <div class="memo-title" contenteditable="true">Nowe memo</div>
    <div class="memo-body" contenteditable="true">Treść...</div>
    <div class="color-picker">
      ${['#FFD700', '#FFB6C1', '#90EE90', '#87CEFA', '#FFA07A', '#DDA0DD'].map(color => `
        <div class="color-swatch" style="background-color: ${color}" data-color="${color}"></div>
      `).join('')}
    </div>
  `;
  addColorEvents(memo);
  return memo;
}

// Color picker logic
function addColorEvents(memo) {
  memo.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      memo.style.backgroundColor = swatch.dataset.color;
    });
  });
}

// Random color
function getRandomColor() {
  const colors = ['#FFD700', '#FFB6C1', '#90EE90', '#87CEFA', '#FFA07A', '#DDA0DD'];
  return colors[Math.floor(Math.random() * colors.length)];
}




// xx