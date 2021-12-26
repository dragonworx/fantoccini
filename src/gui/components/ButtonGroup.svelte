<style lang="scss">
@import "../theme";

.buttongroup {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;

  li {
    margin-bottom: $spacing_small;
    display: flex;
    margin: 0;
  }
}

/** outer */
:global([data-component="buttongroup"] [data-component="button"]) {
  border-radius: 0 !important;
}

:global([data-component="buttongroup"]
    li:first-child
    [data-component="button"]) {
  border-top-left-radius: $border_radius_small !important;
  border-bottom-left-radius: $border_radius_small !important;
}

:global([data-component="buttongroup"]
    li:last-child
    [data-component="button"]) {
  border-top-right-radius: $border_radius_small !important;
  border-bottom-right-radius: $border_radius_small !important;
}

/** inner */
:global([data-component="buttongroup"] [data-component="button"]:before) {
  border-radius: 0 !important;
}

:global([data-component="buttongroup"]
    li:first-child
    [data-component="button"]:before) {
  border-top-left-radius: $border_radius_small !important;
  border-bottom-left-radius: $border_radius_small !important;
}

:global([data-component="buttongroup"]
    li:last-child
    [data-component="button"]:before) {
  border-top-right-radius: $border_radius_small !important;
  border-bottom-right-radius: $border_radius_small !important;
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import type { ButtonGroupOption } from "../";
import PushButton from "./PushButton.svelte";

export let isEnabled: boolean = true;
export let options: ButtonGroupOption[] = [];
export let selectedIndex: number = -1;
export let canReset: boolean = false;

const dispatch = createEventDispatcher();

function dispatchChange() {
  dispatch("change", {
    selectedIndex,
    selectedValue:
      selectedIndex === -1 ? undefined : options[selectedIndex].name,
  });
}

const onButtonDown = (index: number) =>
  function onButtonDown() {
    if (selectedIndex == index) {
      if (canReset) {
        selectedIndex = -1;
        dispatchChange();
      }
    } else {
      selectedIndex = index;
      dispatchChange();
    }
  };

const onButtonKeyDown = (index: number) =>
  function onButtonKeyDown(e: KeyboardEvent) {
    if (selectedIndex == index) {
      if (canReset) {
        selectedIndex = -1;
        dispatchChange();
        e.stopImmediatePropagation();
      }
    }
  };
</script>

<ul class="buttongroup" data-component="buttongroup">
  {#each options as { icon, label }, index}
    <li>
      <PushButton
        isEnabled="{isEnabled}"
        isDown="{selectedIndex === index}"
        isControlled="{true}"
        label="{label}"
        iconSrc="{icon}"
        on:keydown="{onButtonKeyDown(index)}"
        on:push="{onButtonDown(index)}" />
    </li>
  {/each}
</ul>
