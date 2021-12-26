<style lang="scss">
@import "../theme";
:global(button[data-type="radio"].button .content) {
  padding: 4px;
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import type { Position } from "../";
import Label from "./Label.svelte";
import Button from "./Button.svelte";
import Icon from "./Icon.svelte";

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
  if (isEnabled && !isDown) {
    button.click();
    button.focus();
    dispatch("pressed", {
      index,
    });
  }
}

function onButtonKeyDown(e: KeyboardEvent) {
  const { key } = e;
  if (key == "ArrowUp" || key === "ArrowLeft") {
    e.preventDefault();
    dispatch("decrement");
  } else if (key == "ArrowDown" || key === "ArrowRight") {
    e.preventDefault();
    dispatch("increment");
  }
}
</script>

<Label
  isEnabled="{isEnabled}"
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
    hasToggleLock="{true}"
    appearance="round"
    type="radio"
    width="{18}"
    height="{18}"
    padding="{0}"
    on:keydown="{onButtonKeyDown}"
    on:change="{onButtonChange}"
    >{#if isDown}<Icon name="circle" width="{8}" />{/if}</Button
  ></Label>
