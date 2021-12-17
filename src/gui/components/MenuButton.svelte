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

export function getIsOpen() {
  return isOpen;
}

export function setIsOpen(value: boolean) {
  isOpen = value;
  button.setIsDown(value);
}

let dispatch = createEventDispatcher();
let button: Button;

function open() {
  isOpen = true;
  hoverIndex = selectedIndex;
  dispatch("open");
}

function close() {
  isOpen = false;
  button.setIsDown(false);
  dispatch("close");
}

const onButtonDown = () => {
  open();

  if (trigger === "mouseup") {
    const handler = (e: MouseEvent) => {
      if (!button.containsEvent(e)) {
        onButtonUp();
      }
      window.removeEventListener("mousedown", handler);
    };
    setTimeout(() => window.addEventListener("mousedown", handler), 0);
  }
};

const onButtonUp = () => {
  close();
};

const onButtonKeydown = (e: KeyboardEvent) => {
  const { key } = e;
  if (isArrowKey(key)) {
    e.preventDefault();
  }
  if (isArrowVerticalKey(key) && !isOpen) {
    onButtonDown();
  }

  onMenuButtonKeydown(e);
};

const onButtonKeyup = (e: KeyboardEvent) => {
  if (isAcceptKey(e.key)) {
    const { isToggleDown } = button.getIsDown();
    if (hoverIndex > -1 && isToggleDown) {
      dispatch("accept");
      onMenuButtonAccept();
    }
  }
};

// accept
// keydown
// select

const onMenuButtonAccept = () => {
  if (hoverIndex > -1) {
    select(hoverIndex);
  }
};

const onMenuButtonKeydown = (e: KeyboardEvent) => {
  const { key, shiftKey } = e;
  if (key === "ArrowDown") {
    if (getIsOpen()) {
      increment();
    } else {
      hoverIndex = selectedIndex;
    }
  } else if (key === "ArrowUp") {
    if (getIsOpen()) {
      decrement();
    } else {
      hoverIndex = Math.min(options.length - 1, hoverIndex);
    }
  } else if (key === "Tab" && getIsOpen()) {
    if (shiftKey) {
      decrement();
    } else {
      increment();
    }
    e.preventDefault();
  } else if (key === "Escape") {
    setIsOpen(false);
  }
};

const onSelect = (e: CustomEvent) => {
  select(e.detail);
};

function increment() {
  hoverIndex = Math.min(options.length - 1, hoverIndex + 1);
}

function decrement() {
  hoverIndex = Math.max(0, hoverIndex - 1);
}

function select(index: number) {
  selectedIndex = index;
  setIsOpen(false);
  dispatch("change", { index: selectedIndex, value: options[selectedIndex] });
}
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
    noStyle="{noStyle}"
    on:pushed
    on:down="{onButtonDown}"
    on:up="{onButtonUp}"
    on:mouseover
    on:mouseout
    on:keydown
    on:keydown="{onButtonKeydown}"
    on:keyup="{onButtonKeyup}"
    on:keyup>
    <slot />
  </Button></Menu>
