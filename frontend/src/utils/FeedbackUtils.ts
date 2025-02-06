import { SaveBookFeedbackOperationRequest, SaveBookFeedbackRequest } from "../../api";


export function getFeedbackOperationRequest(bookID: number, starCount: number, comment?: string) : SaveBookFeedbackOperationRequest {
    const feedbackRequest: SaveBookFeedbackRequest = {starCount: starCount, comment: comment};

    return {
        bookID: bookID,
        saveBookFeedbackRequest: feedbackRequest
    }
}