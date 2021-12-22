<style lang="scss">
@import "../theme";

.radiogroup {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin: 0;
    margin-bottom: $spacing_small;
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import type { RadioGroupOption, Position } from "../";
import Radio from "./Radio.svelte";

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

function onIncrement() {
  selectedIndex = Math.max(0, selectedIndex - 1);
  dispatch("change", {
    selectedIndex,
    selectedValue: options[selectedIndex].value,
  });
}

function onDecrement() {
  selectedIndex = Math.min(options.length - 1, selectedIndex + 1);
  dispatch("change", {
    selectedIndex,
    selectedValue: options[selectedIndex].value,
  });
}
</script>

<ul class="radiogroup" data-component="radiogroup">
  {#each options as { label, value }, i}
    <li>
      <Radio
        isEnabled="{isEnabled}"
        position="{position}"
        isDown="{selectedIndex === i}"
        label="{label}"
        index="{i}"
        on:pressed="{onPressed}"
        on:decrement="{onIncrement}"
        on:increment="{onDecrement}" />
    </li>
  {/each}
</ul>
