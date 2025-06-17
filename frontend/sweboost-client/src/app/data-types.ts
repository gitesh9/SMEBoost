import { ImageObject } from "./blog-view/social-media-card/social-media-card"

export interface DataResponse {
  id: string,
  result: Result,
  status: string,
}
export interface Result {
  blog?: string,
  campaign: {
    campaign_name: string
  },
  instagram_posts?: object[],
  status?: string,
}

export interface ResponseAIType {
  id?: string,
  blog?: string,
  campaign?: {
    campaign_name: string,
    campaign_theme: string,
    home_image_url: string,
    home_image_file: string | number
  },
  instagram_posts?: ImageObject,
  instagram_image?: string,
  status?: string,
  homeImg?: object,
}
