<style lang="scss">
@import "../theme";

:global([data-component="menu-button"] [data-component="button-content"]) {
  min-height: 24px - ($spacing_small * 2);
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { MenuOption, MenuItem } from "../types";
import Label from "./Label.svelte";
import MenuButton from "./MenuButton.svelte";

export let options: MenuOption[];
export let selectedIndex: number = -1;

$: style = `width:${
  options.reduce(
    (width, option) =>
      width +
      (typeof option === "string" ? option.length : option.label.length),
    0
  ) * 3
}px`;

$: prompt =
  selectedIndex === -1
    ? ""
    : typeof options[selectedIndex] === "string"
    ? options[selectedIndex]
    : (options[selectedIndex] as MenuItem).label;

const onSelect = (e: CustomEvent) => {
  selectedIndex = e.detail;
};
</script>

<div data-component="menu-button" style="{style}">
  <MenuButton
    options="{options}"
    trigger="{'mouseup'}"
    selectedIndex="{selectedIndex}"
    on:select="{onSelect}">
    <Label text="{String(prompt)}" />
  </MenuButton>
</div>
