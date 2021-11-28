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
    height: 22px;
  }
}
</style>

<script lang="ts">
import Label from "./Label.svelte";
import Button from "./Button.svelte";
import Icon from "./Icon.svelte";
import type { RadioGroupOption, Position, Align } from "./types";

export let options: RadioGroupOption[] = [];
export let position: Position = "right";
export let align: Align = "start";

function onChange(event) {
  console.log("?", event.detail.isDown);
}
</script>

<ul>
  {#each options as { label, value }}
    <li>
      <Label text="{label}" position="{position}" align="{align}"
        ><Button
          isEnabled="{$$props.isEnabled}"
          isDown="{$$props.isDown}"
          canToggle="{true}"
          appearance="round"
          type="checkbox"
          on:change="{onChange}"><Icon name="circle" width="{8}" /></Button
        ></Label>
    </li>
  {/each}
</ul>
