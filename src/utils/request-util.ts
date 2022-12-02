import { doPost } from "./request";

type Step = "encode" | "simulation" | "decode";

const StepUrlMap = {
  encode: "/encode_start",
  simulation: "/simulation_start",
  decode: "/decode_start",
};

export const createAsyncStepRequest = async (
  step: Step,
  requestBody,
  setSpin,
  intervalTime = 5000,
  preFunction = null,
  afterFunction = null
) => {
  preFunction && preFunction();

  const url = StepUrlMap[step];

  setSpin(true);
  const taskId = await doPost(url, { body: requestBody });

  const it = setInterval(async () => {
    const body = { type: step, task_id: taskId };
    console.log(`正在以 ${intervalTime} 毫秒为间隔轮询 /task_status，请求体为`, body);
    const responseBody: any = await doPost("/task_status", { body });
    const { state, result } = responseBody;
    if (state !== "PENDING") {
      clearInterval(it);
      console.log(`轮询 /task_status 结束，得到处理结果 ${result}`);
      afterFunction && afterFunction(result);
      setSpin(false);
    }
  }, intervalTime);
};
