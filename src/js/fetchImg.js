import axios from "axios"; 
const API_KEY = '25799222-e6c5d7ab4018644ad2306fe73';
const BASE_URL = 'https://pixabay.com/api/'
 
export default async function getImg(name, page, limit) {
    
    try {
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${limit}`);

        if (response.total === 0) {
            return
        }
        
     const picture = await response.data;
        //  console.log(picture);
         return picture
} catch (error) {
    // throw new Error(error.status)
}
};


