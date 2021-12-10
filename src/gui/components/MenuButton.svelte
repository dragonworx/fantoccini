<style lang="scss">
@import "../theme";
</style>

<script lang="ts">
import Button from "./Button.svelte";
import Menu from "./Menu.svelte";
import { MenuOption, MenuPosition, MenuTrigger } from "../types";

export let options: MenuOption[];
export let trigger: MenuTrigger = "mousedown";
export let position: MenuPosition = "dropdown";
export let isOpen: boolean = false;

const onMouseDown = () => {
  if (trigger === "mousedown") {
    isOpen = true;
  }
};

const onMouseUp = () => {
  if (trigger === "mouseup") {
    isOpen = true;
  } else if (trigger === "mousedown") {
    isOpen = false;
  }
};

const onMouseOver = () => {
  if (trigger === "mouseover") {
    isOpen = true;
  }
};
</script>

<Button
  noStyle="{true}"
  on:mousedown="{onMouseDown}"
  on:mouseup="{onMouseUp}"
  on:mouseover="{onMouseOver}">
  <Menu isOpen="{isOpen}" options="{options}" position="{position}"
    ><slot /></Menu>
</Button>
