const savedContainer = document.getElementById('saved-container');
const hamburger = document.querySelector('.hamburger');
const navSidebar = document.querySelector('.nav-sidebar');

hamburger.addEventListener('click', () => {
  navSidebar.classList.toggle('open');
});


function renderSavedVideos() {
  savedContainer.textContent = '';
  let videosToDisplay = JSON.parse(localStorage.getItem('savedVideos')) || [];

  if (videosToDisplay.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No saved videos yet!'
    savedContainer.appendChild(emptyMessage);
    return;
  }

  videosToDisplay.forEach(video => {
    const card = document.createElement('div');
    card.classList.add('video-card');

    const title = document.createElement('h3');
    title.textContent = video.title;

    const iframe = document.createElement('iframe');
    iframe.width = '639';
    iframe.height = '400';
    iframe.src = `https://www.youtube.com/embed/${video.id}`;
    iframe.title = video.title;
    iframe.allowFullscreen = true;

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-button');
    removeBtn.textContent = 'Remove 🗑️';
    removeBtn.dataset.videoId = video.id;
    removeBtn.dataset.title = video.title;

    card.appendChild(title);
    card.appendChild(iframe);
    card.appendChild(removeBtn);
    savedContainer.appendChild(card);
  })
}

savedContainer.addEventListener('click', (event) => {
  const clickedBtn = event.target.closest('.remove-button');
  if (!clickedBtn) return;

  const videoId = clickedBtn.dataset.videoId;
  let savedVideos = JSON.parse(localStorage.getItem('savedVideos')) || [];

  savedVideos = savedVideos.filter(video => video.id !== videoId);
  localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
  renderSavedVideos();

})

renderSavedVideos();