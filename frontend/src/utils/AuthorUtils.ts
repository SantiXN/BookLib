import { GetBookInfoResponseData } from "../../api";
import { GetAuthorInfoResponseData } from "../../api/models/GetAuthorInfoResponseData";
import { ParsedAuthorInfo } from "../types/AuthorTypes";

export function parseAuthorResponse(response: GetAuthorInfoResponseData): ParsedAuthorInfo | null {
    if (!response.author) {
        return null;
    }
    
    return {
        id: response.author.id,
        firstName: response.author.firstName,
        lastName: response.author.lastName,
        description: response.author.description
    }
}

export function parseAuthorInfoInBookResponse(response: GetBookInfoResponseData): ParsedAuthorInfo[] {
    if (!response.book || !response.book.authors) {
        return [];
    }

    return response.book.authors.map((author) => ({
        id: author.id,
        firstName: author.firstName,
        lastName: author.lastName
    }))
}