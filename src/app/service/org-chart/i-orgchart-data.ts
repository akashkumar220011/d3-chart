export interface IOrgchartData {
  name: string;
  title: string;
  image: string;
  children?: IOrgchartData[];
  _children?: IOrgchartData[];
  count?: number;
}

export interface ExtendedHierarchyNode extends d3.HierarchyNode<IOrgchartData> {
y: any;
x: any;
  _children?: ExtendedHierarchyNode[];
}
