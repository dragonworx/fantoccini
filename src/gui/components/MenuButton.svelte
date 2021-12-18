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

export function getIsOpen() {
  return isOpen;
}

export function blur() {
  button.blur();
}

export function setIsOpen(value: boolean) {
  if (value === true) {
    onButtonDown();
  } else {
    close();
  }
}

export function focus() {
  button.focus();
}

const dispatch = createEventDispatcher();
let button: Button;
let wasOpened = false;

function open() {
  isOpen = true;
  hoverIndex = selectedIndex;
  button.applyCustomDownStyle();
  button.focus();
  dispatch("open");
}

function close(shouldDispatch: boolean = true) {
  isOpen = false;
  button.setIsDown(false);
  shouldDispatch && dispatch("close");
  if (!retainSelection) {
    selectedIndex = hoverIndex = -1;
  }
  button.clearCustomClasses();
}

function increment() {
  hoverIndex = Math.min(options.length - 1, hoverIndex + 1);
}

function decrement() {
  hoverIndex = Math.max(0, hoverIndex - 1);
}

function select(index: number) {
  selectedIndex = index;
  options[selectedIndex].onSelect && options[selectedIndex].onSelect();
  dispatch("select", {
    index: selectedIndex,
    option: options[selectedIndex],
  });
  setIsOpen(false);
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
  console.log(2, { wasOpened });
  !wasOpened && close(false);
  if (wasOpened) {
    button.setIsDown(true);
  }
};

const onButtonKeydown = (e: KeyboardEvent) => {
  const { key, shiftKey } = e;
  wasOpened = false;

  if (isArrowKey(key)) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  if ((isArrowVerticalKey(key) || isAcceptKey(key)) && !isOpen) {
    console.log("$!@$!");
    onButtonDown();
    wasOpened = true;

    return;
  }

  if (key === "ArrowDown") {
    if (isOpen) {
      increment();
    } else {
      hoverIndex = selectedIndex;
    }
  } else if (key === "ArrowUp") {
    if (isOpen) {
      decrement();
    } else {
      hoverIndex = Math.min(options.length - 1, hoverIndex);
    }
  } else if (key === "Tab" && isOpen) {
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

const onButtonKeyup = (e: KeyboardEvent) => {
  if (isAcceptKey(e.key)) {
    const { isToggleDown } = button.getIsDown();
    if (
      (hoverIndex > -1 && isToggleDown && trigger === "mouseup") ||
      trigger === "mousedown"
    ) {
      dispatch("accept");
      onMenuButtonAccept();
    }
  }

  if (trigger === "mouseup" && !wasOpened) {
    console.log(1, { wasOpened });
    button.setIsToggleDown(true);
  }
};

const onMenuButtonAccept = () => {
  if (hoverIndex > -1) {
    select(hoverIndex);
  }
};

const onSelect = (e: CustomEvent) => {
  select(e.detail);
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
    isDown="{isOpen}"
    canToggle="{trigger === 'mouseup'}"
    isEnabled="{isEnabled}"
    noStyle="{noStyle}"
    customClasses="{customClasses}"
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
