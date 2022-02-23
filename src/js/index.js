import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../styles.css'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getImg from './fetchImg';
import debounce from 'lodash.debounce';




const searchFormRef = document.querySelector('#search-form');
const submitBtnRef = document.querySelector('[type="submit"]')
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector(".load-more");

galleryRef.addEventListener('click', (evt) => {
  evt.preventDefault()
});
loadMoreBtn.addEventListener('click', debounce(onLoadMore, 300));
searchFormRef.addEventListener('submit', onSearch)



loadMoreBtn.classList.add("is-hidden");

let name = '';
let page = 1;
let limit = 40;
let disabled = false;

let lightbox = new SimpleLightbox('.photo-card a', { captionDelay: 250, captionsData: 'alt', });

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
        lightbox.refresh();
      galleryRef.innerHTML = '';
    } else if (hits.length < limit) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add("is-hidden");
    }
    else if (page === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      loadMoreBtn.classList.remove("is-hidden");
        lightbox.refresh();
      galleryRef.innerHTML = '';
    }
    else {
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

  if (!searchQuery.value.trim()) {
    Notify.warning("line is empty");
     searchQuery.value = '';
    return
  };
  name = searchQuery.value.trim();
  page = 1;
    makeFetchResponse(name, page);
 searchQuery.value = '';
}





function onLoadMore() {
  loadMoreBtn.classList.add("is-hidden");
  page += 1;
  makeFetchResponse(name, page);
};



  function renderMarkup(hits) {
    const markup = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
<a href="${largeImageURL}">

  <img class="img-preview" src="${webformatURL}" alt="${tags}" loading="lazy" /> 
  </a>
  <div class="info">
    <p class="info-item">
                    <b>Likes <span>${likes}</span> </b>
    </p>
    <p class="info-item">
      <b>Views <span>${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments <span>${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <span>${downloads}</span></b>
    </p>
  </div>
</div>`
    }
    ).join("");

    galleryRef.insertAdjacentHTML("beforeend", markup);
     lightbox.refresh();

  }



 

