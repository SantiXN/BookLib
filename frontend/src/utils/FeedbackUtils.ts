import { ListBookFeedbackResponseData, SaveBookFeedbackOperationRequest, SaveBookFeedbackRequest } from "../../api";
import { ParsedFeedbackInfo } from "../types/FeedbackTypes";


export function parseFeedbacksInBookResponse(response: ListBookFeedbackResponseData): ParsedFeedbackInfo[] {
    if (!response || !response.feedback) {
        return [];
    }
    
    return response.feedback.map((feedback) => ({
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