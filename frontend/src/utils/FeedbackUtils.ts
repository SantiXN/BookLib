import { GetBookInfoResponseData, SaveBookFeedbackOperationRequest, SaveBookFeedbackRequest } from "../../api";
import { ParsedFeedbackInfo } from "../types/FeedbackTypes";


export function parseFeedbacksInBookResponse(response: GetBookInfoResponseData): ParsedFeedbackInfo[] {
    if (!response || !response.book || !response.book.feedback) {
        return [];
    }
    
    return response.book.feedback.map((feedback) => ({
        id: feedback.id,
        userID: feedback.userID,
        starCount: feedback.starCount,
        postedAt: feedback.postedAt,
        comment: feedback.comment
    }))
}

export function getFeedbackOperationRequest(bookID: number, starCount: number, comment?: string) : SaveBookFeedbackOperationRequest {
    const feedbackRequest: SaveBookFeedbackRequest = {starCount: starCount, comment: comment};

    return {
        bookID: bookID,
        saveBookFeedbackRequest: feedbackRequest
    }
}