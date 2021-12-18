<style lang="scss">
@import "../theme";
.menubar {
  @include linear_gradient(#40404e, #1f232c, 180deg);
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  padding: 1px 5px;

  li {
    margin-bottom: $spacing_small;
    display: flex;
    margin: 0;
  }
}

:global([data-component="button"].menubar-down) {
  background: linear-gradient(0deg, #2f343c 0, #1d2127 100%) !important;
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { select_options } from "svelte/internal";
import { isArrowHorizontalKey } from "../filters";
import { MenuBarItem, MenuItem } from "../types";
import Label from "./Label.svelte";
import MenuButton from "./MenuButton.svelte";

export let items: MenuBarItem[];

const dispatch = createEventDispatcher();

let currentLi: HTMLLIElement;
let currentIndex: number = -1;
let menuButtons: MenuButton[] = [];

function setCurrentIndex(i: number, li: HTMLLIElement) {
  let currentMenuButton = menuButtons[currentIndex];
  const wasOpen = currentMenuButton && currentMenuButton.getIsOpen();
  if (wasOpen) {
    currentMenuButton.setIsOpen(false);
  }
  currentIndex = i;
  currentLi = li;
  currentMenuButton = menuButtons[currentIndex];
  if (wasOpen) {
    currentMenuButton.setIsOpen(true);
  }
  currentMenuButton.focus();
}

const onMouseOver = (i: number) => (e: MouseEvent) => {
  if (currentIndex === -1) {
    setCurrentIndex(i, e.currentTarget as HTMLLIElement);
  } else {
    if (!currentLi.contains(e.currentTarget as Node)) {
      setCurrentIndex(i, e.currentTarget as HTMLLIElement);
    }
  }
};

const onMenuKeyDown = (e: KeyboardEvent) => {
  const { key } = e;
  if (key === "ArrowLeft" && currentIndex > 0) {
    setCurrentIndex(
      currentIndex - 1,
      currentLi.previousElementSibling as HTMLLIElement
    );
  } else if (key === "ArrowRight" && currentIndex < items.length - 1) {
    setCurrentIndex(
      currentIndex + 1,
      currentLi.nextElementSibling as HTMLLIElement
    );
  }
  if (isArrowHorizontalKey(key)) {
    const currentMenuButton = menuButtons[currentIndex];
  }
};

const onMenuClose = () => {
  const currentMenuButton = menuButtons[currentIndex];
  currentMenuButton.blur();
  currentIndex = -1;
  currentLi = undefined;
};

const onSelect = (e: CustomEvent) => {
  dispatch("select", e.detail);
};
const onMenuButtonDown = () => {};
</script>

<ul class="menubar" data-component="menubar">
  {#each items as { label, menu }, i}
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <li on:mouseover="{onMouseOver(i)}">
      <MenuButton
        bind:this="{menuButtons[i]}"
        options="{menu}"
        noStyle="{true}"
        customClasses="{{ down: 'menubar-down' }}"
        trigger="mouseup"
        on:pushed="{onMenuButtonDown}"
        on:keydown="{onMenuKeyDown}"
        on:close="{onMenuClose}"
        on:select="{onSelect}">
        <Label text="{label}" fontSize="{11}" />
      </MenuButton>
    </li>
  {/each}
</ul>
