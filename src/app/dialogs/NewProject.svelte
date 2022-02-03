<script lang="ts">
import { Hub, Event } from "../eventHub";
import Label from "../../gui/components/Label.svelte";
import Form from "../../gui/components/Form.svelte";
import TextField from "../../gui/components/TextField.svelte";
import Spinner from "../../gui/components/Spinner.svelte";
import Window from "../../gui/components/Window.svelte";
import DialogButtons from "../../gui/components/DialogButtons.svelte";
import { screenWidth, screenHeight } from "../screen";
import { defaultProjectSettings } from "../../core/project";

let isOpen: boolean = false;

Hub.on(Event.Dialog_Show_New, () => (isOpen = true));

$: projectOptions = { ...defaultProjectSettings };

$: windowWidth = 300;
$: windowHeight = 200;

const onClose = () => {
  isOpen = false;
};

const onAccept = () => {
  isOpen = false;
  Hub.emit(Event.Project_Create, projectOptions);
};
</script>

<main>
  <Window
    id="newProject"
    isOpen="{isOpen}"
    title="New Project"
    x="{screenWidth * 0.5 - windowWidth * 0.5}"
    y="{screenHeight * 0.5 - windowHeight * 0.5}"
    width="{windowWidth}"
    height="{windowHeight}"
    canMaximise="{false}"
    canMinimise="{false}"
    on:close="{onClose}">
    <div class="layout">
      <Form labelSize="{50}">
        <Label text="Title:" /><TextField
          bind:value="{projectOptions.title}"
          autofocus />
        <Label text="FPS:" /><Spinner
          value="{projectOptions.fps}"
          on:change="{(e) => (projectOptions.fps = e.detail)}" />
        <Label text="Dimension:" />
        <div class="dimension">
          <Spinner
            value="{projectOptions.width}"
            on:change="{(e) => (projectOptions.width = e.detail)}" />
          <Label text="x" />
          <Spinner
            value="{projectOptions.height}"
            on:change="{(e) => (projectOptions.height = e.detail)}" />
        </div>
      </Form>
      <DialogButtons
        acceptText="Create Project"
        on:accept="{onAccept}"
        on:cancel="{onClose}" />
    </div>
  </Window>
</main>

<style lang="scss">
.layout {
  display: flex;
  justify-content: center;
  flex-grow: 1;
  margin-top: 10px;

  .dimension {
    display: flex;
    width: 140px;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
