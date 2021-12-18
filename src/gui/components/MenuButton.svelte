<style lang="scss">
@import "../theme";
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import Button from "./Button.svelte";
import Menu from "./Menu.svelte";
import { MenuItem, MenuPosition, MenuTrigger } from "../types";
import { isAcceptKey, isArrowKey, isArrowVerticalKey } from "../filters";

export let isEnabled: boolean = true;
export let options: MenuItem[];
export let selectedIndex: number = -1;
export let hoverIndex: number = selectedIndex;
export let trigger: MenuTrigger = "mousedown";
export let position: MenuPosition = "dropdown";
export let isOpen: boolean = false;
export let noStyle: boolean = false;
export let retainSelection: boolean = false;
export let customClasses: { down?: string } = {};

const dispatch = createEventDispatcher();
let button: Button;

export function getIsOpen() {
  return isOpen;
}

export function open() {
  isOpen = true;
  button.setIsDown(true);
  dispatch("open");

  setTimeout(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!button.containsEvent(e.target as Node)) {
        close();
      }
      window.removeEventListener("mousedown", onMouseDown);
    };
    window.addEventListener("mousedown", onMouseDown);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "Shift") {
        return;
      }
      if (!button.containsEvent(e.target as Node)) {
        close();
      }
      window.removeEventListener("keydown", onKeyDown);
    };
    window.addEventListener("keydown", onKeyDown);
  }, 0);
}

export function close() {
  isOpen = false;
  button.setIsDown(false);
  if (!retainSelection) {
    selectedIndex = hoverIndex = -1;
  }
  dispatch("close");
}

export function getButton() {
  return button;
}

export function clearSelection() {
  hoverIndex = selectedIndex = -1;
}

function increment() {
  hoverIndex = Math.min(options.length - 1, hoverIndex + 1);
}

function decrement() {
  hoverIndex = Math.max(0, hoverIndex - 1);
}

function select(index: number) {
  const option = options[index];
  option.onSelect && option.onSelect();
  dispatch("select", { index, option });
  if (retainSelection) {
    selectedIndex = hoverIndex = index;
  }
}

const onDown = () => {
  if (trigger === "mousedown") {
    open();
  }
};

const onUp = () => {
  if (trigger === "mousedown") {
    close();
  }
};

const onToggle = (e: CustomEvent) => {
  if (trigger === "mouseup") {
    if (e.detail) {
      open();
    } else {
      close();
    }
  }
};

const onSelect = (e: CustomEvent) => {
  select(e.detail);
};

const onKeyDown = (e: KeyboardEvent) => {
  const { key } = e;
  if (key === "ArrowUp" && isOpen) {
    decrement();
  } else if (key === "ArrowDown") {
    if (!isOpen) {
      open();
      return;
    }
    isOpen && increment();
  } else if (isAcceptKey(key) && isOpen) {
    hoverIndex > -1 && select(hoverIndex);
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
  on:select="{onSelect}"
  ><Button
    bind:this="{button}"
    isEnabled="{isEnabled}"
    canToggle="{trigger === 'mouseup'}"
    noStyle="{noStyle}"
    customClasses="{customClasses}"
    on:pushed
    on:down="{onDown}"
    on:down
    on:up="{onUp}"
    on:up
    on:toggle="{onToggle}"
    on:toggle
    on:keydown
    on:keydown="{onKeyDown}"
    on:keyup
    on:focus
    on:blur
    on:mouseover
    on:mouseout>
    <slot />
  </Button></Menu>
