import { ListBooksByCategoryResponseData } from '../../api/models/ListBooksByCategoryResponseData'
import { GetBookInfoResponseData } from '../../api/models/GetBookInfoResponseData';
import { ParsedBookInfo, ParsedBookCard } from '../types/BookTypes'; 

export function parseBookCardsResponse(response: ListBooksByCategoryResponseData): ParsedBookCard[] {
    if (!response.books) {
        return [];
    }

    return response.books.map((book) => ({
        title: book.title || "Untitled Book",
        author: book.authors?.map((author) => `${author.firstName}${author.lastName ? ' ' + author.lastName : ''}`).join(", ") || "Unknown Author",
        coverImage: book.coverPath || "default.jpg",
        rating: book.starCount || 0,
        toDirect: `/book/${book.id}`,
    }));
}

export function parseBookInfoResponse(response: GetBookInfoResponseData): ParsedBookInfo | null {
    if (!response) {
        return null;
    }
    return {
        title: response.book?.title || "Untitled Book",
        coverImage: response.book?.coverPath || "default.jpg",
        rating: response.book?.starCount || 0,
        description: response.book?.description || "No description available",
        categories: response.book.categories
    }
}