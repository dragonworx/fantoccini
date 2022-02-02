<style lang="scss">
  .layout {
    display: flex;
    justify-content: center;
    flex-grow: 1;
    margin-top: 10px;
  }
</style>

<script lang="ts">
  import { events, AppEvent } from "../events";
  import Label from "../../gui/components/Label.svelte";
  import Form from "../../gui/components/Form.svelte";
  import TextField from "../../gui/components/TextField.svelte";
  import Spinner from "../../gui/components/Spinner.svelte";
  import Window from "../../gui/components/Window.svelte";
  import DialogButtons from "../../gui/components/DialogButtons.svelte";
  import app from "../application";

  let isOpen: boolean = false;

  events.on(AppEvent.ShowNewDialog, () => (isOpen = true));

  $: state = {
    title: "Untitled",
    fps: 24,
  };

  $: screenWidth = app.screenWidth;
  $: screenHeight = app.screenHeight;
  $: windowWidth = 300;
  $: windowHeight = 160;

  const onClose = () => {
    isOpen = false;
  };

  const onAccept = () => {
    isOpen = false;
    events.emit(AppEvent.CreateNewProject, state);
  };
</script>

<main>
  <Window
    id="newProject"
    {isOpen}
    title="New Project"
    x={screenWidth * 0.5 - windowWidth * 0.5}
    y={screenHeight * 0.5 - windowHeight * 0.5}
    width={windowWidth}
    height={windowHeight}
    canMaximise={false}
    canMinimise={false}
    on:close={onClose}>
    <div class="layout">
      <Form labelSize={50}>
        <Label text="Title:" /><TextField bind:value={state.title} />
        <Label text="FPS:" /><Spinner
          value={state.fps}
          on:change={(e) => (state.fps = e.detail)} />
      </Form>
      <DialogButtons
        acceptText="Create Project"
        on:accept={onAccept}
        on:cancel={onClose} />
    </div>
  </Window>
</main>
