import {IContent} from './content'

export interface IPost {
    id: number
    date: string
    date_gmt: string
    guid: IContent
    modified: string
    modified_gmt: string
    slug: string
    type: string
    link: string
    title: IContent
    content: IContent
    excerpt: IContent
    author: number
    featured_media: number
    comment_status: string
    ping_status: string
    sticky: boolean
    format: string
    categories: number[]
    tags: any
    terms: any
}
