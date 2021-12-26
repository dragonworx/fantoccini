<style lang="scss">
@import "../theme";
.component {
}
</style>

<script context="module">
export const staticVar = 500;
</script>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { fade } from "svelte/transition";
import {} from "../";
import Button from "./Button.svelte";

export let prop: string = "foo";

export function api() {}

let local;

const onHandler = () => {};
</script>

<div class="component" data-component="component"></div>
