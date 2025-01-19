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
 * @interface SearchAuthorsRequest
 */
export interface SearchAuthorsRequest {
    /**
     * 
     * @type {string}
     * @memberof SearchAuthorsRequest
     */
    searchString: string;
}

/**
 * Check if a given object implements the SearchAuthorsRequest interface.
 */
export function instanceOfSearchAuthorsRequest(value: object): value is SearchAuthorsRequest {
    if (!('searchString' in value) || value['searchString'] === undefined) return false;
    return true;
}

export function SearchAuthorsRequestFromJSON(json: any): SearchAuthorsRequest {
    return SearchAuthorsRequestFromJSONTyped(json, false);
}

export function SearchAuthorsRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchAuthorsRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'searchString': json['searchString'],
    };
}

export function SearchAuthorsRequestToJSON(json: any): SearchAuthorsRequest {
    return SearchAuthorsRequestToJSONTyped(json, false);
}

export function SearchAuthorsRequestToJSONTyped(value?: SearchAuthorsRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'searchString': value['searchString'],
    };
}

