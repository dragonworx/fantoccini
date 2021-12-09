<style lang="scss">
@import "../theme";
</style>

<script lang="ts">
import Button from "./Button.svelte";
import Menu from "./Menu.svelte";
import { MenuOption } from "../types";

export let options: MenuOption[];
export let isOpen: boolean = false;

const onDown = () => {
  isOpen = true;
};

const onUp = () => {};
</script>

<Button noStyle="{true}" on:mouseup="{onUp}" on:mousedown="{onDown}">
  <Menu isOpen="{isOpen}" options="{options}"><slot /></Menu>
</Button>
