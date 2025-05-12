export type patchPomodoroReq = {
  executedCycles: [
    {
      workDuration: number;
      breakDuration: number;
    },
  ];
};
