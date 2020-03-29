export class ResponseDataArraySpec {
  columns: ResponseDataArraySpecColumn[] = [];
  types = new Map<string, string>();
  names = new Map<string, string>();
  colors = new Map<string, string>();
  meta: ResponseDataArraySpecMeta = new ResponseDataArraySpecMeta();
}

export class ResponseDataArraySpecJSON {
  columns: ResponseDataArraySpecColumn[] = [];
  types: DynamicObject = {};
  names: DynamicObject = {};
  colors: DynamicObject = {};
  meta: ResponseDataArraySpecMeta = new ResponseDataArraySpecMeta();

  constructor(
      columns: ResponseDataArraySpecColumn[],
      types: DynamicObject,
      names: DynamicObject,
      colors: DynamicObject,
      meta: ResponseDataArraySpecMeta,
  ) {
    this.columns = columns;
    this.types = types;
    this.names = names;
    this.colors = colors;
    this.meta = meta;
  }
}

type DynamicObject = {
  [key: string]: string;
}

type ResponseDataArraySpecColumn = Array<string | number>;

class ResponseDataArraySpecMeta {
  channels: number = 0;
  samples: number = 0;
  sampleRate: number = 0;
  startTime: Date = new Date();
  endTime: Date = new Date();
  recordingLength: string = '';
}