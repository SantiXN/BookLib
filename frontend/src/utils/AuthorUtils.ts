import { GetAuthorInfoResponseData } from "../../api/models/GetAuthorInfoResponseData";
import { ParsedAuthor } from "../types/AuthorTypes";

export function parseAuthorResponse(response: GetAuthorInfoResponseData): ParsedAuthor | null {
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