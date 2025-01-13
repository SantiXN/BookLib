import { ListBooksByCategoryResponseData } from '../../api/models/ListBooksByCategoryResponseData'
import { ParsedBook } from '../types/BookTypes'; 

export function parseBooksResponse(response: ListBooksByCategoryResponseData): ParsedBook[] {
    if (!response.books) {
        return []; // Если books нет, возвращаем пустой массив
    }

    return response.books.map((book) => ({
        title: book.title || "Untitled Book",
        author: book.authors?.map((author) => `${author.firstName} ${author.lastName}`).join(", ") || "Unknown Author",
        coverImage: book.coverPath || "default.jpg",
        rating: book.starCount || 0,
        toDirect: `/book/${book.id}`,
    }));
}