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
import type { AuthorInfo } from './AuthorInfo';
import {
    AuthorInfoFromJSON,
    AuthorInfoFromJSONTyped,
    AuthorInfoToJSON,
    AuthorInfoToJSONTyped,
} from './AuthorInfo';

/**
 * 
 * @export
 * @interface ListAuthorsResponseData
 */
export interface ListAuthorsResponseData {
    /**
     * 
     * @type {Array<AuthorInfo>}
     * @memberof ListAuthorsResponseData
     */
    authors: Array<AuthorInfo>;
}

/**
 * Check if a given object implements the ListAuthorsResponseData interface.
 */
export function instanceOfListAuthorsResponseData(value: object): value is ListAuthorsResponseData {
    if (!('authors' in value) || value['authors'] === undefined) return false;
    return true;
}

export function ListAuthorsResponseDataFromJSON(json: any): ListAuthorsResponseData {
    return ListAuthorsResponseDataFromJSONTyped(json, false);
}

export function ListAuthorsResponseDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): ListAuthorsResponseData {
    if (json == null) {
        return json;
    }
    return {
        
        'authors': ((json['authors'] as Array<any>).map(AuthorInfoFromJSON)),
    };
}

export function ListAuthorsResponseDataToJSON(json: any): ListAuthorsResponseData {
    return ListAuthorsResponseDataToJSONTyped(json, false);
}

export function ListAuthorsResponseDataToJSONTyped(value?: ListAuthorsResponseData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'authors': ((value['authors'] as Array<any>).map(AuthorInfoToJSON)),
    };
}

