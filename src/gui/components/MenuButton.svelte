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

$: isMouseUp = trigger === "mouseup";
$: isMouseDown = trigger === "mousedown";

const onButtonDown = () => {
  open();

  if (isMouseUp) {
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
};

const onButtonKeyup = (e: KeyboardEvent) => {
  if (isAcceptKey(e.key)) {
    const { isToggleDown } = button.getIsDown();
    if (hoverIndex > -1 && isToggleDown) {
      dispatch("accept");
    }
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
