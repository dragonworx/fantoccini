<style lang="scss">
@import "../theme";
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import Button from "./Button.svelte";
import Menu, { MenuStackItem, onSelectHandler } from "./Menu.svelte";
import { MenuItem, MenuPosition, MenuTrigger } from "../types";
import { isAcceptKey, isModifier } from "../filters";

export let isEnabled: boolean = true;
export let items: MenuItem[];
export let selectedIndex: number = -1;
export let hoverIndex: number = selectedIndex;
export let trigger: MenuTrigger = "mousedown";
export let position: MenuPosition = "dropdown";
export let isOpen: boolean = false;
export let noStyle: boolean = false;
export let retainSelection: boolean = false;
export let customClasses: { down?: string } = {};

const stack: MenuStackItem[] = [];
const dispatch = createEventDispatcher();
let button: Button;
let menu: Menu;

const onSelect: onSelectHandler = (item: MenuItem) => {
  item.onSelect && item.onSelect();
  dispatch("select", item);
};

export function getIsOpen() {
  return isOpen;
}

export function open() {
  isOpen = true;
  hoverIndex = selectedIndex;
  stack.length && stack[0].setHoverIndex(selectedIndex);
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
      if (isModifier(e.key)) {
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
    menu.clear(true);
  } else {
    menu.clear();
  }
  dispatch("close");
  stack.length = 0;
}

export function getButton() {
  return button;
}

export function getHoverIndex() {
  return hoverIndex;
}

export function hasCurrentSubMenu() {
  return getActiveStack().hasCurrentSubMenu();
}

export function hasPreviousSubMenu() {
  const index = getActiveStackIndex();
  return index > 0 && stack[index - 1].hasCurrentSubMenu();
}

export function getStack() {
  return stack;
}

export function getActiveStack() {
  const index = getActiveStackIndex();
  return stack[index];
}

export function getActiveStackIndex() {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].isActive) {
      return i;
    }
  }
}

export function getStackTop() {
  return stack[stack.length - 1];
}

function increment() {
  const listener = getActiveStack();
  listener.setHoverIndex(
    Math.min(listener.getItems().length - 1, listener.getHoverIndex() + 1)
  );
}

function decrement() {
  const listener = getActiveStack();
  listener.setHoverIndex(Math.max(0, listener.getHoverIndex() - 1));
}

function select(item: MenuItem) {
  item.onSelect && item.onSelect();
  dispatch("select", item);
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
    if (getActiveStack().getHoverIndex() > -1) {
      select(getActiveStack().getCurrentItem());
    }
  } else if (key === "Escape") {
    close();
  }
};
</script>

<Menu
  bind:this="{menu}"
  isOpen="{isOpen}"
  items="{items}"
  position="{position}"
  trigger="{trigger}"
  selectedIndex="{selectedIndex}"
  stack="{stack}"
  onSelect="{onSelect}"
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
