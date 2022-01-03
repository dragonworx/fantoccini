export type onCanCloseHandler = (selectedIndex: number) => boolean;

export interface TabDocument {
  title: string;
  icon?: string;
  isClosable?: boolean;
  onCanClose?: onCanCloseHandler;
}
