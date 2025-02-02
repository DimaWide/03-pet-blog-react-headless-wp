## Blog WP

A modern, responsive blog website built with React. It features user authentication, dynamic blog post display, category filtering, search functionality, and pagination.

Screenshots:    
[Main](https://github.com/DimaWide/03-pet-blog-react-headless-wp/tree/main/src/img/main.png)
[Single](https://github.com/DimaWide/03-pet-blog-react-headless-wp/tree/main/src/img/single.png) 
[Login](https://github.com/DimaWide/03-pet-blog-react-headless-wp/tree/main/src/img/login.png) | [Register](https://github.com/DimaWide/03-pet-blog-react-headless-wp/tree/main/src/img/register.png)   

![Blog WP](https://github.com/DimaWide/03-pet-blog-react-headless-wp/tree/main/src/img/ui.gif)

## Features

- **User Authentication**: Fetches current user data using a bearer token stored in `localStorage`.
- **Blog Post Display**: Fetches and displays blog posts from the backend with React Query, supporting dynamic filtering by category and search term.
- **Pagination**: Navigates through multiple pages of blog posts.
- **Responsive Design**: The layout adjusts for different screen sizes (mobile, tablet, desktop).
- **Error Handling**: Basic error logging and loading states.

## Tech Stack

- **React**: Frontend framework for building the user interface.
- **React Query**: Data fetching and caching.
- **Axios**: HTTP client for API requests.
- **SCSS/CSS**: Styling with a focus on readability and responsiveness.
- **Context API**: Manages global state for user authentication.
