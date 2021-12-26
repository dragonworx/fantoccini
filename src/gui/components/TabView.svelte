<style lang="scss">
@import "../theme";
.tabview {
  width: 100%;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;

    li {
      box-sizing: border-box;
      padding: $spacing_tiny $spacing_small * 2;
      display: flex;
      align-items: center;
    }

    li.tabview-tab {
      @include linear_gradient(#35383e, #4f545a);
      border-left: 1px solid #747474;
      border-top: 1px solid #747474;
      border-right: 1px solid #2b2b2b;
      border-top-left-radius: $border_radius_small;
      border-top-right-radius: $border_radius_small;
      min-width: 10px;
      cursor: pointer;
    }

    li.tabview-spacer {
      flex-grow: 1;
    }

    li.selected {
      @include linear_gradient(#35383e, #656f7b);
    }
  }
}

:global([data-component="tabview"] .tabview-tab *) {
  margin-right: $spacing_small;
}

:global([data-component="tabview"] .tabview-tab *:last-child) {
  margin-right: 0;
}

:global([data-component="tabview"] .tabview-tab [data-component="button"]) {
  border: none;
  box-shadow: none;
  @include button_close();
}
</style>

<script lang="ts">
import { setContext } from "svelte";
import EventEmitter from "eventemitter3";
import { nextId, TabDocument } from "../";
import Label from "./Label.svelte";
import Icon from "./Icon.svelte";
import PushButton from "./PushButton.svelte";
export let selectedIndex: number = 0;

let tabs: TabDocument[] = [];

const id = nextId();
const notifications = new EventEmitter();

setContext("tabs", {
  registerTab(tabDoc: TabDocument) {
    tabs = [...tabs, tabDoc];
    console.log("register", id, tabs.length - 1);
    if (selectedIndex === -1) {
      selectedIndex = 0;
    }
    return tabs.length - 1;
  },

  unregisterTab(index: number) {
    console.log("unregister", id, index);
    tabs.splice(index, 1);
    tabs = [...tabs];
  },

  isVisible(index: number) {
    return selectedIndex === index;
  },

  notifications,
});

const onMouseDown = (i: number) => (e: MouseEvent) => {
  if (selectedIndex !== i) {
    selectedIndex = i;
    notifications.emit("change");
  }
};

const onCloseClick = (index: number) => () => {
  tabs.splice(index, 1);
  tabs = [...tabs];
  if (selectedIndex === tabs.length) {
    selectedIndex--;
  }
  notifications.emit("change");
};
</script>

<div class="tabview" data-component="tabview">
  <ul>
    {#each tabs as { title, isClosable, icon }, i (i)}
      <li
        class="tabview-tab"
        class:selected="{i === selectedIndex}"
        on:mousedown="{onMouseDown(i)}">
        {#if icon}
          <Icon src="{icon}" height="{16}" />
        {/if}
        <Label text="{title}" />
        {#if isClosable}
          <PushButton
            iconSrc="img/icons/cross.svg"
            iconSize="{10}"
            padding="{2}"
            canFocus="{false}"
            on:click="{onCloseClick(i)}" />
        {/if}
      </li>
    {/each}
    <li class="tabview-spacer"></li>
  </ul>
  <slot />
</div>
