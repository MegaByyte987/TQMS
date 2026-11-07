export interface Narration {
  id: string;
  "s-n": number;
  text: string;
  updatedAtBS: string;
}

export interface NarrationListParams {
  q?: string;
  page?: number;
  pageSize?: number;
}