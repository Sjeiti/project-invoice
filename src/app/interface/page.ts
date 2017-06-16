export interface IPage {
    ID: number
    slug: string
    title: string
    date: string
    excerpt: string
    content: string
    uri: string
    type: string
    order: number
    tags: any
    categories: any
    canComment: boolean
    comments: any
}
