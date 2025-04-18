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
 * @interface EditArticleRequest
 */
export interface EditArticleRequest {
    /**
     * 
     * @type {string}
     * @memberof EditArticleRequest
     */
    newTitle?: string;
    /**
     * 
     * @type {string}
     * @memberof EditArticleRequest
     */
    newContent?: string;
}

/**
 * Check if a given object implements the EditArticleRequest interface.
 */
export function instanceOfEditArticleRequest(value: object): value is EditArticleRequest {
    return true;
}

export function EditArticleRequestFromJSON(json: any): EditArticleRequest {
    return EditArticleRequestFromJSONTyped(json, false);
}

export function EditArticleRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): EditArticleRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'newTitle': json['newTitle'] == null ? undefined : json['newTitle'],
        'newContent': json['newContent'] == null ? undefined : json['newContent'],
    };
}

export function EditArticleRequestToJSON(json: any): EditArticleRequest {
    return EditArticleRequestToJSONTyped(json, false);
}

export function EditArticleRequestToJSONTyped(value?: EditArticleRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'newTitle': value['newTitle'],
        'newContent': value['newContent'],
    };
}

