const formEl = document.getElementById('form');
const inputEl = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiUrl = 'https://api.lyrics.ovh';

// Search by song or artist
async function searchSongs(term) {
  const result = await fetch(`${apiUrl}/suggest/${term}`);
  const data = await result.json();

  /* .then((res) => res.json())
    .then((data) => console.log(data)); */
  showData(data);
}

// Get prev and next results
async function getMoreSongs(url) {
  const result = await fetch(`https://spathcors.herokuapp.com/${url}`);
  const data = await result.json();
  console.log(data);

  showData(data);
}

// Put data into the DOM
function showData(data) {
  let output = '';

  /*   data.data.forEach((i) => {
    output += `
    <li>
      <span><strong>${i.artist.name}</strong> - ${i.title}</span>      
      <div class="img-container">
      <img src="${i.album.cover_small}"/>
      </div>
      <button class="btn" data-artist="${i.artist.name}" data-songtitle="${i.title}">Get Lyrics</button>
    </li>
    `;
  });
  result.innerHTML = `
    <ul class="songs">
      ${output}
    </ul>
  `; */

  result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          (i) => `
      <li>
      <span><strong>${i.artist.name}</strong> - ${i.title}</span>      
      <div class="img-container">
      <img src="${i.album.cover_small}"/>
      </div>
      <button class="btn" data-artist="${i.artist.name}" data-songtitle="${i.title}">Get Lyrics</button>
    </li>
      `
        )
        .join('')}
    </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
          : ''
      }
      ${
        data.next
          ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
          : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const results = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`);
  const data = await results.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  console.log(lyrics);

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>`;

  more.innerHTML = '';
}

// Event listeners
formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type something in...');
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics button click
result.addEventListener('click', (e) => {
  const clickedEl = e.target;
  console.log(clickedEl);
  let artist;
  let songTitle;

  if (clickedEl.tagName === 'BUTTON') {
    artist = clickedEl.getAttribute('data-artist');
    songTitle = clickedEl.getAttribute('data-songtitle');
  }
  getLyrics(artist, songTitle);
});
