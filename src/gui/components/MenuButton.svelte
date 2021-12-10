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
let button: Button;

const onDown = () => {
  isOpen = true;
  dispatch("open");

  if (trigger === "mouseup") {
    const handler = (e: MouseEvent) => {
      if (!button.containsEvent(e)) {
        button.setIsDown(false);
        isOpen = false;
        dispatch("close");
      }
      window.removeEventListener("mousedown", handler);
    };
    window.addEventListener("mousedown", handler);
  }
};

const onUp = () => {
  isOpen = false;
  dispatch("close");
};
</script>

<Menu
  isOpen="{isOpen}"
  options="{options}"
  position="{position}"
  selectedIndex="{selectedIndex}"
  data-component="menu-button"
  on:select
  ><Button
    bind:this="{button}"
    on:down="{onDown}"
    on:up="{onUp}"
    isDown="{isOpen}"
    canToggle="{trigger === 'mouseup'}">
    <slot />
  </Button></Menu>
