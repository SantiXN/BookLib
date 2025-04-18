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
 * @interface SearchArticlesRequest
 */
export interface SearchArticlesRequest {
    /**
     * 
     * @type {string}
     * @memberof SearchArticlesRequest
     */
    searchString: string;
}

/**
 * Check if a given object implements the SearchArticlesRequest interface.
 */
export function instanceOfSearchArticlesRequest(value: object): value is SearchArticlesRequest {
    if (!('searchString' in value) || value['searchString'] === undefined) return false;
    return true;
}

export function SearchArticlesRequestFromJSON(json: any): SearchArticlesRequest {
    return SearchArticlesRequestFromJSONTyped(json, false);
}

export function SearchArticlesRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchArticlesRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'searchString': json['searchString'],
    };
}

export function SearchArticlesRequestToJSON(json: any): SearchArticlesRequest {
    return SearchArticlesRequestToJSONTyped(json, false);
}

export function SearchArticlesRequestToJSONTyped(value?: SearchArticlesRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'searchString': value['searchString'],
    };
}

