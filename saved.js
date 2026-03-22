const savedContainer = document.getElementById('saved-container');
const hamburger = document.querySelector('.hamburger');
const navSidebar = document.querySelector('.nav-sidebar');

let savedVideos = JSON.parse(localStorage.getItem('savedVideos'));

hamburger.addEventListener('click', () => {
  navSidebar.classList.toggle('open');
});


function renderSavedVideos() {
  savedContainer.innerHTML = '';
  let videosToDisplay = JSON.parse(localStorage.getItem('savedVideos')) || [];

  if (videosToDisplay.length === 0) {
    savedContainer.innerHTML = '<p>No saved videos yet!</p>';
    return;
  }

  videosToDisplay.forEach(video => {
    const card = document.createElement('div'); // create a div to hold the card
    card.classList.add('video-card');
    card.innerHTML = `
      <h3>${video.title}</h3>
      <iframe
      width="639"
      height="400"
      src="https://www.youtube.com/embed/${video.id}"
      title = "${video.title}"
      frameborder="0"
      allowfullscreen>
      </iframe>
      `;
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-button');
    removeBtn.textContent = 'Remove 🗑️';
    removeBtn.dataset.videoId = video.id;
    removeBtn.dataset.title = video.title;
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