export interface DataResponse {
  id: string,
  result: Result,
  status: string,
}
export interface Result {
  blog?: string,
  campaign: object,
  instagram_posts?: object[],
  status?: string,
}

export interface ResponseAIType {
  id?: string,
  blog?: string,
  campaign?: string,
  instagram_posts?: string,
  instagram_image?: string,
  status?: string,
}
