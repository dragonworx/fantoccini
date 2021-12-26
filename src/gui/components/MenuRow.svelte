<style lang="scss">
@import "../theme";
.menu-row {
  display: flex;
  flex-grow: 1;
  padding: $spacing_small ($spacing_small * 2);
  align-items: center;
  box-sizing: border-box;

  .menu-icon {
    width: 20px;
    height: 20px;
    display: flex;
    overflow: hidden;
    margin-right: $spacing_small * 2;
    justify-content: center;
  }

  .menu-expand {
    margin-left: $spacing_small;
    width: 10px;
    height: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu-shortcuts {
    margin-left: $spacing_small * 2;
    font-size: 10px;
    color: #9f9f9f;
    white-space: nowrap;

    border-radius: $spacing_small;
    padding: 2px;
  }
}

:global([data-component="menurow"] [data-component="label"]) {
  flex-grow: 1;
}

:global([data-component="menurow"] [data-component="icon"]) {
  width: 100%;
  align-self: center;
}
</style>

<script lang="ts" context="module">
export const staticVar = 500;
</script>

<script lang="ts">
import { MenuItem } from "../";
import Label from "./Label.svelte";
import Icon from "./Icon.svelte";

export let hasIcons: boolean = false;
export let hasShortCuts: boolean = false;

export let item: MenuItem;
</script>

<div class="menu-row" data-component="menurow">
  {#if hasIcons}
    <div class="menu-icon">
      {#if item.hasIcon}
        {#if item.canToggle}
          {#if item.isChecked}
            <Icon src="img/icons/tick.svg" size="{16}" />
          {/if}
        {:else}
          <Icon src="{item.icon}" />
        {/if}
      {/if}
    </div>
  {/if}
  <Label
    text="{item.label}"
    fontSize="{12}"
    isEnabled="{item.isEnabled !== false}" />
  {#if hasShortCuts}
    <div class="menu-shortcuts">
      {#if item.hasShortcut}
        {item.printShortcut}
      {/if}
    </div>
  {/if}
  {#if item.items}
    <div class="menu-expand">
      <Icon src="img/icons/play.svg" height="{10}" />
    </div>
  {/if}
</div>
