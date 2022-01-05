<script lang="ts">
import { getContext, onMount, onDestroy } from "svelte";
import { onCanCloseHandler } from "../";
import { MenuBarItem } from "../menu";
import Panel from "./Panel.svelte";

export let title: string = "";
export let icon: string | undefined = undefined;
export let isClosable: boolean = true;
export let menuBar: MenuBarItem[] | undefined = undefined;
export let onCanClose: onCanCloseHandler | undefined = undefined;

let index: number = -1;
let visible: boolean = false;

const { registerTab, unregisterTab, isVisible, notifications } =
  getContext("tabs");

const onChange = () => {
  visible = isVisible(index);
};

onMount(() => {
  index = registerTab({ title, icon, isClosable, onCanClose });
  onChange();
  notifications.on("change", onChange);
});

onDestroy(() => {
  unregisterTab(index);
  notifications.off("change", onChange);
});
</script>

{#if visible}
  <Panel menuBar="{menuBar}"><slot /></Panel>
{/if}
