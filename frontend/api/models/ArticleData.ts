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
import type { UserData } from './UserData';
import {
    UserDataFromJSON,
    UserDataFromJSONTyped,
    UserDataToJSON,
    UserDataToJSONTyped,
} from './UserData';

/**
 * 
 * @export
 * @interface ArticleData
 */
export interface ArticleData {
    /**
     * 
     * @type {number}
     * @memberof ArticleData
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof ArticleData
     */
    title: string;
    /**
     * 
     * @type {UserData}
     * @memberof ArticleData
     */
    author: UserData;
    /**
     * 
     * @type {string}
     * @memberof ArticleData
     */
    status: ArticleDataStatusEnum;
    /**
     * unix timestamp
     * @type {number}
     * @memberof ArticleData
     */
    publishDate?: number;
}


/**
 * @export
 */
export const ArticleDataStatusEnum = {
    Published: 'published',
    Unpublished: 'unpublished'
} as const;
export type ArticleDataStatusEnum = typeof ArticleDataStatusEnum[keyof typeof ArticleDataStatusEnum];


/**
 * Check if a given object implements the ArticleData interface.
 */
export function instanceOfArticleData(value: object): value is ArticleData {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('author' in value) || value['author'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    return true;
}

export function ArticleDataFromJSON(json: any): ArticleData {
    return ArticleDataFromJSONTyped(json, false);
}

export function ArticleDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): ArticleData {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'title': json['title'],
        'author': UserDataFromJSON(json['author']),
        'status': json['status'],
        'publishDate': json['publishDate'] == null ? undefined : json['publishDate'],
    };
}

export function ArticleDataToJSON(json: any): ArticleData {
    return ArticleDataToJSONTyped(json, false);
}

export function ArticleDataToJSONTyped(value?: ArticleData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'title': value['title'],
        'author': UserDataToJSON(value['author']),
        'status': value['status'],
        'publishDate': value['publishDate'],
    };
}

