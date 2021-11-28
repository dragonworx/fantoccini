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
import Label from "./Label.svelte";
import Button from "./Button.svelte";
import Icon from "./Icon.svelte";
import type { Position } from "./types";

export let isEnabled: boolean = true;
export let label: string;
export let isDown: boolean = false;
export let index: number = -1;
export let position: Position = "right";

const dispatch = createEventDispatcher();

let button;

function onButtonChange(event) {
  if (event.detail.isDown) {
    dispatch("pressed", {
      index,
    });
    isDown = true;
  }
}

function onLabelMouseUp() {
  if (!isDown) {
    button.click();
    dispatch("pressed", {
      index,
    });
  }
}
</script>

<Label
  text="{label}"
  position="{position}"
  align="center"
  justify="center"
  on:mouseup="{onLabelMouseUp}"
  ><Button
    bind:this="{button}"
    isEnabled="{isEnabled}"
    isDown="{isDown}"
    canToggle="{true}"
    appearance="round"
    type="checkbox"
    width="{18}"
    height="{18}"
    on:change="{onButtonChange}"
    >{#if isDown}<Icon name="circle" width="{8}" />{/if}</Button
  ></Label>
