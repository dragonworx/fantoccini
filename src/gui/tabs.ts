import { onCanCloseHandler } from "./components/TabView.svelte";

export interface TabDocument {
  title: string;
  icon?: string;
  isClosable?: boolean;
  onCanClose?: onCanCloseHandler;
}
