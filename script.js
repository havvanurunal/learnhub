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

let currentSearchTerm;
let nextPageToken;

let allLoadedVideos = [];

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  performSearch();
})

loadMore.addEventListener('click', async () => {
  const encodedTerm = encodeURIComponent(currentSearchTerm);
  let queryParams = `part=snippet&q=${encodedTerm}&maxResults=5&type=video&videoEmbeddable=true&videoDuration=medium&safeSearch=strict&pageToken=${nextPageToken}`
  const data = await fetchData(url, true, queryParams);

  if (!data || !data.videos) return; // checks if the same video is loaded before
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
  window.open('saved.html', target = '_blank')
})


contentContainer.addEventListener('click', (event) => {
  const clickedBtn = event.target.closest('.saved-button');

  if (!clickedBtn) return; //if savedBtn is not clicked, exit the function

  let savedVideos = JSON.parse(localStorage.getItem('savedVideos')) || [];
  const videoId = clickedBtn.dataset.videoId;
  let isAlreadySaved = savedVideos.some(video => video.id === videoId);
  // look at every id in the list, does this id match the videoId of the button I just clicked?

  console.log(clickedBtn.dataset)

  if (isAlreadySaved) {
    clickedBtn.classList.toggle('saved-active');
    savedVideos = savedVideos.filter(video => video.id !== videoId)
    clickedBtn.classList.remove('save-active');
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
  if (!currentSearchTerm) return; // exit if nothing typed

  contentContainer.innerHTML = '<p class="loading">Searching for the best videos...</p>';

  // we encode the term to handle spaces safely here:
  const encodedTerm = encodeURIComponent(currentSearchTerm);

  let queryParams = `part=snippet&q=${encodedTerm}&maxResults=5&type=video&videoEmbeddable=true&videoDuration=medium&safeSearch=strict`; // this doesnt work, it doesnt show first 5 videos.

  const data = await fetchData(url, true, queryParams);
  console.log("Check 1: Data received is", data);
  if (data && data.videos) {
    const videos = data.videos;
    nextPageToken = data.nextToken;
    loadMore.classList.remove('hidden');

    displayVideos(videos);
    if (videos.length === 0) {
      contentContainer.innerHTML = '<p>No videos found for this topic. Try something else!</p>';
    } else {
      displayVideos(videos);
    }
  } else {
    contentContainer.innerHTML = '<p>Something went wrong. Please try again.</p>';
  }
}


function displayVideos(videos) {
  // clear out the container so old searches disappear
  contentContainer.innerHTML = '';

  const savedVideos = JSON.parse(localStorage.getItem('savedVideos')) || [];

  videos.forEach(video => {
    const isSaved = savedVideos.some(saved => saved.id === video.id.videoId);

    const card = document.createElement('div');
    // create a div to hold the card
    card.classList.add('video-card');
    card.innerHTML = `
    <h3>${video.snippet.title}</h3>
    <iframe
    width="639"
    height="400"
    src="https://www.youtube.com/embed/${video.id.videoId}"
    frameborder="0"
    allowfullscreen>
    </iframe>
    `;
    const savedBtn = document.createElement('button');
    savedBtn.classList.add('saved-button');
    if (isSaved) {
      savedBtn.classList.add('saved-active');
      savedBtn.textContent = 'Saved! ✅';
    } else {
      savedBtn.textContent = 'Save Video ⭐';
    }

    savedBtn.dataset.videoId = video.id.videoId;
    savedBtn.dataset.title = video.snippet.title;

    card.appendChild(savedBtn);
    contentContainer.appendChild(card);
  })
}

function appendVideos(videos) {
  videos.forEach(video => {
    const card = document.createElement('div'); // create a div to hold the card
    card.classList.add('video-card');
    card.innerHTML = `
    <h3>${video.snippet.title}</h3>
    <iframe
    width="639"
    height="400"
    src="https://www.youtube.com/embed/${video.id.videoId}"
    frameborder="0"
    allowfullscreen>
    </iframe>
    `;
    const savedBtn = document.createElement('button');
    savedBtn.classList.add('saved-button');
    const savedVideos = JSON.parse(localStorage.getItem('savedVideos')) || [];
    const isInitiallySaved = savedVideos.includes(video.id.videoId);
    savedBtn.textContent = isInitiallySaved ? 'Saved! ✅' : 'Save Video ⭐';
    savedBtn.dataset.videoId = video.id.videoId;
    savedBtn.dataset.title = video.snippet.title;
    card.appendChild(savedBtn);
    contentContainer.appendChild(card);
  })
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
    console.log(errorMsg);
    errorMsg.classList.remove('hidden');
  }
};
