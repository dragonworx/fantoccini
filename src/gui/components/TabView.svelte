<style lang="scss">
@import "../theme";
.tabview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

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
      position: relative;
    }

    li.tabview-tab:hover {
      @include linear_gradient(#4a4a4a, #4e4d4d);
    }

    li.tabview-tab {
      @include linear_gradient(#4a4a4a, #484848);
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
      @include linear_gradient(#505050, #6e6f70);
      height: calc(100% + 5px);
      top: -2px;
    }

    li.tabview-tab.selected:hover {
      @include linear_gradient(#505050, #737476);
    }
  }

  .tabview-content {
    flex-grow: 1;
    border-left: 1px solid #747474;
    border-right: 1px solid #2b2b2b;
    border-bottom: 1px solid #2b2b2b;
    border-radius: $border_radius_tiny;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    display: flex;
  }
}

.tabview.tool {
  ul {
    li {
      /* max-height: 17px; */
      height: calc(100% - 2px);
      top: 3px;
    }

    li.selected {
      height: calc(100% - 1px);
      top: 2px;
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
  @include button_close();
  border: none !important;
  box-shadow: none !important;
}

:global([data-component="tabview"].tool .tabview-tab [data-component="label"]) {
  font-size: 10px !important;
}
</style>

<script lang="ts">
import { setContext, createEventDispatcher } from "svelte";
import EventEmitter from "eventemitter3";
import { nextId, TabDocument } from "../";
import Label from "./Label.svelte";
import Icon from "./Icon.svelte";
import PushButton from "./PushButton.svelte";

export let selectedIndex: number = 0;
export let appearance: "document" | "tool" = "document";

const dispatch = createEventDispatcher();

let tabs: TabDocument[] = [];

const id = nextId();
const notifications = new EventEmitter();

setContext("tabs", {
  registerTab(tabDoc: TabDocument) {
    tabs = [...tabs, tabDoc];
    if (selectedIndex === -1) {
      selectedIndex = 0;
    }
    return tabs.length - 1;
  },

  unregisterTab(index: number) {
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
    dispatch("change", selectedIndex);
  }
};

const onCloseClick = (index: number) => () => {
  const onCanClose = tabs[index].onCanClose;
  if (onCanClose) {
    const canClose = onCanClose(index);
    if (!canClose) {
      return;
    }
  }
  dispatch("closing", index);
  tabs.splice(index, 1);
  tabs = [...tabs];
  if (selectedIndex === tabs.length) {
    selectedIndex--;
  }
  notifications.emit("change");
};
</script>

<div
  class="tabview"
  class:document="{appearance === 'document'}"
  class:tool="{appearance === 'tool'}"
  data-component="tabview">
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
  <div class="tabview-content"><slot /></div>
</div>
