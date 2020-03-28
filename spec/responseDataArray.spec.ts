export class ResponseDataArraySpec {
  columns: ResponseDataArraySpecColumn[] = [];
  types = new Map<string, string>();
  names = new Map<string, string>();
  colors = new Map<string, string>();
  meta: ResponseDataArraySpecMeta = new ResponseDataArraySpecMeta();
}

type ResponseDataArraySpecColumn  = Array<string | number>;

class ResponseDataArraySpecMeta {
  channels: number = 0;
  samples: number = 0;
  frequency: number = 0;
  startTime: string = '';
  endTime: string = '';
  recordingLength: string = '';
}