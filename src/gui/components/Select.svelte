<style lang="scss">
@import "../theme";

:global(.select
    [data-component="menu-button"]
    [data-component="button-content"]) {
  min-height: 24px - ($spacing_small * 2);
}

:global(.select [data-component="label"], .select [data-component="button"]) {
  flex-grow: 1;
}

.select {
  .select-content {
    display: flex;
    width: 100%;
    padding-left: $spacing_small;
    height: 13px;

    .select-separator {
      border-left: 1px solid #626262;
      border-right: 1px solid #1c1c1c;
      margin-left: $spacing_small;
      margin-right: $spacing_small;
    }
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import Icon from "./Icon.svelte";
import Label from "./Label.svelte";
import MenuButton from "./MenuButton.svelte";

export let isEnabled: boolean = true;
export let options: string[];
export let width: number = -1;
export let selectedIndex: number = -1;
export let placeholder: string = "";

let dispatch = createEventDispatcher();
let menuButton: MenuButton;
let hoverIndex: number = selectedIndex;

$: style = `width:${width === -1 ? "auto" : `${width}px`}`;
$: prompt = selectedIndex === -1 ? placeholder : options[selectedIndex];

function increment() {
  hoverIndex = Math.min(options.length - 1, hoverIndex + 1);
}

function decrement() {
  hoverIndex = Math.max(0, hoverIndex - 1);
}

function select(index: number) {
  selectedIndex = index;
  menuButton.setIsOpen(false);
  dispatch("change", { index: selectedIndex, value: options[selectedIndex] });
}

const onSelect = (e: CustomEvent) => {
  select(e.detail);
};

const onMenuButtonKeydown = (e: KeyboardEvent) => {
  const { key, shiftKey } = e;
  if (key === "ArrowDown") {
    if (menuButton.getIsOpen()) {
      increment();
    } else {
      hoverIndex = Math.max(0, hoverIndex);
    }
  } else if (key === "ArrowUp") {
    if (menuButton.getIsOpen()) {
      decrement();
    } else {
      hoverIndex = Math.min(options.length - 1, hoverIndex);
    }
  } else if (key === "Tab" && menuButton.getIsOpen()) {
    if (shiftKey) {
      decrement();
    } else {
      increment();
    }
    e.preventDefault();
  } else if (key === "Escape") {
    menuButton.setIsOpen(false);
  }
};

const onMenuButtonAccept = () => {
  if (hoverIndex > -1) {
    select(hoverIndex);
  }
};
</script>

<div
  class="select"
  class:enabled="{isEnabled}"
  class:disabled="{!isEnabled}"
  data-component="select"
  style="{style}">
  <MenuButton
    bind:this="{menuButton}"
    isEnabled="{isEnabled}"
    options="{options.map((value) => ({ label: value }))}"
    trigger="{'mouseup'}"
    selectedIndex="{selectedIndex}"
    hoverIndex="{hoverIndex}"
    on:accept="{onMenuButtonAccept}"
    on:keydown="{onMenuButtonKeydown}"
    on:select="{onSelect}">
    <div class="select-content">
      <Label text="{String(prompt)}" />
      <div class="select-separator"></div>
      <Icon src="img/icons/select.svg" height="{12}" />
    </div>
  </MenuButton>
</div>
