<script lang="ts">
import hub from 'src/core/hub';
import {
  Label,
  Form,
  TextField,
  Spinner,
  Window,
  DialogButtons,
} from 'src/gui';
import { screenWidth, screenHeight } from '../screen';
import { defaults } from 'src/core/project';
import Timecode from 'timecode-boss';

let isOpen: boolean = false;

let timecode: Timecode = new Timecode(0, defaults.fps);

hub.on('menu.file.new.project', () => (isOpen = true));

$: descriptor = { ...defaults };

$: windowWidth = 300;
$: windowHeight = 240;

const onClose = () => {
  isOpen = false;
};

const onAccept = () => {
  isOpen = false;
  hub.emit('project.create', descriptor);
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
          bind:value="{descriptor.title}"
          autofocus />
        <Label text="FPS:" /><Spinner
          value="{descriptor.fps}"
          on:change="{e => (descriptor.fps = e.detail)}" />
        <Label text="Dimension:" />
        <div class="dimension">
          <Spinner
            value="{descriptor.width}"
            on:change="{e => (descriptor.width = e.detail)}" />
          <Label text="x" />
          <Spinner
            value="{descriptor.height}"
            on:change="{e => (descriptor.height = e.detail)}" />
        </div>
        <Label text="H:M:S:" />
        <div class="dimension">
          <Spinner
            digitCount="{2}"
            value="{descriptor.duration.hours}"
            on:change="{e => (descriptor.duration.hours = e.detail)}" />
          <Spinner
            digitCount="{2}"
            value="{descriptor.duration.minutes}"
            on:change="{e => (descriptor.duration.minutes = e.detail)}" />
          <Spinner
            digitCount="{2}"
            value="{descriptor.duration.seconds}"
            on:change="{e => (descriptor.duration.seconds = e.detail)}" />
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
