<style lang="scss">
@import "../theme";

.buttongroup {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;

  li {
    margin-bottom: $spacing_small;
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
import PushButton from "./PushButton.svelte";
import type { ButtonGroupOption, Position } from "../types";

export let isEnabled: boolean = true;
export let options: ButtonGroupOption[] = [];
export let selectedIndex: number = -1;
export let position: Position = "right";

const dispatch = createEventDispatcher();

function onPressed(event) {
  const index = event.detail.index;
  if (selectedIndex !== index) {
    selectedIndex = index;
    dispatch("change", {
      selectedIndex,
      selectedValue: options[selectedIndex].name,
    });
  }
}

function onIncrement() {
  selectedIndex = Math.max(0, selectedIndex - 1);
  dispatch("change", {
    selectedIndex,
    selectedValue: options[selectedIndex].name,
  });
}

function onDecrement() {
  selectedIndex = Math.min(options.length - 1, selectedIndex + 1);
  dispatch("change", {
    selectedIndex,
    selectedValue: options[selectedIndex].name,
  });
}
</script>

<ul class="buttongroup" data-component="buttongroup">
  {#each options as { icon, name, tip }, i}
    <li>
      <PushButton
        isEnabled="{isEnabled}"
        isDown="{selectedIndex === i}"
        iconSrc="{icon}"
        canToggle="{true}"
        on:pressed="{onPressed}"
        on:decrement="{onIncrement}"
        on:increment="{onDecrement}" />
    </li>
  {/each}
</ul>
