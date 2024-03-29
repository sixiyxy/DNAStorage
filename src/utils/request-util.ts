import { doPost } from "./request";
import { message } from "antd";

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
  // 前置回调
  preFunction && preFunction();

  const url = StepUrlMap[step];

  setSpin(true);
  //首先请求页面主体任务的后端接口，返回一个taskID。此时开启了一个定时器，定时器每隔5s请求一次轮询任务。如果一直没有返回值，则一直请求。
  //如果成功或者出错了，则需要清除循环并且关闭加载页面。如果成功，执行后置回调。

  const taskId = await doPost(url, { body: requestBody });

  const it = setInterval(async () => {
    const body = { type: step, task_id: taskId };
    console.log(`正在以 ${intervalTime} 毫秒为间隔轮询 /task_status，请求体为`, body);
    const responseBody: any = await doPost("/task_status", { body });
    console.log(`本次 /task_status 轮询结束，得到处理结果 `, responseBody);

    const { state, result } = responseBody;

    // 继续轮询
    if (state == "PENDING") {
      return;
    }

    // 出错或成功，都需要清除循环请求并关闭 Spin
    clearInterval(it);
    setSpin(false);

    // 后台接口有误或发生异常
    if (state == "FAILURE") {
      message.error(`${step} failure....`);
      return;
    }

    // 后置回调
    afterFunction && afterFunction(result);
  }, intervalTime);
};
