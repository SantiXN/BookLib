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
import type { BookData } from './BookData';
import {
    BookDataFromJSON,
    BookDataFromJSONTyped,
    BookDataToJSON,
    BookDataToJSONTyped,
} from './BookData';

/**
 * 
 * @export
 * @interface ListBooksByCategoryResponseData
 */
export interface ListBooksByCategoryResponseData {
    /**
     * 
     * @type {Array<BookData>}
     * @memberof ListBooksByCategoryResponseData
     */
    books: Array<BookData>;
    /**
     * 
     * @type {number}
     * @memberof ListBooksByCategoryResponseData
     */
    totalCount: number;
}

/**
 * Check if a given object implements the ListBooksByCategoryResponseData interface.
 */
export function instanceOfListBooksByCategoryResponseData(value: object): value is ListBooksByCategoryResponseData {
    if (!('books' in value) || value['books'] === undefined) return false;
    if (!('totalCount' in value) || value['totalCount'] === undefined) return false;
    return true;
}

export function ListBooksByCategoryResponseDataFromJSON(json: any): ListBooksByCategoryResponseData {
    return ListBooksByCategoryResponseDataFromJSONTyped(json, false);
}

export function ListBooksByCategoryResponseDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): ListBooksByCategoryResponseData {
    if (json == null) {
        return json;
    }
    return {
        
        'books': ((json['books'] as Array<any>).map(BookDataFromJSON)),
        'totalCount': json['totalCount'],
    };
}

export function ListBooksByCategoryResponseDataToJSON(json: any): ListBooksByCategoryResponseData {
    return ListBooksByCategoryResponseDataToJSONTyped(json, false);
}

export function ListBooksByCategoryResponseDataToJSONTyped(value?: ListBooksByCategoryResponseData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'books': ((value['books'] as Array<any>).map(BookDataToJSON)),
        'totalCount': value['totalCount'],
    };
}

