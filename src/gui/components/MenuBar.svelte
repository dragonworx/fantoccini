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
import { isAcceptKey } from "../filters";
import { MenuBarItem } from "../types";
import Label from "./Label.svelte";
import MenuButton from "./MenuButton.svelte";

export let items: MenuBarItem[];

const dispatch = createEventDispatcher();

let currentIndex: number = -1;
let menuButtons: MenuButton[] = [];
let liElements: HTMLLIElement[] = [];

function getCurrentMenuButton() {
  return menuButtons[currentIndex];
}

function setCurrentIndex(i: number) {
  let currentMenuButton = getCurrentMenuButton();
  const wasOpen = currentMenuButton && currentMenuButton.getIsOpen();
  if (wasOpen) {
    currentMenuButton.close();
  }
  currentIndex = i;
  currentMenuButton = getCurrentMenuButton();
  if (wasOpen) {
    currentMenuButton.open();
  }
  currentMenuButton.getButton().focus();
}

const onMouseOver = (i: number) => (e: MouseEvent) => {
  if (currentIndex === -1) {
    setCurrentIndex(i);
  } else {
    if (!liElements[currentIndex].contains(e.currentTarget as Node)) {
      setCurrentIndex(i);
    }
  }
};

const onKeyDown = (e: KeyboardEvent) => {
  const { key } = e;
  if (key === "ArrowLeft" && currentIndex >= 0) {
    if (
      getCurrentMenuButton().hasPreviousSubMenu() &&
      getCurrentMenuButton().getStack().length > 1
    ) {
      getCurrentMenuButton().getActiveStack().setHoverIndex(-1);
      getCurrentMenuButton().getActiveStack().isActive = false;
      console.log("back");
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  } else if (key === "ArrowRight" && currentIndex < items.length - 1) {
    if (getCurrentMenuButton().hasCurrentSubMenu()) {
      getCurrentMenuButton().getStackTop().isActive = true;
      getCurrentMenuButton().getActiveStack().setHoverIndex(0);
      console.log("forward");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }
};

const onKeyUp = (e: KeyboardEvent) => {
  if (isAcceptKey(e.key)) {
    getCurrentMenuButton().getButton().blur();
  }
};

const onFocusOrOpen = (i: number) => () => {
  if (currentIndex !== i) {
    setCurrentIndex(i);
  }
};

const onSelect = (e: CustomEvent) => {
  dispatch("select", {
    menu: items[currentIndex],
    option: e.detail,
  });
};
</script>

<ul class="menubar" data-component="menubar">
  {#each items as { label, menu }, i}
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <li bind:this="{liElements[i]}" on:mouseover="{onMouseOver(i)}">
      <MenuButton
        bind:this="{menuButtons[i]}"
        options="{menu}"
        noStyle="{true}"
        customClasses="{{ down: 'menubar-down' }}"
        trigger="mouseup"
        on:keydown="{onKeyDown}"
        on:keyup="{onKeyUp}"
        on:focus="{onFocusOrOpen(i)}"
        on:open="{onFocusOrOpen(i)}"
        on:select="{onSelect}">
        <Label text="{label}" fontSize="{11}" />
      </MenuButton>
    </li>
  {/each}
</ul>
