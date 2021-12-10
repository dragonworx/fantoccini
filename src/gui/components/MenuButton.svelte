<style lang="scss">
@import "../theme";
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import Button from "./Button.svelte";
import Menu from "./Menu.svelte";
import { MenuOption, MenuPosition, MenuTrigger } from "../types";

export let options: MenuOption[];
export let selectedIndex: number = -1;
export let trigger: MenuTrigger = "mousedown";
export let position: MenuPosition = "dropdown";
export let isOpen: boolean = false;

export function getIsOpen() {
  return isOpen;
}

export function setIsOpen(value: boolean) {
  isOpen = value;
}

let dispatch = createEventDispatcher();
let menu: Menu;

const onMouseDown = () => {
  if (trigger === "mousedown") {
    isOpen = true;
    dispatch("open");
  }
};

const onMouseUp = () => {
  if (trigger === "mouseup") {
    if (!isOpen) {
      isOpen = true;
      dispatch("open");
      const handler = (e: MouseEvent) => {
        if (!menu.containsEvent(e)) {
          isOpen = false;
          dispatch("close");
        }
        window.removeEventListener("mousedown", handler);
      };
      window.addEventListener("mousedown", handler);
    }
  } else if (trigger === "mousedown") {
    isOpen = false;
    dispatch("close");
  }
};
</script>

<Button noStyle="{true}" on:mousedown="{onMouseDown}" on:mouseup="{onMouseUp}">
  <Menu
    bind:this="{menu}"
    isOpen="{isOpen}"
    options="{options}"
    position="{position}"
    selectedIndex="{selectedIndex}"><slot /></Menu>
</Button>
