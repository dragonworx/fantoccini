<style lang="scss">
@import "theme";
:global(button[data-type="checkbox"] .content) {
  padding: 4px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin-bottom: $spacing_small;
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import Radio from "./Radio.svelte";
import type { RadioGroupOption, Position } from ".";

export let isEnabled: boolean = true;
export let options: RadioGroupOption[] = [];
export let selectedIndex: number = -1;
export let position: Position = "right";

const dispatch = createEventDispatcher();

function onPressed(event) {
  const index = event.detail.index;
  if (selectedIndex !== index) {
    selectedIndex = index;
    dispatch("change", {
      selectedIndex,
      selectedValue: options[selectedIndex].value,
    });
  }
}
</script>

<ul>
  {#each options as { label, value }, i}
    <li>
      <Radio
        isEnabled="{isEnabled}"
        position="{position}"
        isDown="{selectedIndex === i}"
        label="{label}"
        index="{i}"
        on:pressed="{onPressed}" />
    </li>
  {/each}
</ul>
