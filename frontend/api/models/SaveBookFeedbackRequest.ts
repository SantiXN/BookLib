/* tslint:disable */
/* eslint-disable */
/**
 * Book Lib public API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface SaveBookFeedbackRequest
 */
export interface SaveBookFeedbackRequest {
    /**
     * 
     * @type {number}
     * @memberof SaveBookFeedbackRequest
     */
    starCount: number;
    /**
     * 
     * @type {string}
     * @memberof SaveBookFeedbackRequest
     */
    comment?: string;
}

/**
 * Check if a given object implements the SaveBookFeedbackRequest interface.
 */
export function instanceOfSaveBookFeedbackRequest(value: object): value is SaveBookFeedbackRequest {
    if (!('starCount' in value) || value['starCount'] === undefined) return false;
    return true;
}

export function SaveBookFeedbackRequestFromJSON(json: any): SaveBookFeedbackRequest {
    return SaveBookFeedbackRequestFromJSONTyped(json, false);
}

export function SaveBookFeedbackRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): SaveBookFeedbackRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'starCount': json['starCount'],
        'comment': json['comment'] == null ? undefined : json['comment'],
    };
}

export function SaveBookFeedbackRequestToJSON(json: any): SaveBookFeedbackRequest {
    return SaveBookFeedbackRequestToJSONTyped(json, false);
}

export function SaveBookFeedbackRequestToJSONTyped(value?: SaveBookFeedbackRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'starCount': value['starCount'],
        'comment': value['comment'],
    };
}

