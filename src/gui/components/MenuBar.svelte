<style lang="scss">
@import "../theme";
.menubar {
  @include linear_gradient(#40404e, #1f232c);
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
</style>

<script context="module">
export const staticVar = 500;
</script>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { fade } from "svelte/transition";
import { MenuBarItem } from "../types";
import Label from "./Label.svelte";
import MenuButton from "./MenuButton.svelte";

export let items: MenuBarItem[];

let currentLi: HTMLLIElement;
let currentIndex: number = -1;
let menuButtons: MenuButton[] = [];

const onMouseOver = (i: number) => (e: MouseEvent) => {
  if (currentIndex === -1) {
    currentLi = e.currentTarget as HTMLLIElement;
    currentIndex = i;
  } else {
    if (!currentLi.contains(e.target as Node)) {
      let currentMenuButton = menuButtons[currentIndex];
      const wasOpen = currentMenuButton.getIsOpen();
      if (wasOpen) {
        currentMenuButton.setIsOpen(false);
      }
      currentIndex = i;
      currentLi = e.target as HTMLLIElement;
      currentMenuButton = menuButtons[currentIndex];
      if (wasOpen) {
        currentMenuButton.setIsOpen(true);
      }
    }
  }
};
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
        trigger="mouseup">
        <Label text="{label}" fontSize="{11}" />
      </MenuButton>
    </li>
  {/each}
</ul>
