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
