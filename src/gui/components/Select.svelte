<style lang="scss">
@import "../theme";

:global(.select
    [data-component="menu-button"]
    [data-component="button-content"]) {
  min-height: 24px - ($spacing_small * 2);
}

:global(.select [data-component="label"], .select [data-component="button"]) {
  flex-grow: 1;
}

.select {
  .select-content {
    display: flex;
    width: 100%;
    padding-left: $spacing_small;
    height: 13px;

    .select-separator {
      border-left: 1px solid #626262;
      border-right: 1px solid #1c1c1c;
      margin-left: $spacing_small;
      margin-right: $spacing_small;
    }
  }
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { MenuItem } from "../";
import Icon from "./Icon.svelte";
import Label from "./Label.svelte";
import MenuButton from "./MenuButton.svelte";

export let isEnabled: boolean = true;
export let items: MenuItem[];
export let width: number = -1;
export let selectedIndex: number = -1;
export let placeholder: string = "";

const dispatch = createEventDispatcher();

$: selectedItem = selectedIndex > -1 ? items[selectedIndex] : undefined;

$: style = `width:${width === -1 ? "auto" : `${width}px`}`;
$: prompt = selectedItem ? selectedItem.label : placeholder;

const onSelect = (e: CustomEvent) => {
  const item = e.detail as MenuItem;
  if (selectedItem !== item) {
    dispatch("change", item);
  }
  selectedItem = item;
};
</script>

<div
  class="select"
  class:enabled="{isEnabled}"
  class:disabled="{!isEnabled}"
  data-component="select"
  style="{style}">
  <MenuButton
    isEnabled="{isEnabled}"
    items="{items}"
    trigger="{'mouseup'}"
    selectedIndex="{items.indexOf(selectedItem)}"
    retainSelection="{true}"
    on:select="{onSelect}">
    <div class="select-content">
      <Label text="{String(prompt)}" />
      <div class="select-separator"></div>
      <Icon src="img/icons/select.svg" height="{12}" />
    </div>
  </MenuButton>
</div>
