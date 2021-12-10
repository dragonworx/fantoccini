<style lang="scss">
@import "../theme";
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { MenuOption } from "../types";
import Button from "./Button.svelte";
import MenuButton from "./MenuButton.svelte";

export let options: MenuOption[];
export let selectedIndex: number = -1;

export function api() {}

let menuButton: MenuButton;

const onOpen = () => {
  console.log("!open");
};

const onClose = () => {
  console.log("!close");
};

const onButtonUp = () => {};
</script>

<MenuButton
  bind:this="{menuButton}"
  options="{options}"
  trigger="{'mouseup'}"
  selectedIndex="{selectedIndex}"
  on:open="{onOpen}"
  on:close="{onClose}">
  <Button on:up="{onButtonUp}">Select</Button>
</MenuButton>
