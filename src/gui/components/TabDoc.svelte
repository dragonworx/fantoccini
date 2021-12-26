<style lang="scss">
@import "../theme";
.tabdoc {
}
</style>

<script lang="ts">
import { getContext, onMount, onDestroy } from "svelte";
import {} from "../";

export let title: string = "";
export let icon: string | undefined = undefined;
export let isClosable: boolean = true;
export let isMovable: boolean = true;

let index: number = -1;
let visible: boolean = false;

const { registerTab, unregisterTab, isVisible, notifications } =
  getContext("tabs");

const onChange = () => {
  visible = isVisible(index);
};

onMount(() => {
  index = registerTab({ title, icon, isClosable, isMovable });
  onChange();
  notifications.on("change", () => {
    console.log("change");
    onChange();
  });
});

onDestroy(() => {
  unregisterTab(index);
});
</script>

{#if visible}
  <div class="tabdoc" data-component="tabdoc">
    <slot />
  </div>
{/if}
