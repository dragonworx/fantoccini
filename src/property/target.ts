export interface DynamicPropertyTarget {
  onChange (propertyName: string, newValue: any, oldValue: any);
}