enum Event {
  Project_New = 'projectNew',
  Project_Create = 'projectCreate',
  Project_Init = 'projectInit',
  Project_Save = 'projectSave',
  Project_Save_Begin = 'projectSaveBegin',
  Project_Save_Complete = 'projectSaveComplete',
  Project_Open = 'projectOpen',
  Project_Open_Begin = 'projectOpenBegin',
  Project_Open_Complete = 'projectOpenComplete',
  Transport_Tick = 'transportTick',
  Transport_Start = 'transportStart',
  Transport_Pause = 'transportPause',
  Transport_Resume = 'transportResume',
  Transport_Stop = 'transportStop',
  Transport_FPS_Change = 'transportFPSChange',
}

export default Event;
