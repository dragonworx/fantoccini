<style lang="scss">
@import "../theme";
.component {
}
</style>

<script lang="ts">
import { createEventDispatcher } from "svelte";
import {} from "../";
import Button from "./Button.svelte";

export let prop: string = "foo";
</script>

<div class="component" data-component="component"></div>
