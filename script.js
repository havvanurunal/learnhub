const url = 'https://www.googleapis.com/youtube/v3/search';
const searchButton = document.querySelector('#search-btn');
const inputField = document.querySelector('#user-input');
const searchForm = document.querySelector('#search-form');
const contentContainer = document.getElementById('content-container');
const errorMsg = document.getElementById('error');
const loadMore = document.getElementById('loadMore');
const savedContainer = document.getElementById('saved-container');
const saved = document.getElementById('savedPage');
const searchTerm = inputField.value;
const hamburger = document.querySelector('.hamburger');
const navSidebar = document.querySelector('.nav-sidebar');

let currentSearchTerm;
let nextPageToken;
let allLoadedVideos = [];

hamburger.addEventListener('click', () => {
  navSidebar.classList.toggle('open');
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  performSearch();
})

loadMore.addEventListener('click', async () => {
  const encodedTerm = encodeURIComponent(currentSearchTerm);
  let queryParams = `part=snippet&q=${encodedTerm}&maxResults=6&type=video&videoEmbeddable=true&videoDuration=medium&safeSearch=strict&pageToken=${nextPageToken}`
  const data = await fetchData(url, true, queryParams);

  if (!data || !data.videos) return;
  if (nextPageToken) {
    loadMore.classList.remove('hidden');
  } else {
    loadMore.classList.add('hidden');
  }
  appendVideos(data.videos);
  nextPageToken = data.nextToken;
  allLoadedVideos = allLoadedVideos.concat(data.videos);
})

saved.addEventListener('click', (event) => {
  event.preventDefault();
  window.open('saved.html')
})


contentContainer.addEventListener('click', (event) => {
  const clickedBtn = event.target.closest('.saved-button');
  if (!clickedBtn) return;

  let savedVideos = JSON.parse(localStorage.getItem('savedVideos')) || [];
  const videoId = clickedBtn.dataset.videoId;
  let isAlreadySaved = savedVideos.some(video => video.id === videoId);

  if (isAlreadySaved) {
    clickedBtn.classList.toggle('saved-active');
    savedVideos = savedVideos.filter(video => video.id !== videoId)
    clickedBtn.classList.remove('saved-active');
    clickedBtn.textContent = 'Save Video ⭐';
  } else {
    savedVideos.push({ id: videoId, title: clickedBtn.dataset.title });
    clickedBtn.classList.add('saved-active');
    clickedBtn.textContent = 'Saved! ✅';
  }
  localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
});


async function performSearch() {
  currentSearchTerm = inputField.value;
  if (!currentSearchTerm) return;

  contentContainer.textContent = '';
  const loadingMsg = document.createElement('p');
  loadingMsg.classList.add('loading');
  loadingMsg.textContent = 'Searching for the best videos...';
  contentContainer.appendChild(loadingMsg);

  const encodedTerm = encodeURIComponent(currentSearchTerm);
  let queryParams = `part=snippet&q=${encodedTerm}&maxResults=6&type=video&videoEmbeddable=true&videoDuration=medium&safeSearch=strict`;

  const data = await fetchData(url, true, queryParams);

  if (data && data.videos) {
    const videos = data.videos;
    nextPageToken = data.nextToken;
    loadMore.classList.remove('hidden');

    if (videos.length === 0) {
      contentContainer.textContent = '';
      const noResults = document.createElement('p');
      noResults.textContent = 'No videos found for this topic. Try something else!';
      contentContainer.appendChild(noResults);
    } else {
      displayVideos(videos);
    }
  } else {
    contentContainer.textContent = '';
    const errorP = document.createElement('p');
    errorP.textContent = 'Something went wrong. Please try again.';
    contentContainer.appendChild(errorP);
  }
}

function createVideoCard(videoId, videoTitle, isSaved, btnClass) {
  const card = document.createElement('div');
  card.classList.add('video-card');

  const title = document.createElement('h3');
  title.textContent = videoTitle;

  const iframe = document.createElement('iframe');
  iframe.width = '639';
  iframe.height = '400';
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.title = videoTitle;
  iframe.allowFullscreen = true;

  const savedBtn = document.createElement('button');
  savedBtn.classList.add('saved-button');

  if (isSaved) {
    savedBtn.classList.add('saved-active');
    savedBtn.textContent = 'Saved! ✅';
  } else {
    savedBtn.textContent = 'Save Video ⭐';
  }

  savedBtn.dataset.videoId = videoId;
  savedBtn.dataset.title = videoTitle;

  card.appendChild(title);
  card.appendChild(iframe);
  card.appendChild(savedBtn);

  return card;
}


function displayVideos(videos) {
  contentContainer.textContent = '';
  const savedVideos = JSON.parse(localStorage.getItem('savedVideos')) || [];

  videos.forEach(video => {
    const isSaved = savedVideos.some(saved => saved.id === video.id.videoId);
    const card = createVideoCard(video.id.videoId, video.snippet.title, isSaved, 'saved-button');
    contentContainer.appendChild(card);
  })
}

function appendVideos(videos) {
  const savedVideos = JSON.parse(localStorage.getItem('savedVideos')) || [];

  videos.forEach(video => {
    const isSaved = savedVideos.some(saved => saved.id === video.id.videoId);
    const card = createVideoCard(video.id.videoId, video.snippet.title, isSaved, 'saved-button');
    contentContainer.appendChild(card);
  });
}

function constructFetchUrl(url, authenticate = true, queryParams) {
  let fetchUrl = url;
  if (authenticate) {
    fetchUrl = `${fetchUrl}?key=${YOUTUBE_ACCESS_KEY}`;
  }
  if (!!queryParams) {
    fetchUrl = `${fetchUrl}&${queryParams}`;
  }
  return fetchUrl;
}

async function fetchData(url, authenticate = true, queryParams, params) {
  const fetchUrl = constructFetchUrl(url, authenticate, queryParams);
  try {
    const response = await fetch(fetchUrl, params);
    if (!response.ok) {
      console.log(response);
      throw Error(
        `Error fetching data, API returned ${response.status} status code.`,
      );
    }
    const body = await response.json();
    return { nextToken: body.nextPageToken, videos: body.items };
  } catch (error) {
    console.error(error);
    errorMsg.textContent = "An error occured";
    errorMsg.classList.remove('hidden');
  }
};
