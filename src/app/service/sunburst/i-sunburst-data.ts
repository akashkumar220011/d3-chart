export interface ISunburstData {
  name: string;
  children: ISunburstData[];
  value?: number;
}
