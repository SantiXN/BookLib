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
import type { ArticleData } from './ArticleData';
import {
    ArticleDataFromJSON,
    ArticleDataFromJSONTyped,
    ArticleDataToJSON,
    ArticleDataToJSONTyped,
} from './ArticleData';
import type { AuthorData } from './AuthorData';
import {
    AuthorDataFromJSON,
    AuthorDataFromJSONTyped,
    AuthorDataToJSON,
    AuthorDataToJSONTyped,
} from './AuthorData';
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
 * @interface SearchItemsResponseData
 */
export interface SearchItemsResponseData {
    /**
     * 
     * @type {Array<BookData>}
     * @memberof SearchItemsResponseData
     */
    books?: Array<BookData>;
    /**
     * 
     * @type {Array<AuthorData>}
     * @memberof SearchItemsResponseData
     */
    authors?: Array<AuthorData>;
    /**
     * 
     * @type {Array<ArticleData>}
     * @memberof SearchItemsResponseData
     */
    articles?: Array<ArticleData>;
}

/**
 * Check if a given object implements the SearchItemsResponseData interface.
 */
export function instanceOfSearchItemsResponseData(value: object): value is SearchItemsResponseData {
    return true;
}

export function SearchItemsResponseDataFromJSON(json: any): SearchItemsResponseData {
    return SearchItemsResponseDataFromJSONTyped(json, false);
}

export function SearchItemsResponseDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchItemsResponseData {
    if (json == null) {
        return json;
    }
    return {
        
        'books': json['books'] == null ? undefined : ((json['books'] as Array<any>).map(BookDataFromJSON)),
        'authors': json['authors'] == null ? undefined : ((json['authors'] as Array<any>).map(AuthorDataFromJSON)),
        'articles': json['articles'] == null ? undefined : ((json['articles'] as Array<any>).map(ArticleDataFromJSON)),
    };
}

export function SearchItemsResponseDataToJSON(json: any): SearchItemsResponseData {
    return SearchItemsResponseDataToJSONTyped(json, false);
}

export function SearchItemsResponseDataToJSONTyped(value?: SearchItemsResponseData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'books': value['books'] == null ? undefined : ((value['books'] as Array<any>).map(BookDataToJSON)),
        'authors': value['authors'] == null ? undefined : ((value['authors'] as Array<any>).map(AuthorDataToJSON)),
        'articles': value['articles'] == null ? undefined : ((value['articles'] as Array<any>).map(ArticleDataToJSON)),
    };
}

