<style lang="scss">
@import "../theme";
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import { fade } from "svelte/transition";
import {} from "../types";
import Button from "./Button.svelte";

export let prop: string = "foo";

export function api() {}

let local;

const onHandler = () => {};
</script>

<div></div>
