const formEl = document.getElementById('form');
const inputEl = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiUrl = 'https://api.lyrics.ovh';

// Search by song or artist
async function searchSongs(term) {
  const result = await fetch(`${apiUrl}/suggest/${term}`);
  const data = await result.json();
  console.log(data);

  /* .then((res) => res.json())
    .then((data) => console.log(data)); */
  showData(data);
}

// Get prev and next results
async function getMoreSongs(url) {
  const result = await fetch(`https://spathcors.herokuapp.com/${url}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain',
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
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
