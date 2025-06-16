export interface DataResponse {
  id: string,
  result: Result,
  status: string,
}
interface Result {
  blog?: string,
  campaign: object,
  instagram_posts?: object[],
}
