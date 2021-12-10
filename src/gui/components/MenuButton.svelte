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

let menu: Menu;

const onMouseDown = () => {
  if (trigger === "mousedown") {
    isOpen = true;
  }
};

const onMouseUp = () => {
  if (trigger === "mouseup") {
    isOpen = true;
    const handler = (e: MouseEvent) => {
      if (!menu.containsEvent(e)) {
        isOpen = false;
      }
      window.removeEventListener("mousedown", handler);
    };
    window.addEventListener("mousedown", handler);
  } else if (trigger === "mousedown") {
    isOpen = false;
  }
};

const onMenuMouseOver = (e: MouseEvent) => {
  // console.log("!");
};

const onMenuMouseOut = (e: MouseEvent) => {
  console.log("?", menu.containsEvent(e));
};
</script>

<Button noStyle="{true}" on:mousedown="{onMouseDown}" on:mouseup="{onMouseUp}">
  <Menu
    bind:this="{menu}"
    isOpen="{isOpen}"
    options="{options}"
    position="{position}"
    on:mouseover="{onMenuMouseOver}"
    on:mouseout="{onMenuMouseOut}"><slot /></Menu>
</Button>
