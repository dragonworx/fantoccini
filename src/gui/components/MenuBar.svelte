<style lang="scss">
@import "../theme";
.menubar {
  @include linear_gradient(#40404e, #1f232c);
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  padding: 1px 5px;

  li {
    margin-bottom: $spacing_small;
    display: flex;
    margin: 0;
  }
}
</style>

<script context="module">
export const staticVar = 500;
</script>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { fade } from "svelte/transition";
import { MenuBarItem } from "../types";
import Label from "./Label.svelte";
import MenuButton from "./MenuButton.svelte";

export let items: MenuBarItem[];

export function api() {}

let local;

const onHandler = () => {};
</script>

<ul class="menubar" data-component="menubar">
  {#each items as { label, menu }, i}
    <li>
      <MenuButton options="{menu}" noStyle="{true}" trigger="mouseup">
        <Label text="{label}" fontSize="{11}" />
      </MenuButton>
    </li>
  {/each}
</ul>
