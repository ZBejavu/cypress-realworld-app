export interface RawData {
  label: string;
  backgroundColor: string;
  borderColor: string;
  fill: boolean;
  data: number[];
}

export interface ChartData {
  labels: string[];
  title: string;
  rawData: RawData[];
}

export interface State {
  labels: string[];
  datasets: RawData[];
}
