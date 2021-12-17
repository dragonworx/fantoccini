<style lang="scss">
@import "../theme";
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import Button from "./Button.svelte";
import Menu from "./Menu.svelte";
import { MenuItem, MenuPosition, MenuTrigger } from "../types";
import { isAcceptKey, isArrowKey } from "../filters";

export let isEnabled: boolean = true;
export let options: MenuItem[];
export let selectedIndex: number = -1;
export let hoverIndex: number = selectedIndex;
export let trigger: MenuTrigger = "mousedown";
export let position: MenuPosition = "dropdown";
export let isOpen: boolean = false;

export function getIsOpen() {
  return isOpen;
}

export function setIsOpen(value: boolean) {
  isOpen = value;
  button.setIsDown(value);
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
    setTimeout(() => window.addEventListener("mousedown", handler), 0);
  }
};

const onUp = () => {
  isOpen = false;
  dispatch("close");
};

const onButtonKeydown = (e: KeyboardEvent) => {
  const { key } = e;
  if (key === "ArrowDown" && !isOpen) {
    onDown();
  }
  if (isArrowKey(key)) {
    e.preventDefault();
  }
};

const onButtonKeyup = (e: KeyboardEvent) => {
  if (isAcceptKey(e.key)) {
    e.stopImmediatePropagation();
    dispatch("accept");
  }
};
</script>

<Menu
  isEnabled="{isEnabled}"
  isOpen="{isOpen}"
  options="{options}"
  position="{position}"
  trigger="{trigger}"
  selectedIndex="{selectedIndex}"
  hoverIndex="{hoverIndex}"
  on:select
  ><Button
    bind:this="{button}"
    isDown="{isOpen}"
    canToggle="{trigger === 'mouseup'}"
    isEnabled="{isEnabled}"
    on:down="{onDown}"
    on:up="{onUp}"
    on:keydown
    on:keydown="{onButtonKeydown}"
    on:keyup="{onButtonKeyup}"
    on:keyup>
    <slot />
  </Button></Menu>
