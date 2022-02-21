import '../styles.css'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getImg from './fetchImg';
import debounce from 'lodash.debounce';


const searchFormRef = document.querySelector('#search-form');
const submitBtnRef = document.querySelector('[type="submit"]')
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector(".load-more");

loadMoreBtn.classList.add("is-hidden");

let name = '';
let page = 1;
let limit = 40;
let disabled = false;

async function makeFetchResponse(name, page) {

    
  try {
    const picture = await getImg(name, page, limit);
    const { total, totalHits, hits } = picture;
        
    if (!hits.length) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");

      loadMoreBtn.classList.add("is-hidden");
      galleryRef.innerHTML = '';
      return
    } else if (hits.length < limit && page === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      loadMoreBtn.classList.add("is-hidden");
      galleryRef.innerHTML = '';
    } else if (hits.length < limit) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add("is-hidden");
    } else if (page === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      loadMoreBtn.classList.remove("is-hidden");
      galleryRef.innerHTML = '';
    } else {
      loadMoreBtn.classList.remove("is-hidden");
    };

    renderMarkup(hits);
    const photoCards = document.querySelectorAll(".photo-card");

    if (hits.length > 1) {
      photoCards.forEach(photoCard => { });
    } else if (hits.length === 1) {
      const lastElementArray = photoCards[photoCards.length - 1];

      lastElementArray.classList.remove("is-hidden");
    }
  } catch (error) {
    console.log(error);
  }
}
    
searchFormRef.addEventListener('submit', onSearch)

function onSearch(evt) {
    evt.preventDefault();

  if (disabled) {
    return;
  };
  

  submitBtnRef.removeAttribute("disabled");
    disabled = false;
    
  loadMoreBtn.classList.add("is-hidden");
  

  const { elements } = evt.target;
    const { searchQuery } = elements;

  if (!searchQuery.value) {
    Notify.warning("line is empty");

   
      galleryRef.innerHTML = '';
   

    return
  };

  
    
    
  name = searchQuery.value;
  page = 1;

    makeFetchResponse(name, page);

 searchQuery.value = '';
    
    
}



loadMoreBtn.addEventListener('click', debounce(onLoadMore, 300));

function onLoadMore() {
  loadMoreBtn.classList.add("is-hidden");
  
  page += 1;

  makeFetchResponse(name, page);
};



  function renderMarkup(hits) {
    const markup = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
  <img class="img-preview" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
                    <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`
    }
    ).join("");

    galleryRef.insertAdjacentHTML("beforeend", markup)

  }