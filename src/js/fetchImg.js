 export default async function getImg(name, page, limit) {
    const API_KEY = '25799222-e6c5d7ab4018644ad2306fe73';
    const response = await fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${limit}`);
     if (!response.ok) {
         throw new Error(response.status)
    
     } else {
         const picture = await response.json()
         return picture
}
};

